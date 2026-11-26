#!/usr/bin/env bash
# Collect the raw facts needed to write Mezzanine UI release notes.
#
# Usage:
#   bash .claude/skills/release-notes/scripts/gather.sh @mezzanine-ui/react@1.11.0 ng@1.0.0-rc.27 ...
#
# For every package spec it prints:
#   - the release tag and the previous tag of the same package (semver-aware, rc < stable)
#   - path-filtered commits (release / merge commits removed) with any BREAKING markers
#   - changed source files (so pure version bumps are easy to spot)
#   - @mezzanine-ui/* dependency versions and peerDependencies at the release tag
#
# The script only reads git data; it never writes, tags or pushes.

set -euo pipefail

SCOPE="@mezzanine-ui"
REPO_URL="https://github.com/Mezzanine-UI/mezzanine"

if [ "$#" -eq 0 ]; then
  echo "usage: gather.sh <pkg@version> [<pkg@version> ...]" >&2
  echo "example: gather.sh @mezzanine-ui/react@1.11.0 core@1.4.0" >&2
  exit 1
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

# Sort tags so that 1.0.0-rc.9 < 1.0.0-rc.10 < 1.0.0.
sorted_tags() {
  git -c versionsort.suffix=- tag --list --sort=v:refname "$SCOPE/$1@*"
}

print_json_deps() {
  # $1 = tag, $2 = package dir
  git show "$1:packages/$2/package.json" | node -e '
    let raw = "";
    process.stdin.on("data", (c) => (raw += c));
    process.stdin.on("end", () => {
      const pkg = JSON.parse(raw);
      const internal = Object.entries(pkg.dependencies || {})
        .filter(([name]) => name.startsWith("@mezzanine-ui/"));
      console.log("  dependencies (@mezzanine-ui/*):");
      internal.forEach(([n, v]) => console.log(`    ${n}: ${v}`));
      if (internal.length === 0) console.log("    (none)");
      console.log("  peerDependencies:");
      const peers = Object.entries(pkg.peerDependencies || {});
      peers.forEach(([n, v]) => console.log(`    ${n}: ${v}`));
      if (peers.length === 0) console.log("    (none)");
    });
  '
}

for spec in "$@"; do
  spec="${spec#- }"
  spec="${spec#"$SCOPE"/}"
  pkg="${spec%%@*}"
  version="${spec#*@}"
  tag="$SCOPE/$pkg@$version"

  echo "================================================================"
  echo "PACKAGE  $SCOPE/$pkg@$version"
  echo "================================================================"

  if ! git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
    echo "!! tag $tag not found locally. Run: git fetch --all --tags" >&2
    continue
  fi

  prev=""
  for t in $(sorted_tags "$pkg"); do
    if [ "$t" = "$tag" ]; then
      break
    fi
    prev="$t"
  done

  if [ -z "$prev" ]; then
    echo "previous tag: (none — first release of this package)"
    range="$tag"
  else
    echo "previous tag: $prev"
    range="$prev..$tag"
    echo "changelog:    $REPO_URL/compare/$prev...$tag"
  fi

  case "$version" in
    *-*) echo "stage:        pre-release (RC rules: Breaking Changes section allowed)" ;;
    *) echo "stage:        stable (no Breaking Changes section; flag real requirement/visible changes honestly)" ;;
  esac
  echo

  echo "--- commits (path: packages/$pkg/) ---"
  commits="$(git log "$range" --no-merges --format='%h %s' -- "packages/$pkg/" \
    | grep -v -E '^[0-9a-f]+ chore: (release|bump version)' || true)"
  if [ -z "$commits" ]; then
    echo "(none — pure version bump; describe as a compatibility bump)"
  else
    echo "$commits"
  fi
  echo

  echo "--- BREAKING markers in commit bodies ---"
  breaking="$(git log "$range" --no-merges --format='%h %s%n%b' -- "packages/$pkg/" \
    | grep -n -i -E 'BREAKING|^[0-9a-f]+ [a-z]+(\([^)]*\))?!:' || true)"
  echo "${breaking:-(none)}"
  echo

  echo "--- issue references ---"
  issues="$(git log "$range" --no-merges --format='%B' -- "packages/$pkg/" \
    | grep -o -i -E '(close[sd]?|fix(e[sd])?|resolve[sd]?|refs?) #[0-9]+' | sort -u || true)"
  echo "${issues:-(none)}"
  echo

  echo "--- changed files (excluding package.json / CHANGELOG) ---"
  files="$(git diff --name-only "${prev:-$tag^}" "$tag" -- "packages/$pkg/" \
    | grep -v -E '(package\.json|CHANGELOG\.md)$' || true)"
  echo "${files:-(none — pure version bump)}"
  echo

  echo "--- package.json at $tag ---"
  print_json_deps "$tag" "$pkg"
  echo
done
