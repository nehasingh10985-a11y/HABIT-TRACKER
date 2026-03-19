import { useState } from "react";
import { useHabits } from "../hooks/useHabits";
import { toKey } from "../utils/dateHelpers";

const TABS = ["Today", "Week", "Month", "Year", "All Time"];

function getDaysArray(from, to) {
  const days = [];
  const cur = new Date(from);
  while (cur <= to) {
    days.push(toKey(new Date(cur)));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default function MissedTasks() {
  const { habits, data, today } = useHabits();
  const [activeTab, setActiveTab] = useState("Today");
  const [selectedHabit, setSelectedHabit] = useState("All");

  // Date range based on tab
  const getDateRange = () => {
    const end = new Date(today);
    const start = new Date(today);
    if (activeTab === "Today") return [today, end];
    if (activeTab === "Week") {
      start.setDate(end.getDate() - 6);
      return [start, end];
    }
    if (activeTab === "Month") {
      start.setDate(1);
      return [start, end];
    }
    if (activeTab === "Year") {
      start.setMonth(0);
      start.setDate(1);
      return [start, end];
    }
    // All time
    const allKeys = Object.keys(data).sort();
    if (allKeys.length === 0) return [today, end];
    return [new Date(allKeys[0]), end];
  };

  const [startDate, endDate] = getDateRange();
  const allDays = getDaysArray(startDate, endDate);

  // Find missed tasks — habit done nahi hua us din
  const missedEntries = [];
  allDays.forEach((dayKey) => {
    const dayDate = new Date(dayKey);
    const isPast = dayDate < today || toKey(dayDate) === toKey(today);
    if (!isPast) return;

    habits.forEach((habit) => {
      if (selectedHabit !== "All" && habit !== selectedHabit) return;
      const done = data[dayKey]?.[habit];
      if (!done) {
        missedEntries.push({ dayKey, habit });
      }
    });
  });

  // Group by date
  const groupedByDate = {};
  missedEntries.forEach(({ dayKey, habit }) => {
    if (!groupedByDate[dayKey]) groupedByDate[dayKey] = [];
    groupedByDate[dayKey].push(habit);
  });

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  // Stats
  const totalMissed = missedEntries.length;
  const totalPossible =
    allDays.filter((k) => new Date(k) <= today).length *
    (selectedHabit === "All" ? habits.length : 1);
  const missedPct = totalPossible
    ? Math.round((totalMissed / totalPossible) * 100)
    : 0;
  const donePct = 100 - missedPct;

  const formatDate = (key) => {
    const d = new Date(key);
    const isToday = key === toKey(today);
    if (isToday) return "Today";
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Missed Tasks 😬</h1>
      <p className="text-sm text-[#8b949e] mb-6">
        Jo tasks complete nahi hue — honest view!
      </p>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 13,
              background: activeTab === tab ? "#238636" : "#21262d",
              color: activeTab === tab ? "#fff" : "#8b949e",
              border: `1px solid ${activeTab === tab ? "#2ea043" : "#30363d"}`,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Habit filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {["All", ...habits].map((h) => (
          <button
            key={h}
            onClick={() => setSelectedHabit(h)}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              background: selectedHabit === h ? "#1c2d3e" : "#0d1117",
              color: selectedHabit === h ? "#58a6ff" : "#8b949e",
              border: `1px solid ${selectedHabit === h ? "#1f6feb" : "#21262d"}`,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Stats banner */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-[#8b949e] mb-1">
              {activeTab} — Missed tasks
            </div>
            <div className="text-3xl font-bold text-[#f85149]">
              {totalMissed}
            </div>
            <div className="text-xs text-[#8b949e] mt-1">
              out of {totalPossible} possible
            </div>
          </div>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#3d1c1c",
              border: "3px solid #f85149",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#f85149",
            }}
          >
            {missedPct}%
          </div>
        </div>

        {/* Split bar — done vs missed */}
        <div className="flex rounded-full overflow-hidden h-3 mb-2">
          <div
            style={{
              width: `${donePct}%`,
              background: "#238636",
              transition: "width 0.5s",
            }}
          />
          <div
            style={{
              width: `${missedPct}%`,
              background: "#f85149",
              transition: "width 0.5s",
            }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#3fb950]">✅ Done — {donePct}%</span>
          <span className="text-[#f85149]">❌ Missed — {missedPct}%</span>
        </div>

        {/* GenZ message */}
        <div
          className="mt-3 text-xs text-center"
          style={{
            color:
              missedPct === 0
                ? "#39d353"
                : missedPct < 30
                  ? "#f0883e"
                  : "#f85149",
          }}
        >
          {missedPct === 0
            ? "🏆 No cap — zero miss! GOAT behavior fr fr!"
            : missedPct < 20
              ? "🔥 Almost perfect bestie! Thoda aur!"
              : missedPct < 50
                ? "💪 Room for improvement! Sigma grindset karo!"
                : missedPct < 80
                  ? "😤 Bro really missed a lot fr fr... Uth ja!"
                  : "💀 Tumse na ho payega! Abhi se shuru karo!"}
        </div>
      </div>

      {/* Missed tasks list */}
      {sortedDates.length === 0 ? (
        <div className="bg-[#0e4429] border border-[#238636] rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-lg font-bold text-[#39d353] mb-2">
            Zero Miss!
          </div>
          <div className="text-sm text-[#8b949e]">
            No cap — sab tasks complete kiye! GOAT behavior! 🐐
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xs text-[#8b949e] mb-3 font-medium uppercase tracking-wider">
            Missed tasks — {activeTab}
          </div>
          {sortedDates.map((dayKey) => {
            const isToday = dayKey === toKey(today);
            return (
              <div
                key={dayKey}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-3"
              >
                {/* Date header */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    style={{
                      fontSize: 11,
                      padding: "2px 10px",
                      borderRadius: 20,
                      background: isToday ? "#3d1c1c" : "#21262d",
                      color: isToday ? "#f85149" : "#8b949e",
                      border: `1px solid ${isToday ? "#6e2c2c" : "#30363d"}`,
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(dayKey)}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#f85149",
                      background: "#3d1c1c",
                      border: "1px solid #6e2c2c",
                      borderRadius: 20,
                      padding: "2px 8px",
                    }}
                  >
                    {groupedByDate[dayKey].length} missed
                  </div>
                </div>

                {/* Missed habits */}
                <div className="flex flex-wrap gap-2">
                  {groupedByDate[dayKey].map((habit) => (
                    <div
                      key={habit}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        borderRadius: 10,
                        background: "#0d1117",
                        border: "1px solid #3d1c1c",
                        fontSize: 13,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#f85149",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: "#e6edf3" }}>{habit}</span>
                      <span style={{ color: "#f85149", fontSize: 11 }}>❌</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
