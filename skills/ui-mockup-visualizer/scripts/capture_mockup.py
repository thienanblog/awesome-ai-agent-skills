#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path


MAC_BROWSERS = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
]

PLATFORM_FRAME = {
    "web-desktop": {"outer_padding": 24},
    "mobile-app": {"outer_padding": 24},
    "desktop-app": {"outer_padding": 24},
}


def find_browser() -> str | None:
    for candidate in MAC_BROWSERS:
        if Path(candidate).exists():
            return candidate
    for name in ("google-chrome", "chromium", "chromium-browser", "chrome"):
        path = shutil.which(name)
        if path:
            return path
    return None


def load_mockup_data(url: str) -> dict:
    data_url = urllib.parse.urljoin(url, "mockup-data.js")
    with urllib.request.urlopen(data_url) as response:
        raw = response.read().decode("utf-8")

    match = re.search(r"window\.mockupData\s*=\s*(\{.*\})\s*;\s*$", raw, re.DOTALL)
    if not match:
        raise RuntimeError(f"Unable to parse mockup data from {data_url}")
    return json.loads(match.group(1))


def choose_option(data: dict, option_id: str | None) -> dict:
    options = data.get("options") or []
    if not options:
        raise RuntimeError("Mockup data does not contain any options.")

    wanted = (option_id or "").strip().upper()
    if wanted:
        for option in options:
            if str(option.get("id", "")).strip().upper() == wanted:
                return option
        raise RuntimeError(f"Option not found: {option_id}")

    for option in options:
        if option.get("recommended"):
            return option
    return options[0]


def capture_size(option: dict) -> tuple[int, int]:
    canvas = option.get("canvas") or {}
    width = int(canvas.get("width") or 0)
    height = int(canvas.get("height") or 0)
    platform = str(canvas.get("device") or "web-desktop")
    frame = PLATFORM_FRAME.get(platform, PLATFORM_FRAME["web-desktop"])
    outer_padding = int(frame["outer_padding"])
    return width + outer_padding * 2, height + outer_padding * 2


def build_capture_url(url: str, option_id: str) -> str:
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    query["capture"] = ["1"]
    query["option"] = [option_id]
    capture_query = urllib.parse.urlencode(query, doseq=True)
    return urllib.parse.urlunparse(parsed._replace(query=capture_query, fragment=""))


def run_capture_command(command: list[str], output: Path) -> None:
    process = subprocess.Popen(command, start_new_session=True)
    deadline = time.monotonic() + 25

    while time.monotonic() < deadline:
        code = process.poll()
        if code is not None:
            if code != 0:
                raise subprocess.CalledProcessError(code, command)
            return
        if output.exists() and output.stat().st_size > 0:
            time.sleep(1.0)
            if process.poll() is None:
                try:
                    os.killpg(process.pid, 15)
                except ProcessLookupError:
                    pass
            process.wait(timeout=5)
            return
        time.sleep(0.25)

    process.kill()
    process.wait(timeout=5)
    raise subprocess.CalledProcessError(process.returncode or 1, command)


def main() -> int:
    parser = argparse.ArgumentParser(description="Capture a mockup URL to an image with a local Chromium browser.")
    parser.add_argument("--url", required=True, help="URL to capture.")
    parser.add_argument("--output", required=True, help="Output image path.")
    parser.add_argument("--option", help="Option id to capture. Defaults to the recommended option.")
    parser.add_argument("--width", type=int, help="Override viewport width.")
    parser.add_argument("--height", type=int, help="Override viewport height.")
    parser.add_argument("--delay", type=int, default=1200, help="Virtual time budget in ms.")
    args = parser.parse_args()

    browser = find_browser()
    if not browser:
        print("No Chrome/Chromium executable found.", file=sys.stderr)
        print("Install Chrome or use Chrome DevTools MCP / Playwright MCP for screenshot capture.", file=sys.stderr)
        return 1

    try:
        data = load_mockup_data(args.url)
        option = choose_option(data, args.option)
        option_id = str(option.get("id") or "A").strip().upper()
        capture_url = build_capture_url(args.url, option_id)
        viewport_width, viewport_height = capture_size(option)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1

    output = Path(args.output).expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    command = [
        browser,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={args.width or viewport_width},{args.height or viewport_height}",
        f"--virtual-time-budget={args.delay}",
        f"--screenshot={output}",
        capture_url,
    ]

    try:
        run_capture_command(command, output)
    except subprocess.CalledProcessError:
        if "--headless=new" in command:
            command[1] = "--headless"
            run_capture_command(command, output)
        else:
            raise

    print(f"Saved screenshot: {output}")
    print(f"Captured option: {option_id}")
    print(f"Capture URL: {capture_url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
