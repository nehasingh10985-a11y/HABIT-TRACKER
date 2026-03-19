import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_HABITS } from "../utils/constants";
import { toKey } from "../utils/dateHelpers";

export function useHabits() {
  const today = new Date();
  const todayKey = toKey(today);

  const [habits, setHabits] = useLocalStorage("ht_habits", DEFAULT_HABITS);
  const [data, setData] = useLocalStorage("ht_data", {});

  // Aaj ka data directly data object se lo
  const todayChecked = data[todayKey] || {};

  const toggleHabit = (habit) => {
    const currentTodayData = data[todayKey] || {};
    const updated = {
      ...data,
      [todayKey]: {
        ...currentTodayData,
        [habit]: !currentTodayData[habit],
      },
    };
    setData(updated);
  };

  const addHabit = (name) => {
    if (name.trim() && !habits.includes(name.trim())) {
      setHabits([...habits, name.trim()]);
    }
  };

  const removeHabit = (name) => {
    setHabits(habits.filter((h) => h !== name));
  };

  return {
    habits,
    data,
    today,
    todayKey,
    todayChecked,
    toggleHabit,
    addHabit,
    removeHabit,
  };
}
