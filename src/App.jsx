import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Calendar from "./pages/Calendar";
import Achievements from "./pages/Achievements";
import WeeklySummary from "./pages/WeeklySummary";
import Settings from "./pages/Settings";
import MissedTasks from "./pages/MissedTasks";
import ReminderPopup from "./components/ReminderPopup";
import { useHabits } from "./hooks/useHabits";
import { warmUpAudio } from "./utils/sounds";

document.addEventListener("click", warmUpAudio, { once: true });

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: "🏠", badge: "Home" },
  { to: "/stats", label: "Stats", icon: "📊", badge: "Analytics" },
  { to: "/weekly", label: "Weekly", icon: "📅", badge: "Summary" },
  { to: "/calendar", label: "Calendar", icon: "🗓️", badge: "History" },
  { to: "/achievements", label: "Achievements", icon: "🏆", badge: "Badges" },
  { to: "/missed", label: "Missed", icon: "❌", badge: "Missed" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const close = () => setOpen(false);

  return (
    <>
      <nav
        style={{
          background: "#161b22",
          borderBottom: "1px solid #21262d",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: "#e6edf3" }}>
          🔥 HabitTracker
        </span>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", gap: 6 }}>
          {[
            ...NAV_LINKS,
            { to: "/settings", label: "Settings", icon: "⚙️", badge: "" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 13,
                textDecoration: "none",
                background: isActive ? "#238636" : "transparent",
                color: isActive ? "#fff" : "#8b949e",
                border: isActive
                  ? "1px solid #2ea043"
                  : "1px solid transparent",
                transition: "all 0.2s",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="hamburger-btn"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
            flexDirection: "column",
            gap: 5,
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: 24,
              height: 2,
              background: "#e6edf3",
              borderRadius: 2,
              transition: "all 0.3s ease",
              transform: open ? "translateY(7px) rotate(45deg)" : "none",
            }}
          />
          <div
            style={{
              width: 24,
              height: 2,
              background: "#e6edf3",
              borderRadius: 2,
              transition: "all 0.3s ease",
              opacity: open ? 0 : 1,
            }}
          />
          <div
            style={{
              width: 24,
              height: 2,
              background: "#e6edf3",
              borderRadius: 2,
              transition: "all 0.3s ease",
              transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className="mobile-drawer"
        style={{
          background: "#161b22",
          borderBottom: open ? "1px solid #21262d" : "none",
          overflow: "hidden",
          maxHeight: open ? 600 : 0,
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
          position: "sticky",
          top: 53,
          zIndex: 99,
          display: "none",
        }}
      >
        <div style={{ padding: "12px 16px 20px" }}>
          {NAV_LINKS.map(({ to, label, icon, badge }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                onClick={close}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  marginBottom: 6,
                  textDecoration: "none",
                  background: isActive ? "#238636" : "transparent",
                  border: `1px solid ${isActive ? "#2ea043" : "#30363d"}`,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>
                  {icon}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#e6edf3",
                    flex: 1,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: isActive ? "rgba(255,255,255,0.15)" : "#21262d",
                    color: isActive ? "#fff" : "#8b949e",
                    border: `1px solid ${isActive ? "transparent" : "#30363d"}`,
                  }}
                >
                  {badge}
                </span>
              </NavLink>
            );
          })}

          <div style={{ height: 1, background: "#21262d", margin: "10px 0" }} />

          <NavLink
            to="/settings"
            onClick={close}
            style={{
              display: "block",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #30363d",
              background: "transparent",
              color: "#8b949e",
              fontSize: 13,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            ⚙️ Settings
          </NavLink>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={close}
          className="mobile-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 98,
            display: "none",
          }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-drawer { display: block !important; }
          .mobile-overlay { display: block !important; }
        }
        @media (min-width: 769px) {
          .hamburger-btn { display: none !important; }
          .mobile-drawer { display: none !important; }
          .mobile-overlay { display: none !important; }
        }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fall { 0%{top:-30px;opacity:1;transform:rotate(0deg)} 100%{top:105vh;opacity:0;transform:rotate(360deg)} }
      `}</style>
    </>
  );
}

function AppContent() {
  const { habits, todayChecked } = useHabits();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/weekly" element={<WeeklySummary />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/missed" element={<MissedTasks />} />
        </Routes>
      </main>

      <ReminderPopup
        habits={habits}
        todayChecked={todayChecked}
        onGoToDashboard={() => navigate("/")}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div
        style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3" }}
      >
        <AppContent />
      </div>
    </Router>
  );
}
