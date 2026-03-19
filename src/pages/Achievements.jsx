import { useHabits } from "../hooks/useHabits";
import {
  ACHIEVEMENTS,
  RARITY_CONFIG,
  LEVELS,
  getLevel,
  getNextLevel,
  calcXP,
} from "../utils/achievements";

function TradingCard({ achievement, unlocked }) {
  const rarity = RARITY_CONFIG[achievement.rarity];
  return (
    <div
      style={{
        background: unlocked ? rarity.bg : "#0d1117",
        border: `1.5px solid ${unlocked ? rarity.border : "#21262d"}`,
        borderRadius: 16,
        padding: "16px 12px",
        textAlign: "center",
        opacity: unlocked ? 1 : 0.45,
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: unlocked ? "default" : "not-allowed",
      }}
      onMouseEnter={(e) => {
        if (unlocked) {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = `0 8px 24px ${rarity.border}44`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Rarity badge */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          fontSize: 9,
          padding: "2px 7px",
          borderRadius: 20,
          background: rarity.bg,
          color: rarity.color,
          border: `1px solid ${rarity.border}`,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {unlocked ? rarity.label : "🔒 Locked"}
      </div>

      {/* XP badge */}
      {unlocked && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 9,
            padding: "2px 7px",
            borderRadius: 20,
            background: "#21262d",
            color: "#f0883e",
            border: "1px solid #30363d",
          }}
        >
          +{achievement.xp} XP
        </div>
      )}

      {/* Icon */}
      <div
        style={{
          fontSize: 40,
          marginTop: 20,
          marginBottom: 8,
          lineHeight: 1,
          filter: unlocked ? "none" : "grayscale(1)",
        }}
      >
        {unlocked ? achievement.icon : "🔒"}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: unlocked ? rarity.color : "#8b949e",
          marginBottom: 4,
        }}
      >
        {achievement.title}
      </div>

      {/* Desc */}
      <div style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.4 }}>
        {achievement.desc}
      </div>

      {/* Legendary glow */}
      {unlocked && achievement.rarity === "legendary" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            border: "1px solid #ffd700",
            animation: "legendaryGlow 2s infinite",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export default function Achievements() {
  const { habits, data } = useHabits();

  const unlocked = ACHIEVEMENTS.filter((a) => a.check(data, habits));
  const locked = ACHIEVEMENTS.filter((a) => !a.check(data, habits));
  const xp = calcXP(data, habits);
  const level = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const xpToNext = nextLevel ? nextLevel.minXP - xp : 0;
  const xpPct = nextLevel
    ? Math.round(((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100)
    : 100;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Achievements</h1>
      <p className="text-sm text-[#8b949e] mb-6">
        {unlocked.length}/{ACHIEVEMENTS.length} unlocked • Collect them all!
      </p>

      {/* Level card */}
      <div
        className="bg-[#161b22] border rounded-xl p-5 mb-6"
        style={{ borderColor: level.color }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#21262d",
              border: `3px solid ${level.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            {level.emoji}
          </div>
          <div>
            <div className="text-xs text-[#8b949e] mb-0.5">Current Level</div>
            <div className="text-xl font-bold" style={{ color: level.color }}>
              Level {level.level} — {level.name}
            </div>
            <div className="text-xs text-[#8b949e]">
              {xp} XP total{" "}
              {nextLevel ? `• ${xpToNext} XP to next level` : "• MAX LEVEL 👑"}
            </div>
          </div>
        </div>

        {/* XP Progress bar */}
        {nextLevel && (
          <>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: level.color }}>{level.name}</span>
              <span className="text-[#8b949e]">
                {nextLevel.name} {nextLevel.emoji}
              </span>
            </div>
            <div className="bg-[#21262d] rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${xpPct}%`,
                  background: level.color,
                }}
              />
            </div>
            <div className="text-xs text-[#8b949e] text-right mt-1">
              {xpPct}%
            </div>
          </>
        )}

        {/* Level roadmap */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1">
          {LEVELS.map((l, i) => (
            <div key={l.level} className="flex items-center gap-1">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: xp >= l.minXP ? l.color : "#21262d",
                    border: `2px solid ${xp >= l.minXP ? l.color : "#30363d"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    opacity: xp >= l.minXP ? 1 : 0.4,
                  }}
                >
                  {l.emoji}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: xp >= l.minXP ? l.color : "#8b949e",
                  }}
                >
                  {l.name}
                </div>
              </div>
              {i < LEVELS.length - 1 && (
                <div
                  style={{
                    width: 20,
                    height: 2,
                    background:
                      xp >= LEVELS[i + 1].minXP ? "#238636" : "#21262d",
                    borderRadius: 2,
                    marginBottom: 14,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Unlocked badges */}
      {unlocked.length > 0 && (
        <>
          <div className="text-xs text-[#8b949e] mb-3 font-medium">
            ✅ Unlocked ({unlocked.length})
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-6">
            {unlocked.map((a) => (
              <TradingCard key={a.id} achievement={a} unlocked={true} />
            ))}
          </div>
        </>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <>
          <div className="text-xs text-[#8b949e] mb-3 font-medium">
            🔒 Locked ({locked.length})
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {locked.map((a) => (
              <TradingCard key={a.id} achievement={a} unlocked={false} />
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes legendaryGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #ffd700; }
          50% { opacity: 0.5; box-shadow: 0 0 20px #ffd700; }
        }
      `}</style>
    </div>
  );
}
