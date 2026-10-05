"""Dumps computed styles for the sidebar header / title / search region."""
from __future__ import annotations

import sys

from playwright.sync_api import sync_playwright

JS = r"""
() => {
  const sel = [
    '.md-sidebar--primary', '.md-sidebar', '.md-sidebar__scrollwrap', '.md-sidebar__inner',
    '.md-nav--primary', '.md-nav--lifted', '.md-nav__title', '.md-nav', '.md-nav__source',
    '.md-search', '.md-search__form', '.md-search__output', '.w3-progress',
    '.md-header', '.md-tabs', '.md-main', '.md-sidebar--secondary', '.md-sidebar--secondary',
  ];
  const out = {};
  sel.forEach((s) => {
    const el = document.querySelector(s);
    if (!el) { out[s] = 'ABSENT'; return; }
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    out[s] = {
      bg: cs.backgroundColor,
      bgImage: cs.backgroundImage.slice(0, 80),
      color: cs.color,
      size: [Math.round(r.width), Math.round(r.height)],
    };
  });
  return out;
}
"""


def main() -> int:
    base = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8131/web3-learning-wiki/").rstrip("/") + "/"
    with sync_playwright() as p:
        b = p.chromium.launch()
        for scheme, palette in (("light", "0"), ("dark", "2")):
            ctx = b.new_context(viewport={"width": 1440, "height": 1000},
                                color_scheme="dark" if scheme == "dark" else "light")
            ctx.add_init_script(script=f"try{{localStorage.setItem('__palette','{palette}')}}catch(e){{}}")
            pg = ctx.new_page()
            pg.goto(base, wait_until="domcontentloaded", timeout=45000)
            pg.wait_for_timeout(900)
            print(f"===== {scheme}")
            for k, v in pg.evaluate(JS).items():
                print(f"  {k:<26} {v}")
            ctx.close()
        b.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())