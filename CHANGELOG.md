# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Calendar Versioning](https://calver.org/) (YYYY.MM.DD).

## [Unreleased]

### Changed
- Replaced the cloud database migration offering with Agile transformation for database teams

## [2026.10.09]

### Changed
- Headshot on the home and about pages is hidden on mobile

## [2026.10.08]

### Added
- Consulting-focused home page and services page (advisory, consulting, coaching, fractional)
- Copyright and disclaimer page, privacy policy page
- RK monogram favicon, light/dark theme toggle, blog topic filter
- Workflow that dates Unreleased changelog entries automatically on merge to main

### Changed
- Rebuilt the site as plain HTML/CSS/JS with no build step; posts keep their `/posts/<slug>/` URLs
- Deploy workflow publishes the repo root to GitHub Pages
- Split license: content all rights reserved, code MIT
- RSS link moved from the footer to the blog page
- README trimmed and updated for the static site
- Changelog converted to the Keep a Changelog format

### Removed
- Jekyll and Chirpy theme source, gem/npm files, and unused theme assets

## [2026.08.01]

### Changed
- Simplified changelog cadence
- README updated with details about the site (inspired by JoshOps)
- CNAME points the site to rkkoranteng.com

### Fixed
- GitHub Pages redirect to rkkoranteng.com

## [2026.07.29]

### Added
- Changelog to document notable changes to the repository

### Changed
- Category and tag taxonomy to streamline post metadata management
