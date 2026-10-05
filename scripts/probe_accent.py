"""Broad sweep for accent-coloured blocks/gradients that render without visible text.

Usage:
    python scripts/probe_accent.py [base_url]
"""
from __future__ import annotations

import sys

from playwright.sync_api import sync_playwright

JS = r"""
() => {
  const parseColor = (s) => {
    const m = (s || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x.trim()));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 60 || r.height < 12 || r.height > 400) return;

    const bits = [];
    const bg = parseColor(cs.backgroundColor);
    if (bg && bg.a > 0.08) bits.push({ via: 'background-color', c: bg });
    const bi = cs.backgroundImage;
    if (bi && bi !== 'none') {
      const stops = bi.match(/rgba?\([^)]+\)/g) || [];
      stops.forEach((s) => {
        const c = parseColor(s);
        if (c && c.a > 0.08 && (Math.max(...c.rgb) - Math.min(...c.rgb)) > 30) {
          bits.push({ via: 'gradient', c });
        }
      });
    }
    if (!bits.length) return;

    const hasOwnText = Array.from(el.childNodes)
      .some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (hasOwnText) return;

    const desc = Array.from(el.querySelectorAll('*'))
      .some((n) => n.textContent.trim().length > 0);
    out.push({
      el: el.tagName.toLowerCase() +
          (typeof el.className === 'string' && el.className
            ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''),
      bits: bits.map((b) => `${b.via}:${b.c.rgb.join(',')}/${b.c.a}`),
      size: [Math.round(r.width), Math.round(r.height)],
      pos: [Math.round(r.x), Math.round(r.y)],
      descendantText: desc,
      opacity: cs.opacity,
    });
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
            rows = pg.evaluate(JS)
            if not rows:
                print("  (no textless accent blocks)")
            for row in rows:
                print(f"  {row['el'][:58]:<58} {row['size']} at {row['pos']} "
                      f"descText={row['descendantText']} {row['bits']}")
            ctx.close()
        b.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())