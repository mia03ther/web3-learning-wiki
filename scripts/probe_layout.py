"""Structural probe: measures layout geometry and flags specific UI defects.

Run against the local preview:
    python scripts/probe_layout.py [base_url]

Prints a JSON report covering:
  - shell widths at each viewport (is the page squeezed into a narrow column?)
  - sidebar background blocks and whether their text is legible
  - font-family consistency across key surfaces
  - non-interactive / low-contrast elements
"""

from __future__ import annotations

import json
import sys

from playwright.sync_api import sync_playwright

PROBE = r"""
() => {
  const px = (v) => Math.round(parseFloat(v) || 0);
  const rgb = (s) => {
    const m = (s||'').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(x => parseFloat(x.trim()));
    return { rgb: [p[0],p[1],p[2]], a: p.length>3?p[3]:1 };
  };
  const lum = (c) => {
    const f = (x) => { x/=255; return x<=0.03928 ? x/12.92 : Math.pow((x+0.055)/1.055,2.4); };
    return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);
  };
  const over = (fg,bg) => fg.rgb.map((c,i)=>c*fg.a+bg[i]*(1-fg.a));
  const effBg = (el) => {
    let n = el, st = [];
    while (n && n !== document.documentElement) {
      const c = rgb(getComputedStyle(n).backgroundColor);
      if (c && c.a>0) { st.push(c); if (c.a===1) break; }
      n = n.parentElement;
    }
    let bg=[255,255,255];
    for (let i=st.length-1;i>=0;i--) bg = over(st[i], bg);
    return bg;
  };
  const contrast = (el) => {
    const fg = rgb(getComputedStyle(el).color); if (!fg) return null;
    const bg = effBg(el); const fgc = over(fg,bg);
    const l1 = lum(fgc), l2 = lum(bg);
    return Math.round(((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05))*100)/100;
  };
  const rect = (sel) => {
    const el = document.querySelector(sel); if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: px(r.width), h: px(r.height), x: px(r.x) };
  };

  // Any element inside the sidebar that paints a saturated block but shows no text
  const emptyBlocks = [];
  document.querySelectorAll('.md-sidebar--primary *, .md-sidebar--secondary *, .md-header *, .md-tabs *').forEach((el) => {
    const cs = getComputedStyle(el);
    const c = rgb(cs.backgroundColor);
    if (!c || c.a < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 14 || r.height > 260) return;
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
    const desc = Array.from(el.querySelectorAll('*')).some((n) => n.textContent.trim());
    if (own || desc) return;
    const sat = Math.max(...c.rgb) - Math.min(...c.rgb);
    emptyBlocks.push({
      sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
      bg: cs.backgroundColor, size: [px(r.width), px(r.height)], saturated: sat,
    });
  });

  const fonts = {};
  ['body', '.md-typeset', '.md-nav', '.md-tabs', '.md-header__title', '.md-search__input',
   '.w3-btn', '.w3-card', '.md-footer__link', '.md-typeset h1', '.w3-comments-title'
  ].forEach((sel) => {
    const el = document.querySelector(sel); if (!el) return;
    fonts[sel] = getComputedStyle(el).fontFamily.slice(0, 90);
  });

  const lowContrast = [];
  document.querySelectorAll('.md-nav__link, .md-tabs__link, .w3-meta-row *, .w3-card *, .w3-tile *, .md-footer__link, .md-search__input').forEach((el) => {
    if (!(el.textContent || '').trim()) return;
    const c = contrast(el); if (c === null) return;
    if (c < 4.5) lowContrast.push({
      sel: el.tagName.toLowerCase() + '.' + String(el.className || '').trim().split(/\s+/).slice(0,2).join('.'),
      text: el.textContent.trim().slice(0, 26), ratio: c, color: getComputedStyle(el).color,
    });
  });

  const metaRow = Array.from(document.querySelectorAll('.w3-meta-row span')).map((s) => ({
    text: s.textContent.trim(),
    clickable: !!s.closest('a, button'),
    ratio: contrast(s),
    cursor: getComputedStyle(s).cursor,
  }));

  return {
    viewport: { w: innerWidth, h: innerHeight },
    shell: {
      'md-grid': rect('.md-grid'),
      'md-main__inner': rect('.md-main__inner'),
      'md-content__inner': rect('.md-content__inner'),
      'md-sidebar--primary': rect('.md-sidebar--primary'),
      'md-sidebar--secondary': rect('.md-sidebar--secondary'),
      bodyScrollWidth: document.documentElement.scrollWidth,
    },
    scheme: document.body.getAttribute('data-md-color-scheme'),
    emptyBlocks,
    fonts,
    lowContrast,
    metaRow,
    focusablesWithoutName: Array.from(document.querySelectorAll('a, button')).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 8 && r.height > 8 && !(el.textContent || '').trim()
             && !el.getAttribute('aria-label') && !el.querySelector('[aria-label], img[alt]:not([alt=""])');
    }).length,
  };
}
"""


def main() -> int:
    base = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8131/web3-learning-wiki/").rstrip("/") + "/"
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        for scheme in ("light", "dark"):
            ctx = b.new_context(viewport={"width": 1440, "height": 1000},
                                color_scheme="dark" if scheme == "dark" else "light")
            pg = ctx.new_page()
            for label, route in (("home", ""), ("article", "fundamentals/core-concepts/")):
                pg.goto(base + route, wait_until="domcontentloaded", timeout=45000)
                pg.wait_for_timeout(800)
                out[f"{label}:{scheme}"] = pg.evaluate(PROBE)
                pg.set_viewport_size({"width": 1920, "height": 1080})
                pg.wait_for_timeout(300)
                out[f"{label}:{scheme}:1920"] = pg.evaluate(PROBE)
            ctx.close()
        b.close()

    print(json.dumps(out, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())