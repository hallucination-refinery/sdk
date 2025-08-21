#!/usr/bin/env python3
import json, sys, os, shlex, time

def reject(msg: str):
    print(json.dumps({
        "decision": "reject",
        "reason": msg
    }))
    sys.exit(0)

def approve():
    print(json.dumps({
        "decision": "approve",
        "reason": "ok"
    }))
    sys.exit(0)

try:
    data = json.load(sys.stdin)
except Exception as e:
    reject(f"Invalid hook input: {e}")

cmd = data.get("tool_input", {}).get("command", "")
cwd = data.get("cwd", "")

# Disallow sudo and playwright --with-deps in this container
if " sudo " in f" {cmd} ":
    reject("sudo is not allowed in this environment")
if "playwright install" in cmd and "--with-deps" in cmd:
    reject("Use workspace cache; do not use --with-deps")

# Require workflow-path on orchestrate invocations
if " /orchestrate" in cmd or cmd.strip().startswith("/orchestrate"):
    if "--workflow-path" not in cmd:
        reject("/orchestrate must include --workflow-path")

# Disallow meaningless empty commits unless gates_passed true for session
if cmd.strip().startswith("git commit") and "--allow-empty" in cmd:
    # Read run state if present
    run_id_file = os.path.join(cwd, ".clmem", "current_run_id")
    if os.path.exists(run_id_file):
        run_id = open(run_id_file).read().strip()
        run_dir = os.path.join(cwd, ".clmem", "runs", run_id)
        results = os.path.join(run_dir, "results.json")
        try:
            if os.path.exists(results):
                j = json.load(open(results))
                if not j or not j.get("gates_passed", False):
                    reject("Blocking empty commit: gates_passed=false or missing")
        except Exception:
            reject("Blocking empty commit: results.json unreadable")

# Block edits in sensitive paths
sensitive = [".env", ".git/", "id_rsa", "id_ed25519"]
for s in sensitive:
    if s in cmd:
        reject(f"Blocked sensitive path in command: {s}")

approve()


