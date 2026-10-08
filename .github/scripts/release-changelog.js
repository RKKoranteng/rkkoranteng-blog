#!/usr/bin/env node
// Move entries under "## [Unreleased]" in CHANGELOG.md to a release dated today.
//
// Usage: node release-changelog.js [path] [YYYY.MM.DD]
// Prints the release date if anything was released, nothing otherwise.
// If a release for today already exists, the new entries are merged into it.
'use strict';

const fs = require('fs');

const path = process.argv[2] || 'CHANGELOG.md';
const TIMEZONE = 'America/New_York';
const GROUP_ORDER = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];
const RELEASE_HEADING = /^## \[/;

function today() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date());
  const get = type => parts.find(p => p.type === type).value;
  return `${get('year')}.${get('month')}.${get('day')}`;
}

// { group: [entry lines] } for a release body. Ungrouped entries go under Changed.
function parseGroups(lines) {
  const groups = new Map();
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^###\s+(.+?)\s*$/);
    if (heading) {
      current = heading[1];
      if (!groups.has(current)) groups.set(current, []);
    } else if (line.trim()) {
      const name = current || 'Changed';
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(line.trimEnd());
    }
  }
  for (const [name, items] of groups) if (!items.length) groups.delete(name);
  return groups;
}

function renderGroups(groups) {
  const names = [...GROUP_ORDER.filter(g => groups.has(g)), ...[...groups.keys()].filter(g => !GROUP_ORDER.includes(g))];
  return names.flatMap(name => [`### ${name}`, ...groups.get(name), '']);
}

// Index of the next "## [" heading after start, or lines.length.
function nextRelease(lines, start) {
  for (let i = start + 1; i < lines.length; i++) if (RELEASE_HEADING.test(lines[i])) return i;
  return lines.length;
}

const lines = fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n').split('\n');
const unreleased = lines.findIndex(l => /^## \[Unreleased\]/i.test(l));
if (unreleased === -1) {
  console.error(`No "## [Unreleased]" heading found in ${path}`);
  process.exit(1);
}

const bodyEnd = nextRelease(lines, unreleased);
const fresh = parseGroups(lines.slice(unreleased + 1, bodyEnd));
if (!fresh.size) process.exit(0);

const date = process.argv[3] || today();
let rest = lines.slice(bodyEnd);

// Same-day release already exists: merge the new entries into it (newest first).
if (rest.length && rest[0].trim() === `## [${date}]`) {
  const existingEnd = nextRelease(rest, 0);
  for (const [name, items] of parseGroups(rest.slice(1, existingEnd))) {
    fresh.set(name, [...(fresh.get(name) || []), ...items]);
  }
  rest = rest.slice(existingEnd);
}

const output = [...lines.slice(0, unreleased + 1), '', `## [${date}]`, '', ...renderGroups(fresh), ...rest];
fs.writeFileSync(path, output.join('\n').replace(/\n+$/, '') + '\n');
console.log(date);
