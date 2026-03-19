export default function HabitPill({ name, streak, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
        active
          ? "bg-[#238636] border-[#2ea043] text-white"
          : "bg-[#161b22] border-[#30363d] text-[#e6edf3] hover:border-[#58a6ff]"
      }`}
    >
      {name} 🔥{streak}
    </button>
  );
}
