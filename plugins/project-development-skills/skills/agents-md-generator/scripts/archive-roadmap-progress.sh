#!/usr/bin/env bash
set -euo pipefail

skill_dir="skills/agents-md-generator"
limit=300
mode="check"   # check | fix
dry_run="false"
backup="true"

usage() {
  cat <<'EOF'
Usage:
  bash skills/agents-md-generator/scripts/archive-roadmap-progress.sh [options]

Options:
  --skill-dir <path>   Skill directory (default: skills/agents-md-generator)
  --limit <n>          Max lines before archiving (default: 300)
  --check              Report only (default)
  --fix                Archive + rewrite files
  --dry-run            Show what would change (implies --fix but does not write)
  --no-backup          Do not create .bak backups in --fix mode
  -h, --help           Show help

Notes:
  - Only archives content from the first matching section header:
      "## Completed" or "## Done"
  - Archives oldest entries from the bottom of that section until the file is <= limit.
  - Writes archives to: <skill-dir>/docs/archives/{ROADMAP|PROGRESS}-YYYY-MM.md (append).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skill-dir) skill_dir="${2:?}"; shift 2 ;;
    --limit) limit="${2:?}"; shift 2 ;;
    --check) mode="check"; shift ;;
    --fix) mode="fix"; shift ;;
    --dry-run) mode="fix"; dry_run="true"; shift ;;
    --no-backup) backup="false"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage >&2; exit 2 ;;
  esac
done

require_file() {
  local f="$1"
  if [[ ! -f "$f" ]]; then
    echo "Missing file: $f" >&2
    exit 1
  fi
}

mkdir -p "$skill_dir/docs/archives"

process_file() {
  local file="$1"
  require_file "$file"

  local total
  total="$(wc -l < "$file" | tr -d ' ')"
  if (( total <= limit )); then
    echo "OK: $file ($total lines <= $limit)"
    return 0
  fi

  local tmp_meta tmp_removed tmp_new
  tmp_meta="$(mktemp)"
  tmp_removed="$(mktemp)"
  tmp_new="$(mktemp)"

  # Compute:
  # - completed_header_line
  # - section_start
  # - section_end
  # - remove_from (start line to remove through section_end)
  awk -v limit="$limit" '
    BEGIN {
      completedHeader=0;
      sectionStart=0;
      sectionEnd=0;
      nextHeaderAfter=0;
    }
    {
      lines[NR]=$0;
    }
    END {
      total=NR;
      # Find first "## Completed" or "## Done"
      for (i=1; i<=total; i++) {
        if (lines[i] ~ /^##[[:space:]]+(Completed|Done)([[:space:]]|$)/) {
          completedHeader=i;
          break;
        }
      }
      if (completedHeader == 0) {
        print "ERROR\tmissing_completed_or_done_section\t0\t0\t0\t0\t" total > "/dev/stderr";
        exit 3;
      }

      sectionStart = completedHeader + 1;
      sectionEnd = total;
      for (i=completedHeader+1; i<=total; i++) {
        if (lines[i] ~ /^##[[:space:]]+/) {
          sectionEnd = i - 1;
          break;
        }
      }
      if (sectionEnd < sectionStart) {
        print "ERROR\tempty_completed_or_done_section\t" completedHeader "\t" sectionStart "\t" sectionEnd "\t0\t" total > "/dev/stderr";
        exit 4;
      }

      # Identify bullet-entry starts inside the section.
      n=0;
      for (i=sectionStart; i<=sectionEnd; i++) {
        if (lines[i] ~ /^[[:space:]]*[-*][[:space:]]+/) {
          n++;
          start[n]=i;
        }
      }
      if (n == 0) {
        print "ERROR\tno_entries_in_completed_or_done_section\t" completedHeader "\t" sectionStart "\t" sectionEnd "\t0\t" total > "/dev/stderr";
        exit 5;
      }

      # Compute entry ends.
      for (k=1; k<=n; k++) {
        if (k < n) end[k]=start[k+1]-1;
        else end[k]=sectionEnd;
        len[k]=end[k]-start[k]+1;
      }

      need = total - limit;
      removed=0;
      removeFrom=0;
      for (k=n; k>=1; k--) {
        removed += len[k];
        removeFrom = start[k];
        if (removed >= need) break;
      }

      if (removeFrom == 0) {
        print "ERROR\tunable_to_compute_removal\t" completedHeader "\t" sectionStart "\t" sectionEnd "\t0\t" total > "/dev/stderr";
        exit 6;
      }

      printf "%d\t%d\t%d\t%d\t%d\t%d\n", completedHeader, sectionStart, sectionEnd, removeFrom, removed, total;
    }
  ' "$file" > "$tmp_meta" || {
    rm -f "$tmp_meta" "$tmp_removed" "$tmp_new"
    echo "Failed parsing: $file" >&2
    return 1
  }

  local completed_header_line section_start section_end remove_from removed_lines total_lines
  IFS=$'\t' read -r completed_header_line section_start section_end remove_from removed_lines total_lines < "$tmp_meta"

  echo "NEEDS ARCHIVE: $file ($total_lines lines > $limit)"
  echo "  - Completed/Done header at line: $completed_header_line"
  echo "  - Section range: $section_start..$section_end"
  echo "  - Would remove: $remove_from..$section_end ($removed_lines lines)"

  if [[ "$mode" != "fix" ]]; then
    rm -f "$tmp_meta" "$tmp_removed" "$tmp_new"
    return 0
  fi

  local ym today base archive_file
  ym="$(date +%Y-%m)"
  today="$(date +%Y-%m-%d)"
  base="$(basename "$file" .md)"
  archive_file="$skill_dir/docs/archives/${base}-${ym}.md"

  # Extract removed region into tmp_removed.
  awk -v from="$remove_from" -v to="$section_end" 'NR>=from && NR<=to { print }' "$file" > "$tmp_removed"

  # Build new file to tmp_new (exclude removed region).
  awk -v from="$remove_from" -v to="$section_end" 'NR<from || NR>to { print }' "$file" > "$tmp_new"

  if [[ "$dry_run" == "true" ]]; then
    echo "DRY RUN: would append to $archive_file and rewrite $file"
    rm -f "$tmp_meta" "$tmp_removed" "$tmp_new"
    return 0
  fi

  if [[ "$backup" == "true" ]]; then
    cp "$file" "${file}.bak"
  fi

  if [[ ! -f "$archive_file" ]]; then
    {
      echo "# ${base} Archive — ${ym}"
      echo
    } > "$archive_file"
  fi

  {
    echo
    echo "## Archived from ${base}.md on ${today}"
    echo
    cat "$tmp_removed"
    echo
  } >> "$archive_file"

  mv "$tmp_new" "$file"

  rm -f "$tmp_meta" "$tmp_removed"
  echo "ARCHIVED: $file -> $archive_file"
}

process_file "$skill_dir/ROADMAP.md"
process_file "$skill_dir/PROGRESS.md"

