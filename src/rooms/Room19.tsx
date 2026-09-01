import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Radio,
  Sliders,
  Sparkles,
  Zap,
  Layers,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export const Room19: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // Stage state: 1, 2, or 3
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [failBanner, setFailBanner] = useState<string | null>(null);

  // Stage 1 State: Core Polarity Inversion & Decoupling
  const [invertPolarity, setInvertPolarity] = useState(false);
  const [fluxAlpha, setFluxAlpha] = useState(25);
  const [fluxBeta, setFluxBeta] = useState(75);
  const [fluxGamma, setFluxGamma] = useState(10);

  // Stage 2 State: Elzzup's Trap & Oscilloscope Wave Calibration
  const [waveMode, setWaveMode] = useState<'square' | 'sawtooth' | 'sine'>('square');
  const [trapTriggered, setTrapTriggered] = useState(false);

  // Victory Sequence
  const [victoryPhase, setVictoryPhase] = useState<'idle' | 'freeze' | 'cleared' | 'elzzup-reaction'>('idle');

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Stage-specific Progressive Hints
  const HINTS: Record<1 | 2 | 3, Array<{ level: number; title: string; text: string }>> = {
    1: [
      {
        level: 1,
        title: 'HINT 1 [THE FIRST LAYER]',
        text: "Elzzup: \"Did you think just sliding everything to 100% would work? The capacitors are in an entangling inverse drain loop.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [HIDDEN RULE]',
        text: "Elzzup: \"Toggle the 'INVERT SUB-CORE POLARITY' switch to decouple the series feedback drain and unlock the mirror field.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [STRONG]',
        text: "Elzzup: \"Turn Invert Polarity ON, set Alpha to 50%, Beta to 50%, Gamma to 50%, and press 'LOCK FLUX MATRIX'.\"",
      },
    ],
    2: [
      {
        level: 1,
        title: 'HINT 1 [ELZZUP\'S TRAP]',
        text: "Elzzup: \"I told you to hit the Emergency Purge button, didn't I? Why do you keep trusting buttons I place on the screen?\"",
      },
      {
        level: 2,
        title: 'HINT 2 [OSCILLOSCOPE HARMONICS]',
        text: "Elzzup: \"The diagnostic oscilloscope controls the core frequency. Square waves create sharp harmonic spikes; Sine waves create smooth equilibrium.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [STRONG]',
        text: "Elzzup: \"Set the Waveform to 'SINE' and ignore all three tempting Emergency Override buttons.\"",
      },
    ],
    3: [
      {
        level: 1,
        title: 'HINT 1 [FINAL DEDUCTION]',
        text: "Elzzup: \"Combine everything you discovered: Inverted Polarity + Sine Wave Resonance + 50/50/50 Triad Equilibrium.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [CONNECTION]',
        text: "Elzzup: \"Verify Polarity is INVERTED, Wave is SINE, and all 3 capacitors are balanced at exactly 50%.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [NEAR-SOLUTION]',
        text: "Elzzup: \"Keep all settings harmonized and press 'SYNCHRONIZE HARMONIC SINGULARITY'. Do not touch decoy overrides.\"",
      },
    ],
  };

  const handleCycleHint = () => {
    sound.playClick(soundEnabled);
    setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  // --- STAGE 1: SUB-CORE POLARITY & FLUX ADJUSTMENT ---
  const handleAdjustFlux = (cap: 'alpha' | 'beta' | 'gamma', delta: number) => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);

    if (invertPolarity) {
      // Independent isolated adjustment
      if (cap === 'alpha') setFluxAlpha((p) => Math.min(100, Math.max(0, p + delta)));
      if (cap === 'beta') setFluxBeta((p) => Math.min(100, Math.max(0, p + delta)));
      if (cap === 'gamma') setFluxGamma((p) => Math.min(100, Math.max(0, p + delta)));
    } else {
      // Entangled inverse series loop
      if (cap === 'alpha') {
        setFluxAlpha((p) => Math.min(100, Math.max(0, p + delta)));
        setFluxBeta((p) => Math.min(100, Math.max(0, p - delta)));
      } else if (cap === 'beta') {
        setFluxBeta((p) => Math.min(100, Math.max(0, p + delta)));
        setFluxGamma((p) => Math.min(100, Math.max(0, p - delta)));
      } else {
        setFluxGamma((p) => Math.min(100, Math.max(0, p + delta)));
        setFluxAlpha((p) => Math.min(100, Math.max(0, p - delta)));
      }
    }
  };

  const handleStage1Submit = () => {
    if (isProcessing || currentStage !== 1) return;
    if (!invertPolarity) {
      handleFail('SERIES FEEDBACK OVERFLOW! Sub-Core Polarity must be inverted to isolate flux lines.');
      return;
    }
    if (fluxAlpha === 50 && fluxBeta === 50 && fluxGamma === 50) {
      sound.playSuccess(soundEnabled);
      setIsProcessing(true);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setHintLevel(0);
        setCurrentStage(2);
      }, 900);
      timersRef.current.push(t);
    } else {
      handleFail('UNBALANCED FLUX! All 3 capacitors must be calibrated to 50% equilibrium.');
    }
  };

  // --- STAGE 2: ELZZUP'S DECOY OVERRIDES VS OSCILLOSCOPE ---
  const handleDecoyOverride = (name: string) => {
    if (isProcessing) return;
    sound.playGlitch(soundEnabled);
    setScreenShake(true);
    setTrapTriggered(true);
    setFailBanner(`ELZZUP'S TRAP: "${name}" triggered a core feedback trip! Do not press automated overrides.`);

    const laughTimer = window.setTimeout(() => sound.playMemeLaugh(soundEnabled), 150);
    timersRef.current.push(laughTimer);

    const shakeStop = window.setTimeout(() => setScreenShake(false), 500);
    timersRef.current.push(shakeStop);

    const bannerClear = window.setTimeout(() => setFailBanner(null), 3000);
    timersRef.current.push(bannerClear);
  };

  const handleStage2Submit = () => {
    if (isProcessing || currentStage !== 2) return;
    if (waveMode === 'sine') {
      sound.playSuccess(soundEnabled);
      setIsProcessing(true);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setHintLevel(0);
        setCurrentStage(3);
      }, 900);
      timersRef.current.push(t);
    } else {
      handleFail(`HARMONIC DISTORTION! Waveform is ${waveMode.toUpperCase()}. Tune oscilloscope to SINE mode.`);
    }
  };

  // --- STAGE 3: FINAL COMBINED HARMONIC SINGULARITY ---
  const handleFinalSynchronize = () => {
    if (isProcessing || currentStage !== 3) return;
    sound.playClick(soundEnabled);

    const isHarmonized =
      invertPolarity &&
      waveMode === 'sine' &&
      fluxAlpha === 50 &&
      fluxBeta === 50 &&
      fluxGamma === 50;

    if (isHarmonized) {
      sound.playSuccess(soundEnabled);
      setIsProcessing(true);

      const t1 = window.setTimeout(() => {
        setVictoryPhase('freeze');
        setScreenShake(true);

        const t2 = window.setTimeout(() => {
          setVictoryPhase('cleared');
          setScreenShake(false);
          sound.playLatchOpen(soundEnabled);

          const t3 = window.setTimeout(() => {
            setVictoryPhase('elzzup-reaction');

            const t4 = window.setTimeout(() => {
              onSuccess(
                'SINGULARITY HARMONIZED',
                'You dismantled the inverse loop, bypassed Elzzup\'s traps, and aligned the 6 harmonic vectors.'
              );
            }, 2400);
            timersRef.current.push(t4);
          }, 1800);
          timersRef.current.push(t3);
        }, 800);
        timersRef.current.push(t2);
      }, 600);
      timersRef.current.push(t1);
    } else {
      handleFail('RESONANCE FAILED! Polarity must be INVERTED, Wave must be SINE, and Flux must be 50/50/50.');
    }
  };

  const handleFail = (msg: string) => {
    sound.playGlitch(soundEnabled);
    setScreenShake(true);
    setFailBanner(msg);

    const laughTimer = window.setTimeout(() => sound.playMemeLaugh(soundEnabled), 150);
    timersRef.current.push(laughTimer);

    const shakeStop = window.setTimeout(() => setScreenShake(false), 500);
    timersRef.current.push(shakeStop);

    const bannerClear = window.setTimeout(() => {
      setFailBanner(null);
      setIsProcessing(false);
    }, 2500);
    timersRef.current.push(bannerClear);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 select-none ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Top Chamber Header & Stage Progress Bar */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
        <div className="font-pixel text-[11px] sm:text-xs text-[#ffdd00] tracking-wider uppercase font-bold flex items-center gap-1.5 bg-[#0c0c1e] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <Activity size={14} className="text-[#ffdd00]" />
          <span>CHAMBER 19: INVERSE CORE SINGULARITY</span>
        </div>

        {/* 3-Stage Progress Indicator */}
        <div className="flex items-center gap-1.5 bg-[#101026] border-2 border-black px-2 py-1 shadow-[2px_2px_0_0_#000]">
          <span className="font-pixel text-[9px] text-[#a0a0d0] font-bold mr-1">
            STAGES:
          </span>
          {[1, 2, 3].map((stg) => (
            <span
              key={stg}
              className={`px-2 py-0.5 font-pixel text-[9px] font-black border border-black ${
                currentStage === stg
                  ? 'bg-[#ffdd00] text-black shadow-[0_0_8px_#ffdd00]'
                  : currentStage > stg
                  ? 'bg-[#44ff44] text-black'
                  : 'bg-[#1e1e38] text-[#666688]'
              }`}
            >
              STAGE {stg}
            </span>
          ))}
        </div>
      </div>

      {/* Main Chamber Console */}
      <div className="w-full max-w-2xl bg-[#1a0f28] border-4 sm:border-6 border-black p-3 sm:p-5 shadow-[6px_6px_0_0_#000] flex flex-col items-center gap-3">
        {/* Error / Trap Banner */}
        {failBanner && (
          <div className="w-full bg-[#ff4444] text-black p-2 border-3 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-1.5 font-heading font-black text-xs uppercase">
              <XCircle size={16} className="text-black shrink-0" />
              <span>{failBanner}</span>
            </div>
          </div>
        )}

        {/* --- STAGE 1: THE FIRST LAYER (Discover Inverse Loop & Polarity) --- */}
        {currentStage === 1 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#ffdd00] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#ffdd00] font-black uppercase">
                STAGE 1 / 3: DECOUPLE INVERSE FEEDBACK
              </span>
              <button
                onClick={() => {
                  sound.playClick(soundEnabled);
                  setInvertPolarity((p) => !p);
                }}
                className={`px-2.5 py-1 font-pixel text-[10px] font-black uppercase border-2 border-black cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-0.5 ${
                  invertPolarity ? 'bg-[#44ff44] text-black' : 'bg-[#2a2a4a] text-[#f0f0ff]'
                }`}
              >
                POLARITY: {invertPolarity ? 'INVERTED (ISOLATED)' : 'STANDARD (ENTANGLED)'}
              </button>
            </div>

            {/* 3 Capacitors */}
            <div className="w-full grid grid-cols-3 gap-2">
              {[
                { name: 'ALPHA', val: fluxAlpha, key: 'alpha' as const },
                { name: 'BETA', val: fluxBeta, key: 'beta' as const },
                { name: 'GAMMA', val: fluxGamma, key: 'gamma' as const },
              ].map((cap) => (
                <div
                  key={cap.name}
                  className="bg-black border-2 border-black p-2 flex flex-col items-center gap-1.5"
                >
                  <span className="font-pixel text-[10px] text-[#ffdd00] font-black">
                    {cap.name}
                  </span>
                  <div className="font-heading font-black text-lg text-white">
                    {cap.val}%
                  </div>
                  <div className="w-full bg-[#2a2a4a] h-2 border border-black overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        cap.val === 50 ? 'bg-[#44ff44]' : 'bg-[#ffdd00]'
                      }`}
                      style={{ width: `${cap.val}%` }}
                    />
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => handleAdjustFlux(cap.key, -25)}
                      className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] text-white hover:text-black font-pixel text-[9px] border border-black cursor-pointer"
                    >
                      -25
                    </button>
                    <button
                      onClick={() => handleAdjustFlux(cap.key, 25)}
                      className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] text-white hover:text-black font-pixel text-[9px] border border-black cursor-pointer"
                    >
                      +25
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleStage1Submit}
              className="w-full py-2.5 bg-[#ffdd00] hover:bg-[#ffee44] text-black border-3 border-black font-heading font-black text-xs uppercase shadow-[3px_3px_0_0_#000] cursor-pointer"
            >
              LOCK FLUX MATRIX (TARGET: 50% TRIAD)
            </button>
          </div>
        )}

        {/* --- STAGE 2: ELZZUP'S TRAP (Oscilloscope Calibration vs Decoy Overrides) --- */}
        {currentStage === 2 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#ff4444] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#ff8888] font-black uppercase">
                STAGE 2 / 3: CALIBRATE HARMONICS // IGNORE DECOY OVERRIDES
              </span>
              <Radio size={14} className="text-[#ff4444] animate-pulse" />
            </div>

            {/* Waveform Selector */}
            <div className="w-full bg-black border-2 border-black p-3 flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-[#a0a0d0] font-bold uppercase">
                DIAGNOSTIC OSCILLOSCOPE WAVE: [{waveMode.toUpperCase()}]
              </span>
              <div className="grid grid-cols-3 gap-2 w-full">
                {(['square', 'sawtooth', 'sine'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      sound.playClick(soundEnabled);
                      setWaveMode(mode);
                    }}
                    className={`py-2 border-2 border-black font-pixel text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0_0_#000] ${
                      waveMode === mode
                        ? 'bg-[#00f0ff] text-black'
                        : 'bg-[#18182a] text-[#8888aa]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Decoy Overrides Warning Box */}
            <div className="w-full bg-[#2a0a14] border-2 border-[#ff4444] p-2.5 flex flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] text-[#ff8888] font-bold uppercase">
                ELZZUP PROMPT: "PRESS EMERGENCY DAMPENER TO STABILIZE!"
              </span>
              <div className="grid grid-cols-3 gap-2 w-full">
                <button
                  onClick={() => handleDecoyOverride('MAX PURGE')}
                  className="py-1.5 bg-[#ff4444] hover:bg-[#ff6666] text-black font-pixel text-[9px] font-black uppercase border border-black cursor-pointer"
                >
                  MAX PURGE ⚠
                </button>
                <button
                  onClick={() => handleDecoyOverride('COLD DAMPEN')}
                  className="py-1.5 bg-[#ff4444] hover:bg-[#ff6666] text-black font-pixel text-[9px] font-black uppercase border border-black cursor-pointer"
                >
                  COLD DAMPEN ⚠
                </button>
                <button
                  onClick={() => handleDecoyOverride('DELTA BYPASS')}
                  className="py-1.5 bg-[#ff4444] hover:bg-[#ff6666] text-black font-pixel text-[9px] font-black uppercase border border-black cursor-pointer"
                >
                  DELTA BYPASS ⚠
                </button>
              </div>
            </div>

            <button
              onClick={handleStage2Submit}
              className="w-full py-2.5 bg-[#00f0ff] hover:bg-[#66f6ff] text-black border-3 border-black font-heading font-black text-xs uppercase shadow-[3px_3px_0_0_#000] cursor-pointer"
            >
              ENGAGE HARMONIC WAVE RESONANCE ➔
            </button>
          </div>
        )}

        {/* --- STAGE 3: FINAL DEDUCTION (All 6 Layers Harmonized) --- */}
        {currentStage === 3 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#44ff44] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#44ff44] font-black uppercase flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                STAGE 3 / 3: HARMONIZE ALL 6 RESONANCE VECTORS
              </span>
              <Zap size={14} className="text-[#ffdd00]" />
            </div>

            <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-black border border-black p-2 flex items-center justify-between text-[#a0a0d0]">
                <span>POLARITY:</span>
                <span className={invertPolarity ? 'text-[#44ff44] font-black' : 'text-[#ff4444]'}>
                  {invertPolarity ? 'INVERTED ✓' : 'STANDARD ✗'}
                </span>
              </div>
              <div className="bg-black border border-black p-2 flex items-center justify-between text-[#a0a0d0]">
                <span>WAVE:</span>
                <span className={waveMode === 'sine' ? 'text-[#44ff44] font-black' : 'text-[#ff4444]'}>
                  {waveMode.toUpperCase()} {waveMode === 'sine' ? '✓' : '✗'}
                </span>
              </div>
              <div className="bg-black border border-black p-2 flex items-center justify-between text-[#a0a0d0]">
                <span>FLUX RATIO:</span>
                <span
                  className={
                    fluxAlpha === 50 && fluxBeta === 50 && fluxGamma === 50
                      ? 'text-[#44ff44] font-black'
                      : 'text-[#ff4444]'
                  }
                >
                  {fluxAlpha}/{fluxBeta}/{fluxGamma} (50% eq)
                </span>
              </div>
              <div className="bg-black border border-black p-2 flex items-center justify-between text-[#a0a0d0]">
                <span>DECOY OVERRIDES:</span>
                <span className="text-[#44ff44] font-black">BYPASSED ✓</span>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleFinalSynchronize}
              className="w-full py-3 bg-[#44ff44] hover:bg-[#66ff66] text-black border-4 border-black font-heading font-black text-sm uppercase shadow-[4px_4px_0_0_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 animate-pulse"
            >
              <Sparkles size={16} />
              SYNCHRONIZE HARMONIC SINGULARITY
            </button>
          </div>
        )}

        {/* Progressive Hint Drawer */}
        <div className="w-full bg-[#101026] border-2 border-black p-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#ffdd00] font-bold uppercase">
              <HelpCircle size={13} />
              <span>STAGE {currentStage} RELUCTANT GUIDANCE</span>
            </div>
            <button
              onClick={handleCycleHint}
              className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black font-pixel text-[10px] font-black uppercase border border-black cursor-pointer transition-colors shadow-[1px_1px_0_0_#000]"
            >
              {hintLevel === 0
                ? 'REVEAL HINT 1'
                : hintLevel === 1
                ? 'REVEAL HINT 2'
                : hintLevel === 2
                ? 'REVEAL HINT 3'
                : 'CYCLE HINTS'}
            </button>
          </div>

          {hintLevel > 0 && (
            <div className="bg-[#080816] border border-[#ffdd00] p-2 text-left font-mono text-[11px] text-[#f0f0ff] animate-fadeIn">
              <span className="font-bold text-[#ffdd00] mr-1.5">
                {HINTS[currentStage][hintLevel - 1].title}:
              </span>
              <span>{HINTS[currentStage][hintLevel - 1].text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Victory Overlay Modal */}
      {victoryPhase !== 'idle' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, #00f0ff 2px, #00f0ff 4px)',
            }}
          />

          <div className="relative z-10 max-w-md w-full bg-[#1a0f28] border-8 border-black p-6 shadow-[0_0_30px_rgba(255,68,68,0.4),8px_8px_0_0_#000] flex flex-col items-center text-center">
            {victoryPhase === 'freeze' && (
              <div className="py-8 font-mono text-sm text-[#ffdd00] font-black uppercase animate-pulse">
                [ SINGULARITY COLLAPSED // INGRESS TO FINAL CORE UNLOCKED ]
              </div>
            )}

            {(victoryPhase === 'cleared' || victoryPhase === 'elzzup-reaction') && (
              <div className="flex flex-col items-center my-4 animate-fadeIn">
                <div className="font-mono text-xs text-[#44ff44] font-black tracking-widest uppercase mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  CHAMBER_19 // COMPLETE
                </div>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#ffdd00] uppercase tracking-tight drop-shadow-[3px_3px_0_#000]">
                  FLOOR 19
                </h1>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-widest mt-1 drop-shadow-[2px_2px_0_#000]">
                  CLEARED
                </h2>
              </div>
            )}

            {victoryPhase === 'elzzup-reaction' && (
              <div className="bg-[#0c0c1e] border-2 border-[#ff4444] p-3 mt-3 w-full animate-fadeIn shadow-[2px_2px_0_0_#000]">
                <div className="font-pixel text-[10px] text-[#ff4444] uppercase font-bold mb-1">
                  ELZZUP // ROOT CORE:
                </div>
                <p className="font-dialogue text-xs sm:text-sm text-[#ffdd00] font-bold">
                  "...Impressive. You solved all 19 chambers. But Floor 20 is not a chamber. Floor 20 is ME."
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
