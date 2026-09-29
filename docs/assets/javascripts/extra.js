/* ============================================================
   Web3 Learning Wiki — custom JavaScript
   1) Mermaid diagrams (light/dark aware)
   2) Reading progress bar
   Docs: https://squidfunk.github.io/mkdocs-material/reference/diagrams/
   ============================================================ */

/* ---------- 1. Mermaid ---------- */
document$.subscribe(function () {
  var diagrams = document.querySelectorAll(".mermaid");
  if (diagrams.length === 0) return;

  var palette = __md_get("__palette");
  var theme = "default";
  if (palette && palette.color && palette.color.scheme === "slate") {
    theme = "dark";
  }
  mermaid.initialize({ startOnLoad: false, theme: theme, securityLevel: "loose" });
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
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update, { passive: true });
  update();
})();
