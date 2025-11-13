#!/usr/bin/env bash
# Run npm-check-updates across repository subprojects and print available updates.
# Usage: ./ncu-all.sh

set -euo pipefail

ROOT_DIR="$(pwd)"
PROJECTS=("." "astro-website" "react-app" "node-api")

echo "Running npm-check-updates (read-only) for projects: ${PROJECTS[*]}"

for p in "${PROJECTS[@]}"; do
  if [ -f "$p/package.json" ]; then
    echo
    echo "========================================"
    echo "Checking updates in: $p"
    echo "----------------------------------------"
    # cd into project and run ncu (will install via npx if not present)
  (cd "$p" && npx npm-check-updates@latest)
  else
    echo "Skipping $p: package.json not found"
  fi
done

echo
echo "Done. To upgrade packages, run 'npx npm-check-updates -u' inside the project and then 'npm install'."
