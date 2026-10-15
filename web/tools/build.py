#!/usr/bin/env python3
"""Build a static site with content-versioned assets; never modify source files."""
import argparse
import hashlib
from pathlib import Path
import shutil


def build(source, output):
    source = Path(source).resolve()
    output = Path(output).resolve()
    if source == output or source in output.parents or output in source.parents:
        raise ValueError('Source and output must be separate, non-nested directories')
    if not (source / 'index.html').is_file():
        raise ValueError('Source must contain index.html')
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(source, output)
    assets = output / 'assets'

    def fingerprint(paths):
        for path in paths:
            digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
            target = path.with_name(f'{path.stem}.{digest}{path.suffix}')
            path.rename(target)
            # Current assets are flat. Rewrite exact filenames, including local font URLs.
            for text_path in [output / 'index.html', *assets.glob('*.css'), *assets.glob('*.js')]:
                text = text_path.read_text(encoding='utf-8')
                text_path.write_text(text.replace(path.name, target.name), encoding='utf-8')

    # Binary assets first, then JS and CSS after their local URLs have been rewritten.
    fingerprint(sorted(p for p in assets.iterdir() if p.is_file() and p.suffix not in {'.css', '.js'}))
    fingerprint(sorted(assets.glob('*.js')))
    fingerprint(sorted(assets.glob('*.css')))
    return output


def main():
    web = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=web / 'src')
    parser.add_argument('--output', type=Path, default=web / 'dist')
    args = parser.parse_args()
    output = build(args.source, args.output)
    print(f'Built static site: {output}')


if __name__ == '__main__':
    main()
