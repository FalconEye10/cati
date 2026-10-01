/**
 * soundEffects.js
 * Efecte acustice procedurale calde și discrete sintetizate prin Web Audio API.
 * Nu necesită fișiere audio externe. Nu pornesc niciodată automat; se execută
 * exclusiv la acțiunea directă a utilizatoarei (click/tap).
 */

let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Sunet mecanic de rotire a cadranului seifului (click scurt de rotiță dințată)
 */
export function playDialTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  } catch {}
}

/**
 * Sunet de deblocare mecanism seif:
 * Un click mecanic fin urmat de un clopoțel rezonant cald de armonie.
 */
export function playVaultUnlockSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Zăvor mecanic (Noise burst scurt și filtrat)
    const bufferSize = ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 2. Chime armonic cald (rezonanță de deschidere)
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.15 + idx * 0.04);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.04, now + 0.15 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.15 + idx * 0.04);
      osc.stop(now + 1.4);
    });
  } catch {
    // Fail-safe
  }
}

/**
 * Sunet de bătaie de inimă autentică (lub-dub cald):
 * Două impulsuri joase de frecvență sinusoidală (60Hz -> 45Hz).
 */
export function playHeartbeatSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    const playPulse = (startTime, duration, peakVol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, startTime);
      osc.frequency.exponentialRampToValueAtTime(45, startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(peakVol, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Primul impuls (lub)
    playPulse(now, 0.18, 0.12);
    // Al doilea impuls (dub) la 150ms distanță
    playPulse(now + 0.16, 0.22, 0.09);
  } catch {
    // Fail-safe
  }
}

/**
 * Sunet de rupere a sigiliului de ceară și desfacere hârtie
 */
export function playWaxCrackSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Crackle scurt
    const bufferSize = ctx.sampleRate * 0.08;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);

    // Șoaptă de hârtie
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now + 0.05);
    osc.frequency.linearRampToValueAtTime(180, now + 0.35);

    oscGain.gain.setValueAtTime(0.02, now + 0.05);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now + 0.05);
    osc.stop(now + 0.4);
  } catch {
    // Fail-safe
  }
}

/**
 * Sunet de rotire card (foșnet discret)
 */
export function playCardFlipSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.2);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Fail-safe
  }
}
