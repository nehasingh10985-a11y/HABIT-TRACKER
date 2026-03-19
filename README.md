# 🔥 HabitTracker

> **A GenZ-style daily habit tracker** — streaks, reminders, celebrations, and roasts! Built with React + Vite + Tailwind CSS. No cap, built different fr fr 🐐

## ✨ Features

### Dashboard

- Add habits with custom **H / M / S countdown timers**
- Live timer badge on each habit pill — pulses red when running out ⏳
- **GitHub-style 365-day heatmap** to visualize yearly progress
- Today's checklist with **streak badges** 🔥
- Alarm popup with sad GIF when deadline is missed 😭

### GenZ Celebration System

- Each habit check shows a unique meme popup
  - `🗿 "Bro woke up and chose violence fr fr 💀"`
  - `🐐 "3 habits? Sheesh bestie, GOAT behavior!"`
- All habits done → **full-screen epic celebration** with rotating emojis + confetti + GenZ hashtags

### Smart Reminder System

- Reminders at **2 min, 5 min, 30 min, then every hour** after app opens
- **Snooze escalation** — 1s → 3s → 5s → 7s → 9s with live countdown ⏱️
- Roast messages on every snooze: `💀 "Tumse na ho payega!"`
- **"Ab karta hoon! 💪"** → cute GenZ go message popup
- Background browser notifications with `requireInteraction`

### Stats Page

- Last 30 days overall consistency %
- **Best day vs Worst day** 🏆 😬
- **Habit comparison bar chart**
- Per-habit cards with streak + consistency

### Weekly Summary

- This week's score with progress ring
- Per-habit progress bars + daily breakdown grid Mon→Sun
- Last 4 weeks trend

### Missed Tasks

- View missed habits — **Today / Week / Month / Year / All Time**
- Filter by habit + done vs missed split bar

### Achievements

- **Trading card style** with rarity: `Common` `Rare` `Epic` `Legendary`
- **XP + Level system**: Noob 🥚 → Apprentice 🌱 → Grinder 💪 → Sigma 🔥 → GOAT 🐐 → LEGEND 👑
- Legendary glow animation + hover scale effects

### Sound Effects

| Action         | Sound                 |
| -------------- | --------------------- |
| ✅ Habit check | Rising ding           |
| ❌ Uncheck     | Falling tone          |
| 🏆 All done    | 4-note celebration 🎶 |
| 🔔 Reminder    | 3 beeps               |

> Powered by Web Audio API — no files needed!

---

## Getting Started

```bash
# Clone
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker

# Install
npm install

# Run
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### Deploy to Vercel

```bash
npm run build
vercel
```

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── CelebrationPopup.jsx  # GenZ meme celebration
│   ├── HabitPill.jsx         # Habit button with streak
│   ├── HeatmapGrid.jsx       # 365-day heatmap
│   ├── MotivationBox.jsx     # Daily motivation
│   ├── ReminderPopup.jsx     # Smart reminder + snooze
│   ├── StatCard.jsx          # Dashboard stat cards
│   └── TodayChecklist.jsx    # Today's checklist
├── hooks/
│   ├── useHabits.js          # Main habits state
│   ├── useLocalStorage.js    # Persistent storage
│   └── useStreak.js          # Streak calculation
├── pages/
│   ├── Achievements.jsx      # Trading cards + XP
│   ├── Calendar.jsx          # Monthly calendar
│   ├── Dashboard.jsx         # Main dashboard
│   ├── MissedTasks.jsx       # Missed habits
│   ├── Settings.jsx          # App settings
│   ├── Stats.jsx             # Stats + charts
│   └── WeeklySummary.jsx     # Weekly breakdown
├── utils/
│   ├── achievements.js       # Achievement + XP system
│   ├── dateHelpers.js        # Date utilities
│   └── sounds.js             # Web Audio API sounds
├── App.jsx                   # Router + Navbar
└── main.jsx                  # Entry point
```

---

## 🛠️ Tech Stack

| Tech             | Version | Purpose          |
| ---------------- | ------- | ---------------- |
| React            | 18      | UI framework     |
| Vite             | 5       | Build tool       |
| Tailwind CSS     | 3       | Styling          |
| React Router DOM | 6       | Routing          |
| Web Audio API    | —       | Sounds           |
| Notification API | —       | Reminders        |
| LocalStorage     | —       | Data persistence |

---

## ✅ Feature Checklist

| Feature                  | Status |
| ------------------------ | ------ |
| Dashboard with heatmap   | ✅     |
| Habit timers H/M/S       | ✅     |
| GenZ celebration popups  | ✅     |
| Smart reminders          | ✅     |
| Snooze escalation 1s→9s  | ✅     |
| Snooze roast messages    | ✅     |
| Sound effects            | ✅     |
| Stats + comparison chart | ✅     |
| Best/Worst day           | ✅     |
| Weekly summary           | ✅     |
| Missed tasks view        | ✅     |
| Achievements + XP levels | ✅     |
| Calendar view            | ✅     |
| Export/Clear data        | ✅     |
| Mobile responsive        | ✅     |
| Background notifications | ✅     |

---

Made with ❤️ using React + Vite + Tailwind

> No cap, built different fr fr 🐐 `#SigmaGrindset` `#MainCharacter`
