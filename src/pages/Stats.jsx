import { useHabits } from "../hooks/useHabits";
import { toKey, getStreak } from "../utils/dateHelpers";

const COLORS = [
  "#58a6ff",
  "#f0883e",
  "#3fb950",
  "#d2a8ff",
  "#ff6b6b",
  "#39d353",
  "#ffa657",
];

function getLast30Days(today) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(toKey(d));
  }
  return days;
}

export default function Stats() {
  const { habits, data, today } = useHabits();
  const last30 = getLast30Days(today);

  // Per habit stats
  const habitStats = habits.map((h, i) => {
    const doneDays = last30.filter((k) => data[k]?.[h]).length;
    const consistency = last30.length
      ? Math.round((doneDays / last30.length) * 100)
      : 0;
    const streak = getStreak(h, data, today);
    return {
      name: h,
      doneDays,
      consistency,
      streak,
      color: COLORS[i % COLORS.length],
    };
  });

  // Best day — jis din sabse zyada habits complete hue
  const dayScores = last30.map((k) => {
    const done = habits.filter((h) => data[k]?.[h]).length;
    return { key: k, done, date: new Date(k) };
  });

  const bestDay = dayScores.reduce((a, b) => (a.done >= b.done ? a : b), {
    done: 0,
  });
  const worstDay = dayScores
    .filter((d) => d.date < today) // future days mat lo
    .reduce((a, b) => (a.done <= b.done ? a : b), { done: habits.length + 1 });

  const formatDate = (key) => {
    if (!key) return "—";
    const d = new Date(key);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Overall score
  const totalDone = habitStats.reduce((sum, h) => sum + h.doneDays, 0);
  const totalPossible = habits.length * 30;
  const overallPct = totalPossible
    ? Math.round((totalDone / totalPossible) * 100)
    : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Your Stats</h1>
      <p className="text-sm text-[#8b949e] mb-6">
        See how consistent you've been
      </p>

      {/* Overall score */}
      <div className="bg-[#161b22] border border-[#238636] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-[#8b949e] mb-1">
              Last 30 days — Overall
            </div>
            <div className="text-3xl font-bold text-[#39d353]">
              {overallPct}%
            </div>
            <div className="text-xs text-[#8b949e] mt-1">
              {totalDone}/{totalPossible} habits done
            </div>
          </div>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#0e4429",
              border: "3px solid #238636",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#39d353",
            }}
          >
            {overallPct}%
          </div>
        </div>
        <div className="bg-[#21262d] rounded-full h-2 mb-1">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-[#238636]"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="text-xs text-[#8b949e] text-right mt-1">
          {overallPct >= 90
            ? "🏆 GOAT behavior fr fr!"
            : overallPct >= 70
              ? "🔥 Sigma grindset!"
              : overallPct >= 50
                ? "💪 Keep going bestie!"
                : "😤 Time to level up!"}
        </div>
      </div>

      {/* Best day / Worst day */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium uppercase tracking-wider">
        Best & Worst Day — Last 30 days
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Best day */}
        <div className="bg-[#161b22] border border-[#238636] rounded-xl p-4 text-center">
          <div style={{ fontSize: 32, marginBottom: 6 }}>🏆</div>
          <div className="text-xs text-[#8b949e] mb-1 uppercase tracking-wider">
            Best Day
          </div>
          <div className="text-sm font-bold text-[#39d353] mb-1">
            {bestDay.done > 0 ? formatDate(bestDay.key) : "No data"}
          </div>
          <div
            style={{
              fontSize: 11,
              padding: "2px 10px",
              borderRadius: 20,
              background: "#0e4429",
              color: "#39d353",
              border: "1px solid #238636",
              display: "inline-block",
            }}
          >
            {bestDay.done}/{habits.length} habits ✅
          </div>
        </div>

        {/* Worst day */}
        <div className="bg-[#161b22] border border-[#6e2c2c] rounded-xl p-4 text-center">
          <div style={{ fontSize: 32, marginBottom: 6 }}>😬</div>
          <div className="text-xs text-[#8b949e] mb-1 uppercase tracking-wider">
            Worst Day
          </div>
          <div className="text-sm font-bold text-[#f85149] mb-1">
            {worstDay.done < habits.length + 1
              ? formatDate(worstDay.key)
              : "No data"}
          </div>
          <div
            style={{
              fontSize: 11,
              padding: "2px 10px",
              borderRadius: 20,
              background: "#3d1c1c",
              color: "#f85149",
              border: "1px solid #6e2c2c",
              display: "inline-block",
            }}
          >
            {worstDay.done < habits.length + 1
              ? `${worstDay.done}/${habits.length} habits ❌`
              : "—"}
          </div>
        </div>
      </div>

      {/* Habit comparison chart */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium uppercase tracking-wider">
        Habit Comparison — Last 30 days
      </div>
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 mb-5">
        {habits.length === 0 ? (
          <p className="text-sm text-[#8b949e]">
            Koi habit nahi hai. Dashboard pe add karo!
          </p>
        ) : (
          <>
            {/* Bar chart */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 120,
                marginBottom: 8,
              }}
            >
              {habitStats.map((h) => (
                <div
                  key={h.name}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{ fontSize: 10, color: h.color, fontWeight: 600 }}
                  >
                    {h.consistency}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max(h.consistency, 4)}%`,
                      background: h.color,
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.5s ease",
                      minHeight: 4,
                      position: "relative",
                    }}
                  >
                    {h.consistency === 100 && (
                      <div
                        style={{
                          position: "absolute",
                          top: -16,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: 12,
                        }}
                      >
                        👑
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* X axis labels */}
            <div style={{ display: "flex", gap: 8 }}>
              {habitStats.map((h) => (
                <div
                  key={h.name}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 10,
                    color: "#8b949e",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.name.length > 8 ? h.name.slice(0, 8) + "…" : h.name}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div
              style={{ height: 1, background: "#21262d", margin: "16px 0" }}
            />
            <div className="flex flex-wrap gap-2">
              {habitStats.map((h) => (
                <div
                  key={h.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: "#0d1117",
                    border: "1px solid #21262d",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: h.color,
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#e6edf3" }}>
                    {h.name}
                  </span>
                  <span
                    style={{ fontSize: 11, color: h.color, fontWeight: 600 }}
                  >
                    {h.consistency}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
