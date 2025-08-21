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

# Block edits in sensitive paths
sensitive = [".env", ".git/", "id_rsa", "id_ed25519"]
for s in sensitive:
    if s in cmd:
        reject(f"Blocked sensitive path in command: {s}")

approve()


