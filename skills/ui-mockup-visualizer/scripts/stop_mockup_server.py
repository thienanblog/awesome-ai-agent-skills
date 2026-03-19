#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import signal
from pathlib import Path


STATE_FILE = ".mockup-server.json"


def terminate(pid: int) -> None:
    try:
        os.killpg(pid, signal.SIGTERM)
    except ProcessLookupError:
        return
    except PermissionError:
        os.kill(pid, signal.SIGTERM)


def main() -> int:
    parser = argparse.ArgumentParser(description="Stop a mockup preview server created by start_mockup_server.py.")
    parser.add_argument("root", help="Mockup directory that contains .mockup-server.json")
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    state_path = root / STATE_FILE
    if not state_path.exists():
        raise SystemExit(f"State file not found: {state_path}")

    state = json.loads(state_path.read_text(encoding="utf-8"))
    pid = int(state["pid"])
    terminate(pid)
    state_path.unlink(missing_ok=True)

    print(f"Stopped server pid {pid}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
