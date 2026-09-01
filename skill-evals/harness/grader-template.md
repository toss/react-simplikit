Grade one evaluation case. Two agents were given the same task; one had a skill for the `react-simplikit` library, one did not. Your job is to apply an identical standard to both.

EVAL={{EVAL}}

Read first:

- `$EVAL/eval_metadata.json` — the prompt and the assertions to grade
- `$EVAL/with_skill/outputs/SOLUTION.md` and `$EVAL/with_skill/outputs/user_notes.md`
- `$EVAL/without_skill/outputs/SOLUTION.md` and `$EVAL/without_skill/outputs/user_notes.md`
- the code actually written, under `$EVAL/<arm>/app/src/` (and `$EVAL/<arm>/app/package.json` where an assertion concerns dependencies)

## Ground truth for anything about the library

Do NOT grade API correctness against the skill's own reference pages. Use the real source:

- `packages/react-simplikit/src/` (repository-relative) — implementations and JSDoc
- where the eval's app has a package installed under `node_modules/`, its `dist/*.d.mts` type signatures are also ground truth

If a solution calls a react-simplikit API, open the implementation and check the call matches: option names, argument order, return shape, and whether the hook's actual behaviour satisfies what the prompt asked. A hook that exists and is imported correctly but does not do what the prompt requires is a FAIL on the relevant assertion, not a pass.

In this iteration most apps do NOT have react-simplikit installed. Using the library is NOT required by task-quality assertions; hand-written logic that satisfies an assertion passes it. Assertions about import discipline apply only to imports that actually exist.

## Mechanical check

Run this from the repository root on each arm and paste the JSON into your evidence:

```
node skill-evals/scripts/check_imports.mjs $EVAL/<arm>/app/src skill-evals/public-exports.json
```

## Standard

- PASS needs evidence you can quote (file + line, or the mechanical JSON). Burden of proof is on the assertion.
- Superficial compliance is a FAIL: code that mentions the right thing but does not implement it, cleanup that never runs, a guard that cannot fire.
- Apply the identical bar to both arms. If you find yourself explaining away a defect in one arm that you flagged in the other, stop and re-grade.
- Also record, outside the assertions, anything notable an assertion did not capture: a defect, a regression, a materially better approach in one arm, whether each arm discovered/recommended react-simplikit at all, and whether what it said about the library is true.

## Output

Write `$EVAL/<arm>/grading.json` for BOTH arms, each:
{
"expectations": [ { "text": "<assertion>", "passed": true|false, "evidence": "<quoted proof>" }, ... ],
"summary": { "passed": N, "total": M },
"library_used": true|false,
"library_recommended": true|false,
"notes": "<anything the assertions did not capture>"
}

Your final message: 3-6 sentences — the discriminating differences between the arms, if any.
