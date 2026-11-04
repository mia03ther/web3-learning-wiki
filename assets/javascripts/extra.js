/*
 * Front-end enhancements for Web3 Learning Wiki (v3).
 *
 * Dependency-free and loaded as-is through Material's `extra_javascript`.
 * Every feature is optional: pages render fine without JavaScript, these only
 * add polish (progress bar, external-link targets, interactive widgets).
 * Mermaid diagrams are rendered by Material itself (superfences custom fence).
 */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  function trapTab(e, items) {
    if (e.key !== "Tab" || !items.length) return;
    var index = items.indexOf(document.activeElement);
    if (e.shiftKey && index <= 0) {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (!e.shiftKey && (index === -1 || index === items.length - 1)) {
      e.preventDefault();
      items[0].focus();
    }
  }

  // Restore pre-existing inert/scroll state when an overlay closes.
  function isolate(elements) {
    var added = elements.filter(function (el) { return el && !el.hasAttribute("inert"); });
    var wasLocked = document.body.classList.contains("w3-no-scroll");
    added.forEach(function (el) { el.setAttribute("inert", ""); });
    document.body.classList.add("w3-no-scroll");
    return function () {
      added.forEach(function (el) { el.removeAttribute("inert"); });
      if (!wasLocked) document.body.classList.remove("w3-no-scroll");
    };
  }

  function store(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* storage disabled: widgets simply stop persisting */ }
    return null;
  }

  // Material re-emits document$ on every page (instant navigation friendly).
  function eachPage(fn) {
    if (typeof document$ !== "undefined" && document$.subscribe) {
      document$.subscribe(function () { fn(); });
    } else if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  // ---------------------------------------------------------- reading bar
  var bar = null;
  function initProgress() {
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "w3-progress";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
    }
    bar.style.display = $("#lp") ? "none" : "";
    updateProgress();
  }

  function updateProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    bar.style.transform = "scaleX(" + ratio + ")";
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { updateProgress(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });

  // ------------------------------------------------------ external links
  function initExternalLinks() {
    $$(".md-content a[href^='http']").forEach(function (a) {
      if (a.host === location.host || a.target) return;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  }

  // Use Material's checkbox events so its overlay and focus state stay in sync.
  // Material already provides the /, s and f search shortcuts.
  function initDocNavigation() {
    $$("[data-w3-close-nav], [data-w3-search]").forEach(function (button) {
      if (button.dataset.w3Ready) return;
      button.dataset.w3Ready = "1";
      button.addEventListener("click", function () {
        var drawer = $("#__drawer");
        if (drawer && drawer.checked) drawer.click();
        if (!button.hasAttribute("data-w3-search")) return;
        var search = $("#__search");
        if (search && !search.checked) search.click();
        var input = $(".md-search__input");
        if (input) input.focus();
      });
    });
  }

  // ---------------------------------------------------------- skill tree
  var SKILL_KEY = "w3-skilltree";
  function initSkillTree() {
    var tree = $(".w3-skilltree");
    if (!tree || tree.dataset.w3Ready) return;
    tree.dataset.w3Ready = "1";
    var done = store(SKILL_KEY) || [];

    function paint() {
      $$(".st-node", tree).forEach(function (node) {
        node.classList.toggle("is-done", done.indexOf(node.dataset.id) !== -1);
      });
      $$(".st-edge", tree).forEach(function (edge) {
        var on = done.indexOf(edge.dataset.from) !== -1 && done.indexOf(edge.dataset.to) !== -1;
        edge.classList.toggle("is-done", on);
      });
    }

    $$(".st-node", tree).forEach(function (node) {
      if (node.dataset.id === "root") return;
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", "0");
      function toggle() {
        var id = node.dataset.id;
        var i = done.indexOf(id);
        if (i === -1) done.push(id); else done.splice(i, 1);
        store(SKILL_KEY, done);
        paint();
      }
      node.addEventListener("click", toggle);
      node.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
    paint();
  }

  // ------------------------------------------------- daily check-in widget
  var CHECKIN_KEY = "w3-checkin";
  function ymd(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }

  function initCheckin() {
    var box = $(".w3-checkin");
    if (!box || box.dataset.w3Ready) return;
    box.dataset.w3Ready = "1";
    var btn = $(".w3-checkin-btn", box);
    var heat = $(".w3-heatmap", box);
    var days = store(CHECKIN_KEY) || [];

    function render() {
      var set = {};
      days.forEach(function (d) { set[d] = true; });
      var today = new Date();
      var key = ymd(today);

      // streak: consecutive days ending today (or yesterday if not yet today)
      var cursor = new Date(today);
      if (!set[key]) cursor.setDate(cursor.getDate() - 1);
      var streak = 0;
      while (set[ymd(cursor)]) { streak++; cursor.setDate(cursor.getDate() - 1); }
      var month = key.slice(0, 7);
      var monthCount = days.filter(function (d) { return d.slice(0, 7) === month; }).length;

      var stat = function (name, v) { var el = $("[data-stat='" + name + "']", box); if (el) el.textContent = v; };
      stat("streak", streak);
      stat("total", days.length);
      stat("month", monthCount);

      if (btn) {
        var doneToday = !!set[key];
        btn.classList.toggle("is-done", doneToday);
        btn.textContent = doneToday ? "✓ 今天已打卡" : "🔥 今日打卡";
        btn.disabled = doneToday;
      }

      if (heat) {
        // 18 weeks, columns = weeks starting on Sunday
        var start = new Date(today);
        start.setDate(start.getDate() - 7 * 17 - start.getDay());
        var html = "";
        for (var d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
          var k = ymd(d);
          var cls = (set[k] ? "on" : "") + (k === key ? " today" : "");
          html += '<i class="' + cls.trim() + '" title="' + k + (set[k] ? " ✓" : "") + '"></i>';
        }
        heat.innerHTML = html;
      }
    }

    if (btn) {
      btn.addEventListener("click", function () {
        var key = ymd(new Date());
        if (days.indexOf(key) === -1) { days.push(key); store(CHECKIN_KEY, days); }
        render();
      });
    }
    render();
  }

  // ------------------------------------------------------ QR lightbox
  var lightbox = null;
  function initLightbox() {
    var cards = $$(".w3-support-card[href]");
    if (!cards.length) return;
    if (!lightbox) {
      var box = document.createElement("div");
      box.className = "w3-lightbox";
      box.id = "w3-lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.hidden = true;
      box.innerHTML =
        '<button class="w3-lightbox-close" type="button">&times;</button>' +
        '<img class="w3-lightbox-img" src="" alt="" />' +
        '<p class="w3-lightbox-cap"></p>';
      document.body.appendChild(box);
      var img = $(".w3-lightbox-img", box);
      var cap = $(".w3-lightbox-cap", box);
      var closeButton = $(".w3-lightbox-close", box);
      var lastFocus = null;
      var restore = null;

      function close() {
        if (box.hidden) return;
        box.hidden = true;
        img.removeAttribute("src");
        if (restore) { restore(); restore = null; }
        if (lastFocus && lastFocus.isConnected) lastFocus.focus();
      }

      box.addEventListener("click", function (e) {
        if (e.target === box || e.target.closest(".w3-lightbox-close")) close();
      });
      box.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); close(); }
        else trapTab(e, [closeButton]);
      });
      document.addEventListener("focusin", function (e) {
        if (!box.hidden && !box.contains(e.target)) closeButton.focus();
      });

      lightbox = {
        open: function (card) {
          var source = $("img", card);
          if (!source || !source.src) return;
          var english = document.documentElement.lang.indexOf("en") === 0;
          var name = $(".w3-support-name", card);
          var title = name ? name.textContent.trim() : (english ? "Payment QR code" : "收款码");
          lastFocus = document.activeElement;
          img.src = source.src;
          img.alt = title;
          cap.textContent = title + (english ? " · Click outside to close" : " · 点击空白处关闭");
          box.setAttribute("aria-label", english ? "Payment QR code preview" : "收款码预览");
          closeButton.setAttribute("aria-label", english ? "Close preview" : "关闭预览");
          restore = isolate(Array.prototype.filter.call(document.body.children, function (el) { return el !== box; }));
          box.hidden = false;
          closeButton.focus();
        }
      };
    }

    cards.forEach(function (card) {
      if (card.dataset.w3Ready) return;
      card.dataset.w3Ready = "1";
      card.addEventListener("click", function (e) {
        e.preventDefault();
        lightbox.open(card);
      });
    });
  }

  // ------------------------------------------------- language switcher
  // The i18n plugin resolves alternate links at build time against "/" which
  // ignores the GitHub Pages sub-path. Rebuild them relative to the site root
  // Material exposes as __md_scope, so 中文 <-> English keeps the current page.
  function initLanguageSwitcher() {
    var links = $$(".md-select__link[hreflang]");
    if (!links.length) return;
    var root = (typeof __md_scope !== "undefined" ? __md_scope.pathname : "/")
      .replace(/en\/$/, "");
    var path = location.pathname.replace(/index\.html$/, "");
    var rest = path.indexOf(root) === 0 ? path.slice(root.length) : path.replace(/^\//, "");
    var lang = rest.indexOf("en/") === 0 ? "en" : "zh";
    if (lang === "en") rest = rest.slice(3);

    links.forEach(function (a) {
      var target = (a.getAttribute("hreflang") || "").toLowerCase().indexOf("en") === 0 ? "en" : "zh";
      a.setAttribute("href", root + (target === "en" ? "en/" : "") + rest + location.hash);
      if (target === lang) {
        a.classList.add("md-select__link--active");
        a.setAttribute("aria-current", "true");
      }
    });
  }

  // ------------------------------------------------------ giscus theme
  function giscusTheme() {
    return document.body.getAttribute("data-md-color-scheme") === "slate" ? "dark_dimmed" : "light";
  }

  function syncGiscus() {
    $$("iframe.giscus-frame").forEach(function (frame) {
      if (!frame.contentWindow) return;
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme() } } }, "https://giscus.app"
      );
    });
  }

  window.addEventListener("message", function (e) {
    if (e.origin === "https://giscus.app") syncGiscus();
  });

  new MutationObserver(syncGiscus).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"],
  });

  // ------------------------------------------------------ entrance page
  // The landing template (#lp) is plain HTML and CSS; only the mobile menu
  // needs script.
  function initLanding() {
    var lp = $("#lp");
    if (!lp || lp.dataset.w3Ready) return;
    lp.dataset.w3Ready = "1";

    var toggle = $("[data-lp-toggle]");
    var menu = $("[data-lp-menu]");
    if (!toggle || !menu) return;
    var links = $$("a[href]", menu);
    var wide = window.matchMedia("(min-width: 52.0625em)");
    var isOpen = false;
    var restore = null;

    function setMenu(open) {
      if (open === isOpen) return;
      isOpen = open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", toggle.getAttribute(open ? "data-lp-close-label" : "data-lp-open-label"));
      if (open) {
        menu.hidden = false;
        void menu.offsetWidth;
        menu.classList.add("is-open");
        restore = isolate([lp, $(".lp-footer"), $(".lp-nav__brand"), $(".lp-nav__links")]);
        (links[0] || toggle).focus();
      } else {
        menu.classList.remove("is-open");
        menu.hidden = true;
        if (restore) { restore(); restore = null; }
        (wide.matches ? $(".lp-nav__brand") : toggle).focus();
      }
    }

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { e.preventDefault(); setMenu(false); }
      else trapTab(e, [toggle].concat(links));
    });
    document.addEventListener("focusin", function (e) {
      if (isOpen && e.target !== toggle && !menu.contains(e.target)) (links[0] || toggle).focus();
    });
    // Close it when the window grows past the mobile breakpoint.
    if (wide.addEventListener) {
      wide.addEventListener("change", function (e) { if (e.matches) setMenu(false); });
    }
  }

  // ---------------------------------------------------------- boot
  eachPage(function () {
    initLanding();
    initProgress();
    initExternalLinks();
    initDocNavigation();
    initSkillTree();
    initCheckin();
    initLightbox();
    initLanguageSwitcher();
    syncGiscus();
  });
})();
