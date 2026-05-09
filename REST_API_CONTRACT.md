# StudyMaster — REST API Contract

**Base URL:** `http://localhost:5000/api`

**Auth:** Protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

---

## Data Schemas

### User
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "ISO date"
}
```

### Course
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "string",
  "courseCode": "string",
  "semester": "string",
  "description": "string",
  "createdAt": "ISO date"
}
```

### Document
```json
{
  "_id": "ObjectId",
  "courseId": "ObjectId",
  "userId": "ObjectId",
  "fileName": "string",
  "fileType": "string (pdf | docx)",
  "filePath": "string",
  "rawText": "string",
  "processedAt": "ISO date | null",
  "createdAt": "ISO date"
}
```

### Task
```json
{
  "_id": "ObjectId",
  "courseId": "ObjectId",
  "userId": "ObjectId",
  "title": "string",
  "type": "assignment | exam | quiz | reading",
  "dueDate": "ISO date",
  "description": "string",
  "priority": "low | medium | high",
  "status": "pending | complete",
  "createdAt": "ISO date"
}
```

### StudyPlan
```json
{
  "_id": "ObjectId",
  "courseId": "ObjectId",
  "userId": "ObjectId",
  "taskIds": ["ObjectId"],
  "aiRecommendations": "string",
  "generatedAt": "ISO date",
  "createdAt": "ISO date"
}
```

---

## Endpoints

### Auth

#### `POST /auth/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response `201`:**
```json
{
  "token": "<jwt>",
  "user": { "_id": "...", "name": "Jane Smith", "email": "jane@example.com" }
}
```

**Errors:** `400` if email already taken or fields missing.

---

#### `POST /auth/login`
Log in and receive a JWT.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "token": "<jwt>",
  "user": { "_id": "...", "name": "Jane Smith", "email": "jane@example.com" }
}
```

**Errors:** `401` for invalid credentials.

---

### Users

#### `GET /users/me` 🔒
Get the authenticated user's profile.

**Response `200`:**
```json
{ "_id": "...", "name": "Jane Smith", "email": "jane@example.com", "createdAt": "..." }
```

---

#### `PUT /users/me` 🔒
Update name or email.

**Request Body (any fields):**
```json
{ "name": "Jane Doe" }
```

**Response `200`:** Updated user object.

---

#### `DELETE /users/me` 🔒
Delete the authenticated user's account and all associated data.

**Response `200`:**
```json
{ "message": "Account deleted" }
```

---

### Courses

#### `GET /courses` 🔒
List all courses belonging to the authenticated user.

**Response `200`:**
```json
[
  { "_id": "...", "name": "Web Development", "courseCode": "CS 346", "semester": "Spring 2026", ... }
]
```

---

#### `POST /courses` 🔒
Create a new course.

**Request Body:**
```json
{
  "name": "Web Development",
  "courseCode": "CS 346",
  "semester": "Spring 2026",
  "description": "Full stack web development"
}
```

**Response `201`:** Created course object.

---

#### `GET /courses/:id` 🔒
Get a single course by ID.

**Response `200`:** Course object.
**Errors:** `404` if not found or not owned by user.

---

#### `PUT /courses/:id` 🔒
Update a course.

**Request Body (any fields):**
```json
{ "description": "Updated description" }
```

**Response `200`:** Updated course object.

---

#### `DELETE /courses/:id` 🔒
Delete a course and all its documents, tasks, and study plan.

**Response `200`:**
```json
{ "message": "Course deleted" }
```

---

### Documents

#### `GET /courses/:courseId/documents` 🔒
List all documents uploaded to a course.

**Response `200`:**
```json
[
  { "_id": "...", "fileName": "syllabus.pdf", "fileType": "pdf", "processedAt": null, ... }
]
```

---

#### `POST /courses/:courseId/documents` 🔒
Upload a document to a course.

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | PDF or DOCX file |

**Response `201`:** Created document object (without `rawText`).

**Errors:** `400` if no file or unsupported type.

---

#### `DELETE /documents/:id` 🔒
Delete a document and its extracted data.

**Response `200`:**
```json
{ "message": "Document deleted" }
```

---

#### `POST /documents/:id/process` 🔒
Send the document to Gemini for AI extraction. Populates `rawText` and any auto-created tasks. Sets `processedAt`.

**Response `200`:**
```json
{
  "document": { "_id": "...", "processedAt": "2026-05-08T...", ... },
  "tasksCreated": 5
}
```

**Errors:** `409` if document has already been processed.

---

### Tasks

#### `GET /courses/:courseId/tasks` 🔒
List all tasks for a course. Supports optional query params:

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `pending` \| `complete` | Filter by status |
| `type` | `assignment` \| `exam` \| `quiz` \| `reading` | Filter by type |

**Response `200`:**
```json
[
  { "_id": "...", "title": "Assignment 1", "type": "assignment", "dueDate": "...", "priority": "high", "status": "pending", ... }
]
```

---

#### `POST /courses/:courseId/tasks` 🔒
Manually create a task.

**Request Body:**
```json
{
  "title": "Midterm Exam",
  "type": "exam",
  "dueDate": "2026-03-15T00:00:00Z",
  "description": "Covers chapters 1-5",
  "priority": "high"
}
```

**Response `201`:** Created task object.

---

#### `PUT /tasks/:id` 🔒
Update a task (e.g., mark complete, change priority).

**Request Body (any fields):**
```json
{ "status": "complete" }
```

**Response `200`:** Updated task object.

---

#### `DELETE /tasks/:id` 🔒
Delete a task.

**Response `200`:**
```json
{ "message": "Task deleted" }
```

---

### Study Plans

#### `GET /courses/:courseId/study-plan` 🔒
Get the existing study plan for a course.

**Response `200`:** StudyPlan object with `taskIds` populated.
**Errors:** `404` if no study plan exists yet for this course.

---

#### `POST /courses/:courseId/study-plan/generate` 🔒
Ask Gemini to generate (or regenerate) a study plan for all tasks in the course. Overwrites any existing plan.

**Response `201`:**
```json
{
  "_id": "...",
  "courseId": "...",
  "aiRecommendations": "Start with chapter reviews two weeks before the midterm...",
  "taskIds": ["...", "..."],
  "generatedAt": "2026-05-08T..."
}
```

**Errors:** `400` if the course has no tasks to plan around.

---

## Error Format

All error responses follow this shape:
```json
{
  "error": "Human-readable message describing what went wrong"
}
```

Common HTTP status codes used:
| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request (missing/invalid fields) |
| `401` | Unauthorized (no or invalid token) |
| `403` | Forbidden (resource not owned by user) |
| `404` | Not Found |
| `409` | Conflict (e.g., duplicate, already processed) |
| `500` | Internal Server Error |
