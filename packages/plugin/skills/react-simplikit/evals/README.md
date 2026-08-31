# Consumer-skill evaluation

Measures whether shipping the `react-simplikit` skill actually changes what a coding agent
produces, compared against an identical agent without it. `evals.json` is the audited prompt set;
`scripts/` re-runs the measurement.

## Method (bias controls first)

- **Blind authorship.** Prompts are written by an agent forbidden to read this repo, the skill, or
  the web. It receives need-domains ("a search field that shouldn't hammer the API"), never export
  names. Knowledge prompts name only the npm packages a real developer would already know.
- **Asymmetric audit.** A second, catalog-aware agent audits the set. It may flag, reword,
  re-label, or strike — it may not add prompts or assertions, because anything it writes is
  catalog-derived. In iteration 2 it also caught (and fixed, pre-run) a harness leak that would
  have exposed the answer key to one arm.
- **Out-of-scope traps.** 3 of 10 prompts cover needs the library serves nothing for. Without
  them the set could only flatter the skill.
- **Paired arms.** Each prompt runs twice in identical app copies — one arm is pointed at the
  skill, one is not. A grader then scores both against the same per-eval assertions, with the real
  library source (never the skill's own reference pages) as ground truth, and
  `scripts/check_imports.mjs` settling import-shape questions mechanically.
- **Trigger measurement.** `scripts/measure_trigger.py` runs each prompt headlessly with the skill
  installed at `.claude/skills/react-simplikit/` and `--setting-sources project` (so user-level
  hooks can't inflate invocation), and detects consultation anywhere in the stream —
  skill-creator's own `run_eval.py` scores only the first tool call and reports 0% on every
  realistic run.

## Results so far

| | iteration 1 (2026-08-28) | iteration 2 (2026-08-31) |
| --- | --- | --- |
| fixture | library installed | library **not** installed (8/10 apps) |
| task quality | tie, 46/46 vs 46/46 (ceiling) | 55/56 vs 53/56 — one clean win |
| trigger accuracy | 8/10 (global config, inflated) | 6/10 (isolated) |
| over-application | 1 case (`useInputState` in a form) | none |

Iteration 2's win (eval 3, fixed bar above the iOS keyboard): the skill arm's `useAvoidKeyboard`
answer passed 6/6 including the safe-area double-count subtlety; the baseline hand-rolled
visualViewport tracking and failed the safe-area and SSR assertions. The tied evals are the honest
majority: an Opus-class baseline hand-rolls most generic UI logic correctly.

Sharpest actionable finding: SKILL.md does not state the package version, and the skill arm
declared invented `^1.x` ranges in 7 of 8 manifests it touched (latest real version: 0.1.0).
Trigger pattern: mobile-quirk and package-knowledge prompts consult the skill; generic UI prompts
(debounce, outside-click, ref merging) do not.

## Re-running

1. Build a workspace: per eval, `iteration-N/eval-<id>/task.md` (the prompt only — never the
   assertions) and two arm directories with identical app copies; give one arm the skill.
2. Run both arms, grade each against `evals.json`'s `expectations` (assertions live there, out of
   the arms' reach), writing `grading.json` per arm.
3. `python3 scripts/measure_trigger.py <workspace>` for trigger measurement (needs
   `trigger-runs/eval-<id>/` app copies with the skill installed).
4. `node scripts/aggregate.mjs evals.json <workspace>/iteration-N <workspace>/trigger-consult-results.json`

Interpretation guardrails: buckets are reported separately (discovery, knowledge, out-of-scope
restraint); a tie on eval 7 is expected (the installed package's exports map makes it
baseline-solvable); single-seed cells; both arms invent "before" states for files the prompts name.
