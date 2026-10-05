"""Finds the unexplained coloured block in the sidebar / header region."""
from __future__ import annotations

import json
import sys

from playwright.sync_api import sync_playwright

JS = r"""
() => {
  const out = [];
  const walk = (root, label) => {
    root.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      const m = (cs.backgroundColor || '').match(/rgba?\(([^)]+)\)/);
      if (!m) return;
      const p = m[1].split(',').map((x) => parseFloat(x.trim()));
      const a = p.length > 3 ? p[3] : 1;
      if (a < 0.08) return;
      const sat = Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2]);
      if (sat < 25) return;                      // only chromatic blocks
      const r = el.getBoundingClientRect();
      if (r.width < 60 || r.height < 12) return;
      out.push({
        region: label,
        el: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
              ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        bg: cs.backgroundColor,
        size: [Math.round(r.width), Math.round(r.height)],
        text: (el.textContent || '').trim().slice(0, 40),
        color: cs.color,
      });
    });
  };
  const side = document.querySelector('.md-sidebar--primary');
  const header = document.querySelector('.md-header');
  const tabs = document.querySelector('.md-tabs');
  if (side) walk(side, 'sidebar');
  if (header) walk(header, 'header');
  if (tabs) walk(tabs, 'tabs');
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
            for row in pg.evaluate(JS):
                print(f"  {row['region']:<8} {row['el'][:52]:<52} {row['bg']:<22} {row['size']} text={row['text']!r}")
            ctx.close()
        b.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())