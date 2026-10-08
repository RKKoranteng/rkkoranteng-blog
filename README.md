# rkkoranteng.com

Source for [rkkoranteng.com](https://rkkoranteng.com): database engineering consulting
(advisory, consulting, coaching, fractional) and a blog on database automation, DevOps, and cloud.

## How the site works

Plain HTML, CSS, and JavaScript, with no build step. Every push to `main` publishes the repo
root to GitHub Pages via [`pages.yml`](.github/workflows/pages.yml).

* `assets/css/style.css`: all styles (light and dark themes)
* `assets/js/main.js`: theme toggle, mobile menu, copy buttons, blog filter, table of contents
* `posts/<slug>/index.html`: one folder per post, with images in `assets/screenshots/<post>/`

Preview locally with any static server, e.g. `python -m http.server 8080`.

## Adding a post

1. Copy a folder in `posts/` to `posts/<new-slug>/` and edit its `index.html`.
2. Add it to `blog/index.html` and, if it's among the latest three, to `index.html`.
3. Add an `<entry>` to `feed.xml` and a `<url>` to `sitemap.xml`.
4. Update the Older/Newer links on the neighboring post.

## Changelog and license

Notable changes are in [CHANGELOG](CHANGELOG.md). Add entries under `## [Unreleased]`; when they
reach `main`, [`changelog.yml`](.github/workflows/changelog.yml) moves them to a release dated that day.

Content is © Richard Koranteng, all rights reserved, and code is MIT licensed. See [LICENSE](LICENSE).
