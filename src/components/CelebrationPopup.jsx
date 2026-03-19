import { useEffect, useState, useRef } from "react";

const CHECK_MSGS = [
  { count: 1, emoji: "🌱", msg: "Pehli habit! Shuru ho gaye!" },
  { count: 2, emoji: "✌️", msg: "2 habits! Chal rahe ho!" },
  { count: 3, emoji: "💪", msg: "3 habits! Mast chal raha hai!" },
  { count: 4, emoji: "⚡", msg: "4 habits! Energy hai tum mein!" },
  { count: 5, emoji: "🎯", msg: "5 habits! Target pe ho!" },
  { count: 6, emoji: "🚀", msg: "6 habits! Rocket ban gaye!" },
];

const UNCHECK_MSGS = [
  { count: 1, emoji: "😅", msg: "Ek miss? Koi baat nahi!" },
  { count: 2, emoji: "😬", msg: "2 miss? Wapas aao!" },
  { count: 3, emoji: "😢", msg: "3 miss? Arey nahi!" },
  { count: 4, emoji: "😤", msg: "Itna uncheck? Soch lo!" },
];

const CONFETTI = ["🎊", "⭐", "🎉", "✨", "🌟", "💫", "🎈", "🎀"];

const GIF_URLS = [
  "https://tenor.com/embed/7303058642262868716", // Cat Girl Anime
  "https://tenor.com/embed/12872091721290064746", // Good Boy
  "https://tenor.com/embed/1790702977985481890", // Good Girl
  "https://tenor.com/embed/10434643996083996562", // Original Cat Heart
];

export default function CelebrationPopup({ doneCount, total }) {
  const [popup, setPopup] = useState(null);
  const [showAllDone, setShowAllDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [activeGif, setActiveGif] = useState(
    () => GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)],
  );

  const prevCount = useRef(doneCount);
  const timerRef = useRef(null);
  const allDoneShownFor = useRef(null);

  const pickNewGif = () => {
    const randomGif = GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)];
    setActiveGif(randomGif);
  };

  const closeAllDone = () => {
    setShowAllDone(false);
    setShowConfetti(false);
    setTimeout(pickNewGif, 400);
  };

  useEffect(() => {
    const prev = prevCount.current;
    prevCount.current = doneCount;

    if (doneCount === prev) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const isCheck = doneCount > prev;
    const allDone = doneCount === total && total > 0;

    // 🔥 FIX: Agar saare done hain, toh chhota popup turant hatado (Overlap bachane ke liye)
    if (allDone) {
      setPopup(null);
    }

    if (allDone && allDoneShownFor.current !== `${total}-${doneCount}`) {
      allDoneShownFor.current = `${total}-${doneCount}`;
      pickNewGif();
      setShowAllDone(true);
      setShowConfetti(true);

      timerRef.current = setTimeout(() => {
        closeAllDone();
      }, 5000);
      return;
    }

    // 🔥 FIX: Sirf tabhi chhota popup dikhao jab saare done NA HO
    if (!allDone) {
      if (isCheck) {
        const found = CHECK_MSGS.find((m) => m.count === doneCount) || {
          emoji: "🏆",
          msg: `${doneCount} habits! Zabardast!`,
        };
        setPopup({ type: "check", ...found });
      } else {
        const missed = total - doneCount;
        const found = UNCHECK_MSGS.find((m) => m.count === missed) || {
          emoji: "😤",
          msg: "Bahut uncheck kar diya!",
        };
        setPopup({ type: "uncheck", ...found });
      }

      timerRef.current = setTimeout(() => setPopup(null), 2500);
    } else {
      setShowAllDone(true);
    }
  }, [doneCount, total]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: showAllDone ? 1 : 0,
          pointerEvents: showAllDone ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={closeAllDone}
      >
        <div
          style={{
            background: "#161b22",
            border: "2px solid #39d353",
            borderRadius: 24,
            padding: "40px 48px",
            textAlign: "center",
            transform: showAllDone ? "scale(1)" : "scale(0.8)",
            transition:
              "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            maxWidth: 320,
          }}
        >
          <div
            style={{
              margin: "0 auto 20px",
              width: 160,
              height: 160,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <iframe
              src={activeGif}
              width="160"
              height="160"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              title="Celebration Anime GIF"
              style={{ pointerEvents: "none" }}
            ></iframe>
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#39d353",
              marginBottom: 8,
            }}
          >
            Saari Habits Complete! 🎉
          </div>
          <div style={{ fontSize: 15, color: "#8b949e", marginBottom: 16 }}>
            Wah! Aaj ka din perfect raha!
          </div>
          <div style={{ fontSize: 28, letterSpacing: 6, marginBottom: 16 }}>
            🏆 🌟 🏆
          </div>
          <div style={{ fontSize: 11, color: "#30363d" }}>
            Band karne ke liye click karo
          </div>
        </div>
      </div>

      {showConfetti && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 10000,
          }}
        >
          {CONFETTI.map((e, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${5 + i * 12}%`,
                top: "-30px",
                fontSize: 28,
                animation: `fall ${1.5 + i * 0.15}s ease forwards`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {e}
            </div>
          ))}
        </div>
      )}

      {/* 🔥 Chhota popup sirf tab dikhega jab BIG celebration OFF ho */}
      {popup && !showAllDone && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            background: "#161b22",
            border: `1px solid ${popup.type === "check" ? "#238636" : "#f85149"}`,
            borderRadius: 16,
            padding: "14px 20px",
            boxShadow: `0 8px 32px ${popup.type === "check" ? "rgba(35,134,54,0.3)" : "rgba(248,81,73,0.3)"}`,
            animation: "slideUp 0.35s ease",
            minWidth: 240,
            maxWidth: 300,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>
              {popup.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e6edf3",
                  marginBottom: 3,
                }}
              >
                {popup.msg}
              </div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 6 }}>
                {popup.type === "check"
                  ? `${doneCount}/${total} habits complete`
                  : `${doneCount}/${total} habits reh gaye`}
              </div>
              <div
                style={{ background: "#21262d", borderRadius: 4, height: 5 }}
              >
                <div
                  style={{
                    background: popup.type === "check" ? "#238636" : "#f85149",
                    height: 5,
                    borderRadius: 4,
                    width: `${total ? (doneCount / total) * 100 : 0}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes slideUp { 
          from { transform: translateY(20px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
      `}</style>
    </>
  );
}
