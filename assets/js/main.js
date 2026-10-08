(function () {
  'use strict';

  var root = document.documentElement;

  // ---------- Theme toggle ----------
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  // ---------- Footer year ----------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Mobile nav ----------
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  if (header && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ---------- Copy buttons on code blocks ----------
  document.querySelectorAll('.code-block').forEach(function (block) {
    var pre = block.querySelector('pre');
    if (!pre || !navigator.clipboard) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(pre.innerText).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
    block.appendChild(btn);
  });

  // ---------- Blog tag filter ----------
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var posts = document.querySelectorAll('[data-tags]');
    var years = document.querySelectorAll('.year-group');

    var applyFilter = function (tag) {
      filterBar.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.tag === tag));
      });
      posts.forEach(function (p) {
        var tags = p.dataset.tags.split('|');
        p.hidden = tag !== 'all' && tags.indexOf(tag) === -1;
      });
      years.forEach(function (g) {
        g.hidden = !g.querySelector('[data-tags]:not([hidden])');
      });
      var url = new URL(window.location.href);
      if (tag === 'all') url.searchParams.delete('tag'); else url.searchParams.set('tag', tag);
      history.replaceState(null, '', url);
    };

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (btn) applyFilter(btn.dataset.tag);
    });

    var initial = new URLSearchParams(window.location.search).get('tag');
    if (initial && filterBar.querySelector('[data-tag="' + CSS.escape(initial) + '"]')) {
      applyFilter(initial);
    }
  }

  // ---------- Table of contents highlighting ----------
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          var link = byId[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
