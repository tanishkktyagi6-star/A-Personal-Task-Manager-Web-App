const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskCategory = document.getElementById('taskCategory');
const taskDueDate = document.getElementById('taskDueDate');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');

let tasks = [];
let currentFilter = 'all';
let searchQuery = '';

// --- Theme ---
function initTheme() {
  const saved = localStorage.getItem('taskflow-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('taskflow-theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// --- API calls ---
async function fetchTasks() {
  const res = await fetch('/api/tasks');
  tasks = await res.json();
  render();
}

async function createTask(data) {
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  await fetchTasks();
}

async function updateTask(id, data) {
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  await fetchTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  await fetchTasks();
}

// --- Rendering ---
function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

function render() {
  let filtered = tasks;

  if (currentFilter === 'active') filtered = filtered.filter(t => !t.completed);
  else if (currentFilter === 'completed') filtered = filtered.filter(t => t.completed);
  else if (['work', 'personal', 'urgent'].includes(currentFilter)) {
    filtered = filtered.filter(t => t.category === currentFilter);
  }

  if (searchQuery.trim()) {
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  taskList.innerHTML = '';
  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      const overdue = isOverdue(task.dueDate, task.completed);

      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
        <div class="task-content">
          <div class="task-title"></div>
          <div class="task-meta">
            <span class="badge ${task.category}">${task.category}</span>
            ${task.dueDate ? `<span class="due-date ${overdue ? 'overdue' : ''}">${overdue ? '⚠ Overdue: ' : '📅 '}${task.dueDate}</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="delete-btn" title="Delete">🗑️</button>
        </div>
      `;

      li.querySelector('.task-title').textContent = task.title;

      li.querySelector('.task-checkbox').addEventListener('change', () => {
        updateTask(task.id, { completed: !task.completed });
      });

      li.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTask(task.id);
      });

      taskList.appendChild(li);
    });
}

// --- Events ---
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  if (!title) return;

  createTask({
    title,
    category: taskCategory.value,
    dueDate: taskDueDate.value || null
  });

  taskForm.reset();
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  render();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// --- Init ---
initTheme();
fetchTasks();
