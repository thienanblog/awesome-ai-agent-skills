#!/bin/bash
#
# wait-for-it.sh - Wait for a service to be ready
# Based on the popular vishnubob/wait-for-it.sh
#

set -e

TIMEOUT=30
QUIET=0
HOST=""
PORT=""

usage() {
    cat << EOF
Usage: $0 host:port [-t timeout] [-q] [-- command args]

    -h HOST | --host=HOST       Host or IP to test
    -p PORT | --port=PORT       Port to test
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -q | --quiet                Don't output any status messages
    -- COMMAND ARGS             Execute command with args after the test finishes

Examples:
    $0 mysql:3306 -t 60 -- echo "MySQL is up"
    $0 -h redis -p 6379 --timeout=30 -- redis-cli ping
EOF
    exit 1
}

wait_for() {
    if [[ $TIMEOUT -gt 0 ]]; then
        echoerr "Waiting $TIMEOUT seconds for $HOST:$PORT"
    else
        echoerr "Waiting for $HOST:$PORT without a timeout"
    fi

    local start_ts=$(date +%s)
    while :
    do
        if nc -z "$HOST" "$PORT" > /dev/null 2>&1; then
            local end_ts=$(date +%s)
            echoerr "$HOST:$PORT is available after $((end_ts - start_ts)) seconds"
            return 0
        fi

        sleep 1

        if [[ $TIMEOUT -gt 0 ]]; then
            local current_ts=$(date +%s)
            if [[ $((current_ts - start_ts)) -ge $TIMEOUT ]]; then
                echoerr "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
                return 1
            fi
        fi
    done
}

echoerr() {
    if [[ $QUIET -eq 0 ]]; then
        echo "$@" 1>&2
    fi
}

# Parse arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
            HOST=$(echo "$1" | cut -d: -f1)
            PORT=$(echo "$1" | cut -d: -f2)
            shift 1
            ;;
        -h | --host)
            HOST="$2"
            shift 2
            ;;
        --host=*)
            HOST="${1#*=}"
            shift 1
            ;;
        -p | --port)
            PORT="$2"
            shift 2
            ;;
        --port=*)
            PORT="${1#*=}"
            shift 1
            ;;
        -t | --timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        --timeout=*)
            TIMEOUT="${1#*=}"
            shift 1
            ;;
        -q | --quiet)
            QUIET=1
            shift 1
            ;;
        --)
            shift
            CLI=("$@")
            break
            ;;
        --help)
            usage
            ;;
        *)
            echoerr "Unknown argument: $1"
            usage
            ;;
    esac
done

if [[ -z "$HOST" || -z "$PORT" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage
fi

wait_for
RESULT=$?

if [[ $RESULT -ne 0 ]]; then
    exit $RESULT
fi

if [[ ${#CLI[@]} -gt 0 ]]; then
    exec "${CLI[@]}"
fi

exit 0
