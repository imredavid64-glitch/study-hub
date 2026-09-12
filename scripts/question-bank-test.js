#!/usr/bin/env node
/**
 * Unit test for the question databank module (question-bank.js). The module is
 * a window-scoped IIFE with no hard DOM dependencies, so it is loaded in a VM
 * sandbox with a minimal `window` and a stubbed `fetch`. Runs inside `npm test`
 * in CI and validates the curated banks plus every custom-bank helper.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'question-bank.js'), 'utf8');

const sandbox = {
  Math,
  Date,
  JSON,
  String,
  Number,
  Array,
  Object,
  RegExp,
  // fetch is only used by fetchTrivia; stub it so the module evaluates cleanly.
  fetch: function () { return Promise.resolve({ ok: false }); }
};
sandbox.window = sandbox; // module assigns window.QuestionBank = ...
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const QB = sandbox.QuestionBank;
let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
  console.log('  ✓ ' + msg);
}

console.log('question bank unit test');

// 1. Module surface
ok(QB && typeof QB === 'object', 'QuestionBank exposed on window');
['banks', 'totalCount', 'getBank', 'getBankQuestions', 'search', 'fetchTrivia',
 'setCustomBanks', 'parseCSV', 'bankFromCSV', 'bankToJSON', 'bankToCSV',
 'parseBankJSON', 'normalizeBank', 'uid'].forEach(function (k) {
  ok(k in QB, 'exposes ' + k);
});

// 2. Curated banks baseline
const baseCount = QB.totalCount();
const baseBanks = QB.banks.length;
ok(baseCount > 400, 'curated databank has > 400 questions (' + baseCount + ')');
ok(baseBanks >= 20, 'curated databank has >= 20 banks (' + baseBanks + ')');
ok(QB.getBank('sat-math') !== null, 'getBank("sat-math") found');
ok(QB.getBank('nope-1234') === null, 'getBank("nope-1234") returns null');
ok(QB.getBankQuestions('sat-math', 5, null).length === 5, 'getBankQuestions returns requested count');
ok(QB.getBankQuestions('nope-1234', 5, null).length === 0, 'getBankQuestions empty for unknown bank');
ok(QB.getBankQuestions('sat-math', 5, null).every(function (q) { return q && q.question && Array.isArray(q.options); }), 'bank questions in quiz-engine format');

// 3. CSV parser
const csvRows = QB.parseCSV('a,b,c\r\n"x,y","he said ""hi""",z\n\n1,2,3');
ok(csvRows.length === 3, 'parseCSV splits 3 rows (handles \\r\\n + blank lines)');
ok(csvRows[1][0] === 'x,y', 'parseCSV unquotes commas inside quotes');
ok(csvRows[1][1] === 'he said "hi"', 'parseCSV unescapes doubled quotes');

// 4. CSV → bank
const bankFromCsv = QB.bankFromCSV('MyBio', 'question,optionA,optionB,optionC,optionD,answer\nWhich is DNA?,A,T,G,C,G\nTrue or false: water is wet?,True,False,,,True');
ok(bankFromCsv && bankFromCsv.questions.length === 2, 'bankFromCSV uses header row');
ok(bankFromCsv.questions[1].a === 'True', 'bankFromCSV maps answer column');
ok(bankFromCsv.questions[0].o.length === 4, 'bankFromCSV keeps all four options');
ok(bankFromCsv.custom === true, 'bankFromCSV marks bank as custom');

// headerless CSV
const bankNoHeader = QB.bankFromCSV('Plain', '1+1=?,2,3,4,5,2\n2+2=?,3,4,5,6,4');
ok(bankNoHeader && bankNoHeader.questions.length === 2, 'bankFromCSV handles headerless CSV');
ok(bankNoHeader.questions[0].a === '2', 'headerless first row answer is col 6');

// 5. Bank → CSV round-trip
const csvText = QB.bankToCSV(bankFromCsv);
const roundTrip = QB.bankFromCSV('RoundTrip', csvText);
ok(roundTrip && roundTrip.questions.length === 2, 'bankToCSV → bankFromCSV round-trips row count');
ok(roundTrip.questions[0].a === 'G', 'round-trip preserves answer');
ok(roundTrip.questions[0].o.join('|') === 'A|T|G|C', 'round-trip preserves options');

// 6. JSON import / export round-trip
const jsonText = QB.bankToJSON(bankFromCsv);
const fromJson = QB.parseBankJSON(jsonText);
ok(fromJson.length === 1 && fromJson[0].questions.length === 2, 'bankToJSON → parseBankJSON round-trips');
ok(fromJson[0].name === 'MyBio', 'round-trip preserves bank name');
// multi-bank array form
const multiJson = JSON.stringify([bankFromCsv, bankNoHeader]);
ok(QB.parseBankJSON(multiJson).length === 2, 'parseBankJSON handles an array of banks');

// 7. setCustomBanks registers/replaces and integrates with helpers
const cA = QB.normalizeBank({ id: 'c-1', name: 'Calc 1', questions: [{ q: 'Integrate x?', o: ['x2/2', 'x', '1'], a: 'x2/2' }, { q: 'Derivative of sin?', o: ['cos', '-cos', 'sin'], a: 'cos' }] });
const cB = QB.normalizeBank({ id: 'c-2', name: 'Lit Terms', questions: [{ q: 'Metaphor is…', o: ['Comparison', 'Rhyme', 'Rhythm'], a: 'Comparison' }] });
const registered = QB.setCustomBanks([cA, cB]);
ok(registered.length === 2, 'setCustomBanks registers two banks');
ok(QB.totalCount() === baseCount + 3, 'totalCount includes custom banks');
ok(QB.getBank('c-1') !== null, 'getBank finds custom bank');
ok(QB.getBankQuestions('c-1', 2, null).length === 2, 'getBankQuestions works on custom bank');
ok(QB.search('metaphor').some(function (r) { return r.bankName === 'Lit Terms'; }), 'search includes custom banks');

// replace is idempotent (removes old custom banks first)
const again = QB.setCustomBanks([QB.normalizeBank({ id: 'c-2', name: 'Lit Terms', questions: cB.questions })]);
ok(again.length === 1, 'setCustomBanks replaces previous customs (no duplicates)');
ok(QB.getBank('c-1') === null, 'removed custom bank is gone');
ok(QB.totalCount() === baseCount + 1, 'totalCount tracks replacement');
// clear all
ok(QB.setCustomBanks([]).length === 0, 'setCustomBanks([]) clears customs');
ok(QB.totalCount() === baseCount, 'totalCount back to curated baseline');

// 8. Validation rules
ok(QB.normalizeBank({ name: 'Bad', questions: [] }) === null, 'empty question list rejected');
ok(QB.normalizeBank({ questions: [{ q: 'x', o: ['a', 'b'], a: 'a' }] }) === null, 'missing name rejected');
ok(QB.normalizeBank({ name: 'Ok', questions: [{ q: 'x', o: ['a', 'b'], a: 'b' }] }).questions.length === 1, 'valid bank accepted');
ok(QB.normalizeBank({ name: 'Strict', questions: [{ q: 'x', o: ['a', 'b'], a: 'zzz' }] }) === null, 'answer outside options rejected');
ok(QB.normalizeBank({ name: 'Loose', questions: [{ q: 'x', o: ['A', 'B'], a: 'a' }] }).questions[0].a === 'A', 'answer normalized to exact option casing');
const freeform = QB.normalizeBank({ name: 'Free', questions: [{ q: 'What is 2+2?', a: '4' }] });
ok(freeform && freeform.questions[0].o === null, 'options omitted for freeform questions');

// 9. uid is unique
const u1 = QB.uid(), u2 = QB.uid();
ok(u1 !== u2 && u1.indexOf('custom-') === 0, 'uid() returns unique custom-prefixed ids');

console.log('\nquestion-bank-test: ' + passed + ' assertions passed');