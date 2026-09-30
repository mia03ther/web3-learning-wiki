/* ============================================================
   Web3 Learning Wiki — interactions
   Mermaid (dark) · reading progress · reveal on scroll
   ============================================================ */

/* ---------- Mermaid: unified dark diagram theme ---------- */
function renderMermaid() {
  if (typeof mermaid === "undefined") return;
  try {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      themeVariables: {
        darkMode: true,
        background: "#0d1420",
        primaryColor: "#131b28",
        primaryTextColor: "#e8eef7",
        primaryBorderColor: "#22d3ee",
        secondaryColor: "#0f1520",
        tertiaryColor: "#0d1420",
        lineColor: "#6b7c93",
        textColor: "#e8eef7",
        fontSize: "15px",
        fontFamily: "Inter, PingFang SC, Microsoft YaHei, sans-serif"
      },
      flowchart: { htmlLabels: true, curve: "basis" }
    });
    var nodes = document.querySelectorAll(".mermaid");
    nodes.forEach(function (node) {
      if (!node.getAttribute("data-processed")) {
        mermaid.run({ nodes: [node] }).catch(function () {});
      }
    });
  } catch (e) {
    /* no-op */
  }
}

/* ---------- Reading progress bar ---------- */
var progressBar = document.createElement("div");
progressBar.className = "w3-progress";
document.body.appendChild(progressBar);

function updateProgress() {
  var el = document.documentElement;
  var max = el.scrollHeight - el.clientHeight;
  var pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
  progressBar.style.width = pct.toFixed(2) + "%";
}

/* ---------- Reveal cards on scroll ---------- */
var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.07 }
);

function observeReveals() {
  var targets = document.querySelectorAll(
    ".w3-card, .w3-tile, .w3-course"
  );
  targets.forEach(function (el) {
    if (!el.classList.contains("w3-reveal")) {
      el.classList.add("w3-reveal");
      revealObserver.observe(el);
    }
  });
}

/* ---------- Lifecycle (Material document$ when available) ---------- */
function boot() {
  renderMermaid();
  observeReveals();
  updateProgress();
}

if (typeof document$ !== "undefined") {
  document$.subscribe(boot);
} else {
  window.addEventListener("DOMContentLoaded", boot);
}

window.addEventListener(
  "scroll",
  function () {
    requestAnimationFrame(updateProgress);
  },
  { passive: true }
);
window.addEventListener("resize", updateProgress);
