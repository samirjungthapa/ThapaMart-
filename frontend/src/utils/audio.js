// World-class synthetic audio micro-feedback utility using Web Audio API
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a short, clean, premium click sound
export const playClick = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn("Audio synthesis block:", e);
  }
};

// Play a smooth "swoosh" sound for drawers opening/closing
export const playSwoosh = () => {
  try {
    const ctx = getAudioContext();
    
    // Create white noise buffer
    const bufferSize = ctx.sampleRate * 0.25; // 0.25 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to make it sound like a swoosh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start();
    noiseNode.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn("Audio synthesis block:", e);
  }
};

// Play a premium success chime (major chord arpeggio)
export const playSuccess = () => {
  try {
    const ctx = getAudioContext();
    const playNote = (freq, delay, duration) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gainNode.gain.setValueAtTime(0.0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + delay + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };

    // Major 7th chord arpeggio (C major 7)
    playNote(261.63, 0.0, 0.4); // C4
    playNote(329.63, 0.08, 0.45); // E4
    playNote(392.00, 0.16, 0.5); // G4
    playNote(493.88, 0.24, 0.6); // B4
  } catch (e) {
    console.warn("Audio synthesis block:", e);
  }
};
