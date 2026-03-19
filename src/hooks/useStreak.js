import { toKey } from "../utils/dateHelpers";

export function useStreak(habit, data, today) {
  let streak = 0;
  const d = new Date(today);
  const todayKey = toKey(today);

  for (let i = 0; i < 366; i++) {
    const k = toKey(d);
    if (data[k] && data[k][habit]) streak++;
    else if (k !== todayKey) break;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}
