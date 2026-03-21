import { useState, useEffect, useRef } from "react";
import { useHabits } from "../hooks/useHabits";
import StatCard from "../components/StatCard";
import HabitPill from "../components/HabitPill";
import HeatmapGrid from "../components/HeatmapGrid";
import TodayChecklist from "../components/TodayChecklist";
import MotivationBox from "../components/MotivationBox";
import CelebrationPopup from "../components/CelebrationPopup";
import { getStreak } from "../utils/dateHelpers";
import { ACHIEVEMENTS } from "../utils/achievements";
import ReminderPopup from "../components/ReminderPopup";
import { playReminderSound } from "../utils/sounds";

const SAD_GIFS = [
  "https://tenor.com/embed/1741911582653475332",
  "https://tenor.com/embed/13566867734332124302",
];

export default function Dashboard() {
  const {
    habits,
    data,
    today,
    todayChecked,
    toggleHabit,
    addHabit,
    removeHabit,
  } = useHabits();

  const [newHabit, setNewHabit] = useState("");
  const [newHrs, setNewHrs] = useState("");
  const [newMins, setNewMins] = useState("");
  const [newSecs, setNewSecs] = useState("");
  const [adding, setAdding] = useState(false);

  const [deadlines, setDeadlines] = useState(() => {
    const saved = localStorage.getItem("ht_deadlines");
    return saved ? JSON.parse(saved) : {};
  });

  const [alarmHabit, setAlarmHabit] = useState(null);
  const [activeSadGif, setActiveSadGif] = useState(null);
  const [now, setNow] = useState(Date.now());
  const lastGifRef = useRef(null);

  // 🔥 Repeating alarm interval ref
  const alarmIntervalRef = useRef(null);

  const doneCount = habits.filter((h) => todayChecked[h]).length;
  const totalDays = Object.keys(data).filter((k) =>
    Object.values(data[k]).some(Boolean),
  ).length;
  const bestStreak = Math.max(
    ...habits.map((h) => getStreak(h, data, today)),
    0,
  );

  const pickDifferentSadGif = () => {
    const remainingGifs = SAD_GIFS.filter((g) => g !== lastGifRef.current);
    const newGif =
      remainingGifs[Math.floor(Math.random() * remainingGifs.length)];
    setActiveSadGif(newGif);
    lastGifRef.current = newGif;
  };

  // 🔥 Alarm start — har 3 sec pe sound bajao
  const startAlarm = () => {
    try {
      playReminderSound();
    } catch (e) {}
    if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    alarmIntervalRef.current = setInterval(() => {
      try {
        playReminderSound();
      } catch (e) {}
    }, 3000);
  };

  // 🔥 Alarm stop — user ne click kiya
  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setAlarmHabit(null);
    setActiveSadGif(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      const currentDeadlines = JSON.parse(
        localStorage.getItem("ht_deadlines") || "{}",
      );
      let updated = false;

      Object.keys(currentDeadlines).forEach((habit) => {
        if (todayChecked[habit]) {
          delete currentDeadlines[habit];
          updated = true;
          return;
        }
        if (currentTime >= currentDeadlines[habit]) {
          if (!todayChecked[habit]) {
            pickDifferentSadGif();
            setAlarmHabit(habit);
            startAlarm(); // 🔥 Repeating alarm shuru
          }
          delete currentDeadlines[habit];
          updated = true;
        }
      });

      if (updated) {
        setDeadlines(currentDeadlines);
        localStorage.setItem("ht_deadlines", JSON.stringify(currentDeadlines));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [todayChecked]);

  const handleAdd = () => {
    if (!newHabit.trim()) return;
    addHabit(newHabit);

    const h = Math.max(0, parseInt(newHrs.slice(0, 2)) || 0);
    const m = Math.min(59, Math.max(0, parseInt(newMins.slice(0, 2)) || 0));
    const s = Math.min(59, Math.max(0, parseInt(newSecs.slice(0, 2)) || 0));

    if (h > 0 || m > 0 || s > 0) {
      const timeInMs = (h * 3600 + m * 60 + s) * 1000;
      const targetTime = Date.now() + timeInMs;
      const newDeadlines = { ...deadlines, [newHabit]: targetTime };
      setDeadlines(newDeadlines);
      localStorage.setItem("ht_deadlines", JSON.stringify(newDeadlines));
    }
    setNewHabit("");
    setNewHrs("");
    setNewMins("");
    setNewSecs("");
    setAdding(false);
  };

  const removeHabitWithDeadline = (h) => {
    removeHabit(h);
    const newDeadlines = { ...deadlines };
    delete newDeadlines[h];
    setDeadlines(newDeadlines);
    localStorage.setItem("ht_deadlines", JSON.stringify(newDeadlines));
  };

  const formatTimeLeft = (ms) => {
    if (ms <= 0) return "00:00";
    const totalSecs = Math.floor(ms / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0)
      return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const isAlarmOpen = !!(alarmHabit && activeSadGif);

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-1">Habit Tracker</h1>
      <p className="text-sm text-[#8b949e] mb-6">
        Track daily habits — streaks & timers
      </p>

      <div className="flex gap-3 flex-wrap mb-6">
        <StatCard
          value={`${doneCount}/${habits.length}`}
          label="Today done"
          icon="✅"
        />
        <StatCard
          value={bestStreak}
          label="Best streak"
          color="#f0883e"
          icon="🔥"
        />
        <StatCard
          value={totalDays}
          label="Active days"
          color="#3fb950"
          icon="📅"
        />
        <StatCard
          value={habits.length}
          label="Total habits"
          color="#d2a8ff"
          icon="💪"
        />
      </div>

      <div className="text-xs text-[#8b949e] mb-3 font-medium">Your habits</div>
      <div className="flex flex-wrap gap-x-3 gap-y-5 mb-6 items-center">
        {habits.map((h) => {
          const timeLeftMs = deadlines[h] ? deadlines[h] - now : 0;
          return (
            <div key={h} className="relative mb-2">
              <HabitPill
                name={h}
                streak={getStreak(h, data, today)}
                active={!!todayChecked[h]}
                onClick={() => toggleHabit(h)}
              />
              {deadlines[h] && !todayChecked[h] && timeLeftMs > 0 && (
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#161b22] border border-[#f85149] text-[#f85149] rounded-full px-2 py-0.5 whitespace-nowrap shadow-md z-10"
                  style={{ animation: "pulse 2s infinite" }}
                >
                  ⏳ {formatTimeLeft(timeLeftMs)}
                </div>
              )}
              <span
                onClick={() => removeHabitWithDeadline(h)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-[#21262d] text-[#8b949e] rounded-full flex items-center justify-center text-xs cursor-pointer hover:text-white"
              >
                ×
              </span>
            </div>
          );
        })}

        {adding ? (
          <div className="flex gap-2 items-center flex-wrap bg-[#0d1117] p-2 rounded-xl border border-[#30363d]">
            <input
              autoFocus
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Habit name..."
              className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-[#e6edf3] text-sm outline-none w-[140px]"
            />
            <div className="flex gap-1 items-center">
              <input
                type="number"
                placeholder="Hrs"
                value={newHrs}
                onChange={(e) => setNewHrs(e.target.value.slice(0, 2))}
                className="no-spinner px-2 py-1.5 w-[45px] rounded-lg bg-[#161b22] border border-[#30363d] text-[#e6edf3] text-sm outline-none"
              />
              <input
                type="number"
                placeholder="Min"
                value={newMins}
                onChange={(e) => setNewMins(e.target.value.slice(0, 2))}
                className="no-spinner px-2 py-1.5 w-[45px] rounded-lg bg-[#161b22] border border-[#30363d] text-[#e6edf3] text-sm outline-none"
              />
              <input
                type="number"
                placeholder="Sec"
                value={newSecs}
                onChange={(e) => setNewSecs(e.target.value.slice(0, 2))}
                className="no-spinner px-2 py-1.5 w-[45px] rounded-lg bg-[#161b22] border border-[#30363d] text-[#e6edf3] text-sm outline-none"
              />
            </div>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded-lg bg-[#238636] text-white text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 rounded-lg border border-[#30363d] text-[#8b949e] text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="px-4 py-2 rounded-full text-sm border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff]"
          >
            + Add habit
          </button>
        )}
      </div>

      <HeatmapGrid data={data} habits={habits} />
      <TodayChecklist
        habits={habits}
        checked={todayChecked}
        onToggle={toggleHabit}
        data={data}
        today={today}
      />
      <MotivationBox doneCount={doneCount} total={habits.length} />
      <CelebrationPopup doneCount={doneCount} total={habits.length} />

      {/* 🔥 Alarm popup — GIFs preloaded, sound tab tak bajta rahe jab tak user click na kare */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          zIndex: 10003,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isAlarmOpen ? 1 : 0,
          pointerEvents: isAlarmOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            background: "#161b22",
            border: "2px solid #f85149",
            borderRadius: 20,
            padding: "30px",
            textAlign: "center",
            maxWidth: 320,
            transform: isAlarmOpen ? "scale(1)" : "scale(0.8)",
            transition:
              "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >
          {/* Saare GIFs preloaded */}
          <div
            style={{
              margin: "0 auto 20px",
              width: 160,
              height: 160,
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {SAD_GIFS.map((gif) => (
              <iframe
                key={gif}
                src={gif}
                width="160"
                height="160"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                style={{
                  pointerEvents: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: activeSadGif === gif ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  minHeight: "160px",
                }}
              />
            ))}
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#f85149",
              marginBottom: 8,
            }}
          >
            Time's Up! 😭
          </div>
          <div style={{ fontSize: 14, color: "#e6edf3", marginBottom: 4 }}>
            Aapka <strong>"{alarmHabit}"</strong> miss ho gaya... 💔
          </div>
          {/* 🔥 Pulsing text jab tak alarm band na ho */}
          <div
            style={{
              fontSize: 11,
              color: "#f85149",
              marginBottom: 20,
              animation: "pulse 1s infinite",
            }}
          >
            🔔 Band karne ke liye button dabao...
          </div>
          <button
            onClick={stopAlarm}
            style={{
              background: "#f85149",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Abhi karta hoon! 🥺
          </button>
        </div>
      </div>

      <ReminderPopup
        habits={habits}
        todayChecked={todayChecked}
        onGoToDashboard={scrollToTop}
        disabled={isAlarmOpen}
      />

      <style>{`
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spinner { -moz-appearance: textfield; }
        @keyframes pulse { 0%{opacity:1} 50%{opacity:0.5} 100%{opacity:1} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}
