# 📝 TaskFlow

A simple, clean full-stack task manager web app — built with **Node.js**, **Express**, and **vanilla JavaScript** (no frontend framework required).

![Node](https://img.shields.io/badge/node-%3E%3D14-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- ✅ Add, complete, and delete tasks
- 🏷️ Categorize tasks (Work / Personal / Urgent)
- 📅 Due dates with overdue highlighting
- 🔍 Search and filter tasks
- 🌙 Dark mode toggle (saved across sessions)
- 💾 Simple JSON file storage — no database setup needed

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Storage:** JSON file (`data/tasks.json`)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# Install dependencies
npm install

# Start the server
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taskflow/
├── data/
│   └── tasks.json        # Task storage
├── public/
│   ├── index.html         # Main page
│   ├── style.css          # Styles (incl. dark mode)
│   └── script.js          # Frontend logic
├── server.js               # Express server + API routes
├── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint          | Description         |
|--------|-------------------|----------------------|
| GET    | `/api/tasks`      | Get all tasks        |
| POST   | `/api/tasks`      | Create a new task     |
| PUT    | `/api/tasks/:id`  | Update a task         |
| DELETE | `/api/tasks/:id`  | Delete a task         |

## Roadmap / Ideas for Contribution

- [ ] User authentication (multi-user support)
- [ ] Drag-and-drop task reordering
- [ ] Switch storage to SQLite/PostgreSQL
- [ ] Deploy live demo (Render/Vercel)
- [ ] Recurring tasks

## License

MIT — free to use and modify.
