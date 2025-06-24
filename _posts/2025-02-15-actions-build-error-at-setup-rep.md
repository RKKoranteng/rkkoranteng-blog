---
title: 'Build Error at Setup Ruby Atage of Build and Deploy on Actions'
author: Richard Koranteng
date: 2025-02-15 15:00:00 -0600
description: github actions build error due to old ruby version
categories: [GitHub,Actions]
tags: [error]
img_path: /assets/screenshots/errors
image:
  path: 2025-02-15-actions-build-error.png
  width: 100%
  height: 100%
  alt: github actions build error
---

## Issue
I recently tried to push updates to my GitHub Pages hosted site (powered by Jekyll Theme) and got the following error at the 'Build' stage.
```
Run ruby/setup-ruby@8575951200e472d5f2d95c625da0c7bec8217c42
  with:
    ruby-version: 3.1
    bundler-cache: true
    cache-version: 0
Error: The current runner (ubuntu-24.04-x64) was detected as self-hosted because the platform does not match a GitHub-hosted runner image (or that image is deprecated and no longer supported).
In such a case, you should install Ruby in the $RUNNER_TOOL_CACHE yourself, for example using https://github.com/rbenv/ruby-build
You can take inspiration from this workflow for more details: https://github.com/ruby/ruby-builder/blob/master/.github/workflows/build.yml
$ ruby-build 3.1.4 /opt/hostedtoolcache/Ruby/3.1.4/x64
Once that completes successfully, mark it as complete with:
$ touch /opt/hostedtoolcache/Ruby/3.1.4/x64.complete
It is your responsibility to ensure installing Ruby like that is not done in parallel.
```

## Cause
[#596](https://github.com/ruby/setup-ruby/pull/596) was released in [https://github.com/ruby/setup-ruby/releases/tag/v1.177.0](https://github.com/ruby/setup-ruby/releases/tag/v1.177.0)

My workflow is using older version.

Example:
```yml
uses: ruby/setup-ruby@8575951200e472d5f2d95c625da0c7bec8217c42 # v1.161.0
```

## Solution
I updated to newer Ruby version:

Example:
```yml
uses: ruby/setup-ruby@086ffb1a2090c870a3f881cc91ea83aa4243d408 # v1.195.0
```

[See my workflow after the change](https://github.com/RKKoranteng/blog/blob/main/.github/workflows/jekyll.yml#L37)