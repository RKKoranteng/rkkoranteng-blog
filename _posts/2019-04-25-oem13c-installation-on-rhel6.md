---
title: 'OEM 13c on RHEL6'
author: Richard Koranteng
date: 2019-04-25 7:00:00 -0600
description: Oracle Enterprise Manager installation on Red Hat Enterprise Linux 6
categories: [Oracle,OEM]
tags: [Oracle,OEM,Monitoring]
img_path: /assets/screenshots/2019-04-25-oem13c-installation-on-rhel6
image:
  path: 2019-04-25-oem13c-installation-on-rhel6.png
  width: 100%
  height: 100%
  alt: oem 13c performance hub
---

This blog describes installation and configuration of Oracle Enterprise Manager (OEM) Cloud Control 13c on RHEL6. The implementation described in this blog is based on a server installation with a minimum resource allocations required by Oracle.

> In this example, I”ve decided to install the Oracle Management Service (OMS) on a separate host than the Oracle Management Repository.
> * Management Repository Host (DB): dbhost
> * Management Service Host (OMS): oemhost
{: .prompt-info }

## Download Softwares
[Download software from OTN](https://www.oracle.com/technetwork/oem/grid-control/downloads/oem-linux64-4956012.html)
* `em13300_linux64.bin`{: .filepath}
* `em13300_linux64-2.zip`{: .filepath}
* `em13300_linux64-3.zip`{: .filepath}
* `em13300_linux64-4.zip`{: .filepath}
* `em13300_linux64-5.zip`{: .filepath}
* `em13300_linux64-6.zip`{: .filepath}

## DB Repo Configuration
OEM needs a database repo. Specifically, OEM 13c needs at least 12.1.0.2 for the repository database. If you need to install and configure a database, check out  my post detailing [Oracle 18c on Red Hat Linux 7](https://rkkoranteng.github.io/richardkoranteng.github.io/posts/oracle-rdbms-18c-silent-installation-on-rhel-7).

Once you’ve provisioned the repository database, run the following SQL commands to set the recommended database instance parameters (you can omit parameters which you’ve already set greater than the recommended minimums).
```sql
ALTER SYSTEM SET "_allow_insert_with_update_check"=TRUE scope=both;
ALTER SYSTEM SET session_cached_cursors=200 scope=spfile;
ALTER SYSTEM SET sga_target= 9184M scope=both;
ALTER SYSTEM SET pga_aggregate_target=3059M scope=both;
```

Restart the repository database after making the instance parameter changes
```sql
shu IMMEDIATE
startup
```

## Pre-Install Tasks on OMS Host
> I completed the following steps on OMS Host (oemhost). All command in this section should be run as root OS user.
> * Ensure the `/etc/hosts`{: .filepath} file contains the IP and FQDN of the server.
> * Ensure the correct hostname in the `/etc/hostname`{: .filepath} file.
{: .prompt-info }

Update UDP and TCP ephemeral port range to a range high enough for anticipated system workloads, and to ensure that the ephemeral port range starts at 11,000 and above.
```bash
echo 11000 65000 > /proc/sys/net/ipv4/ip_local_port_rang
```

Configure IP Tables and kernel parameters
* Update entries to `/etc/sysconfig/iptables`{: .filepath} inorder to allow the port needed for OEM component communication
* Adjust your Linux kernels as needed for your environment by adding the necessary entries and values in the `/etc/sysctl.conf`{: .filepath}
* Reload the updated Linux kernels by running `sysctl -p`

Install the following required OS packages required for RHEL 6.
```bash
yum install -y make-3.81 binutils-2.20 gcc-4.4.4 libaio-0.3.107 glibc-common-2.12-1 libstdc++-4.4.4 libXtst-1.0.99.x86_64 sysstat-9.0.4 glibc-devel-2.12-1.7.i686 glibc-devel-2.12-1.7.x86_64
```

Create the OS users and groups for the OEM software stack
```bash
groupadd oinstall
useradd -g oinstall oracle
```

Ensure `SELINUXTYPE=targeted` is set in `/etc/selinux/config`{: .filepath}

Create software directories as needed. In my case I will simply assign ownership of an entire mountpoint
```bash
chown -R oracle:oinstall /u01
chmod 770 /u01
```

Add the following entry in `/etc/oraInst.loc`{: .filepath}
```bash
inventory_loc=/u01/oraInventory
inst_group=oinstall
```

Change permissions of `/etc/oraInst.loc`{: .filepath} file
```bash
chmod 644 /etc/oraInst.loc
```

## OEM Installation and Configuration on OMS Host
Navigate to software location an invoke the installer and generate the response file you need to use for performing a silent installation. The command generates three response files. You must use only the new_install.rsp file for silent installation. Performed as OEM software owner.
```bash
cd /software_download/em13300_linux64.bin -getResponseFileTemplates -outputLoc /home/oracle/
```

Modify `/home/oracle/new_install.rsp`{: .filepath} as needed. See the contents of the response file used for this installation detailed below:
> Change `putYourPassword` with you own password.
{: .prompt-info }
```bash
RESPONSEFILE_VERSION=2.2.1.0.0 
UNIX_GROUP_NAME=oinstall 
INVENTORY_LOCATION=/u01/oraInventory/ 
SECURITY_UPDATES_VIA_MYORACLESUPPORT=false 
DECLINE_SECURITY_UPDATES=true 
MYORACLESUPPORT_USERNAME= 
MYORACLESUPPORT_PASSWORD= 
INSTALL_UPDATES_SELECTION=skip 
STAGE_LOCATION= 
MYORACLESUPPORT_USERNAME_FOR_SOFTWAREUPDATES= 
MYORACLESUPPORT_PASSWORD_FOR_SOFTWAREUPDATES= 
PROXY_USER= 
PROXY_PWD= 
PROXY_HOST= 
PROXY_PORT= 
ORACLE_MIDDLEWARE_HOME_LOCATION=/u01/oms13c/middleware 
ORACLE_HOSTNAME=oemhost.local 
AGENT_BASE_DIR=/u01/oms13c/agent13c 
WLS_ADMIN_SERVER_USERNAME=weblogic 
WLS_ADMIN_SERVER_PASSWORD=putYourPassword 
WLS_ADMIN_SERVER_CONFIRM_PASSWORD=putYourPassword 
NODE_MANAGER_PASSWORD=putYourPassword 
NODE_MANAGER_CONFIRM_PASSWORD=putYourPassword 
ORACLE_INSTANCE_HOME_LOCATION=/u01/oms13c/gc_inst 
CONFIGURE_ORACLE_SOFTWARE_LIBRARY=true 
SOFTWARE_LIBRARY_LOCATION=/u01/oms13c/swlib 
DATABASE_HOSTNAME=dbhost.local 
LISTENER_PORT=1521 
SERVICENAME_OR_SID=testdb 
SYS_PASSWORD=putYourPassword 
SYSMAN_PASSWORD=putYourPassword 
SYSMAN_CONFIRM_PASSWORD=putYourPassword 
DEPLOYMENT_SIZE=MEDIUM 
MANAGEMENT_TABLESPACE_LOCATION=+DATA 
CONFIGURATION_DATA_TABLESPACE_LOCATION=+DATA 
JVM_DIAGNOSTICS_TABLESPACE_LOCATION=+DATA 
AGENT_REGISTRATION_PASSWORD=putYourPassword 
AGENT_REGISTRATION_CONFIRM_PASSWORD=putYourPassword 
STATIC_PORTS_FILE= 
PLUGIN_SELECTION={} 
b_upgrade=false 
EM_INSTALL_TYPE=NOSEED 
CONFIGURATION_TYPE=ADVANCED 
CONFIGURE_SHARED_LOCATION_BIP=false 
CONFIG_LOCATION= 
CLUSTER_LOCATION=
```

Invoke installer using the command below
```bash
/software_download/em13300_linux64.bin -silent -responseFile /home/oracle/new_install.rsp -invPtrLoc /etc/oraInst.loc
```

## Post-Install tasks on OMS Host
Run the following configuration scripts (`/u01/oms13c/middleware/allroot.sh`{: .filepath}) as the root user.
```bash
/u01/oms13c/middleware/allroot.sh
```

Check the status of the agent.
```bash
/u01/oms13c/middleware/emctl status oms -details
```

Navigate to `https://<oms_host_name>:<console_port>/em` to see login page for OEM 13c
![OEM 13c Login Page](oem13c-login-page.jpg){: .shadow }{: .light }
![OEM 13c Login Page](oem13c-login-page.jpg){: .shadow }{: .dark }
_oem 13c login page_
