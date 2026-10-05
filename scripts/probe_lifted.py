"""Reproduces the reported 'teal block with no text' in the left sidebar.

Material's lifted nav title (`md-nav--lifted .md-nav__title`) only paints once the
page is scrolled, so this probe scrolls before sampling.
"""
from __future__ import annotations

import sys

from playwright.sync_api import sync_playwright

JS = r"""
() => {
  const out = [];
  const cands = [
    '.md-nav__title', '.md-nav--lifted .md-nav__title', '.md-sidebar__inner',
    '.md-nav__source', '.md-search__form', '.md-search', '.md-sidebar--primary',
    '.w3-progress', '.md-nav--primary', '.md-nav--secondary .md-nav__title',
    '.md-sidebar__scrollwrap', '.md-content__inner', '.md-content',
  ];
  cands.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) { out.push({ sel, state: 'absent' }); return; }
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    out.push({
      sel,
      bg: cs.backgroundColor,
      bgImage: cs.backgroundImage.slice(0, 60),
      color: cs.color,
      borderBottom: cs.borderBottomColor + ' ' + cs.borderBottomWidth,
      size: [Math.round(r.width), Math.round(r.height)],
      opacity: cs.opacity,
      text: (el.textContent || '').trim().slice(0, 30),
    });
  });
  return { scrollY: scrollY, items: out };
}
"""


def main() -> int:
    base = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8131/web3-learning-wiki/").rstrip("/") + "/"
    with sync_playwright() as p:
        b = p.chromium.launch()
        for scheme in ("light", "dark"):
            ctx = b.new_context(viewport={"width": 1440, "height": 1000},
                                color_scheme=scheme)
            pg = ctx.new_page()
            pg.goto(base, wait_until="domcontentloaded", timeout=45000)
            pg.wait_for_timeout(700)
            for label, y in (("top", 0), ("scrolled", 900)):
                pg.evaluate(f"scrollTo(0, {y})")
                pg.wait_for_timeout(600)
                data = pg.evaluate(JS)
                print(f"===== {scheme} / {label} (scrollY={data['scrollY']})")
                for row in data["items"]:
                    if row.get("state") == "absent":
                        print(f"   {row['sel']:<34} ABSENT")
                    else:
                        print(f"   {row['sel']:<34} bg={row['bg']:<22} color={row['color']:<20} "
                              f"size={row['size']} txt={row['text']!r}")
            ctx.close()
        b.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())