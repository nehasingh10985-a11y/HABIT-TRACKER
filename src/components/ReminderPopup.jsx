import { useState, useEffect, useRef } from "react";
import { playReminderSound } from "../utils/sounds";

const REMINDERS = [
  {
    hours: 0,
    mins: 2,
    emoji: "⏱️",
    msg: "2 minute ho gaye! Shuru ho jao!",
    color: "#58a6ff",
  },
  {
    hours: 0,
    mins: 5,
    emoji: "⏰",
    msg: "5 minute nikal gaye! Tasks pe dhyan do!",
    color: "#58a6ff",
  },
  {
    hours: 0,
    mins: 30,
    emoji: "⏳",
    msg: "Aadha ghanta (30m)! Aadha time nikal gaya!",
    color: "#f0883e",
  },
  {
    hours: 1,
    mins: 0,
    emoji: "😤",
    msg: "1 ghanta ho gaya! Focus karo bhai!",
    color: "#f0883e",
  },
  {
    hours: 2,
    mins: 0,
    emoji: "💪",
    msg: "2 ghante! Keep going, rukna mat!",
    color: "#f0883e",
  },
  {
    hours: 3,
    mins: 0,
    emoji: "😱",
    msg: "3 ghante ho gaye! Serious ho jao!",
    color: "#f85149",
  },
  {
    hours: 4,
    mins: 0,
    emoji: "👀",
    msg: "4 ghante! Piche mat raho!",
    color: "#f85149",
  },
  {
    hours: 5,
    mins: 0,
    emoji: "🔥",
    msg: "5 ghante! Jaldi finish karo!",
    color: "#f85149",
  },
  {
    hours: 6,
    mins: 0,
    emoji: "🚨",
    msg: "6 ghante nikal gaye! Kya kar rahe ho?",
    color: "#f85149",
  },
  {
    hours: 7,
    mins: 0,
    emoji: "⚠️",
    msg: "7 ghante! Adha din khatam hone wala hai!",
    color: "#f85149",
  },
  {
    hours: 8,
    mins: 0,
    emoji: "😮‍💨",
    msg: "8 ghante! Thoda push karo!",
    color: "#f85149",
  },
  {
    hours: 9,
    mins: 0,
    emoji: "🎯",
    msg: "9 ghante! Target poora karo!",
    color: "#f85149",
  },
  {
    hours: 10,
    mins: 0,
    emoji: "⏳",
    msg: "10 ghante! Time flies!",
    color: "#f85149",
  },
  {
    hours: 11,
    mins: 0,
    emoji: "😭",
    msg: "11 ghante! Kuch toh karo yaar!",
    color: "#f85149",
  },
  {
    hours: 12,
    mins: 0,
    emoji: "🌙",
    msg: "12 ghante! Half day done!",
    color: "#d2a8ff",
  },
  {
    hours: 13,
    mins: 0,
    emoji: "😤",
    msg: "13 ghante! Thoda sa bacha hai!",
    color: "#f85149",
  },
  {
    hours: 14,
    mins: 0,
    emoji: "⚡",
    msg: "14 ghante! Energy lao!",
    color: "#f85149",
  },
  {
    hours: 15,
    mins: 0,
    emoji: "🏃",
    msg: "15 ghante! Bhag k karo!",
    color: "#f85149",
  },
  {
    hours: 16,
    mins: 0,
    emoji: "🆘",
    msg: "16 ghante! Help chahiye kya?",
    color: "#f85149",
  },
  {
    hours: 17,
    mins: 0,
    emoji: "🚨",
    msg: "17 ghante! Last few hours hai!",
    color: "#f85149",
  },
  {
    hours: 18,
    mins: 0,
    emoji: "👀",
    msg: "18 ghante! Dekh lo bhai...",
    color: "#f85149",
  },
  {
    hours: 19,
    mins: 0,
    emoji: "😱",
    msg: "19 ghante! Abhi nahi toh kab?",
    color: "#f85149",
  },
  {
    hours: 20,
    mins: 0,
    emoji: "🤯",
    msg: "20 ghante! Bas 4 bache hain!",
    color: "#f85149",
  },
  {
    hours: 21,
    mins: 0,
    emoji: "🔴",
    msg: "21 ghante! Sirf 3 ghante bacha hai!",
    color: "#f85149",
  },
  {
    hours: 22,
    mins: 0,
    emoji: "⌛",
    msg: "22 ghante! Time khatam hone wala hai!",
    color: "#f85149",
  },
  {
    hours: 23,
    mins: 0,
    emoji: "🆘",
    msg: "Sirf 1 ghanta bacha hai! ABHI KARO!",
    color: "#f85149",
  },
];

const SNOOZE_SECONDS = [1, 3, 5, 7, 9];

const SNOOZE_MSGS = [
  {
    title: "💀 Tumse na ho payega!",
    desc: "Habits khud complete nahi hongi yaar...",
  },
  {
    title: "🗿 Bro really said baad mein AGAIN?",
    desc: "No cap yeh sahi nahi hai fr fr...",
  },
  {
    title: "😭 Aise kaise chalega bestie?",
    desc: "Streak toot jaayegi aur rona mat phir!",
  },
  {
    title: "🐐 GOAT log baad mein nahi kehte!",
    desc: "Sigma grindset activate karo abhi!",
  },
  {
    title: "💅 Main character baad mein nahi kehta!",
    desc: "Uth ja, chal, kar le yaar...",
  },
];

const GO_MSGS = [
  {
    emoji: "🔥",
    title: "Let's gooo bestie!",
    desc: "Sigma grindset activated! No cap fr fr 🐐",
  },
  {
    emoji: "💪",
    title: "That's the spirit!",
    desc: "Main character energy ON hai aaj! ✨",
  },
  {
    emoji: "🌟",
    title: "Yasss queen/king!",
    desc: "Ate and left no crumbs! Go get em! 💅",
  },
  {
    emoji: "🚀",
    title: "GOAT mode: ON!",
    desc: "NPC log dekh rahe hain tujhe 👑",
  },
  {
    emoji: "🎯",
    title: "Built different fr!",
    desc: "Consistency hits different bestie! 🔥",
  },
];

function AnimatedCharacter({ emoji, color }) {
  return (
    <div
      style={{
        position: "relative",
        width: 110,
        height: 110,
        margin: "0 auto 14px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          animation: "ping 1.2s infinite",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 8,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          animation: "ping 1.2s infinite 0.4s",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 12,
          borderRadius: "50%",
          background: "#21262d",
          border: `3px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "bounce 0.5s infinite alternate",
          fontSize: 42,
        }}
      >
        {emoji}
      </div>
    </div>
  );
}

// Go message — tab tak dikhe jab tak "Let's go!" na dabaaye
function GoMessagePopup({ msg, onDone }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "#0e4429",
          border: "2px solid #39d353",
          borderRadius: 20,
          padding: "32px 32px",
          textAlign: "center",
          maxWidth: 300,
          width: "90%",
          animation: "popIn 0.3s ease",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 10, lineHeight: 1 }}>
          {msg.emoji}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#39d353",
            marginBottom: 8,
          }}
        >
          {msg.title}
        </div>
        <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 20 }}>
          {msg.desc}
        </div>
        <button
          onClick={onDone}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 10,
            background: "#238636",
            border: "1px solid #2ea043",
            color: "#fff",
            fontSize: 15,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          Let's go! 🚀
        </button>
      </div>
    </div>
  );
}

export default function ReminderPopup({
  habits,
  todayChecked,
  onGoToDashboard,
  disabled,
}) {
  const [popup, setPopup] = useState(null);
  const [snoozed, setSnoozed] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [goMsg, setGoMsg] = useState(null);

  const [sessionStart] = useState(() => {
    let start = sessionStorage.getItem("app_start_time");
    if (!start) {
      start = Date.now();
      sessionStorage.setItem("app_start_time", start);
    }
    return parseInt(start, 10);
  });

  const [firedKeys, setFiredKeys] = useState(() => {
    const saved = localStorage.getItem("fired_reminders");
    return saved ? JSON.parse(saved) : {};
  });

  const timers = useRef([]);
  const snoozeTimer = useRef(null);
  const countdownInterval = useRef(null);

  const getPendingHabits = () => habits.filter((h) => !todayChecked[h]);
  const allDone = habits.length > 0 && habits.every((h) => todayChecked[h]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("reminder_last_date");
    if (lastDate !== today) {
      localStorage.setItem("fired_reminders", JSON.stringify({}));
      localStorage.setItem("reminder_last_date", today);
      sessionStorage.setItem("app_start_time", Date.now());
      setFiredKeys({});
    }
  }, []);

  const sendNotification = (emoji, msg, pendingHabits) => {
    if (Notification.permission !== "granted") return;
    try {
      const notif = new Notification(`${emoji} HabitTracker`, {
        body: `${msg}\n\nPending:\n${pendingHabits.map((h) => `• ${h}`).join("\n")}`,
        requireInteraction: true,
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (e) {}
  };

  const showPopup = (emoji, msg, pendingHabits, color) => {
    setPopup({ emoji, msg, pendingHabits, color });
    setSnoozed(false);
    setSnoozeCount(0);
    setCountdown(0);
    setGoMsg(null);
    playReminderSound();
    sendNotification(emoji, msg, pendingHabits);
  };

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (habits.length === 0 || allDone) return;

    const todayStr = new Date().toDateString();

    REMINDERS.forEach(({ hours = 0, mins = 0, emoji, msg, color }) => {
      const totalMins = hours * 60 + mins;
      const targetTimeMs = sessionStart + totalMins * 60 * 1000;
      const currentTimeMs = Date.now();
      const key = `rp_session_${hours}h_${mins}m_${todayStr}`;

      if (firedKeys[key]) return;
      if (currentTimeMs >= targetTimeMs) return;

      const msUntil = targetTimeMs - currentTimeMs;

      const t = setTimeout(() => {
        const p = getPendingHabits();
        if (p.length === 0) return;
        const newFired = { ...firedKeys, [key]: true };
        setFiredKeys(newFired);
        localStorage.setItem("fired_reminders", JSON.stringify(newFired));
        showPopup(emoji, msg, p, color);
      }, msUntil);

      timers.current.push(t);
    });

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [allDone, habits.length, firedKeys, sessionStart, todayChecked]);

  const handleSnooze = () => {
    const idx = Math.min(snoozeCount, SNOOZE_SECONDS.length - 1);
    const sec = SNOOZE_SECONDS[idx];
    setSnoozed(true);
    setSnoozeCount((c) => c + 1);
    setCountdown(sec);

    if (snoozeTimer.current) clearTimeout(snoozeTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    let remaining = sec;
    countdownInterval.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) clearInterval(countdownInterval.current);
    }, 1000);

    snoozeTimer.current = setTimeout(() => {
      clearInterval(countdownInterval.current);
      const p = getPendingHabits();
      if (p.length === 0) {
        setPopup(null);
        return;
      }
      setSnoozed(false);
      setCountdown(0);
      playReminderSound();
      setPopup((prev) => (prev ? { ...prev, _ts: Date.now() } : null));
    }, sec * 1000);
  };

  const handleSnoozeCancel = () => {
    setSnoozed(false);
    setCountdown(0);
    if (snoozeTimer.current) clearTimeout(snoozeTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    playReminderSound();
  };

  const handleGo = () => {
    const msg = GO_MSGS[Math.floor(Math.random() * GO_MSGS.length)];
    if (snoozeTimer.current) clearTimeout(snoozeTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setPopup(null);
    setGoMsg(msg);
  };

  // "Let's go!" dabaane ke baad 2 sec baad dashboard
  const handleGoDone = () => {
    setGoMsg(null);
    setTimeout(() => onGoToDashboard?.(), 2000);
  };

  // ✅ Disabled prop — alarm open hone pe kuch mat dikhao
  if (disabled) return null;
  if (goMsg) return <GoMessagePopup msg={goMsg} onDone={handleGoDone} />;
  if (!popup) return null;

  const doneCount = habits.length - popup.pendingHabits.length;
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;
  const snoozeMsg =
    SNOOZE_MSGS[Math.min(snoozeCount - 1, SNOOZE_MSGS.length - 1)];
  const nextSec =
    SNOOZE_SECONDS[Math.min(snoozeCount, SNOOZE_SECONDS.length - 1)];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          background: "#161b22",
          border: `1.5px solid ${snoozed ? "#f85149" : popup.color}`,
          borderRadius: 20,
          padding: "24px 24px",
          textAlign: "center",
          maxWidth: 380,
          width: "92%",
          animation: "popIn 0.4s ease",
          transition: "border-color 0.3s ease",
        }}
      >
        <AnimatedCharacter
          emoji={snoozed ? "💀" : popup.emoji}
          color={snoozed ? "#f85149" : popup.color}
        />

        {snoozed ? (
          <div
            style={{
              background: "#3d1c1c",
              border: "1px solid #6e2c2c",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 14,
              animation: "shake 0.4s ease",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#f85149",
                marginBottom: 4,
              }}
            >
              {snoozeMsg.title}
            </div>
            <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 8 }}>
              {snoozeMsg.desc}
            </div>
            {countdown > 0 && (
              <div
                style={{
                  fontSize: 13,
                  color: "#f85149",
                  background: "#21262d",
                  borderRadius: 8,
                  padding: "4px 12px",
                  display: "inline-block",
                  fontWeight: 600,
                }}
              >
                ⏱️ {countdown} sec mein wapas aayega...
              </div>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: popup.color,
                marginBottom: 6,
              }}
            >
              Reminder! 🔔
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#e6edf3",
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              {popup.msg}
            </div>
          </>
        )}

        <div
          style={{
            background: "#21262d",
            borderRadius: 20,
            height: 6,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              background: snoozed ? "#f85149" : popup.color,
              height: 6,
              borderRadius: 20,
              width: `${pct}%`,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#8b949e",
            marginBottom: 14,
            textAlign: "right",
          }}
        >
          {doneCount}/{habits.length} complete ({pct}%)
        </div>

        <div
          style={{
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 16,
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#8b949e",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Ye tasks incomplete hain:
          </div>
          {popup.pendingHabits.map((habit, i) => (
            <div
              key={habit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 0",
                borderBottom:
                  i < popup.pendingHabits.length - 1
                    ? "1px solid #21262d"
                    : "none",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${snoozed ? "#f85149" : popup.color}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: "#e6edf3", flex: 1 }}>
                {habit}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "#f85149",
                  background: "#3d1c1c",
                  border: "1px solid #6e2c2c",
                  borderRadius: 20,
                  padding: "2px 8px",
                }}
              >
                Pending ❌
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleGo}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: "#238636",
              border: "1px solid #2ea043",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
            }}
          >
            Ab karta hoon! 💪
          </button>
          {!snoozed ? (
            <button
              onClick={handleSnooze}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 10,
                background: "transparent",
                border: "1px solid #30363d",
                color: "#8b949e",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Baad mein ({nextSec}s) 😅
            </button>
          ) : (
            <button
              onClick={handleSnoozeCancel}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 10,
                background: "#3d1c1c",
                border: "1px solid #f85149",
                color: "#f85149",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                animation: "shake 0.4s ease",
              }}
            >
              Tumse na ho payega 💀
            </button>
          )}
        </div>

        <div style={{ fontSize: 11, color: "#30363d", marginTop: 10 }}>
          {snoozed
            ? `Next: ${SNOOZE_SECONDS[Math.min(snoozeCount, SNOOZE_SECONDS.length - 1)]}s mein wapas 😭`
            : "Tab open rakho reminder ke liye!"}
        </div>
      </div>

      <style>{`
        @keyframes ping { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes bounce { from{transform:scale(1) rotate(-8deg)} to{transform:scale(1.12) rotate(8deg)} }
        @keyframes shake { 0%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} 100%{transform:translateX(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fall { 0%{top:-30px;opacity:1;transform:rotate(0deg)} 100%{top:105vh;opacity:0;transform:rotate(360deg)} }
        @keyframes slideUp { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}
