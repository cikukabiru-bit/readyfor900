// Readyfor900 app — views, routing and interaction. Vanilla JS, no build step.
(function (W) {
  "use strict";
  const E = W.engine;
  const S = W.store;

  // ---------- Small helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (x) => Math.round((x || 0) * 100);
  const LETTERS = "ABCD";
  const LEVELS = { 1: "Recall", 2: "Understand", 3: "Scenario" };
  const view = $("#view");
  let actions = {}; // per-view click handlers, keyed by data-action
  let cleanup = []; // timers etc. to clear when leaving a view

  const ICON = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    quiz: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    cards: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    buddy: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    plan: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    speak: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    ai: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    flip: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  };
  const icon = (name, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;

  const topicChip = (topicId) => {
    const t = E.topic(topicId);
    return `<span class="chip chip-${t.domain}">${esc(t.name)}</span>`;
  };

  const toast = (msg) => {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (_) { /* ignore */ }
      ta.remove();
    }
    toast("Prompt copied. Paste it into any AI assistant.");
  };

  const speak = (text, lang = "en") => {
    if (!("speechSynthesis" in window)) return toast("Read-aloud isn't supported in this browser.");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "sw" ? "sw-KE" : "en-GB";
    const voice = speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith(lang));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    speechSynthesis.speak(u);
  };

  // ---------- Router ----------
  const parseHash = () => {
    const h = location.hash.replace(/^#\/?/, "") || "home";
    const [path, qs] = h.split("?");
    return { path, params: new URLSearchParams(qs || "") };
  };

  const render = () => {
    cleanup.forEach((fn) => fn());
    cleanup = [];
    actions = {};
    const { path, params } = parseHash();
    const fn = routes[path] || routes.home;
    $$(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === path || (!routes[path] && a.dataset.route === "home")));
    fn(params);
    window.scrollTo(0, 0);
  };

  view.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (el && actions[el.dataset.action]) {
      e.preventDefault();
      actions[el.dataset.action](el, e);
    }
  });

  // ============================================================
  // HOME — readiness dashboard
  // ============================================================
  const ring = (value, label) => {
    const r = 52, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${esc(label)}">
      <circle cx="60" cy="60" r="${r}" class="ring-bg"/>
      <circle cx="60" cy="60" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - value)}"/>
      <text x="60" y="58" class="ring-num">${pct(value)}%</text>
      <text x="60" y="78" class="ring-sub">readiness</text>
    </svg>`;
  };

  const masteryClass = (m) => (m === null || m === undefined ? "m-none" : m >= 0.8 ? "m-high" : m >= 0.6 ? "m-mid" : m >= 0.4 ? "m-low" : "m-weak");

  function home() {
    const st = S.get();
    const r = E.readiness(st.attempts);
    const cal = E.calibration(st.attempts);
    const boxes = E.boxCounts(st.cards);
    const due = E.flashcardDeck(st.cards, { mode: "due", newLimit: 0 }).length;
    const days = E.daysUntil(st.settings.examDate);
    const streak = S.streak();
    const correct = st.attempts.filter((a) => a.correct).length;
    const hasData = st.attempts.length > 0;

    // Next best actions
    const next = [];
    if (st.attempts.length < 10) {
      next.push({ t: "Take a 10-question smart mix", d: "Instant feedback on every option, so you learn while you test.", href: "#/quiz?mode=smart" });
      next.push({ t: "Learn the basics in Study Buddy", d: "Simple explanations, African examples and Kiswahili.", href: "#/buddy" });
    } else {
      const weak = r.weakest[0];
      next.push({ t: `Drill your weakest topic: ${weak.name}`, d: weak.mastery === null ? "You haven't practised it yet." : `Currently ${pct(weak.mastery)}% mastery.`, href: `#/quiz?topic=${weak.id}` });
      if (due > 0) next.push({ t: `Review ${due} due flashcard${due === 1 ? "" : "s"}`, d: "Spaced repetition: a few minutes now saves hours later.", href: "#/flashcards" });
      if (r.overall >= 0.7) next.push({ t: "Take a timed mock exam", d: "20 questions spread across the domains by exam weight.", href: "#/quiz?mode=mock" });
      else next.push({ t: "Smart mix: weak areas first", d: "Brings back questions you missed or guessed.", href: "#/quiz?mode=smart" });
    }
    if (!st.plan) next.push({ t: "Make a study plan for your exam date", d: "Sessions weighted by exam weight and your weak areas.", href: "#/planner" });

    view.innerHTML = `
      <section class="hero">
        <div>
          <p class="eyebrow">Unofficial AZ-900 study companion</p>
          <h1>${st.name ? `Karibu tena, ${esc(st.name)}!` : "Karibu! Let's get you exam-ready."}</h1>
          <p class="lead">Practise with original questions, remember with spaced flashcards, understand with African examples, and see exactly how ready you are.</p>
        </div>
        <div class="hero-side">
          ${days !== null && days >= 0
            ? `<div class="countdown"><span class="big">${days}</span><span>day${days === 1 ? "" : "s"} to your exam</span></div>`
            : `<a class="countdown link" href="#/planner"><span class="big">${icon("plan")}</span><span>Set your exam date</span></a>`}
          <div class="countdown"><span class="big">${streak}</span><span>${icon("flame", "sm")} day streak</span></div>
        </div>
      </section>

      <div class="grid dash">
        <article class="card readiness">
          <h2>Exam readiness</h2>
          <div class="readiness-body">
            ${ring(r.overall, `Readiness ${pct(r.overall)} percent`)}
            <div>
              <p class="status status-${r.status.key}">${esc(r.status.label)}</p>
              <p class="muted">${esc(r.status.hint)}</p>
              <button class="btn ghost sm" data-action="coach">${icon("ai", "sm")} Get an AI coaching prompt</button>
            </div>
          </div>
          <div class="domains">
            ${r.domains.map((d) => `
              <div class="domain-row">
                <div class="domain-label"><span class="dot dot-${d.id}"></span>${esc(d.name)} <span class="muted small">${E.domain(d.id).weight.join("–")}%</span></div>
                <div class="bar"><span class="fill fill-${d.id}" style="width:${pct(d.score)}%"></span></div>
                <span class="domain-pct">${pct(d.score)}%</span>
              </div>`).join("")}
          </div>
          <details class="how"><summary>How is this calculated?</summary>
            <p>For each topic: your accuracy on your last 10 answers (a lucky guess counts as half), scaled by how much of the topic you've practised. Domains are averaged and weighted like the real exam outline. "Exam ready" means 80%+ overall <em>and</em> every domain at 70%+. It's a study guide, not a score prediction.</p>
          </details>
        </article>

        <article class="card">
          <h2>Do this next</h2>
          <ol class="next">
            ${next.slice(0, 3).map((n) => `<li><a href="${n.href}"><strong>${esc(n.t)}</strong><span>${esc(n.d)}</span>${icon("arrow", "sm")}</a></li>`).join("")}
          </ol>
        </article>

        <article class="card span-2">
          <div class="card-head"><h2>Topic map</h2><span class="muted small">Tap a topic to practise it</span></div>
          <div class="heatmap">
            ${W.domains.map((d) => `
              <div class="heat-col">
                <h3><span class="dot dot-${d.id}"></span>${esc(d.name)}</h3>
                ${E.topicsIn(d.id).map((t) => {
                  const m = r.topics[t.id].mastery;
                  return `<a class="heat ${masteryClass(m)}" href="#/quiz?topic=${t.id}" title="${esc(t.covers)}">
                    <span>${esc(t.name)}</span><strong>${m === null ? "—" : pct(m) + "%"}</strong></a>`;
                }).join("")}
              </div>`).join("")}
          </div>
          <div class="legend"><span class="heat-key m-weak"></span>&lt;40% <span class="heat-key m-low"></span>40–59 <span class="heat-key m-mid"></span>60–79 <span class="heat-key m-high"></span>80%+ <span class="heat-key m-none"></span>not yet</div>
        </article>

        <article class="card">
          <h2>Confidence check</h2>
          <p class="muted small">Before each answer you tell us if you're sure. This shows whether your confidence matches your knowledge.</p>
          <div class="calib">
            <div class="c good"><strong>${cal.sureRight}</strong><span>Sure &amp; right</span><em>Solid knowledge</em></div>
            <div class="c warn"><strong>${cal.guessRight}</strong><span>Guessed &amp; right</span><em>Lucky: we'll bring these back</em></div>
            <div class="c bad"><strong>${cal.sureWrong}</strong><span>Sure &amp; wrong</span><em>Misconceptions: top priority</em></div>
            <div class="c info"><strong>${cal.guessWrong}</strong><span>Guessed &amp; wrong</span><em>Knowledge gaps: learn these</em></div>
          </div>
        </article>

        <article class="card">
          <h2>Your numbers</h2>
          <div class="stats">
            <div><strong>${st.attempts.length}</strong><span>questions answered</span></div>
            <div><strong>${hasData ? pct(correct / st.attempts.length) + "%" : "—"}</strong><span>overall accuracy</span></div>
            <div><strong>${boxes[4] + boxes[5]}<small>/${W.concepts.length}</small></strong><span>flashcards mastered</span></div>
            <div><strong>${st.mocks.length ? pct(st.mocks[st.mocks.length - 1].score / st.mocks[st.mocks.length - 1].total) + "%" : "—"}</strong><span>last mock exam</span></div>
          </div>
          ${!hasData ? `<p class="muted small">New here? <a href="#" data-action="sample">Load sample progress</a> to see the dashboard in action (you can reset it in About).</p>` : ""}
        </article>
      </div>`;

    actions.coach = () => openPrompt({ goal: "coach" });
    actions.sample = () => { S.loadSample(); toast("Sample progress loaded."); render(); };
  }

  // ============================================================
  // QUIZ — instant feedback, confidence, explanations for every option
  // ============================================================
  let quiz = null;

  const startQuiz = (mode, topicId) => {
    const st = S.get();
    let items, title;
    if (mode === "mock") { items = E.mockExam(20); title = "Mock exam"; }
    else if (mode === "smart") { items = E.smartMix(st.attempts, 10); title = "Smart mix · weak areas first"; }
    else {
      const t = E.topic(topicId);
      items = E.shuffle(E.questionsIn(topicId)).slice(0, 10);
      title = `Topic: ${t.name}`;
    }
    quiz = {
      mode, title, topicId,
      items: items.map(E.prepareQuestion),
      i: 0, answers: [], selected: null, revealed: false,
      startedAt: Date.now(), timeLimit: mode === "mock" ? 25 * 60 : 0, done: false,
    };
  };

  function quizView(params) {
    const mode = params.get("mode");
    const topic = params.get("topic");
    if (mode === "smart" || mode === "mock" || (topic && E.topic(topic))) {
      startQuiz(mode || "topic", topic);
      history.replaceState(null, "", "#/quiz");
    }
    if (!quiz || quiz.done) return quizSetup();
    quizQuestion();
  }

  function quizSetup() {
    const st = S.get();
    const r = E.readiness(st.attempts);
    view.innerHTML = `
      <header class="page-head">
        <h1>Smart Quiz</h1>
        <p class="lead">${W.questions.length} original questions mapped to the AZ-900 skills outline. Every option comes with an explanation of why it's right or wrong.</p>
      </header>
      <div class="grid modes">
        <button class="card mode" data-action="start" data-mode="smart">
          <span class="badge">Recommended</span>
          <h2>${icon("target")} Smart mix</h2>
          <p>10 questions picked from your weak topics, mistakes and lucky guesses.</p>
        </button>
        <button class="card mode" data-action="start" data-mode="mock">
          <h2>${icon("clock")} Mock exam</h2>
          <p>20 questions weighted by exam domain, 25-minute timer, feedback at the end.</p>
        </button>
      </div>
      <h2 class="section-title">Practise by topic</h2>
      <div class="topic-list">
        ${W.domains.map((d) => `
          <section>
            <h3><span class="dot dot-${d.id}"></span>${esc(d.full)} <span class="muted">(${d.weight[0]}–${d.weight[1]}%)</span></h3>
            ${E.topicsIn(d.id).map((t) => {
              const m = r.topics[t.id].mastery;
              return `<button class="topic-btn" data-action="start" data-mode="topic" data-topic="${t.id}">
                <span><strong>${esc(t.name)}</strong><small>${esc(t.covers)}</small></span>
                <span class="topic-meta"><span class="pill ${masteryClass(m)}">${m === null ? "new" : pct(m) + "%"}</span><small>${E.questionsIn(t.id).length} Qs</small></span>
              </button>`;
            }).join("")}
          </section>`).join("")}
      </div>
      <p class="muted small center">Keyboard: <kbd>1</kbd>–<kbd>4</kbd> choose · <kbd>Enter</kbd> check (sure) · <kbd>G</kbd> check (guessing) · <kbd>N</kbd> next</p>`;
    actions.start = (el) => { startQuiz(el.dataset.mode, el.dataset.topic); quizQuestion(); window.scrollTo(0, 0); };
  }

  function quizQuestion() {
    const q = quiz.items[quiz.i];
    const isMock = quiz.mode === "mock";
    const ans = quiz.answers[quiz.i];
    const progress = ((quiz.i + (quiz.revealed ? 1 : 0)) / quiz.items.length) * 100;

    const optionClass = (i) => {
      if (!quiz.revealed || isMock) return quiz.selected === i ? "selected" : "";
      if (i === q.answer) return "correct";
      if (i === ans.chosen) return "wrong";
      return "dim";
    };

    let feedback = "";
    if (quiz.revealed && !isMock) {
      const ok = ans.correct;
      const badge = ok && !ans.sure ? `<span class="tag warn">Lucky guess: we'll bring this back</span>`
        : !ok && ans.sure ? `<span class="tag bad">Confident mistake: a misconception worth fixing</span>` : "";
      const concepts = E.conceptsForQuestion(quiz.items[quiz.i]);
      feedback = `
        <div class="feedback ${ok ? "good" : "bad"}" role="status">
          <div class="fb-head">${icon(ok ? "check" : "x")}<h2>${ok ? "Correct!" : "Not quite."}</h2>${badge}</div>
          <p>${ok ? "" : `The answer is <strong>${esc(q.options[q.answer])}</strong>. `}${esc(q.why)}</p>
          <h3>Why the other options are wrong</h3>
          <ul class="why-wrong">
            ${q.options.map((o, i) => (i === q.answer ? "" : `<li class="${i === ans.chosen ? "was-chosen" : ""}"><strong>${esc(o)}</strong>${i === ans.chosen ? ' <span class="tag bad sm">your answer</span>' : ""}<span>${esc(q.wrong[i])}</span></li>`)).join("")}
          </ul>
          <div class="tipbox">${icon("bulb")}<p>${esc(q.tip)}</p></div>
          <div class="fb-foot">
            <div class="related">Learn more: ${concepts.map((c) => `<a class="chip" href="#/buddy?c=${c.id}">${esc(c.term)}</a>`).join(" ")}</div>
            <button class="btn ghost sm" data-action="ai">${icon("ai", "sm")} ${ok ? "Ask AI to explain differently" : "Explain my mistake with AI"}</button>
          </div>
        </div>`;
    }

    const remaining = quiz.timeLimit ? Math.max(0, quiz.timeLimit - Math.floor((Date.now() - quiz.startedAt) / 1000)) : 0;
    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    view.innerHTML = `
      <div class="quiz">
        <div class="quiz-top">
          <div><p class="eyebrow">${esc(quiz.title)}</p><p class="muted small">Question ${quiz.i + 1} of ${quiz.items.length}</p></div>
          ${quiz.timeLimit ? `<div class="timer" id="timer">${icon("clock", "sm")} <span>${fmt(remaining)}</span></div>` : ""}
          <button class="btn ghost sm" data-action="quit">End quiz</button>
        </div>
        <div class="progress"><span style="width:${progress}%"></span></div>
        <article class="card qcard">
          <div class="q-meta">${topicChip(q.topic)}<span class="chip plain">${LEVELS[q.level]}</span></div>
          <h1 class="q-text">${esc(q.q)}</h1>
          <div class="options" role="group" aria-label="Answer options">
            ${q.options.map((o, i) => `<button class="option ${optionClass(i)}" data-action="pick" data-i="${i}" ${quiz.revealed ? "disabled" : ""}>
              <span class="letter">${LETTERS[i]}</span><span>${esc(o)}</span></button>`).join("")}
          </div>
          ${!quiz.revealed ? `
            <div class="confirm ${quiz.selected === null ? "hidden" : ""}">
              <p class="muted small">How sure are you? Being honest makes your readiness score smarter.</p>
              <div class="btn-row">
                <button class="btn primary" data-action="check" data-sure="1">${icon("check", "sm")} ${isMock ? "Lock in" : "Check"}: I'm sure</button>
                <button class="btn secondary" data-action="check" data-sure="0">${isMock ? "Lock in" : "Check"}: I'm guessing</button>
              </div>
            </div>` : ""}
          ${feedback}
          ${quiz.revealed && !isMock ? `<div class="btn-row end"><button class="btn primary" data-action="next">${quiz.i + 1 < quiz.items.length ? "Next question" : "See results"} ${icon("arrow", "sm")}</button></div>` : ""}
        </article>
      </div>`;

    if (quiz.timeLimit) {
      const tick = setInterval(() => {
        const left = Math.max(0, quiz.timeLimit - Math.floor((Date.now() - quiz.startedAt) / 1000));
        const t = $("#timer span");
        if (t) t.textContent = fmt(left);
        if (left <= 60) $("#timer") && $("#timer").classList.add("urgent");
        if (left === 0) { clearInterval(tick); finishQuiz(); }
      }, 1000);
      cleanup.push(() => clearInterval(tick));
    }

    actions.pick = (el) => { quiz.selected = Number(el.dataset.i); quizQuestion(); $(".confirm .btn")?.focus(); };
    actions.check = (el) => check(el.dataset.sure === "1");
    actions.next = () => next();
    actions.quit = () => { if (quiz.answers.length) finishQuiz(); else { quiz = null; quizSetup(); } };
    actions.ai = () => openPrompt({ goal: ans && !ans.correct ? "mistake" : "explain", question: q, chosen: ans ? ans.chosen : null, concept: E.conceptsForQuestion(q)[0] });
  }

  function check(sure) {
    if (quiz.selected === null || quiz.revealed) return;
    const q = quiz.items[quiz.i];
    const correct = quiz.selected === q.answer;
    quiz.answers[quiz.i] = { chosen: quiz.selected, sure, correct };
    S.recordAttempt({ qid: q.id, topic: q.topic, correct, sure, mode: quiz.mode });
    if (!correct || !sure) S.flagCards(E.conceptsForQuestion(q).map((c) => c.id));
    if (quiz.mode === "mock") { next(); return; }
    quiz.revealed = true;
    quizQuestion();
    $(".feedback")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function next() {
    if (quiz.i + 1 >= quiz.items.length) return finishQuiz();
    quiz.i += 1;
    quiz.selected = null;
    quiz.revealed = false;
    quizQuestion();
    window.scrollTo(0, 0);
  }

  function finishQuiz() {
    cleanup.forEach((fn) => fn());
    cleanup = [];
    quiz.done = true;
    if (quiz.mode === "mock") {
      const score = quiz.answers.filter((a) => a && a.correct).length;
      S.update((st) => st.mocks.push({ ts: Date.now(), score, total: quiz.items.length }));
    }
    quizSummary();
    window.scrollTo(0, 0);
  }

  function quizSummary() {
    const answered = quiz.answers.filter(Boolean);
    const score = answered.filter((a) => a.correct).length;
    const total = quiz.mode === "mock" ? quiz.items.length : answered.length;
    const lucky = answered.filter((a) => a.correct && !a.sure).length;
    const confWrong = answered.filter((a) => !a.correct && a.sure).length;
    const p = total ? score / total : 0;
    const msg = p >= 0.8 ? "Excellent! You really know this." : p >= 0.6 ? "Good work. Review the misses below and you'll be there." : "Every miss is a lesson. Read the explanations below, then try the flashcards.";
    const byTopic = {};
    quiz.items.forEach((q, i) => {
      const a = quiz.answers[i];
      if (!a && quiz.mode !== "mock") return;
      byTopic[q.topic] = byTopic[q.topic] || { n: 0, ok: 0 };
      byTopic[q.topic].n++;
      if (a && a.correct) byTopic[q.topic].ok++;
    });

    view.innerHTML = `
      <div class="quiz">
        <article class="card summary">
          <p class="eyebrow">${esc(quiz.title)} · results</p>
          <div class="score"><span class="big">${score}<small>/${total}</small></span><span class="status status-${p >= 0.8 ? "ready" : p >= 0.6 ? "almost" : "building"}">${pct(p)}%</span></div>
          <p class="lead">${msg}</p>
          <div class="calib mini">
            <div class="c warn"><strong>${lucky}</strong><span>lucky guesses</span></div>
            <div class="c bad"><strong>${confWrong}</strong><span>confident mistakes</span></div>
          </div>
          <h2>By topic</h2>
          <div class="domains">
            ${Object.entries(byTopic).map(([id, v]) => `<div class="domain-row"><div class="domain-label">${topicChip(id)}</div><div class="bar"><span class="fill fill-${id.slice(0, 2)}" style="width:${pct(v.ok / v.n)}%"></span></div><span class="domain-pct">${v.ok}/${v.n}</span></div>`).join("")}
          </div>
          <div class="btn-row">
            <a class="btn primary" href="#/quiz?mode=smart">Smart mix again</a>
            <a class="btn secondary" href="#/flashcards?mode=trouble">Flashcards for my misses</a>
            <a class="btn ghost" href="#/home">Readiness dashboard</a>
          </div>
        </article>
        <h2 class="section-title">Review your answers</h2>
        <div class="review">
          ${quiz.items.map((q, i) => {
            const a = quiz.answers[i];
            if (!a && quiz.mode !== "mock") return "";
            return `<details class="card review-item ${a && a.correct ? "ok" : "no"}">
              <summary>${icon(a && a.correct ? "check" : "x", "sm")}<span>${esc(q.q)}</span></summary>
              <p><strong>Correct answer:</strong> ${esc(q.options[q.answer])}</p>
              ${a ? (a.correct ? "" : `<p><strong>You chose:</strong> ${esc(q.options[a.chosen])}: ${esc(q.wrong[a.chosen])}</p>`) : `<p class="muted">Not answered.</p>`}
              <p>${esc(q.why)}</p>
              <div class="tipbox">${icon("bulb")}<p>${esc(q.tip)}</p></div>
            </details>`;
          }).join("")}
        </div>
      </div>`;
  }

  // ============================================================
  // FLASHCARDS — Leitner spaced repetition
  // ============================================================
  let deck = null;

  function flashcards(params) {
    const topic = params.get("topic");
    const mode = params.get("mode");
    if (topic || mode) {
      history.replaceState(null, "", "#/flashcards");
      startDeck(mode || "due", topic || "all");
      if (deck.cards.length) return cardView();
    }
    if (deck && deck.i < deck.cards.length) return cardView();
    deckSetup(topic || "all");
  }

  function startDeck(mode, topic) {
    const st = S.get();
    let cards = E.flashcardDeck(st.cards, { mode, topic });
    if (!cards.length && mode === "due" && topic !== "all") cards = E.flashcardDeck(st.cards, { mode: "all", topic });
    deck = { mode, topic, cards, i: 0, flipped: false, knew: 0, again: 0, requeued: {} };
  }

  function deckSetup(topic = "all") {
    const st = S.get();
    const boxes = E.boxCounts(st.cards);
    const due = E.flashcardDeck(st.cards, { mode: "due", topic, newLimit: 0 }).length;
    const fresh = E.flashcardDeck(st.cards, { mode: "due", topic }).length - due;
    const trouble = E.flashcardDeck(st.cards, { mode: "trouble", topic }).length;
    const labels = ["New", "Box 1 · daily", "Box 2 · 1 day", "Box 3 · 3 days", "Box 4 · 7 days", "Box 5 · 14 days"];
    const max = Math.max(1, ...boxes);
    view.innerHTML = `
      <header class="page-head">
        <h1>Flashcard Coach</h1>
        <p class="lead">${W.concepts.length} key terms with simple explanations, African examples and Kiswahili. Cards you know move up a box and come back less often. Cards you miss, here or in a quiz, drop back to Box 1.</p>
      </header>
      <article class="card">
        <div class="card-head"><h2>Your Leitner boxes</h2><span class="muted small">${boxes[4] + boxes[5]} mastered</span></div>
        <div class="boxes">
          ${boxes.map((n, i) => `<div class="box b${i}"><div class="box-bar"><span style="height:${(n / max) * 100}%"></span></div><strong>${n}</strong><small>${labels[i]}</small></div>`).join("")}
        </div>
      </article>
      <article class="card">
        <label class="field"><span>Focus</span>
          <select id="deck-topic">
            <option value="all">All topics</option>
            ${W.domains.map((d) => `<optgroup label="${esc(d.name)}">${E.topicsIn(d.id).map((t) => `<option value="${t.id}" ${t.id === topic ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</optgroup>`).join("")}
          </select>
        </label>
        <div class="grid modes three">
          <button class="card mode" data-action="go" data-mode="due" ${due + fresh ? "" : "disabled"}><h2>Today's review</h2><p><strong>${due}</strong> due + <strong>${Math.min(fresh, 10)}</strong> new</p></button>
          <button class="card mode" data-action="go" data-mode="trouble" ${trouble ? "" : "disabled"}><h2>Trouble cards</h2><p><strong>${trouble}</strong> you keep missing</p></button>
          <button class="card mode" data-action="go" data-mode="all"><h2>Browse all</h2><p>Shuffle every card in this focus</p></button>
        </div>
      </article>`;
    $("#deck-topic").addEventListener("change", (e) => deckSetup(e.target.value));
    actions.go = (el) => { startDeck(el.dataset.mode, $("#deck-topic").value); if (deck.cards.length) cardView(); else toast("No cards here yet."); };
  }

  // Kiswahili is optional: one shared toggle for flashcards and Study Buddy (off by default).
  let swOn = false;
  const swButton = () =>
    `<button class="sw-toggle" data-action="sw" aria-pressed="${swOn}" title="${swOn ? "Show English" : "Translate to Kiswahili"}">${icon("globe", "sm")} ${swOn ? "English" : "Kiswahili"}</button>`;

  function cardView() {
    if (deck.i >= deck.cards.length) return deckDone();
    const c = deck.cards[deck.i];
    const st = S.get();
    const box = (st.cards[c.id] && st.cards[c.id].box) || 0;
    view.innerHTML = `
      <div class="quiz">
        <div class="quiz-top">
          <div><p class="eyebrow">Flashcards · ${deck.mode === "trouble" ? "trouble cards" : deck.mode === "all" ? "browse" : "today's review"}</p><p class="muted small">Card ${deck.i + 1} of ${deck.cards.length} · ${box ? "Box " + box : "new card"}</p></div>
          <button class="btn ghost sm" data-action="stop">Stop</button>
        </div>
        <div class="progress"><span style="width:${(deck.i / deck.cards.length) * 100}%"></span></div>
        <div class="flip ${deck.flipped ? "flipped" : ""}" data-action="flip" tabindex="0" role="button" aria-label="Flip card">
          <div class="face front card">
            ${topicChip(c.topic)}
            <h1>${esc(c.term)}</h1>
            <p class="muted">Say the meaning out loud, then tap to flip ${icon("flip", "sm")}</p>
          </div>
          <div class="face back card">
            ${topicChip(c.topic)}
            <h2>${esc(c.term)}</h2>
            ${swOn ? `<p class="answer" lang="sw">${esc(c.sw)}</p>` : `<p class="answer">${esc(c.short)}</p>`}
            <div class="mini-sections">
              <p><strong>${icon("pin", "sm")} Real life:</strong> ${esc(c.africa)}</p>
            </div>
            ${swButton()}
          </div>
        </div>
        <div class="btn-row center ${deck.flipped ? "" : "hidden"}">
          <button class="btn secondary big" data-action="rate" data-k="0">${icon("x", "sm")} Still learning</button>
          <button class="btn primary big" data-action="rate" data-k="1">${icon("check", "sm")} I knew it</button>
        </div>
        <p class="muted small center">Keyboard: <kbd>Space</kbd> flip · <kbd>1</kbd> still learning · <kbd>2</kbd> knew it</p>
      </div>`;
    actions.flip = () => { deck.flipped = !deck.flipped; cardView(); };
    actions.sw = () => { swOn = !swOn; cardView(); };
    actions.rate = (el) => rate(el.dataset.k === "1");
    actions.stop = () => deckDone();
  }

  function rate(knewIt) {
    if (!deck.flipped) return;
    const c = deck.cards[deck.i];
    S.reviewCard(c.id, knewIt);
    if (knewIt) deck.knew++;
    else {
      deck.again++;
      // See it again a few cards later in this session (max twice).
      const n = deck.requeued[c.id] || 0;
      if (n < 2) { deck.cards.splice(Math.min(deck.cards.length, deck.i + 4), 0, c); deck.requeued[c.id] = n + 1; }
    }
    deck.i++;
    deck.flipped = false;
    cardView();
  }

  function deckDone() {
    const boxes = E.boxCounts(S.get().cards);
    const knew = deck.knew, again = deck.again;
    deck = null;
    view.innerHTML = `
      <article class="card summary center">
        <p class="eyebrow">Session complete</p>
        <h1>Hongera! Well done.</h1>
        <p class="lead">You knew <strong>${knew}</strong> and are still learning <strong>${again}</strong>. Cards you knew will come back in a few days. The others will be back sooner.</p>
        <p class="muted">${boxes[4] + boxes[5]} of ${W.concepts.length} cards mastered so far.</p>
        <div class="btn-row center">
          <a class="btn primary" href="#/quiz?mode=smart">Test yourself: smart mix</a>
          <a class="btn ghost" href="#/flashcards?x=1">Back to flashcards</a>
        </div>
      </article>`;
  }

  // ============================================================
  // STUDY BUDDY — simple explanations, African examples, Kiswahili, AI prompts
  // ============================================================
  function buddy(params) {
    let filter = params.get("topic") || "all";
    let search = "";
    let current = params.get("c") || null;

    const list = () => W.concepts.filter((c) => {
      if (filter !== "all" && c.topic !== filter) return false;
      if (!search) return true;
      const hay = [c.term, c.short, ...(c.keywords || [])].join(" ").toLowerCase();
      return hay.includes(search.toLowerCase());
    });

    view.innerHTML = `
      <header class="page-head">
        <h1>Study Buddy</h1>
        <p class="lead">Every AZ-900 concept in simple words, with an everyday African example and a Kiswahili explanation. Need more? Build an expert prompt for any AI assistant in one tap.</p>
      </header>
      <div class="buddy">
        <aside class="card buddy-list">
          <label class="search">${icon("search", "sm")}<input id="b-search" type="search" placeholder="Search e.g. MFA, storage, cost" aria-label="Search concepts"></label>
          <select id="b-topic" aria-label="Filter by topic">
            <option value="all">All topics (${W.concepts.length})</option>
            ${W.domains.map((d) => `<optgroup label="${esc(d.name)}">${E.topicsIn(d.id).map((t) => `<option value="${t.id}" ${t.id === filter ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</optgroup>`).join("")}
          </select>
          <ul id="b-items"></ul>
        </aside>
        <section id="b-detail"></section>
      </div>`;

    const drawList = () => {
      const items = list();
      $("#b-items").innerHTML = items.length
        ? items.map((c) => `<li><button class="${c.id === current ? "active" : ""}" data-action="open" data-id="${c.id}"><span class="dot dot-${c.topic.slice(0, 2)}"></span>${esc(c.term)}</button></li>`).join("")
        : `<li class="muted small">No match. Try another word.</li>`;
    };

    const drawDetail = () => {
      const c = E.concept(current) || list()[0] || W.concepts[0];
      current = c.id;
      const t = E.topic(c.topic);
      const related = (c.related || []).map(E.concept).filter(Boolean);
      $("#b-detail").innerHTML = `
        <article class="card concept">
          <div class="q-meta">${topicChip(c.topic)}<span class="muted small">${esc(E.domain(t.domain).full)}</span></div>
          <h2 class="concept-title">${esc(c.term)}</h2>
          <p class="answer">${esc(c.short)}</p>
          <div class="sections">
            <section${swOn ? ' lang="sw"' : ""}><h3>${swOn ? "Kwa maneno rahisi" : "In simple words"}
              <span class="h3-tools">${swButton()}<button class="icon-btn" data-action="say" data-lang="${swOn ? "sw" : "en"}" data-text="${esc(swOn ? c.sw : c.simple)}" aria-label="Read aloud">${icon("speak", "sm")}</button></span></h3>
              <p>${esc(swOn ? c.sw : c.simple)}</p></section>
            <section class="africa"><h3>${icon("pin", "sm")} Like in real life</h3><p>${esc(c.africa)}</p></section>
            <section class="tip"><h3>${icon("bulb", "sm")} Exam tip</h3><p>${esc(c.tip)}</p></section>
          </div>
          ${related.length ? `<p class="related">Related: ${related.map((r) => `<button class="chip" data-action="open" data-id="${r.id}">${esc(r.term)}</button>`).join(" ")}</p>` : ""}
          <div class="ask">
            <h3>${icon("ai", "sm")} Ask an AI tutor about this</h3>
            <p class="muted small">We write a structured prompt using this concept, your weak areas and your language, then you paste it into Claude, ChatGPT or Copilot.</p>
            <div class="btn-row">
              ${["explain", "example", "compare", "quiz", "mnemonic"].map((g) => `<button class="btn ghost sm" data-action="prompt" data-goal="${g}">${esc(E.GOALS[g])}</button>`).join("")}
            </div>
          </div>
          <div class="btn-row">
            <a class="btn primary" href="#/quiz?topic=${c.topic}">Practise ${esc(t.name)}</a>
            <a class="btn secondary" href="#/flashcards?topic=${c.topic}">Flashcards for this topic</a>
          </div>
        </article>`;
    };

    $("#b-search").addEventListener("input", (e) => { search = e.target.value.trim(); drawList(); });
    $("#b-topic").addEventListener("change", (e) => { filter = e.target.value; current = list()[0] ? list()[0].id : current; drawList(); drawDetail(); });
    actions.open = (el) => {
      current = el.dataset.id;
      drawList();
      drawDetail();
      if (window.innerWidth < 860) $("#b-detail").scrollIntoView({ behavior: "smooth" });
    };
    actions.say = (el) => speak(el.dataset.text, el.dataset.lang);
    actions.sw = () => { swOn = !swOn; drawDetail(); };
    actions.prompt = (el) => openPrompt({ goal: el.dataset.goal, concept: E.concept(current) });
    drawList();
    drawDetail();
  }

  // ============================================================
  // PROMPT BUILDER (modal) — shows the prompt's anatomy
  // ============================================================
  function openPrompt(opts) {
    const st = S.get();
    const dlg = $("#prompt-dialog");
    const state = { language: st.settings.language || "English", level: "beginner", ...opts };

    const draw = () => {
      const sections = E.buildPrompt({ ...state, attempts: st.attempts });
      const text = E.promptText(sections);
      const goals = state.question ? ["mistake", "explain", "example", "mnemonic"] : state.goal === "coach" ? ["coach"] : ["explain", "example", "compare", "quiz", "mnemonic"];
      dlg.innerHTML = `
        <form method="dialog" class="dialog-inner">
          <div class="card-head"><h2>${icon("ai", "sm")} AI tutor prompt</h2><button class="icon-btn" value="close" aria-label="Close">${icon("x")}</button></div>
          <p class="muted small">A well-structured prompt gets far better answers. This one is built from the concept${state.question ? ", your answer" : ""} and your progress.</p>
          <div class="prompt-controls">
            ${goals.length > 1 ? `<label class="field"><span>Goal</span><select id="p-goal">${goals.map((g) => `<option value="${g}" ${g === state.goal ? "selected" : ""}>${esc(E.GOALS[g])}</option>`).join("")}</select></label>` : ""}
            <label class="field"><span>Language</span><select id="p-lang">${E.LANGUAGES.map((l) => `<option ${l === state.language ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
            <label class="field"><span>Level</span><select id="p-level">${["beginner", "intermediate"].map((l) => `<option ${l === state.level ? "selected" : ""}>${l}</option>`).join("")}</select></label>
          </div>
          <div class="anatomy">
            ${sections.map((s) => `<div class="part part-${s.label.toLowerCase().replace(/\s+/g, "-")}"><span class="part-label">${esc(s.label)}</span><pre>${esc(s.text)}</pre></div>`).join("")}
          </div>
          <p class="muted small">Always double-check AI answers against Microsoft Learn. AI can be confidently wrong too!</p>
          <div class="dialog-actions">
            <button type="button" class="btn primary" id="p-copy">${icon("copy", "sm")} Copy prompt</button>
            <a class="btn secondary" target="_blank" rel="noopener" href="https://claude.ai/new?q=${encodeURIComponent(text)}">Open in Claude</a>
            <a class="btn secondary" target="_blank" rel="noopener" href="https://chatgpt.com/?q=${encodeURIComponent(text)}">Open in ChatGPT</a>
          </div>
        </form>`;
      $("#p-goal", dlg)?.addEventListener("change", (e) => { state.goal = e.target.value; draw(); });
      $("#p-lang", dlg).addEventListener("change", (e) => { state.language = e.target.value; S.update((s) => (s.settings.language = e.target.value)); draw(); });
      $("#p-level", dlg).addEventListener("change", (e) => { state.level = e.target.value; draw(); });
      $("#p-copy", dlg).addEventListener("click", () => copy(text));
    };
    draw();
    if (!dlg.open) dlg.showModal();
  }

  // ============================================================
  // PLANNER — exam date + hours + weak areas -> sessions (+ calendar export)
  // ============================================================
  function planner() {
    const st = S.get();
    const s = st.settings;
    const r = E.readiness(st.attempts);
    const suggestedWeak = st.attempts.length >= 10 ? r.domains.filter((d) => d.score < 0.6).map((d) => d.id) : [];
    const weak = s.weakDomains.length ? s.weakDomains : suggestedWeak;
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const minDate = E.todayKey(new Date(Date.now() + 86400e3));

    view.innerHTML = `
      <header class="page-head">
        <h1>Study Planner</h1>
        <p class="lead">Tell us your exam date and how much time you have. We'll build a plan that spends more time on heavier exam domains and on your weak areas, then save it to your calendar.</p>
      </header>
      <div class="planner">
        <form class="card plan-form" id="plan-form">
          <label class="field"><span>Exam date</span><input type="date" id="f-date" min="${minDate}" value="${esc(s.examDate)}" required></label>
          <label class="field"><span>Hours per week: <strong id="f-hours-out">${s.hoursPerWeek}</strong></span><input type="range" id="f-hours" min="1" max="20" value="${s.hoursPerWeek}"></label>
          <fieldset class="field"><legend>Study days</legend>
            <div class="day-chips">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<label class="day"><input type="checkbox" value="${d}" ${s.days.includes(d) ? "checked" : ""}><span>${DAYS[d]}</span></label>`).join("")}</div>
          </fieldset>
          <label class="field"><span>Preferred time</span><input type="time" id="f-time" value="${esc(s.time)}"></label>
          <label class="field"><span>Your starting point</span>
            <select id="f-level">
              <option value="new" ${s.level === "new" ? "selected" : ""}>New to cloud</option>
              <option value="some" ${s.level === "some" ? "selected" : ""}>Some cloud/IT experience</option>
              <option value="confident" ${s.level === "confident" ? "selected" : ""}>Confident, just revising</option>
            </select>
          </label>
          <fieldset class="field"><legend>Weak areas ${suggestedWeak.length ? '<span class="muted small">(suggested from your quiz results)</span>' : ""}</legend>
            ${W.domains.map((d) => `<label class="check"><input type="checkbox" name="weak" value="${d.id}" ${weak.includes(d.id) ? "checked" : ""}><span><span class="dot dot-${d.id}"></span>${esc(d.name)}</span></label>`).join("")}
          </fieldset>
          <button class="btn primary" type="submit">Generate my plan</button>
          <p class="error" id="f-error" role="alert"></p>
        </form>
        <section id="plan-out"></section>
      </div>`;

    $("#f-hours").addEventListener("input", (e) => ($("#f-hours-out").textContent = e.target.value));
    $("#plan-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const settings = {
        examDate: $("#f-date").value,
        hoursPerWeek: Number($("#f-hours").value),
        days: $$(".day input:checked").map((x) => Number(x.value)),
        time: $("#f-time").value || "19:00",
        level: $("#f-level").value,
        weakDomains: $$("input[name=weak]:checked").map((x) => x.value),
      };
      const plan = E.buildPlan({ ...settings, attempts: S.get().attempts });
      if (plan.error) { $("#f-error").textContent = plan.error; return; }
      $("#f-error").textContent = "";
      S.update((st2) => { st2.settings = { ...st2.settings, ...settings }; st2.plan = plan; st2.planDone = {}; });
      drawPlan();
      if (window.innerWidth < 860) $("#plan-out").scrollIntoView({ behavior: "smooth" });
    });
    drawPlan();
  }

  function drawPlan() {
    const st = S.get();
    const plan = st.plan;
    const out = $("#plan-out");
    if (!plan) {
      out.innerHTML = `<article class="card empty"><h2>No plan yet</h2><p class="muted">Fill in the form to generate your personal plan. It updates as your quiz results change. Just regenerate it each week.</p></article>`;
      return;
    }
    const done = Object.values(st.planDone).filter(Boolean).length;
    const kindLabel = { learn: "Learn", drill: "Drill", mock: "Mock", review: "Review" };
    const fmt = (key) => E.parseDay(key).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
    const todayKey = E.todayKey();
    out.innerHTML = `
      <article class="card">
        <div class="card-head">
          <h2>Your plan to ${fmt(plan.examDate)}</h2>
          <div class="btn-row tight">
            <button class="btn ghost sm" data-action="ics">${icon("download", "sm")} Add to calendar (.ics)</button>
            <button class="btn ghost sm" data-action="print">Print</button>
          </div>
        </div>
        <p class="muted">${plan.summary.total} sessions of ~${plan.minutes} min · ${plan.summary.learn} learn · ${plan.summary.drill} weak-area drills · ${plan.summary.final ? plan.summary.final + " final review" : "no time for a mock, so focus on drills"}</p>
        ${plan.summary.daysLeft < 7 ? `<p class="tag warn">Under a week to go: this is a crash plan. Prioritise drills and flashcards.</p>` : ""}
        <div class="progress"><span style="width:${(done / plan.sessions.length) * 100}%"></span></div>
        <p class="muted small">${done} of ${plan.sessions.length} sessions done</p>
        <ol class="sessions">
          ${plan.sessions.map((s) => {
            const t = E.sessionTasks(s, plan.minutes);
            const isDone = !!st.planDone[s.id];
            return `<li class="session ${isDone ? "done" : ""} ${s.date === todayKey ? "today" : ""}">
              <label class="session-check"><input type="checkbox" data-sid="${s.id}" ${isDone ? "checked" : ""} aria-label="Mark session done"></label>
              <div class="session-date"><strong>${fmt(s.date)}</strong>${s.date === todayKey ? '<span class="tag">today</span>' : ""}</div>
              <div class="session-body">
                <span class="kind kind-${s.kind}">${kindLabel[s.kind]}</span>
                <h3>${esc(t.title)}</h3>
                <ul>${t.steps.map((x) => `<li>${x.link ? `<a href="${x.link}">${esc(x.text)}</a>` : esc(x.text)}</li>`).join("")}</ul>
              </div>
            </li>`;
          }).join("")}
        </ol>
      </article>`;
    $$(".session-check input", out).forEach((cb) => cb.addEventListener("change", () => {
      S.update((s2) => (s2.planDone[cb.dataset.sid] = cb.checked));
      drawPlan();
    }));
    actions.ics = () => {
      const blob = new Blob([E.planToICS(plan, st.settings.time)], { type: "text/calendar" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "readyfor900-study-plan.ics";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast("Calendar file downloaded. Open it to add your sessions.");
    };
    actions.print = () => window.print();
  }

  // ============================================================
  // ABOUT
  // ============================================================
  function about() {
    const st = S.get();
    view.innerHTML = `
      <header class="page-head">
        <h1>About Readyfor900</h1>
        <p class="lead">Every AZ-900 learner asks the same question: <em>am I ready?</em> Readyfor900 is a free study companion that helps you get ready and shows you when you are. It was built by a learner for the next learners.</p>
      </header>
      <div class="grid two">
        <article class="card">
          <h2>Important: unofficial</h2>
          <p>Readyfor900 is <strong>not affiliated with, endorsed by or connected to Microsoft</strong>. All questions, flashcards and explanations are original, written for learning and based on the public AZ-900 skills outline on Microsoft Learn (skills measured as of ${esc(W.outlineDate)}). They are not real exam questions. Always confirm details with the official Microsoft Learn materials.</p>
        </article>
        <article class="card">
          <h2>Your name (optional)</h2>
          <label class="field"><span>What should we call you?</span><input id="a-name" value="${esc(st.name)}" placeholder="e.g. Amani" maxlength="30"></label>
          <h2>Your data</h2>
          <p class="muted">Progress is saved only in this browser (localStorage). No account, no tracking, nothing sent to a server.</p>
          <div class="btn-row">
            <button class="btn ghost sm" data-action="export">${icon("download", "sm")} Export progress</button>
            <button class="btn ghost sm" data-action="sample">Load sample progress</button>
            <button class="btn danger sm" data-action="reset">Reset everything</button>
          </div>
        </article>
        <article class="card">
          <h2>What's inside</h2>
          <ul class="ticks">
            <li><strong>${W.questions.length} original questions</strong> covering every skills-outline topic, with an explanation for <em>every</em> option</li>
            <li><strong>${W.concepts.length} concepts</strong> with simple explanations, African examples and Kiswahili</li>
            <li>Confidence tracking that separates real knowledge from lucky guesses</li>
            <li>Leitner spaced repetition that resurfaces quiz mistakes as flashcards</li>
            <li>A readiness score weighted like the real exam domains</li>
            <li>A planner with calendar export, and an AI prompt builder for any assistant</li>
          </ul>
        </article>
        <article class="card">
          <h2>How the AI part works</h2>
          <p>Readyfor900 doesn't need API keys or accounts. Instead, it <strong>engineers prompts</strong>: it combines the concept, your answer, your weak topics, your level and your chosen language into a structured prompt (Role → Context → Task → Constraints → Output format). You can paste it into any AI assistant. That keeps the app free, private and usable in 14 languages.</p>
        </article>
      </div>`;
    $("#a-name").addEventListener("change", (e) => { S.update((s) => (s.name = e.target.value.trim())); toast("Saved."); });
    actions.export = () => {
      const blob = new Blob([JSON.stringify(S.get(), null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "readyfor900-progress.json";
      a.click();
    };
    actions.sample = () => { S.loadSample(); toast("Sample progress loaded. Check the dashboard."); };
    actions.reset = () => {
      if (window.confirm("Delete all your Readyfor900 progress on this device?")) { S.reset(); quiz = null; deck = null; toast("Progress reset."); render(); }
    };
  }

  // ---------- Keyboard shortcuts ----------
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, select, textarea") || $("#prompt-dialog").open) return;
    const { path } = parseHash();
    if (path === "quiz" && quiz && !quiz.done && $(".qcard")) {
      const k = e.key.toLowerCase();
      if (!quiz.revealed && ["1", "2", "3", "4"].includes(k) && Number(k) <= quiz.items[quiz.i].options.length) actions.pick({ dataset: { i: String(Number(k) - 1) } });
      else if (!quiz.revealed && quiz.selected !== null && k === "enter") { e.preventDefault(); check(true); }
      else if (!quiz.revealed && quiz.selected !== null && k === "g") check(false);
      else if (quiz.revealed && (k === "n" || k === "enter")) { e.preventDefault(); next(); }
    }
    if (path === "flashcards" && deck && $(".flip")) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); actions.flip(); }
      else if (deck.flipped && e.key === "1") rate(false);
      else if (deck.flipped && e.key === "2") rate(true);
    }
  });

  // ---------- Theme ----------
  const applyTheme = () => {
    const t = S.get().settings.theme;
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  };
  $("#theme-toggle").addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    S.update((s) => (s.settings.theme = dark ? "light" : "dark"));
    applyTheme();
  });

  const routes = { home, quiz: quizView, flashcards, buddy, planner, about };
  const dlg = $("#prompt-dialog");
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // click backdrop to close
  applyTheme();
  window.addEventListener("hashchange", render);
  render();
})(window.READY);
