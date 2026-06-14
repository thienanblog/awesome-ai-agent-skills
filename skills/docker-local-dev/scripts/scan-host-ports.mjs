import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--root") args.root = argv[++i];
    else if (arg.startsWith("--root=")) args.root = arg.slice("--root=".length);
    else if (arg === "--out") args.out = argv[++i];
    else if (arg.startsWith("--out=")) args.out = arg.slice("--out=".length);
    else if (arg === "--yes") args.yes = true;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const stateHome = process.env.XDG_STATE_HOME || path.join(process.env.HOME || ".", ".local", "state");
const defaultOutFile = process.env.DOCKER_LOCAL_DEV_PORT_REGISTRY || path.join(stateHome, "docker-local-dev", "HOST_PORT_REGISTRY.md");
const root = path.resolve(args.root || process.cwd());
const outFile = path.resolve(args.out || defaultOutFile);
const scriptPath = fileURLToPath(import.meta.url);
const generatedAt = new Date().toISOString();

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  "vendor",
  "storage",
  "dist",
  "build",
  ".next",
  ".nuxt",
  ".turbo",
  ".output",
]);

const composeNames = /^(docker-compose|compose).*\.(ya?ml)$/i;
const configNames = /^(vite\.config|webpack\.config|next\.config|nuxt\.config)\./i;

function walk(dir, files = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
    } else {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function rel(file) {
  return path.relative(root, file) || ".";
}

function projectName(file) {
  const relative = rel(file).split(path.sep);
  return relative[0] || ".";
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function shellLines(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parseDockerRuntime() {
  const rows = [];
  const seen = new Set();
  const lines = shellLines("docker", ["ps", "--format", "{{.Names}}\t{{.Ports}}"]);
  for (const line of lines) {
    const [name, ports = ""] = line.split("\t");
    const regex = /(?:(127\.0\.0\.1|0\.0\.0\.0|\[::\]|\[::1\]):)?(\d+)->(\d+)\/(tcp|udp)/g;
    let match;
    while ((match = regex.exec(ports))) {
      const key = `${name}:${match[2]}:${match[3]}/${match[4]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        source: "docker-runtime",
        project: name.split("-").slice(0, -1).join("-") || name,
        app: name,
        port: Number(match[2]),
        bind: match[1] || "0.0.0.0",
        target: `${match[3]}/${match[4]}`,
        status: "running",
        file: "",
        line: "",
        raw: match[0],
      });
    }
  }
  return rows;
}

function parseLsofRuntime() {
  const rows = [];
  const seen = new Set();
  const lines = shellLines("lsof", ["-nP", "-iTCP", "-sTCP:LISTEN"]);
  for (const line of lines.slice(1)) {
    const command = line.trim().split(/\s+/)[0] || "";
    if (command === "OrbStack") continue;
    const match = line.match(/\sTCP\s+(.+?):(\d+)\s+\(LISTEN\)$/);
    if (!match) continue;
    const bind = match[1];
    const port = Number(match[2]);
    const key = `${command}:${port}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      source: "host-listener",
      project: "host",
      app: command,
      port,
      bind,
      target: "host process",
      status: "listening",
      file: "",
      line: "",
      raw: `${bind}:${port}`,
    });
  }
  return rows;
}

function portFromPublished(published) {
  if (published == null || published === "") return null;
  const text = String(published);
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function parseComposeWithDocker(file) {
  const rows = [];
  let json;
  try {
    const output = execFileSync("docker", ["compose", "-f", file, "config", "--format", "json"], {
      cwd: path.dirname(file),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 30000,
    });
    json = JSON.parse(output);
  } catch (error) {
    return { rows, error: error.stderr?.toString().trim() || error.message };
  }

  for (const [serviceName, service] of Object.entries(json.services || {})) {
    for (const portSpec of service.ports || []) {
      if (typeof portSpec === "string") {
        const parsed = parsePortString(portSpec);
        if (parsed.hostPort) {
          rows.push({
            source: "compose",
            project: json.name || projectName(file),
            app: serviceName,
            port: parsed.hostPort,
            bind: parsed.bind || "0.0.0.0",
            target: parsed.target || "",
            status: "configured",
            file,
            line: findLine(file, portSpec),
            raw: portSpec,
          });
        }
        continue;
      }
      const hostPort = portFromPublished(portSpec.published);
      if (!hostPort) continue;
      rows.push({
        source: "compose",
        project: json.name || projectName(file),
        app: serviceName,
        port: hostPort,
        bind: portSpec.host_ip || portSpec.host_ip === "" ? portSpec.host_ip : "0.0.0.0",
        target: `${portSpec.target || ""}/${portSpec.protocol || "tcp"}`,
        status: "configured",
        file,
        line: findLine(file, String(portSpec.published)),
        raw: `${portSpec.published}:${portSpec.target || ""}/${portSpec.protocol || "tcp"}`,
      });
    }
  }
  return { rows, error: "" };
}

function parsePortString(spec) {
  const clean = spec.replace(/^['"]|['"]$/g, "");
  const protocol = clean.includes("/") ? clean.split("/").pop() : "tcp";
  const withoutProtocol = clean.replace(/\/(tcp|udp)$/i, "");
  const parts = withoutProtocol.split(":");
  if (parts.length === 1) return { target: `${parts[0]}/${protocol}` };
  if (parts.length === 2) {
    return { hostPort: Number(parts[0]), target: `${parts[1]}/${protocol}` };
  }
  return { bind: parts[0], hostPort: Number(parts[1]), target: `${parts[2]}/${protocol}` };
}

function findLine(file, needle) {
  const text = readText(file);
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes(needle)) return i + 1;
  }
  return "";
}

function extractPortFlags(text) {
  const matches = [];
  const regex = /(?:--(?:port|https-port|hmr-port|host-port)(?:=|\s+)|(?:^|\s)-p(?:=|\s+))(\d+)/gi;
  let match;
  while ((match = regex.exec(text))) {
    matches.push({ port: Number(match[1]), raw: match[0].trim() });
  }
  return matches;
}

function parsePackageJson(file) {
  const rows = [];
  let pkg;
  try {
    pkg = JSON.parse(readText(file));
  } catch {
    return rows;
  }
  for (const [scriptName, script] of Object.entries(pkg.scripts || {})) {
    const text = String(script);
    if (!/(vite|webpack|next|nuxt|astro|serve)/i.test(text)) continue;
    const portMatches = extractPortFlags(text);
    for (const match of portMatches) {
      rows.push({
        source: "package-script",
        project: projectName(file),
        app: `${path.basename(path.dirname(file))}:${scriptName}`,
        port: match.port,
        bind: text.match(/--host\s+([^\s]+)/)?.[1] || "",
        target: "dev server",
        status: "configured",
        file,
        line: findLine(file, `"${scriptName}"`),
        raw: text,
      });
    }
  }
  return rows;
}

function parseDevConfig(file) {
  const rows = [];
  const text = readText(file);
  if (!text) return rows;

  const candidates = new Map();
  for (const match of text.matchAll(/\bport\s*:\s*(\d+)/g)) {
    candidates.set(Number(match[1]), match[0]);
  }
  for (const match of text.matchAll(/\bport\s*:\s*(?:Number|parseInt)?\s*\(\s*process\.env\.[A-Z0-9_]+\s*\)\s*\|\|\s*(\d+)/gi)) {
    candidates.set(Number(match[1]), match[0]);
  }
  for (const match of text.matchAll(/process\.env\.[A-Z0-9_]+\s*\|\|\s*["']?(\d+)["']?/gi)) {
    if (/port/i.test(match[0])) candidates.set(Number(match[1]), match[0]);
  }
  for (const match of extractPortFlags(text)) {
    candidates.set(match.port, match.raw);
  }

  const host = text.match(/\bhost\s*:\s*["']([^"']+)["']/)?.[1] || "";
  for (const [port, raw] of candidates.entries()) {
    rows.push({
      source: configNames.test(path.basename(file)) ? path.basename(file).split(".")[0] : "dev-config",
      project: projectName(file),
      app: path.basename(path.dirname(file)),
      port,
      bind: host,
      target: "dev server",
      status: "configured",
      file,
      line: findLine(file, raw),
      raw,
    });
  }
  return rows;
}

function parseComposeCommandPorts(file) {
  const rows = [];
  const text = readText(file);
  const lines = text.split(/\r?\n/);
  let currentService = "";
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const serviceMatch = line.match(/^  ([A-Za-z0-9._-]+):\s*$/);
    if (serviceMatch) currentService = serviceMatch[1];
    const portMatches = extractPortFlags(line);
    for (const match of portMatches) {
      rows.push({
        source: "compose-command",
        project: projectName(file),
        app: currentService || "service",
        port: match.port,
        bind: line.match(/--host(?:name)?\s+([^\s"']+)/)?.[1] || "",
        target: "dev server in container",
        status: "configured",
        file,
        line: i + 1,
        raw: line.trim(),
      });
    }
  }
  return rows;
}

function uniqRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = [row.source, row.file, row.line, row.project, row.app, row.port, row.target, row.raw].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function classifyService(row) {
  const haystack = `${row.app} ${row.target} ${row.raw}`.toLowerCase();
  if (haystack.includes("postgres") || haystack.includes("5432")) return "PostgreSQL";
  if (haystack.includes("mysql") || haystack.includes("mariadb") || haystack.includes("3306")) return "MySQL/MariaDB";
  if (haystack.includes("redis") || haystack.includes("6379")) return "Redis";
  if (haystack.includes("mailpit") || haystack.includes("mailhog") || haystack.includes("smtp") || row.port === 8025 || row.port === 1025) return "Mail";
  if (haystack.includes("vite")) return "Vite";
  if (haystack.includes("next")) return "Next.js";
  if (haystack.includes("webpack")) return "Webpack";
  if (row.source.includes("vite")) return "Vite";
  if ([80, 443, 8080, 8088, 8000, 3000, 3001, 3002, 5173, 5174].includes(row.port)) return "Web/API";
  return "Other";
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function link(file, line) {
  if (!file) return "";
  return line ? `${rel(file)}:${line}` : rel(file);
}

function conflictMap(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.port)) map.set(row.port, []);
    map.get(row.port).push(row);
  }
  return [...map.entries()]
    .filter(([, items]) => items.length > 1)
    .sort((a, b) => a[0] - b[0]);
}

function nextAvailable(used, start, end, count = 12) {
  const result = [];
  for (let port = start; port <= end && result.length < count; port += 1) {
    if (!used.has(port)) result.push(port);
  }
  return result;
}

const allFiles = walk(root);
const composeFiles = allFiles.filter((file) => composeNames.test(path.basename(file)));
const packageFiles = allFiles.filter((file) => path.basename(file) === "package.json");
const devConfigFiles = allFiles.filter((file) => configNames.test(path.basename(file)));

const composeErrors = [];
const rows = [];
for (const file of composeFiles) {
  const parsed = parseComposeWithDocker(file);
  rows.push(...parsed.rows, ...parseComposeCommandPorts(file));
  if (parsed.error) composeErrors.push({ file, error: parsed.error });
}
for (const file of packageFiles) rows.push(...parsePackageJson(file));
for (const file of devConfigFiles) rows.push(...parseDevConfig(file));

const runtimeRows = [...parseDockerRuntime(), ...parseLsofRuntime()];
const registryRows = uniqRows([...rows, ...runtimeRows]).sort((a, b) => a.port - b.port || a.project.localeCompare(b.project) || a.app.localeCompare(b.app));
const configuredRows = registryRows.filter((row) => row.status === "configured");
const runtimeOnlyRows = registryRows.filter((row) => row.status !== "configured");
const usedPorts = new Set(registryRows.map((row) => row.port));
const conflicts = conflictMap(registryRows);

const lines = [];
lines.push("# Host Port Registry");
lines.push("");
lines.push(`Generated: ${generatedAt}`);
lines.push(`Scope: \`${root}\``);
lines.push("");
lines.push(`This file tracks host-exposed Docker Compose ports and JavaScript dev-server ports found under \`${root}\`. Update it before choosing new host ports for local Docker, Vite, Webpack, Next, Nuxt, or similar dev servers.`);
lines.push("");
lines.push("## Rules For New Local Projects");
lines.push("");
lines.push("- Read this file before assigning a host-exposed port.");
lines.push("- Prefer reverse proxy routing through `*.localhost` and avoid host port exposure unless a browser or local tool needs it.");
lines.push("- If a host port is required, choose a port not listed in `Configured Ports`, `Runtime Listeners`, or `Conflicts`.");
lines.push("- After creating or changing Docker/dev-server configuration, regenerate or update this file.");
lines.push("- Keep database/tooling ports project-specific when several stacks run on the same host, for example `503xx` for MySQL and `554xx` for PostgreSQL.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Compose files scanned: ${composeFiles.length}`);
lines.push(`- package.json files scanned: ${packageFiles.length}`);
lines.push(`- Dev server config files scanned: ${devConfigFiles.length}`);
lines.push(`- Configured port rows: ${configuredRows.length}`);
lines.push(`- Runtime listener rows: ${runtimeOnlyRows.length}`);
lines.push(`- Ports with duplicate use: ${conflicts.length}`);
lines.push("");
lines.push("## Regenerate");
lines.push("");
lines.push("Run this after changing Docker Compose `ports`, Vite/Webpack/Next/Nuxt dev-server ports, or package scripts with `--port`:");
lines.push("");
lines.push("```bash");
lines.push(`node ${JSON.stringify(scriptPath)} --root ${JSON.stringify(root)} --out ${JSON.stringify(outFile)} --yes`);
lines.push("```");
lines.push("");
lines.push("## Suggested Free Ports");
lines.push("");
lines.push("| Purpose | Range | Available candidates |");
lines.push("|---|---:|---|");
lines.push(`| Web/API HTTP | 8080-8099 | ${nextAvailable(usedPorts, 8080, 8099).join(", ") || "none"} |`);
lines.push(`| Vite/JS dev server | 5173-5199 | ${nextAvailable(usedPorts, 5173, 5199).join(", ") || "none"} |`);
lines.push(`| Node app dev server | 3000-3099 | ${nextAvailable(usedPorts, 3000, 3099).join(", ") || "none"} |`);
lines.push(`| MySQL/MariaDB host port | 50300-50399 | ${nextAvailable(usedPorts, 50300, 50399).join(", ") || "none"} |`);
lines.push(`| PostgreSQL host port | 55400-55499 | ${nextAvailable(usedPorts, 55400, 55499).join(", ") || "none"} |`);
lines.push(`| Mail UI | 18000-18099 | ${nextAvailable(usedPorts, 18000, 18099).join(", ") || "none"} |`);
lines.push(`| Mail SMTP | 11000-11099 | ${nextAvailable(usedPorts, 11000, 11099).join(", ") || "none"} |`);
lines.push("");

if (conflicts.length) {
  lines.push("## Conflicts And Shared Ports");
  lines.push("");
  lines.push("| Port | Count | Entries |");
  lines.push("|---:|---:|---|");
  for (const [port, items] of conflicts) {
    const entries = items
      .map((row) => `${row.project}/${row.app} [${row.source}${row.file ? ` ${link(row.file, row.line)}` : ""}]`)
      .join("<br>");
    lines.push(`| ${port} | ${items.length} | ${mdEscape(entries)} |`);
  }
  lines.push("");
}

lines.push("## Configured Ports");
lines.push("");
lines.push("| Port | Service type | Project | App/service | Source | Bind | Target | File | Raw |");
lines.push("|---:|---|---|---|---|---|---|---|---|");
for (const row of configuredRows) {
  lines.push(`| ${row.port} | ${classifyService(row)} | ${mdEscape(row.project)} | ${mdEscape(row.app)} | ${mdEscape(row.source)} | ${mdEscape(row.bind)} | ${mdEscape(row.target)} | ${mdEscape(link(row.file, row.line))} | ${mdEscape(row.raw)} |`);
}
lines.push("");

lines.push("## Runtime Listeners");
lines.push("");
lines.push("| Port | Source | Process/container | Bind | Target | Raw |");
lines.push("|---:|---|---|---|---|---|");
for (const row of runtimeOnlyRows) {
  lines.push(`| ${row.port} | ${mdEscape(row.source)} | ${mdEscape(row.app)} | ${mdEscape(row.bind)} | ${mdEscape(row.target)} | ${mdEscape(row.raw)} |`);
}
lines.push("");

if (composeErrors.length) {
  lines.push("## Compose Files Not Parsed By Docker Compose");
  lines.push("");
  lines.push("| File | Error |");
  lines.push("|---|---|");
  for (const item of composeErrors) {
    lines.push(`| ${mdEscape(rel(item.file))} | ${mdEscape(item.error.slice(0, 500))} |`);
  }
  lines.push("");
}

if (!args.yes && process.env.DOCKER_LOCAL_DEV_PORT_REGISTRY_CONFIRM !== "1") {
  console.error(`Refusing to write ${outFile} without confirmation. Re-run with --yes after the user approves this exact registry path and scan root.`);
  process.exit(2);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${lines.join("\n")}\n`);

console.log(JSON.stringify({
  outFile,
  composeFiles: composeFiles.length,
  packageFiles: packageFiles.length,
  devConfigFiles: devConfigFiles.length,
  configuredRows: configuredRows.length,
  runtimeRows: runtimeOnlyRows.length,
  conflicts: conflicts.length,
  composeErrors: composeErrors.length,
}, null, 2));
