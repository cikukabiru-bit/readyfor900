# Prompt engineering in Readyfor900

> Note: the app's working title during the build was **Wingu900** (*wingu* = cloud in Kiswahili). The files in [`/prompts`](prompts/) are kept exactly as they were used, so they still use that name. It was renamed **Readyfor900** before launch.

Prompts show up in Readyfor900 in two places:

1. **Building it:** prompts used with Claude to design the app and write the study content.
2. **Inside it:** the app engineers prompts *for the learner*, using their own progress data, so any AI assistant becomes a personal AZ-900 tutor.

---

## 1. Prompts used to build Readyfor900

### 1a. The product brief
The build started from the hackathon brief (all five challenge statements, the judging criteria and the rules: write original questions, use no Microsoft logos, label the tool as unofficial). Before any code was written, the decisions were:

- **Combine all five challenges into one connected loop** instead of five separate tools: quiz mistakes feed the flashcards, quiz results feed the readiness score, and readiness feeds the planner and the AI prompts.
- **Ground everything in the official, public skills outline** (Microsoft Learn study guide, *skills measured as of July 20, 2026*), fetched first so the topic list and weights are current.
- **No API keys.** The app must run free on GitHub Pages, so the "AI" is prompt engineering the learner can take to any assistant (see section 2).
- **Plain HTML/CSS/JavaScript**, so the code is readable by fellow learners.

### 1b. Content prompts (in [`/prompts`](prompts/))
The study content was generated with three structured prompts, run in parallel, then checked by a validator and a review pass:

| File | Purpose | Key techniques |
|---|---|---|
| [`01-content-brief.md`](prompts/01-content-brief.md) | Shared rules + fact sheet for every writer | Hard rules (originality, current product names, "if unsure, leave it out"), topic IDs mapped to the outline, **accuracy notes** that pin down commonly confused facts (LRS/ZRS/GRS, lock types, VPN vs ExpressRoute…), and African-context rules (only real Azure regions in Africa; no claims about real companies' tech) |
| [`02-question-writer.md`](prompts/02-question-writer.md) | Practice questions with an explanation for every option | Exact counts per topic (mirrors exam weights), coverage requirement, Bloom-style level mix, distractor guidance, strict schema, self-review pass, "report what you left out" |
| [`03-concept-writer.md`](prompts/03-concept-writer.md) | Flashcards + Study Buddy (simple, African example, Kiswahili, exam tip) | Audience-level constraint ("explain like I'm new"), split confusable concepts, natural rather than literal Kiswahili, related-concept links |

**Guardrails that made the output trustworthy:**
- `tools/validate-content.js` checks every item: valid answer index, an explanation for every wrong option, no "all of the above" (options are shuffled), no duplicate IDs, and that related links resolve.
- The writers had to list facts they weren't sure of. Those were left out rather than guessed (e.g. Data Box capacities, SLA credits).
- A review pass checked every question and concept against the outline before release. Kiswahili feedback from native speakers is welcome through GitHub issues.

---

## 2. Prompts Readyfor900 builds for learners

Every "Ask AI" button in the app opens the **prompt builder**. It shows the prompt split into five colour-coded parts, so learners also *learn how to prompt*:

| Part | What goes in | Why it matters |
|---|---|---|
| **Role** | "a patient, accurate tutor helping an African learner prepare for AZ-900" | Sets tone, audience and goal |
| **Context** | Skills-outline area and topic, the concept's definition, the learner's level, **their 3 weakest topics from real quiz data**, and (for mistakes) the exact question, options, their answer and the correct answer | Personalised, grounded answers instead of generic ones |
| **Task** | One of 7 goals: explain simply · African examples · compare with look-alikes · quiz me · memorise it · explain my mistake · coach me | One clear job per prompt |
| **Constraints** | Use current Microsoft names, say so when facts change often, plain language, African everyday examples (no invented company facts), no exam dumps, **respond in the learner's chosen language** (14 options incl. Kiswahili, Hausa, Yoruba, Amharic, isiZulu, Sheng), keep product names in English, word limit | Accuracy, safety and accessibility |
| **Output format** | A specific structure per goal (e.g. "1) why the correct answer is right 2) why my choice is wrong 3) the keyword I missed 4) memory hook 5) a new similar question") | Answers are scannable and consistent |

### Example: "Explain my mistake" (generated from a real quiz answer)
```
## Role
You are a patient, accurate tutor helping an African learner prepare for the Microsoft Azure Fundamentals (AZ-900) certification exam.

## Context
- Exam: Microsoft Azure Fundamentals (AZ-900). I'm using an unofficial study app.
- Skills-outline area: "Describe Azure architecture and services" → Compute & networking (VMs, scale sets, containers, Functions, App Service, VNets, VPN Gateway, ExpressRoute, endpoints).
- Concept: Azure Virtual Desktop: A cloud service that delivers full Windows desktops and apps from Azure to users on almost any device, wherever they are.
- My level: beginner. My weakest areas so far: Storage (15% mastery); Governance & compliance (30% mastery); Identity, access & security (31% mastery).
- Practice question: "Which Azure service delivers full Windows desktops and apps from the cloud, so users can work from almost any device?"
- Options: (A) Azure Functions (B) Azure Virtual Machine Scale Sets (C) Azure App Service (D) Azure Virtual Desktop
- I chose: "Azure Functions". The correct answer is: "Azure Virtual Desktop".

## Task
I answered this practice question wrong. Help me understand why, so I don't repeat the mistake.

## Constraints
- Be accurate and use current Microsoft product names (for example, Microsoft Entra ID, not Azure AD). If a detail changes often (prices, limits, quotas), say so instead of guessing.
- Use plain language and define any technical word you have to use.
- Prefer examples from everyday African life (mobile money, matatus/danfos, markets, chamas, school fees season), but never claim facts about real companies' technology.
- Do not reproduce real exam questions or braindump content; write original material only.
- Respond in Kiswahili, but keep Azure product and service names in English.
- Keep it under 350 words unless the format below needs a table.

## Output format
1) Why the correct answer is right. 2) Why my choice is wrong, and what it actually describes. 3) The keyword in the question that should have pointed me to the right answer. 4) A one-line memory hook. 5) One new, similar practice question for me to try (answer at the end).
```

### The "Coach me" prompt uses the whole dashboard
From the Readiness page, the coaching prompt adds the learner's score per exam domain (with exam weights) and their **confidence calibration** (confident mistakes vs lucky guesses). It then asks for 3 priorities, a 7-day table and one habit to improve. The AI receives real data, so its plan is specific to that learner.

### Why prompts instead of an embedded chatbot?
- **Free and private:** no API keys, no server, no learner data leaves the browser unless the learner chooses to paste it.
- **Works with any assistant:** Claude, ChatGPT and Copilot all accept the same prompt (one click opens Claude or ChatGPT with it pre-filled).
- **Teaches a skill:** learners see *why* a good prompt works, which is useful well beyond AZ-900.
- **Honest:** every prompt reminds learners to double-check AI answers against Microsoft Learn.
