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
  - Reports duplicate skill folders and suggests choosing one canonical source.
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
hash_index="$(mktemp)"
sorted_index="$(mktemp)"
trap 'rm -f "$hash_index" "$sorted_index"' EXIT

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
  printf "%s\t%s\n" "$combined_hash" "$dir" >> "$hash_index"
done

if [[ "$found_skill" == "false" ]]; then
  echo "No skills found. Expected subfolders with SKILL.md."
  exit 0
fi

duplicate_found="false"
print_group() {
  local hash="$1"
  shift
  local dirs=("$@")

  if (( ${#dirs[@]} > 1 )); then
    duplicate_found="true"
    echo "Duplicate group: $hash"
    for dup_dir in "${dirs[@]}"; do
      echo "  - $dup_dir"
    done
    canonical="${dirs[0]}"
    echo "  Suggested canonical source: $canonical"
    echo "  Merge any unique content into the canonical folder, then remove or regroup duplicates."
    echo
  fi
}

sort -k1,1 "$hash_index" > "$sorted_index"

current_hash=""
current_dirs=()
while IFS=$'\t' read -r hash dir; do
  if [[ -z "$current_hash" ]]; then
    current_hash="$hash"
    current_dirs=("$dir")
    continue
  fi

  if [[ "$hash" == "$current_hash" ]]; then
    current_dirs+=("$dir")
  else
    print_group "$current_hash" "${current_dirs[@]}"
    current_hash="$hash"
    current_dirs=("$dir")
  fi
done < "$sorted_index"

if [[ -n "$current_hash" ]]; then
  print_group "$current_hash" "${current_dirs[@]}"
fi

if [[ "$duplicate_found" == "false" ]]; then
  echo "No duplicate skills found."
fi

echo "Notes:"
echo "- Avoid symlink-based consolidation; some agent scanners may count both paths as separate context."
echo "- If duplicates are generated under plugins/, edit skills/ and run npm run sync instead."
