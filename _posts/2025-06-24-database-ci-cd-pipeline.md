---
title: 'Self-service CI/CD pipeline for database deployments with Liquibase & Azure DevOps'
author: Richard Koranteng
date: 2025-06-24 07:00:00 -0600
description: Self-service CI/CD pipeline for Oracle database deployments with Liquibase & Azure DevOps
categories: [Projects,DevOps]
tags: [Liquibase, Azure DevOps]
img_path: /assets/screenshots/2025-06-24-database-ci-cd-pipeline
image:
  path: ado-liquibase-pipeline.png
  width: 100%
  height: 100%
  alt: Azure DevOps Continous Deployment pipeline for database releases
---

## Problem
I recently worked with a customer who struggled to promote database changes to production quickly and safely. Their changes often remained locked in manual processes, isolated from modern CI/CD practices.

## Impact
This gap caused to:

- Delays in delivering new features
- Increased risk of human error in production deployments
- A disconnect between dev and ops teams

## Solution
Here's a better way - something secure, automated, and developer-friendly. I developed an <a href="https://github.com/RKKoranteng/liquibase-project" target="_blank">Azure DevOps CI/CD pipeline for database deployments</a> that:

- Validates database changes using Liquibase
- Automates deployments to Dev, Staging, and Production
- Enforces approval gates and rollback previews
- Promotes changes safely to production
- Requires no DBA intervention for routine changes

Continous Integration pipeline
```text
📦 CI Pipeline (validate code and package)
│
├── Validate Changelog
├── Show Pending Changes
├── Generate SQL Preview
├── Generate Rollback SQL
├── Deploy to Dev
├── Tag Database
├── Geberate Build Metadat
├── Build Artifacts
└── Publish Artifact:
    ├── changelog.xml
    ├── /scripts/*.sql
    ├── update-preview.sql
    ├── rollback-preview.sql
    ├── version.txt
    └── liquibase.properties (optional)
```

Continuos Deploymeny pipeline
```text
🚀 CD Pipeline (test code ande promote to prod)
│
├── Triggered by CI
├── Downloads CI artifact
├── Deploys to staging/prod using changelog
└── References version/tag for auditing
```

> While continuous deployment (CD) offers significant advantages; speed, automation, and reduced manual effort - it may not be the ideal approach for all environments or organizations, especially when it comes to database deployments. ⚠️
{: .prompt-info }

## Outcome
Implementing this solution allows:

- Developers to commit database changes and see them deployed to Dev within minutes
- Promotion to Production is fully automated but gated for approvals
- Dev and Ops teams have visibility and traceability of every change
- DBAs are no longer bottlenecks - we're enablers of innovation
- The business can respond faster to customer needs and market changes

## Summary
By automating database deployments through a self-service CI/CD pipeline, developers are empowered to safely deliver changes without waiting on manual DBA intervention. This accelerates release cycles, reduces downtime, and improves team productivity. leading to faster time-to-market.

> Faster time-to-market directly aligns with a stronger return on investment (ROI) for every development effort
{: .prompt-tip }