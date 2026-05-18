# Wadood — Progress Tracker

**Tasks assigned:** 14 &nbsp;|&nbsp; **Completed:** 14 / 14

> Update this file when you finish a task. Change `[ ]` to `[x]` and fill in the completion date.
> Full task descriptions are in [TASKS.md](./TASKS.md).

---

## Phase 1 — Foundation & Setup

- [x] **T1** — Create folder structure (`models/`, `routes/`, `controllers/`, `middleware/`, `services/`) &nbsp;·&nbsp; _Completed: 2026-05-08_
- [x] **T2** — Wire MongoDB Atlas connection via Mongoose in `server.js` &nbsp;·&nbsp; _Completed: 2026-05-08_

---

## Phase 2 — Database Models

- [x] **T5** — User model (`models/User.js`) &nbsp;·&nbsp; _Completed: 2026-05-16_
- [x] **T6** — Course model (`models/Course.js`) &nbsp;·&nbsp; _Completed: 2026-05-16_
- [x] **T7** — Document model (`models/Document.js`) &nbsp;·&nbsp; _Completed: 2026-05-16_
- [x] **T8** — Task model (`models/Task.js`) &nbsp;·&nbsp; _Completed: 2026-05-16_
- [x] **T9** — StudyPlan model (`models/StudyPlan.js`) &nbsp;·&nbsp; _Completed: 2026-05-16_

---

## Phase 5 — AI Integration

- [x] **T18** — Gemini client setup (`gemeniClient.js`) &nbsp;·&nbsp; _Completed: 2026-05-17_
- [x] **T19** — Text extraction service (`services/extractionService.js`, pdf-parse + mammoth) &nbsp;·&nbsp; _Completed: 2026-05-17_
- [x] **T20** — AI task extraction function (`ai_funcs.js` — `extractTasksFromText`) &nbsp;·&nbsp; _Completed: 2026-05-17_
- [x] **T21** — `POST /documents/:id/process` endpoint &nbsp;·&nbsp; _Completed: 2026-05-17_
- [x] **T22** — AI study plan generation function (`ai_funcs.js` — `generateStudyPlan`) &nbsp;·&nbsp; _Completed: 2026-05-17_
- [x] **T23** — `POST /courses/:courseId/study-plan/generate` endpoint &nbsp;·&nbsp; _Completed: 2026-05-17_

---

## Phase 6 — Integration & Polish

- [x] **T24** — Mount all routers in `server.js` under `/api` base path &nbsp;·&nbsp; _Completed: 2026-05-17_

---

## Summary

| Phase | Done | Total |
|-------|------|-------|
| Phase 1 — Foundation | 2 | 2 |
| Phase 2 — Models | 5 | 5 |
| Phase 5 — AI Integration | 6 | 6 |
| Phase 6 — Polish | 1 | 1 |
| **Total** | **14** | **14** |
