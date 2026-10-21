#!/usr/bin/env python3
"""Rigenera tutti gli asset della landing secondo la brand identity neon."""

from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ASSETS = Path(__file__).resolve().parent
REPO = ASSETS.parents[1]
SYMBOL_SOURCE = REPO / "brand" / "stickers" / "assets" / "simbolo-stalloni.png"
BRAND = ASSETS / "brand"
BACKGROUNDS = ASSETS / "backgrounds"
ILLUSTRATIONS = ASSETS / "illustrations"

BG = "#080910"
SURFACE = "#151124"
WHITE = "#F5F3FF"
MUTED = "#B9B3CE"
CYAN = "#00D5E8"
PINK = "#FF239D"
LIME = "#C1F600"
YELLOW = "#FFD323"
PURPLE = "#8026CE"

FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
SCALE = 2


def rgba(color, alpha=255):
    color = color.lstrip("#")
    return tuple(int(color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def sc(value):
    return int(round(value * SCALE))


def points(values):
    return tuple(sc(value) for value in values)


def font(size, black=False):
    return ImageFont.truetype(FONT_BLACK if black else FONT_BOLD, sc(size))


def canvas(size, color=BG):
    return Image.new("RGBA", (sc(size[0]), sc(size[1])), rgba(color))


def finish(image, size, path, quality=92):
    image = image.resize(size, Image.Resampling.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        image.convert("RGB").save(path, quality=quality, optimize=True)
    else:
        image.save(path, format="WEBP" if path.suffix.lower() == ".webp" else "PNG", quality=quality, method=6)


def add_symbol(image, box):
    symbol = Image.open(SYMBOL_SOURCE).convert("RGBA")
    symbol.thumbnail((sc(box[2]), sc(box[3])), Image.Resampling.LANCZOS)
    x = sc(box[0]) + (sc(box[2]) - symbol.width) // 2
    y = sc(box[1]) + (sc(box[3]) - symbol.height) // 2
    image.alpha_composite(symbol, (x, y))


def centered_text(draw, text, y, max_width, size, color=WHITE, black=True, center_x=None):
    while size > 12:
        current = font(size, black)
        bbox = draw.textbbox((0, 0), text, font=current)
        if bbox[2] - bbox[0] <= sc(max_width):
            break
        size -= 1
    width = bbox[2] - bbox[0]
    x = (draw._image.width - width) // 2 if center_x is None else sc(center_x) - width // 2
    draw.text((x, sc(y)), text, font=current, fill=rgba(color))


def rounded_frame(draw, width, height, accent=CYAN, insets=(24, 42), radius=34):
    for index, inset in enumerate(insets):
        draw.rounded_rectangle(
            points((inset, inset, width - inset, height - inset)),
            radius=sc(radius - index * 6),
            outline=rgba(accent, 255 if index == 0 else 120),
            width=sc(3 if index == 0 else 2),
        )


def add_glow(image, box, color, blur=70, alpha=100):
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse(points(box), fill=rgba(color, alpha))
    image.alpha_composite(layer.filter(ImageFilter.GaussianBlur(sc(blur))))


def create_full_logo():
    size = (720, 720)
    im = canvas(size)
    add_glow(im, (150, 80, 570, 500), PURPLE, 85, 90)
    d = ImageDraw.Draw(im, "RGBA")
    d.rounded_rectangle(points((18, 18, 702, 702)), radius=sc(58), outline=rgba(PINK), width=sc(10))
    d.rounded_rectangle(points((42, 42, 678, 678)), radius=sc(46), outline=rgba(CYAN, 190), width=sc(4))
    add_symbol(im, (205, 62, 310, 310))
    centered_text(d, "STALLONI", 384, 610, 78, WHITE)
    centered_text(d, "DELLO ZODIACO", 475, 610, 57, LIME)
    d.rounded_rectangle(points((184, 578, 536, 632)), radius=sc(18), fill=rgba(PINK))
    centered_text(d, "COMMUNITY", 591, 320, 26, BG, black=False)
    finish(im, size, BRAND / "logo-completo.webp")


def create_emblem():
    size = (600, 600)
    im = canvas(size)
    add_glow(im, (100, 100, 500, 500), PURPLE, 80, 95)
    d = ImageDraw.Draw(im, "RGBA")
    d.ellipse(points((18, 18, 582, 582)), outline=rgba(PINK), width=sc(12))
    d.ellipse(points((42, 42, 558, 558)), outline=rgba(CYAN, 190), width=sc(5))
    add_symbol(im, (92, 92, 416, 416))
    finish(im, size, BRAND / "emblema-stalloni.webp")


def create_icons():
    source = Image.open(SYMBOL_SOURCE).convert("RGBA")
    # Favicon trasparente, con il simbolo più grande possibile.
    favicon = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    icon = source.copy()
    icon.thumbnail((120, 120), Image.Resampling.LANCZOS)
    favicon.alpha_composite(icon, ((128 - icon.width) // 2, (128 - icon.height) // 2))
    favicon.resize((64, 64), Image.Resampling.LANCZOS).save(ASSETS / "favicon.png", optimize=True)

    apple = Image.new("RGB", (180, 180), rgba(BG)[:3])
    d = ImageDraw.Draw(apple)
    d.rounded_rectangle((4, 4, 175, 175), radius=38, outline=rgba(CYAN)[:3], width=5)
    icon = source.copy()
    icon.thumbnail((152, 152), Image.Resampling.LANCZOS)
    apple.paste(icon, ((180 - icon.width) // 2, (180 - icon.height) // 2), icon)
    apple.save(ASSETS / "apple-touch-icon.png", optimize=True)


def star(draw, x, y, radius, color, alpha=210):
    pts = []
    for i in range(8):
        angle = -math.pi / 2 + i * math.pi / 4
        r = radius if i % 2 == 0 else radius * .28
        pts.append((sc(x + math.cos(angle) * r), sc(y + math.sin(angle) * r)))
    draw.polygon(pts, fill=rgba(color, alpha))


def create_hero(size, filename, seed):
    width, height = size
    im = canvas(size)
    add_glow(im, (-width * .18, -height * .25, width * .52, height * 1.05), PINK, 110, 115)
    add_glow(im, (width * .58, -height * .22, width * 1.18, height * 1.02), CYAN, 120, 95)
    add_glow(im, (width * .28, height * .25, width * .72, height * 1.18), PURPLE, 105, 100)
    d = ImageDraw.Draw(im, "RGBA")
    # Orbite sottili e pulite, riprese dalle cornici degli sticker.
    d.arc(points((-width * .08, -height * .55, width * .68, height * 1.2)), 300, 80, fill=rgba(PINK, 150), width=sc(3))
    d.arc(points((width * .32, -height * .55, width * 1.08, height * 1.2)), 100, 240, fill=rgba(CYAN, 145), width=sc(3))
    rng = random.Random(seed)
    colors = (WHITE, CYAN, PINK, YELLOW, LIME)
    for _ in range(max(45, width // 18)):
        x, y = rng.uniform(22, width - 22), rng.uniform(18, height - 20)
        r = rng.choice((1.2, 1.6, 2.2, 3.2))
        if rng.random() < .18:
            star(d, x, y, r * 2.6, rng.choice(colors), 180)
        else:
            d.ellipse(points((x-r, y-r, x+r, y+r)), fill=rgba(rng.choice(colors), 145))
    finish(im, size, BACKGROUNDS / filename, 90)


def create_pattern():
    size = (900, 600)
    im = Image.new("RGBA", (sc(size[0]), sc(size[1])), (0, 0, 0, 0))
    d = ImageDraw.Draw(im, "RGBA")
    rng = random.Random(42)
    colors = (CYAN, PINK, YELLOW, PURPLE, LIME)
    for row in range(4):
        for col in range(6):
            x = 80 + col * 150 + (row % 2) * 55
            y = 60 + row * 155
            color = colors[(row + col) % len(colors)]
            radius = 24 + (row + col) % 3 * 5
            d.ellipse(points((x-radius, y-radius, x+radius, y+radius)), outline=rgba(color, 95), width=sc(3))
            if (row + col) % 2:
                star(d, x, y, radius * .55, color, 105)
            else:
                d.arc(points((x-radius*.55, y-radius*.55, x+radius*.55, y+radius*.55)), 25, 335, fill=rgba(color, 120), width=sc(3))
            # Piccola costellazione: tre punti e due segmenti.
            offsets = ((-55, 42), (-26, 58), (5, 36))
            pts = [(x+dx, y+dy) for dx, dy in offsets]
            d.line([(sc(px), sc(py)) for px, py in pts], fill=rgba(color, 70), width=sc(2))
            for px, py in pts:
                d.ellipse(points((px-3, py-3, px+3, py+3)), fill=rgba(color, 115))
    finish(im, size, BACKGROUNDS / "zodiac-pattern.webp", 88)


def illustration_base(accent):
    size = (800, 533)
    im = Image.new("RGBA", (sc(size[0]), sc(size[1])), (0, 0, 0, 0))
    add_glow(im, (170, 70, 630, 510), accent, 95, 70)
    d = ImageDraw.Draw(im, "RGBA")
    d.rounded_rectangle(points((35, 35, 765, 498)), radius=sc(42), fill=rgba(SURFACE, 235), outline=rgba(accent), width=sc(4))
    d.rounded_rectangle(points((56, 56, 744, 477)), radius=sc(34), outline=rgba(accent, 85), width=sc(2))
    return im, d


def create_serate():
    im, d = illustration_base(PINK)
    # Calice, disco ball e bollicine: forme essenziali, senza mascotte.
    d.ellipse(points((500, 92, 650, 242)), fill=rgba(SURFACE), outline=rgba(CYAN), width=sc(7))
    for offset in (0, 38, 76, 114):
        d.line(points((515+offset, 110, 515+offset, 224)), fill=rgba(CYAN, 100), width=sc(2))
        d.line(points((510, 118+offset*.75, 640, 118+offset*.75)), fill=rgba(CYAN, 100), width=sc(2))
    d.line(points((575, 242, 575, 285)), fill=rgba(CYAN), width=sc(6))
    d.line(points((530, 285, 620, 285)), fill=rgba(CYAN), width=sc(6))
    d.polygon([points((160, 145)), points((430, 145)), points((325, 330)), points((265, 330))], fill=rgba(PINK, 38), outline=rgba(PINK))
    d.line(points((295, 330, 295, 405)), fill=rgba(WHITE), width=sc(8))
    d.line(points((230, 405, 360, 405)), fill=rgba(WHITE), width=sc(8))
    d.polygon([points((180, 168)), points((408, 168)), points((345, 275)), points((242, 275))], fill=rgba(PINK, 115))
    d.ellipse(points((340, 175, 390, 225)), outline=rgba(YELLOW), width=sc(7))
    for x, y, r, color in ((130,110,8,YELLOW),(690,165,7,LIME),(455,330,9,CYAN),(120,360,6,PINK),(675,365,8,YELLOW)):
        star(d, x, y, r, color)
    finish(im, (800, 533), ILLUSTRATIONS / "serate.webp")


def create_game_night():
    im, d = illustration_base(CYAN)
    # Controller centrale.
    d.rounded_rectangle(points((190, 160, 610, 380)), radius=sc(82), fill=rgba(BG), outline=rgba(CYAN), width=sc(8))
    d.ellipse(points((250, 215, 340, 305)), outline=rgba(WHITE), width=sc(6))
    d.line(points((268, 260, 322, 260)), fill=rgba(WHITE), width=sc(10))
    d.line(points((295, 233, 295, 287)), fill=rgba(WHITE), width=sc(10))
    for x, y, color in ((500,235,PINK),(545,270,YELLOW),(490,310,LIME),(455,270,CYAN)):
        d.ellipse(points((x-13,y-13,x+13,y+13)), fill=rgba(color))
    # Carte e dado, separati dal controller.
    d.rounded_rectangle(points((82, 90, 185, 235)), radius=sc(12), fill=rgba(WHITE), outline=rgba(PINK), width=sc(5))
    star(d, 133, 162, 25, PINK)
    d.rounded_rectangle(points((625, 310, 720, 405)), radius=sc(14), fill=rgba(WHITE), outline=rgba(YELLOW), width=sc(5))
    for x,y in ((648,333),(697,333),(672,357),(648,382),(697,382)):
        d.ellipse(points((x-6,y-6,x+6,y+6)), fill=rgba(BG))
    finish(im, (800, 533), ILLUSTRATIONS / "game-night.webp")


def create_viaggi():
    im, d = illustration_base(YELLOW)
    # Valigia e percorso con aeroplano stilizzato.
    d.rounded_rectangle(points((205, 165, 470, 415)), radius=sc(28), fill=rgba(BG), outline=rgba(YELLOW), width=sc(8))
    d.arc(points((275, 105, 400, 225)), 185, 355, fill=rgba(YELLOW), width=sc(9))
    d.line(points((285, 205, 285, 375)), fill=rgba(PINK, 170), width=sc(5))
    d.line(points((390, 205, 390, 375)), fill=rgba(CYAN, 170), width=sc(5))
    d.ellipse(points((255, 402, 295, 442)), fill=rgba(WHITE))
    d.ellipse(points((382, 402, 422, 442)), fill=rgba(WHITE))
    route = [points((505,375)), points((555,335)), points((525,285)), points((590,245)), points((565,190)), points((650,135))]
    d.line(route, fill=rgba(CYAN), width=sc(5), joint="curve")
    for px, py in ((505,375),(555,335),(525,285),(590,245),(565,190)):
        d.ellipse(points((px-7,py-7,px+7,py+7)), fill=rgba(PINK))
    d.polygon([points((650,105)),points((676,146)),points((720,155)),points((680,175)),points((676,220)),points((650,185)),points((610,202)),points((630,160)),points((602,130)),points((642,137))], fill=rgba(WHITE), outline=rgba(CYAN))
    finish(im, (800, 533), ILLUSTRATIONS / "viaggi.webp")


def create_og():
    size = (1200, 630)
    im = canvas(size)
    add_glow(im, (-120, -80, 520, 700), PINK, 120, 100)
    add_glow(im, (720, -100, 1340, 680), CYAN, 130, 90)
    d = ImageDraw.Draw(im, "RGBA")
    d.rounded_rectangle(points((24, 24, 1176, 606)), radius=sc(42), outline=rgba(PINK), width=sc(8))
    d.rounded_rectangle(points((47, 47, 1153, 583)), radius=sc(34), outline=rgba(CYAN, 170), width=sc(3))
    add_symbol(im, (80, 130, 360, 360))
    d.text(points((500, 152)), "STALLONI", font=font(72, True), fill=rgba(WHITE))
    d.text(points((500, 235)), "DELLO ZODIACO", font=font(52, True), fill=rgba(LIME))
    d.rectangle(points((500, 315, 1070, 323)), fill=rgba(PINK))
    d.text(points((500, 355)), "HAI TROVATO LA MANDRIA", font=font(31), fill=rgba(WHITE))
    d.text(points((500, 407)), "Serate · giochi · viaggi", font=font(27), fill=rgba(MUTED))
    finish(im, size, ASSETS / "og.jpg", 94)


def main():
    for folder in (BRAND, BACKGROUNDS, ILLUSTRATIONS):
        folder.mkdir(parents=True, exist_ok=True)
    create_full_logo()
    create_emblem()
    create_icons()
    create_hero((1600, 667), "hero-cosmic.webp", 19)
    create_hero((900, 375), "hero-cosmic-mobile.webp", 23)
    create_pattern()
    create_serate()
    create_game_night()
    create_viaggi()
    create_og()
    print("Rigenerati logo, emblema, icone, sfondi, illustrazioni e immagine social.")


if __name__ == "__main__":
    main()
