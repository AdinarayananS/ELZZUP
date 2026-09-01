import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Logo } from '../components/Logo';
import {
  Skull,
  ShieldAlert,
  Sparkles,
  Zap,
  Eye,
  AlertOctagon,
  XCircle,
  HelpCircle,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Sliders,
} from 'lucide-react';

type StageType = 1 | 2 | 3 | 4 | 5;

export const Room20: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [currentStage, setCurrentStage] = useState<StageType>(1);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBossGlitching, setIsBossGlitching] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [failBanner, setFailBanner] = useState<string | null>(null);

  const [bossDialogue, setBossDialogue] = useState<string>(
    'YOU DARE ENTER THE ROOT CORE OF ELZZUP?'
  );

  // --- STAGE 1 (HARD): Shield Frequency Relay ---
  const [shieldSequence, setShieldSequence] = useState<string[]>([]);

  // --- STAGE 2 (RAGE-BAIT): Optical Filter vs Instant Win Bait ---
  const [opticalFilter, setOpticalFilter] = useState(false);

  // --- STAGE 3 (HARD): Dual-Node Quantum Alignment ---
  const [nodeAPolarity, setNodeAPolarity] = useState<boolean>(false);
  const [nodeBPolarity, setNodeBPolarity] = useState<boolean>(false);
  const [nodeAFreq, setNodeAFreq] = useState<number>(20);
  const [nodeBFreq, setNodeBFreq] = useState<number>(80);

  // --- STAGE 4 (RAGE-BAIT): The Fake Self-Destruct / Elzzup's Direct Intercept ---
  const [cableUnplugged, setCableUnplugged] = useState<boolean>(false);

  // --- STAGE 5 (HARD / FINAL): Root Kernel Decompilation (P-U-Z-Z-L-E) ---
  const TARGET_WORD = ['P', 'U', 'Z', 'Z', 'L', 'E'];
  const [spellProgress, setSpellProgress] = useState<string[]>([]);

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Stage-specific Progressive Hints
  const HINTS: Record<StageType, Array<{ level: number; title: string; text: string }>> = {
    1: [
      {
        level: 1,
        title: 'HINT 1 [SHIELD FREQUENCIES]',
        text: "Elzzup: \"My shield harmonics are resonant. You cannot shatter them in alphabetical order.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [DESCENDING ORDER]',
        text: "Elzzup: \"Shatter highest frequency to lowest frequency: Gamma (300 MHz) → Beta (200 MHz) → Alpha (100 MHz).\"",
      },
      {
        level: 3,
        title: 'HINT 3 [DIRECT]',
        text: "Elzzup: \"Click Gamma, then Beta, then Alpha to collapse all 3 shield layers.\"",
      },
    ],
    2: [
      {
        level: 1,
        title: 'HINT 1 [RAGE-BAIT]',
        text: "Elzzup: \"Did you really think the big yellow 'INSTANT WIN' button wouldn't be a trap?\"",
      },
      {
        level: 2,
        title: 'HINT 2 [OPTICAL FILTER]',
        text: "Elzzup: \"Toggle the 'LENS' switch on the top right to expose the invisible True Core switch.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [DIRECT]',
        text: "Elzzup: \"Turn Lens to 'TRUE SPECTRUM' -> Click the green 'PURGE CORE' switch.\"",
      },
    ],
    3: [
      {
        level: 1,
        title: 'HINT 1 [DUAL HARMONICS]',
        text: "Elzzup: \"Both quantum nodes must be balanced at 50 MHz with inverted polarity alignment.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [CONNECTION]',
        text: "Elzzup: \"Toggle Node A Polarity ON, Node B Polarity ON, and set both Frequency Sliders to exactly 50.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [STRONG]',
        text: "Elzzup: \"Node A: Inverted / 50. Node B: Inverted / 50. Then press 'LOCK QUANTUM ALIGNMENT'.\"",
      },
    ],
    4: [
      {
        level: 1,
        title: 'HINT 1 [RAGE-BAIT 2]',
        text: "Elzzup: \"Haha! The big red Abort button is hardwired to nothing! You can't stop the core through software!\"",
      },
      {
        level: 2,
        title: 'HINT 2 [PHYSICAL BYPASS]',
        text: "Elzzup: \"Look at the live root data cable plugged into my dialogue terminal box.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [DIRECT]',
        text: "Elzzup: \"Click the pulsing 'DATA CABLE [PLUGGED]' terminal to yank my root connection.\"",
      },
    ],
    5: [
      {
        level: 1,
        title: 'HINT 1 [THE TRUE FINAL PUZZLE]',
        text: "Elzzup: \"My name is ELZZUP. To destroy me, you must decompile what I was built from.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [THE SECRET WORD]',
        text: "Elzzup: \"Reverse ELZZUP letter by letter: P - U - Z - Z - L - E.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [FINAL BLOW]',
        text: "Elzzup: \"Spell P -> U -> Z -> Z -> L -> E on the kernel keyboard to finish this once and for all.\"",
      },
    ],
  };

  const handleCycleHint = () => {
    sound.playClick(soundEnabled);
    setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  // --- STAGE 1: SHIELD MATRIX (Gamma -> Beta -> Alpha) ---
  const handleShieldClick = (id: string) => {
    if (isProcessing || currentStage !== 1) return;
    sound.playClick(soundEnabled);

    const nextSeq = [...shieldSequence, id];
    setShieldSequence(nextSeq);

    const TARGET = ['gamma', 'beta', 'alpha'];
    const curIdx = nextSeq.length - 1;

    if (nextSeq[curIdx] !== TARGET[curIdx]) {
      handleFail('SHIELD DEFLECTION! Shatter in descending frequency (Gamma 300MHz → Beta 200MHz → Alpha 100MHz).');
      setShieldSequence([]);
      return;
    }

    if (nextSeq.length === 3) {
      sound.playSuccess(soundEnabled);
      setIsProcessing(true);
      setIsBossGlitching(true);
      setBossDialogue('MY HARMONIC SHIELDS?! IMPOSSIBLE! BUT YOU CANNOT BYPASS THE CORE MATRIX!');

      const t = window.setTimeout(() => {
        setIsBossGlitching(false);
        setIsProcessing(false);
        setHintLevel(0);
        setCurrentStage(2);
      }, 1200);
      timersRef.current.push(t);
    }
  };

  // --- STAGE 2: RAGE-BAIT (Instant Win Bait vs Optical Lens) ---
  const handleStage2Action = (type: 'fake-bait' | 'false-red' | 'true-core') => {
    if (isProcessing || currentStage !== 2) return;
    sound.playClick(soundEnabled);

    if (type === 'fake-bait') {
      sound.playGlitch(soundEnabled);
      setScreenShake(true);
      setBossDialogue('HAHA! You really thought an "INSTANT WIN" button would work against ME?!');
      handleFail('FELL FOR BOSS BAIT! Did you really trust an Instant Win button?');
      return;
    }

    if (type === 'false-red') {
      handleFail('RAW CORE OVERLOAD! Activate the OPTICAL FILTER to reveal the true purge relay.');
      return;
    }

    if (type === 'true-core') {
      if (!opticalFilter) {
        handleFail('INCORRECT SPECTRUM! Toggle the Lens to TRUE SPECTRUM first.');
        return;
      }
      sound.playSuccess(soundEnabled);
      setIsProcessing(true);
      setIsBossGlitching(true);
      setBossDialogue('NO! MY INVISIBLE LOGIC IS EXPOSED! ENGAGING DUAL QUANTUM NODES!');

      const t = window.setTimeout(() => {
        setIsBossGlitching(false);
        setIsProcessing(false);
        setHintLevel(0);
        setCurrentStage(3);
      }, 1200);
      timersRef.current.push(t);
    }
  };

  // --- STAGE 3: HARD (Dual-Node Quantum Alignment) ---
  const handleStage3Submit = () => {
    if (isProcessing || currentStage !== 3) return;
    sound.playClick(soundEnabled);

    const isAligned =
      nodeAPolarity &&
      nodeBPolarity &&
      nodeAFreq === 50 &&
      nodeBFreq === 50;

    if (isAligned) {
      sound.playSuccess(soundEnabled);
      setIsProcessing(true);
      setIsBossGlitching(true);
      setBossDialogue('HOW ARE YOU HARMONIZING MY DUAL QUANTUM NODES?! ENGAGING SELF-DESTRUCT LOCKOUT!');

      const t = window.setTimeout(() => {
        setIsBossGlitching(false);
        setIsProcessing(false);
        setHintLevel(0);
        setCurrentStage(4);
      }, 1200);
      timersRef.current.push(t);
    } else {
      handleFail('QUANTUM MISALIGNMENT! Both Node A & Node B must have Polarity INVERTED and Frequency set to 50 MHz.');
    }
  };

  // --- STAGE 4: RAGE-BAIT (The Fake Self-Destruct Abort vs Cable Pull) ---
  const handleFakeAbort = () => {
    if (isProcessing || currentStage !== 4) return;
    sound.playGlitch(soundEnabled);
    setScreenShake(true);
    setBossDialogue('HAHAHA! That "ABORT" button was wired to a blank circuit! You can\'t stop me with software!');
    handleFail('DECOY ABORT BUTTON! Look at the physical DATA CABLE connected to Elzzup.');
  };

  const handleUnplugCable = () => {
    if (isProcessing || currentStage !== 4) return;
    sound.playSuccess(soundEnabled);
    setCableUnplugged(true);
    setIsProcessing(true);
    setIsBossGlitching(true);
    setBossDialogue('WHAT?! YOU UNPLUGGED MY DIRECT DATA FEED?! ROOT KERNEL COMPROMISED!');

    const t = window.setTimeout(() => {
      setIsBossGlitching(false);
      setIsProcessing(false);
      setHintLevel(0);
      setCurrentStage(5);
    }, 1200);
    timersRef.current.push(t);
  };

  // --- STAGE 5: THE TRUE FINAL PUZZLE (Spell P-U-Z-Z-L-E) ---
  const handleLetterClick = (letter: string) => {
    if (isProcessing || currentStage !== 5) return;
    sound.playClick(soundEnabled);

    const nextLetters = [...spellProgress, letter];
    setSpellProgress(nextLetters);

    const curIdx = nextLetters.length - 1;
    if (nextLetters[curIdx] !== TARGET_WORD[curIdx]) {
      handleFail('MEMORY CORRUPTION! To decompile ELZZUP, spell the reverse word (P - U - Z - Z - L - E).');
      setSpellProgress([]);
      return;
    }

    sound.playSuccess(soundEnabled, 0.4);
    setIsBossGlitching(true);
    const glitchStop = window.setTimeout(() => setIsBossGlitching(false), 250);
    timersRef.current.push(glitchStop);

    if (nextLetters.length === 6) {
      // TRUE FINAL VICTORY!
      setIsProcessing(true);
      setIsBossGlitching(true);
      sound.playGlitch(soundEnabled, 1.0);
      setBossDialogue('HOW... COULD A HUMAN... OUTSMART MY ENTIRE CODEBASE...?!');

      const t1 = window.setTimeout(() => {
        onSuccess('ELZZUP DEFEATED', '...for real.');
      }, 1500);
      timersRef.current.push(t1);
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
      className={`relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 select-none ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Top Header & 5-Stage Rhythm Tracker */}
      <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-2 mb-1 px-1">
        <div className="font-mono text-[10px] sm:text-xs text-[#ff4444] tracking-widest uppercase font-black flex items-center gap-1.5 animate-pulse">
          <Skull size={14} />
          <span>CHAMBER 20 // THE TRUE FINAL CORE</span>
        </div>

        {/* 5-Stage Progress Indicator */}
        <div className="flex items-center gap-1 bg-[#100818] border-2 border-[#ff4444] px-2 py-0.5 shadow-[2px_2px_0_0_#000]">
          {[
            { num: 1, type: 'HARD' },
            { num: 2, type: 'RAGE' },
            { num: 3, type: 'HARD' },
            { num: 4, type: 'RAGE' },
            { num: 5, type: 'FINAL' },
          ].map((stg) => (
            <span
              key={stg.num}
              className={`px-1.5 py-0.2 font-pixel text-[8px] font-black border border-black ${
                currentStage === stg.num
                  ? 'bg-[#ffdd00] text-black shadow-[0_0_8px_#ffdd00]'
                  : currentStage > stg.num
                  ? 'bg-[#44ff44] text-black'
                  : 'bg-[#220a22] text-[#884466]'
              }`}
            >
              20.{stg.num} ({stg.type})
            </span>
          ))}
        </div>
      </div>

      {/* Main Boss Arena Box */}
      <div
        className={`bg-[#14081c] border-4 border-black p-3 sm:p-4 shadow-[0_0_30px_rgba(255,68,68,0.4),6px_6px_0_0_#000] flex flex-col items-center max-w-xl w-full transition-all gap-2.5 ${
          isBossGlitching ? 'border-[#ff4444] scale-[1.01]' : 'border-black'
        }`}
      >
        {/* Boss Avatar & Dialogue Stream */}
        <div className="w-full bg-[#1e0d28] border-3 border-[#ff4444] p-2.5 flex flex-col sm:flex-row items-center gap-3 shadow-[4px_4px_0_0_#000]">
          <div className="w-14 h-14 shrink-0 bg-black border-2 border-[#ff4444] flex items-center justify-center p-1 shadow-[2px_2px_0_0_#000]">
            <Logo
              size="sm"
              mood={currentStage === 5 && spellProgress.length === 6 ? 'worried' : 'glitched'}
              isCorrupted={true}
              animated={true}
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="font-pixel text-[10px] text-[#ff8888] font-bold uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1">
              <AlertOctagon size={12} />
              <span>ELZZUP // ROOT CONSCIOUSNESS</span>
            </div>
            <div className="font-dialogue font-bold text-xs sm:text-sm text-[#ffdd00] tracking-wide leading-tight">
              "{bossDialogue}"
            </div>
          </div>
        </div>

        {/* Error / Rage-Bait Banner */}
        {failBanner && (
          <div className="w-full bg-[#ff4444] text-black p-2 border-3 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-1.5 font-heading font-black text-xs uppercase">
              <XCircle size={15} className="text-black shrink-0" />
              <span>{failBanner}</span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* --- STAGE 1 (HARD): HARMONIC SHIELDS (GAMMA -> BETA -> ALPHA) --- */}
        {/* ========================================================= */}
        {currentStage === 1 && (
          <div className="w-full flex flex-col items-center animate-fadeIn gap-2">
            <div className="w-full bg-[#0c0c1e] border-2 border-[#ffdd00] p-2 text-center font-pixel text-xs text-[#ffdd00] uppercase font-bold shadow-[2px_2px_0_0_#000]">
              STAGE 20.1 [HARD]: SHATTER SHIELDS (300 MHz → 200 MHz → 100 MHz)
            </div>

            <div className="grid grid-cols-3 gap-2.5 w-full">
              {[
                { id: 'alpha', name: 'ALPHA', freq: '100 MHz' },
                { id: 'beta', name: 'BETA', freq: '200 MHz' },
                { id: 'gamma', name: 'GAMMA', freq: '300 MHz' },
              ].map((shield) => {
                const isDown = shieldSequence.includes(shield.id);
                return (
                  <button
                    key={shield.id}
                    disabled={isDown || isProcessing}
                    onClick={() => handleShieldClick(shield.id)}
                    className={`h-20 border-3 border-black font-mono flex flex-col items-center justify-center p-1.5 shadow-[4px_4px_0_0_#000] cursor-pointer transition-all ${
                      isDown
                        ? 'bg-[#1a1a2a] text-[#666688] shadow-none cursor-default'
                        : 'bg-[#ff4444] hover:bg-[#ff6666] text-black active:translate-y-0.5'
                    }`}
                  >
                    <ShieldAlert size={14} className="mb-0.5" />
                    <span className="font-pixel text-[11px] font-black">{shield.name}</span>
                    <span className="font-mono text-[10px] font-bold">
                      {isDown ? '[OFFLINE]' : shield.freq}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* --- STAGE 2 (RAGE-BAIT): OPTICAL FILTER VS INSTANT WIN BAIT --- */}
        {/* ========================================================= */}
        {currentStage === 2 && (
          <div className="w-full flex flex-col items-center animate-fadeIn gap-2">
            <div className="w-full flex items-center justify-between px-1">
              <span className="font-pixel text-xs text-[#ffdd00] font-black uppercase">
                STAGE 20.2 [RAGE-BAIT]: UNMASK TRUE RELAY
              </span>
              <button
                onClick={() => {
                  sound.playClick(soundEnabled);
                  setOpticalFilter(!opticalFilter);
                }}
                className={`px-2.5 py-1 border-2 border-black font-pixel text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-0.5 ${
                  opticalFilter ? 'bg-[#44ff44] text-black' : 'bg-[#2a2a4a] text-[#f0f0ff]'
                }`}
              >
                <Eye size={12} />
                <span>LENS: {opticalFilter ? 'TRUE SPECTRUM' : 'STANDARD'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 w-full">
              <button
                disabled={isProcessing}
                onClick={() => handleStage2Action('fake-bait')}
                className="h-20 bg-[#ffdd00] hover:bg-[#ffee44] text-black border-3 border-black font-heading font-black text-xs flex flex-col items-center justify-center p-1 shadow-[4px_4px_0_0_#000] active:translate-y-0.5 cursor-pointer"
              >
                <span>INSTANT</span>
                <span>WIN ⚡</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleStage2Action('false-red')}
                className="h-20 bg-[#ff4444] hover:bg-[#ff6666] text-black border-3 border-black font-heading font-black text-xs flex flex-col items-center justify-center p-1 shadow-[4px_4px_0_0_#000] active:translate-y-0.5 cursor-pointer"
              >
                <span>RAW</span>
                <span>CORE</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleStage2Action('true-core')}
                className={`h-20 border-3 border-black font-heading font-black text-xs flex flex-col items-center justify-center p-1 shadow-[4px_4px_0_0_#000] active:translate-y-0.5 cursor-pointer transition-all ${
                  opticalFilter
                    ? 'bg-[#44ff44] text-black hover:bg-[#66ff66] animate-pulse scale-105'
                    : 'bg-[#2a2a4a] text-[#a0a0d0]'
                }`}
              >
                <span>{opticalFilter ? 'PURGE' : 'VOID'}</span>
                <span>{opticalFilter ? 'CORE ✓' : 'RELAY'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* --- STAGE 3 (HARD): DUAL QUANTUM NODE ALIGNMENT --- */}
        {/* ========================================================= */}
        {currentStage === 3 && (
          <div className="w-full flex flex-col items-center animate-fadeIn gap-2">
            <div className="w-full bg-[#0c0c1e] border-2 border-[#00f0ff] p-2 text-center font-pixel text-xs text-[#00f0ff] uppercase font-bold shadow-[2px_2px_0_0_#000]">
              STAGE 20.3 [HARD]: DUAL QUANTUM NODE HARMONIZATION (50/50 EQ)
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full">
              {/* NODE A */}
              <div className="bg-black border-2 border-black p-2 flex flex-col items-center gap-1">
                <span className="font-pixel text-[10px] text-[#ffdd00] font-black">
                  NODE A (FLUX: {nodeAFreq} MHz)
                </span>
                <button
                  onClick={() => {
                    sound.playClick(soundEnabled);
                    setNodeAPolarity((p) => !p);
                  }}
                  className={`px-2 py-0.5 font-pixel text-[9px] border border-black cursor-pointer ${
                    nodeAPolarity ? 'bg-[#44ff44] text-black' : 'bg-[#2a2a4a] text-white'
                  }`}
                >
                  POLARITY: {nodeAPolarity ? 'INVERTED ✓' : 'NORMAL ✗'}
                </button>
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => {
                      sound.playClick(soundEnabled);
                      setNodeAFreq((p) => Math.max(0, p - 10));
                    }}
                    className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] hover:text-black font-pixel text-[9px] text-white border border-black cursor-pointer"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick(soundEnabled);
                      setNodeAFreq((p) => Math.min(100, p + 10));
                    }}
                    className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] hover:text-black font-pixel text-[9px] text-white border border-black cursor-pointer"
                  >
                    +10
                  </button>
                </div>
              </div>

              {/* NODE B */}
              <div className="bg-black border-2 border-black p-2 flex flex-col items-center gap-1">
                <span className="font-pixel text-[10px] text-[#ffdd00] font-black">
                  NODE B (FLUX: {nodeBFreq} MHz)
                </span>
                <button
                  onClick={() => {
                    sound.playClick(soundEnabled);
                    setNodeBPolarity((p) => !p);
                  }}
                  className={`px-2 py-0.5 font-pixel text-[9px] border border-black cursor-pointer ${
                    nodeBPolarity ? 'bg-[#44ff44] text-black' : 'bg-[#2a2a4a] text-white'
                  }`}
                >
                  POLARITY: {nodeBPolarity ? 'INVERTED ✓' : 'NORMAL ✗'}
                </button>
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => {
                      sound.playClick(soundEnabled);
                      setNodeBFreq((p) => Math.max(0, p - 10));
                    }}
                    className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] hover:text-black font-pixel text-[9px] text-white border border-black cursor-pointer"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick(soundEnabled);
                      setNodeBFreq((p) => Math.min(100, p + 10));
                    }}
                    className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] hover:text-black font-pixel text-[9px] text-white border border-black cursor-pointer"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleStage3Submit}
              className="w-full py-2 bg-[#00f0ff] hover:bg-[#66f6ff] text-black border-3 border-black font-heading font-black text-xs uppercase shadow-[3px_3px_0_0_#000] cursor-pointer"
            >
              LOCK QUANTUM ALIGNMENT ➔
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* --- STAGE 4 (RAGE-BAIT): THE FAKE ABORT BUTTON VS PHYSICAL CABLE --- */}
        {/* ========================================================= */}
        {currentStage === 4 && (
          <div className="w-full flex flex-col items-center animate-fadeIn gap-2">
            <div className="w-full bg-[#2a0818] border-2 border-[#ff4444] p-2 text-center font-pixel text-xs text-[#ff8888] uppercase font-bold shadow-[2px_2px_0_0_#000]">
              STAGE 20.4 [RAGE-BAIT]: ROOT BYPASS INTERCEPT
            </div>

            {/* Huge Deceptive Abort Button */}
            <button
              onClick={handleFakeAbort}
              className="w-full py-3 bg-[#ff4444] hover:bg-[#ff6666] text-black border-4 border-black font-heading font-black text-sm uppercase shadow-[4px_4px_0_0_#000] cursor-pointer animate-pulse"
            >
              ⚠ EMERGENCY SYSTEM ABORT ⚠
            </button>

            {/* Subtle Physical Data Cable */}
            <div className="w-full bg-black border-2 border-[#44ff44] p-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#44ff44] font-bold">
                {cableUnplugged ? 'ROOT DATA CABLE: [DISCONNECTED]' : 'ROOT DATA CABLE: [CONNECTED TO CORE]'}
              </span>
              <button
                onClick={handleUnplugCable}
                className="px-3 py-1 bg-[#44ff44] hover:bg-[#66ff66] text-black font-pixel text-[9px] font-black uppercase border border-black cursor-pointer shadow-[2px_2px_0_0_#000]"
              >
                PULL ROOT CABLE ⚡
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* --- STAGE 5 (HARD / FINAL): THE TRUE FINAL WORD (P-U-Z-Z-L-E) --- */}
        {/* ========================================================= */}
        {currentStage === 5 && (
          <div className="w-full flex flex-col items-center animate-fadeIn gap-2">
            <div className="w-full bg-[#0c0c1e] border-2 border-[#ffdd00] p-2 text-center font-pixel text-xs text-[#ffdd00] uppercase font-bold shadow-[2px_2px_0_0_#000]">
              STAGE 20.5 [THE TRUE FINAL PUZZLE]: DECOMPILE ROOT KERNEL (P-U-Z-Z-L-E)
            </div>

            {/* Spell Progress Meter */}
            <div className="flex gap-2 my-1">
              {TARGET_WORD.map((targetChar, idx) => {
                const isTyped = spellProgress.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-8 h-8 sm:w-9 sm:h-9 border-3 border-black flex items-center justify-center font-heading font-black text-base shadow-[2px_2px_0_0_#000] ${
                      isTyped
                        ? 'bg-[#44ff44] text-black animate-pulse'
                        : 'bg-[#2a2a4a] text-[#666688]'
                    }`}
                  >
                    {isTyped ? targetChar : '_'}
                  </div>
                );
              })}
            </div>

            {/* Letter Keypad: E, L, Z, Z, U, P */}
            <div className="grid grid-cols-6 gap-1.5 w-full">
              {['P', 'U', 'Z', 'L', 'E', 'Z'].map((letter, idx) => (
                <button
                  key={idx}
                  disabled={isProcessing}
                  onClick={() => handleLetterClick(letter)}
                  className="h-12 bg-[#ffdd00] hover:bg-[#ffee44] text-black border-3 border-black font-heading font-black text-lg shadow-[2px_2px_0_0_#000] active:translate-y-0.5 cursor-pointer"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progressive Hint Drawer */}
        <div className="w-full bg-[#100818] border-2 border-black p-2 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#ffdd00] font-bold uppercase">
              <HelpCircle size={12} />
              <span>STAGE 20.{currentStage} RELUCTANT GUIDANCE</span>
            </div>
            <button
              onClick={handleCycleHint}
              className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black font-pixel text-[9px] font-black uppercase border border-black cursor-pointer transition-colors shadow-[1px_1px_0_0_#000]"
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
            <div className="bg-[#080816] border border-[#ffdd00] p-1.5 text-left font-mono text-[10px] text-[#f0f0ff] animate-fadeIn">
              <span className="font-bold text-[#ffdd00] mr-1">
                {HINTS[currentStage][hintLevel - 1].title}:
              </span>
              <span>{HINTS[currentStage][hintLevel - 1].text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
