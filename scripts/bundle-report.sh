#!/usr/bin/env bash
# Bundle size report for romaingrx.com
# Usage:
#   ./scripts/bundle-report.sh              # Print report to stdout
#   ./scripts/bundle-report.sh --json       # Output JSON (for CI comparison)
#   ./scripts/bundle-report.sh --compare baseline.json  # Compare against baseline

set -euo pipefail

DIST="dist/client"
JSON_MODE=false
COMPARE_FILE=""
BASELINE_JSON=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json) JSON_MODE=true; shift ;;
    --compare) COMPARE_FILE="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -n "$COMPARE_FILE" && -f "$COMPARE_FILE" ]]; then
  BASELINE_JSON=$(cat "$COMPARE_FILE")
fi

if [[ ! -d "$DIST" ]]; then
  echo "Error: $DIST not found. Run 'pnpm build' first." >&2
  exit 1
fi

# ── Helpers ──────────────────────────────────────────────────────────────────

gz_size() {
  gzip -c "$1" 2>/dev/null | wc -c | tr -d ' '
}

human_size() {
  local bytes=$1
  if (( bytes >= 1048576 )); then
    echo "$(echo "scale=1; $bytes / 1048576" | bc)MB"
  elif (( bytes >= 1024 )); then
    echo "$(echo "scale=1; $bytes / 1024" | bc)KB"
  else
    echo "${bytes}B"
  fi
}

# ── Per-page analysis ────────────────────────────────────────────────────────

declare -A PAGE_JS_RAW PAGE_JS_GZ PAGE_CSS_RAW PAGE_CSS_GZ PAGE_JS_COUNT

PAGES=$(find "$DIST" -name '*.html' -not -path '*/pagefind/*' | sort)

for html in $PAGES; do
  route="${html#$DIST}"
  route="${route%/index.html}"
  route="${route:=/}"

  js_raw=0 js_gz=0 js_count=0
  css_raw=0 css_gz=0

  for f in $(grep -o '_astro/[^"]*\.js' "$html" 2>/dev/null | sort -u); do
    filepath="$DIST/$f"
    if [[ -f "$filepath" ]]; then
      raw=$(wc -c < "$filepath" | tr -d ' ')
      gz=$(gz_size "$filepath")
      js_raw=$((js_raw + raw))
      js_gz=$((js_gz + gz))
      js_count=$((js_count + 1))
    fi
  done

  for f in $(grep -o '_astro/[^"]*\.css' "$html" 2>/dev/null | sort -u); do
    filepath="$DIST/$f"
    if [[ -f "$filepath" ]]; then
      raw=$(wc -c < "$filepath" | tr -d ' ')
      gz=$(gz_size "$filepath")
      css_raw=$((css_raw + raw))
      css_gz=$((css_gz + gz))
    fi
  done

  PAGE_JS_RAW["$route"]=$js_raw
  PAGE_JS_GZ["$route"]=$js_gz
  PAGE_JS_COUNT["$route"]=$js_count
  PAGE_CSS_RAW["$route"]=$css_raw
  PAGE_CSS_GZ["$route"]=$css_gz
done

# ── Global totals ────────────────────────────────────────────────────────────

TOTAL_JS_RAW=0 TOTAL_JS_GZ=0 TOTAL_JS_FILES=0
TOTAL_CSS_RAW=0 TOTAL_CSS_GZ=0 TOTAL_CSS_FILES=0
TOTAL_HTML_FILES=$(echo "$PAGES" | wc -l | tr -d ' ')

for f in $(find "$DIST/_astro" -name '*.js' 2>/dev/null); do
  raw=$(wc -c < "$f" | tr -d ' ')
  gz=$(gz_size "$f")
  TOTAL_JS_RAW=$((TOTAL_JS_RAW + raw))
  TOTAL_JS_GZ=$((TOTAL_JS_GZ + gz))
  TOTAL_JS_FILES=$((TOTAL_JS_FILES + 1))
done

for f in $(find "$DIST/_astro" -name '*.css' 2>/dev/null); do
  raw=$(wc -c < "$f" | tr -d ' ')
  gz=$(gz_size "$f")
  TOTAL_CSS_RAW=$((TOTAL_CSS_RAW + raw))
  TOTAL_CSS_GZ=$((TOTAL_CSS_GZ + gz))
  TOTAL_CSS_FILES=$((TOTAL_CSS_FILES + 1))
done

# ── Top JS chunks ────────────────────────────────────────────────────────────

declare -a TOP_CHUNKS_NAME TOP_CHUNKS_RAW TOP_CHUNKS_GZ
i=0
while IFS=$'\t' read -r size filepath; do
  if [[ $i -ge 10 ]]; then break; fi
  name=$(basename "$filepath")
  gz=$(gz_size "$filepath")
  TOP_CHUNKS_NAME[$i]="$name"
  TOP_CHUNKS_RAW[$i]="$size"
  TOP_CHUNKS_GZ[$i]="$gz"
  i=$((i + 1))
done < <(find "$DIST/_astro" -name '*.js' -exec sh -c 'wc -c < "$1" | tr -d " "' _ {} \; -print | paste - - | sort -rn)

# ── Key pages to track ───────────────────────────────────────────────────────

KEY_PAGES=("/" "/about" "/blog" "/notes")

# ── JSON output ──────────────────────────────────────────────────────────────

if $JSON_MODE; then
  echo "{"
  echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo "  \"totals\": {"
  echo "    \"js_raw\": $TOTAL_JS_RAW,"
  echo "    \"js_gz\": $TOTAL_JS_GZ,"
  echo "    \"js_files\": $TOTAL_JS_FILES,"
  echo "    \"css_raw\": $TOTAL_CSS_RAW,"
  echo "    \"css_gz\": $TOTAL_CSS_GZ,"
  echo "    \"css_files\": $TOTAL_CSS_FILES,"
  echo "    \"html_pages\": $TOTAL_HTML_FILES"
  echo "  },"
  echo "  \"pages\": {"
  first=true
  for route in "${KEY_PAGES[@]}"; do
    if [[ -z "${PAGE_JS_GZ[$route]+x}" ]]; then continue; fi
    if ! $first; then echo ","; fi
    first=false
    printf "    \"%s\": { \"js_raw\": %d, \"js_gz\": %d, \"js_files\": %d, \"css_raw\": %d, \"css_gz\": %d }" \
      "$route" \
      "${PAGE_JS_RAW[$route]}" \
      "${PAGE_JS_GZ[$route]}" \
      "${PAGE_JS_COUNT[$route]}" \
      "${PAGE_CSS_RAW[$route]}" \
      "${PAGE_CSS_GZ[$route]}"
  done
  echo ""
  echo "  },"
  echo "  \"top_chunks\": ["
  for ((j=0; j<${#TOP_CHUNKS_NAME[@]}; j++)); do
    comma=","
    if [[ $j -eq $((${#TOP_CHUNKS_NAME[@]} - 1)) ]]; then comma=""; fi
    printf "    { \"name\": \"%s\", \"raw\": %d, \"gz\": %d }%s\n" \
      "${TOP_CHUNKS_NAME[$j]}" "${TOP_CHUNKS_RAW[$j]}" "${TOP_CHUNKS_GZ[$j]}" "$comma"
  done
  echo "  ]"
  echo "}"
  exit 0
fi

# ── Human-readable output ────────────────────────────────────────────────────

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   Bundle Size Report                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "── Totals ───────────────────────────────────────────────────"
printf "  JS:   %s raw / %s gzipped  (%d files)\n" \
  "$(human_size $TOTAL_JS_RAW)" "$(human_size $TOTAL_JS_GZ)" "$TOTAL_JS_FILES"
printf "  CSS:  %s raw / %s gzipped  (%d files)\n" \
  "$(human_size $TOTAL_CSS_RAW)" "$(human_size $TOTAL_CSS_GZ)" "$TOTAL_CSS_FILES"
printf "  HTML: %d pages\n" "$TOTAL_HTML_FILES"
echo ""

echo "── Per Page (key routes) ────────────────────────────────────"
printf "  %-30s %10s %10s %10s\n" "Route" "JS (gz)" "CSS (gz)" "Total (gz)"
printf "  %-30s %10s %10s %10s\n" "─────" "───────" "────────" "──────────"

for route in "${KEY_PAGES[@]}"; do
  if [[ -z "${PAGE_JS_GZ[$route]+x}" ]]; then continue; fi
  js_gz="${PAGE_JS_GZ[$route]}"
  css_gz="${PAGE_CSS_GZ[$route]}"
  total_gz=$((js_gz + css_gz))

  # Compare with baseline if available
  diff_str=""
  if [[ -n "$BASELINE_JSON" ]]; then
    baseline_js=$(echo "$BASELINE_JSON" | grep -o "\"$route\"[^}]*" | grep -o '"js_gz": [0-9]*' | grep -o '[0-9]*' || echo "")
    baseline_css=$(echo "$BASELINE_JSON" | grep -o "\"$route\"[^}]*" | grep -o '"css_gz": [0-9]*' | grep -o '[0-9]*' || echo "")
    if [[ -n "$baseline_js" && -n "$baseline_css" ]]; then
      baseline_total=$((baseline_js + baseline_css))
      delta=$((total_gz - baseline_total))
      if (( delta > 0 )); then
        diff_str=" (+$(human_size $delta))"
      elif (( delta < 0 )); then
        abs_delta=$(( -delta ))
        diff_str=" (-$(human_size $abs_delta))"
      fi
    fi
  fi

  printf "  %-30s %10s %10s %10s%s\n" \
    "$route" \
    "$(human_size $js_gz)" \
    "$(human_size $css_gz)" \
    "$(human_size $total_gz)" \
    "$diff_str"
done
echo ""

echo "── Top JS Chunks ────────────────────────────────────────────"
printf "  %-50s %10s %10s\n" "File" "Raw" "Gzipped"
printf "  %-50s %10s %10s\n" "────" "───" "───────"
for ((j=0; j<${#TOP_CHUNKS_NAME[@]}; j++)); do
  printf "  %-50s %10s %10s\n" \
    "${TOP_CHUNKS_NAME[$j]}" \
    "$(human_size ${TOP_CHUNKS_RAW[$j]})" \
    "$(human_size ${TOP_CHUNKS_GZ[$j]})"
done
echo ""

# ── Warnings ─────────────────────────────────────────────────────────────────

echo "── Warnings ───────────────────────────────────────────────────"
warnings=0

# Check for react-dom on pages that shouldn't need it
for route in "${KEY_PAGES[@]}"; do
  html="$DIST${route}/index.html"
  if [[ "$route" == "/" ]]; then html="$DIST/index.html"; fi
  if [[ -f "$html" ]]; then
    js_gz="${PAGE_JS_GZ[$route]:-0}"
    if (( js_gz > 102400 )); then
      echo "  ⚠  $route ships $(human_size $js_gz) JS (gzipped) — target < 100KB"
      warnings=$((warnings + 1))
    fi
  fi
done

# Check for chunks > 100KB gzipped
for ((j=0; j<${#TOP_CHUNKS_NAME[@]}; j++)); do
  if (( ${TOP_CHUNKS_GZ[$j]} > 102400 )); then
    echo "  ⚠  ${TOP_CHUNKS_NAME[$j]} is $(human_size ${TOP_CHUNKS_GZ[$j]}) gzipped — consider code splitting or lazy loading"
    warnings=$((warnings + 1))
  fi
done

if (( warnings == 0 )); then
  echo "  ✓  No warnings"
fi
echo ""
