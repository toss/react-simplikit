#!/usr/bin/env python3
"""Measure whether the skill is consulted at any point in a realistic headless run.

skill-creator's run_eval.py scores only the FIRST tool call, so any agent that orients with
Bash before acting is recorded as "not triggered" — every realistic run here did exactly that.
This walks the whole stream-json event stream instead and reports a consult wherever it happens.

Usage: measure_trigger.py <workspace-dir> [eval-id ...]

<workspace-dir> is laid out as:
  iteration-N/eval-<id>/task.md          the prompt (and nothing else — no assertions)
  trigger-runs/eval-<id>/                a copy of the consumer app, with the skill installed
                                         at .claude/skills/react-simplikit/

Runs use `--setting-sources project` so user-level plugins and hooks cannot inflate (or compete
with) skill invocation. A run counts as consulted if it invokes the Skill tool for
react-simplikit OR touches any path inside .claude/skills/react-simplikit/ with any tool.
"""

import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SKILL_MARKER = "/.claude/skills/react-simplikit/"
TIMEOUT_SECONDS = 420


def consulted(event_stream: str) -> tuple[bool, list[str]]:
    trace: list[str] = []
    for line in event_stream.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        if event.get("type") != "assistant":
            continue
        for item in event.get("message", {}).get("content", []):
            if item.get("type") != "tool_use":
                continue
            name = item.get("name", "")
            payload = json.dumps(item.get("input", {}))
            trace.append(name)
            if name == "Skill" and "react-simplikit" in payload:
                return True, trace
            if SKILL_MARKER in payload:
                return True, trace
    return False, trace


def run(workspace: Path, iteration_dir: Path, eval_id: int) -> dict:
    app = workspace / "trigger-runs" / f"eval-{eval_id}"
    prompt = (iteration_dir / f"eval-{eval_id}" / "task.md").read_text().strip()
    # CLAUDECODE is stripped because its guard is for interactive terminal conflicts;
    # programmatic subprocess usage is safe.
    env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}
    try:
        process = subprocess.run(
            [
                "claude", "-p", prompt,
                "--model", "claude-opus-5",
                "--output-format", "stream-json",
                "--verbose",
                "--setting-sources", "project",
                "--dangerously-skip-permissions",
            ],
            cwd=app, env=env, capture_output=True, text=True, timeout=TIMEOUT_SECONDS,
        )
        stream = process.stdout
        timed_out = False
    except subprocess.TimeoutExpired as expired:
        out = expired.stdout
        stream = out.decode("utf-8", errors="replace") if isinstance(out, bytes) else (out or "")
        timed_out = True

    (workspace / "trigger-runs" / f"eval-{eval_id}.jsonl").write_text(stream)
    hit, trace = consulted(stream)
    return {"eval_id": eval_id, "consulted": hit, "timed_out": timed_out, "tool_trace": trace[:12]}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: measure_trigger.py <workspace-dir> [eval-id ...]")
    workspace = Path(sys.argv[1])
    iteration_dir = max(workspace.glob("iteration-*"), key=lambda p: int(p.name.split("-")[1]))
    ids = [int(a) for a in sys.argv[2:]] or sorted(
        int(p.name.split("-")[1]) for p in iteration_dir.glob("eval-*")
    )
    with ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(lambda i: run(workspace, iteration_dir, i), ids))
    (workspace / "trigger-consult-results.json").write_text(json.dumps(results, indent=2) + "\n")
    for r in results:
        mark = "CONSULTED" if r["consulted"] else "no"
        print(f"eval-{r['eval_id']}: {mark}{' (timeout)' if r['timed_out'] else ''}  tools={r['tool_trace'][:6]}")
