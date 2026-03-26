# Jem Task App — Project Notes

## What This Is
A Vue.js task management web app with localStorage persistence (no database needed).

## How to Run
```bash
cd "C:\Users\jeremiah.nabong\Jem Task App"
npm install      # first time only
npm run dev      # starts at http://localhost:5173
```

## Features
- Create tasks with an optional scheduled date/time
- Edit, delete, and mark tasks as complete
- Filter by All / Active / Completed
- Overdue tasks highlighted in red
- Data saved to browser localStorage — survives page refresh
- Clear completed tasks button

## Project Structure
```
src/
├── App.vue                        # Root layout
├── main.js                        # Entry point
├── assets/styles.css              # All styles
├── composables/
│   └── useTasks.js                # Task logic + localStorage
└── components/
    ├── TaskInput.vue              # Add task form (title + datetime)
    ├── TaskFilter.vue             # All / Active / Completed tabs
    ├── TaskList.vue               # Renders task list
    └── TaskItem.vue               # Single task (view + edit mode)
```

## GitHub
Repo: https://github.com/jemdi/jem-task-app

```bash
git push    # push latest commits to GitHub
```

## Git History
| Commit | Description |
|--------|-------------|
| 3021421 | Initial commit — full Vue.js task app |
| f56c293 | Remove node_modules, add .gitignore |
| 92e102b | Add scheduled time to tasks (overdue highlighting) |

## Pending
- Scheduled time feature committed locally — not yet pushed to GitHub
