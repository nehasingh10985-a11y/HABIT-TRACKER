import { useHabits } from "../hooks/useHabits";
import { toKey } from "../utils/dateHelpers";

const COLORS = [
  "#58a6ff",
  "#f0883e",
  "#3fb950",
  "#d2a8ff",
  "#ff6b6b",
  "#39d353",
  "#ffa657",
];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCurrentWeekDays(today) {
  const days = [];
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(toKey(d));
  }
  return days;
}

function ProgressRing({ pct, color, size = 72 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#21262d"
        strokeWidth={5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export default function WeeklySummary() {
  const { habits, data, today } = useHabits();

  const currentWeek = getCurrentWeekDays(today);

  const getDone = (habit, days) => days.filter((k) => data[k]?.[habit]).length;
  const activeDays = (days) => days.filter((k) => new Date(k) <= today).length;
  const totalDone = (days) =>
    habits.reduce((sum, h) => sum + getDone(h, days), 0);
  const totalPossible = (days) => habits.length * activeDays(days);
  const getPct = (days) => {
    const possible = totalPossible(days);
    return possible ? Math.round((totalDone(days) / possible) * 100) : 0;
  };

  // Last 4 weeks — fix: weeks array se last4 banao
  const last4 = Array.from({ length: 4 }, (_, w) => {
    const ref = new Date(today);
    ref.setDate(today.getDate() - w * 7);
    const days = getCurrentWeekDays(ref);
    const active = activeDays(days);
    const done = totalDone(days);
    const possible = habits.length * active;
    const pct = possible ? Math.round((done / possible) * 100) : 0;
    return {
      days,
      done,
      possible,
      pct,
      label: w === 0 ? "This week" : `${w}w ago`,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Weekly Summary</h1>
      <p className="text-sm text-[#8b949e] mb-6">
        Monday to Sunday — your consistency at a glance
      </p>

      {/* This week banner */}
      <div className="bg-[#161b22] border border-[#238636] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-[#8b949e] mb-1">This week</div>
            <div className="text-xl font-bold text-[#3fb950]">
              {totalDone(currentWeek)}/{totalPossible(currentWeek)} habits done
            </div>
          </div>
          <div className="relative">
            <ProgressRing pct={getPct(currentWeek)} color="#3fb950" size={72} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[#3fb950]">
                {getPct(currentWeek)}%
              </span>
            </div>
          </div>
        </div>

        {/* Per habit progress bars */}
        {habits.map((h, i) => {
          const done = getDone(h, currentWeek);
          const active = activeDays(currentWeek);
          const p = active ? Math.round((done / active) * 100) : 0;
          return (
            <div key={h} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: COLORS[i % COLORS.length] }}>{h}</span>
                <span className="text-[#8b949e]">
                  {done}/{active} days — {p}%
                </span>
              </div>
              <div className="bg-[#21262d] rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${p}%`,
                    background: COLORS[i % COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress rings */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium">
        Per habit — this week
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 mb-5">
        {habits.map((h, i) => {
          const done = getDone(h, currentWeek);
          const active = activeDays(currentWeek);
          const p = active ? Math.round((done / active) * 100) : 0;
          return (
            <div
              key={h}
              className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 flex flex-col items-center"
            >
              <div className="relative mb-2">
                <ProgressRing
                  pct={p}
                  color={COLORS[i % COLORS.length]}
                  size={64}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-xs font-bold"
                    style={{ color: COLORS[i % COLORS.length] }}
                  >
                    {p}%
                  </span>
                </div>
              </div>
              <div className="text-xs font-medium text-[#e6edf3] text-center">
                {h}
              </div>
              <div className="text-[10px] text-[#8b949e] mt-0.5">
                {done}/{active} days
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily breakdown */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium">
        Daily breakdown — Mon to Sun
      </div>
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 mb-5">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {DAY_LABELS.map((d, i) => {
            const k = currentWeek[i];
            const isToday = k === toKey(today);
            const isFuture = new Date(k) > today;
            return (
              <div key={d} className="text-center">
                <div
                  className={`text-xs mb-1 ${isToday ? "text-[#58a6ff] font-medium" : "text-[#8b949e]"}`}
                >
                  {d}
                </div>
                <div
                  className={`text-xs font-medium ${isToday ? "text-[#58a6ff]" : isFuture ? "text-[#30363d]" : "text-[#8b949e]"}`}
                >
                  {new Date(k).getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bars per habit */}
        {habits.map((h, hi) => (
          <div key={h} className="mb-3 last:mb-0">
            <div
              className="text-xs mb-1.5"
              style={{ color: COLORS[hi % COLORS.length] }}
            >
              {h}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {currentWeek.map((k, di) => {
                const done = data[k]?.[h];
                const isFuture = new Date(k) > today;
                const isToday = k === toKey(today);
                return (
                  <div
                    key={di}
                    style={{
                      height: 32,
                      borderRadius: 6,
                      background: done
                        ? COLORS[hi % COLORS.length]
                        : isFuture
                          ? "#0d1117"
                          : "#21262d",
                      border: isToday
                        ? `1px solid ${COLORS[hi % COLORS.length]}`
                        : "1px solid #30363d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      transition: "all 0.2s",
                    }}
                  >
                    {done ? "✓" : ""}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="text-sm text-[#8b949e] text-center py-4">
            Koi habit nahi hai. Dashboard pe add karo!
          </div>
        )}
      </div>

      {/* Last 4 weeks trend */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium">
        Last 4 weeks — trend
      </div>
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
        {last4.map(({ label, done, possible, pct }, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-sm ${i === 0 ? "text-[#e6edf3] font-medium" : "text-[#8b949e]"}`}
              >
                {label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8b949e]">
                  {done}/{possible}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color:
                      pct >= 80 ? "#39d353" : pct >= 50 ? "#f0883e" : "#8b949e",
                  }}
                >
                  {pct}%
                </span>
              </div>
            </div>
            <div className="bg-[#21262d] rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background:
                    i === 0
                      ? "#238636"
                      : pct >= 80
                        ? "#3fb950"
                        : pct >= 50
                          ? "#f0883e"
                          : "#8b949e",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
