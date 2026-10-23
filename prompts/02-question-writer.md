# Prompt 2: Question writer (one per exam domain, run in parallel)

Used to generate the practice questions in `js/data/questions-d*.js`. Three copies ran in parallel (domain 1 + 3, and domain 2), each reading the shared brief in `01-content-brief.md`. Shown here for domain 2. The others only differ in the counts per topic.

---

You are writing ORIGINAL practice questions for Wingu900, an unofficial AZ-900 study web app (hackathon, deadline today: work efficiently, but accuracy is the top priority).

First read the shared brief (`01-content-brief.md`). It has the rules, topic IDs and accuracy notes. Follow it exactly.

## Your job
Write `js/data/questions-d2.js` for Domain d2, "Describe Azure architecture and services": 24 questions = d2-core 6, d2-compute 7, d2-storage 5, d2-identity 6. **Cover every bullet of each topic at least once.**

Mix of levels: about 40% level 1 (recall), 35% level 2 (compare/understand), 25% level 3 (short realistic scenarios; set several in African contexts, e.g. a Lagos fintech, a Kigali clinic, a Nairobi school, a Johannesburg retailer using South Africa North). **Make distractors plausible** (real Azure services/concepts that are commonly confused, e.g. VPN Gateway vs ExpressRoute, LRS vs ZRS vs GRS, Cool vs Archive, RBAC vs Azure Policy), never silly. **One correct answer only.** Make sure no distractor is also arguably correct.

## Exact format (plain browser script, no modules)
```js
window.WINGU = window.WINGU || {};
WINGU.questions = (WINGU.questions || []).concat([
  {
    id: "d2-q01", topic: "d2-core", level: 1,
    q: "Question text?",
    options: ["…", "…", "…", "…"],
    answer: 2,
    why: "Why the correct answer is right: 1–3 short, plain sentences that teach the concept.",
    wrong: ["Why this option is wrong (names what it actually is/does)", "…", null, "…"],
    tip: "One-sentence memory hook or exam tip; an African everyday analogy is great here."
  },
]);
```
- `wrong` has the same length as `options`, with `null` at the answer index. Vary the answer index (options are also shuffled at runtime).

## Before you finish
Run `node tools/validate-content.js` and fix every problem it reports. Then re-read each question once **purely for factual accuracy** against the brief's accuracy notes, and for "is any distractor also correct?".

Reply with only: the file path, the question count per topic, and **any fact you were unsure about and chose to leave out**.

---

### Why this prompt is built this way
| Technique | Where | Why |
|---|---|---|
| Shared brief + specific task | brief read first | One source of truth for rules and facts across parallel writers |
| Exact counts per topic | "24 questions = …" | Matches the exam's domain weights; easy to verify |
| Coverage requirement | "every bullet at least once" | Learning value: no gaps in the skills outline |
| Bloom-style level mix | 40/35/25 | Recall alone doesn't prepare you for scenario questions |
| Distractor guidance | "commonly confused" pairs | Wrong options teach the exam's real traps |
| Machine-checkable schema | JS format + validator | Catches broken data before a learner ever sees it |
| Self-review step | "re-read for accuracy" | A second pass catches errors the first draft misses |
| Honest uncertainty | "facts you left out" | Better a gap than a confident mistake. These reports were reviewed before release. |
