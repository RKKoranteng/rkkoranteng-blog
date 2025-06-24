---
title: 'Oracle 18c GI & RDMS on RHEL7'
author: Richard Koranteng
date: 2019-03-24 7:00:00 -0600
description: Silent installation of Oracle 18c Grid Infrastructure and Database on Red Hat Enterprise Linux 7
categories: [Oracle,Database]
tags: [Oracle,Database,Grid Infrastructure,ASM]
img_path: /assets/screenshots/2019-03-24-oracle-rdbms-18c-silent-installation-on-rhel-7
image:
  path: 2019-03-24-oracle-rdbms-18c-silent-installation-on-rhel-7.png
  width: 100%
  height: 100%
  alt: oracle rdbms 18c silent install
---

This post describes silent installation and configuration of Grid Infrastructure 18c (64bit) and Oracle Database 18c (64bit) on RHEL 7. The implementation described in this blog is based on a server installation with a minimum resource allocations required by Oracle.

## Download Softwares
[Download software from OTN](https://www.oracle.com/technetwork/database/enterprise-edition/downloads/oracle18c-linux-180000-5022980.html)
* Database 18c (18.3) for Linux x86-64 (`LINUX.X64_180000_db_home.zip`{: .filepath})
* Grid Infrastructure (18.3) for Linux x86-64 (`LINUX.X64_180000_grid_home.zip`{: .filepath})

## Pre-Install Tasks
> * Pre-install tasks are performed as root OS user
> * Oracle recommends that you disable THP on all Oracle Database servers and rather use standard HugePages for enhanced performance. For Oracle Linux 7 and later, and Red Hat Enterprise Linux 7 and later, add `transparent_hugepage=never` in the `/etc/default/grub file`{: .filepath}.
> * Ensure the `/etc/hosts`{: .filepath} file to contain the IP and FQDN of the server. 
> * Ensure the correct hostname in the `/etc/hostname`{: .filepath} file
{: .prompt-info }

Identify your ASM disk by adding them to the to `/etc/udev/rules.d/97-oracleasm.rules`{: .filepath}. It should look like this:
```bash
OWNER="grid", GROUP="asmadmin", MODE="0660", ENV{DEVTYPE}=="disk", KERNEL=="xvdca", SYMLINK+="oracleasm/disks/DATA1"
OWNER="grid", GROUP="asmadmin", MODE="0660", ENV{DEVTYPE}=="disk", KERNEL=="xvdcb", SYMLINK+="oracleasm/disks/FRA1"
```

Reload udev rules
```bash
udevadm control --reload-rules
udevadm trigger
```

Run the following command to initialize ASM disks
```bash
for dsk in `ls /dev/oracleasm/disks/*`; do echo 'initializing ',${dsk}; dd if=/dev/zero of=${dsk} bs=4096 count=1; done
```

Adjust your Linux kernels as needed for your environment by adding the necessary entries and values in the `/etc/sysctl.conf`{: .filepath}. Reload the updated Linux kernels by running the following command:
```bash
sysctl -p
```

Adjust system resources available to oracle and grid OS user process by adding the necessary enrties and values in the `/etc/security/limits.d/oracle-database-preinstall-18c.conf`{: .filepath}.

Install the following required OS packages required for RHEL 7.
```bash
yum install -y bc binutils compat-libcap1 compat-libstdc++-33 compat-libstdc++-33.i686 elfutils-libelf.i686 elfutils-libelf elfutils-libelf-devel.i686 elfutils-libelf-devel fontconfig-devel glibc.i686 glibc glibc-devel.i686 glibc-devel ksh libaio.i686 libaio libaio-devel.i686 libaio-devel libX11.i686 libX11 libXau.i686 libXau libXi.i686 libXi libXtst.i686 libXtst libgcc.i686 libgcc librdmacm-devel libstdc++.i686 libstdc++ libstdc++-devel.i686 libstdc++-devel libxcb.i686 libxcb make nfs-utils net-tools python python-configshell python-rtslib python-six smartmontools sysstat targetcli unixODBC
```

Create the OS users and groups for the Oracle software stack
```bash
groupadd oinstall
groupadd dba
groupadd bckpdba
groupadd dgdba
groupadd kmdba
groupadd asmoper
groupadd asmadmin
groupadd asmdba
useradd -g oinstall -G dba,bckpdba,dgdba,kmdba,asmoper,asmadmin oracle
useradd -g oinstall -G dba,asmoper,asmadmin grid
```

Ensure secure Linux is set to `targeted` in `/etc/selinux/config`{: .filepath}
```bash
SELINUX= can take one of these three values:
 enforcing - SELinux security policy is enforced.
 permissive - SELinux prints warnings instead of enforcing.
 disabled - No SELinux policy is loaded.
 SELINUX=enforcing
 SELINUXTYPE= can take one of three two values:
 targeted - Targeted processes are protected,
 minimum - Modification of targeted policy. Only selected processes are protected.
 mls - Multi Level Security protection.
 SELINUXTYPE=targeted
```

Create software directories as needed. In my case I will simply assign ownership of an entire mountpoint
```bash
mkdir /u01
chown -R oracle:oinstall /u01
chmod 770 /u01
```

## Grid Infrastructure Installation & Configuration Tasks
> GI installation tasks are performed as grid OS user
{: .prompt-info }

Add the following lines to the `/home/grid/.bash_profile`{: .filepath}
```bash
ORACLE_BASE=/u01/grid/base; export ORACLE_BASE
GRID_HOME=/u01/grid/home; export GRID_HOME
ORACLE_HOME=$GRID_HOME; export ORACLE_HOME
ORACLE_SID=+ASM; export ORACLE_SID
PATH=$PATH:$ORACLE_HOME/bin:$ORACLE_HOME/OPatch; export PATH
```

Source the grid OS user profile
```bash
source ~/.bash_profile
```

Add the following lines in `/home/grid/gi_soft.rsp`{: .filepath} in-order to create the response file for silent software installation.
```bash
oracle.install.responseFileVersion=/oracle/install/rspfmt_crsinstall_response_schema_v18.0.0 INVENTORY_LOCATION=/u01/oraInventory oracle.install.option=HA_CONFIG ORACLE_BASE=/u01/grid/base oracle.install.asm.OSDBA=oinstall oracle.install.asm.OSASM=asmadmin oracle.install.asm.storageOption=ASM oracle.install.asm.SYSASMPassword=putYourPassword oracle.install.asm.diskGroup.name=DATA oracle.install.asm.diskGroup.redundancy=EXTERNAL oracle.install.asm.diskGroup.disks=/dev/oracleasm/disks/DATA1,/dev/oracleasm/disks/FRA1 oracle.install.asm.diskGroup.diskDiscoveryString=/dev/oracleasm/disks/* oracle.install.asm.monitorPassword=putYourPassword oracle.install.asm.configureAFD=false
```

Unzip GI 18c software
```bash
mkdir -p /u01/grid/home
unzip /software_download/LINUX.X64_180000_grid_home.zip -d /u01/grid/home
```

Invoke OUI silent installation
```bash
/u01/grid/home/gridSetup.sh -silent -responseFile /home/grid/gi_soft.rsp
```

Open another terminal, then run the post install scripts below as root OS user
```bash
/u01/oraInventory/orainstRoot.sh
/u01/grid/home/root.sh[
```

Run the following command to complete GI configuration
```bash
/u01/grid/home/gridSetup.sh -executeConfigTools -responseFile /home/grid/gi_soft.rsp -silent
```

Confirm +ASM instance is running
```bash
ps -ef | grep smon
```

Confirm +DATA diskgroup is created
```bash
asmcmd lsdg
```

Create remaining ASM diskgroups that will be used by the database
```bash
asmca -silent -createDiskGroup -diskString '/dev/oracleasm/disks/*' -diskGroupName FRA -disk '/dev/oracleasm/disks/FRA*' -redundancy EXTERNAL -au_size 4
```

## Database Installation and Configuration Tasks
> DB installation tasks are performed as oracle OS user
{: .prompt-info }

Add the following lines to the `/home/oracle/.bash_profile`{: .filepath}
```bash
ORACLE_BASE=/u01/app; export ORACLE_BASE
ORACLE_HOME=/u01/app/18R3; export ORACLE_HOME
export ORACLE_SID=testdb
PATH=$PATH:$ORACLE_HOME/bin:$ORACLE_HOME/OPatch; export PATH
```

Source the profile
```bash
source ~/.bash_profile
```

Add the following lines in `/home/oracle/db_soft_only.rsp`{: .filepath} in-order to create the response file for silent software only installation
```bash
oracle.install.responseFileVersion=/oracle/install/rspfmt_dbinstall_response_schema_v18.0.0 oracle.install.option=INSTALL_DB_SWONLY UNIX_GROUP_NAME=oinstall INVENTORY_LOCATION=/u01/oraInventory ORACLE_HOME=/u01/app/18R3 ORACLE_BASE=/u01/app oracle.install.db.InstallEdition=EE oracle.install.db.OSDBA_GROUP=dba oracle.install.db.OSOPER_GROUP=dba oracle.install.db.OSBACKUPDBA_GROUP=bckpdba oracle.install.db.OSDGDBA_GROUP=dgdba oracle.install.db.OSKMDBA_GROUP=kmdba oracle.install.db.OSRACDBA_GROUP=dba SECURITY_UPDATES_VIA_MYORACLESUPPORT=false DECLINE_SECURITY_UPDATES=true oracle.installer.autoupdates.option=SKIP_UPDATES
```

Unzip oracle Database 18c software
```bash
unzip /software_download/LINUX.X64_180000_db_home.zip -d /u01/app/18R3
```

Invoke OUI silent installation
```bash
u01/app/18R3/runInstaller -silent -responseFile ~/db_soft_only.rsp
```

Upon installation completion, execute the post installation scripts
```bash
/u01/app/18R3/root.sh
```

Use the command below to create a general purpose transaction database
```bash
dbca -silent -createDatabase -templateName General_Purpose.dbc -gdbName $ORACLE_SID -sid $ORACLE_SID -sysPassword putYOURPASSWORD -systemPassword putYOURPASSWORD -storageType ASM -diskGroupName +DATA -recoveryGroupName +FRA -responseFile NO_VALUE -createAsContainerDatabase false -characterSet AL32UTF8 -nationalCharacterSet AL16UTF16 -archiveLogMode true -databaseType MULTIPURPOSE -emConfiguration NONE
```

Confirm database instance is running
```bash
ps -ef | grep smon
```

Confirm database is open
```sql
select open_mode from v$database;
```
