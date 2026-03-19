#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import socket
import sys
import threading
import time
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


STATE_FILE = ".mockup-server.json"
LOG_FILE = ".mockup-server.log"
WATCH_EXTENSIONS = {".html", ".js", ".mjs", ".css", ".json"}
RELOAD_SCRIPT = """(() => {
  if (window.__mockupReloadConnected) return;
  if (new URLSearchParams(window.location.search).get('capture') === '1') return;
  window.__mockupReloadConnected = true;
  const source = new EventSource('/__mockup_events');
  source.onmessage = (event) => {
    if (!event.data) return;
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === 'reload') window.location.reload();
    } catch (error) {
      console.error('Mockup reload payload error', error);
    }
  };
  source.onerror = () => {
    source.close();
    setTimeout(() => window.location.reload(), 1200);
  };
})();"""


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


class LiveReloadState:
    def __init__(self, root: Path, log_handle) -> None:
        self.root = root
        self.log_handle = log_handle
        self.version = 0
        self._stop = threading.Event()
        self._condition = threading.Condition()
        self._last_signature = self.signature()

    def signature(self) -> tuple[int, int]:
        latest_mtime = 0
        count = 0
        for path in self.root.rglob("*"):
            if not path.is_file():
                continue
            if path.name in {STATE_FILE, LOG_FILE}:
                continue
            if path.suffix.lower() not in WATCH_EXTENSIONS:
                continue
            try:
                stat = path.stat()
            except FileNotFoundError:
                continue
            latest_mtime = max(latest_mtime, int(stat.st_mtime_ns))
            count += 1
        return latest_mtime, count

    def watch(self) -> None:
        while not self._stop.wait(0.75):
            signature = self.signature()
            if signature != self._last_signature:
                self._last_signature = signature
                with self._condition:
                    self.version += 1
                    self._condition.notify_all()
                self.log_handle.write(
                    f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Reload version {self.version}\n"
                )
                self.log_handle.flush()

    def wait_for_version(self, known_version: int) -> int:
        with self._condition:
            while not self._stop.is_set() and self.version <= known_version:
                self._condition.wait(timeout=15)
                if self.version <= known_version:
                    return known_version
            return self.version

    def stop(self) -> None:
        self._stop.set()
        with self._condition:
            self._condition.notify_all()


class MockupRequestHandler(SimpleHTTPRequestHandler):
    server_version = "MockupPreview/1.0"

    def __init__(self, *args, directory: str | None = None, reload_state: LiveReloadState | None = None, **kwargs):
        self.reload_state = reload_state
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, format: str, *args) -> None:
        if self.reload_state:
            self.reload_state.log_handle.write(
                f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {self.address_string()} {format % args}\n"
            )
            self.reload_state.log_handle.flush()

    def do_GET(self) -> None:
        if self.path == "/__mockup_reload.js":
            content = RELOAD_SCRIPT.encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(content)
            return

        if self.path == "/__mockup_events":
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Connection", "keep-alive")
            self.end_headers()
            version = self.reload_state.version
            try:
                while True:
                    next_version = self.reload_state.wait_for_version(version)
                    if next_version > version:
                        payload = json.dumps({"type": "reload", "version": next_version})
                        self.wfile.write(f"data: {payload}\n\n".encode("utf-8"))
                        self.wfile.flush()
                        version = next_version
                    else:
                        self.wfile.write(b": keep-alive\n\n")
                        self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError):
                return

        super().do_GET()


def main() -> int:
    parser = argparse.ArgumentParser(description="Start a live-reload preview server for a mockup directory.")
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
    with log_path.open("a", encoding="utf-8") as log_handle:
        reload_state = LiveReloadState(root, log_handle)
        watcher = threading.Thread(target=reload_state.watch, name="mockup-watch", daemon=True)
        watcher.start()

        handler = partial(
            MockupRequestHandler,
            directory=str(root),
            reload_state=reload_state,
        )
        server = ThreadingHTTPServer((args.host, port), handler)

        state = {
            "pid": os.getpid(),
            "host": args.host,
            "port": port,
            "url": f"http://{args.host}:{port}",
            "root": str(root),
            "started_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "live_reload": True,
        }
        state_path.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")

        print(f"Serving: {root}")
        print(f"URL: {state['url']}")
        print(f"State: {state_path}")
        print(f"Log: {log_path}")
        print("Live reload: enabled")
        sys.stdout.flush()

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            reload_state.stop()
            server.server_close()
            state_path.unlink(missing_ok=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
