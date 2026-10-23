// Readyfor900 engine — pure functions for readiness, adaptive practice, spaced repetition,
// study planning and prompt building. No DOM access here, so it is easy to test.
(function (W) {
  "use strict";

  const DAY = 24 * 60 * 60 * 1000;
  const E = {};

  // ---------- Lookups ----------
  E.domain = (id) => W.domains.find((d) => d.id === id);
  E.topic = (id) => W.topics.find((t) => t.id === id);
  E.concept = (id) => W.concepts.find((c) => c.id === id);
  E.domainWeight = (d) => (d.weight[0] + d.weight[1]) / 2;
  E.topicsIn = (domainId) => W.topics.filter((t) => t.domain === domainId);
  E.questionsIn = (topicId) => W.questions.filter((q) => q.topic === topicId);

  // ---------- Helpers ----------
  E.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  E.todayKey = (d = new Date()) => {
    const z = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  };
  E.parseDay = (key) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  E.daysUntil = (key) => {
    if (!key) return null;
    const today = E.parseDay(E.todayKey());
    return Math.round((E.parseDay(key) - today) / DAY);
  };

  // ---------- Readiness ----------
  // Each attempt: { qid, topic, correct, sure, ts }
  // Points: correct & sure = 1, correct but guessing ("lucky") = 0.5, wrong = 0.
  E.points = (a) => (a.correct ? (a.sure ? 1 : 0.5) : 0);

  E.topicStats = (attempts, topicId) => {
    const mine = attempts.filter((a) => a.topic === topicId);
    const recent = mine.slice(-10);
    const total = E.questionsIn(topicId).length || 1;
    const seen = new Set(mine.map((a) => a.qid)).size;
    const coverage = Math.min(1, seen / total);
    const acc = recent.length ? recent.reduce((s, a) => s + E.points(a), 0) / recent.length : 0;
    return {
      attempts: mine.length,
      correct: mine.filter((a) => a.correct).length,
      lucky: mine.filter((a) => a.correct && !a.sure).length,
      confidentWrong: mine.filter((a) => !a.correct && a.sure).length,
      coverage,
      accuracy: acc,
      // Mastery = recent accuracy (lucky guesses count half), scaled by how much of the topic you've practised.
      mastery: mine.length ? acc * (0.6 + 0.4 * coverage) : null,
    };
  };

  E.readiness = (attempts) => {
    const topics = {};
    W.topics.forEach((t) => (topics[t.id] = E.topicStats(attempts, t.id)));
    const domains = W.domains.map((d) => {
      const ts = E.topicsIn(d.id);
      const score = ts.reduce((s, t) => s + (topics[t.id].mastery || 0), 0) / ts.length;
      return { id: d.id, name: d.name, weight: E.domainWeight(d), score };
    });
    const wsum = domains.reduce((s, d) => s + d.weight, 0);
    const overall = domains.reduce((s, d) => s + d.score * d.weight, 0) / wsum;
    const minDomain = Math.min(...domains.map((d) => d.score));
    let status;
    if (attempts.length < 10) status = { key: "start", label: "Just getting started", hint: "Answer at least 10 questions to unlock your readiness estimate." };
    else if (overall >= 0.8 && minDomain >= 0.7) status = { key: "ready", label: "Exam ready", hint: "Strong across every domain. Take a mock exam to confirm, then book it!" };
    else if (overall >= 0.7) status = { key: "almost", label: "Almost ready", hint: "Close! Lift your weakest domain above 70% before booking." };
    else if (overall >= 0.5) status = { key: "getting", label: "Getting there", hint: "Good progress. Keep drilling your weak topics." };
    else status = { key: "building", label: "Building foundations", hint: "Learn the concepts first, then practise topic by topic." };
    const weakest = W.topics
      .map((t) => ({ ...t, ...topics[t.id] }))
      .sort((a, b) => (a.mastery ?? -1) - (b.mastery ?? -1));
    return { overall, domains, topics, status, weakest };
  };

  E.calibration = (attempts) => ({
    sureRight: attempts.filter((a) => a.sure && a.correct).length,
    sureWrong: attempts.filter((a) => a.sure && !a.correct).length,
    guessRight: attempts.filter((a) => !a.sure && a.correct).length,
    guessWrong: attempts.filter((a) => !a.sure && !a.correct).length,
  });

  // ---------- Question selection ----------
  E.lastAttempt = (attempts, qid) => {
    for (let i = attempts.length - 1; i >= 0; i--) if (attempts[i].qid === qid) return attempts[i];
    return null;
  };

  // Weak areas first: low-mastery topics, questions you got wrong, confident mistakes and lucky guesses.
  E.smartMix = (attempts, n = 10) => {
    const r = E.readiness(attempts);
    const scored = W.questions.map((q) => {
      const m = r.topics[q.topic].mastery;
      const last = E.lastAttempt(attempts, q.id);
      let p = (m === null ? 0.7 : 1 - m) * 2;
      if (!last) p += 1;
      else if (!last.correct) p += last.sure ? 3 : 2;
      else if (!last.sure) p += 1.5;
      else p -= 1.5;
      return { q, p: p + Math.random() * 0.8 };
    });
    return E.shuffle(scored.sort((a, b) => b.p - a.p).slice(0, n).map((s) => s.q));
  };

  // Mock exam: questions spread by domain weight.
  E.mockExam = (n = 20) => {
    const wsum = W.domains.reduce((s, d) => s + E.domainWeight(d), 0);
    const picks = [];
    W.domains.forEach((d, i) => {
      const want = i === W.domains.length - 1 ? n - picks.length : Math.round((n * E.domainWeight(d)) / wsum);
      const pool = E.shuffle(W.questions.filter((q) => q.topic.startsWith(d.id + "-")));
      picks.push(...pool.slice(0, want));
    });
    return E.shuffle(picks);
  };

  // Shuffle a question's options (keeping each option's explanation attached).
  E.prepareQuestion = (q) => {
    const order = E.shuffle(q.options.map((_, i) => i));
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      wrong: order.map((i) => q.wrong[i]),
      answer: order.indexOf(q.answer),
    };
  };

  // ---------- Concept matching (links questions to flashcards / Study Buddy) ----------
  E.conceptsForQuestion = (q, max = 2) => {
    const text = [q.q, q.options[q.answer], q.why].join(" ").toLowerCase();
    const score = (c) => {
      let s = 0;
      c.term
        .toLowerCase()
        .split(/[,/&()]| and | vs\.? /)
        .map((x) => x.trim())
        .filter((x) => x.length >= 3)
        .forEach((tok) => { if (text.includes(tok)) s += 3; });
      (c.keywords || []).forEach((k) => { if (text.includes(k.toLowerCase())) s += 1; });
      return s;
    };
    const ranked = W.concepts
      .filter((c) => c.topic === q.topic)
      .map((c) => ({ c, s: score(c) }))
      .sort((a, b) => b.s - a.s);
    const good = ranked.filter((x) => x.s >= 2).slice(0, max).map((x) => x.c);
    return good.length ? good : ranked.slice(0, 1).map((x) => x.c);
  };

  // ---------- Spaced repetition (Leitner boxes) ----------
  // card state: { box: 1..5, due: ms, wrong: n, seen: n }
  E.BOX_DAYS = [0, 1, 3, 7, 14]; // review interval after landing in box 1..5
  E.reviewCard = (card, knewIt, now = Date.now()) => {
    const c = { box: 0, due: now, wrong: 0, seen: 0, ...card };
    c.seen += 1;
    if (knewIt) {
      c.box = Math.min(5, Math.max(1, c.box + 1));
      c.due = now + E.BOX_DAYS[c.box - 1] * DAY;
    } else {
      c.box = 1;
      c.wrong += 1;
      c.due = now;
    }
    return c;
  };

  E.flashcardDeck = (cards, { topic = "all", mode = "due", newLimit = 10, now = Date.now() } = {}) => {
    const pool = W.concepts.filter((c) => topic === "all" || c.topic === topic || c.topic.startsWith(topic + "-"));
    const state = (c) => cards[c.id];
    if (mode === "trouble") {
      return pool.filter((c) => state(c) && state(c).wrong > 0 && state(c).box <= 2)
        .sort((a, b) => state(b).wrong - state(a).wrong);
    }
    if (mode === "all") return E.shuffle(pool);
    const due = pool.filter((c) => state(c) && state(c).box > 0 && state(c).due <= now)
      .sort((a, b) => state(a).box - state(b).box || state(b).wrong - state(a).wrong);
    const fresh = pool.filter((c) => !state(c) || !state(c).box).slice(0, newLimit);
    return [...due, ...fresh];
  };

  E.boxCounts = (cards) => {
    const counts = [0, 0, 0, 0, 0, 0]; // index 0 = new
    W.concepts.forEach((c) => counts[(cards[c.id] && cards[c.id].box) || 0]++);
    return counts;
  };

  // ---------- Study planner ----------
  E.buildPlan = ({ examDate, hoursPerWeek, days, level, weakDomains = [], attempts = [] }) => {
    const until = E.daysUntil(examDate);
    if (until === null || until < 1) return { error: "Pick an exam date in the future." };
    if (!days.length) return { error: "Pick at least one study day." };

    const today = E.parseDay(E.todayKey());
    const dates = [];
    for (let i = 0; i < until && dates.length < 60; i++) {
      const d = new Date(today.getTime() + i * DAY);
      if (days.includes(d.getDay())) dates.push(E.todayKey(d));
    }
    if (!dates.length) return { error: "No study days fall before your exam. Add more days." };

    const minutes = Math.max(20, Math.round((hoursPerWeek * 60) / days.length / 5) * 5);
    const N = dates.length;
    const finalCount = N >= 6 ? 2 : N >= 3 ? 1 : 0;
    const drillCount = N >= 8 ? Math.round((N - finalCount) * 0.2) : 0;
    const learnCount = N - finalCount - drillCount;

    // Topic weights: exam weight x weakness (untested topics use the learner's self-rated level).
    const r = E.readiness(attempts);
    const untested = { new: 1, some: 0.7, confident: 0.45 }[level] ?? 0.8;
    const weights = W.topics.map((t) => {
      const d = E.domain(t.domain);
      const m = r.topics[t.id].mastery;
      let weakness = m === null ? untested : 1 - m;
      if (weakDomains.includes(t.domain)) weakness += 0.5;
      return { t, w: (E.domainWeight(d) / E.topicsIn(d.id).length) * (0.4 + weakness) };
    });
    const W_sum = weights.reduce((s, x) => s + x.w, 0);

    // Allocate learn sessions to topics (outline order keeps the learning journey logical).
    const learnSessions = [];
    if (learnCount >= W.topics.length) {
      const extra = learnCount - W.topics.length;
      const shares = weights.map((x) => ({ ...x, n: 1, rem: (extra * x.w) / W_sum }));
      shares.forEach((s) => { s.n += Math.floor(s.rem); s.rem -= Math.floor(s.rem); });
      let left = learnCount - shares.reduce((s, x) => s + x.n, 0);
      [...shares].sort((a, b) => b.rem - a.rem).forEach((s) => { if (left > 0) { s.n++; left--; } });
      shares.forEach((s) => {
        for (let k = 0; k < s.n; k++) learnSessions.push({ topics: [s.t.id], part: s.n > 1 ? `${k + 1}/${s.n}` : "" });
      });
    } else if (learnCount > 0) {
      // Fewer sessions than topics: group neighbouring topics by cumulative weight.
      let cum = 0;
      const groups = Array.from({ length: learnCount }, () => []);
      weights.forEach((x) => {
        const mid = cum + x.w / 2;
        groups[Math.min(learnCount - 1, Math.floor((mid / W_sum) * learnCount))].push(x.t.id);
        cum += x.w;
      });
      groups.forEach((g) => learnSessions.push({ topics: g.length ? g : [weights[0].t.id], part: "" }));
    }

    const weakTopics = weights.slice().sort((a, b) => b.w - a.w).map((x) => x.t.id);
    const sessions = [];
    learnSessions.forEach((s) => sessions.push({ kind: "learn", ...s }));
    for (let i = 0; i < drillCount; i++) {
      sessions.push({ kind: "drill", topics: weakTopics.slice((i * 3) % 9, ((i * 3) % 9) + 3), part: "" });
    }
    if (finalCount === 2) sessions.push({ kind: "mock", topics: [], part: "" });
    if (finalCount >= 1) sessions.push({ kind: "review", topics: [], part: "" });

    return {
      examDate, minutes, createdAt: Date.now(),
      sessions: sessions.map((s, i) => ({ ...s, id: i, date: dates[i] })),
      summary: { total: N, learn: learnCount, drill: drillCount, final: finalCount, daysLeft: until },
    };
  };

  E.sessionTasks = (s, minutes) => {
    const names = s.topics.map((id) => E.topic(id).name).join(" + ");
    const nConcepts = W.concepts.filter((c) => s.topics.includes(c.topic)).length;
    switch (s.kind) {
      case "learn":
        return {
          title: `Learn: ${names}${s.part ? ` (part ${s.part})` : ""}`,
          steps: [
            { text: `Read ${nConcepts} concept${nConcepts === 1 ? "" : "s"} in Study Buddy`, link: `#/buddy?topic=${s.topics[0]}` },
            { text: "Flashcards for this topic", link: `#/flashcards?topic=${s.topics[0]}` },
            { text: "Topic quiz with explanations", link: `#/quiz?topic=${s.topics[0]}` },
          ],
        };
      case "drill":
        return {
          title: `Weak-area drill: ${names}`,
          steps: [
            { text: "Smart mix quiz (weak areas first)", link: "#/quiz?mode=smart" },
            { text: "Trouble flashcards", link: "#/flashcards?mode=trouble" },
          ],
        };
      case "mock":
        return {
          title: "Mock exam + review mistakes",
          steps: [
            { text: "Timed mock exam (20 questions)", link: "#/quiz?mode=mock" },
            { text: "Check your readiness dashboard", link: "#/home" },
          ],
        };
      default:
        return {
          title: "Light review & exam prep",
          steps: [
            { text: "Due flashcards only", link: "#/flashcards" },
            { text: "Re-read exam tips for your weakest topics", link: "#/buddy" },
            { text: "Rest, check your ID and exam time", link: "" },
          ],
        };
    }
  };

  // Calendar export (.ics) so the plan lands in Google Calendar / Outlook / phone calendar.
  E.planToICS = (plan, time = "19:00") => {
    const [hh, mm] = time.split(":").map(Number);
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = (key, addMin) => {
      const d = E.parseDay(key);
      d.setHours(hh, mm + addMin, 0, 0);
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };
    const esc = (s) => s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Readyfor900//Study Plan//EN", "CALSCALE:GREGORIAN"];
    plan.sessions.forEach((s) => {
      const t = E.sessionTasks(s, plan.minutes);
      lines.push(
        "BEGIN:VEVENT",
        `UID:readyfor900-${plan.createdAt}-${s.id}@readyfor900`,
        `DTSTAMP:${stamp(E.todayKey(), 0)}`,
        `DTSTART:${stamp(s.date, 0)}`,
        `DTEND:${stamp(s.date, plan.minutes)}`,
        `SUMMARY:${esc("Readyfor900 · " + t.title)}`,
        `DESCRIPTION:${esc(t.steps.map((x) => "• " + x.text).join("\n") + "\n\nUnofficial AZ-900 study plan from Readyfor900.")}`,
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  };

  // ---------- Prompt builder (prompt engineering for any AI assistant) ----------
  E.LANGUAGES = ["English", "Kiswahili", "Sheng (Kenyan street slang)", "Hausa", "Yoruba", "Igbo", "Amharic", "isiZulu", "Kinyarwanda", "Luganda", "Twi", "French", "Arabic", "Portuguese"];
  E.GOALS = {
    explain: "Explain it simply",
    example: "African real-life examples",
    compare: "Compare with look-alikes",
    quiz: "Quiz me (3 questions)",
    mnemonic: "Help me memorise it",
    mistake: "Explain my mistake",
    coach: "Coach me on my weak areas",
  };

  E.weakSummary = (attempts) => {
    if (attempts.length < 5) return "not measured yet (I'm just starting)";
    const r = E.readiness(attempts);
    return r.weakest.slice(0, 3)
      .map((t) => `${t.name} (${t.mastery === null ? "not practised" : Math.round(t.mastery * 100) + "% mastery"})`)
      .join("; ");
  };

  // Returns [{ label, text }] sections so the UI can show the prompt's anatomy.
  E.buildPrompt = ({ goal = "explain", concept = null, question = null, chosen = null, language = "English", level = "beginner", attempts = [] }) => {
    const topic = concept ? E.topic(concept.topic) : question ? E.topic(question.topic) : null;
    const domain = topic ? E.domain(topic.domain) : null;
    const subject = concept ? concept.term : topic ? topic.name : "the AZ-900 skills outline";
    const related = concept ? (concept.related || []).map((id) => E.concept(id)).filter(Boolean).map((c) => c.term) : [];

    const context = [
      `- Exam: Microsoft Azure Fundamentals (AZ-900). I'm using an unofficial study app.`,
      topic ? `- Skills-outline area: "${domain.full}" → ${topic.name} (${topic.covers}).` : null,
      concept ? `- Concept: ${concept.term}: ${concept.short}` : null,
      `- My level: ${level}. My weakest areas so far: ${E.weakSummary(attempts)}.`,
    ];
    if (question && goal === "mistake") {
      context.push(
        `- Practice question: "${question.q}"`,
        `- Options: ${question.options.map((o, i) => `(${String.fromCharCode(65 + i)}) ${o}`).join(" ")}`,
        `- I chose: "${question.options[chosen]}". The correct answer is: "${question.options[question.answer]}".`
      );
    }
    if (goal === "coach") {
      const r = E.readiness(attempts);
      context.push(`- My readiness by exam domain: ${r.domains.map((d) => `${d.name} ${Math.round(d.score * 100)}% (exam weight ~${d.weight}%)`).join(", ")}.`);
      const cal = E.calibration(attempts);
      context.push(`- Confidence check: ${cal.sureWrong} confident mistakes and ${cal.guessRight} lucky guesses out of ${attempts.length} answers.`);
    }

    const tasks = {
      explain: `Explain ${subject} to me as if I'm new to cloud computing, then check that I understood.`,
      example: `Give me 3 different real-life examples from everyday African life that capture what ${subject} is and why it matters.`,
      compare: `Help me tell ${subject} apart from ${related.length ? related.join(", ") : "the concepts it is most often confused with"}.`,
      quiz: `Quiz me on ${subject} with 3 ORIGINAL multiple-choice questions, one at a time. Wait for my answer before revealing anything.`,
      mnemonic: `Help me remember ${subject} for the exam with a mnemonic and a very short story.`,
      mistake: `I answered this practice question wrong. Help me understand why, so I don't repeat the mistake.`,
      coach: `Act as my study coach. Using my readiness data, tell me what to focus on and give me a 7-day revision plan.`,
    };
    const formats = {
      explain: "1) One-sentence definition. 2) Simple explanation in 3–4 short sentences. 3) An African real-life analogy, and one sentence on where the analogy breaks down. 4) The most common exam trap. 5) One check-your-understanding question (put the answer at the very end).",
      example: "A numbered list. For each example: the everyday situation (1–2 sentences, from different countries), how it maps to the concept, and where the comparison stops working.",
      compare: "A comparison table with columns: What it is | When to use it | African analogy | Keyword clues in a question. Then a 3-line 'how to choose' rule.",
      quiz: "For each question: the question and options A–D. After my answer: right/wrong, why the correct option is right, and why each other option is wrong. Finish with my score and one thing to revise.",
      mnemonic: "The mnemonic, a story of under 80 words set in an African town, then a bullet list of the exact facts the story encodes.",
      mistake: "1) Why the correct answer is right. 2) Why my choice is wrong, and what it actually describes. 3) The keyword in the question that should have pointed me to the right answer. 4) A one-line memory hook. 5) One new, similar practice question for me to try (answer at the end).",
      coach: "1) My top 3 priorities and why (2 sentences each). 2) A day-by-day table for 7 days (30–60 minutes a day) with what to study and how to test myself. 3) One habit that will improve my confidence accuracy.",
    };

    return [
      { label: "Role", text: "You are a patient, accurate tutor helping an African learner prepare for the Microsoft Azure Fundamentals (AZ-900) certification exam." },
      { label: "Context", text: context.filter(Boolean).join("\n") },
      { label: "Task", text: tasks[goal] },
      {
        label: "Constraints",
        text: [
          "- Be accurate and use current Microsoft product names (for example, Microsoft Entra ID, not Azure AD). If a detail changes often (prices, limits, quotas), say so instead of guessing.",
          "- Use plain language and define any technical word you have to use.",
          "- Prefer examples from everyday African life (mobile money, matatus/danfos, markets, chamas, school fees season), but never claim facts about real companies' technology.",
          "- Do not reproduce real exam questions or braindump content; write original material only.",
          `- Respond in ${language}${language === "English" ? "" : ", but keep Azure product and service names in English"}.`,
          "- Keep it under 350 words unless the format below needs a table.",
        ].join("\n"),
      },
      { label: "Output format", text: formats[goal] },
    ];
  };

  E.promptText = (sections) => sections.map((s) => `## ${s.label}\n${s.text}`).join("\n\n");

  W.engine = E;
})(window.READY);
