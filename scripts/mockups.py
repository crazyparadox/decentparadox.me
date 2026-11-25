#!/usr/bin/env python3
"""Builds the project mockup images used as thumbnails on the home page.

Each mockup is a small HTML composition (app windows and phones) made from the real screenshots in
public/static/images, set on a painted background from public/static/images/mockups/bg/<project>.jpg
(generated in Flowy, in the style of an impressionist oil-on-canvas meadow). It is rendered with
headless Chrome at 1600 x 1000 and saved as public/static/images/mockups/<project>.jpg.
A project with no background file falls back to a plain dark stage.

    python3 scripts/mockups.py            # needs Google Chrome and macOS `sips`
"""
import os, subprocess, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'public', 'static', 'images')
OUT = os.path.join(IMG, 'mockups')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

CSS = '''
*{box-sizing:border-box;margin:0}
html,body{width:1600px;height:1000px;overflow:hidden;background:#0f0d0d}
.stage{position:relative;width:1600px;height:1000px;overflow:hidden;
  background:radial-gradient(1200px 700px at 50% 38%,#1c1919 0%,#0f0d0d 70%)}
.stage .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.1)}  /* crops any painted canvas edge */
.win{position:absolute;border-radius:14px;overflow:hidden;background:#161313;border:1px solid #3a3535;
  box-shadow:0 30px 80px rgba(20,14,10,.45)}
.win .bar{height:34px;display:flex;align-items:center;gap:8px;padding:0 14px;background:#1d1a1a;border-bottom:1px solid #2d2929}
.win .bar i{width:10px;height:10px;border-radius:50%;background:#4a4444}
.win .bar i:first-child{background:#ff6f52}
.win img{display:block;width:100%}
.card{position:absolute;overflow:hidden;border-radius:6px;border:1px solid #3a3535;background:#161313;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.card img{display:block;width:100%;height:100%;object-fit:cover;object-position:top left}
.phone{position:absolute;border-radius:46px;padding:10px;background:#0a0909;border:1px solid #4a4444;box-shadow:0 40px 90px rgba(0,0,0,.6)}
.phone img{display:block;width:100%;border-radius:36px}
.tick{position:absolute;width:13px;height:13px}
.tick:before,.tick:after{content:"";position:absolute;background:#5a5350}
.tick:before{left:6px;top:0;width:1px;height:13px}.tick:after{top:6px;left:0;height:1px;width:13px}
'''
TICKS = ''.join(f'<span class="tick" style="left:{x}px;top:{y}px"></span>' for x, y in ((40, 40), (1547, 40), (40, 947), (1547, 947)))
BAR = '<div class="bar"><i></i><i></i><i></i></div>'


def win(src, left, top, width, extra=''):
    return f'<div class="win" style="left:{left}px;top:{top}px;width:{width}px;{extra}">{BAR}<img src="{IMG}/{src}"></div>'


def card(src, left, top, w, h, extra=''):
    return f'<div class="card" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;{extra}"><img src="{IMG}/{src}"></div>'


def phone(src, left, top, width, extra=''):
    return f'<div class="phone" style="left:{left}px;top:{top}px;width:{width}px;{extra}"><img src="{IMG}/{src}"></div>'


MOCKUPS = {
    # two app windows, the docs behind the editor
    'neumann': win('shots/neumann-docs.png', 120, 90, 980, 'opacity:.45') + win('shots/neumann-home.png', 330, 190, 1150),
    # the chat window with a shared thread laid over its corner
    'tethra': win('shots/tethra-chat.png', 170, 150, 1120) + card('showcase/tethra-thread.png', 1000, 520, 480, 447),
    # the home page in front, how-it-works behind
    'panopticon': win('shots/panopticon-how.png', 150, 130, 860, 'opacity:.92') + win('shots/panopticon-home.png', 400, 250, 1050),
    # the public site with the organiser's phone screens beside it
    'bi0s': win('shots/bi0s-home.png', 110, 170, 1000) + phone('showcase/bi0s-create.png', 1010, 250, 290) + phone('showcase/bi0s-admin.png', 1260, 150, 290),
    # three phones, the middle one raised
    'cue': phone('showcase/cue-actions.png', 330, 250, 300) + phone('showcase/cue-speak.png', 650, 130, 300) + phone('showcase/cue-places.png', 970, 250, 300),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for name, body in MOCKUPS.items():
            html = os.path.join(tmp, name + '.html')
            png = os.path.join(tmp, name + '.png')
            bg = os.path.join(OUT, 'bg', name + '.jpg')
            back = f'<img class="bg" src="{bg}">' if os.path.exists(bg) else TICKS
            open(html, 'w').write(f'<!doctype html><meta charset="utf-8"><style>{CSS}</style><div class="stage">{back}{body}</div>')
            subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
                            f'--user-data-dir={tmp}/profile', '--window-size=1600,1000', '--virtual-time-budget=4000',
                            f'--screenshot={png}', 'file://' + html], check=True, capture_output=True)
            jpg = os.path.join(OUT, name + '.jpg')
            subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', jpg], check=True, capture_output=True)
            print(name, os.path.getsize(jpg) // 1024, 'KB')


if __name__ == '__main__':
    main()
