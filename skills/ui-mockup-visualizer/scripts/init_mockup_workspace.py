#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "assets" / "mockup-template"


def template_dir_for(platform: str) -> Path:
    mapping = {
        "web-desktop": SKILL_DIR / "assets" / "mockup-template",
        "mobile-app": SKILL_DIR / "assets" / "mockup-template-mobile-app",
        "desktop-app": SKILL_DIR / "assets" / "mockup-template-desktop-app",
    }
    return mapping[platform]


def slugify(value: str) -> str:
    chars = []
    for ch in value.lower().strip():
        if ch.isalnum():
            chars.append(ch)
        elif chars and chars[-1] != "-":
            chars.append("-")
    return "".join(chars).strip("-") or "ui-mockup"


def sample_options(platform: str) -> list[dict]:
    if platform == "mobile-app":
        width, height = 390, 844
        return [
            {
                "id": "A",
                "title": "Option A",
                "summary": "Bottom sheet anchored to the active screen.",
                "recommended": False,
                "rationale": [
                    "Keeps the current task visible behind the overlay.",
                    "Fast to compare choices without leaving the screen.",
                ],
                "benchmarks": ["Airbnb filter sheet", "Uber Driver task confirmation"],
                "canvas": {"device": platform, "width": width, "height": height},
                "blocks": [
                    {"kind": "topbar", "label": "Status + top bar", "x": 0, "y": 0, "w": 390, "h": 88},
                    {"kind": "content", "label": "Current screen", "x": 0, "y": 88, "w": 390, "h": 756, "tone": "muted"},
                    {"kind": "sheet", "label": "Bottom sheet", "x": 16, "y": 432, "w": 358, "h": 372, "tone": "accent"},
                ],
            },
            {
                "id": "B",
                "title": "Option B",
                "summary": "Step screen with a single primary decision area.",
                "recommended": True,
                "rationale": [
                    "Best when the user should commit to one next action.",
                    "Lowest ambiguity for production-style flows.",
                ],
                "benchmarks": ["Apple Settings hierarchy", "Uber Driver task screen"],
                "canvas": {"device": platform, "width": width, "height": height},
                "blocks": [
                    {"kind": "topbar", "label": "Title bar", "x": 0, "y": 0, "w": 390, "h": 88},
                    {"kind": "card", "label": "Step summary", "x": 20, "y": 128, "w": 350, "h": 146},
                    {"kind": "focus", "label": "Primary action area", "x": 20, "y": 304, "w": 350, "h": 320, "tone": "accent"},
                    {"kind": "footer", "label": "Sticky CTA", "x": 20, "y": 712, "w": 350, "h": 72, "tone": "strong"},
                ],
            },
            {
                "id": "C",
                "title": "Option C",
                "summary": "Tabbed split between overview and advanced controls.",
                "recommended": False,
                "rationale": [
                    "Useful when novice and advanced needs must coexist.",
                    "Keeps the primary flow lighter than a full settings screen.",
                ],
                "benchmarks": ["Notion mobile side surface", "Apple segmented preferences"],
                "canvas": {"device": platform, "width": width, "height": height},
                "blocks": [
                    {"kind": "topbar", "label": "Title + tabs", "x": 0, "y": 0, "w": 390, "h": 116},
                    {"kind": "card", "label": "Overview panel", "x": 20, "y": 144, "w": 350, "h": 180},
                    {"kind": "focus", "label": "Config panel", "x": 20, "y": 348, "w": 350, "h": 332, "tone": "accent"},
                    {"kind": "footer", "label": "Action row", "x": 20, "y": 716, "w": 350, "h": 68},
                ],
            },
        ]

    if platform == "desktop-app":
        width, height = 1366, 900
        return [
            {
                "id": "A",
                "title": "Option A",
                "summary": "Docked inspector on the right side of the workspace.",
                "recommended": True,
                "rationale": [
                    "Fastest to scan while keeping the main workspace visible.",
                    "Strong fit for desktop operator and workstation products.",
                ],
                "benchmarks": ["Figma inspector", "Slack desktop utilities"],
                "canvas": {"device": platform, "width": width, "height": height},
                "blocks": [
                    {"kind": "topbar", "label": "Window chrome", "x": 0, "y": 0, "w": width, "h": 54},
                    {"kind": "sidebar", "label": "App rail", "x": 0, "y": 54, "w": 88, "h": 846},
                    {"kind": "content", "label": "Primary workspace", "x": 88, "y": 54, "w": 958, "h": 846, "tone": "muted"},
                    {"kind": "focus", "label": "Inspector", "x": 1046, "y": 54, "w": 320, "h": 846, "tone": "accent"},
                ],
            },
            {
                "id": "B",
                "title": "Option B",
                "summary": "Floating utility drawer over the main workspace.",
                "recommended": False,
                "rationale": [
                    "Keeps the workspace wide until the operator needs extra detail.",
                    "Good when the secondary panel is occasional rather than persistent.",
                ],
                "benchmarks": ["Notion peek view", "Slack pop-out detail"],
                "canvas": {"device": platform, "width": width, "height": height},
                "blocks": [
                    {"kind": "topbar", "label": "Window chrome", "x": 0, "y": 0, "w": width, "h": 54},
                    {"kind": "sidebar", "label": "App rail", "x": 0, "y": 54, "w": 88, "h": 846},
                    {"kind": "content", "label": "Primary workspace", "x": 88, "y": 54, "w": 1278, "h": 846, "tone": "muted"},
                    {"kind": "sheet", "label": "Floating drawer", "x": 958, "y": 94, "w": 360, "h": 744, "tone": "accent"},
                ],
            },
            {
                "id": "C",
                "title": "Option C",
                "summary": "Split workspace with inline detail column.",
                "recommended": False,
                "rationale": [
                    "Best when the detail view is part of the main workflow, not a utility.",
                    "Makes comparison easier than a hidden drawer.",
                ],
                "benchmarks": ["Linear split detail", "GitHub list + detail"],
                "canvas": {"device": platform, "width": width, "height": height},
                "blocks": [
                    {"kind": "topbar", "label": "Window chrome", "x": 0, "y": 0, "w": width, "h": 54},
                    {"kind": "sidebar", "label": "App rail", "x": 0, "y": 54, "w": 88, "h": 846},
                    {"kind": "list", "label": "Main list", "x": 88, "y": 54, "w": 538, "h": 846, "tone": "muted"},
                    {"kind": "focus", "label": "Inline detail", "x": 626, "y": 54, "w": 740, "h": 846, "tone": "accent"},
                ],
            },
        ]

    width, height = 1440, 960
    return [
        {
            "id": "A",
            "title": "Option A",
            "summary": "Full-height docked right sidebar that stays visible while browsing the page.",
            "recommended": True,
            "rationale": [
                "Best when the sidebar is a persistent review or editing surface.",
                "The surrounding page remains readable with minimal motion cost.",
            ],
            "benchmarks": ["Notion peek panel", "Slack thread sidebar"],
            "canvas": {"device": "web-desktop", "width": width, "height": height},
            "blocks": [
                {"kind": "topbar", "label": "Global header", "x": 0, "y": 0, "w": width, "h": 72},
                {"kind": "sidebar", "label": "Primary nav", "x": 0, "y": 72, "w": 96, "h": 888},
                {"kind": "content", "label": "Main content", "x": 96, "y": 72, "w": 1024, "h": 888, "tone": "muted"},
                {"kind": "focus", "label": "Right sidebar", "x": 1120, "y": 72, "w": 320, "h": 888, "tone": "accent"},
            ],
        },
        {
            "id": "B",
            "title": "Option B",
            "summary": "Floating inspector that opens above the content without permanently shrinking it.",
            "recommended": False,
            "rationale": [
                "Useful when the right-side surface is secondary or optional.",
                "Preserves maximum space for dense tables or dashboards.",
            ],
            "benchmarks": ["Notion side peek", "Shopify contextual drawer"],
            "canvas": {"device": "web-desktop", "width": width, "height": height},
            "blocks": [
                {"kind": "topbar", "label": "Global header", "x": 0, "y": 0, "w": width, "h": 72},
                {"kind": "sidebar", "label": "Primary nav", "x": 0, "y": 72, "w": 96, "h": 888},
                {"kind": "content", "label": "Main content", "x": 96, "y": 72, "w": 1344, "h": 888, "tone": "muted"},
                {"kind": "sheet", "label": "Floating inspector", "x": 1016, "y": 120, "w": 368, "h": 760, "tone": "accent"},
            ],
        },
        {
            "id": "C",
            "title": "Option C",
            "summary": "Inline split layout where the detail surface becomes part of the page body.",
            "recommended": False,
            "rationale": [
                "Strong when the user must compare the detail panel with the content continuously.",
                "Feels more integrated than a utility sidebar.",
            ],
            "benchmarks": ["Linear issue detail", "GitHub split information pages"],
            "canvas": {"device": "web-desktop", "width": width, "height": height},
            "blocks": [
                {"kind": "topbar", "label": "Global header", "x": 0, "y": 0, "w": width, "h": 72},
                {"kind": "sidebar", "label": "Primary nav", "x": 0, "y": 72, "w": 96, "h": 888},
                {"kind": "content", "label": "Content column", "x": 96, "y": 72, "w": 784, "h": 888, "tone": "muted"},
                {"kind": "focus", "label": "Integrated detail column", "x": 880, "y": 72, "w": 560, "h": 888, "tone": "accent"},
            ],
        },
    ]


def write_mockup_data(path: Path, title: str, platform: str) -> None:
    payload = {
        "question": title,
        "platform": platform,
        "notes": [
            "Replace this starter data with the real layout idea.",
            "Keep Option A, Option B, and Option C labels stable for user review.",
        ],
        "options": sample_options(platform),
    }
    lines = [
        "// Edit this file first. Keep the structure stable so the viewer stays reusable.",
        "window.mockupData = " + json.dumps(payload, indent=2) + ";",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a mockup workspace from the bundled template.")
    parser.add_argument("target_dir", help="Directory to create or update.")
    parser.add_argument("--title", default="UI mockup question", help="Human-readable mockup title.")
    parser.add_argument(
        "--platform",
        choices=["web-desktop", "mobile-app", "desktop-app"],
        default="web-desktop",
        help="Mockup platform preset.",
    )
    parser.add_argument("--overwrite", action="store_true", help="Replace existing files in the target directory.")
    args = parser.parse_args()

    target_dir = Path(args.target_dir).expanduser().resolve()
    if target_dir.exists() and any(target_dir.iterdir()) and not args.overwrite:
        raise SystemExit(f"Target directory is not empty: {target_dir}\nUse --overwrite to replace it.")

    target_dir.mkdir(parents=True, exist_ok=True)
    template_dir = template_dir_for(args.platform)
    for source in template_dir.iterdir():
        destination = target_dir / source.name
        if source.name == "mockup-data.js":
            continue
        if destination.exists() and args.overwrite:
            if destination.is_dir():
                shutil.rmtree(destination)
            else:
                destination.unlink()
        if source.is_dir():
            shutil.copytree(source, destination, dirs_exist_ok=args.overwrite)
        else:
            shutil.copy2(source, destination)

    title = args.title.strip() or "UI mockup question"
    write_mockup_data(target_dir / "mockup-data.js", title, args.platform)

    print(f"Mockup workspace ready: {target_dir}")
    print(f"Suggested slug: {slugify(title)}")
    print(f"Template: {template_dir.name}")
    print("Edit mockup-data.js first, then start the preview server.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
