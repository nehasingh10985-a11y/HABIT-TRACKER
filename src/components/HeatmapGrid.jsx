import { useState } from "react";
import { toKey, getLevel } from "../utils/dateHelpers";
import { CELL_COLORS } from "../utils/constants";

export default function HeatmapGrid({ data, habits }) {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDay, setSelectedDay] = useState(null);

  // Available years — 2 saal pehle se aaj tak
  const availableYears = [currentYear - 2, currentYear - 1, currentYear];

  // Year ke hisaab se start aur end set karo
  const isCurrentYear = selectedYear === currentYear;
  const end = isCurrentYear ? new Date(today) : new Date(selectedYear, 11, 31);
  const start = new Date(selectedYear, 0, 1);

  // Grid build karo
  let cur = new Date(start);
  const dow = cur.getDay() || 7;
  if (dow > 1) cur.setDate(cur.getDate() - (dow - 1));

  const weeks = [];
  let week = [];
  while (cur <= end) {
    if (cur.getDay() === 1 && week.length) {
      weeks.push(week);
      week = [];
    }
    week.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  if (week.length) weeks.push(week);

  // Month labels
  const monthLabels = [];
  let prevMonth = -1;
  weeks.forEach((w, i) => {
    const m = w[0].getMonth();
    if (m !== prevMonth && w[0].getFullYear() === selectedYear) {
      monthLabels.push({
        idx: i,
        label: w[0].toLocaleString("default", { month: "short" }),
      });
      prevMonth = m;
    }
  });

  const getDoneHabits = (k) => {
    const d = data[k] || {};
    return habits.filter((h) => d[h]);
  };

  const formatDate = (dateKey) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const todayKey = toKey(today);
  const selectedDoneHabits = selectedDay ? getDoneHabits(selectedDay) : [];
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Year ka total stats
  const yearDays = Object.keys(data).filter((k) =>
    k.startsWith(`${selectedYear}-`),
  );
  const yearActiveDays = yearDays.filter(
    (k) => getDoneHabits(k).length > 0,
  ).length;
  const yearTotalDone = yearDays.reduce(
    (sum, k) => sum + getDoneHabits(k).length,
    0,
  );

  return (
    <div>
      {/* Year selector + stats */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYear(yr);
                setSelectedDay(null);
              }}
              style={{
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                border:
                  selectedYear === yr
                    ? "1px solid #2ea043"
                    : "1px solid #30363d",
                background: selectedYear === yr ? "#238636" : "#161b22",
                color: selectedYear === yr ? "#fff" : "#8b949e",
                transition: "all 0.2s",
              }}
            >
              {yr} {yr === currentYear ? "← Abhi" : ""}
            </button>
          ))}
        </div>

        {/* Year stats */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-[#8b949e]">
            <span className="text-[#3fb950] font-medium">{yearActiveDays}</span>{" "}
            active days
          </div>
          <div className="text-xs text-[#8b949e]">
            <span className="text-[#58a6ff] font-medium">{yearTotalDone}</span>{" "}
            habits done
          </div>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-xs text-[#8b949e] mb-2">
        👆 Kisi bhi square pe click karo us din ki habits dekhne ke liye
        {isCurrentYear && (
          <span className="ml-2 text-[#58a6ff]">🔵 = Aaj ka din</span>
        )}
      </p>

      <div
        className="bg-[#161b22] border border-[#30363d] rounded-xl p-4"
        style={{ overflowX: "auto" }}
      >
        {/* Month labels */}
        <div style={{ display: "flex", marginBottom: 4, marginLeft: 40 }}>
          {monthLabels.map((ml, i) => (
            <div
              key={i}
              style={{
                width:
                  weeks.slice(ml.idx, monthLabels[i + 1]?.idx ?? weeks.length)
                    .length * 18,
                fontSize: 11,
                color: "#8b949e",
                minWidth: 18,
              }}
            >
              {ml.label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 3 }}>
          {/* Day labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              marginRight: 4,
              width: 36,
            }}
          >
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                style={{
                  fontSize: 9,
                  color: "#8b949e",
                  height: 15,
                  lineHeight: "15px",
                  textAlign: "right",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div
              key={wi}
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {DAY_LABELS.map((_, di) => {
                const d = week[di];
                if (!d)
                  return <div key={di} style={{ width: 15, height: 15 }} />;
                const k = toKey(d);
                const inYear = d >= start && d <= end;
                if (!inYear)
                  return (
                    <div
                      key={di}
                      style={{ width: 15, height: 15, visibility: "hidden" }}
                    />
                  );
                const count = getDoneHabits(k).length;
                const level = getLevel(count, habits.length);
                const isTodayCell = k === todayKey;
                const isSelected = k === selectedDay;
                return (
                  <div
                    key={di}
                    onClick={() => setSelectedDay(isSelected ? null : k)}
                    title={`${formatDate(k)}: ${count}/${habits.length} habits`}
                    style={{
                      width: 15,
                      height: 15,
                      background: isTodayCell ? "#1f6feb" : CELL_COLORS[level],
                      borderRadius: 3,
                      border: isSelected
                        ? "2px solid #f0883e"
                        : isTodayCell
                          ? "2px solid #58a6ff"
                          : "1px solid #21262d",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      transition: "transform 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.6)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, color: "#8b949e" }}>0 habits</span>
            {CELL_COLORS.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 15,
                  height: 15,
                  background: c,
                  borderRadius: 3,
                  border: "1px solid #21262d",
                }}
              />
            ))}
            <span style={{ fontSize: 11, color: "#8b949e" }}>
              Saari habits ✓
            </span>
          </div>
          {isCurrentYear && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 15,
                  height: 15,
                  background: "#1f6feb",
                  borderRadius: 3,
                  border: "2px solid #58a6ff",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ fontSize: 11, color: "#58a6ff" }}>Aaj</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="mt-3 rounded-xl overflow-hidden border border-[#30363d]">
          <div className="flex items-center justify-between px-4 py-3 bg-[#21262d]">
            <div>
              <div className="text-sm font-medium text-[#e6edf3]">
                {selectedDay === todayKey ? "📅 Aaj — " : ""}
                {formatDate(selectedDay)}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{
                  color:
                    selectedDoneHabits.length === 0
                      ? "#8b949e"
                      : selectedDoneHabits.length === habits.length
                        ? "#39d353"
                        : "#f0883e",
                }}
              >
                {selectedDoneHabits.length === 0
                  ? "❌ Koi habit complete nahi ki thi"
                  : selectedDoneHabits.length === habits.length
                    ? "🎉 Saari habits complete ki thi!"
                    : `✅ ${selectedDoneHabits.length} complete — ❌ ${habits.length - selectedDoneHabits.length} miss`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{
                    color:
                      selectedDoneHabits.length === habits.length
                        ? "#39d353"
                        : selectedDoneHabits.length === 0
                          ? "#8b949e"
                          : "#f0883e",
                  }}
                >
                  {habits.length
                    ? Math.round(
                        (selectedDoneHabits.length / habits.length) * 100,
                      )
                    : 0}
                  %
                </div>
                <div className="text-[10px] text-[#8b949e]">complete</div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-[#8b949e] hover:text-white text-xl px-1"
              >
                ×
              </button>
            </div>
          </div>
          <div className="bg-[#0d1117] divide-y divide-[#21262d]">
            {habits.map((habit) => {
              const done = (data[selectedDay] || {})[habit];
              return (
                <div
                  key={habit}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      flexShrink: 0,
                      background: done ? "#238636" : "#21262d",
                      border: `1px solid ${done ? "#2ea043" : "#30363d"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {done && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm flex-1 ${done ? "text-[#e6edf3]" : "text-[#6e7681] line-through"}`}
                  >
                    {habit}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 10px",
                      borderRadius: 20,
                      background: done ? "#0e4429" : "#21262d",
                      color: done ? "#39d353" : "#6e7681",
                      border: `1px solid ${done ? "#238636" : "#30363d"}`,
                    }}
                  >
                    {done ? "✓ Done" : "Missed"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
