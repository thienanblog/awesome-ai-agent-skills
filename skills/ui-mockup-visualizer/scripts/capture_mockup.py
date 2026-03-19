#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


MAC_BROWSERS = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
]


def find_browser() -> str | None:
    for candidate in MAC_BROWSERS:
        if Path(candidate).exists():
            return candidate
    for name in ("google-chrome", "chromium", "chromium-browser", "chrome"):
        path = shutil.which(name)
        if path:
            return path
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description="Capture a mockup URL to an image with a local Chromium browser.")
    parser.add_argument("--url", required=True, help="URL to capture.")
    parser.add_argument("--output", required=True, help="Output image path.")
    parser.add_argument("--width", type=int, default=1600, help="Viewport width.")
    parser.add_argument("--height", type=int, default=1200, help="Viewport height.")
    parser.add_argument("--delay", type=int, default=1200, help="Virtual time budget in ms.")
    args = parser.parse_args()

    browser = find_browser()
    if not browser:
        print("No Chrome/Chromium executable found.", file=sys.stderr)
        print("Install Chrome or use Chrome DevTools MCP / Playwright MCP for screenshot capture.", file=sys.stderr)
        return 1

    output = Path(args.output).expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    command = [
        browser,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={args.width},{args.height}",
        f"--virtual-time-budget={args.delay}",
        f"--screenshot={output}",
        args.url,
    ]

    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError:
        if "--headless=new" in command:
            command[1] = "--headless"
            subprocess.run(command, check=True)
        else:
            raise

    print(f"Saved screenshot: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
