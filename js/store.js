// Readyfor900 store — all progress stays in this browser (localStorage). No accounts, no server.
(function (W) {
  "use strict";
  const KEY = "readyfor900:v1";

  const fresh = () => ({
    name: "",
    attempts: [], // { qid, topic, correct, sure, ts, mode }
    cards: {}, // conceptId -> { box, due, wrong, seen }
    mocks: [], // { ts, score, total }
    plan: null,
    planDone: {},
    settings: { examDate: "", hoursPerWeek: 5, days: [1, 3, 5, 6], level: "new", time: "19:00", weakDomains: [], language: "English", theme: "auto" },
    activity: [], // day keys with study activity, for streaks
  });

  let state = fresh();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved) state = { ...fresh(), ...saved, settings: { ...fresh().settings, ...(saved.settings || {}) } };
  } catch (e) {
    /* storage unavailable (private mode) — app still works for this visit */
  }

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  };

  const markActive = () => {
    const today = W.engine.todayKey();
    if (!state.activity.includes(today)) state.activity.push(today);
  };

  W.store = {
    get: () => state,
    save,
    update(fn) { fn(state); save(); },
    recordAttempt(a) {
      state.attempts.push({ ...a, ts: Date.now() });
      markActive();
      save();
    },
    reviewCard(id, knewIt) {
      state.cards[id] = W.engine.reviewCard(state.cards[id], knewIt);
      markActive();
      save();
    },
    // A wrong quiz answer sends the related flashcards to the front of the queue.
    flagCards(ids) {
      ids.forEach((id) => {
        const c = state.cards[id] || { box: 0, due: Date.now(), wrong: 0, seen: 0 };
        state.cards[id] = { ...c, box: 1, due: Date.now(), wrong: c.wrong + 1 };
      });
      save();
    },
    streak() {
      const E = W.engine;
      let n = 0;
      const d = new Date();
      // Today counts if active; otherwise the streak can still be alive from yesterday.
      if (!state.activity.includes(E.todayKey(d))) d.setDate(d.getDate() - 1);
      while (state.activity.includes(E.todayKey(d))) { n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    reset() { state = fresh(); save(); },
    // Demo data so judges / new visitors can see the dashboard come alive instantly.
    loadSample() {
      const E = W.engine;
      const skill = { "d1-computing": 0.85, "d1-benefits": 0.9, "d1-types": 0.8, "d2-core": 0.7, "d2-compute": 0.55, "d2-storage": 0.35, "d2-identity": 0.6, "d3-cost": 0.75, "d3-governance": 0.45, "d3-tools": 0.65, "d3-monitoring": 0.5 };
      const now = Date.now();
      const attempts = [];
      E.shuffle(W.questions).slice(0, 48).forEach((q, i) => {
        const correct = Math.random() < skill[q.topic];
        attempts.push({ qid: q.id, topic: q.topic, correct, sure: correct ? Math.random() < 0.8 : Math.random() < 0.4, ts: now - (48 - i) * 3600e3, mode: "sample" });
      });
      const cards = {};
      W.concepts.slice(0, 40).forEach((c, i) => {
        const box = 1 + (i % 5);
        cards[c.id] = { box, due: now + (i % 3 === 0 ? -1 : 1) * 86400e3, wrong: box <= 2 ? 1 + (i % 2) : 0, seen: box + 1 };
      });
      const activity = [];
      for (let k = 0; k < 5; k++) { const d = new Date(); d.setDate(d.getDate() - k); activity.push(E.todayKey(d)); }
      state = { ...state, attempts, cards, activity, name: state.name || "Amani" };
      save();
    },
  };
})(window.READY);
