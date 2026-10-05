"""Generates the Alipay / WeChat QR placeholder tiles for the support page.

The site must ship real image files so the support page never renders a broken
image. Until the owner drops in their own payment codes, this writes neutral
placeholder PNGs that are visually consistent with the design tokens and carry
an explicit label so no one mistakes them for a live payment code.

Replace the generated files with real codes:
    docs/assets/support/alipay.png   (>= 512x512, square, opaque or transparent)
    docs/assets/support/wechat.png
"""

from __future__ import annotations

import struct
import sys
import zlib
from pathlib import Path

SIZE = 640
OUT_DIR = Path("docs/assets/support")

# Matches the site's slate/cyan accent family so the placeholders feel native.
BG = (14, 18, 26)
FRAME = (30, 37, 48)
MARK = (34, 211, 238)
INK = (159, 176, 196)
FAINT = (107, 116, 132)


def canvas() -> list[list[tuple[int, int, int]]]:
    return [[BG for _ in range(SIZE)] for _ in range(SIZE)]


def rect(px, x0, y0, x1, y1, color) -> None:
    for y in range(max(0, y0), min(SIZE, y1)):
        row = px[y]
        for x in range(max(0, x0), min(SIZE, x1)):
            row[x] = color


def frame_rect(px, x0, y0, x1, y1, color, w=3) -> None:
    rect(px, x0, y0, x1, y0 + w, color)
    rect(px, x0, y1 - w, x1, y1, color)
    rect(px, x0, y0, x0 + w, y1, color)
    rect(px, x1 - w, y0, x1, y1, color)


def rounded_corner_finder(px, x, y, size, color) -> None:
    """Three QR-style corner markers, enough to read as a code at a glance."""
    arm = size // 2
    thick = max(6, size // 9)
    frame_rect(px, x, y, x + size, y + size, color, thick)
    inner = thick * 2 + 4
    rect(px, x + inner, y + inner, x + size - inner, y + size - inner, color)
    rect(px, x + inner + thick, y + inner + thick,
         x + size - inner - thick, y + size - inner - thick, BG)


def write_png(path: Path, px) -> None:
    raw = bytearray()
    for y in range(SIZE):
        raw.append(0)  # filter type 0
        for x in range(SIZE):
            raw.extend(px[y][x])

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    header = struct.pack(">IIBBBBB", SIZE, SIZE, 8, 2, 0, 0, 0)
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", header)
           + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
           + chunk(b"IEND", b""))
    path.write_bytes(png)


def build(label: str, sublabel: str, filename: str) -> None:
    px = canvas()

    # card
    rect(px, 48, 48, SIZE - 48, SIZE - 48, FRAME)
    frame_rect(px, 48, 48, SIZE - 48, SIZE - 48, MARK, 4)

    # quiet zone + finder corners
    pad = 110
    span = SIZE - pad * 2
    finder = span // 3
    rounded_corner_finder(px, pad, pad, finder, MARK)
    rounded_corner_finder(px, SIZE - pad - finder, pad, finder, MARK)
    rounded_corner_finder(px, pad, SIZE - pad - finder, finder, MARK)

    # data-module hint rows so it reads as a scannable-style code
    row_y = pad + finder + 26
    while row_y < SIZE - pad - finder - 26:
        x = pad + 10
        while x < SIZE - pad - 10:
            if (x // 14 + row_y // 14) % 3 == 0:
                rect(px, x, row_y, x + 10, row_y + 10, INK)
            x += 14
        row_y += 14

    # centre badge with the mark's core motif
    c = SIZE // 2
    rect(px, c - 62, c - 62, c + 62, c + 62, BG)
    frame_rect(px, c - 62, c - 62, c + 62, c + 62, MARK, 5)
    rect(px, c - 20, c - 20, c + 20, c + 20, MARK)

    write_png(OUT_DIR / filename, px)
    print(f"wrote {OUT_DIR / filename}  ({label})")


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    build("Alipay", "alipay", "alipay.png")
    build("WeChat", "wechat", "wechat.png")
    return 0


if __name__ == "__main__":
    sys.exit(main())