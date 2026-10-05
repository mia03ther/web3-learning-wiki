"""Verifies how each palette scheme is actually applied in the rendered page."""
from __future__ import annotations

import sys

from playwright.sync_api import sync_playwright

JS = r"""
() => ({
  html: {
    scheme: document.documentElement.getAttribute('data-md-color-scheme'),
    primary: document.documentElement.getAttribute('data-md-color-primary'),
    media: document.querySelector('input[name=__palette][checked]') ? 'checked-input' : 'none',
  },
  body: {
    scheme: document.body.getAttribute('data-md-color-scheme'),
    primary: document.body.getAttribute('data-md-color-primary'),
  },
  storage: (() => { try { return localStorage.getItem('__palette'); } catch (e) { return 'n/a'; } })(),
  inputs: Array.from(document.querySelectorAll('input[name=__palette]'))
    .map((i) => ({ v: i.value, checked: i.checked })),
  tokenBg: getComputedStyle(document.querySelector('.md-typeset') || document.body)
    .getPropertyValue('--w3-bg').trim(),
  headerBg: getComputedStyle(document.querySelector('.md-header')).backgroundColor,
})
"""


def main() -> int:
    base = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8131/web3-learning-wiki/").rstrip("/") + "/"
    with sync_playwright() as p:
        b = p.chromium.launch()
        for label, setup in (
            ("no-override", None),
            ("palette-0", "0"),
            ("palette-1", "1"),
            ("palette-2", "2"),
        ):
            ctx = b.new_context(viewport={"width": 1440, "height": 1000},
                                color_scheme="dark" if label == "palette-2" else "light")
            if setup is not None:
                ctx.add_init_script(script=f"try{{localStorage.setItem('__palette','{setup}')}}catch(e){{}}")
            pg = ctx.new_page()
            pg.goto(base, wait_until="domcontentloaded", timeout=45000)
            pg.wait_for_timeout(800)
            print(f"===== {label}")
            for k, v in pg.evaluate(JS).items():
                print(f"   {k}: {v}")
            ctx.close()
        b.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())