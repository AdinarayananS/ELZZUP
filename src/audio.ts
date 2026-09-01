/**
 * 8-bit Retro Web Audio Synthesizer for ELZZUP
 * Generates custom sound effects without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playButtonPress(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playSuccess(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.18 * volume, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
    });
  }

  private lastMemeLaughTime = 0;

  playTroll(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.playMemeLaugh(soundEnabled, volume);
  }

  playMemeLaugh(soundEnabled = true, volume = 0.85) {
    if (!soundEnabled) return;
    const now = Date.now();
    // Anti-spam debounce: Prevent stacking multiple laughs on rapid clicks within 650ms
    if (now - this.lastMemeLaughTime < 650) {
      return;
    }
    this.lastMemeLaughTime = now;

    this.initContext();
    if (!this.ctx) return;

    // 3 distinct retro 8-bit meme laughter variations:
    // 0: Classic "Ha-Ha-Ha-Haaa!"
    // 1: Snarky rapid "A-Ha-Ha-Ha-Ha!"
    // 2: Pitch-slide "Womp-HAHAHA!"
    const variation = Math.floor(Math.random() * 3);
    const pitchJitter = 0.96 + Math.random() * 0.08; // subtle organic pitch shift

    if (variation === 0) {
      const laughNotes = [
        { freq: 440 * pitchJitter, time: 0.0, dur: 0.075 },
        { freq: 523.25 * pitchJitter, time: 0.09, dur: 0.075 },
        { freq: 392.00 * pitchJitter, time: 0.18, dur: 0.075 },
        { freq: 493.88 * pitchJitter, time: 0.27, dur: 0.14 },
      ];

      laughNotes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime + note.time);
        osc.frequency.exponentialRampToValueAtTime(note.freq * 0.82, this.ctx.currentTime + note.time + note.dur);

        gain.gain.setValueAtTime(0.22 * volume, this.ctx.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + note.time + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + note.time);
        osc.stop(this.ctx.currentTime + note.time + note.dur);
      });
    } else if (variation === 1) {
      const laughNotes = [
        { freq: 520 * pitchJitter, time: 0.0, dur: 0.06 },
        { freq: 520 * pitchJitter, time: 0.08, dur: 0.06 },
        { freq: 580 * pitchJitter, time: 0.16, dur: 0.06 },
        { freq: 660 * pitchJitter, time: 0.24, dur: 0.08 },
        { freq: 440 * pitchJitter, time: 0.34, dur: 0.15 },
      ];

      laughNotes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime + note.time);
        osc.frequency.exponentialRampToValueAtTime(note.freq * 0.85, this.ctx.currentTime + note.time + note.dur);

        gain.gain.setValueAtTime(0.18 * volume, this.ctx.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + note.time + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + note.time);
        osc.stop(this.ctx.currentTime + note.time + note.dur);
      });
    } else {
      // Womp-womp into cackle
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();
      oscLow.type = 'sawtooth';
      oscLow.frequency.setValueAtTime(260 * pitchJitter, this.ctx.currentTime);
      oscLow.frequency.linearRampToValueAtTime(90 * pitchJitter, this.ctx.currentTime + 0.22);

      gainLow.gain.setValueAtTime(0.25 * volume, this.ctx.currentTime);
      gainLow.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
      oscLow.connect(gainLow);
      gainLow.connect(this.ctx.destination);
      oscLow.start();
      oscLow.stop(this.ctx.currentTime + 0.22);

      const laughNotes = [
        { freq: 480 * pitchJitter, time: 0.16, dur: 0.08 },
        { freq: 580 * pitchJitter, time: 0.26, dur: 0.08 },
        { freq: 700 * pitchJitter, time: 0.36, dur: 0.18 },
      ];

      laughNotes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime + note.time);
        osc.frequency.exponentialRampToValueAtTime(note.freq * 0.78, this.ctx.currentTime + note.time + note.dur);

        gain.gain.setValueAtTime(0.2 * volume, this.ctx.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + note.time + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + note.time);
        osc.stop(this.ctx.currentTime + note.time + note.dur);
      });
    }
  }

  playGlitch(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const randomFreq = Math.random() * 800 + 100;
      osc.frequency.setValueAtTime(randomFreq, this.ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0.12 * volume, this.ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.04 + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.04);
      osc.stop(this.ctx.currentTime + i * 0.04 + 0.04);
    }
  }

  playDodge(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.2 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playVanish(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.22 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playChargeProgress(progress: number, soundEnabled = true, volume = 0.6) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 220 + progress * 440; // 220Hz ramping up to 660Hz
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 40, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playLatchOpen(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.12);

    osc2.frequency.setValueAtTime(360, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.12);
    osc2.stop(this.ctx.currentTime + 0.12);
  }

  playBossImpact(soundEnabled = true, volume = 1.0) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    // Deep sub-bass boom + crashing noise burst
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.9);

    gain.gain.setValueAtTime(0.4 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.95);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.95);
  }

  playEpicDefeat(soundEnabled = true, volume = 0.9) {
    if (!soundEnabled) return;
    this.playBossImpact(soundEnabled, volume);
    this.playSuccess(soundEnabled, volume);
  }

  playRestoreChime(soundEnabled = true, volume = 0.6) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    // Gentle, peaceful harmonic progression for the restored world
    const chords = [261.63, 329.63, 392.00, 523.25]; // C major chord
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.12 * volume, this.ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.12);
      osc.stop(this.ctx.currentTime + idx * 0.12 + 1.2);
    });
  }

  playPixelFirework(soundEnabled = true, volume = 0.5) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    // 8-bit whistle and pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(150, this.ctx.currentTime + 0.11);

    gain.gain.setValueAtTime(0.18 * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playVictoryFanfare(soundEnabled = true, volume = 0.8) {
    if (!soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    // Classic 8-bit grand victory fanfare: C4 -> E4 -> G4 -> C5 -> G4 -> C5
    const melody = [
      { freq: 261.63, time: 0.0, dur: 0.14 },
      { freq: 329.63, time: 0.15, dur: 0.14 },
      { freq: 392.00, time: 0.30, dur: 0.14 },
      { freq: 523.25, time: 0.45, dur: 0.28 },
      { freq: 392.00, time: 0.75, dur: 0.14 },
      { freq: 523.25, time: 0.90, dur: 0.60 },
    ];

    melody.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0.2 * volume, this.ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + note.time + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + note.time);
      osc.stop(this.ctx.currentTime + note.time + note.dur);
    });
  }

  startMusic(musicEnabled = true, volume = 0.5) {
    if (!musicEnabled) {
      this.stopMusic();
      return;
    }
    if (this.isMusicPlaying) {
      this.updateMusicVolume(volume);
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const notes = [130.81, 155.56, 174.61, 196.00, 233.08, 196.00]; // Dark cyberpunk bass synth scale
    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.isMusicPlaying) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[step % notes.length], this.ctx.currentTime);

        gain.gain.setValueAtTime(0.06 * volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);

        step++;
      } catch {
        // Safe catch on audio suspension
      }
    }, 450);
  }

  updateMusicVolume(volume: number) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(0.06 * volume, this.ctx.currentTime);
    }
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundEngine();
export const soundEngine = sound;
