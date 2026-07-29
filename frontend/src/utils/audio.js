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

// Global mute utilities
export const isMuted = () => {
  return localStorage.getItem('soundMuted') === 'true';
};

export const setMuted = (muted) => {
  localStorage.setItem('soundMuted', muted ? 'true' : 'false');
};

// Play a short, clean, premium click sound
export const playClick = () => {
  if (isMuted()) return;
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
  if (isMuted()) return;
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
  if (isMuted()) return;
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

// Play a mechanical/wood block style tick sound for spin wheel
export const playTick = () => {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    console.warn("Audio synthesis block:", e);
  }
};
// Play a soft, high-frequency hover pluck
export const playHoverPluck = () => {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

// Play a short major pentatonic arpeggio sweep when adding items to cart
export const playCartSuccessSound = () => {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    const playNote = (freq, delay, duration) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + delay + duration);

      gainNode.gain.setValueAtTime(0.0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };

    // Quick arpeggio sweep (E major pentatonic / Luxury)
    playNote(329.63, 0.0, 0.2); // E4
    playNote(392.00, 0.05, 0.2); // G4
    playNote(440.00, 0.1, 0.2); // A4
    playNote(523.25, 0.15, 0.3); // C5
  } catch (e) {}
};

// Play a resonant low frequency metallic gong decay for successful checkouts
export const playCheckoutGong = () => {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(110, ctx.currentTime); // Low A2
    osc1.frequency.linearRampToValueAtTime(90, ctx.currentTime + 1.5);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(165, ctx.currentTime); // Perfect fifth E3
    osc2.frequency.linearRampToValueAtTime(130, ctx.currentTime + 1.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);

    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);
  } catch (e) {}
};

let activeOscillators = [];
let ambientGain = null;
let ambientVolume = parseFloat(localStorage.getItem('ambientVolume') || '0.5');

export const getAmbientVolume = () => {
  return ambientVolume;
};

export const setAmbientVolume = (volume) => {
  ambientVolume = parseFloat(volume);
  localStorage.setItem('ambientVolume', String(ambientVolume));
  if (ambientGain) {
    try {
      const ctx = getAudioContext();
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.03 * ambientVolume, ctx.currentTime + 0.2);
    } catch (e) {}
  }
};

export const startAmbientLoop = (category = 'default') => {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    
    // Stop existing loop first
    stopAmbientLoop();

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.0, ctx.currentTime);
    
    // Smooth transition
    ambientGain.connect(ctx.destination);
    
    // Low pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    
    ambientGain.connect(filter);
    filter.connect(ctx.destination);

    ambientGain.gain.linearRampToValueAtTime(0.03 * ambientVolume, ctx.currentTime + 1.5);

    // Chords based on category or track
    let freqs = [130.81, 164.81, 196.00, 246.94]; // C major 7 (Default / Luxury)
    const lowerCategory = (category || 'default').toLowerCase();
    
    if (lowerCategory.includes('rain') || lowerCategory === 'rain') {
      freqs = [87.31, 130.81, 174.61, 220.00]; // F major 9 / Kathmandu Rain
    } else if (lowerCategory.includes('lounge') || lowerCategory === 'lounge') {
      freqs = [110.00, 146.83, 164.81, 196.00]; // A minor 9 / Luxury Lounge
    } else if (lowerCategory.includes('cyberpunk') || lowerCategory === 'cyberpunk' || lowerCategory.includes('tech') || lowerCategory.includes('electronic') || lowerCategory.includes('watch')) {
      freqs = [73.42, 110.00, 146.83, 174.61]; // D minor 7 / Cyberpunk Neon
    } else if (lowerCategory.includes('shoe') || lowerCategory.includes('clothing') || lowerCategory.includes('sport')) {
      freqs = [164.81, 196.00, 220.00, 329.63]; // E minor 7 (Active/Fashion)
    }

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Add subtle LFO to frequency for chorusing effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.2 + Math.random() * 0.3; // Very slow LFO
      lfoGain.gain.value = 1.0; // pitch drift depth
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(ambientGain);
      
      lfo.start();
      osc.start();
      
      activeOscillators.push({ osc, lfo });
    });
  } catch (e) {
    console.warn("Ambient loop synthesis error:", e);
  }
};

export const stopAmbientLoop = () => {
  if (ambientGain) {
    try {
      const ctx = getAudioContext();
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, ctx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8); // Slow fade-out
    } catch (e) {}
  }
  const oscs = [...activeOscillators];
  activeOscillators = [];
  ambientGain = null;
  setTimeout(() => {
    oscs.forEach(({ osc, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
      } catch (e) {}
    });
  }, 1000);
};
