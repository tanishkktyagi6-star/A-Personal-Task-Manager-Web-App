const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Helpers ---
function readTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// --- Routes ---

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, category, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    title: title.trim(),
    category: category || 'personal',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// Update a task (edit title/category/dueDate, or toggle completed)
app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, category, dueDate, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (category !== undefined) task.category = category;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;

  writeTasks(tasks);
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const exists = tasks.some(t => t.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks = tasks.filter(t => t.id !== req.params.id);
  writeTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`TaskFlow server running at http://localhost:${PORT}`);
});
