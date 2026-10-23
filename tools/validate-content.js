// Validates Readyfor900 content files. Usage: node tools/validate-content.js
// Loads every js/data/*.js file the same way the browser does and checks the schema.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataDir = path.join(__dirname, "..", "js", "data");
const ctx = {};
ctx.window = ctx; // in the browser, window is the global object
vm.createContext(ctx);

const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".js")).sort();
for (const f of files) {
  const code = fs.readFileSync(path.join(dataDir, f), "utf8");
  try {
    vm.runInContext(code, ctx, { filename: f });
  } catch (e) {
    console.error(`✗ ${f}: failed to load — ${e.message}`);
    process.exitCode = 1;
  }
}

const W = ctx.READY || {};
const TOPICS = ["d1-computing", "d1-benefits", "d1-types", "d2-core", "d2-compute", "d2-storage", "d2-identity", "d3-cost", "d3-governance", "d3-tools", "d3-monitoring"];
const banned = /\b(all of the above|none of the above|both a and b|option [a-d])\b/i;
let errors = 0;
const err = (m) => { console.error("✗ " + m); errors++; };

// Questions
const qs = W.questions || [];
const ids = new Set();
const perTopic = {};
const answerPos = {};
qs.forEach((q, i) => {
  const where = q.id || `question #${i}`;
  if (!q.id) err(`${where}: missing id`);
  if (ids.has(q.id)) err(`${where}: duplicate id`);
  ids.add(q.id);
  if (!TOPICS.includes(q.topic)) err(`${where}: unknown topic "${q.topic}"`);
  if (![1, 2, 3].includes(q.level)) err(`${where}: level must be 1, 2 or 3`);
  if (typeof q.q !== "string" || q.q.length < 10) err(`${where}: question text too short`);
  if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 4) err(`${where}: needs 3-4 options`);
  else {
    if (new Set(q.options).size !== q.options.length) err(`${where}: duplicate options`);
    if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) err(`${where}: bad answer index`);
    if (!Array.isArray(q.wrong) || q.wrong.length !== q.options.length) err(`${where}: wrong[] must match options length`);
    else q.wrong.forEach((w, j) => {
      if (j === q.answer && w !== null) err(`${where}: wrong[${j}] must be null (it is the answer)`);
      if (j !== q.answer && (typeof w !== "string" || w.length < 8)) err(`${where}: wrong[${j}] needs an explanation`);
    });
    q.options.forEach((o) => { if (banned.test(o)) err(`${where}: banned option phrasing "${o}"`); });
    answerPos[q.answer] = (answerPos[q.answer] || 0) + 1;
  }
  if (typeof q.why !== "string" || q.why.length < 20) err(`${where}: why too short`);
  if (typeof q.tip !== "string" || q.tip.length < 10) err(`${where}: tip missing`);
  perTopic[q.topic] = (perTopic[q.topic] || 0) + 1;
});

// Concepts
const cs = W.concepts || [];
const cids = new Set(cs.map((c) => c.id));
const seen = new Set();
cs.forEach((c, i) => {
  const where = c.id || `concept #${i}`;
  if (seen.has(c.id)) err(`${where}: duplicate id`);
  seen.add(c.id);
  if (!TOPICS.includes(c.topic)) err(`${where}: unknown topic "${c.topic}"`);
  ["term", "short", "simple", "africa", "sw", "tip"].forEach((k) => {
    if (typeof c[k] !== "string" || c[k].length < 3) err(`${where}: missing ${k}`);
  });
  if (c.short && c.short.split(/\s+/).length > 26) err(`${where}: short is too long (${c.short.split(/\s+/).length} words)`);
  (c.related || []).forEach((r) => { if (!cids.has(r)) err(`${where}: related id "${r}" not found`); });
});

console.log(`Questions: ${qs.length}`, perTopic);
console.log("Correct-answer positions:", answerPos);
console.log(`Concepts: ${cs.length}`, cs.reduce((a, c) => ((a[c.topic] = (a[c.topic] || 0) + 1), a), {}));
if (errors) { console.error(`\n${errors} problem(s) found.`); process.exitCode = 1; }
else console.log("\n✓ All content valid.");
