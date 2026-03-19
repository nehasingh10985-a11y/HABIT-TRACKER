export default function StatCard({ value, label, color = "#58a6ff", icon }) {
  return (
    <div
      className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex-1 min-w-[110px]"
      style={{ transition: "border-color 0.2s, transform 0.2s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#30363d";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {icon && <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>}
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-[#8b949e] mt-1">{label}</div>
    </div>
  );
}
