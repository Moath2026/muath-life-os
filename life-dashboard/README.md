## Muath Life OS – Personal Life Dashboard

A production-minded personal operating system for **Muath**, a flight attendant in Riyadh transitioning into **AI automation and fintech consulting**. It tracks:

- **Career / AI transition**
- **Financial goals and debt freedom**
- **Skill development & IELTS**
- **Daily habits, Pomodoro focus, and reflections**

Built as a single-page React app with **Vite + Tailwind CSS + Chart.js** and **localStorage** persistence.

---

### Tech Stack

- **React 18** (Vite)
- **Tailwind CSS 3**
- **Chart.js 4** + `react-chartjs-2`
- **LocalStorage** (no backend required)

---

### Project Structure

```bash
life-dashboard/
  index.html
  package.json
  vite.config.js
  postcss.config.js
  tailwind.config.js

  src/
    App.jsx
    main.jsx

    hooks/
      useLocalStorage.js

    utils/
      helpers.js       # saveData/loadData/backupData/restoreData, currency, date helpers

    styles/
      globals.css      # Tailwind + global variables, cards, tokens
      theme.css        # Layout shell, sidebar, bottom nav, theme helpers

    components/
      Dashboard.jsx    # High-level metrics & overview widgets
      Goals.jsx        # Goal & task manager (AI, Finance, IELTS, Career, Habits)
      Finance.jsx      # Financial tracker + charts (expenses, debt, savings trend)
      Skills.jsx       # Skills + IELTS progress, analytics
      Calendar.jsx     # Monthly calendar with colored events & goals
      Pomodoro.jsx     # Pomodoro focus timer + weekly/streak analytics + habit heatmap
      Journal.jsx      # Daily journal with prompts, tags, search, timeline view
```

---

### Setup Instructions

1. **Install Node.js** (if you haven't)
   - Download from `https://nodejs.org` (LTS version recommended).

2. **Install dependencies**

   ```bash
   cd life-dashboard
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open the printed URL in your browser (usually `http://localhost:5173`).

4. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

---

### Core Features

- **Dashboard**
  - AI learning % (Python, n8n, APIs, agents)
  - IELTS progress snapshot
  - Monthly surplus after expenses + debts
  - Debt freedom countdown to **27 Oct 2026**
  - Today’s tasks + high‑priority backlog
  - Skills snapshot + Pomodoro deep work summary

- **Goals**
  - Categories: **AI, Finance, IELTS, Career, Habits**
  - Fields: `id, title, category, priority, completed, dueDate, estimatedTime, notes, createdAt`
  - Add, edit, delete, reorder (up/down), mark complete
  - Filters by category, priority, status; sort by priority / due / created
  - Keyboard: **Ctrl+N** opens “New goal”

- **Finance**
  - Monthly income default: **15,000 SAR**
  - Track: savings, savings target, investments, expenses, debts
  - Debts:
    - Baseeta — 15,000 SAR (target payoff Apr 2026)
    - Car Loan — ends Oct 2026
    - Social Bank Loan — 2,700 SAR/month, ends Oct 2026
  - Visuals:
    - Expense **pie chart**
    - Savings **progress bar**
    - Debt **progress bars**
    - Savings vs. debt **trend line** (log snapshots monthly)

- **Skills**
  - Core skills: Python Basics, n8n, AI APIs, LangChain/Agents, Financial Analysis
  - IELTS modules: Reading, Writing, Listening, Speaking
  - Adjustable progress with +5/−5 buttons
  - Analytics:
    - Core skills **bar chart**
    - IELTS modules **bar chart**

- **Calendar**
  - Monthly grid with event dots
  - Color‑coded types:
    - Blue → Study
    - Purple → AI work
    - Green → Finance
    - Red → Deadlines
    - Gray → Flight days
  - Create events on selected date
  - Shows goals due on that day

- **Pomodoro**
  - **25 min focus / 5 min short break / 15 min long break every 4 sessions**
  - Start, pause, reset, switch modes
  - Tracks:
    - Daily focus sessions
    - Weekly sessions (7‑day bar chart)
    - Streak of consecutive days with ≥1 session
  - Habit heatmap: last 30 days of focus sessions
  - Keyboard: **Ctrl+P** to start a focus session

- **Journal**
  - Fields: `date, accomplishments, learnings, tomorrowPlan, mood, tags`
  - Built‑in prompts:
    - “What did I accomplish today?”
    - “What did I learn today?”
    - “What will I do tomorrow?”
  - Tagging (comma‑separated), search, tag filter
  - Timeline view with vertical life log
  - Keyboard: **Ctrl+J** to jump to journal

---

### Data Persistence & Backup

- All state is stored in **localStorage** under a single key: `muath-life-dashboard-v1`.
- Utilities in `src/utils/helpers.js`:
  - `saveData(data)` – writes full state
  - `loadData()` – reads full state
  - `backupData()` – returns JSON string for export
  - `restoreData(json)` – parses JSON and overwrites state

In the app header:

- **Backup JSON** – opens a modal with your full JSON state to copy/save.
- **Restore JSON** – paste a previous backup to restore everything.

---

### Keyboard Shortcuts

- **Ctrl + N** → Add new goal
- **Ctrl + P** → Start Pomodoro focus block
- **Ctrl + J** → Open Journal
- **Space** → Toggle selected goal complete/incomplete
- **Esc** → Close modals (backup / restore)

---

### Design System

- **Default**: dark mode (Linear/Vercel/Raycast‑inspired)
  - Backgrounds: `#0a0a0f`, `#12121a`, `#1a1a25`
  - Accents: `#3b82f6`, `#8b5cf6`, `#10b981`, `#f59e0b`, `#ef4444`
- **Typography**
  - Headings: **Outfit**
  - Body: **Inter**
  - Numbers / timers: **Space Mono**
- **Components**
  - Glassmorphism cards, gradient progress bars, soft shadows, rounded corners
  - Responsive layout with sidebar (desktop) and bottom nav (mobile)
  - Theme toggle (dark/light) stored in `localStorage` key `muath-theme`

---

### Notes

- This app is intentionally local‑first: no external accounts, everything is stored in your browser.
- To reset everything, clear the `localStorage` key `muath-life-dashboard-v1` in your browser dev tools.

If you’d like to later upgrade to **Next.js + Supabase + PostgreSQL**, this structure is already separated by concerns (components, hooks, utils, styles) to keep migration straightforward. 
