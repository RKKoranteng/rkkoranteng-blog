# rkkoranteng.com

## Overview

A DBA Blog - Blogging about modern DBA practices, tips, scripts, and my continuous improvement Database Engineering journey. 

[**rkkoranteng.com**](https://rkkoranteng.com)

## Changelog

All notable changes to this project will be documented in the [CHANGELOG](CHANGELOG.md)

This project adheres to [Calendar Versioning](https://calver.org/).

## How the site works

Plain HTML, CSS, and JavaScript. No build step. Every push to `main` publishes the repo root to GitHub Pages via [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

* `assets/css/style.css` - all styles (light and dark themes)
* `assets/js/main.js` - theme toggle, mobile menu, code copy buttons, blog filter, table of contents
* `posts/<slug>/index.html` - one folder per post
* `assets/screenshots/<post>/` - post images

Preview locally from the repo root with any static server, e.g. `python -m http.server 8080` or `npx serve`.

## Adding a post

1. Copy an existing folder in `posts/` to `posts/<new-slug>/` and edit its `index.html` (title, description, canonical URL, date, content).
2. Add the post to `blog/index.html` and, if it's one of the latest three, to the "Recent writing" list in `index.html`.
3. Add an `<entry>` to `feed.xml` and a `<url>` to `sitemap.xml`.
4. Update the Older/Newer links at the bottom of the neighboring post.

## License

Site content (writing, images, branding) is © Richard Koranteng, all rights reserved. Code (CSS, JS, workflows, and code samples in posts) is MIT licensed. See [LICENSE](LICENSE).
