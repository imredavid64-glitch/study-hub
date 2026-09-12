# Study Hub — Post-Launch Feature Roadmap

## Version 1.2.x — Social & Collaboration (Q3 2026)

### Core Social Features
- [ ] **Study Groups** — Create/join persistent groups with shared resources, group chat, and collective analytics
- [ ] **Real-time Collaboration** — WebRTC-based co-editing for notes, flashcards, and study guides (Yjs or Automerge)
- [ ] **Shared Sessions** — Synchronized Pomodoro timer across group members with presence indicators
- [ ] **Peer Review** — Flashcard/note review swaps with rating system

### LearningFans Integration (Deeper)
- [ ] **Cross-platform Identity** — OAuth link between Study Hub ↔ LearningFans
- [ ] **Shared Spaces** — Embed LearningFans spaces directly in Study Hub tabs
- [ ] **Unified Notifications** — Single inbox for both platforms
- [ ] **Collaborative Leaderboards** — Group vs group competitions

---

## Version 1.3.x — Intelligence & Personalization (Q4 2026)

### Adaptive Learning Engine
- [ ] **Knowledge Graph** — Build personal concept dependency graph from notes/flashcards/quiz data
- [ ] **Optimal Review Scheduler** — ML-based spacing (beyond SM-2) using individual forgetting curves
- [ ] **Weakness Prediction** — Predict topics you'll struggle with before you encounter them
- [ ] **Study Efficiency Scoring** — Per-session quality score based on focus, retention, confusion

### Advanced AI Tutor
- [ ] **Multi-modal Tutoring** — Vision (diagram analysis) + Audio (pronunciation) + Text
- [ ] **Socratic Mode** — Pure questioning, never gives answers directly
- [ ] **Exam Simulation** — Full mock exam with AI grading + detailed feedback
- [ ] **Learning Style Adaptation** — Auto-adjust explanation depth/format per user

### Predictive Analytics
- [ ] **Grade Trajectory** — Monte Carlo simulation of final grades based on current pace
- [ ] **Intervention Alerts** — "You're 15% behind on Bio — here's a 3-day catch-up plan"
- [ ] **Capacity Planning** — "You have 12h this week; optimal allocation: 4h Chem, 3h Math, 2h review..."

---

## Version 1.4.x — Platform Expansion (Q1 2027)

### Mobile-First Features
- [ ] **Offline-First Sync** — Full CRUD offline with conflict-free merge (Automerge/CRDT)
- [ ] **Widget/Complication** — iOS Lock Screen / Android widget for next task, streak, timer
- [ ] **Shortcuts/Intent** — "Hey Siri, start a 25-min focus session"
- [ ] **AR Study Mode** — Camera-based flashcard scanning, 3D concept models

### Desktop Power User
- [ ] **Global Hotkeys** — System-wide shortcuts (capture note, start timer, quick search)
- [ ] **Menu Bar / Tray App** — Always-accessible mini controller
- [ ] **Multi-Monitor Layouts** — Persistent window arrangements per workflow
- [ ] **Plugin System** — User scripts for custom generators, importers, analyzers

### Web Platform
- [ ] **Chrome Extension** — Right-click → "Add to Study Hub" (selection, page, PDF)
- [ ] **Notion/Obsidian/Anki Import** — One-click migration wizards
- [ ] **Public Sharing** — Publish notes/study-guides as public pages with SEO
- [ ] **Embeddable Widgets** — Flashcard reviewer for personal sites/Notion

---

## Version 1.5.x — Ecosystem & Monetization (Q2 2027)

### Marketplace
- [ ] **Template Gallery** — Community study plans, flashcard decks, note templates
- [ ] **Expert Content** — Verified educator packs (MCAT, USMLE, CFA, language exams)
- [ ] **Creator Tools** — Build and sell study packs; revenue split

### Institutional
- [ ] **Classroom Mode** — Teacher dashboard: assign decks, view cohort analytics, LMS sync
- [ ] **LTI Integration** — Canvas, Moodle, Blackboard, Google Classroom
- [ ] **Admin Console** — Org-wide settings, SSO, analytics, billing

### Sustainability
- [ ] **Supporter Tier** — Cosmetic themes, early access, priority support
- [ ] **Team/Org Plans** — Shared billing, admin controls, advanced analytics
- [ ] **API Access** — Webhook events, data export, custom integrations

---

## Technical Debt & Infrastructure (Ongoing)

| Area | Priority | Tasks |
|------|----------|-------|
| **Testing** | High | E2E (Playwright), visual regression, load test API |
| **Observability** | High | Structured logging, error tracking (Sentry), custom dashboards |
| **Performance** | Medium | Code-split app.js, lazy-load tabs, WASM for heavy compute |
| **Security** | Ongoing | Pen test, dependency audit, CSP hardening, passkey auth |
| **Accessibility** | Ongoing | Screen reader testing, WCAG 2.2 AAA, voice control |
| **i18n** | Medium | i18n framework, community translations (start: ES, FR, DE, JA) |

---

## Idea Parking Lot (Unprioritized)

- **Spaced Repetition for Concepts** — Not just cards, but entire concept mastery tracking
- **Sleep/Lifestyle Correlation** — Optional health data import → study efficiency correlation
- **Gamification Layer** — Achievements, streaks, cosmetic unlocks, study "pets"
- **Voice-First Mode** — Entire app navigable by voice for accessibility/hands-free
- **Collaborative Mind Maps** — Real-time multi-user concept mapping
- **AI-Generated Courses** — Full curriculum from "I want to learn X in 8 weeks"
- **Physical Flashcard Printing** — Export formatted for print-and-cut
- **Pomodoro Music Marketplace** — Community focus playlists with bpm/energy metadata

---

## Release Cadence

| Cycle | Duration | Focus |
|-------|----------|-------|
| **Major** | 8-10 weeks | New feature pillars (Social, Intelligence, Platform) |
| **Minor** | 2-3 weeks | Feature completion, polish, bug fixes |
| **Patch** | As needed | Security, critical bugs, config updates |

---

## Success Metrics (Post-Launch)

| Metric | Target (3mo) | Target (12mo) |
|--------|--------------|---------------|
| Weekly Active Users | 1,000 | 15,000 |
| Cloud Sync Adoption | 40% | 70% |
| AI Feature Usage | 25% of sessions | 50% of sessions |
| Mobile Install Rate | 15% of web users | 35% of web users |
| Day-30 Retention | 25% | 40% |
| NPS | >30 | >50 |

---

## Decision Framework for New Features

**Must have:**
1. Works offline-first
2. Respects privacy (local-first, opt-in cloud)
3. Accessible by default
4. Degrades gracefully without AI/backend
5. Fits in existing tab/navigation paradigm

**Nice to have:**
- Leverages existing data (notes, flashcards, sessions)
- Enables social/peer learning
- Generates shareable artifacts
- Has clear "learning science" justification

---

*Last updated: September 2026 — Post v1.1.9 launch*
*Next review: Sprint planning for v1.2.0*