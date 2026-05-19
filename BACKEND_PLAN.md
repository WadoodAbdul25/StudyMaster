# StudyMaster — Backend Plan

**Stack:** Node.js · Express · MongoDB Atlas (Mongoose) · Google Gemini API · JWT · bcrypt · multer

**Base URL:** `http://localhost:5000/api`

---

## Phase 1 — Foundation & Setup
> Goal: Get a clean, production-ready Express skeleton with all middleware, folder structure, and database connection in place before any feature work begins.

**Tasks:** T1, T2, T3, T4

- Organize the backend into `models/`, `routes/`, `controllers/`, `middleware/`, and `services/` folders
- Connect Express to MongoDB Atlas via Mongoose
- Configure CORS (allow `http://localhost:3000`) and a global error handler
- Add missing environment variables: `GEMINI_API_KEY`, `JWT_SECRET`

> **TEST CHECKPOINT 1 — After T4**
> Run `npm run dev` and confirm:
> - Console prints `Server running on port 5000` and `MongoDB connected` (no errors)
> - `GET http://localhost:5000/` returns `"Server is running"`
> - Open DevTools Network tab or use curl with `Origin: http://localhost:3000` — confirm CORS headers are present on the response
> - Check `.env` has non-empty values for `GEMINI_API_KEY` and `JWT_SECRET` before moving on

---

## Phase 2 — Database Models
> Goal: Define all five Mongoose schemas that represent the core data of the app. Everything else is built on top of these.

**Tasks:** T5, T6, T7, T8, T9

| Model | Key Fields |
|-------|-----------|
| User | name, email, passwordHash, timestamps |
| Course | userId, name, courseCode, semester, description |
| Document | courseId, userId, fileName, fileType, filePath, rawText, processedAt |
| Task | courseId, userId, title, type, dueDate, priority, status |
| StudyPlan | courseId, userId, taskIds[], aiRecommendations, generatedAt |

---

## Phase 3 — Authentication
> Goal: Secure the API with JWT-based auth. Users must register and log in to get a token; all protected routes require that token.

**Tasks:** T10, T11, T12, T13

- `POST /auth/register` — hash password with bcrypt, issue JWT
- `POST /auth/login` — verify credentials, issue JWT
- `verifyToken` middleware — attach `req.user` from JWT, gate all `/api` routes
- `GET /users/me`, `PUT /users/me`, `DELETE /users/me` — profile management

> **TEST CHECKPOINT 2 — After T11** (register + login only, before middleware)
> Use Postman or Thunder Client:
> - `POST /api/auth/register` with `{ name, email, password }` → expect `201` with `{ token, user }` in response body
> - Repeat same email → expect `400` "email already taken"
> - `POST /api/auth/register` with a missing field (e.g. no password) → expect `400`
> - `POST /api/auth/login` with correct credentials → expect `200` with `{ token, user }`
> - `POST /api/auth/login` with wrong password → expect `401`
> - `POST /api/auth/login` with email that doesn't exist → expect `401`
> - Copy the returned JWT — you'll need it for every test from here on
>
> **TEST CHECKPOINT 3 — After T13** (full auth layer including protected routes)
> - `GET /api/users/me` with `Authorization: Bearer <token>` → expect `200` with user object
> - `GET /api/users/me` with no token → expect `401`
> - `GET /api/users/me` with a garbage token (e.g. `Bearer abc123`) → expect `401`
> - `PUT /api/users/me` with `{ name: "New Name" }` → expect `200` with updated user
> - `DELETE /api/users/me` → expect `200`; verify the user no longer exists by trying to log in again → expect `401`

---

## Phase 4 — Core API Routes
> Goal: Build the main CRUD surface for courses, documents, and tasks so the frontend can display and manage data before AI is wired in.

**Tasks:** T14, T15, T16, T17

- **Courses** — full CRUD (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`); DELETE cascades to documents/tasks/plan
- **Documents** — upload via multer (`POST /courses/:courseId/documents`, PDF/DOCX only); list and delete
- **Tasks** — list with optional `?status=` / `?type=` filters, manual create, update (mark complete, change priority), delete

> **TEST CHECKPOINT 4 — After T17** (entire CRUD surface, before any AI work)
> Re-register a fresh user and get a token, then run through this sequence in Postman:
>
> **Courses**
> - `POST /api/courses` → create a course, save the returned `_id`
> - `GET /api/courses` → list shows the new course
> - `GET /api/courses/:id` → returns single course
> - `PUT /api/courses/:id` with `{ description: "updated" }` → confirm field changed
> - Try `GET /api/courses/:id` with another user's token (register a second user) → expect `403` or `404`
>
> **Documents**
> - `POST /api/courses/:courseId/documents` (multipart/form-data, attach a real PDF) → expect `201`, file saved to `uploads/`
> - Same request with a `.txt` file → expect `400`
> - `GET /api/courses/:courseId/documents` → list shows the uploaded file
> - `DELETE /documents/:id` → expect `200`; confirm file is gone from `uploads/` on disk
>
> **Tasks**
> - `POST /api/courses/:courseId/tasks` with `{ title, type: "assignment", dueDate, priority: "high" }` → expect `201`
> - `GET /api/courses/:courseId/tasks` → task appears
> - `GET /api/courses/:courseId/tasks?status=pending` → same task appears; `?status=complete` → empty array
> - `PUT /api/tasks/:id` with `{ status: "complete" }` → expect `200`; re-run `?status=complete` filter → now appears
> - `DELETE /api/courses/:courseId` → confirm cascade: tasks and documents for that course are gone from DB

---

## Phase 5 — AI Integration
> Goal: Wire Google Gemini into the document processing and study plan generation flows — the core differentiator of the app.

**Tasks:** T18, T19, T20, T21, T22, T23

- Set up the Gemini API client (`gemeniClient.js`) using `@google/generative-ai`
- Extract raw text from uploaded files (pdf-parse for PDFs, mammoth for DOCX)
- Send raw text to Gemini → parse structured task array → bulk-create Tasks in DB
- `POST /documents/:id/process` — triggers the extraction pipeline; sets `processedAt`; returns `{ document, tasksCreated }`
- Send task list to Gemini → receive `aiRecommendations` string for the study timeline
- `POST /courses/:courseId/study-plan/generate` — upserts StudyPlan in DB; returns full plan

> **TEST CHECKPOINT 5 — After T21** (document processing pipeline, before study plan)
> You need a real course syllabus PDF or DOCX for this — something with dates, assignments, exams listed.
> - Upload the document to a course via `POST /api/courses/:courseId/documents`
> - `POST /api/documents/:id/process` → expect `200` with `{ document: { processedAt: "<timestamp>", ... }, tasksCreated: N }` where N > 0
> - `GET /api/courses/:courseId/tasks` → confirm the extracted tasks exist with correct `title`, `type`, `dueDate`, `priority` fields
> - Check MongoDB directly (Atlas UI or compass) — verify `document.rawText` is populated and `processedAt` is set
> - `POST /api/documents/:id/process` again on the same doc → expect `409 Conflict`
> - Upload a DOCX version of a syllabus and repeat to confirm both file types work
>
> **TEST CHECKPOINT 6 — After T23** (full AI pipeline complete)
> - `POST /api/courses/:courseId/study-plan/generate` with tasks in DB → expect `201` with `aiRecommendations` string (non-empty, sensible study advice)
> - `POST` same endpoint again → expect `201` again (upsert, not duplicate error); verify only one StudyPlan document per course in MongoDB
> - `POST` on a course with zero tasks → expect `400`
> - Inspect the `aiRecommendations` string — it should reference actual task titles/dates from your test data, not generic text

---

## Phase 6 — Integration & Polish
> Goal: Tie all routers into `server.js`, add the study plan read endpoint, enforce consistent validation/error shapes, and confirm the full user journey works end-to-end.

**Tasks:** T24, T25, T26, T27

- Mount all routers in `server.js` under `/api`
- `GET /courses/:courseId/study-plan` — fetch existing plan with populated task objects
- Standardize all error responses to `{ "error": "message" }` and add input validation across all controllers
- Full end-to-end Postman test: `register → login → create course → upload doc → process doc → generate study plan → view plan`

---

## Folder Structure Target

```
study-master-backend/
├── server.js
├── .env
├── gemeniClient.js
├── ai_funcs.js
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Document.js
│   ├── Task.js
│   └── StudyPlan.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── courses.js
│   ├── documents.js
│   ├── tasks.js
│   └── studyPlans.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── courseController.js
│   ├── documentController.js
│   ├── taskController.js
│   └── studyPlanController.js
├── middleware/
│   └── verifyToken.js
└── services/
    ├── geminiService.js
    └── extractionService.js
```

---

## Dependencies to Add

| Package | Purpose |
|---------|---------|
| `@google/generative-ai` | Gemini API client |
| `jsonwebtoken` | JWT sign/verify |
| `bcryptjs` | Password hashing |
| `multer` | File upload handling |
| `pdf-parse` | Extract text from PDFs |
| `mammoth` | Extract text from DOCX |
| `cors` | CORS middleware |
