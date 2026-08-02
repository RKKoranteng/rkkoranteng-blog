---
title: 'Vagrant Up Throws Undefined Method Error'
author: Richard Koranteng
date: 2026-01-21 15:00:00 -0600
description: undefined method `exists?' for class File (NoMethodError)
categories: [Issues, Vagrant]
tags: [Vagrant, VirtualBox]
img_path: /assets/screenshots
image:
  path: vagrant.png
  width: 100%
  height: 100%
  alt: Vagrant Up throws NoMethodError
---

## Issue:
Seeing the following error when running 'vagrant up' on single-instance oracle vagrant file

```text
undefined method `exists?' for class File (NoMethodError)
```

## Cause:
Small but critical Ruby API change. Ruby’s `File.exists?` method has been deprecated for years and was removed in Ruby 3.2+.

✅ Correct method:
```ruby
File.exist?
```

❌ But the `vagrant-vbguest` plugin being used is calling the old method:
```ruby
File.exists? 
```

So the plugin fails when it tries to check for a file.

## Solution:
Manually patch the line that throws the error:

1. open the file
```swift
C:/Users/your_user/.vagrant.d/gems/3.3.8/gems/vagrant-vbguest-0.32.0/lib/vagrant-vbguest/hosts/virtualbox.rb
```

2. Find and change line 84
```diff
- path && File.exists?(path)
+ path && File.exist?(path)
```

3. Save the file and rerun `vagrant up`.