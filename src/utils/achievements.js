// XP values
export const XP_PER_HABIT = 10;
export const XP_PER_STREAK_DAY = 5;
export const XP_ACHIEVEMENT = 100;

// Levels
export const LEVELS = [
  { level: 1, name: "Noob", emoji: "🥚", minXP: 0, color: "#8b949e" },
  { level: 2, name: "Apprentice", emoji: "🌱", minXP: 100, color: "#3fb950" },
  { level: 3, name: "Grinder", emoji: "💪", minXP: 300, color: "#58a6ff" },
  { level: 4, name: "Sigma", emoji: "🔥", minXP: 600, color: "#f0883e" },
  { level: 5, name: "GOAT", emoji: "🐐", minXP: 1000, color: "#d2a8ff" },
  { level: 6, name: "LEGEND", emoji: "👑", minXP: 2000, color: "#ffd700" },
];

export const getLevel = (xp) => {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) current = l;
  }
  return current;
};

export const getNextLevel = (xp) => {
  for (const l of LEVELS) {
    if (xp < l.minXP) return l;
  }
  return null;
};

export const calcXP = (data, habits) => {
  let xp = 0;
  Object.values(data).forEach((d) => {
    habits.forEach((h) => {
      if (d[h]) xp += XP_PER_HABIT;
    });
  });
  return xp;
};

// Achievements — rarity ke saath
export const ACHIEVEMENTS = [
  {
    id: "first_step",
    title: "Era Starter",
    desc: "Completed your first habit!",
    icon: "🌱",
    rarity: "common",
    xp: 50,
    check: (data, habits) =>
      Object.values(data).some((d) => Object.values(d).some(Boolean)),
  },
  {
    id: "perfect_day",
    title: "That Girl Day",
    desc: "All habits done in one day!",
    icon: "⭐",
    rarity: "rare",
    xp: 100,
    check: (data, habits) =>
      Object.values(data).some((d) => habits.every((h) => d[h])),
  },
  {
    id: "week_warrior",
    title: "Week Slay",
    desc: "7 day streak — no days off!",
    icon: "🥇",
    rarity: "rare",
    xp: 150,
    check: (data, habits) =>
      habits.some((h) => {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const k = d.toISOString().split("T")[0];
          if (data[k]?.[h]) streak++;
          else if (i > 0) break;
        }
        return streak >= 7;
      }),
  },
  {
    id: "monthly_master",
    title: "Monthly Main Character",
    desc: "30 day streak — built different!",
    icon: "🏆",
    rarity: "epic",
    xp: 300,
    check: (data, habits) =>
      habits.some((h) => {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 60; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const k = d.toISOString().split("T")[0];
          if (data[k]?.[h]) streak++;
          else if (i > 0) break;
        }
        return streak >= 30;
      }),
  },
  {
    id: "variety",
    title: "Variety Queen",
    desc: "5+ habits — doing it ALL!",
    icon: "🎯",
    rarity: "common",
    xp: 50,
    check: (data, habits) => habits.length >= 5,
  },
  {
    id: "consistent",
    title: "Consistency Girlie",
    desc: "Active on 10+ different days!",
    icon: "💪",
    rarity: "rare",
    xp: 100,
    check: (data, habits) =>
      Object.keys(data).filter((k) => Object.values(data[k]).some(Boolean))
        .length >= 10,
  },
  {
    id: "dedicated",
    title: "That Dedicated",
    desc: "All habits 3 days in a row — periodt!",
    icon: "🔥",
    rarity: "rare",
    xp: 150,
    check: (data, habits) => {
      let count = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const k = d.toISOString().split("T")[0];
        if (habits.every((h) => data[k]?.[h])) count++;
        else count = 0;
        if (count >= 3) return true;
      }
      return false;
    },
  },
  {
    id: "century",
    title: "Century Slay",
    desc: "100 total habits — legend fr fr!",
    icon: "💯",
    rarity: "epic",
    xp: 250,
    check: (data, habits) => {
      let total = 0;
      Object.values(data).forEach((d) => {
        habits.forEach((h) => {
          if (d[h]) total++;
        });
      });
      return total >= 100;
    },
  },
  {
    id: "goat",
    title: "Certified GOAT",
    desc: "Reach Level 5 — GOAT status!",
    icon: "🐐",
    rarity: "legendary",
    xp: 500,
    check: (data, habits) => calcXP(data, habits) >= 1000,
  },
];

export const RARITY_CONFIG = {
  common: {
    label: "Common",
    color: "#8b949e",
    bg: "#21262d",
    border: "#30363d",
  },
  rare: { label: "Rare", color: "#58a6ff", bg: "#1c2d3e", border: "#1f6feb" },
  epic: { label: "Epic", color: "#d2a8ff", bg: "#2d1c4e", border: "#7c4dff" },
  legendary: {
    label: "Legendary",
    color: "#ffd700",
    bg: "#3d2e00",
    border: "#ffd700",
  },
};
