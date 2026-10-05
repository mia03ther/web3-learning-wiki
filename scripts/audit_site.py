"""Visual + accessibility audit for the local MkDocs preview.

Usage:
    python scripts/audit_site.py [base_url] [out_dir]

Captures light/dark screenshots at desktop widths and programmatically measures
contrast for the elements that commonly break in MkDocs Material theming.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

PAGES = [
    ("home", ""),
    ("about", "about/"),
    ("courses", "roadmap/courses/"),
    ("article", "fundamentals/core-concepts/"),
]

WIDTHS = [(1440, 1000), (1920, 1080), (820, 1100), (390, 844)]

# Selector pairs that must be legible: (container, text)
CONTRAST_TARGETS = [
    (".md-nav__link", "sidebar nav link"),
    (".md-nav__title", "sidebar title"),
    (".md-tabs__link", "top tab"),
    (".md-header__title", "header title"),
    (".w3-meta-row span", "homepage meta row"),
    (".w3-card .title", "card title"),
    (".w3-card .desc", "card description"),
    (".w3-section-label", "section label"),
    (".md-search__input", "search input"),
    (".md-footer__link", "footer link"),
]

# Measures the worst WCAG contrast ratio for every matching element on the page.
CONTRAST_JS = """
(sel) => {
  const lum = (rgb) => {
    const [r, g, b] = rgb;
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x.trim()));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
  const effBg = (el) => {
    let node = el;
    const stack = [];
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      node = node.parentElement;
    }
    let bg = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) bg = over(stack[i], bg);
    return bg;
  };
  const out = [];
  document.querySelectorAll(sel).forEach((el) => {
    const text = (el.textContent || '').trim();
    if (!text) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (parseFloat(cs.opacity) < 0.1) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const fg = parse(cs.color);
    if (!fg) return;
    const bg = effBg(el);
    const fgc = over(fg, bg);
    const l1 = lum(fgc), l2 = lum(bg);
    out.push({
      text: text.slice(0, 40),
      ratio: Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100,
      color: cs.color,
    });
  });
  return out;
}
"""


def audit(page, base: str, out_dir: Path, ctx) -> dict:
    report: dict = {"screenshots": [], "contrast": {}, "errors": []}

    page.on("console", lambda m: report["errors"].append(f"console.{m.type}: {m.text}")
            if m.type == "error" else None)
    page.on("pageerror", lambda e: report["errors"].append(f"pageerror: {e}"))

    for name, route in PAGES:
        url = f"{base}{route}"
        for scheme in ("light", "dark"):
            # Material persists the palette under __palette; set it before load so
            # the theme boots in the intended scheme instead of being overridden.
            ctx.add_init_script(
                "(s) => { try { localStorage.setItem('__palette', "
                "s === 'dark' ? '4' : '0'); } catch (e) {} }",
            )
            for w, h in WIDTHS:
                page.set_viewport_size({"width": w, "height": h})
                # External assets (giscus, mermaid CDN, fonts) can hang in this
                # environment, so wait on DOM rather than network idle.
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(700)
                # Material scopes palette to <body data-md-color-scheme>, so the
                # override must land there rather than on <html>.
                page.evaluate(
                    "s => {"
                    "  document.body.setAttribute('data-md-color-scheme', s);"
                    "  document.documentElement.setAttribute('data-md-color-scheme', s);"
                    "  try { localStorage.setItem('__w3_audit_scheme', s); } catch (e) {}"
                    "}",
                    scheme,
                )
                page.wait_for_timeout(500)
                file = out_dir / f"{name}-{scheme}-{w}.png"
                page.screenshot(path=str(file))
                report["screenshots"].append(file.name)

                if w == 1440:
                    key = f"{name}:{scheme}"
                    report["contrast"][key] = {}
                    for selector, label in CONTRAST_TARGETS:
                        res = page.evaluate(CONTRAST_JS, selector)
                        if res:
                            report["contrast"][key][label] = min(res, key=lambda r: r["ratio"])
    return report


def main() -> int:
    base = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8131/web3-learning-wiki/").rstrip("/") + "/"
    out_dir = Path(sys.argv[2] if len(sys.argv) > 2 else "C:/Users/24525/AppData/Local/Temp/kilo/shots")
    out_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = ctx.new_page()
        report = audit(page, base, out_dir, ctx)
        browser.close()

    (out_dir / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    failures = []
    for key, targets in report["contrast"].items():
        for label, worst in targets.items():
            status = "PASS" if worst["ratio"] >= 4.5 else ("AA-lg" if worst["ratio"] >= 3 else "FAIL")
            if worst["ratio"] < 4.5:
                failures.append(f"{key} :: {label} ratio={worst['ratio']} {worst['color']}")
            print(f"{status:>6} {key:<18} {label:<24} {worst['ratio']:>5}  {worst['text'][:28]!r}")

    if report["errors"]:
        print("\nJS errors:")
        for e in sorted(set(report["errors"])):
            print("  " + e)

    print(f"\nscreenshots: {len(report['screenshots'])} -> {out_dir}")
    print(f"contrast failures: {len(failures)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())