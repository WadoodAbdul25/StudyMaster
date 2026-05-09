# StudyMaster — Backend Tasks

**Total tasks:** 27 &nbsp;|&nbsp; **Wadood:** 14 &nbsp;|&nbsp; **Afnan:** 13

> Each task references its backend layer and the phase it belongs to in [BACKEND_PLAN.md](./BACKEND_PLAN.md).
>
> **When you finish a task, update your progress file:**
> - Wadood → [W_Prog.md](./W_Prog.md) — mark the task `[x]` and add the completion date
> - Afnan &nbsp; → [A_Prog.md](./A_Prog.md) — mark the task `[x]` and add the completion date

---

## Phase 1 — Foundation & Setup

| ID | Description | Layer | Owner |
|----|-------------|-------|-------|
| T1 | Create folder structure inside `study-master-backend/`: `models/`, `routes/`, `controllers/`, `middleware/`, `services/` | **CONFIG** · Phase 1 | Wadood |
| T2 | Wire MongoDB Atlas connection via Mongoose in `server.js`; log success/failure on startup | **CONFIG / MODELS** · Phase 1 | Wadood |
| T3 | Add `cors` middleware (allow `http://localhost:3000`) and a global error-handling middleware to `server.js` | **MIDDLEWARE** · Phase 1 | Afnan |
| T4 | Add `GEMINI_API_KEY` and `JWT_SECRET` to `.env`; document both keys with placeholder comments | **CONFIG** · Phase 1 | Afnan |

> **TEST CHECKPOINT 1 — After T4**
> - `npm run dev` → console shows `Server running on port 5000` and `MongoDB connected` with no errors
> - `GET http://localhost:5000/` → returns `"Server is running"`
> - Send a request with `Origin: http://localhost:3000` header → CORS headers present in response
> - Confirm `.env` has real (non-placeholder) values for `GEMINI_API_KEY` and `JWT_SECRET` before moving on

---

## Phase 2 — Database Models

| ID | Description | Layer | Owner |
|----|-------------|-------|-------|
| T5 | **User model** — `models/User.js`: fields `name`, `email` (unique), `passwordHash`, timestamps | **MODELS** · Phase 2 | Wadood |
| T6 | **Course model** — `models/Course.js`: fields `userId` (ref User), `name`, `courseCode`, `semester`, `description`, timestamps | **MODELS** · Phase 2 | Wadood |
| T7 | **Document model** — `models/Document.js`: fields `courseId` (ref Course), `userId` (ref User), `fileName`, `fileType` (enum: pdf/docx), `filePath`, `rawText`, `processedAt` (null default), timestamps | **MODELS** · Phase 2 | Wadood |
| T8 | **Task model** — `models/Task.js`: fields `courseId` (ref Course), `userId` (ref User), `title`, `type` (enum: assignment/exam/quiz/reading), `dueDate`, `description`, `priority` (enum: low/medium/high), `status` (enum: pending/complete, default pending), timestamps | **MODELS** · Phase 2 | Wadood |
| T9 | **StudyPlan model** — `models/StudyPlan.js`: fields `courseId` (ref Course, unique), `userId` (ref User), `taskIds` ([ref Task]), `aiRecommendations` (string), `generatedAt`, timestamps | **MODELS** · Phase 2 | Wadood |

---

## Phase 3 — Authentication

| ID | Description | Layer | Owner |
|----|-------------|-------|-------|
| T10 | `POST /auth/register` — validate fields, check email uniqueness, hash password with bcrypt, create User, return `{ token, user }` | **ROUTES / CONTROLLERS** · Phase 3 | Afnan |
| T11 | `POST /auth/login` — find user by email, compare bcrypt hash, return `{ token, user }`; 401 on bad credentials | **ROUTES / CONTROLLERS** · Phase 3 | Afnan |

> **TEST CHECKPOINT 2 — After T11** (register + login; middleware not yet built)
> - `POST /api/auth/register` with `{ name, email, password }` → `201` with `{ token, user }`
> - Same email again → `400` "email already taken"
> - Missing a required field → `400`
> - `POST /api/auth/login` with correct credentials → `200` with `{ token, user }`
> - Wrong password → `401` · Non-existent email → `401`
> - Save the returned token — it's required for all tests from here on

| T12 | `verifyToken` middleware — `middleware/verifyToken.js`: decode JWT from `Authorization: Bearer <token>`, attach `req.user`, return 401 if missing/invalid | **MIDDLEWARE** · Phase 3 | Afnan |
| T13 | `GET /users/me` (return profile), `PUT /users/me` (update name/email), `DELETE /users/me` (delete account + cascade delete all user data) | **ROUTES / CONTROLLERS** · Phase 3 | Afnan |

> **TEST CHECKPOINT 3 — After T13** (full auth layer including protected routes)
> - `GET /api/users/me` with valid `Authorization: Bearer <token>` → `200` user object
> - Same request with no token → `401`
> - Same request with a garbage token like `Bearer abc` → `401`
> - `PUT /api/users/me` `{ name: "New Name" }` → `200` updated user
> - `DELETE /api/users/me` → `200`; try logging in as that user again → `401` (account is gone)

---

## Phase 4 — Core API Routes

| ID | Description | Layer | Owner |
|----|-------------|-------|-------|
| T14 | **Course CRUD** — `GET /courses`, `POST /courses`, `GET /courses/:id`, `PUT /courses/:id`, `DELETE /courses/:id`; DELETE cascades to Documents, Tasks, StudyPlan for that course | **ROUTES / CONTROLLERS** · Phase 4 | Afnan |
| T15 | **Document upload** — `POST /courses/:courseId/documents` using multer; accept PDF/DOCX only (400 otherwise); save file to `uploads/` folder; create Document record; return document object (no rawText) | **ROUTES / CONTROLLERS** · Phase 4 | Afnan |
| T16 | `GET /courses/:courseId/documents` (list all), `DELETE /documents/:id` (delete record + file from disk) | **ROUTES / CONTROLLERS** · Phase 4 | Afnan |
| T17 | **Task CRUD** — `GET /courses/:courseId/tasks` (with optional `?status=` / `?type=` filters), `POST /courses/:courseId/tasks` (manual create), `PUT /tasks/:id` (update any field), `DELETE /tasks/:id` | **ROUTES / CONTROLLERS** · Phase 4 | Afnan |

> **TEST CHECKPOINT 4 — After T17** (entire CRUD surface before any AI work; use Postman)
>
> **Courses:** Create a course → list it → get by ID → update a field → confirm a second user can't access it (`403`/`404`)
>
> **Documents:** Upload a real PDF → `201` with document record; upload a `.txt` file → `400`; list documents for the course → file appears; delete it → confirm file gone from `uploads/` on disk
>
> **Tasks:** Manually create a task → appears in list; use `?status=pending` filter → task shows; use `?status=complete` → empty; mark task complete via `PUT` → re-run `?status=complete` → now appears
>
> **Cascade:** `DELETE /api/courses/:id` → confirm that course's documents and tasks are also removed from MongoDB

---

## Phase 5 — AI Integration

| ID | Description | Layer | Owner |
|----|-------------|-------|-------|
| T18 | **Gemini client** — complete `gemeniClient.js`: initialize `@google/generative-ai` with `GEMINI_API_KEY`, export a configured model instance | **SERVICES** · Phase 5 | Wadood |
| T19 | **Text extraction service** — `services/extractionService.js`: `extractText(filePath, fileType)` → uses `pdf-parse` for PDFs and `mammoth` for DOCX; returns raw text string | **SERVICES** · Phase 5 | Wadood |
| T20 | **AI task extraction** — `ai_funcs.js`: `extractTasksFromText(rawText)` → sends prompt + text to Gemini, parses JSON response into array of `{ title, type, dueDate, description, priority }` objects | **SERVICES** · Phase 5 | Wadood |
| T21 | `POST /documents/:id/process` — call `extractText` then `extractTasksFromText`, bulk-insert Tasks into DB with `courseId`/`userId`, set `document.processedAt`; return `{ document, tasksCreated: N }`; 409 if already processed | **ROUTES / CONTROLLERS** · Phase 5 | Wadood |

> **TEST CHECKPOINT 5 — After T21** (document processing pipeline; use a real syllabus file)
> - Upload a real course syllabus PDF or DOCX to a course
> - `POST /api/documents/:id/process` → expect `{ document: { processedAt: "...", ... }, tasksCreated: N }` where **N > 0**
> - `GET /api/courses/:courseId/tasks` → extracted tasks appear with correct `title`, `type`, `dueDate`, `priority`
> - Check MongoDB Atlas directly — confirm `document.rawText` is populated and `processedAt` is set
> - `POST /api/documents/:id/process` again on the same doc → expect `409 Conflict`
> - Repeat with a DOCX file to confirm both parsers work (pdf-parse and mammoth)

| T22 | **AI study plan generation** — `ai_funcs.js`: `generateStudyPlan(tasks)` → formats task list into prompt, sends to Gemini, returns `aiRecommendations` string with timeline and strategy | **SERVICES** · Phase 5 | Wadood |
| T23 | `POST /courses/:courseId/study-plan/generate` — fetch all tasks for course, call `generateStudyPlan`, upsert StudyPlan document; return full plan; 400 if course has no tasks | **ROUTES / CONTROLLERS** · Phase 5 | Wadood |

> **TEST CHECKPOINT 6 — After T23** (full AI pipeline)
> - `POST /api/courses/:courseId/study-plan/generate` with tasks in DB → `201` with a non-empty `aiRecommendations` string that references actual task names/dates from your test data
> - Call it again → `201` again (upsert); confirm only **one** StudyPlan document per course in MongoDB
> - Call it on a course with zero tasks → `400`

---

## Phase 6 — Integration & Polish

| ID | Description | Layer | Owner |
|----|-------------|-------|-------|
| T24 | Mount all routers in `server.js` under `/api` base path (e.g., `app.use('/api/auth', authRouter)`, etc.) | **CONFIG / ROUTES** · Phase 6 | Wadood |
| T25 | `GET /courses/:courseId/study-plan` — fetch existing StudyPlan for the course, populate `taskIds` with full task objects; 404 if none exists | **ROUTES / CONTROLLERS** · Phase 6 | Afnan |
| T26 | Audit all controllers: add input validation (required fields, enum values), ensure every error path returns `{ "error": "message" }` with the correct HTTP status code | **CONTROLLERS / MIDDLEWARE** · Phase 6 | Afnan |
| T27 | End-to-end manual test via Postman: `register → login → create course → upload doc → process doc → generate study plan → view study plan`; document any bugs found | **TESTING** · Phase 6 | Afnan |

---

## Summary by Owner

### Wadood (14 tasks)
T1, T2 — Foundation  
T5, T6, T7, T8, T9 — All database models  
T18, T19, T20, T21, T22, T23 — All AI & Gemini integration  
T24 — Router wiring

### Afnan (13 tasks)
T3, T4 — Foundation middleware & env  
T10, T11, T12, T13 — Full authentication layer  
T14, T15, T16, T17 — All core CRUD routes  
T25, T26, T27 — Study plan read, validation polish, E2E testing
