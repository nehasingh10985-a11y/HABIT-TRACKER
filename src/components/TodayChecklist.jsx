import {
  playCheckSound,
  playUncheckSound,
  playAllDoneSound,
  warmUpAudio,
} from "../utils/sounds";
import { getStreak } from "../utils/dateHelpers";

export default function TodayChecklist({
  habits,
  checked,
  onToggle,
  data,
  today,
}) {
  const handleToggle = (habit) => {
    // Audio warm up — first click pe
    warmUpAudio();

    const willBeChecked = !checked[habit];
    const newDoneCount = habits.filter((h) =>
      h === habit ? willBeChecked : !!checked[h],
    ).length;

    if (willBeChecked) {
      if (newDoneCount === habits.length) {
        playAllDoneSound();
      } else {
        playCheckSound();
      }
    } else {
      playUncheckSound();
    }

    onToggle(habit);
  };

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: 12,
        padding: "16px 20px",
      }}
    >
      <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 14 }}>
        {today.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      {habits.map((h) => {
        const streak = getStreak(h, data, today);
        const done = checked[h];
        return (
          <div
            key={h}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: "1px solid #21262d",
            }}
          >
            <div
              onClick={() => handleToggle(h)}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: `2px solid ${done ? "#238636" : "#30363d"}`,
                background: done ? "#238636" : "#0d1117",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 12,
                color: "#fff",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {done ? "✓" : ""}
            </div>
            <span
              style={{
                fontSize: 14,
                flex: 1,
                color: done ? "#8b949e" : "#e6edf3",
                textDecoration: done ? "line-through" : "none",
              }}
            >
              {h}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#f0883e",
                background: "#1c2128",
                border: "1px solid #30363d",
                borderRadius: 20,
                padding: "2px 8px",
              }}
            >
              🔥 {streak} day streak
            </span>
          </div>
        );
      })}
    </div>
  );
}
