import { QUOTES } from "../utils/constants";

export default function MotivationBox({ doneCount, total }) {
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center text-sm text-[#8b949e] italic mt-4">
      {doneCount === total && total > 0
        ? "🎉 All done today! You are on fire!"
        : doneCount === 0
          ? `💬 "${quote}"`
          : `✅ ${doneCount}/${total} habits done today. Keep going!`}
    </div>
  );
}
