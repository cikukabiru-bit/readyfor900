// Quick checks for the pure logic in js/engine.js. Usage: node tools/test-engine.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["data/topics.js", "data/questions-d1.js", "data/questions-d2.js", "data/questions-d3.js", "data/concepts.js", "engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", f), "utf8"), ctx, { filename: f });
}
const W = ctx.READY;
const E = W.engine;
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("✓ " + name); };

test("readiness is 0 and 'just getting started' with no attempts", () => {
  const r = E.readiness([]);
  assert.strictEqual(r.overall, 0);
  assert.strictEqual(r.status.key, "start");
});

test("answering every question correctly and confidently gives 100% readiness", () => {
  const attempts = W.questions.map((q) => ({ qid: q.id, topic: q.topic, correct: true, sure: true }));
  const r = E.readiness(attempts);
  assert.ok(Math.abs(r.overall - 1) < 1e-9);
  assert.strictEqual(r.status.key, "ready");
});

test("lucky guesses count half", () => {
  const q = W.questions[0];
  const s = E.topicStats([{ qid: q.id, topic: q.topic, correct: true, sure: false }], q.topic);
  assert.strictEqual(s.accuracy, 0.5);
});

test("prepareQuestion keeps each explanation attached to its option", () => {
  for (const q of W.questions) {
    const p = E.prepareQuestion(q);
    assert.strictEqual(p.options[p.answer], q.options[q.answer]);
    assert.strictEqual(p.wrong[p.answer], null);
    p.options.forEach((o, i) => assert.strictEqual(p.wrong[i], q.wrong[q.options.indexOf(o)]));
  }
});

test("mock exam has 20 unique questions from all three domains", () => {
  const m = E.mockExam(20);
  assert.strictEqual(m.length, 20);
  assert.strictEqual(new Set(m.map((q) => q.id)).size, 20);
  ["d1", "d2", "d3"].forEach((d) => assert.ok(m.some((q) => q.topic.startsWith(d))));
});

test("every question links to at least one concept", () => {
  for (const q of W.questions) assert.ok(E.conceptsForQuestion(q).length >= 1, q.id);
});

test("Leitner: knowing a card moves it up a box; missing it resets to box 1", () => {
  let c = E.reviewCard(undefined, true, 0);
  assert.strictEqual(c.box, 1);
  c = E.reviewCard(c, true, 0);
  assert.strictEqual(c.box, 2);
  assert.strictEqual(c.due, 86400000);
  c = E.reviewCard(c, false, 0);
  assert.strictEqual(c.box, 1);
  assert.strictEqual(c.wrong, 1);
});

test("planner builds dated sessions ending with a mock exam and review", () => {
  const d = new Date(Date.now() + 30 * 86400000);
  const plan = E.buildPlan({ examDate: E.todayKey(d), hoursPerWeek: 5, days: [0, 1, 2, 3, 4, 5, 6], level: "new" });
  assert.ok(!plan.error);
  assert.strictEqual(plan.sessions.length, 30);
  assert.strictEqual(plan.sessions[plan.sessions.length - 1].kind, "review");
  assert.strictEqual(plan.sessions[plan.sessions.length - 2].kind, "mock");
  const learned = new Set(plan.sessions.filter((s) => s.kind === "learn").flatMap((s) => s.topics));
  assert.strictEqual(learned.size, W.topics.length, "every topic gets a learn session");
});

test("planner groups topics when there are few sessions", () => {
  const d = new Date(Date.now() + 5 * 86400000);
  const plan = E.buildPlan({ examDate: E.todayKey(d), hoursPerWeek: 3, days: [0, 1, 2, 3, 4, 5, 6], level: "some" });
  const learned = new Set(plan.sessions.filter((s) => s.kind === "learn").flatMap((s) => s.topics));
  assert.strictEqual(learned.size, W.topics.length);
});

test("planner rejects past dates", () => {
  assert.ok(E.buildPlan({ examDate: "2020-01-01", hoursPerWeek: 5, days: [1], level: "new" }).error);
});

test("calendar export is valid-looking iCalendar", () => {
  const d = new Date(Date.now() + 10 * 86400000);
  const plan = E.buildPlan({ examDate: E.todayKey(d), hoursPerWeek: 4, days: [1, 3, 5], level: "new" });
  const ics = E.planToICS(plan, "19:30");
  assert.ok(ics.startsWith("BEGIN:VCALENDAR"));
  assert.strictEqual((ics.match(/BEGIN:VEVENT/g) || []).length, plan.sessions.length);
  assert.ok(/DTSTART:\d{8}T193000/.test(ics));
});

test("prompt builder returns the five prompt sections with learner context", () => {
  const c = W.concepts[0];
  const s = E.buildPrompt({ goal: "explain", concept: c, language: "Kiswahili", attempts: [] });
  assert.strictEqual(s.map((x) => x.label).join("|"), "Role|Context|Task|Constraints|Output format");
  assert.ok(s[1].text.includes(c.term));
  assert.ok(s[3].text.includes("Respond in Kiswahili"));
  const q = W.questions[0];
  const m = E.buildPrompt({ goal: "mistake", question: q, chosen: (q.answer + 1) % q.options.length, attempts: [] });
  assert.ok(m[1].text.includes(q.q));
});

console.log(`\nAll ${passed} tests passed.`);
