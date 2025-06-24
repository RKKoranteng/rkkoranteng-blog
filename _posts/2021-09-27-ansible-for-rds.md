---
title: 'Simple Ansible Playbook to Create RDS Instance'
author: Richard Koranteng
date: 2021-09-27 7:00:00 -0600
description: Simple Ansible Playbook to Create RDS Instance
categories: [Automation,Ansible]
tags: [Automation,Ansible,IaC,AWS,RDS]
img_path: /assets/screenshots/2021-09-27-ansible-for-rds
image:
  path: 2021-09-27-ansible-for-rds.png
  width: 100%
  height: 100%
  alt: ansbible playbook for rds
---

Create an Oracle RDS database in AWS within minutes by automating the entire provisioning process using [Ansible](https://www.ansible.com/).
For this demo I’m running Ansible (2.9.2) and the latest version of AWS CLI on RHEL8.

## Pre-reqs
1. [Install Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)

2. Install the latest version of the AWS CLI
```bash
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
```

3. Configure credentials by adding keys to the credentials file `~/.aws/credentials`{: .filepath}
```bash
[default]
 aws_access_key_id=<put access key here>
 aws_secret_access_key=<put secret access key here>
```

> Note: boto is required for the Ansible modules. Ansible uses python libraries in the backend, so you need to install the boto on your system. Use the below command to download the boto module.
{: .prompt-info }

```bash
pip3 install boto
```

## Create Ansible Playbook
Create an empty file called `create-rds-oracle.yml`{: .filepath}, then copy the content below into the playbook. Modify the playbook to fit your specs.
```yml
- name: create-oracle-rds
  hosts: localhost
  connection: local
  gather_facts : false
  tasks:
    - name: provision oracle rds intance
      rds:
        command: create
        region: us-east-1
        instance_name: orards
        db_engine: oracle-se2
        size: "10"
        instance_type: db.m5.large
        license_model: bring-your-own-license
        username: master
        password: "your-password"
        tags:
          environment: test
```

## Run Ansible Playbook
Create the Oracle RDS instance by running the playbook. Use the command below.
```bash
ansible-playbook create-rds-oracle.yml
```

A new RDS instance should be created. It should look something like this in AWS Console.
![Simple Ansible Playbook to Create RDS Instance](ansible-create-rds.png){: .shadow }{: .light }
![Simple Ansible Playbook to Create RDS Instance](ansible-create-rds.png){: .shadow }{: .dark }
_Auto-magically spun-up RDS instance_
