#!/usr/bin/env python3
"""Genera gli sticker ufficiali Stalloni dello Zodiaco a 300 dpi."""

from pathlib import Path
import base64
import csv
import html
import io
import os
import sys

ROOT = Path(__file__).resolve().parents[2]
TOOLING = ROOT.parent / ".tooling" / "qrcode"
sys.path.insert(0, str(TOOLING))

import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
ASSETS = OUT / "assets"
PRINT = OUT / "print"
PREVIEW = OUT / "preview"

BG = "#080910"
SURFACE = "#151124"
WHITE = "#F5F3FF"
MUTED = "#B9B3CE"
CYAN = "#00D5E8"
PINK = "#FF239D"
LIME = "#C1F600"
YELLOW = "#FFD323"

FONT_DISPLAY = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
FONT_BODY = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
BASE_URL = "https://frappaf.github.io/stalloni-dello-zodiaco/"


def font(size, display=False):
    return ImageFont.truetype(FONT_DISPLAY if display else FONT_BODY, size)


def rgb(hex_color):
    h = hex_color.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def fit_font(draw, text, max_width, start, display=True):
    size = start
    while size > 18:
        f = font(size, display)
        if draw.textbbox((0, 0), text, font=f)[2] <= max_width:
            return f
        size -= 2
    return font(size, display)


def center_text(draw, text, y, max_width, size, color=WHITE, display=True):
    f = fit_font(draw, text, max_width, size, display)
    box = draw.textbbox((0, 0), text, font=f)
    x = (draw._image.width - (box[2] - box[0])) // 2
    draw.text((x, y), text, font=f, fill=rgb(color))
    return f.size


def qr_image(url, target):
    code = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_Q, box_size=10, border=4)
    code.add_data(url)
    code.make(fit=True)
    raw = code.make_image(fill_color="black", back_color="white").convert("RGB")
    # Ridimensionamento solo per multipli interi: bordi dei moduli sempre netti.
    modules = len(code.get_matrix())
    scale = max(1, target // modules)
    size = modules * scale
    return raw.resize((size, size), Image.Resampling.NEAREST), code.get_matrix()


def place_logo(canvas, box):
    logo = Image.open(ASSETS / "simbolo-stalloni.png").convert("RGBA")
    logo.thumbnail((box[2], box[3]), Image.Resampling.LANCZOS)
    x = box[0] + (box[2] - logo.width) // 2
    y = box[1] + (box[3] - logo.height) // 2
    canvas.alpha_composite(logo, (x, y))


def decorate(draw, w, h, accent):
    c = rgb(accent)
    for inset, alpha in ((38, 255), (68, 95), (96, 55)):
        draw.rounded_rectangle((inset, inset, w-inset, h-inset), radius=70, outline=(*c, alpha), width=5)
    for x, y, r, col in [(.10,.18,9,PINK),(.88,.13,7,CYAN),(.13,.78,6,YELLOW),(.87,.82,10,LIME)]:
        draw.ellipse((int(w*x-r),int(h*y-r),int(w*x+r),int(h*y+r)),fill=rgb(col))


def add_qr(canvas, url, x, y, target, accent):
    qr, _ = qr_image(url, target)
    pad = 14
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle((x-pad,y-pad,x+qr.width+pad,y+qr.height+pad),radius=24,fill=rgb(WHITE),outline=rgb(accent),width=7)
    canvas.paste(qr, (x, y))
    return qr.width


def save_outputs(name, image):
    PRINT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    rgb_image = image.convert("RGB")
    rgb_image.save(PRINT / f"{name}-300dpi.png", dpi=(300,300), optimize=True)
    rgb_image.save(PRINT / f"{name}-300dpi.pdf", resolution=300)
    preview = rgb_image.copy()
    preview.thumbnail((900,900), Image.Resampling.LANCZOS)
    preview.save(PREVIEW / f"{name}.webp", format="WEBP", quality=88, method=6)


def sticker_round():
    # 85 mm finiti + 3 mm di abbondanza per lato = 91 mm a 300 dpi.
    w = h = 1075
    im = Image.new("RGBA", (w,h), rgb(BG)+(255,))
    d = ImageDraw.Draw(im, "RGBA")
    d.ellipse((10,10,w-10,h-10),fill=rgb(BG),outline=rgb(PINK),width=18)
    d.ellipse((44,44,w-44,h-44),outline=(*rgb(CYAN),120),width=6)
    place_logo(im,(365,62,345,345))
    center_text(d,"HAI TROVATO",360,900,68,WHITE)
    center_text(d,"LA MANDRIA.",432,920,84,LIME)
    url = BASE_URL + "?src=sticker-savona-mandria"
    size = add_qr(im,url,366,566,344,PINK)
    d.rounded_rectangle((150,920,w-150,984),radius=22,fill=rgb(PINK))
    center_text(d,"SCANSIONA · ENTRA NELLA MANDRIA",934,720,29,BG,False)
    save_outputs("sticker-01-mandria-tondo-85mm",im)
    return ("sticker-01-mandria-tondo-85mm",url,size)


def sticker_square():
    w = h = 1075
    im = Image.new("RGBA",(w,h),rgb(BG)+(255,))
    d = ImageDraw.Draw(im,"RGBA")
    decorate(d,w,h,CYAN)
    place_logo(im,(74,72,205,205))
    d.text((305,90),"STALLONI DELLO ZODIACO",font=font(36),fill=rgb(WHITE))
    d.rectangle((305,145,920,154),fill=rgb(PINK))
    d.text((76,320),"TI MANCA",font=font(92,True),fill=rgb(WHITE))
    d.text((76,418),"IL GRUPPO?",font=font(92,True),fill=rgb(LIME))
    d.text((80,562),"Serate · giochi · viaggi",font=font(38),fill=rgb(WHITE))
    d.text((80,618),"Gente presa bene, a Savona.",font=font(31),fill=rgb(MUTED))
    url = BASE_URL + "?src=sticker-savona-gruppo"
    size = add_qr(im,url,681,678,310,CYAN)
    d.text((82,760),"SCANSIONA",font=font(44,True),fill=rgb(CYAN))
    d.text((82,822),"E SCOPRI",font=font(44,True),fill=rgb(WHITE))
    d.text((82,884),"LA MANDRIA.",font=font(44,True),fill=rgb(WHITE))
    save_outputs("sticker-02-gruppo-quadrato-85mm",im)
    return ("sticker-02-gruppo-quadrato-85mm",url,size)


def sticker_vertical():
    # 70×90 mm finiti + 3 mm di abbondanza per lato = 76×96 mm a 300 dpi.
    w,h = 898,1134
    im = Image.new("RGBA",(w,h),rgb(BG)+(255,))
    d = ImageDraw.Draw(im,"RGBA")
    decorate(d,w,h,YELLOW)
    place_logo(im,(304,54,290,290))
    center_text(d,"SAVONA",338,760,92,CYAN)
    center_text(d,"LA MANDRIA",448,770,72,WHITE)
    center_text(d,"PARTE DA QUI.",526,800,72,LIME)
    url = BASE_URL + "?src=sticker-savona-citta"
    size = add_qr(im,url,292,670,314,YELLOW)
    d.rounded_rectangle((135,1000,w-135,1070),radius=22,fill=rgb(YELLOW))
    center_text(d,"SCANSIONA E CONOSCI LA COMMUNITY",1015,600,27,BG,False)
    save_outputs("sticker-03-savona-verticale-70x90mm",im)
    return ("sticker-03-savona-verticale-70x90mm",url,size)


def main():
    for folder in (ASSETS,PRINT,PREVIEW): folder.mkdir(parents=True,exist_ok=True)
    for obsolete in list(PRINT.glob("sticker-01-stallonato-*")) + list(PREVIEW.glob("sticker-01-stallonato-*")):
        obsolete.unlink()
    rows = [sticker_round(),sticker_square(),sticker_vertical()]
    with (OUT/"qr-destinazioni.csv").open("w",newline="",encoding="utf-8") as f:
        writer=csv.writer(f); writer.writerow(["variante","url","qr_px"]); writer.writerows(rows)
    print("Creati 3 sticker, 6 file stampa e 3 anteprime.")


if __name__ == "__main__": main()
