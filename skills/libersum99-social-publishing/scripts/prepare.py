#!/usr/bin/env python3
"""Copy a self-contained scene into a new output directory."""
import argparse
from pathlib import Path
import shutil


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('scene', choices=['cards', 'wechat'])
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    output = args.output.resolve()
    if output.exists():
        parser.error('Output already exists; choose a new directory to preserve edits.')
    if output == root or root in output.parents:
        parser.error('Output must be outside the installed Skill.')
    output.mkdir(parents=True)
    try:
        shutil.copyfile(root / 'assets' / f'template-{args.scene}.html', output / 'index.html')
        (output / 'assets').mkdir()
        for asset in (root / 'assets').iterdir():
            if asset.suffix in {'.png', '.svg'}:
                shutil.copyfile(asset, output / 'assets' / asset.name)
        shutil.copyfile(root / 'LICENSE', output / 'LICENSE')
    except Exception:
        shutil.rmtree(output)
        raise
    print(output / 'index.html')


if __name__ == '__main__':
    main()
