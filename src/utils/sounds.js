const isSoundOn = () => localStorage.getItem("ht_sound") !== "false";

// Ek shared AudioContext — fast response ke liye
let sharedCtx = null;
const getCtx = () => {
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedCtx.state === "suspended") sharedCtx.resume();
  return sharedCtx;
};

export const playCheckSound = () => {
  if (!isSoundOn()) return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.frequency.setValueAtTime(520, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ac.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.3);
  } catch {}
};

export const playUncheckSound = () => {
  if (!isSoundOn()) return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.frequency.setValueAtTime(400, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ac.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.2);
  } catch {}
};

export const playAllDoneSound = () => {
  if (!isSoundOn()) return;
  try {
    const ac = getCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.3, ac.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ac.currentTime + i * 0.12 + 0.3,
      );
      osc.start(ac.currentTime + i * 0.12);
      osc.stop(ac.currentTime + i * 0.12 + 0.3);
    });
  } catch {}
};

export const playReminderSound = () => {
  if (!isSoundOn()) return;
  try {
    const ac = getCtx();
    [440, 440, 440].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.25);
      gain.gain.setValueAtTime(0.2, ac.currentTime + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ac.currentTime + i * 0.25 + 0.15,
      );
      osc.start(ac.currentTime + i * 0.25);
      osc.stop(ac.currentTime + i * 0.25 + 0.15);
    });
  } catch {}
};

// AudioContext warm up — app load hone pe call karo
export const warmUpAudio = () => {
  try {
    getCtx();
  } catch {}
};
