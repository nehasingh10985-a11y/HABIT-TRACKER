import { CELL_COLORS } from "./constants";

export function toKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getLevel(count, totalHabits) {
  if (count === 0) return 0;
  if (count === totalHabits) return CELL_COLORS.length - 1;
  return Math.max(
    0,
    Math.min(
      CELL_COLORS.length - 1,
      Math.ceil((count / totalHabits) * (CELL_COLORS.length - 1)) - 1,
    ),
  );
}

export function getStreak(habit, data, today) {
  let streak = 0;
  const d = new Date(today);
  const todayKey = toKey(today);

  for (let i = 0; i < 366; i++) {
    const key = toKey(d);
    if (data[key] && data[key][habit]) {
      streak++;
    } else if (key !== todayKey) {
      break;
    }
    d.setDate(d.getDate() - 1);
  }

  return streak;
}
