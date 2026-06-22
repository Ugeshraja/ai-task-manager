# Focus — AI-Powered Task Manager

A full-stack task manager where Claude (Anthropic API) analyzes each task to
suggest a priority, explain its reasoning, break it into subtasks, and rank
your whole to-do list into a daily focus order.

**Stack:** React (Vite + Tailwind) · Node/Express · MongoDB · Claude API · JWT auth

---

## 1. Project structure

```
ai-task-manager/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── models/User.js            User schema (bcrypt password hashing)
│   ├── models/Task.js            Task schema (subtasks, priority, status)
│   ├── middleware/auth.js        JWT route protection
│   ├── controllers/
│   │   ├── authController.js     register / login / me
│   │   ├── taskController.js     CRUD for tasks
│   │   └── aiController.js       /analyze and /prioritize endpoints
│   ├── utils/aiService.js        All Claude API calls live here
│   ├── routes/                   authRoutes, taskRoutes, aiRoutes
│   ├── server.js                 Express app entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js          Axios instance, attaches JWT to requests
    │   ├── context/AuthContext.jsx
    │   ├── pages/Login.jsx, Register.jsx, Dashboard.jsx
    │   ├── components/TaskForm.jsx     create task + "Ask AI" button
    │   ├── components/TaskCard.jsx     task display, subtasks, status
    │   ├── components/AISuggestions.jsx daily focus ranking panel
    │   ├── components/Navbar.jsx
    │   ├── App.jsx, main.jsx, index.css
    ├── tailwind.config.js
    ├── .env.example
    └── package.json
```

## 2. How the AI features work

- **Analyze a task** (`POST /api/ai/analyze`): when you type a title/description
  and click "Ask AI to prioritize & break down," the backend sends the task to
  Claude and gets back a priority (`low/medium/high/urgent`), a one-line reason,
  and 2–5 actionable subtasks — all parsed as JSON in `utils/aiService.js`.
- **Daily focus ranking** (`POST /api/ai/prioritize`): pulls all of your
  incomplete tasks, sends them to Claude, and gets back a recommended work
  order plus a short summary, shown in the dark "Today's focus" panel.

---

## 3. Prerequisites

- Node.js v18+ and npm
- A MongoDB database — either:
  - Install locally ([MongoDB Community](https://www.mongodb.com/try/download/community)), or
  - Free cloud database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

---

## 4. Step-by-step setup

### Step 1 — Download/copy the project
Place the `ai-task-manager` folder anywhere on your machine.

### Step 2 — Backend setup
```bash
cd ai-task-manager/backend
npm install
cp .env.example .env
```
Open `.env` and fill in:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-task-manager   # or your Atlas URI
JWT_SECRET=any_long_random_string
ANTHROPIC_API_KEY=sk-ant-...
CLIENT_URL=http://localhost:5173
```
Start the server:
```bash
npm run dev
```
You should see `MongoDB connected` and `Server running on port 5000`.
Visit `http://localhost:5000` — you should see a JSON status message.

### Step 3 — Frontend setup
Open a **new terminal**:
```bash
cd ai-task-manager/frontend
npm install
cp .env.example .env
```
The default `.env` (`VITE_API_URL=http://localhost:5000/api`) works as-is if
you used the default backend port.

Start the dev server:
```bash
npm run dev
```
Visit `http://localhost:5173`.

### Step 4 — Use the app
1. Click **Create one** to register an account.
2. On the dashboard, type a task title (e.g. "Prepare Q3 investor deck").
3. Click **✨ Ask AI to prioritize & break down** — Claude returns a priority,
   reasoning, and subtasks before you even save the task.
4. Click **Add task** to save it.
5. Click **✨ Refresh with AI** in the right-hand panel to get a ranked focus
   order across all your open tasks.
6. Click a task's status pill to cycle `todo → in-progress → done`; check off
   subtasks as you complete them.

---

## 5. API reference

| Method | Endpoint              | Auth | Description                          |
|--------|-----------------------|------|---------------------------------------|
| POST   | `/api/auth/register`  | No   | Create account, returns JWT           |
| POST   | `/api/auth/login`     | No   | Login, returns JWT                    |
| GET    | `/api/auth/me`        | Yes  | Current user                          |
| GET    | `/api/tasks`          | Yes  | List your tasks                       |
| POST   | `/api/tasks`          | Yes  | Create a task                         |
| PUT    | `/api/tasks/:id`      | Yes  | Update a task                         |
| DELETE | `/api/tasks/:id`      | Yes  | Delete a task                         |
| POST   | `/api/ai/analyze`     | Yes  | AI priority + subtask breakdown       |
| POST   | `/api/ai/prioritize`  | Yes  | AI ranking of all open tasks          |

All authenticated requests need header: `Authorization: Bearer <token>`.

---

## 6. Suggested 1.5–2 week build timeline

| Days | Focus |
|------|-------|
| 1–2  | Backend skeleton: Express server, MongoDB models, JWT auth (register/login) |
| 3–4  | Task CRUD API + test with Postman/Thunder Client |
| 5–6  | Integrate Claude API (`analyze`, `prioritize`) in `aiService.js` |
| 7–8  | Frontend scaffold: routing, auth pages, axios + context |
| 9–10 | Dashboard: task list, TaskForm with AI button, TaskCard |
| 11   | AISuggestions panel (daily focus ranking) |
| 12   | Styling pass, empty/error states, responsive check |
| 13   | Manual QA: auth flow, CRUD, AI error handling (bad/missing API key) |
| 14   | Polish, write your own README notes, deploy (optional) |

## 7. Optional next steps
- Deploy backend on Render/Railway, frontend on Vercel/Netlify; update
  `CLIENT_URL` and `VITE_API_URL` accordingly.
- Add due-date reminders or email notifications.
- Add drag-and-drop reordering using the AI-ranked order as the default sort.
- Cache AI responses per task to avoid re-calling the API on every edit.

## 8. Troubleshooting
- **"AI analysis failed"** → check `ANTHROPIC_API_KEY` is set and valid in
  `backend/.env`, and that the backend was restarted after editing `.env`.
- **CORS errors** → confirm `CLIENT_URL` in backend `.env` matches the exact
  origin shown in your browser (including port).
- **Mongoose connection error** → confirm MongoDB is running locally, or that
  your Atlas connection string includes the correct username/password and
  that your IP is allow-listed in Atlas Network Access.
