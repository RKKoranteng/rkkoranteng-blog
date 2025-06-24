---
title: 'Liquibase Checksum Error'
author: Richard Koranteng
date: 2025-03-09 21:23:00 -0600
description: liquibase validation failed with checksum error
categories: [CI/CD,Liquibase]
tags: [error]
img_path: /assets/screenshots/2025-03-09-liquibase-checksum-error
image:
  path: 2025-03-09-liquibase-checksum-error.png
  width: 100%
  height: 100%
  alt: liquibase validation failed
---

## Overview
I've been hitting this Liquibase checksum validation error more frequently in a specific daatabase. Here's what I found out. Liquibase checksum validation errors occur when Liquibase detects that a previously applied changeset has been modified. Liquibase calculates a checksum (a hash) for each changeset and stores it in the DATABASECHANGELOG table. 

When running updates, it recalculates the checksum and compares it to the stored value. If they don’t match, Liquibase throws a checksum validation error to prevent accidental or unintended changes. 

Here's a snippet of the error.

```
####################################################
##   _     _             _ _                      ##
##  | |   (_)           (_) |                     ##
##  | |    _  __ _ _   _ _| |__   __ _ ___  ___   ##
##  | |   | |/ _` | | | | | '_ \ / _` / __|/ _ \  ##
##  | |___| | (_| | |_| | | |_) | (_| \__ \  __/  ##
##  \_____/_|\__, |\__,_|_|_.__/ \__,_|___/\___|  ##
##              | |                               ##
##              |_|                               ##
##                                                ## 
##  Get documentation at docs.liquibase.com       ##
##  Get certified courses at learn.liquibase.com  ## 
##  Free schema change activity reports at        ##
##      https://hub.liquibase.com                 ##
##                                                ##
####################################################
Starting Liquibase at 09:19:22 (version 4.6.2 #886 built at 2021-11-30 16:20+0000)
Liquibase Version: 4.6.2
Liquibase Community 4.6.2 by Liquibase
[2025-03-06 09:19:32] SEVERE [liquibase.integration] Validation Failed:
     1 change sets check sum
          dbchangelog.xml::stproc_modern_db_proj::Richard Koranteng was: 8:70816a61e1809ebe7c21e8f211a40726 but is now: 8:9328211bd7605a32a936bfe949554e5f

liquibase.exception.CommandExecutionException: liquibase.exception.LiquibaseException: Unexpected error running Liquibase: Validation Failed:
     1 change sets check sum
          dbchangelog.xml::stproc_modern_db_proj::Richard Koranteng was: 8:70816a61e1809ebe7c21e8f211a40726 but is now: 8:9328211bd7605a32a936bfe949554e5f

```

## Common Causes of Checksum Validation Error

#### 1. Manual Changes to the Changeset
If you modify an already executed changeset (e.g., adding/removing columns, changing SQL statements), the checksum changes.

#### 2. Changes in Formatting or Whitespace
Some formatting changes, even if they don’t affect SQL execution, can alter the checksum.

#### 3. Environment Differences
Differences in line endings (Windows vs. Linux) or character encodings can sometimes lead to checksum mismatches.

#### 4. Upgrading Liquibase Versions
Some versions of Liquibase may generate different checksums for the same changeset due to internal updates.

## Solution
I initially tried to clear the checksum by running the following command, but I hit the error again after a few weeks.
```sh
liquibase --url=jdbc:sqlserver://testsrv:1433;databaseName=testdb;encrypt=true;trustServerCertificate=true; --username=liquibase --password=**** clear-checksums
```

I eventually ended up manually updating the `DATABASECHANGELOG` table. I'm confident about the change so I was ok with updating the checksum in the DATABASECHANGELOG table. 

Example:
```sql
UPDATE DATABASECHANGELOG 
SET MD5SUM = 'new-checksum' 
WHERE ID = 'your_changeset_id' AND AUTHOR = 'your_author';
```
