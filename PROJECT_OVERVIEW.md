# StudyMaster — Project Overview

## What It Is

StudyMaster is an AI-powered web application that helps students survive a busy semester. Users upload their course documents — syllabi, assignment schedules, reading lists — and the app uses the Gemini AI to extract every deadline, exam, and task buried in those files. It then builds a structured study plan with prioritized tasks and AI-driven recommendations, so nothing slips through the cracks.

## Problem It Solves

At the start of each semester, students receive a pile of PDFs across all their courses. Manually reading through all of them, writing down every due date, and figuring out how to study for everything is tedious and error-prone. StudyMaster automates the extraction and planning step so students can focus on actually studying.

## Core Features

- **User Accounts** — Register and log in with email/password. Each user has their own private data.
- **Course Management** — Create and manage courses for the current semester (e.g., CS 346, BIO 201).
- **Document Upload** — Upload PDFs or DOCX files (syllabus, schedule, assignment list) for each course.
- **AI Extraction** — Trigger Gemini AI processing on any uploaded document to automatically pull out tasks, deadlines, exam dates, and topics.
- **Task Tracking** — View all extracted (and manually added) tasks across a course, with type, due date, priority, and status.
- **AI Study Plans** — Generate a full study plan for a course: Gemini recommends a study timeline and approach for each task and exam.

## Architecture

```
React Frontend (port 3000)
        |
        | HTTP / REST (JSON)
        v
Express REST API (port 5000)
        |
        |--- MongoDB Atlas (users, courses, documents, tasks, study plans)
        |--- Google Gemini API (document processing, study plan generation)
```

## Directory Structure

```
Project/
├── study-master-frontend/     # React 19 app
│   └── src/
│       └── Components/
├── study-master-backend/      # Express API
│   ├── server.js
│   ├── gemeniClient.js        # Gemini API client
│   └── ai_funcs.js            # AI helper functions
├── PROJECT_OVERVIEW.md
├── TECH_STACK.md
└── REST_API_CONTRACT.md
```

## Running Locally

**Backend**
```bash
cd study-master-backend
npm install
npm run dev        # nodemon, port 5000
```

**Frontend**
```bash
cd study-master-frontend
npm install
npm start          # CRA dev server, port 3000
```

Make sure your `.env` file in `study-master-backend/` contains a valid `MONGODB_URI` and `GEMINI_API_KEY`.
