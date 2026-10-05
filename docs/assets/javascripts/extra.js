#!/usr/bin/env python3
"""Front-end enhancements for A Web3 Learning Wiki.

Deliberately dependency-free and framework-agnostic: this file is loaded as-is
by Material's `extra_javascript`, and every behaviour here degrades gracefully
when JS is unavailable.
"""

(function () {
  "use strict";

  // ---------------------------------------------------------------- helpers
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Material's instant navigation swaps the DOM without a full reload, so hook
  // both the native lifecycle event and document$'s observable.
  function eachPage(fn) {
    onReady(fn);
    if (typeof document$ !== "undefined" && document$.subscribe) {
      document$.subscribe(fn);
    }
  }

  var ICONS = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    github: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  // ------------------------------------------------------- reading progress
  var progress = null;
  function initProgress() {
    if (progress || !document.body) return;
    progress = document.createElement("div");
    progress.className = "w3-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);
  }

  function updateProgress() {
    if (!progress) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
  }

  // ---------------------------------------------------------- scroll reveal
  var REVEAL = ".w3-reveal";
  function initReveal() {
    var targets = $$(REVEAL);
    if (!targets.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("w3-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Math.min(Number(el.dataset.w3Delay || 0), 320);
        window.setTimeout(function () { el.classList.add("w3-in"); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    targets.forEach(function (el, i) {
      // Stagger only the first screenful so long pages never feel sluggish.
      if (!el.dataset.w3Delay && i < 6) el.dataset.w3Delay = String(i * 55);
      if (el.classList.contains("w3-in")) return;
      io.observe(el);
    });
  }

  // -------------------------------------------------------------- mermaid
  function initMermaid() {
    if (typeof mermaid === "undefined") return;
    var dark = document.body.getAttribute("data-md-color-scheme") === "slate";
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: getComputedStyle(document.body).fontFamily,
      });
      $$(".mermaid").forEach(function (el) {
        if (el.dataset.w3Rendered) return;
        el.dataset.w3Rendered = "1";
        try { mermaid.run({ nodes: [el] }); } catch (e) { /* keep the pre tag */ }
      });
    } catch (e) { /* never break the page on a diagram */ }
  }

  // ------------------------------------------------------------ giscus skin
  function giscusTheme() {
    var dark = document.body.getAttribute("data-md-color-scheme") === "slate";
    return dark ? "dark_dimmed" : "light";
  }

  // Giscus renders inside a cross-origin iframe, so its typography cannot be
  // changed from this document. The closest we can get from the outside is to
  // make the container inherit the site rhythm and push the matching theme on
  // every palette change, so the widget never reads as a foreign component.
  function syncGiscusTheme() {
    $$(".giscus-frame").forEach(function (frame) {
      if (!frame.contentWindow) return;
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme() } } },
        "https://giscus.app"
      );
    });
    document.documentElement.setAttribute("data-w3-giscus", giscusTheme());
  }

  // ------------------------------------------------------------ theme sync
  function initThemeSync() {
    document.addEventListener("click", function (e) {
      var toggle = e.target.closest('[data-md-color-media], [data-md-color-scheme] input, .md-header__button[for]');
      var labelled = e.target.closest("label[for]");
      if (!toggle && !labelled) return;
      window.setTimeout(syncGiscusTheme, 320);
    });
  }

  // ---------------------------------------------------------- support lightbox
  function initLightbox() {
    if ($("#w3-lightbox")) return;
    var box = document.createElement("div");
    box.className = "w3-lightbox";
    box.id = "w3-lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "收款码预览");
    box.hidden = true;
    box.innerHTML =
      '<button class="w3-lightbox-close" type="button" aria-label="关闭">&times;</button>' +
      '<img class="w3-lightbox-img" src="" alt="" />' +
      '<p class="w3-lightbox-cap"></p>';
    document.body.appendChild(box);

    var img = $(".w3-lightbox-img", box);
    var cap = $(".w3-lightbox-cap", box);
    var lastFocus = null;

    function open(src, caption) {
      lastFocus = document.activeElement;
      img.src = src;
      img.alt = caption;
      cap.textContent = caption;
      box.hidden = false;
      document.body.classList.add("w3-no-scroll");
      window.setTimeout(function () { $(".w3-lightbox-close", box).focus(); }, 30);
    }

    function close() {
      box.hidden = true;
      img.src = "";
      document.body.classList.remove("w3-no-scroll");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    $$(".w3-support-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        var i = $("img", card);
        var name = $(".w3-support-name", card);
        open(i.src, (name ? name.textContent.trim() : "收款码") + " · 点击空白处关闭");
      });
    });

    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.closest(".w3-lightbox-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !box.hidden) close();
    });
  }

  // ------------------------------------------------- homepage stat injection
  // The homepage carries four descriptive chips. Each one becomes a real link
  // that points at the page that proves the claim, so nothing is dead text.
  function initMetaLinks() {
    var row = $(".w3-meta-row");
    if (!row) return;
    $$("span", row).forEach(function (span) {
      if (span.closest("a")) return;
      var href = span.dataset.w3Href;
      if (!href) return;
      var a = document.createElement("a");
      a.className = "w3-meta-link";
      a.href = href;
      a.innerHTML = span.innerHTML;
      a.setAttribute("aria-label", (span.textContent || "").trim());
      span.parentNode.replaceChild(a, span);
    });
  }

  // ------------------------------------------------------------ per-page boot
  eachPage(function () {
    initProgress();
    initReveal();
    initMetaLinks();
    initLightbox();
    initMermaid();
    syncGiscusTheme();
    updateProgress();
    initThemeSync();
  });

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
})();