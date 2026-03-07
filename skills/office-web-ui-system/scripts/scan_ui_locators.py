#!/usr/bin/env python3
"""
Scan important semantic UI locator classes in a repo.

Examples:
    python3 scan_ui_locators.py /path/to/repo
    python3 scan_ui_locators.py /path/to/repo --match layout-sidebar
    python3 scan_ui_locators.py /path/to/repo --prefix quote-create-page__
    python3 scan_ui_locators.py /path/to/repo --json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

SUPPORTED_SUFFIXES = (
    ".vue",
    ".tsx",
    ".jsx",
    ".html",
    ".scss",
    ".css",
    ".blade.php",
)

IMPORTANT_KEYWORDS = {
    "page",
    "panel",
    "dock",
    "toolbar",
    "filter",
    "table",
    "hero",
    "sidebar",
    "topbar",
    "flyout",
    "workspace",
    "shell",
    "search",
    "action",
    "card",
}

TOKEN_PATTERN = re.compile(r"[A-Za-z][A-Za-z0-9_-]*")


def is_supported(path: Path) -> bool:
    path_str = str(path)
    return any(path_str.endswith(suffix) for suffix in SUPPORTED_SUFFIXES)


def normalize_token(token: str) -> str:
    return token.strip().strip(".#,:{[()]};")


def looks_semantic(token: str) -> bool:
    if not token or token.startswith("!"):
        return False
    if token.endswith(("-", "_")):
        return False
    if token.startswith(("dark:", "sm:", "md:", "lg:", "xl:", "2xl:", "hover:", "focus:", "active:", "disabled:", "aria-", "data-")):
        return False
    if "__" not in token and "--" not in token and "-" not in token:
        return False
    lowered = token.lower()
    return any(keyword in lowered for keyword in IMPORTANT_KEYWORDS)


def should_include(token: str, match: str | None, prefix: str | None) -> bool:
    if match and match not in token:
        return False
    if prefix and not token.startswith(prefix):
        return False
    return looks_semantic(token)


def scan_file(path: Path, match: str | None, prefix: str | None) -> list[tuple[str, int]]:
    hits: list[tuple[str, int]] = []
    try:
        lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    except OSError:
        return hits

    for line_number, line in enumerate(lines, start=1):
        for raw in TOKEN_PATTERN.findall(line):
            token = normalize_token(raw)
            if should_include(token, match, prefix):
                hits.append((token, line_number))
    return hits


def build_report(root: Path, match: str | None, prefix: str | None) -> dict:
    classes: dict[str, dict] = defaultdict(lambda: {"count": 0, "files": defaultdict(list)})

    for path in root.rglob("*"):
        if not path.is_file() or not is_supported(path):
            continue

        for token, line_number in scan_file(path, match, prefix):
            record = classes[token]
            record["count"] += 1
            record["files"][str(path)].append(line_number)

    normalized = {}
    for token, record in sorted(classes.items()):
        files = {file_path: sorted(set(lines)) for file_path, lines in sorted(record["files"].items())}
        ambiguity = len(files) > 1 and not token.endswith(("-item", "__item", "-row", "__row", "-card", "__card"))
        normalized[token] = {
            "count": record["count"],
            "files": files,
            "ambiguous_major_region": ambiguity,
        }

    return {
        "root": str(root),
        "match": match,
        "prefix": prefix,
        "classes": normalized,
    }


def print_text(report: dict) -> None:
    print(f"UI locator scan: {report['root']}")
    if report["match"]:
        print(f"Filter match: {report['match']}")
    if report["prefix"]:
        print(f"Filter prefix: {report['prefix']}")

    classes = report["classes"]
    if not classes:
        print("No matching semantic locator classes found.")
        return

    for token, details in classes.items():
        marker = " [ambiguous-major-region]" if details["ambiguous_major_region"] else ""
        print(f"\n{token} ({details['count']}){marker}")
        for file_path, lines in details["files"].items():
            joined = ", ".join(str(line) for line in lines)
            print(f"  - {file_path}: {joined}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scan important semantic UI locator classes.")
    parser.add_argument("repo_path", help="Path to the repo or source directory to scan.")
    parser.add_argument("--match", help="Only include classes containing this token fragment.")
    parser.add_argument("--prefix", help="Only include classes starting with this prefix.")
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of plain text.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.repo_path).expanduser().resolve()

    if not root.exists() or not root.is_dir():
        print(f"Invalid repo path: {root}", file=sys.stderr)
        return 1

    report = build_report(root, args.match, args.prefix)

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=True))
    else:
        print_text(report)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
