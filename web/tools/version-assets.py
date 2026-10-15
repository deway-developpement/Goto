#!/usr/bin/env python3
"""Fingerprint public assets and update HTML/CSS references. No dependencies."""
import hashlib
from pathlib import Path
import re

site = Path(__file__).resolve().parents[1] / "site"
assets = site / "assets"
html = site / "index.html"

def version(paths):
    for path in paths:
        digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
        stem = re.sub(r"\.[0-9a-f]{12}$", "", path.stem)
        target = path.with_name(f"{stem}.{digest}{path.suffix}")
        if path == target:
            continue
        old = path.name
        path.rename(target)
        for text_path in [html, *assets.glob("*.css")]:
            text = text_path.read_text()
            text_path.write_text(text.replace(old, target.name))

# Fonts/images first: CSS embeds the font filenames and must be hashed last.
version(sorted(p for p in assets.iterdir() if p.is_file() and p.suffix != ".css"))
version(sorted(assets.glob("*.css")))
print("Asset filenames and references updated.")
