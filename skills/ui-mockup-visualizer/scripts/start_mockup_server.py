#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import socket
import subprocess
import sys
import time
from pathlib import Path


STATE_FILE = ".mockup-server.json"
LOG_FILE = ".mockup-server.log"


def find_free_port(host: str, preferred: int) -> int:
    for port in range(preferred, preferred + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind((host, port))
            except OSError:
                continue
            return port
    raise RuntimeError("No free port found in the reserved range.")


def main() -> int:
    parser = argparse.ArgumentParser(description="Start a static preview server for a mockup directory.")
    parser.add_argument("root", help="Mockup directory to serve.")
    parser.add_argument("--host", default="127.0.0.1", help="Bind address. Default: 127.0.0.1")
    parser.add_argument("--port", type=int, default=4173, help="Preferred starting port. Default: 4173")
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        raise SystemExit(f"Directory not found: {root}")
    if not (root / "index.html").exists():
        raise SystemExit(f"index.html not found in {root}")

    state_path = root / STATE_FILE
    if state_path.exists():
        raise SystemExit(f"Server state already exists: {state_path}\nStop it first or delete the file.")

    port = find_free_port(args.host, args.port)
    log_path = root / LOG_FILE
    with log_path.open("a", encoding="utf-8") as log_file:
        process = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(port), "--bind", args.host],
            cwd=str(root),
            stdout=log_file,
            stderr=subprocess.STDOUT,
            start_new_session=True,
        )

    url = f"http://{args.host}:{port}"
    state = {
        "pid": process.pid,
        "host": args.host,
        "port": port,
        "url": url,
        "root": str(root),
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    state_path.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")

    print(f"Serving: {root}")
    print(f"URL: {url}")
    print(f"State: {state_path}")
    print(f"Log: {log_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
