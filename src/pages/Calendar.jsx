import { useState } from "react";
import { useHabits } from "../hooks/useHabits";
import { toKey } from "../utils/dateHelpers";

export default function Calendar() {
  const { habits, data } = useHabits();
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getDayData = (day) => {
    const k = toKey(new Date(year, month, day));
    return data[k] || {};
  };

  const getDoneCount = (day) => {
    const d = getDayData(day);
    return habits.filter((h) => d[h]).length;
  };

  const getCellColor = (count) => {
    if (!count) return "bg-[#161b22] border-[#30363d]";
    const r = count / habits.length;
    if (r < 0.25) return "bg-[#0e4429] border-[#0e4429]";
    if (r < 0.5) return "bg-[#006d32] border-[#006d32]";
    if (r < 0.75) return "bg-[#26a641] border-[#26a641]";
    return "bg-[#39d353] border-[#39d353]";
  };

  const isToday = (day) => toKey(new Date(year, month, day)) === toKey(today);
  const isFuture = (day) => new Date(year, month, day) > today;

  const selectedKey = selectedDay
    ? toKey(new Date(year, month, selectedDay))
    : null;
  const selectedData = selectedKey ? data[selectedKey] || {} : {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Calendar</h1>
      <p className="text-sm text-[#8b949e] mb-6">
        Click any day to see habit details
      </p>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 mb-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#58a6ff] flex items-center justify-center text-lg"
          >
            ‹
          </button>
          <span className="text-base font-medium text-[#e6edf3]">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#58a6ff] flex items-center justify-center text-lg"
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center text-xs text-[#8b949e] py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for first week */}
          {Array.from({ length: firstDay - 1 }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const count = getDoneCount(day);
            const future = isFuture(day);
            const todayDay = isToday(day);
            const selected = selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => !future && setSelectedDay(selected ? null : day)}
                className={`
                  relative rounded-lg p-1.5 text-center cursor-pointer transition-all border
                  ${future ? "opacity-30 cursor-default" : "hover:border-[#58a6ff]"}
                  ${selected ? "border-[#58a6ff] ring-1 ring-[#58a6ff]" : getCellColor(future ? 0 : count)}
                `}
              >
                <span
                  className={`text-xs font-medium ${todayDay ? "text-[#58a6ff]" : count > 0 ? "text-white" : "text-[#8b949e]"}`}
                >
                  {day}
                </span>
                {todayDay && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#58a6ff] rounded-full" />
                )}
                {!future && count > 0 && (
                  <div className="text-[9px] text-white/70 leading-none">
                    {count}/{habits.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="text-xs text-[#8b949e]">Completion:</span>
          {[
            { color: "bg-[#161b22]", label: "0%" },
            { color: "bg-[#0e4429]", label: "1-25%" },
            { color: "bg-[#006d32]", label: "25-50%" },
            { color: "bg-[#26a641]", label: "50-75%" },
            { color: "bg-[#39d353]", label: "75-100%" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div
                className={`w-3 h-3 rounded ${l.color} border border-[#30363d]`}
              />
              <span className="text-xs text-[#8b949e]">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day Detail Panel */}
      {selectedDay && (
        <div className="bg-[#161b22] border border-[#58a6ff] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-[#e6edf3]">
              {new Date(year, month, selectedDay).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-[#8b949e] hover:text-white text-lg"
            >
              ×
            </button>
          </div>

          {habits.length === 0 ? (
            <p className="text-sm text-[#8b949e]">No habits added yet.</p>
          ) : (
            <div className="space-y-2">
              {habits.map((h) => (
                <div key={h} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${selectedData[h] ? "bg-[#238636] border border-[#2ea043] text-white" : "bg-[#0d1117] border border-[#30363d] text-[#8b949e]"}`}
                  >
                    {selectedData[h] ? "✓" : ""}
                  </div>
                  <span
                    className={`text-sm ${selectedData[h] ? "text-[#e6edf3]" : "text-[#8b949e]"}`}
                  >
                    {h}
                  </span>
                  <span
                    className={`ml-auto text-xs ${selectedData[h] ? "text-[#3fb950]" : "text-[#8b949e]"}`}
                  >
                    {selectedData[h] ? "Done ✓" : "Missed"}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#21262d] pt-3 mt-3">
                <span className="text-sm text-[#8b949e]">
                  Completed:{" "}
                  <span className="text-[#58a6ff] font-medium">
                    {habits.filter((h) => selectedData[h]).length}/
                    {habits.length} habits
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
