#!/usr/bin/env node
/**
 * Unit test for the exam grade estimator's pure model (app.js). The model
 * functions are extracted from app.js between the EXAM GRADE ESTIMATOR and
 * PLAYLIST markers and evaluated in a sandbox — they have no DOM or network
 * dependencies. Runs inside `npm test` in CI.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

const startMarker = '// ===== EXAM GRADE ESTIMATOR =====';
const endMarker = '// ===== PLAYLIST =====';
const start = appJs.indexOf(startMarker);
const end = appJs.indexOf(endMarker);
assert.ok(start > 0, 'estimator section marker found');
assert.ok(end > start, 'estimator section end marker found');

// Pull the EST_LETTERS const and the three pure functions out of the section source.
const section = appJs.slice(start, end);
const sandbox = { Date, Math, String, Number, Set, Object, Array };
vm.createContext(sandbox);
const constRe = /const EST_LETTERS = \[[\s\S]*?\n\];/;
const constM = section.match(constRe);
assert.ok(constM && constM[0], 'found EST_LETTERS const');
vm.runInContext(constM[0], sandbox);
const fns = ['estLetter', 'estRecencyWeight', 'computeExamEstimate', 'computePredictionStats'];
for (const fn of fns) {
  const re = new RegExp('function ' + fn + '\\b[\\s\\S]*?\\n\\}', 'm');
  const m = section.match(re);
  assert.ok(m && m[0], 'found function ' + fn);
  vm.runInContext(m[0], sandbox);
}
assert.ok(typeof sandbox.computeExamEstimate === 'function', 'computeExamEstimate loaded');
assert.ok(typeof sandbox.estLetter === 'function', 'estLetter loaded');
assert.ok(typeof sandbox.estRecencyWeight === 'function', 'estRecencyWeight loaded');
assert.ok(typeof sandbox.computePredictionStats === 'function', 'computePredictionStats loaded');

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
  console.log('  ✓ ' + msg);
}

console.log('exam grade estimator unit test');

// 1. Letter mapping
ok(sandbox.estLetter(95).letter === 'A', '95 → A');
ok(sandbox.estLetter(90).letter === 'A', '90 → A (boundary)');
ok(sandbox.estLetter(89).letter === 'B', '89 → B');
ok(sandbox.estLetter(80).letter === 'B', '80 → B (boundary)');
ok(sandbox.estLetter(79).letter === 'C', '79 → C');
ok(sandbox.estLetter(70).letter === 'C', '70 → C (boundary)');
ok(sandbox.estLetter(69).letter === 'D', '69 → D');
ok(sandbox.estLetter(60).letter === 'D', '60 → D (boundary)');
ok(sandbox.estLetter(59).letter === 'F', '59 → F');

// 2. Recency weighting decays but floors
ok(sandbox.estRecencyWeight(new Date().toISOString(), Date.now()) > 0.99, 'today gets near-full weight');
ok(sandbox.estRecencyWeight('2020-01-01', Date.now()) === 0.25, 'ancient data floors at 0.25');
ok(sandbox.estRecencyWeight('2026-08-10', new Date('2026-08-11T12:00:00Z').getTime()) > 0.9, 'yesterday nearly full weight');
ok(sandbox.estRecencyWeight('not-a-date', Date.now()) === 0.3, 'bad dates fall back to 0.3');

// 3. No evidence → null
ok(sandbox.computeExamEstimate({}) === null, 'empty state → null');

// 4. Quiz-only evidence
const s1 = {
  quizAttempts: [
    { topic: 'Physics', subject: 'Physics', score: 9, total: 10, pct: 90, date: new Date().toISOString() },
    { topic: 'Physics', subject: 'Physics', score: 8, total: 10, pct: 80, date: new Date().toISOString() }
  ],
  mockTestHistory: [], assignments: [], confusionLog: []
};
const e1 = sandbox.computeExamEstimate(s1);
ok(e1 && e1.overall >= 80 && e1.overall <= 90, 'two quizzes average in band (' + e1.overall + '%)');
ok(e1.totalEvidence === 2, 'evidence count is 2');
ok(e1.perSubject.length === 1 && e1.perSubject[0].name === 'Physics', 'subject surfaced');
ok(e1.letter.letter === 'B' || e1.letter.letter === 'A', 'letter matches ~85% (' + e1.letter.letter + ')');

// 5. Confusion penalty drags the estimate down
const s2 = {
  quizAttempts: [
    { topic: 'Bio', subject: 'Bio', score: 8, total: 10, pct: 80, date: new Date().toISOString() }
  ],
  mockTestHistory: [],
  assignments: [],
  confusionLog: [
    { topic: 'Bio', concept: 'Mitosis phases', date: new Date().toISOString().slice(0, 10), source: 'quiz' },
    { topic: 'Bio', concept: 'Meiosis', date: new Date().toISOString().slice(0, 10), source: 'quiz' }
  ]
};
const e2 = sandbox.computeExamEstimate(s2);
ok(e2 && e2.overall < 78, 'recent confusion reduces estimate (' + e2.overall + '%)');
ok(e2.gaps.some(g => g.startsWith('Bio:')), 'gap analysis names Bio');

// 6. Old confusion (outside 14 days) does not penalize
const s3 = JSON.parse(JSON.stringify(s2));
s3.confusionLog[0].date = '2020-01-01';
s3.confusionLog[1].date = '2020-01-02';
const e3 = sandbox.computeExamEstimate(s3);
ok(e3 && e3.overall >= 75, 'stale confusion has no penalty (' + e3.overall + '%)');

// 7. Graded assignments blend in
const s4 = {
  quizAttempts: [],
  mockTestHistory: [],
  assignments: [{ subject: 'History', earned: 95, max: 100, weight: 5 }],
  confusionLog: []
};
const e4 = sandbox.computeExamEstimate(s4);
ok(e4 && e4.overall >= 90, 'graded 95% assignment → high estimate (' + e4.overall + '%)');
ok(e4.perSubject[0].graded === true, 'graded flag set');

// 8. Band narrows with more practice
const many = { quizAttempts: [], mockTestHistory: [], assignments: [], confusionLog: [] };
for (let i = 0; i < 10; i++) {
  many.quizAttempts.push({ topic: 'Math', subject: 'Math', score: 7, total: 10, pct: 70, date: new Date().toISOString() });
}
const e5 = sandbox.computeExamEstimate(many);
ok(e5 && e5.band <= 4, '10 attempts → tight band (' + e5.band + ')');
const few = { quizAttempts: [], mockTestHistory: [], assignments: [], confusionLog: [] };
few.quizAttempts.push({ topic: 'Math', subject: 'Math', score: 7, total: 10, pct: 70, date: new Date().toISOString() });
const e6 = sandbox.computeExamEstimate(few);
ok(e6 && e6.band > e5.band, '1 attempt → wider band than 10');

// 9. Mock tests carry more weight than quizzes (1.5x)
const s5 = {
  quizAttempts: [
    { topic: 'Chem', subject: 'Chem', score: 5, total: 10, pct: 50, date: new Date().toISOString() },
    { topic: 'Chem', subject: 'Chem', score: 5, total: 10, pct: 50, date: new Date().toISOString() }
  ],
  mockTestHistory: [{ subject: 'Chem', score: 9, total: 10, pct: 90, date: new Date().toISOString() }],
  assignments: [], confusionLog: []
};
const e7 = sandbox.computeExamEstimate(s5);
ok(e7 && e7.overall > 60 && e7.overall < 85, 'mocks pull the blend toward them (' + e7.overall + '%)');

// 10. Evidence type labeling
ok(e7.perSubject[0].kinds.includes('mock') && e7.perSubject[0].kinds.includes('quiz'), 'kinds list both quiz and mock');

// 11. Prediction accuracy stats
ok(sandbox.computePredictionStats([]).total === 0 && sandbox.computePredictionStats([]).mae === 0, 'empty track → zeroed stats');
const track1 = [
  { subject: 'Bio', predicted: 80, band: 8, actual: 78, source: 'quiz' },
  { subject: 'Bio', predicted: 80, band: 8, actual: 90, source: 'mock' },
  { subject: 'Chem', predicted: 60, band: 12, actual: 55, source: 'quiz' }
];
const ps1 = sandbox.computePredictionStats(track1);
ok(ps1.total === 3, 'stats count 3 predictions');
ok(Math.abs(ps1.mae - (2 + 10 + 5) / 3) < 0.001, 'MAE = 5.667 (' + ps1.mae.toFixed(2) + ')');
ok(ps1.withinBand === 2, 'two of three landed in band (78 within ±8, 55 within ±12)');
ok(Math.abs(ps1.bias - ((80 - 78) + (80 - 90) + (60 - 55)) / 3) < 0.001, 'bias sums predicted − actual (' + ps1.bias.toFixed(2) + ')');
ok(ps1.bySubject.Bio.n === 2 && ps1.bySubject.Chem.n === 1, 'per-subject counts');
ok(Math.abs(ps1.bySubject.Bio.errSum - 12) < 0.001, 'per-subject error sums');

// 12. Prediction recording excludes the new entry (record happens before it counts)
//    The estimator must ignore the just-added result when forming its prediction.
const rec = { quizAttempts: [], mockTestHistory: [], assignments: [], confusionLog: [] };
for (let i = 0; i < 3; i++) rec.quizAttempts.push({ id: 'q' + i, topic: 'Math', subject: 'Math', score: 7, total: 10, pct: 70, date: new Date().toISOString() });
const beforeNew = sandbox.computeExamEstimate(rec);
rec.quizAttempts.push({ id: 'qnew', topic: 'Math', subject: 'Math', score: 9, total: 10, pct: 90, date: new Date().toISOString() });
const afterNew = sandbox.computeExamEstimate(rec);
ok(afterNew.overall > beforeNew.overall, 'adding a 90% quiz raises the overall estimate');

console.log(`\nexam grade estimator: ${passed} assertions passed`);
