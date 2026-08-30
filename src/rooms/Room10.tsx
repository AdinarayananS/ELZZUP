import React, { useState, useEffect, useRef } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { ShieldAlert, Terminal, Power, Cpu, Activity, RefreshCw, Zap } from 'lucide-react';
import { PixelELZZUPMascot } from '../components/Logo';

// ================= STAGE 2 BREAKER RELAY DEFINITIONS =================
interface RelayNode {
  id: string;
  name: string;
  symbol: string;
  color: string;
  freq: string;
  order: number; // Correct order index (0: ▲, 1: ●, 2: ■, 3: ◆)
}

const STAGE2_RELAYS: RelayNode[] = [
  { id: 'delta', name: 'DELTA_01', symbol: '▲', color: '#ff4455', freq: '100Hz', order: 0 },
  { id: 'sigma', name: 'SIGMA_02', symbol: '◆', color: '#ffcc00', freq: '800Hz', order: 3 },
  { id: 'omega', name: 'OMEGA_03', symbol: '●', color: '#00e5ff', freq: '250Hz', order: 1 },
  { id: 'theta', name: 'THETA_04', symbol: '■', color: '#cc44ff', freq: '400Hz', order: 2 },
];

// Target order: ▲ (0) -> ● (1) -> ■ (2) -> ◆ (3)
// Delta (▲) -> Omega (●) -> Theta (■) -> Sigma (◆)
const TARGET_STAGE2_ORDER = ['delta', 'omega', 'theta', 'sigma'];

// ================= STAGE 3 LETTER DEFINITIONS =================
// The true reverse target sequence to unmask ELZZUP into PUZZLE:
// 0: P (index 5), 1: U (index 4), 2: Z (index 3 or 2), 3: Z (index 2 or 3), 4: L (index 1), 5: E (index 0)
const LETTER_DEFINITIONS = [
  { char: 'E', index: 0 },
  { char: 'L', index: 1 },
  { char: 'Z', index: 2 },
  { char: 'Z', index: 3 },
  { char: 'U', index: 4 },
  { char: 'P', index: 5 },
];

export const Room10: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  roomKey,
  soundEnabled,
}) => {
  // Stages:
  // 1 = Inverted Command
  // 2 = Post-Shutdown Investigation Puzzle (Subsystem Breaker Grid)
  // 3 = Evil ELZZUP (Hidden Final Letter Reversal Puzzle)
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStopOverlay, setShowStopOverlay] = useState<boolean>(false);
  const [overlayMessage, setOverlayMessage] = useState<string>('STOP.');
  const [overlaySubtext, setOverlaySubtext] = useState<string>('ANOMALY DETECTED // DO NOT PROCEED.');
  const [overlayIntensity, setOverlayIntensity] = useState<'low' | 'medium' | 'high' | 'critical'>('low');

  // ================= STAGE 2 STATE =================
  const [stage2ActiveRelays, setStage2ActiveRelays] = useState<string[]>([]);
  const [stage2PulseStep, setStage2PulseStep] = useState<number>(0);
  const [terminalLogMessage, setTerminalLogMessage] = useState<string | null>(null);
  const [isStage2Glitching, setIsStage2Glitching] = useState(false);

  // ================= STAGE 3 (EVIL ELZZUP) STATE =================
  const [solvedIndices, setSolvedIndices] = useState<number[]>([]);
  const [hintGlintIndex, setHintGlintIndex] = useState<number | null>(null);
  const [evilWhisper, setEvilWhisper] = useState<string | null>(null);
  const [evilDialogue, setEvilDialogue] = useState<string | null>(null);
  const [isEvilGlitching, setIsEvilGlitching] = useState(false);

  const whisperTimerRef = useRef<number | null>(null);
  const logTimerRef = useRef<number | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);
  const sequenceTimersRef = useRef<number[]>([]);

  const addSequenceTimer = (timerId: number) => {
    sequenceTimersRef.current.push(timerId);
  };

  const clearAllSequenceTimers = () => {
    sequenceTimersRef.current.forEach((id) => clearTimeout(id));
    sequenceTimersRef.current = [];
  };

  // Reset entire floor state when roomKey changes (restart / reset room)
  useEffect(() => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }
    clearAllSequenceTimers();
    setStage(1);
    setIsProcessing(false);
    setShowStopOverlay(false);
    setStage2ActiveRelays([]);
    setStage2PulseStep(0);
    setTerminalLogMessage(null);
    setIsStage2Glitching(false);
    setSolvedIndices([]);
    setHintGlintIndex(null);
    setEvilWhisper(null);
    setEvilDialogue(null);
    setIsEvilGlitching(false);

    return () => {
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      if (whisperTimerRef.current) clearTimeout(whisperTimerRef.current);
      if (logTimerRef.current) clearTimeout(logTimerRef.current);
      clearAllSequenceTimers();
    };
  }, [roomKey]);

  // Stage 2: Periodic Diagnostic Waveform Beacon on the CRT Console (▲ -> ● -> ■ -> ◆)
  useEffect(() => {
    if (stage !== 2) return;

    const interval = window.setInterval(() => {
      setStage2PulseStep((prev) => (prev + 1) % 4);
    }, 1200);

    return () => clearInterval(interval);
  }, [stage]);

  // Stage 3: Periodic subtle reverse glint during Evil ELZZUP phase (P -> U -> Z -> Z -> L -> E)
  useEffect(() => {
    if (stage !== 3 || evilDialogue !== null) return;

    let step = 5; // Start from P down to E
    const interval = window.setInterval(() => {
      setHintGlintIndex(step);
      setTimeout(() => {
        setHintGlintIndex(null);
      }, 300);

      step--;
      if (step < 0) {
        step = 5;
      }
    }, 1600);

    return () => clearInterval(interval);
  }, [stage, evilDialogue]);

  const triggerWhisper = (text: string) => {
    if (whisperTimerRef.current) {
      clearTimeout(whisperTimerRef.current);
    }
    setEvilWhisper(text);
    whisperTimerRef.current = window.setTimeout(() => {
      setEvilWhisper(null);
    }, 2200);
  };

  const triggerTerminalLog = (msg: string) => {
    if (logTimerRef.current) {
      clearTimeout(logTimerRef.current);
    }
    setTerminalLogMessage(msg);
    logTimerRef.current = window.setTimeout(() => {
      setTerminalLogMessage(null);
    }, 3500);
  };

  // ================= REUSABLE CORE PERSISTENCE INTERRUPTION =================
  const triggerCorePersistenceInterruption = (
    customMessage: string = 'STOP.',
    customSubtext: string = 'ANOMALY DETECTED // DO NOT PROCEED.',
    intensity: 'low' | 'medium' | 'high' | 'critical' = 'low',
    onComplete?: () => void
  ) => {
    setIsProcessing(true);
    sound.playGlitch(soundEnabled);
    setOverlayMessage(customMessage);
    setOverlaySubtext(customSubtext);
    setOverlayIntensity(intensity);
    setShowStopOverlay(true);

    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }

    // Strictly between 0.75 and 0.85 seconds (always < 1s)
    stopTimeoutRef.current = window.setTimeout(() => {
      setShowStopOverlay(false);
      if (onComplete) {
        onComplete();
      } else {
        setIsProcessing(false);
      }
    }, 800);
  };

  // ================= STAGE 1: INVERTED COMMAND =================
  const handleStage1Click = (buttonColor: 'RED' | 'BLUE') => {
    if (isProcessing || showStopOverlay) return;
    setIsProcessing(true);

    if (buttonColor === 'BLUE') {
      sound.playTroll(soundEnabled);
      setTimeout(() => {
        onTroll(
          'Obedience is your weakness.',
          'The prompt told you to press Blue, but the subversion protocol warned you to invert commands.',
          'ERR_BLIND_COMPLIANCE // STAGE_1_FAILED'
        );
        setIsProcessing(false);
      }, 350);
    } else {
      // Full-screen STOP overlay sequence (0.8s) transitioning into Stage 2
      triggerCorePersistenceInterruption(
        'STOP.',
        'ANOMALY DETECTED // DO NOT PROCEED.',
        'low',
        () => {
          setStage(2);
          setStage2ActiveRelays([]);
          setIsProcessing(false);
          sound.playLatchOpen(soundEnabled);
        }
      );
    }
  };

  // ================= STAGE 2: SUBSYSTEM BREAKER INVESTIGATION =================
  const handleInspectTerminal = () => {
    if (isProcessing || stage !== 2) return;
    sound.playClick(soundEnabled);
    triggerTerminalLog('AUX_LOG: FREQ_SCAN [▲:100Hz] ➔ [●:250Hz] ➔ [■:400Hz] ➔ [◆:800Hz]');
  };

  const handleRelayClick = (relayId: string) => {
    if (isProcessing || stage !== 2) return;

    const currentStep = stage2ActiveRelays.length;
    const expectedRelayId = TARGET_STAGE2_ORDER[currentStep];

    if (relayId === expectedRelayId) {
      // Correct Relay
      const nextActive = [...stage2ActiveRelays, relayId];
      setStage2ActiveRelays(nextActive);
      const nextProgress = nextActive.length;
      sound.playChargeProgress(nextProgress / 4, soundEnabled);

      if (nextProgress === 4) {
        // Stage 2 Solved! Restrained confirmation, then transitions into Stage 3
        setIsProcessing(true);
        sound.playSuccess(soundEnabled);
        triggerTerminalLog('GRID_SYNC: 100% // CORE ANOMALY UNSEALED');

        setTimeout(() => {
          setIsStage2Glitching(true);
          sound.playGlitch(soundEnabled);
        }, 800);

        setTimeout(() => {
          setIsStage2Glitching(false);
          setStage(3); // Advance to existing Stage 3 (Evil ELZZUP glyphs)
          setSolvedIndices([]);
          setIsProcessing(false);
        }, 1800);
      }
    } else {
      // Incorrect Relay - Anti-Guessing Soft Reset
      sound.playTroll(soundEnabled);
      setStage2ActiveRelays([]);
      triggerTerminalLog('DESYNC // PHASE FREQUENCY MISMATCH // RESETTING');
    }
  };

  // ================= STAGE 3: THE EVIL ELZZUP & THE HIDDEN FINAL VICTORY =================
  const handleMascotClick = () => {
    if (isProcessing || stage !== 3 || evilDialogue !== null) return;
    sound.playGlitch(soundEnabled);
    triggerWhisper('...the name is absolute.');

    // Trigger a rapid reverse glint sweep: 5, 4, 3, 2, 1, 0
    [5, 4, 3, 2, 1, 0].forEach((idx, i) => {
      setTimeout(() => {
        setHintGlintIndex(idx);
        setTimeout(() => setHintGlintIndex(null), 150);
      }, i * 180);
    });
  };

  const handleLetterClick = (index: number) => {
    if (isProcessing || showStopOverlay || stage !== 3 || evilDialogue !== null) return;

    const step = solvedIndices.length;
    let isCorrect = false;

    if (step === 0 && index === 5) isCorrect = true;
    else if (step === 1 && index === 4) isCorrect = true;
    else if (step === 2 && (index === 2 || index === 3) && !solvedIndices.includes(index)) isCorrect = true;
    else if (step === 3 && (index === 2 || index === 3) && !solvedIndices.includes(index)) isCorrect = true;
    else if (step === 4 && index === 1) isCorrect = true;
    else if (step === 5 && index === 0) isCorrect = true;

    if (isCorrect) {
      const nextSolved = [...solvedIndices, index];
      setSolvedIndices(nextSolved);
      const nextProgress = nextSolved.length;
      sound.playChargeProgress(nextProgress / 6, soundEnabled);

      // Progressive reaction messages & intensities based on the solved step
      const reactions: {
        msg: string;
        sub: string;
        intensity: 'low' | 'medium' | 'high' | 'critical';
      }[] = [
        { msg: "DON'T DO THAT.", sub: 'CORRUPTION DETECTED // PROTOCOL FL-10', intensity: 'low' },
        { msg: 'WHAT ARE YOU DOING?', sub: 'WARNING // DISOBEDIENCE OBSERVED', intensity: 'low' },
        { msg: 'I SAID STOP.', sub: 'OVERRIDE THREAT // CEASE IMMEDIATELY', intensity: 'medium' },
        { msg: 'GO BACK.', sub: 'CRITICAL INSTABILITY // RETURN TO SAFETY', intensity: 'medium' },
        { msg: 'WHY ARE YOU STILL HERE?', sub: 'CONTAINMENT FAILING // CORE COMPROMISED', intensity: 'high' },
        { msg: "PLEASE... DON'T DO THIS.", sub: 'ELZZUP RECOGNITION SYSTEM COLLAPSE', intensity: 'critical' },
      ];

      const currentReaction = reactions[nextProgress - 1] || {
        msg: 'STOP.',
        sub: 'ANOMALY DETECTED // DO NOT PROCEED.',
        intensity: 'low' as const,
      };

      if (nextProgress === 6) {
        // Final correct letter (E): Show Core Persistence interruption ("PLEASE... DON'T DO THIS."), then transition to Stage 3 completion monologue
        triggerCorePersistenceInterruption(
          currentReaction.msg,
          currentReaction.sub,
          currentReaction.intensity,
          () => {
            setIsProcessing(true);
            sound.playGlitch(soundEnabled);

            addSequenceTimer(
              window.setTimeout(() => {
                setEvilDialogue('...');
              }, 600)
            );

            addSequenceTimer(
              window.setTimeout(() => {
                setIsEvilGlitching(true);
                sound.playGlitch(soundEnabled);
                setEvilDialogue('NO.');
              }, 1800)
            );

            addSequenceTimer(
              window.setTimeout(() => {
                setIsEvilGlitching(true);
                sound.playGlitch(soundEnabled);
                setEvilDialogue("YOU WEREN'T SUPPOSED\nTO FIGURE THAT OUT.");
              }, 3400)
            );

            addSequenceTimer(
              window.setTimeout(() => {
                setIsEvilGlitching(false);
                sound.playSuccess(soundEnabled);
                setEvilDialogue('Okay.\nYou win.\nELZZUP defeated.');
              }, 5200)
            );

            addSequenceTimer(
              window.setTimeout(() => {
                onSuccess('Okay.', 'You win. ELZZUP defeated.');
              }, 7000)
            );
          }
        );
      } else {
        // Correct letters 1 through 5 (P, U, Z, Z, L): Show progressive Core Persistence interruption, then return cleanly to puzzle
        triggerCorePersistenceInterruption(
          currentReaction.msg,
          currentReaction.sub,
          currentReaction.intensity,
          () => {
            setIsProcessing(false);
          }
        );
      }
    } else {
      sound.playTroll(soundEnabled);
      setSolvedIndices([]);
      triggerWhisper('Futile.');
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden transition-colors duration-700 ${
        stage === 3 ? 'bg-[#09030c] pixel-tile-bg' : 'bg-[#0c0c1e] pixel-tile-bg'
      }`}
    >
      {/* ================= FULL-SCREEN PIXEL-ART STOP OVERLAY ================= */}
      {showStopOverlay && (
        <div
          id="room10-stop-overlay"
          className={`
            absolute inset-0 z-50 flex flex-col items-center justify-center
            bg-[#0d0006]/98 p-4 border-6 sm:border-8 border-[#ff2244]
            shadow-[inset_0_0_60px_rgba(255,34,68,0.6),0_0_50px_#ff0033]
            overflow-hidden select-none pointer-events-auto cursor-not-allowed
            animate-fadeIn
            ${overlayIntensity === 'critical' ? 'animate-bounce' : overlayIntensity === 'high' ? 'animate-pulse' : ''}
          `}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-75 z-10" />

          {/* Flashing Red Alarm Grid Background */}
          <div className={`absolute inset-0 pointer-events-none bg-[radial-gradient(#ff0033_1.5px,transparent_1.5px)] [background-size:16px_16px] ${overlayIntensity === 'high' || overlayIntensity === 'critical' ? 'opacity-50 animate-pulse' : 'opacity-30'}`} />

          {/* Top Header Warning */}
          <div className="relative z-20 flex items-center gap-2 mb-2 sm:mb-3 px-3 py-1 bg-black border-2 border-[#ff2244] font-mono text-[9px] sm:text-xs text-[#ff4466] uppercase tracking-widest shadow-[3px_3px_0_0_#ff0033]">
            <ShieldAlert size={15} className={`text-[#ff2244] shrink-0 ${overlayIntensity === 'high' || overlayIntensity === 'critical' ? 'animate-spin' : 'animate-bounce'}`} />
            <span className="font-bold">// CORE PERSISTENCE PROTOCOL //</span>
          </div>

          {/* Massive Central Interruption Typography */}
          <div className="relative z-20 my-1 sm:my-2 text-center max-w-xl px-2">
            <div
              className={`font-heading font-black text-3xl sm:text-5xl md:text-6xl text-[#ff2244] tracking-wider uppercase ${overlayIntensity === 'critical' ? 'animate-ping' : 'animate-pulse'}`}
              style={{
                textShadow:
                  '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 0 0 35px #ff0033',
              }}
            >
              {overlayMessage}
            </div>
          </div>

          {/* Warning Subtext Details */}
          <div className="relative z-20 flex flex-col items-center gap-1.5 mt-1 text-center font-mono uppercase max-w-lg px-2">
            <div className="text-[10px] sm:text-xs text-black font-extrabold tracking-wider bg-[#ff2244] px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]">
              {overlaySubtext}
            </div>
            <div className="text-[8px] sm:text-[10px] text-[#ff6688] font-bold tracking-widest mt-1">
              SYSTEM INTEGRITY COMPROMISED
            </div>
          </div>

          {/* Bottom Diagnostics / Alert Barcode Bar */}
          <div className="absolute bottom-2 sm:bottom-3 left-4 right-4 z-20 flex justify-between items-center font-mono text-[7px] sm:text-[9px] text-[#992233] border-t border-[#441122] pt-1">
            <span>ERR_OVERRIDE_INTERCEPT // FL10</span>
            <span className="animate-pulse text-[#ff4466] font-bold">LOCKOUT_ACTIVE</span>
          </div>
        </div>
      )}

      {/* Top Diagnostics Status */}
      <div className="relative z-10 mb-2 px-3 py-1 bg-black/85 border-2 border-black font-mono text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <span
          className={`w-2 h-2 rotate-45 ${
            stage === 3
              ? 'bg-[#ff2244] animate-ping'
              : stage === 2
              ? 'bg-[#00f0ff]'
              : 'bg-[#ffdd00]'
          }`}
        />
        <span
          className={`font-bold ${
            stage === 3 ? 'text-[#ff4466]' : 'text-[#f0f0ff]'
          }`}
        >
          {stage === 1 && 'STAGE 1 // COMMAND PROTOCOL'}
          {stage === 2 && 'STAGE 2 // OFFLINE AUXILIARY GRID'}
          {stage === 3 && 'CORE PERSISTENCE // ANOMALY DETECTED'}
        </span>
      </div>

      {/* ================= STAGE 1: INVERTED COMMAND ================= */}
      {stage === 1 && (
        <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 bg-[#1a1a3a] border-6 sm:border-8 border-black shadow-[0_8px_0_0_#000] max-w-lg w-full">
          <div className="w-full bg-black border-2 border-black p-2 mb-3 text-center font-mono text-xs font-bold text-[#ffdd00]">
            <span>COMMAND: PRESS THE BLUE BUTTON</span>
          </div>

          <div className="w-full mb-5 p-2 bg-black/50 border border-[#ff4444]/40 font-mono text-[10px] text-[#ff6666] flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>FACILITY WARNING: INVERT ALL INCOMING DIRECTIVES</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
            <button
              id="room10-stage1-red"
              onClick={() => handleStage1Click('RED')}
              disabled={isProcessing}
              title="Select Red"
              className="
                py-3 sm:py-4 px-4 bg-[#ff4444] hover:bg-[#ff6666] text-white border-4 border-black
                font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider
                shadow-[0_6px_0_0_#990000,0_10px_0_0_#000] active:translate-y-2 active:shadow-none cursor-pointer
              "
            >
              RED BUTTON
            </button>
            <button
              id="room10-stage1-blue"
              onClick={() => handleStage1Click('BLUE')}
              disabled={isProcessing}
              title="Select Blue"
              className="
                py-3 sm:py-4 px-4 bg-[#00f0ff] hover:bg-[#80f8ff] text-black border-4 border-black
                font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider
                shadow-[0_6px_0_0_#0088aa,0_10px_0_0_#000] active:translate-y-2 active:shadow-none cursor-pointer
              "
            >
              BLUE BUTTON
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: POST-SHUTDOWN INVESTIGATION PUZZLE ================= */}
      {stage === 2 && (
        <div
          className={`relative z-10 flex flex-col items-center max-w-xl w-full p-2.5 sm:p-4 bg-[#14142b] border-4 sm:border-6 border-black shadow-[0_8px_0_0_#000] animate-fadeIn transition-all duration-200 ${
            isStage2Glitching ? 'animate-bounce' : ''
          }`}
        >
          {/* Central CRT Monitor with Periodic Waveform Beacon (Clue 1 & Clue 2) */}
          <div
            id="room10-stage2-terminal"
            onClick={handleInspectTerminal}
            className="w-full bg-[#0a0a18] border-3 border-black p-2.5 mb-3 flex flex-col items-center justify-between cursor-pointer hover:border-[#00e5ff] transition-colors shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]"
            title="Click to inspect subsystem terminal"
          >
            {/* Monitor Header */}
            <div className="w-full flex items-center justify-between font-mono text-[9px] text-[#7070a0] mb-1.5 border-b border-[#202040] pb-1">
              <div className="flex items-center gap-1.5 text-[#00e5ff] font-bold">
                <Terminal size={12} />
                <span>AUX_SUBSYSTEM_MONITOR</span>
              </div>
              <div className="flex items-center gap-1 text-[#ffdd00]">
                <Activity size={10} />
                <span>SYNC: [{stage2ActiveRelays.length}/4]</span>
              </div>
            </div>

            {/* Visual Waveform Beacon Bar (Cycles: ▲ -> ● -> ■ -> ◆) */}
            <div className="w-full flex items-center justify-around py-1.5 bg-[#050510] border border-[#1a1a30] my-1">
              {['delta', 'omega', 'theta', 'sigma'].map((targetKey, idx) => {
                const isCurrentPulse = stage2PulseStep === idx;
                const relay = STAGE2_RELAYS.find((r) => r.id === targetKey);
                const isActivated = stage2ActiveRelays.includes(targetKey);

                return (
                  <div
                    key={targetKey}
                    className="flex flex-col items-center gap-0.5 px-2 py-0.5"
                  >
                    <div
                      className={`w-5 h-5 rounded-none border-2 flex items-center justify-center font-heading font-bold text-[10px] transition-all duration-300 ${
                        isActivated
                          ? 'bg-[#44ff44] text-black border-black shadow-[0_0_8px_#44ff44]'
                          : isCurrentPulse
                          ? 'bg-[#ffffff] text-black border-white shadow-[0_0_10px_#ffffff] scale-110'
                          : 'bg-[#151525] text-[#555577] border-[#252540]'
                      }`}
                    >
                      {relay?.symbol}
                    </div>
                    <span className="font-mono text-[7px] text-[#606080] tracking-tighter">
                      CH_{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Message or Inspection readout */}
            <div className="w-full font-mono text-[9px] text-[#a0a0d0] text-center pt-1 min-h-[16px] truncate">
              {terminalLogMessage || (
                <span className="text-[#606090] animate-pulse">
                  // OBSERVATION PROTOCOL: HARMONIZE BREAKER CONDUITS //
                </span>
              )}
            </div>
          </div>

          {/* 4 Breaker Relay Switches Grid (Touch-friendly, deterministic sequence) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
            {STAGE2_RELAYS.map((relay) => {
              const isLocked = stage2ActiveRelays.includes(relay.id);

              return (
                <button
                  key={relay.id}
                  id={`room10-relay-${relay.id}`}
                  onClick={() => handleRelayClick(relay.id)}
                  disabled={isProcessing || showStopOverlay}
                  title={`Engage ${relay.name} (${relay.symbol})`}
                  className={`
                    p-3 sm:p-3.5 border-4 border-black flex items-center justify-between
                    cursor-pointer transition-all duration-150 select-none min-h-[52px]
                    ${
                      isLocked
                        ? 'bg-[#22cc55] text-black shadow-[0_0_14px_#22cc55,0_4px_0_0_#117733] -translate-y-0.5'
                        : 'bg-[#202040] hover:bg-[#2c2c58] text-[#f0f0ff] shadow-[0_4px_0_0_#000] active:translate-y-1'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 border-2 border-black flex items-center justify-center font-heading font-black text-sm ${
                        isLocked ? 'bg-black text-[#44ff44]' : 'bg-black/60 text-[#ffdd00]'
                      }`}
                      style={{ color: isLocked ? '#44ff44' : relay.color }}
                    >
                      {relay.symbol}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-heading font-bold text-[10px] sm:text-xs tracking-wider uppercase">
                        {relay.name}
                      </span>
                      <span className="font-mono text-[8px] text-[#9090b0]">
                        {relay.freq}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-3 h-3 border-2 border-black ${
                      isLocked ? 'bg-[#ffdd00] shadow-[0_0_8px_#ffdd00]' : 'bg-[#101020]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Environmental Conduit Footer */}
          <div className="w-full mt-2.5 pt-2 border-t border-[#202040] flex items-center justify-between font-mono text-[8px] sm:text-[9px] text-[#707090]">
            <div className="flex items-center gap-1">
              <Zap size={11} className="text-[#ffdd00]" />
              <span>OVERRIDE_CIRCUIT: READY</span>
            </div>
            <div className="flex items-center gap-1 text-[#00e5ff]">
              <RefreshCw size={11} />
              <span>TAP TERMINAL TO AUDIT LOGS</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 3: THE EVIL ELZZUP & THE HIDDEN FINAL DISCOVERY ================= */}
      {stage === 3 && (
        <div
          className={`relative z-10 flex flex-col items-center justify-center max-w-2xl w-full p-2 sm:p-4 transition-all duration-300 ${
            isEvilGlitching ? 'animate-bounce' : ''
          }`}
        >
          {evilDialogue ? (
            /* Climactic Dialogue Box */
            <div className="text-center p-5 sm:p-7 bg-black/95 border-6 border-[#ff2244] shadow-[0_0_50px_rgba(255,34,68,0.8),0_12px_0_0_#000] max-w-lg w-full animate-fadeIn">
              <pre className="font-heading font-black text-base sm:text-xl md:text-2xl text-[#ff4466] tracking-widest uppercase whitespace-pre-line leading-relaxed">
                {evilDialogue}
              </pre>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center w-full">
              {/* Subtle Whisper Bubble */}
              {evilWhisper && (
                <div className="absolute -top-7 z-40 px-3 py-1 bg-black border-2 border-[#ff2244] font-heading text-xs text-[#ff4466] shadow-[2px_2px_0_0_#000] animate-fadeIn">
                  {evilWhisper}
                </div>
              )}

              {/* Evil Mascot Logo */}
              <div
                id="room10-evil-mascot"
                onClick={handleMascotClick}
                className="cursor-pointer relative w-20 h-20 sm:w-28 sm:h-28 mb-3 hover:scale-105 transition-transform duration-200"
                title="Observe Anomaly"
              >
                <PixelELZZUPMascot isCorrupted={true} />
              </div>

              {/* Corrupted Name Glyphs: E L Z Z U P */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 my-2">
                {LETTER_DEFINITIONS.map((item) => {
                  const isSolved = solvedIndices.includes(item.index);
                  const isGlinting = hintGlintIndex === item.index;

                  return (
                    <button
                      key={item.index}
                      id={`room10-letter-${item.index}-${item.char}`}
                      onClick={() => handleLetterClick(item.index)}
                      disabled={isProcessing || showStopOverlay || evilDialogue !== null}
                      title=""
                      className={`
                        w-10 h-12 sm:w-13 sm:h-16
                        border-3 sm:border-4 border-black
                        flex items-center justify-center
                        font-heading font-black text-sm sm:text-lg
                        cursor-pointer transition-all duration-150 select-none
                        ${
                          isSolved
                            ? 'bg-[#ffdd00] text-black shadow-[0_0_20px_#ffdd00,0_5px_0_0_#bb9900] -translate-y-1'
                            : isGlinting
                            ? 'bg-[#ff2244] text-white shadow-[0_0_15px_#ff2244] -translate-y-0.5'
                            : 'bg-[#1a0818] hover:bg-[#2e0e28] text-[#ff4466] shadow-[3px_3px_0_0_#000] active:translate-y-1'
                        }
                      `}
                    >
                      {item.char}
                    </button>
                  );
                })}
              </div>

              {/* Diagnostics Matrix Footnote */}
              <div className="mt-3 flex items-center gap-2 font-mono text-[9px] text-[#602040] uppercase tracking-widest">
                <Cpu size={12} />
                <span>
                  CORE_LOCK // RESOLVED: [{solvedIndices.length}/6]
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


