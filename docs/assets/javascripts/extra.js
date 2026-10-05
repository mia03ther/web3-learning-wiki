/* ============================================================
   Web3 Learning Wiki 2.0 — Custom JavaScript
   1  Mermaid (light/dark aware, token-driven)
   2  Reading progress bar
   3  Scroll reveal animations
   4  Interactive skill tree
   5  Learning check-in + contribution heatmap
   Docs: https://squidfunk.github.io/mkdocs-material/
   ============================================================ */

/* ---------- helpers ---------- */
function w3IsDark() {
  var p = __md_get("__palette");
  return p && p.color && p.color.scheme === "slate";
}
function w3Store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function w3Load(key, fallback) {
  try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback;
  } catch (e) { return fallback; }
}

/* ---------- 1. Mermaid ---------- */
document$.subscribe(function () {
  var diagrams = document.querySelectorAll(".mermaid");
  if (diagrams.length === 0) return;
  if (typeof mermaid === "undefined") return;

  var dark = w3IsDark();
  var theme = dark ? "dark" : "default";
  var nodeFill = dark ? "#161b24" : "#ffffff";
  var nodeStroke = dark ? "#2a3340" : "#cfd6de";
  var nodeText = dark ? "#e6edf3" : "#1b1f24";
  var edgeColor = dark ? "#98a3b1" : "#5b6572";
  var accent = dark ? "#22d3ee" : "#0891b2";
  var bgSubtle = dark ? "#11151d" : "#f6f8fa";
  var borderC = dark ? "#1e2530" : "#e4e7ec";

  mermaid.initialize({
    startOnLoad: false,
    theme: theme,
    securityLevel: "loose",
    flowcurve: "basis",
    themeVariables: {
      primaryColor: nodeFill,
      primaryTextColor: nodeText,
      primaryBorderColor: nodeStroke,
      lineColor: edgeColor,
      secondaryColor: bgSubtle,
      tertiaryColor: nodeFill,
      mainBkg: nodeFill,
      nodeBorder: nodeStroke,
      clusterBkg: bgSubtle,
      clusterBorder: borderC,
      edgeLabelBackground: dark ? "#0b0e14" : "#ffffff",
      fontFamily: '"Inter", sans-serif',
      fontSize: "13px"
    }
  });
  mermaid.run({ querySelector: ".mermaid" });
});

/* ---------- 2. Reading progress bar ---------- */
(function () {
  var bar = document.createElement("div");
  bar.className = "w3-progress";
  document.body.appendChild(bar);
  var ticking = false;
  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

/* ---------- 3. Scroll reveal ---------- */
document$.subscribe(function () {
  var els = document.querySelectorAll(
    ".w3-card, .w3-tile, .w3-coffee, .w3-section-label, " +
    ".md-typeset h2, .md-typeset table, .w3-about-hero, .w3-socials, " +
    ".w3-resources, .w3-checkin, .w3-skilltree"
  );
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("w3-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("w3-in", "w3-reveal");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (el) { el.classList.add("w3-reveal"); io.observe(el); });
});

/* ---------- 4. Interactive skill tree ---------- */
document$.subscribe(function () {
  var tree = document.querySelector(".w3-skilltree");
  if (!tree) return;
  var nodes = tree.querySelectorAll(".st-node");
  nodes.forEach(function (node) {
    node.addEventListener("click", function () {
      var id = node.getAttribute("data-id");
      if (!id) return;
      node.classList.toggle("st-done");
      w3Store("w3-skill-" + id, node.classList.contains("st-done"));
      updateEdges(tree);
    });
    var id = node.getAttribute("data-id");
    if (id && w3Load("w3-skill-" + id, false)) node.classList.add("st-done");
  });
  function updateEdges(tree) {
    var edges = tree.querySelectorAll(".st-edge");
    edges.forEach(function (edge) {
      var from = edge.getAttribute("data-from");
      var to = edge.getAttribute("data-to");
      var fn = tree.querySelector('.st-node[data-id="' + from + '"]');
      var tn = tree.querySelector('.st-node[data-id="' + to + '"]');
      if (fn && tn && fn.classList.contains("st-done") && tn.classList.contains("st-done")) {
        edge.classList.add("st-done");
      } else {
        edge.classList.remove("st-done");
      }
    });
  }
  updateEdges(tree);
});

/* ---------- 5. Learning check-in + heatmap ---------- */
document$.subscribe(function () {
  var box = document.querySelector(".w3-checkin");
  if (!box) return;
  var KEY = "w3-checkin";
  var data = w3Load(KEY, { days: {}, streak: 0, lastDate: null, total: 0 });
  var today = new Date().toISOString().slice(0, 10);

  var btn = box.querySelector(".w3-checkin-btn");
  var streakEl = box.querySelector("[data-stat='streak']");
  var totalEl = box.querySelector("[data-stat='total']");
  var monthEl = box.querySelector("[data-stat='month']");
  var heatEl = box.querySelector(".w3-heatmap");
  var note = box.querySelector(".w3-checkin-note");

  function monthCount() {
    var ym = today.slice(0, 7);
    return Object.keys(data.days).filter(function (d) { return d.slice(0, 7) === ym; }).length;
  }
  function isYesterday(d) {
    var y = new Date(); y.setDate(y.getDate() - 1);
    return y.toISOString().slice(0, 10) === d;
  }
  function recomputeStreak() {
    if (!data.lastDate) { data.streak = 0; return; }
    if (data.lastDate === today || isYesterday(data.lastDate)) {
      var s = 0; var cur = new Date();
      while (true) {
        var ds = cur.toISOString().slice(0, 10);
        if (data.days[ds]) { s++; cur.setDate(cur.getDate() - 1); }
        else break;
      }
      data.streak = s;
    } else {
      data.streak = data.days[today] ? 1 : 0;
    }
  }
  function render() {
    recomputeStreak();
    if (streakEl) streakEl.textContent = data.streak;
    if (totalEl) totalEl.textContent = data.total;
    if (monthEl) monthEl.textContent = monthCount();
    if (btn) {
      if (data.days[today]) {
        btn.textContent = "✓ 今日已打卡";
        btn.classList.add("done");
        btn.disabled = true;
        if (note) note.textContent = "连续学习 " + data.streak + " 天，继续保持！";
      } else {
        btn.textContent = "🔥 今日打卡";
        btn.classList.remove("done");
        btn.disabled = false;
        if (note) note.textContent = "点击打卡，记录今天的学习。";
      }
    }
    renderHeatmap();
  }
  function renderHeatmap() {
    if (!heatEl) return;
    heatEl.innerHTML = "";
    var weeks = 26;
    var now = new Date();
    var start = new Date(now);
    start.setDate(start.getDate() - weeks * 7 + 1);
    for (var i = 0; i < weeks * 7; i++) {
      var d = new Date(start);
      d.setDate(d.getDate() + i);
      var ds = d.toISOString().slice(0, 10);
      var cell = document.createElement("div");
      cell.className = "cell";
      cell.title = ds;
      var marked = data.days[ds];
      if (marked) {
        var lvl = marked >= 4 ? 4 : marked;
        cell.classList.add("l" + lvl);
      }
      heatEl.appendChild(cell);
    }
  }
  if (btn) {
    btn.addEventListener("click", function () {
      if (data.days[today]) return;
      data.days[today] = (data.days[today] || 0) + 1;
      data.lastDate = today;
      data.total = (data.total || 0) + 1;
      recomputeStreak();
      w3Store(KEY, data);
      render();
    });
  }
  render();
});

/* ---------- 6. Giscus theme sync ----------
   The comment box itself is injected by overrides/partials/comments.html,
   so nothing here creates or configures the Giscus widget. Giscus boots with
   data-theme="preferred_color_scheme"; this only pushes the Material palette
   choice into the already-mounted iframe when the user flips the toggle. */
document.addEventListener("click", function (e) {
  if (!e.target.closest("[data-md-color-primary]")) return;
  setTimeout(function () {
    var frames = document.querySelectorAll(".giscus-frame");
    for (var i = 0; i < frames.length; i++) {
      if (!frames[i].contentWindow) continue;
      frames[i].contentWindow.postMessage(
        { giscus: { setConfig: { theme: w3IsDark() ? "dark_dimmed" : "light" } } },
        "https://giscus.app"
      );
    }
  }, 300);
});

/* ---------- 8. Edit + Suggest buttons (bottom of article) ---------- */
document$.subscribe(function () {
  var content = document.querySelector(".md-content__inner");
  if (!content) return;
  if (document.querySelector(".w3-page-actions")) return;
  if (document.querySelector(".md-search__output")) return;

  var path = window.location.pathname.replace(/\/$/, "") + "/index.md";
  var repo = "https://github.com/mia03ther/web3-learning-wiki";
  var editUrl = repo + "/edit/main/docs/" + path.replace(/^\//, "").replace(/\.html.*/, "");
  var issueUrl = repo + "/issues/new?labels=suggestion&title=" +
    encodeURIComponent("建议：" + document.title);
  var aboutUrl = (window.location.origin + window.location.pathname).replace(/\/[^/]*\/?$/, "") + "/about/";

  var bar = document.createElement("div");
  bar.className = "w3-page-actions";
  bar.style.cssText = "display:flex;gap:0.7rem;flex-wrap:wrap;margin:2.5rem 0 0;padding-top:1.5rem;border-top:1px solid var(--w3-border)";
  bar.innerHTML =
    '<a class="w3-btn w3-btn--sm" href="' + editUrl + '" target="_blank" rel="noopener">✏️ Edit on GitHub</a>' +
    '<a class="w3-btn w3-btn--sm" href="' + issueUrl + '" target="_blank" rel="noopener">💡 提建议</a>' +
    '<a class="w3-btn w3-btn--sm w3-btn--ghost" href="' + aboutUrl + '">关于我</a>';
  content.appendChild(bar);
});

