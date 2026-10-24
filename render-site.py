#!/usr/bin/env python3
"""Genera HTML statico dai componenti condivisi, senza dipendenze.

Il deploy pubblica i file già generati: nessuna build sul server.
"""
from pathlib import Path
from hashlib import sha256
from html import escape
import re
import sys

ROOT = Path(__file__).resolve().parent
SITE = ROOT / 'landing'
SOURCE = ROOT / 'site-source'

def digest(path):
    return sha256((SITE / path).read_bytes()).hexdigest()[:12]

def render(text, values):
    for key, value in values.items():
        text = text.replace('{{' + key + '}}', value)
    if re.search(r'\{\{[A-Z_]+\}\}', text):
        raise ValueError('Token non risolto nel template')
    return re.sub(r"(?m)[ \t]+$", "", text)

def page(qr=False):
    base = '../' if qr else ''
    values = {
        'BASE': base,
        'TITLE': 'Hai trovato la mandria!' if qr else 'La caccia è aperta',
        'DESCRIPTION': escape('Serate, giochi e viaggi con gli Stalloni dello Zodiaco. Scopri la community su Instagram: @stalloni_official.' if qr else 'QR sparsi per Savona, una mandria da scoprire e un premio per chi trova quello giusto. Non devi trovarli tutti. Il premio? Sorpresa 👀', quote=True),
        'CANONICAL': 'https://frappaf.github.io/stalloni-dello-zodiaco/' + ('stallonati/' if qr else ''),
        'STYLE_HASH': digest('style.css'),
        'COMMUNITY_HASH': digest('modules/community.js'),
        'QR_SCRIPT': f'<script src="{base}modules/qr-intro.js?v={digest("modules/qr-intro.js")}" defer></script>' if qr else '',
    }
    def template(name): return render((SOURCE / name).read_text(), values)
    def component(name): return render((SITE / 'components' / (name + '.html')).read_text(), values)
    intro = template('intro.html') if qr else ''
    content = template('qr.html' if qr else 'home.html')
    common = ''.join(component(name) for name in ['activities', 'about', 'mandria', 'faq', 'character'])
    return '<!doctype html>\n<!-- Generato da render-site.py; modificare site-source/ e landing/components/. -->\n<html lang="it">\n' + template('head.html') + '<body>\n<a class="skip-link" href="#top">Vai al contenuto</a>\n' + intro + component('header') + '\n<main id="top" tabindex="-1">\n' + content + common + '\n</main>\n' + component('footer') + '\n<canvas class="confetti" id="confetti" aria-hidden="true"></canvas>\n</body>\n</html>\n'

outputs = {SITE / 'index.html': page(), SITE / 'stallonati/index.html': page(True)}
# La pagina privacy condivide lo stesso CSS con invalidazione della cache.
privacy = (SITE / 'privacy.html').read_text()
outputs[SITE / 'privacy.html'] = re.sub(r'href="style\.css(?:\?v=[^"]*)?"', f'href="style.css?v={digest("style.css")}"', privacy)
if '--check' in sys.argv:
    stale = [str(p.relative_to(ROOT)) for p, s in outputs.items() if p.read_text() != s]
    if stale: raise SystemExit('File da rigenerare: ' + ', '.join(stale))
    print('HTML generato aggiornato.')
else:
    for path, text in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
    print('Generate home, pagina QR e versione CSS privacy.')
