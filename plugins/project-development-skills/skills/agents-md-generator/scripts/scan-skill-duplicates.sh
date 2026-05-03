#!/usr/bin/env bash
set -euo pipefail

skills_dir="skills"

usage() {
  cat <<'EOF'
Usage:
  bash skills/agents-md-generator/scripts/scan-skill-duplicates.sh [options]

Options:
  --skills-dir <path>  Skills directory (default: skills)
  -h, --help           Show help

Notes:
  - Computes a combined hash of each skill folder (file paths + contents).
  - Reports duplicate skill folders and suggests symlink consolidation.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skills-dir) skills_dir="${2:?}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage >&2; exit 2 ;;
  esac
done

skills_dir="$(cd -- "$skills_dir" && pwd)"

hash_file() {
  local file="$1"
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$file" | awk '{print $1}'
    return 0
  fi
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
    return 0
  fi
  echo "ERROR: missing shasum/sha256sum" >&2
  exit 1
}

echo "Skill Duplicate Scan"
echo "Skills root: $skills_dir"
echo

declare -A hash_to_dirs
declare -A hash_to_names

found_skill="false"
for dir in "$skills_dir"/*; do
  [[ -d "$dir" ]] || continue
  if [[ ! -f "$dir/SKILL.md" ]]; then
    continue
  fi
  found_skill="true"

  tmp_file="$(mktemp)"
  while IFS= read -r file; do
    rel_path="${file#$dir/}"
    file_hash="$(hash_file "$file")"
    printf "%s  %s\n" "$file_hash" "$rel_path" >> "$tmp_file"
  done < <(find "$dir" -type f ! -path "*/docs/archives/*" ! -path "*/.git/*" ! -name ".DS_Store" | sort)

  combined_hash="$(hash_file "$tmp_file")"
  rm -f "$tmp_file"

  if [[ -n "${hash_to_dirs[$combined_hash]:-}" ]]; then
    hash_to_dirs[$combined_hash]="${hash_to_dirs[$combined_hash]}|$dir"
  else
    hash_to_dirs[$combined_hash]="$dir"
  fi
done

if [[ "$found_skill" == "false" ]]; then
  echo "No skills found. Expected subfolders with SKILL.md."
  exit 0
fi

duplicate_found="false"
for hash in "${!hash_to_dirs[@]}"; do
  IFS='|' read -r -a dirs <<< "${hash_to_dirs[$hash]}"
  if (( ${#dirs[@]} > 1 )); then
    duplicate_found="true"
    echo "Duplicate group: $hash"
    for dup_dir in "${dirs[@]}"; do
      echo "  - $dup_dir"
    done
    canonical="${dirs[0]}"
    for ((i=1; i<${#dirs[@]}; i++)); do
      target="${dirs[$i]}"
      echo "  Suggest: ln -s \"${canonical}\" \"${target}\""
    done
    echo
  fi
done

if [[ "$duplicate_found" == "false" ]]; then
  echo "No duplicate skills found."
fi

echo "Notes:"
echo "- Symlinks work best on macOS/Linux; Windows may need a copy with a clear header."
