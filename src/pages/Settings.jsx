import { useState, useEffect } from "react";

export default function Settings() {
  const [cleared, setCleared] = useState(false);
  const [notifStatus, setNotifStatus] = useState("default");
  const [soundOn, setSoundOn] = useState(
    localStorage.getItem("ht_sound") !== "false",
  );

  const toggleSound = () => {
    const newVal = !soundOn;
    setSoundOn(newVal);
    localStorage.setItem("ht_sound", String(newVal));
  };

  useEffect(() => {
    setNotifStatus(Notification.permission);
  }, []);

  const enableReminders = async () => {
    const p = await Notification.requestPermission();
    setNotifStatus(p);
    if (p === "granted") {
      new Notification("✅ Reminders On!", {
        body: "Ab aapko incomplete tasks ka reminder milega! 🔥",
      });
    }
  };

  const testReminder = () => {
    if (Notification.permission === "granted") {
      new Notification("⏰ HabitTracker Reminder", {
        body: "Yeh ek test reminder hai! Aaj ki habits complete karo 💪",
      });
    }
  };

  const clearData = () => {
    if (window.confirm("Sab data delete ho jaega. Sure ho?")) {
      localStorage.removeItem("ht_data");
      localStorage.removeItem("ht_habits");
      setCleared(true);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const exportData = () => {
    const d = {
      habits: JSON.parse(localStorage.getItem("ht_habits") || "[]"),
      data: JSON.parse(localStorage.getItem("ht_data") || "{}"),
    };
    const blob = new Blob([JSON.stringify(d, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "habit-data.json";
    a.click();
  };

  // 🔥 YAHAN NAYA SCHEDULE ADD KIYA HAI 🔥
  const SCHEDULE = [
    { label: "2m", emoji: "⏱️", msg: "2 minute ho gaye! Shuru ho jao!" },
    {
      label: "5m",
      emoji: "⏰",
      msg: "5 minute nikal gaye! Tasks pe dhyan do!",
    },
    {
      label: "30m",
      emoji: "⏳",
      msg: "Aadha ghanta (30m)! Aadha time nikal gaya!",
    },
    { label: "1h", emoji: "😤", msg: "1 ghanta ho gaya! Focus karo bhai!" },
    { label: "2h", emoji: "💪", msg: "2 ghante! Keep going, rukna mat!" },
    { label: "3h", emoji: "😱", msg: "3 ghante ho gaye! Serious ho jao!" },
    { label: "4h", emoji: "👀", msg: "4 ghante! Piche mat raho!" },
    { label: "5h", emoji: "🔥", msg: "5 ghante! Jaldi finish karo!" },
    { label: "6h", emoji: "🚨", msg: "6 ghante nikal gaye! Kya kar rahe ho?" },
    {
      label: "7h",
      emoji: "⚠️",
      msg: "7 ghante! Adha din khatam hone wala hai!",
    },
    { label: "8h", emoji: "😮‍💨", msg: "8 ghante! Thoda push karo!" },
    { label: "9h", emoji: "🎯", msg: "9 ghante! Target poora karo!" },
    { label: "10h", emoji: "⏳", msg: "10 ghante! Time flies!" },
    { label: "11h", emoji: "😭", msg: "11 ghante! Kuch toh karo yaar!" },
    { label: "12h", emoji: "🌙", msg: "12 ghante! Half day done!" },
    { label: "13h", emoji: "😤", msg: "13 ghante! Thoda sa bacha hai!" },
    { label: "14h", emoji: "⚡", msg: "14 ghante! Energy lao!" },
    { label: "15h", emoji: "🏃", msg: "15 ghante! Bhag k karo!" },
    { label: "16h", emoji: "🆘", msg: "16 ghante! Help chahiye kya?" },
    { label: "17h", emoji: "🚨", msg: "17 ghante! Last few hours hai!" },
    { label: "18h", emoji: "👀", msg: "18 ghante! Dekh lo bhai..." },
    { label: "19h", emoji: "😱", msg: "19 ghante! Abhi nahi toh kab?" },
    { label: "20h", emoji: "🤯", msg: "20 ghante! Bas 4 bache hain!" },
    { label: "21h", emoji: "🔴", msg: "21 ghante! Sirf 3 ghante bacha hai!" },
    { label: "22h", emoji: "⌛", msg: "22 ghante! Time khatam hone wala hai!" },
    { label: "23h", emoji: "🆘", msg: "Sirf 1 ghanta bacha hai! ABHI KARO!" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-[#8b949e] mb-6">Manage your habit tracker</p>

      {/* Reminders Section */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium">
        🔔 Reminders
      </div>
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-5 mb-6">
        {/* Permission row */}
        <div className="flex items-center justify-between py-4 border-b border-[#21262d]">
          <div>
            <div className="text-sm font-medium text-[#e6edf3]">
              Incomplete Task Reminders
            </div>
            <div className="text-xs text-[#8b949e] mt-0.5">
              Time to time aapko yaad dilayega jab tak tasks pending hain
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifStatus === "granted" && (
              <button
                onClick={testReminder}
                className="px-3 py-2 rounded-lg border border-[#30363d] bg-[#21262d] text-[#e6edf3] text-xs"
              >
                Test 🔔
              </button>
            )}
            <button
              onClick={enableReminders}
              className={`px-4 py-2 rounded-lg text-sm ${
                notifStatus === "granted"
                  ? "bg-[#238636] text-white border border-[#2ea043]"
                  : notifStatus === "denied"
                    ? "bg-[#3d1c1c] text-[#f85149] border border-[#6e2c2c]"
                    : "bg-[#21262d] text-[#e6edf3] border border-[#30363d]"
              }`}
            >
              {notifStatus === "granted"
                ? "✅ ON"
                : notifStatus === "denied"
                  ? "❌ Blocked"
                  : "Enable"}
            </button>
          </div>
        </div>

        {/* Reminder schedule */}
        <div className="py-4">
          <div className="text-xs text-[#8b949e] mb-3">
            Reminder schedule — agar habits incomplete rahein:
          </div>

          <div className="flex flex-wrap gap-2">
            {SCHEDULE.map(({ label, emoji, msg }) => (
              <div
                key={label}
                title={msg}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#21262d] cursor-default"
              >
                <span style={{ fontSize: 14 }}>{emoji}</span>
                <span className="text-xs text-[#58a6ff] font-medium">
                  {label}
                </span>
                <span className="text-xs text-[#8b949e] hidden sm:block">
                  — {msg}
                </span>
              </div>
            ))}
          </div>

          {/* Status messages */}
          {notifStatus === "denied" && (
            <div className="mt-3 text-xs text-[#f85149] bg-[#3d1c1c] border border-[#6e2c2c] rounded-lg px-3 py-2">
              ⚠️ Browser ne notifications block kar diya hai! Browser settings
              mein jaake allow karo.
            </div>
          )}
          {notifStatus !== "granted" && notifStatus !== "denied" && (
            <div className="mt-3 text-xs text-[#8b949e] bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2">
              💡 Enable karo aur allow karo — phir reminders milne shuru honge!
            </div>
          )}
          {notifStatus === "granted" && (
            <div className="mt-3 text-xs text-[#3fb950] bg-[#0e4429] border border-[#238636] rounded-lg px-3 py-2">
              ✅ Reminders active hain! Habits incomplete rahein toh yaad dilata
              rahega.
            </div>
          )}
        </div>
      </div>

      {/* Sound Section */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium">🔊 Sound</div>
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-5 mb-6">
        <div className="flex items-center justify-between py-4">
          <div>
            <div className="text-sm font-medium text-[#e6edf3]">
              Sound Effects
            </div>
            <div className="text-xs text-[#8b949e] mt-0.5">
              Habit check/uncheck aur celebration sounds
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-lg text-sm ${
              soundOn
                ? "bg-[#238636] text-white border border-[#2ea043]"
                : "bg-[#21262d] text-[#8b949e] border border-[#30363d]"
            }`}
          >
            {soundOn ? "🔊 ON" : "🔇 OFF"}
          </button>
        </div>
      </div>

      {/* Data Section */}
      <div className="text-xs text-[#8b949e] mb-3 font-medium">💾 Data</div>
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-5">
        <div className="flex items-center justify-between py-4 border-b border-[#21262d]">
          <div>
            <div className="text-sm font-medium text-[#e6edf3]">
              Export Data
            </div>
            <div className="text-xs text-[#8b949e] mt-0.5">
              Download your data as JSON
            </div>
          </div>
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-lg border border-[#30363d] bg-[#21262d] text-[#e6edf3] text-sm cursor-pointer"
          >
            Export
          </button>
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <div className="text-sm font-medium text-[#e6edf3]">
              Clear All Data
            </div>
            <div className="text-xs text-[#8b949e] mt-0.5">
              Delete all habits permanently
            </div>
          </div>
          <button
            onClick={clearData}
            className="px-4 py-2 rounded-lg border border-[#6e2c2c] bg-[#3d1c1c] text-[#f85149] text-sm cursor-pointer"
          >
            {cleared ? "Cleared! ✓" : "Clear"}
          </button>
        </div>
      </div>

      <p className="text-center text-[#30363d] text-xs mt-8">
        HabitTracker v1.0 — Built with React + Vite + Tailwind
      </p>
    </div>
  );
}
