---
title: 'Disable THP on RHEL7'
author: Richard Koranteng
date: 2019-04-16 7:00:00 -0600
description: Disable Transparent Huge Pages on Red Hat Enterprise Linux 7
categories: [Oracle,Database]
tags: [Oracle,Database,HugePages,RHEL]
img_path: /assets/screenshots/2019-04-16-disable-thp-rhel7
image:
  path: 2019-04-16-disable-thp-rhel7.png
  width: 100%
  height: 100%
  alt: disable thp on rhel7
---

Transparent HugePages (THP) memory is different from standard HugePages memory because the kernel thread allocates memory dynamically during runtime. Standard HugePages memory is pre-allocated at startup, and does not change during runtime. This dynamic memory allocation of THP can cause memory allocation delays during runtime. To avoid performance issues, Oracle recommends that you disable THP on all Oracle Database servers. Oracle recommends that you instead use standard HugePages for enhanced performance.

> * The following implementation task is performed as root Os user
> * The following implementation requires a server reboot
{: .prompt-info }

## 1. Check Current THP Status
If Transparent Huge Pages is set to `[always]`, it means that it's enabled. Run the following command to confirm:
```bash
cat /sys/kernel/mm/transparent_hugepage/enabled
```

## 2. Disable THP
Disable transparent huge pages persistently across reboots by appending the `GRUB_CMDLINE_LINUX` (kernel boot command line) within the `/etc/default/grub`{: .filepath} with “transparent_hugepage=never”. Refer to the example below:
```bash
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"
GRUB_DEFAULT=saved
GRUB_DISABLE_SUBMENU=true
GRUB_TERMINAL_OUTPUT="console"
GRUB_CMDLINE_LINUX="rd.lvm.lv=myvg/swap rd.lvm.lv=myvg/usr vconsole.font=latarcyrheb-sun16 rd.lvm.lv=myvg/root crashkernel=auto vconsole.keymap=us rhgb quiet transparent_hugepage=never"
GRUB_DISABLE_RECOVERY="true"
```

## 3. Source Grub Changes
For the grub changes to take effect, run the following command: 
```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
```

## 4. Reboot Host And Confirm
Reboot the server. After reboot, verify that THP is now disabled (`[never]`) via the following command:
```bash
cat /sys/kernel/mm/transparent_hugepage/enabled
```
