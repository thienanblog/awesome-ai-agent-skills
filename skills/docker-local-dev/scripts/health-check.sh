#!/usr/bin/env bash

# Summarize Compose container state and declared health without guessing service
# roles or probing unrelated localhost ports.

set -uo pipefail

PASSED=0
FAILED=0

is_one_shot() {
    local service=$1
    case "$service" in
        *-deps|*-installer) return 0 ;;
    esac
    case " ${ONE_SHOT_SERVICES:-} " in
        *" $service "*) return 0 ;;
    esac
    return 1
}

pass() {
    PASSED=$((PASSED + 1))
    printf 'PASS  %s\n' "$1"
}

fail() {
    FAILED=$((FAILED + 1))
    printf 'FAIL  %s\n' "$1"
}

services=$(docker compose config --services 2>/dev/null) || {
    printf 'Could not resolve Compose services. Run docker compose config --quiet first.\n' >&2
    exit 2
}

if [[ -z "$services" ]]; then
    printf 'Compose configuration contains no services.\n' >&2
    exit 2
fi

while IFS= read -r service; do
    [[ -z "$service" ]] && continue
    ids=$(docker compose ps --all --quiet "$service" 2>/dev/null || true)
    if [[ -z "$ids" ]]; then
        fail "$service has no container"
        continue
    fi

    instance=0
    while IFS= read -r id; do
        [[ -z "$id" ]] && continue
        instance=$((instance + 1))
        state=$(docker inspect --format '{{.State.Status}}|{{.State.ExitCode}}|{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$id" 2>/dev/null || true)
        if [[ -z "$state" ]]; then
            fail "$service instance $instance could not be inspected"
            continue
        fi

        IFS='|' read -r status exit_code health <<<"$state"
        label="$service"
        [[ "$instance" -gt 1 ]] && label="$service[$instance]"

        if is_one_shot "$service"; then
            if [[ "$status" == exited && "$exit_code" == 0 ]]; then
                pass "$label completed successfully"
            else
                fail "$label expected exited(0), observed ${status}(${exit_code})"
            fi
        elif [[ "$status" != running ]]; then
            fail "$label is $status (exit $exit_code)"
        elif [[ -n "$health" && "$health" != healthy ]]; then
            fail "$label health is $health"
        elif [[ "$health" == healthy ]]; then
            pass "$label is running and healthy"
        else
            pass "$label is running (no declared healthcheck)"
        fi
    done <<<"$ids"
done <<<"$services"

if [[ -n "${HEALTHCHECK_URL:-}" ]]; then
    if curl --fail --silent --show-error --max-time "${HEALTHCHECK_TIMEOUT:-5}" "$HEALTHCHECK_URL" >/dev/null; then
        pass "HTTP smoke check $HEALTHCHECK_URL"
    else
        fail "HTTP smoke check $HEALTHCHECK_URL"
    fi
fi

printf '\nPassed: %s\nFailed: %s\n' "$PASSED" "$FAILED"

if ((FAILED > 0)); then
    printf 'Inspect failures with: docker compose ps -a && docker compose logs --tail=150 <service>\n' >&2
    exit 1
fi

printf 'All inspected services passed.\n'
