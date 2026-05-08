# StudyMaster — Tech Stack

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| React Router DOM | TBD | Client-side routing |
| Axios | TBD | HTTP requests to the REST API |
| Tailwind CSS | TBD | Utility-first CSS styling |
| React Scripts (CRA) | 5.0.1 | Build tooling |

## Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | LTS | Runtime |
| Express | 4.x | REST API framework |
| Mongoose | TBD | MongoDB ODM (schema + queries) |
| jsonwebtoken | TBD | JWT creation and verification |
| bcryptjs | TBD | Password hashing |
| multer | TBD | Multipart file upload handling |
| cors | TBD | Allow requests from React dev server |
| dotenv | TBD | Load environment variables from `.env` |
| nodemon | 3.x | Auto-restart server in development |

## Database

| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose | Schema definitions and data access layer |

## AI

| Technology | Purpose |
|------------|---------|
| Google Gemini API | Document text extraction, task identification, study plan generation |
| `@google/generative-ai` | Official Node.js SDK for Gemini (stubbed in `gemeniClient.js`) |

## Dev & Tooling

| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control |
| VS Code | Editor |
| Postman | API endpoint testing |

## Environment Variables

### `study-master-backend/.env`
```
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your JWT signing secret>
GEMINI_API_KEY=<your Google Gemini API key>
```

### `study-master-frontend/.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```
