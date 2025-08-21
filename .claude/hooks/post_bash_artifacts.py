#!/usr/bin/env python3
import json, sys, os, time, subprocess

def main():
    data = json.load(sys.stdin)
    cwd = data.get("cwd", "")
    tool_input = data.get("tool_input", {})
    cmd = tool_input.get("command", "")
    run_dir = os.environ.get("RUN_DIR") or ""
    start_ms = os.environ.get("SESSION_START_MS") or ""

    # Only validate after likely artifact-producing steps
    triggers = ["pnpm smoke:brain", "--filter cryptiq-mindmap-demo dev", "curl -sf http://localhost:3000/brain"]
    if not any(t in cmd for t in triggers):
        return 0

    if not run_dir or not start_ms:
        return 0

    script = os.path.join(os.environ.get("CLAUDE_PROJECT_DIR", cwd), "scripts", "validate-artifacts.sh")
    if not os.path.exists(script):
        return 0

    try:
        subprocess.run([script, run_dir, start_ms], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        # Return JSON to surface a warning in transcript; actual fail should be enforced by validate-agent too
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "warning": f"Artifact validation failed: {e.stderr.decode(errors='ignore')}"
            }
        }))
    return 0

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(0)


