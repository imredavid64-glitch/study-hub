# Study Hub — Project Documentation

**Version 1.1.0+** · Last updated: August 2026

Study Hub is a full-featured academic productivity platform: plan your work,
practice with spaced repetition, quiz yourself, and get AI help — all in one
installable app that runs in the browser, on the desktop (macOS / Windows /
Linux), and on phones (iOS / Android) without any app store.

> This document is the canonical reference. See also:
> - **[README.md](../README.md)** — quick start and feature tour
> - **[SECURITY.md](../SECURITY.md)** — data model, secrets inventory, XSS posture
> - **[docs/supabase-setup.md](supabase-setup.md)** — one-time cloud backend runbook

---

## Table of contents

1. [Purpose](#1-purpose)
2. [Target audience](#2-target-audience)
3. [Main features](#3-main-features)
4. [Architecture overview](#4-architecture-overview)
5. [Repository layout](#5-repository-layout)
6. [Installation & setup](#6-installation--setup)
7. [User manual](#7-user-manual)
8. [Configuration & environment](#8-configuration--environment)
9. [Deployment](#9-deployment)
10. [Testing & CI](#10-testing--ci)
11. [Desktop installers & auto-updates](#11-desktop-installers--auto-updates)
12. [Mobile builds (Capacitor)](#12-mobile-builds-capacitor)
13. [Cloud backend (Supabase)](#13-cloud-backend-supabase)
14. [AI integration](#14-ai-integration)
15. [Security model](#15-security-model)
16. [Accessibility](#16-accessibility)
17. [Keyboard shortcuts](#17-keyboard-shortcuts)
18. [Troubleshooting](#18-troubleshooting)
19. [References](#19-references)

---

## 1. Purpose

Study Hub exists to close the gap between **having study tools** and **actually
improving**. It combines planning, practice, spaced repetition, exam
intelligence, and an AI tutor that knows your data into one app.

The platform also contributes to **SDG 4 (Quality Education)** by making
free, research-based study tools available without requiring an app store,
a subscription, or a particular operating system.

Design principles:

- **Every feature works offline.** The AI proxy being unreachable never
  dead-ends a feature — each generator and tutor degrades to a built-in
  fallback (including a 25-topic offline knowledge base for the mind-map
  generator).
- **The AI knows your data.** The tutor is grounded in your notes,
  flashcards, assignments, calendar, quiz scores, and confusion log.
- **No app store required.** The same codebase ships as a PWA, an Electron
  desktop app, and Capacitor iOS/Android apps.

## 2. Target audience

| Audience | How they use it |
|---|---|
| **High school / college students** | Planner, Pomodoro sessions, flashcards, quizzes, mock exams, exam countdown intelligence |
| **Students with ADHD / autism** | ADHD mode, autism-adapted interface (clear language, step-by-step, visual, predictable, adjustable speech rate), focus timers |
| **Language learners** | Language labs, vocab flashcards, listening/reading generators, audio study mode |
| **Exam-preparation students** | Exam radar with per-subject predicted grades, at-risk auto-recovery, mock tests, walkthrough study plans |
| **Self-directed learners** | AI lessons, study guide generator, study planner generator, generators (mind map, film, image, concept model) |
| **Social learners** | Study mates (LearningFans collaboration), leaderboard, peer matching |
| **Teachers / tutors** | Essay rubric feedback helper, PDF chat, curriculum-organized subject labs |

## 3. Main features

The app is organized into **28 tabs**. Feature groups:

### Planning & organization
- **Dashboard** — mission card, next-15-minutes picker, predicted exam grade
  card, goal walkthrough cards, streak and XP counters, today's review queue.
- **Planner** — Kanban task board (todo / doing / done), goals with deadlines,
  automatic study plans, per-goal AI walkthroughs (6-step study guides with
  progress tracking and printable checklists).
- **Calendar** — events, deadlines, exam countdown intelligence.
- **Assignments** — tracking with grade forecasts, graded-assignment blending
  into exam predictions.

### Practice & memory
- **Flashcards** — spaced-repetition scheduler (interval + due dates), deck
  filters, rating (again/hard/good/easy), AI deck generation, explain-then-
  verify mode.
- **Quizzes** — per-subject banks, AI-generated quizzes, auto-grading,
  confusion logging on wrong answers.
- **Mock tests** — timed mock exams with countdown, score + history.
- **Recalls** — active-recall prompt generation, blurt training with a timer,
  score analysis, explain-it-back voice grading (speech recognition).
- **Sessions** — Pomodoro timer (focus/break minutes), deep work logging,
  focus audio (white noise / lofi / nature), warm-up games (arithmetic,
  voice reading, memory addition, word jumble).

### Knowledge & creation
- **Notes** — 7 note styles (basic, outline, Cornell, mapping, charting,
  boxing, sentence), live markdown preview, tags, search.
- **Study Guide generator** — AI study guides (quick/standard/deep).
- **Study Planner generator** — AI study plans from subject, topics, days,
  hours/day.
- **Generators tab** — mind map (draggable, clickable), educational micro-
  film maker (Pollinations visuals + TTS narration), image generator
  (Wikimedia Commons + Pollinations), concept model builder, content
  generator (quiz + flashcards).
- **Subject labs** — interactive labs per subject: physics, chemistry, and
  biology simulations, math, history timelines, English vocab, language
  listening/reading, tech coding environments.
- **AI Subject Tutor** (Subjects tab) — a per-subject AI tutor that follows
  the active subject tab, grounds answers in the user's own notes and
  flashcards for that subject, and degrades to offline topic explanations.

### AI & coaching
- **AI Tutor** — chat grounded in the user's notes, flashcards, assignments,
  calendar, quiz scores, and due flashcards; can create planner tasks and
  calendar events from the conversation with a confirm button.
- **AI Lessons** — structured lessons.
- **Study Coach** — daily reflections, exam-strategy questions, insights.
- **AI Voice** — speech recognition for voice input / explain-it-back.
- **PDF Chat** — ask questions about uploaded documents.

### Social & collaboration (LearningFans)
- **Study mates** — opt-in matching on shared subjects via `/api/mates`;
  cross-app collaboration with the LearningFans platform (paste your
  Study Hub ID there, or deep-link to a LearningFans space).
- **Leaderboard** — RLS-locked, only aggregated scores readable cross-user.
- **Social tab** — community links and spaces.

### Analytics & intelligence
- **Analytics** — charts, mastery, activity heatmaps, confusion heatmap,
  review queue, session quality.
- **Exam Grade Estimator** — blends quiz/mock scores (mocks weighted 1.5×),
  recency weighting, graded assignments, and recent confusion into a
  predicted letter grade with a confidence band; per-subject breakdown and
  an "aim for a target grade" selector.
- **Estimator vs Reality tracker** — records what the model predicted before
  each result; reports mean absolute error, within-band rate, and bias.
- **Self-calibration** — after 4+ tracked predictions the model measures its
  own bias and adjusts displayed estimates (recorded predictions stay raw so
  measurement stays honest).
- **Exam Radar** — per-exam predicted grades, at-risk warnings, and
  **auto-recovery**: at-risk subjects' confused topics are auto-enqueued
  into today's review queue (once per subject per day).

### Accessibility & customization
- 10 themes + custom color picker, dark mode, density (compact/comfortable/
  roomy), font, radius, power mode, layout switch, session memory.
- **Autism-adapted interface** — clear language, step-by-step, visual,
  predictable, adjustable speech rate.
- **Command palette** (Ctrl/Cmd+K) — search every tab, note, flashcard,
  task, and goal, plus quick actions; **undo-able deletes** for tasks/notes.
- **System health check** in Settings (6 checks: Local Storage, Groq AI,
  Supabase, Chart.js, pdf.js, Speech Recognition), data export/import,
  delete-data option, judge mode (demo data) with exit option.

### Install & update
- **Downloads tab** — live listing of the latest release installers for
  macOS / Windows / Linux and PWA checksums.
- **In-app auto-updater** — one-click update with sha256 verification,
  retry, verify-install, and periodic polling (Electron desktop builds).

## 4. Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│  Clients                                                     │
│   Browser PWA   Electron desktop   Capacitor iOS/Android     │
└───────────────┬─────────────────────────────────────────────┘
                │  same index.html + app.js + styles.css
┌───────────────▼─────────────────────────────────────────────┐
│  Frontend (vanilla JS SPA, no build step)                    │
│   index.html        — shell, 28 tab panels                   │
│   app.js            — state, rendering, features, AI client  │
│   styles.css        — design system + themes (1467+ rules)   │
│   cloud-core.js     — Supabase client, sync manager, events  │
│   mobile.js         — touch/swipe adaptations, Capacitor glue│
│   studymap-data.js  — study map dataset                      │
│   subject-labs.js   — interactive science/tech labs          │
└───────────────┬─────────────────────────────────────────────┘
                │  fetch (same-origin)
┌───────────────▼─────────────────────────────────────────────┐
│  Serverless API (Vercel)                                     │
│   /api/groq      — AI chat proxy (Groq) + rate limiting      │
│   /api/mates     — study-mate matcher (Supabase service key) │
│   /api/config    — runtime feature/config endpoint           │
└───────────────┬─────────────────────────────────────────────┘
                │
        ┌───────▼───────┐      ┌──────────────────────────┐
        │  Supabase     │      │  Groq API (LLM provider) │
        │  auth + RLS   │      └──────────────────────────┘
        │  tables       │
        └───────────────┘
```

**State management**: a single `state` object is hydrated from
`localStorage`, mutated by feature handlers, and persisted via `saveState()`.
Cloud sync (opt-in) mirrors snapshots and events to Supabase with conflict
resolution.

**AI flow**: `groqChat()` first calls the same-origin `/api/groq` proxy
(server-side key — never shipped to the client). If that fails, it falls
back to a per-user Groq key the user can paste in **Settings → Cloud Sync &
Privacy** (stored only on that device). If neither exists, features degrade
to offline templates and the built-in knowledge base.

**Electron desktop**: `electron-main.js` + `electron-menu.js` +
`electron-preload.js` + `electron-window-state.js` +
`electron-updater-core.js` + `scripts/apply-update.js` provide native
windows (multi-window with per-window tab memory and titles), a native
Layout menu, window-position memory, and the sha256-verified auto-updater.

## 5. Repository layout

```
Study Hub/
├── index.html                Main application shell (28 tab panels)
├── app.js                    Core application logic (~600 KB)
├── styles.css                Design system, themes, responsive layout
├── cloud-core.js             Supabase client, sync, events, analytics
├── mobile.js                 Mobile adaptations + Capacitor glue
├── studymap-data.js          Study map dataset
├── subject-labs.js           Interactive subject labs
├── build.js                  Build validation script
├── sw.js                     Service worker (PWA offline)
├── manifest.webmanifest      PWA manifest (installable, no app store)
├── package.json              Metadata, scripts, Electron/Capacitor config
├── electron-main.js          Desktop main process
├── electron-menu.js          Native application menu + layout sync
├── electron-preload.js       Secure preload bridge (contextIsolation)
├── electron-window-state.js  Window position/session memory
├── electron-updater-core.js  sha256 + asset-picking helpers (pure)
├── capacitor.config.json     Capacitor mobile config
├── api/                      Serverless functions (Vercel)
│   ├── groq.js               AI chat proxy + rate limiting
│   ├── mates.js              Study-mate matcher
│   └── config.js             Runtime config endpoint
├── lib/guard.js              Rate-limit + origin-allowlist guard
├── supabase-migration.sql    Full Supabase schema (RLS-enforced)
├── supabase/migrations/      Incremental migrations
├── scripts/                  Tests + QA tooling (see §10)
├── docs/                     Documentation
│   ├── PROJECT_DOCUMENTATION.md  (this file)
│   └── supabase-setup.md         Cloud backend runbook
├── .github/workflows/        CI checks + release installer builds
├── ios/ android/             Capacitor platform folders
├── assets/ music/            Icons, audio, images
└── www/                      Mobile build output (generated)
```

## 6. Installation & setup

### 6.1 Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (PWA install
  works on all of them).
- **Node.js 18+** and npm for local development, testing, and building.
- **Internet** for cloud sync, AI, and the study-mates network.
- **Microphone** for voice input / explain-it-back; **camera** for the
  scanning features.

### 6.2 Run locally (browser)

```bash
git clone https://github.com/imredavid64-glitch/study-hub.git
cd "Study Hub"
npm install

# Option A — open directly
open index.html

# Option B — static server (recommended; lets /api calls be added later)
python3 -m http.server 8080
# visit http://localhost:8080
```

> Note: opening via `file://` works for core features; AI and cloud need
> the deployed backend (see §8) or a per-user Groq key in Settings.

### 6.3 Desktop (macOS / Windows / Linux)

```bash
npm install

# Development run (Electron)
npm start

# Build installers
npm run desktop:build        # macOS (universal)
npm run desktop:build-win    # Windows x64
npm run desktop:build-linux  # Linux x64
# or with electron-builder (dmg/zip, nsis/zip, AppImage/deb)
npx electron-builder --mac dmg zip
npx electron-builder --win nsis zip
npx electron-builder --linux AppImage deb
```

Installers land in `release/`. Prebuilt installers are also available in
the app's **Downloads** tab (published from the GitHub release workflow).

### 6.4 Mobile (iOS / Android via Capacitor)

```bash
npm install
npm run cap:ios      # builds www/, syncs, opens Xcode
npm run cap:android  # builds www/, syncs, opens Android Studio
```

The generated apps run the same web code with native shells — no app store
required; you can side-load or distribute via your own channels.

### 6.5 First-run experience

1. On first launch you get a short **onboarding** flow (learning style,
   profile, study goals) and the **landing overlay**.
2. **Fresh start by default**: new installs boot with empty data — no demo
   content, no fabricated community feed or leaderboard. The dashboard shows
   honest empty states that guide you to create your first goal, task,
   flashcard, or note.
3. **Load Demo Data** (topbar button) is the *only* way to load the sample
   environment; while it's active a banner offers **Exit Demo** to return to
   a clean slate (also in Settings).
4. Optional: enable cloud sync in **Settings → Cloud Sync & Privacy**
   (requires the backend; see §13).

## 7. User manual

### 7.1 Dashboard
- **Mission card** — today's most valuable next action.
- **Next 15 minutes** — one-click suggestions of the highest-impact task.
- **Predicted Exam Grade** — the estimator's live forecast for your nearest
  exam subject, with a "to lift this grade" gap analysis.
- **Goal walkthroughs** — click any goal to generate a full AI study plan
  (6 steps: survey → key concepts → practice → review → mock → final
  review), track progress, and print a checklist.
- **Today's review queue** — auto-populated from confusion and exam-risk.

### 7.2 Planner
- Add tasks with due dates and subjects; drag between **todo / doing /
  done** columns (or use the move buttons); delete with **Undo**.
- Create **goals** with deadlines; the planner auto-schedules daily study
  load and can generate an AI study plan.
- **Smart exam countdown planner** — per-day study blocks leading into
  exams, with behind-on-topic nudges.

### 7.3 Sessions & timer
- Set focus/break minutes; **Start** begins the Pomodoro; timer notifications
  are configurable. Sessions are logged and feed analytics.

### 7.4 Flashcards
- Create cards manually or generate a deck with AI (**Load Starter Deck** /
  AI deck generator).
- Study due cards with the **rate (1–5)** buttons; spaced repetition updates
  intervals automatically.
- Filter by deck; explain-then-verify mode asks you to explain before
  revealing the answer.

### 7.5 Quizzes / mock tests / recalls
- **Quizzes**: pick subject + difficulty + count → auto-graded; wrong answers
  are logged to the confusion log and the review queue.
- **Mock tests**: timed, exam-style; results feed the estimator.
- **Recalls**: generate prompts, answer aloud (or with the blurt timer),
  score yourself.

### 7.6 Notes
- Pick a note style, fill the fields, get a live preview. Tag and search.

### 7.7 AI tutor & study guide
- The tutor has context on **assignments, calendar events, quiz scores, and
  flashcards due today**.
- Ask it to **create planner tasks or calendar events** — it proposes them
  with a **confirm button** before anything is added.
- Study Guide / Planner generators build structured markdown you can read,
  regenerate, or print.

### 7.8 Generators
- **Mind map** — type a topic → draggable node map with explanations. Works
  with AI, or from the built-in 25-topic knowledge base offline.
- **Film maker** — a short educational micro-film: scenes with Pollinations
  visuals and spoken narration (TTS). Play/pause/next/prev, mute, regenerate
  scene images.
- **Image generator** — real photos from Wikimedia Commons, or AI images
  from Pollinations; choose count and mode.
- **Concept model** — a step-by-step working model of any concept with
  flow arrows.
- **Content generator** — quizzes + flashcards for any topic.

### 7.9 Study map, study room, calculator
- **Study map** — visual map of your subjects with clustered markers and
  popups.
- **Study room** — collaborative whiteboard (draw, shapes, clear).
- **Calculator** — basic, scientific (√, factorial, logs, trig), graphing,
  and unit converter modes.

### 7.10 Social / study mates
1. Go to **Social** → Study Mates.
2. Toggle **Make me findable** (opt-in; only name/subjects are exposed).
3. **Find study mates** — matches on shared subjects via `/api/mates`.
4. **LearningFans collaboration** — copy your **Study Hub ID**, paste it
   into LearningFans → Study Hub to link accounts, or join a LearningFans
   space to collaborate in real time.

### 7.11 Settings
- Profile, learning style, theme (10 presets + custom palette), dark mode,
  density, font, radius, layout, power mode.
- Timer preferences, notifications, ADHD mode, autism-adapted options.
- Cloud Sync & Privacy (sign in, sync status, per-user Groq key), export /
  import data, **delete all data**, exit judge mode.
- Shortcuts editor (per-tab keys), session memory toggle.
- **System health check** — 6 checks (local storage, Groq AI proxy,
  Supabase cloud, Chart.js, pdf.js, speech recognition).
- **Downloads** — latest installers + PWA checksums; desktop builds add
  **Verify Install** and **About** with a self-checksum.

## 8. Configuration & environment

### 8.1 Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Vercel env (`.env.local` locally) | Server-side key for `/api/groq`; never shipped to the client |
| `SUPABASE_SERVICE_KEY` | Vercel env | Service-role key for `/api/mates` (server-side only) |
| `SUPABASE_URL` | Vercel env | Supabase project URL (also hardcoded fallback in `api/config.js`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_ID` | Vercel env (optional) | Google sign-in / OAuth |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Vercel env (optional) | Durable, cross-instance rate limiting |
| `ALLOWED_ORIGINS` | Vercel env (optional) | Extra origins allowed by the API guard |
| `INSTALLERS_PAT` | GitHub Actions secret | PAT (Contents: write on the installers repo) so the release workflow can publish installers |
| `VERCEL_OIDC_TOKEN` | Vercel-generated | Used by the CLI; do not edit |

The Supabase **anon key** in `cloud-core.js` is public by design — RLS is
the security boundary (see §15).

### 8.2 Vercel configuration

`vercel.json` serves the static site from the repo root (`outputDirectory:
"."`, no build command). Serverless functions live in `api/` and are
deployed automatically.

### 8.3 Rate limiting

`lib/guard.js` enforces an origin allowlist and per-IP rate limits
(30 req/min, 400 req/day for `/api/groq`). Without Upstash it is
per-instance in-memory; with the Upstash env vars it is durable and shared
across instances.

## 9. Deployment

### 9.1 Vercel (production)

```bash
npx vercel --prod --yes
```

The canonical production domain is **https://study-hub-plum-omega.vercel.app**
(the `study-hub.vercel.app` name belongs to a different account/project).

### 9.2 Release process (installers + tags)

1. Commit and push to `main` → CI checks run (syntax, secret guard, unit
   tests, a11y guard, build validation, headless smoke test).
2. Tag a release: `git tag v1.1.x && git push origin v1.1.x` →
   the **Build desktop installers** workflow builds macOS (universal
   dmg/zip), Windows (zip), and Linux (AppImage/deb) and publishes them to
   the installers repo (requires `INSTALLERS_PAT`).
3. The in-app Downloads tab lists the new release automatically.

## 10. Testing & CI

### 10.1 Local test battery

```bash
npm test          # syntax checks + window-state + updater + estimator tests
node scripts/a11y-static.js   # static a11y + feature guard
node build.js     # build validation
npm run test:qa   # headless Electron smoke test (28 tabs, keyboard, menus)
```

- **`scripts/exam-estimator-test.js`** — 55 assertions on the estimator
  model, prediction stats, at-risk auto-recovery, calibration, and the
  offline topic knowledge base.
- **`scripts/qa-smoke.js`** — boots the app in Electron, sweeps all 28
  tabs, runs the a11y label guard, a 32-step keyboard focus walk, modal
  focus/escape tests, the native menu-driven layout test, multi-window
  tests, and the update-prompt flow.
- **`scripts/window-state-test.js`** / **`scripts/updater-test.js`** —
  window memory + sha256/asset-picking unit tests.

### 10.2 CI (`.github/workflows/ci.yml`)

On every push/PR to `main`:
1. Syntax-check all JS files
2. **Secret-leak guard** — fails if a tracked file contains known secret
   patterns (Groq/OpenAI keys, PATs, private keys, service-role JWTs)
3. `npm test`
4. Accessibility static guard
5. Build validation
6. Headless smoke test (xvfb + Electron)

## 11. Desktop installers & auto-updates

- **Build**: `electron-builder` / `electron-packager` produce per-OS
  installers; the release workflow matrix builds macOS universal, Windows
  x64, and Linux x64.
- **Updater**: the app polls GitHub releases for a newer version
  (`compareVersions`), shows an in-app banner, downloads the right asset,
  verifies its **sha256** (`sha256Hex`/`verifySha256` in
  `electron-updater-core.js`), applies the update (`scripts/apply-update.js`),
  and offers **Restart to Update**. Failures degrade to **Retry Update**;
  **Verify Install** in Settings confirms the installed app against the
  live build URL.
- **Window experience**: multi-window with per-window tab memory, layout
  titles ("Study Hub — Roomy ⚡"), native Layout menu (density radios +
  power mode), window-position memory, and a session-memory setting.

## 12. Mobile builds (Capacitor)

- `capacitor.config.json` targets iOS and Android with Capacitor 8.
- `mobile.js` adapts the UI for touch (swipes, bottom nav, larger targets)
  and bridges native APIs (haptics, local notifications).
- Build flow: `npm run build:mobile` copies the web assets into `www/`,
  then `npx cap sync` / `cap open ios|android`.
- The PWA (`manifest.webmanifest` + `sw.js`) also installs without an app
  store: **Add to Home Screen** on iOS/Android or the browser's install
  button.

## 13. Cloud backend (Supabase)

Schema (`supabase-migration.sql`, RLS-forced):

| Table | Purpose | RLS |
|---|---|---|
| `users` | Profile + identity | own row only (`auth.uid()`) |
| `user_state_snapshots` | Cloud sync snapshots | own rows only |
| `analytics_events` | Event tracking | own rows only |
| `leaderboard_entries` | Scores | write own, read all (aggregated) |
| `mate_profiles` | Opt-in study-mate profiles | own write; read via service key in `/api/mates` |

Setup requires 3 one-time steps (enable anonymous sign-ins, run the RLS
migration, add `SUPABASE_SERVICE_KEY` in Vercel) plus optional durable rate
limiting and `INSTALLERS_PAT`. Full click-path runbook:
**[docs/supabase-setup.md](supabase-setup.md)**.

## 14. AI integration

- **Provider**: Groq (`llama-3.1-8b-instant` default; `llama-3.3-70b-*` /
  `llama-3.1-70b-versatile` allowed). Models are allowlisted server-side.
- **Proxy**: `/api/groq` enforces model allowlist, token caps (≤8192),
  message caps (≤30, ≤12k chars each), origin allowlist, and rate limits.
- **Client**: `groqChat(messages, opts)` in `app.js`; used by the tutor,
  quiz/mock generators, flashcard generators, study guide/plan generators,
  recall grading, explain-it-back, mind map, film, model, and content
  generators.
- **Offline fallbacks**: every AI feature has a deterministic fallback —
  `offlineExplain`, `offlineQuiz`, `offlineMockTest`, `offlineMindMapText`,
  `offlineWalkthroughGuide`, the `TOPIC_KB` knowledge base, and template
  generators — so nothing dead-ends.
- **The user's own key**: Settings → Cloud Sync & Privacy lets users paste
  their own Groq key for local/desktop builds (device-local only).

## 15. Security model

See **[SECURITY.md](../SECURITY.md)** for full details. Highlights:

- **Identity & RLS**: Supabase Auth anonymous sign-ins; every table has
  `FORCE ROW LEVEL SECURITY` with `auth.uid()`-scoped policies. If auth is
  unavailable the app runs local-only rather than unsafely.
- **No client secrets**: Groq key lives server-side; the only cross-user
  readable data is the opt-in `mate_profiles` table, served by `/api/mates`
  with the service key and returned as name/subjects only.
- **XSS posture**: all user/AI content escaped before DOM insertion;
  markdown renders escaped; the graph parser is a strict whitelist
  (`safeEvalMath`), no `new Function`; postMessage OAuth verifies origin;
  Electron denies navigation away and opens external links in the system
  browser.
- **CI secret guard** prevents secret regressions from being committed.

## 16. Accessibility

- Skip-to-content link; visible `:focus-visible` rings with configurable
  tokens.
- Keyboard walk: 32 focused controls verified; modal focus traps with focus
  restore; reverse-tab tested.
- 28-tab keyboard shortcut editor; command palette (Ctrl/Cmd+K).
- Autism-adapted settings (clear language, step-by-step, visual,
  predictable, adjustable speech rate).
- Contrast-checked dark mode; density and font options.

## 17. Keyboard shortcuts

- **Ctrl/Cmd + K** — open the command palette (search tabs/content/actions).
- **Tab** — move through controls (first stop: skip link).
- In Flashcards: **Space/Enter** flip, **←/→** prev/next, **1/3/4/5** rate.
- Per-tab shortcuts are editable in **Settings → Shortcuts**.

## 18. Troubleshooting

| Symptom | Fix |
|---|---|
| "AI proxy unreachable and no custom key set" | Add your own Groq key in Settings → Cloud Sync & Privacy, or deploy the backend with `GROQ_API_KEY`. |
| Cloud sync shows local-only mode | Complete the Supabase setup runbook (`docs/supabase-setup.md`). |
| 403 on `/api/groq` | Rate limit hit (30/min, 400/day per IP) — wait, or add Upstash env for durable limits. |
| Mind map shows template labels | That's the offline fallback; the built-in KB covers 30 common topics. Online, AI produces full content. |
| Undo toast disappears | A later toast (e.g. cloud sync) re-attaches the Undo button — it stays available for 6s. |
| Installer not listed in Downloads | Release workflow needs `INSTALLERS_PAT`; check CI logs. |
| Health check fails a row | Follow the per-row hint (e.g. cloud row → Supabase setup; AI row → Groq key). |

## 19. References

- **Source**: https://github.com/imredavid64-glitch/study-hub
- **Live app**: https://study-hub-plum-omega.vercel.app
- **LearningFans collaboration**: https://learningfans-imredavid64-glitchs-projects.vercel.app
- **Supabase setup runbook**: [supabase-setup.md](supabase-setup.md)
- **Security**: [../SECURITY.md](../SECURITY.md)
- **SDG 4 (Quality Education)**: https://sdgs.un.org/goals/goal4
- **Study Map (reference project)**: https://github.com/StudentSuite/StudyMap
- **Groq API**: https://console.groq.com/docs
- **Electron**: https://www.electronjs.org/docs
- **Capacitor**: https://capacitorjs.com/docs
- **Supabase RLS**: https://supabase.com/docs/guides/database/postgres/row-level-security

---

*Study Hub — Plan smarter. Practice deeper. Improve daily.*
