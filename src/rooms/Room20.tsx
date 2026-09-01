import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Logo } from '../components/Logo';
import { Skull, ShieldAlert, Sparkles, Zap, Eye, AlertOctagon } from 'lucide-react';

type BossStage = 'stage-1-shields' | 'stage-2-deceptive-core' | 'stage-3-decompilation' | 'defeated';

export const Room20: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [stage, setStage] = useState<BossStage>('stage-1-shields');
  const [shieldSequence, setShieldSequence] = useState<string[]>([]);
  const [opticalFilter, setOpticalFilter] = useState(false);
  const [spellProgress, setSpellProgress] = useState<string[]>([]);
  const [bossDialogue, setBossDialogue] = useState<string>(
    'YOU DARE CHALLENGE THE TRUE CORE OF ELZZUP?'
  );
  const [isBossGlitching, setIsBossGlitching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // --- STAGE 1: SHIELD RELAY (GAMMA -> BETA -> ALPHA) ---
  const handleShieldClick = (id: string) => {
    if (isProcessing || stage !== 'stage-1-shields') return;
    sound.playClick(soundEnabled);

    const nextSeq = [...shieldSequence, id];
    setShieldSequence(nextSeq);

    const TARGET = ['gamma', 'beta', 'alpha'];
    const curIdx = nextSeq.length - 1;

    if (nextSeq[curIdx] !== TARGET[curIdx]) {
      setIsProcessing(true);
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setShieldSequence([]);
        onTroll(
          'Shield Reflection',
          'Shield harmonics must be shattered in descending frequency (Gamma → Beta → Alpha).',
          'ERR_SHIELD_DEFLECTION'
        );
      }, 600);
      timersRef.current.push(t);
      return;
    }

    if (nextSeq.length === 3) {
      // Stage 1 Complete!
      setIsProcessing(true);
      setIsBossGlitching(true);
      sound.playSuccess(soundEnabled);
      setBossDialogue('MY SHIELDS?! IMPOSSIBLE! BUT YOU CANNOT BYPASS THE CORE MATRIX!');

      const t = window.setTimeout(() => {
        setIsBossGlitching(false);
        setIsProcessing(false);
        setStage('stage-2-deceptive-core');
      }, 1500);
      timersRef.current.push(t);
    }
  };

  // --- STAGE 2: DECEPTIVE CORE BYPASS ---
  const handleStage2Action = (type: 'fake-bait' | 'false-red' | 'true-core') => {
    if (isProcessing || stage !== 'stage-2-deceptive-core') return;
    sound.playClick(soundEnabled);

    if (type === 'true-core' && opticalFilter) {
      // Stage 2 Complete!
      setIsProcessing(true);
      setIsBossGlitching(true);
      sound.playSuccess(soundEnabled);
      setBossDialogue('NO! MY INVISIBLE LOGIC IS EXPOSED! EXECUTING ROOT EMERGENCY PROTOCOL!');

      const t = window.setTimeout(() => {
        setIsBossGlitching(false);
        setIsProcessing(false);
        setStage('stage-3-decompilation');
      }, 1500);
      timersRef.current.push(t);
    } else if (type === 'fake-bait') {
      sound.playGlitch(soundEnabled);
      onTroll(
        'Fell for Boss Bait',
        'Did you really think the "INSTANT WIN" button would work against the creator?',
        'ERR_BOSS_BAIT'
      );
    } else {
      sound.playGlitch(soundEnabled);
      onTroll(
        'Deceptive Core Trap',
        'You pressed without the OPTICAL FILTER engaged. Activate the filter to locate the true purge switch.',
        'ERR_UNFILTERED_STRIKE'
      );
    }
  };

  // --- STAGE 3: THE FINAL WORD DECOMPILATION (P -> U -> Z -> Z -> L -> E) ---
  const TARGET_WORD = ['P', 'U', 'Z', 'Z', 'L', 'E'];

  const handleLetterClick = (letter: string) => {
    if (isProcessing || stage !== 'stage-3-decompilation') return;
    sound.playClick(soundEnabled);

    const nextLetters = [...spellProgress, letter];
    setSpellProgress(nextLetters);

    const curIdx = nextLetters.length - 1;
    if (nextLetters[curIdx] !== TARGET_WORD[curIdx]) {
      setIsProcessing(true);
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setSpellProgress([]);
        onTroll(
          'Decompilation Memory Corruption',
          'To decompile ELZZUP, you must re-spell the original word in reverse (P - U - Z - Z - L - E).',
          'ERR_ROOT_DECOMPILATION'
        );
      }, 600);
      timersRef.current.push(t);
      return;
    }

    // Letter success feedback
    sound.playSuccess(soundEnabled, 0.4);
    setIsBossGlitching(true);
    const glitchStop = window.setTimeout(() => setIsBossGlitching(false), 250);
    timersRef.current.push(glitchStop);

    if (nextLetters.length === 6) {
      // TRUE FINAL VICTORY!
      setIsProcessing(true);
      setStage('defeated');
      sound.playGlitch(soundEnabled, 1.0);
      setBossDialogue('HOW... COULD A HUMAN... OUTSMART MY ENTIRE CODEBASE...?!');

      const t1 = window.setTimeout(() => {
        onSuccess('ELZZUP DEFEATED', '...for real.');
      }, 1400);
      timersRef.current.push(t1);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* Boss Telemetry Header */}
      <div className="flex items-center justify-between max-w-xl w-full mb-3 px-2">
        <div className="font-mono text-[10px] sm:text-xs text-[#ff4444] tracking-widest uppercase font-black flex items-center gap-1.5 animate-pulse">
          <Skull size={14} />
          CHAMBER_20 // THE VOID CORE
        </div>
        <div className="font-mono text-[9px] bg-[#ff4444] text-black px-2 py-0.5 font-black uppercase">
          [FINAL_CONFRONTATION]
        </div>
      </div>

      {/* Main Boss Arena Box */}
      <div
        className={`bg-[#14081c] border-4 border-black p-4 sm:p-6 shadow-[0_0_30px_rgba(255,68,68,0.4),6px_6px_0_0_#000] flex flex-col items-center max-w-xl w-full transition-all ${
          isBossGlitching ? 'border-[#ff4444] scale-[1.01]' : 'border-black'
        }`}
      >
        {/* Boss Avatar & Dialogue Stream */}
        <div className="w-full bg-[#1e0d28] border-3 border-[#ff4444] p-3.5 mb-4 flex flex-col sm:flex-row items-center gap-3.5 shadow-[4px_4px_0_0_#000]">
          <div className="w-16 h-16 shrink-0 bg-black border-2 border-[#ff4444] flex items-center justify-center p-1 shadow-[2px_2px_0_0_#000]">
            <Logo
              size="sm"
              mood={stage === 'defeated' ? 'worried' : 'glitched'}
              isCorrupted={true}
              animated={true}
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="font-pixel text-xs text-[#ff8888] font-bold uppercase tracking-wider mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
              <AlertOctagon size={14} />
              <span>ELZZUP // ROOT CONSCIOUSNESS</span>
            </div>
            <div className="font-dialogue font-bold text-sm sm:text-base text-[#ffdd00] tracking-wide leading-snug">
              "{bossDialogue}"
            </div>
          </div>
        </div>

        {/* --- STAGE 1: SHIELD MATRIX --- */}
        {stage === 'stage-1-shields' && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <div className="w-full bg-[#0c0c1e] border-2 border-[#ffdd00] p-2.5 mb-3.5 text-center font-pixel text-xs sm:text-sm text-[#ffdd00] uppercase font-bold shadow-[2px_2px_0_0_#000]">
              PHASE 1: SHATTER SHIELDS [ GAMMA (300) → BETA (200) → ALPHA (100) ]
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
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
                    className={`h-24 border-3 border-black font-mono flex flex-col items-center justify-center p-2 shadow-[4px_4px_0_0_#000] cursor-pointer transition-all ${
                      isDown
                        ? 'bg-[#1a1a2a] text-[#666688] shadow-none cursor-default'
                        : 'bg-[#ff4444] hover:bg-[#ff6666] text-black active:translate-y-0.5'
                    }`}
                  >
                    <ShieldAlert size={16} className="mb-1" />
                    <span className="font-pixel text-xs font-black">{shield.name}</span>
                    <span className="font-mono text-xs font-bold mt-0.5">
                      {isDown ? '[OFFLINE]' : shield.freq}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- STAGE 2: DECEPTIVE CORE BYPASS --- */}
        {stage === 'stage-2-deceptive-core' && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="font-pixel text-xs sm:text-sm text-[#ffdd00] font-black uppercase">
                PHASE 2: UNMASK TRUE RELAY
              </span>
              <button
                onClick={() => {
                  sound.playClick(soundEnabled);
                  setOpticalFilter(!opticalFilter);
                }}
                className={`px-3 py-1.5 border-2 border-black font-pixel text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0_0_#000] active:translate-y-0.5 ${
                  opticalFilter ? 'bg-[#44ff44] text-black' : 'bg-[#2a2a4a] text-[#f0f0ff]'
                }`}
              >
                <Eye size={13} />
                <span>LENS: {opticalFilter ? 'TRUE SPECTRUM' : 'STANDARD'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              <button
                disabled={isProcessing}
                onClick={() => handleStage2Action('fake-bait')}
                className="h-24 bg-[#ffdd00] hover:bg-[#ffee44] text-black border-3 border-black font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center p-1.5 shadow-[4px_4px_0_0_#000] active:translate-y-0.5 cursor-pointer"
              >
                <span>INSTANT</span>
                <span>WIN ⚡</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleStage2Action('false-red')}
                className="h-24 bg-[#ff4444] hover:bg-[#ff6666] text-black border-3 border-black font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center p-1.5 shadow-[4px_4px_0_0_#000] active:translate-y-0.5 cursor-pointer"
              >
                <span>RAW</span>
                <span>CORE</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleStage2Action('true-core')}
                className={`h-24 border-3 border-black font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center p-1.5 shadow-[4px_4px_0_0_#000] active:translate-y-0.5 cursor-pointer transition-all ${
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

        {/* --- STAGE 3: WORD DECOMPILATION (P -> U -> Z -> Z -> L -> E) --- */}
        {(stage === 'stage-3-decompilation' || stage === 'defeated') && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <div className="w-full bg-[#0c0c1e] border-2 border-[#ffdd00] p-2.5 mb-3.5 text-center font-pixel text-xs sm:text-sm text-[#ffdd00] uppercase font-bold shadow-[2px_2px_0_0_#000]">
              PHASE 3: DECOMPILE ROOT KERNEL [ SPELL: P → U → Z → Z → L → E ]
            </div>

            {/* Spell Progress Meter */}
            <div className="flex gap-2.5 mb-4">
              {TARGET_WORD.map((targetChar, idx) => {
                const isTyped = spellProgress.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-9 h-9 sm:w-10 sm:h-10 border-3 border-black flex items-center justify-center font-heading font-black text-base sm:text-lg shadow-[3px_3px_0_0_#000] ${
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
            <div className="grid grid-cols-6 gap-2 w-full">
              {['P', 'U', 'Z', 'L', 'E', 'Z'].map((letter, idx) => (
                <button
                  key={idx}
                  disabled={isProcessing || stage === 'defeated'}
                  onClick={() => handleLetterClick(letter)}
                  className="h-14 bg-[#ffdd00] hover:bg-[#ffee44] text-black border-3 border-black font-heading font-black text-xl shadow-[3px_3px_0_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
