#!/usr/bin/env bash
set -Eeuo pipefail

log() { printf "[conductor:init] %s\n" "$*"; }

ROOT="${CONDUCTOR_ROOT_PATH:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
WS="${CONDUCTOR_WORKSPACE_PATH:-$PWD}"
NAME="${CONDUCTOR_WORKSPACE_NAME:-workspace}"
DEFAULT_BRANCH="${CONDUCTOR_DEFAULT_BRANCH:-main}"

log "Workspace: $NAME"
log "Root: $ROOT"
log "Workspace path: $WS"
log "Default branch: $DEFAULT_BRANCH"

cd "$WS"

# 1) Copy .env files from root to workspace if present
copy_if_exists() {
	local src="$1"
	local dest="$2"
	if [ -f "$src" ] && [ ! -f "$dest" ]; then
		mkdir -p "$(dirname "$dest")"
		cp "$src" "$dest"
		log "Copied $(basename "$src") -> $dest"
	fi
}

for f in .env .env.local .env.development .env.test .env.production; do
	copy_if_exists "$ROOT/$f" "$WS/$f"
done

# 2) Promote example envs within the workspace (e.g., .env.example -> .env)
promote_examples() {
	local example="$1"
	local target="$2"
	if [ -f "$example" ] && [ ! -f "$target" ]; then
		cp "$example" "$target"
		log "Created $(basename "$target") from $(basename "$example")"
	fi
}

while IFS= read -r -d '' file; do
	dir="$(dirname "$file")"
	base="$(basename "$file")"
	case "$base" in
		.env.example)
			promote_examples "$file" "$dir/.env"
			;;
		example.env)
			promote_examples "$file" "$dir/.env"
			;;
		*.env.example)
			target="${base%.example}"
			promote_examples "$file" "$dir/$target"
			;;
		*.env.sample)
			target="${base%.sample}"
			promote_examples "$file" "$dir/$target"
			;;
		*.env.template)
			target="${base%.template}"
			promote_examples "$file" "$dir/$target"
			;;
		.env.*.example)
			# .env.local.example -> .env.local
			target="${base%.example}"
			promote_examples "$file" "$dir/$target"
			;;
	esac
done < <(find "$WS" -type f \( \
	-name ".env.example" -o \
	-name "example.env" -o \
	-name "*.env.example" -o \
	-name "*.env.sample" -o \
	-name "*.env.template" -o \
	-name ".env.*.example" \) -print0 2>/dev/null || true)

# 3) Install Node dependencies (prefer pnpm if configured)
install_node_deps() {
	if [ -f "$WS/pnpm-workspace.yaml" ] || grep -qE '"packageManager"\s*:\s*"pnpm@' "$WS/package.json" 2>/dev/null; then
		if command -v corepack >/dev/null 2>&1; then
			corepack enable || true
			PNPM_VERSION="$(grep -oE '"packageManager":\s*"pnpm@[^"]+' "$WS/package.json" 2>/dev/null | sed -E 's/.*"pnpm@([^"]+).*/\1/' || true)"
			if [ -n "${PNPM_VERSION:-}" ]; then
				corepack prepare "pnpm@$PNPM_VERSION" --activate || true
			fi
		fi
		log "Installing Node deps with pnpm"
		if [ -f "$WS/pnpm-lock.yaml" ]; then
			pnpm install --frozen-lockfile || pnpm install
		else
			pnpm install
		fi
	elif [ -f "$WS/yarn.lock" ]; then
		log "Installing Node deps with yarn"
		if command -v corepack >/dev/null 2>&1; then corepack enable || true; fi
		yarn install --immutable || yarn install
	elif [ -f "$WS/package-lock.json" ] || [ -f "$WS/package.json" ]; then
		log "Installing Node deps with npm"
		npm ci || npm install
	else
		log "No Node project detected; skipping Node install"
	fi
}

install_node_deps

log "Init completed."


