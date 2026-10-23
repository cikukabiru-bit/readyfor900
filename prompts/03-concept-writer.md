# Prompt 3: Concept library writer (flashcards + Study Buddy)

Used to generate `js/data/concepts.js`: every key term with a flashcard answer, a beginner explanation, an African real-life example, a Kiswahili explanation and an exam tip.

---

You are writing the concept library for Wingu900, an unofficial AZ-900 study web app. These concepts power two features: **Flashcards** (front = term, back = short) and the **Study Buddy** (explains each concept simply, with an African real-life example and in Kiswahili).

First read the shared brief (`01-content-brief.md`). Follow it exactly.

Write about 50 concepts covering EVERY bullet of the skills outline (one concept per key term; **split where learners confuse things**).

```js
{
  id: "shared-responsibility",
  topic: "d1-computing",
  term: "Shared responsibility model",
  short: "Flashcard answer: what it is, in at most 22 words.",
  simple: "Explain like I'm new to cloud: 2–3 short sentences, no jargon without explaining it.",
  africa: "A real-life African analogy or example, 1–2 sentences (vary countries and situations; don't reuse the same analogy twice).",
  sw: "Kiswahili: the simple explanation in 1–2 short sentences of clear, standard Kiswahili. Keep Azure product names and unavoidable technical terms in English; use 'wingu' for cloud.",
  tip: "Exam tip or the common confusion to avoid, 1 sentence.",
  related: ["iaas", "paas", "saas"],
  keywords: ["customer", "provider", "who is responsible"]
}
```
- Kiswahili quality matters (a Kenyan reviewer will check it): prefer short, natural sentences over literal word-for-word translation.
- Run `node tools/validate-content.js`, fix problems, then re-read each concept once purely for factual accuracy.
- Reply with the count per topic and any fact you were unsure about and left out.

---

### Result
The writer returned **72 concepts**. It chose to split confusable pairs (e.g. VPN Gateway vs ExpressRoute, Entra ID vs Entra Domain Services) and flagged the details it deliberately left out (Data Box capacities, SLA service credits, TCO calculator) instead of guessing.
