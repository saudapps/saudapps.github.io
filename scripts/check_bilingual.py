#!/usr/bin/env python3
"""Static bilingual Product Cinema contract checker (stdlib only).

Candidate validation for the bilingual work order; also safe as a permanent
regression gate. Pass --git to additionally verify protected public contracts
are untouched relative to HEAD (requires a git checkout).
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PRIMARY = [
    "index.html",
    "sshift/index.html",
    "phonespace/index.html",
    "filed/index.html",
    "dufaat/index.html",
]

SHELL_ROUTES = PRIMARY + [
    "about/index.html",
    "support/index.html",
    "legal/index.html",
    "404.html",
    "sshift/privacy/index.html",
    "phonespace/privacy.html",
    "phonespace/terms.html",
    "filed/privacy/index.html",
    "filed/terms/index.html",
    "dufaat/privacy/index.html",
    "dufaat/terms/index.html",
]

INFO_SHELL_ROUTES = SHELL_ROUTES[len(PRIMARY):]

CSS_DIRS = ["assets", "sshift", "phonespace", "filed", "dufaat"]

PROMPTBOOK_PAGES = [
    "promptbook/index.html",
    "promptbook/privacy/index.html",
    "promptbook/terms/index.html",
]

FORBIDDEN_PATHS = [
    "releases.json",
    "assets/app-data.js",
    "assets/releases-loader.js",
    "scripts/fetch-releases.mjs",
    ".github/workflows/sync-releases.yml",
    "sitemap.xml",
    "robots.txt",
    "CNAME",
] + PROMPTBOOK_PAGES

ANCHORS = {
    "index.html": ["SIGNAL 01", "apps.apple.com"],
    "sshift/index.html": ["GET SSHIFT", "apps.apple.com"],
    "phonespace/index.html": ["PhoneSpace", "apps.apple.com"],
    "filed/index.html": ["Filed", "apps.apple.com"],
    "dufaat/index.html": ["Dufaat Plus", "apps.apple.com"],
}

TOGGLE_SNIPPET = (
    '<div class="pc-site-lang" role="group" aria-label="Language" '
    'data-aria-en="Language" data-aria-ar="اللغة">'
)

failures = 0


def fail(message):
    global failures
    failures += 1
    print(f"FAIL {message}")


def check_routes():
    for route in SHELL_ROUTES:
        html = (ROOT / route).read_text(encoding="utf-8")
        header_pos = -1
        for marker in ('<header class="pc-site-header"', '<header class="topbar"'):
            pos = html.find(marker)
            if pos != -1 and (header_pos == -1 or pos < header_pos):
                header_pos = pos
        en = len(re.findall(r"data-en(?=[\s>])", html))
        ar = len(re.findall(r"data-ar(?=[\s>])", html))
        if en != ar or en == 0:
            fail(f"{route}: unbalanced pairs data-en={en} data-ar={ar}")
        if html.count('class="pc-site-skip"') != 1:
            fail(f"{route}: expected exactly one static skip link")
        mains = re.findall(r'<main[^>]*\bid="main"', html)
        if len(mains) != 1:
            fail(f"{route}: expected exactly one <main id=main>, found {len(mains)}")
        else:
            main_open = html.find("<main")
            main_close = html.find("</main>")
            if not (0 <= header_pos < main_open < main_close):
                fail(f"{route}: topbar must precede <main id=main>")
        if "classList.add('pc-site-js')" not in html:
            fail(f"{route}: missing early pc-site-js head class")
        if re.search(r'<html[^>]*lang="ar"', html):
            fail(f"{route}: served default must remain lang=en")
        if route in PRIMARY and "/promptbook/" in html:
            fail(f"{route}: must not link to Promptbook")


def check_primary_toggles_and_copy():
    for route in PRIMARY:
        html = (ROOT / route).read_text(encoding="utf-8")
        if html.count(TOGGLE_SNIPPET) != 1:
            fail(f"{route}: expected one static .pc-site-lang group")
        buttons = re.findall(r'data-lang-btn="(en|ar)"', html)
        if sorted(buttons) != ["ar", "en"]:
            fail(f"{route}: language toggle needs exactly en+ar buttons")
        for anchor in ANCHORS.get(route, []):
            if anchor not in html:
                fail(f"{route}: visible-copy anchor missing: {anchor!r}")


def check_promptbook_contract():
    for page in PROMPTBOOK_PAGES:
        path = ROOT / page
        if not path.is_file():
            continue
        html = path.read_text(encoding="utf-8")
        if "noindex" not in html:
            fail(f"{page}: Promptbook pages must stay noindex")


def check_info_shell_contract():
    css = (ROOT / "assets/product-cinema-info.css").read_text(encoding="utf-8")
    if "html.pc-info-shell" not in css:
        fail("info.css: missing html.pc-info-shell fallback gating")
    js = (ROOT / "assets/product-cinema-info.js").read_text(encoding="utf-8")
    if "pc-info-shell" not in js:
        fail("info.js: must add pc-info-shell class")
    for route in INFO_SHELL_ROUTES:
        html = (ROOT / route).read_text(encoding="utf-8")
        if "product-cinema-info.js" not in html:
            fail(f"{route}: preserved shell must load product-cinema-info.js")


def check_theme_never_writes_lang():
    js = (ROOT / "assets/product-cinema-core.js").read_text(encoding="utf-8")
    match = re.search(r"function applyTheme\(.*?\n  \}", js, re.DOTALL)
    if not match:
        fail("core.js: cannot locate applyTheme function")
        return
    body = match.group(0)
    if re.search(r"setAttribute\(\s*'(lang|dir)'", body):
        fail("core.js: applyTheme must never write lang/dir")
    if "'saudapps-theme'" not in js or "'saudapps-lang'" not in js:
        fail("core.js: theme/lang storage keys missing")


def check_css_braces():
    files = sorted(
        path
        for directory in CSS_DIRS
        for path in (ROOT / directory).rglob("*.css")
    )
    for path in files:
        text = path.read_text(encoding="utf-8")
        if text.count("{") != text.count("}"):
            fail(f"{path.relative_to(ROOT)}: unbalanced CSS braces")


def check_forbidden_scope():
    result = subprocess.run(
        ["git", "diff", "--name-only", "HEAD", "--", *FORBIDDEN_PATHS],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        fail(f"git diff failed: {result.stderr.strip()}")
        return
    changed = [line for line in result.stdout.splitlines() if line.strip()]
    for path in changed:
        fail(f"forbidden scope touched: {path}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--git", action="store_true", help="also run forbidden-scope git checks")
    args = parser.parse_args()

    check_routes()
    check_primary_toggles_and_copy()
    check_promptbook_contract()
    check_info_shell_contract()
    check_theme_never_writes_lang()
    check_css_braces()
    if args.git:
        check_forbidden_scope()

    if failures:
        print(f"\n{failures} failure(s).")
        return 1
    routes = len(SHELL_ROUTES)
    print(f"OK: {routes} routes, toggles, shells, promptbook, theme/lang separation, "
          f"CSS balance{' + forbidden scope' if args.git else ''} all pass.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
