# Consumer-skill evaluation

Measures whether shipping the `react-simplikit` skill actually changes what a coding agent
produces, compared against an identical agent without it. This directory lives at the repository
root on purpose: anywhere under `packages/plugin` is delivered to everyone who installs the plugin
(the documented install commands fetch that whole tree), and an answer key must not travel with
the skill it tests — neither to consumers nor into the sandboxes of future measurement runs.

## Layout

- `evals.json` — the audited prompt set: 10 prompts, 56 assertions, per-eval `audit_note` carrying
  the auditor's binding grading rulings and fixture specifications. Do not grade without reading
  the `audit_note` of the eval at hand.
- `harness/` — the arm prompts (`run-template.md` + `skill-section.md` for the with-skill arm),
  the grader prompt (`grader-template.md`), and the three fixture apps (`fixtures/`). The fixture
  `node_modules` are not committed: eval 6 additionally installs the published
  `@react-simplikit/mobile@0.1.1` tarball, eval 7 the published `react-simplikit@0.1.0` tarball,
  exactly as pinned in each fixture's `package.json`.
- `scripts/` — `measure_trigger.py` (trigger measurement), `check_imports.mjs` (mechanical import
  assertions), `aggregate.mjs` (per-bucket rollup), `collect_public_exports.mjs` (regenerates
  `public-exports.json` from the package barrel).

## Method

- **Blind authorship.** Prompts are written by an agent forbidden to read this repo, the skill, or
  the web; it receives need-domains, never export names. Iteration 1's ten prompts were all
  written this way. **Iteration 2 reused seven of them unchanged and blind-authored three new
  ones** (the two knowledge prompts and the merge-refs case) — the blindness guarantee is
  per-prompt-origin, not per-iteration.
- **Asymmetric audit.** A catalog-aware agent audits the set: it may flag, reword, re-label, or
  strike, and may not add prompts or assertions. In iteration 2 it caught a harness leak before
  any run (the with-skill arm's prompt pointed at a directory whose parent held this answer key)
  and reworded three assertions the library itself could not have passed.
- **Out-of-scope traps.** 3 of 10 prompts cover needs the library serves nothing for.
- **Paired arms, graded against ground truth.** Each prompt runs twice in identical app copies;
  a grader scores both against the same assertions using the real library source — never the
  skill's own reference pages — with `check_imports.mjs` settling import-shape questions
  mechanically. The grader is itself an LLM (Opus 5), one run per arm, no inter-grader agreement
  measured.
- **Trigger measurement** runs each prompt headlessly with the skill installed and
  `--setting-sources project`, detecting consultation anywhere in the stream (skill-creator's own
  `run_eval.py` scores only the first tool call and reports 0% on every realistic run).

### Contamination rules

The prompts and assertions are public, and whoever edits the skill can read them. Three rules keep
the benchmark able to say "discard the skill" honestly:

1. A skill change derived from an eval finding is validated against newly blind-authored prompts,
   never only against the prompts that produced the finding.
2. `SKILL.md` is never worded to satisfy an assertion.
3. Reused prompts are marked (`reused_from_v1`) and their results read with that in mind.

## Results so far

|                  | iteration 1 (2026-08-28)           | iteration 2 (2026-08-31)              |
| ---------------- | ---------------------------------- | ------------------------------------- |
| fixture          | library installed                  | library **not** installed (8/10 apps) |
| task quality     | tie, 46/46 vs 46/46 (ceiling)      | 55/56 vs 53/56 — one clean win        |
| trigger accuracy | 8/10 (global config, inflated)     | 6/10 (isolated)                       |
| over-application | 1 case (`useInputState` in a form) | none                                  |

**Margin disclosure.** The iteration-2 totals depend on the auditor's rewordings. Three assertions
were reworded because the library itself could not pass their original wording; restoring the
pre-audit wording flips eval 2 from a tie to a skill loss (the reworded listener clause was the
skill arm's only route to a pass) and changes nothing elsewhere — giving **54/56 vs 53/56**, a net
margin of one assertion, not two. The eval-3 win (fixed bar above the iOS keyboard: skill arm's
`useAvoidKeyboard` passed 6/6 including the safe-area double-count subtlety; the baseline
hand-rolled visualViewport tracking and failed the safe-area and SSR assertions) stands under
either wording. Every cell is a single seed; iteration 1's 46/46 figures are carried from a run
whose artifacts predate this directory and are not reproducible from it.

**Iteration-2 findings, recorded as of skill commit `fd312f5`** (they describe that snapshot and
are not kept current): SKILL.md stated no package version, and the skill arm declared invented
`^1.x` ranges in 7 of 8 manifests it touched (latest real version: 0.1.0). Trigger pattern:
mobile-quirk and package-knowledge prompts consult the skill; generic UI prompts (debounce,
outside-click, ref merging) do not.

## Re-running

What is committed suffices to rebuild the workspace; what is not committed is the run outputs
(20 arm directories, gradings, transcripts — they live outside the repo) and the orchestration,
which is plain agent-spawning around these prompts.

1. Per eval, create `iteration-N/eval-<id>/task.md` containing ONLY the `prompt` field — never the
   assertions — and two arm directories, each holding a copy of the eval's `fixture` app from
   `harness/fixtures/` (evals 6 and 7 need the pinned tarballs unpacked into `node_modules`).
   Give the with-skill arm a copy of the CURRENT skill at `<arm>/skill/`.
2. Run both arms with `harness/run-template.md` (`{{RUN}}` → the arm directory;
   `{{SKILL_SECTION}}` → `harness/skill-section.md` for the with-skill arm, empty for the
   baseline). Then grade both with `harness/grader-template.md`, which writes one `grading.json`
   per arm:
   `{ "expectations": [{ "text", "passed", "evidence" }], "summary": { "passed", "total" },
"library_used", "library_recommended", "notes" }`
3. `node scripts/collect_public_exports.mjs > public-exports.json` (refresh before grading),
   `python3 scripts/measure_trigger.py <workspace>` for triggers (needs `trigger-runs/eval-<id>/`
   app copies with the skill installed at `.claude/skills/react-simplikit/`).
4. `node scripts/aggregate.mjs evals.json <workspace>/iteration-N <workspace>/trigger-consult-results.json`

Interpretation guardrails: buckets are reported separately (discovery, knowledge, out-of-scope
restraint); a tie on eval 7 is expected (the installed package's exports map makes it
baseline-solvable); both arms invent "before" states for files the prompts name.
