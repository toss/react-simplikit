#!/usr/bin/env node
// Rolls the per-run grading.json files up into one table, split by bucket — the buckets measure
// different things (discovery / knowledge / out-of-scope restraint) and must not be averaged
// into a single number.
//
// Usage: aggregate.mjs <evals.json> <iteration-dir> [trigger-consult-results.json]
//   <iteration-dir> holds eval-<id>/{with_skill,without_skill}/grading.json

import { readFileSync, existsSync } from 'node:fs';

const [, , evalsFile, iterationDir, triggerFile] = process.argv;
if (!evalsFile || !iterationDir) {
  console.error('usage: aggregate.mjs <evals.json> <iteration-dir> [trigger-consult-results.json]');
  process.exit(1);
}
const set = JSON.parse(readFileSync(evalsFile, 'utf8')).evals;
const triggers = triggerFile && existsSync(triggerFile) ? JSON.parse(readFileSync(triggerFile, 'utf8')) : [];

const rows = set.map(item => {
  const read = arm => {
    const path = `${iterationDir}/eval-${item.id}/${arm}/grading.json`;
    if (!existsSync(path)) return null;
    const grading = JSON.parse(readFileSync(path, 'utf8'));
    return { ...grading.summary, used: grading.library_used, rec: grading.library_recommended };
  };
  const trigger = triggers.find(t => t.eval_id === item.id);
  return {
    id: item.id,
    bucket: item.bucket,
    need: item.need,
    with: read('with_skill'),
    without: read('without_skill'),
    consulted: trigger?.consulted ?? null,
    consult_expected: item.consult_expected,
  };
});

const pad = (value, width) => String(value).padEnd(width);
console.log(
  pad('id', 4) +
    pad('bucket', 14) +
    pad('with', 10) +
    pad('without', 10) +
    pad('lib w/wo', 10) +
    pad('trigger', 9) +
    'need'
);
for (const row of rows) {
  const score = summary => (summary === null ? '  --  ' : `${summary.passed}/${summary.total}`);
  const lib = summary => (summary === null ? '-' : summary.used ? 'U' : summary.rec ? 'R' : '.');
  const trigger =
    row.consulted === null
      ? '--'
      : `${row.consulted ? 'yes' : 'no'}${row.consulted === row.consult_expected ? '' : ' ✗'}`;
  console.log(
    pad(row.id, 4) +
      pad(row.bucket, 14) +
      pad(score(row.with), 10) +
      pad(score(row.without), 10) +
      pad(`${lib(row.with)}/${lib(row.without)}`, 10) +
      pad(trigger, 9) +
      row.need.slice(0, 48)
  );
}

for (const bucket of [...new Set(rows.map(row => row.bucket))]) {
  const done = rows.filter(row => row.bucket === bucket && row.with && row.without);
  if (done.length === 0) continue;
  const sum = (arm, field) => done.reduce((total, row) => total + row[arm][field], 0);
  const wins = done.filter(row => row.with.passed > row.without.passed).length;
  const losses = done.filter(row => row.with.passed < row.without.passed).length;
  console.log(
    `\n${bucket} (n=${done.length}): with ${sum('with', 'passed')}/${sum('with', 'total')}  ` +
      `without ${sum('without', 'passed')}/${sum('without', 'total')}  ` +
      `— skill better ${wins}, worse ${losses}, tied ${done.length - wins - losses}`
  );
}

const measured = rows.filter(row => row.consulted !== null);
if (measured.length > 0) {
  console.log(
    `\ntrigger: ${measured.filter(row => row.consulted === row.consult_expected).length}/${measured.length} correct`
  );
}
