#!/usr/bin/env bash
set -euo pipefail
PYTHON_EXE="${PYTHON_EXE:-python3}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$PYTHON_EXE" "$SCRIPT_DIR/install_nciforge_cli.py"
