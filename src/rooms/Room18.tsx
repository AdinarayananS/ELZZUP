import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import {
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  Layers,
  Key,
} from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const Room18: React.FC<RoomComponentProps> = ({
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

  // Stage 1 State: Physical Alarm Dismantling
  const [alarmCoverOpen, setAlarmCoverOpen] = useState(false);
  const [batteryRemoved, setBatteryRemoved] = useState(false);

  // Stage 2 State: Chromatic Synthesis Lenses
  const [redLight, setRedLight] = useState(false);
  const [greenLight, setGreenLight] = useState(false);
  const [blueLight, setBlueLight] = useState(false);
  const [lensTested, setLensTested] = useState<{ 1: boolean; 2: boolean; 3: boolean }>({
    1: false,
    2: false,
    3: false,
  });

  // Stage 3 State: 3-Letter Vault Code (Target: K - E - Y)
  const [dial1, setDial1] = useState(0); // A (0)
  const [dial2, setDial2] = useState(0); // A (0)
  const [dial3, setDial3] = useState(0); // A (0)

  // Victory Sequence
  const [victoryPhase, setVictoryPhase] = useState<'idle' | 'freeze' | 'cleared' | 'elzzup-reaction'>('idle');

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Update lens tested flags when player discovers dual-beam letters
  useEffect(() => {
    if (redLight && greenLight) setLensTested((prev) => ({ ...prev, 1: true }));
    if (greenLight && blueLight) setLensTested((prev) => ({ ...prev, 2: true }));
    if (redLight && blueLight) setLensTested((prev) => ({ ...prev, 3: true }));
  }, [redLight, greenLight, blueLight]);

  // Stage-specific Progressive Hints
  const HINTS: Record<1 | 2 | 3, Array<{ level: number; title: string; text: string }>> = {
    1: [
      {
        level: 1,
        title: 'HINT 1 [DISCOVER THE RULE]',
        text: "Elzzup: \"You've been staring at the digital console for ten minutes. Stop trying to click the digital breaker when the alarm is a physical box right on the wall.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [DIRECT]',
        text: "Elzzup: \"Click the siren housing on the top right wall to unlatch the front cover, then remove the live power cell.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [STRONG]',
        text: "Elzzup: \"Click the siren box -> Click 'PULL BATTERY' -> The master alarm interlock will disengage.\"",
      },
    ],
    2: [
      {
        level: 1,
        title: 'HINT 1 [APPLY THE RULE]',
        text: "Elzzup: \"The spectral glass isn't broken. A single light beam only illuminates half a glyph. What happens when two primary color switches overlap on the same lens?\"",
      },
      {
        level: 2,
        title: 'HINT 2 [CONNECTION]',
        text: "Elzzup: \"Test Red + Green on Lens 1, Green + Blue on Lens 2, and Red + Blue on Lens 3 to synthesize all 3 letters.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [STRONG]',
        text: "Elzzup: \"Once all 3 dual-wavelength letters have been revealed in the lenses, press 'PROCEED TO DIAL TERMINAL'.\"",
      },
    ],
    3: [
      {
        level: 1,
        title: 'HINT 1 [COMBINE]',
        text: "Elzzup: \"Combine what you discovered: The 3 letters decoded from the lenses form a 3-letter word that unlocks gates.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [DIRECT]',
        text: "Elzzup: \"Lens 1 = K, Lens 2 = E, Lens 3 = Y. Rotate the 3 physical dials to match the word.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [NEAR-SOLUTION]',
        text: "Elzzup: \"Set Dial 1 to 'K', Dial 2 to 'E', Dial 3 to 'Y', and press 'ENGAGE GATE OVERRIDE'.\"",
      },
    ],
  };

  const handleCycleHint = () => {
    sound.playClick(soundEnabled);
    setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  // --- STAGE 1: PHYSICAL SIREN INTERACTION ---
  const handleToggleAlarmCover = () => {
    if (isProcessing || currentStage !== 1) return;
    sound.playLatchOpen(soundEnabled);
    setAlarmCoverOpen((prev) => !prev);
  };

  const handleRemoveBattery = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (batteryRemoved || isProcessing || currentStage !== 1) return;
    sound.playSuccess(soundEnabled, 0.4);
    setBatteryRemoved(true);
    setIsProcessing(true);

    const t = window.setTimeout(() => {
      setIsProcessing(false);
      setHintLevel(0);
      setCurrentStage(2);
    }, 1200);
    timersRef.current.push(t);
  };

  // Decoy Digital Breaker
  const handleDecoyBreaker = () => {
    if (isProcessing) return;
    sound.playGlitch(soundEnabled);
    setScreenShake(true);
    setFailBanner('DECOY BREAKER TRIPPED! Physical alarm is hardwired to the wall unit.');

    const laughTimer = window.setTimeout(() => sound.playMemeLaugh(soundEnabled), 150);
    timersRef.current.push(laughTimer);

    const shakeStop = window.setTimeout(() => setScreenShake(false), 500);
    timersRef.current.push(shakeStop);

    const bannerClear = window.setTimeout(() => setFailBanner(null), 3000);
    timersRef.current.push(bannerClear);
  };

  // --- STAGE 2: ADVANCE FROM CHROMATIC LENSES ---
  const handleAdvanceFromStage2 = () => {
    if (isProcessing || currentStage !== 2) return;
    const allDiscovered = lensTested[1] && lensTested[2] && lensTested[3];
    if (!allDiscovered) {
      sound.playGlitch(soundEnabled);
      setScreenShake(true);
      setFailBanner('INCOMPLETE SPECTRUM: Discover all 3 dual-beam letters (R+G, G+B, R+B) first!');
      const laughTimer = window.setTimeout(() => sound.playMemeLaugh(soundEnabled), 150);
      timersRef.current.push(laughTimer);
      const shakeStop = window.setTimeout(() => setScreenShake(false), 500);
      timersRef.current.push(shakeStop);
      const bannerClear = window.setTimeout(() => setFailBanner(null), 2500);
      timersRef.current.push(bannerClear);
      return;
    }

    sound.playSuccess(soundEnabled);
    setIsProcessing(true);
    const t = window.setTimeout(() => {
      setIsProcessing(false);
      setHintLevel(0);
      setCurrentStage(3);
    }, 800);
    timersRef.current.push(t);
  };

  // --- STAGE 3: DIAL ROTATION & SUBMIT ---
  const handleCycleDial = (dialIndex: 1 | 2 | 3, direction: 1 | -1) => {
    if (isProcessing || currentStage !== 3) return;
    sound.playClick(soundEnabled);

    if (dialIndex === 1) {
      setDial1((prev) => (prev + direction + 26) % 26);
    } else if (dialIndex === 2) {
      setDial2((prev) => (prev + direction + 26) % 26);
    } else {
      setDial3((prev) => (prev + direction + 26) % 26);
    }
  };

  const handleEngageOverride = () => {
    if (isProcessing || currentStage !== 3) return;
    sound.playClick(soundEnabled);

    const currentCode = `${ALPHABET[dial1]}${ALPHABET[dial2]}${ALPHABET[dial3]}`;
    setIsProcessing(true);

    if (currentCode === 'KEY') {
      sound.playSuccess(soundEnabled);
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
                'GATE 18 OVERRIDDEN',
                'You dismantled the physical alarm, synthesized the chromatic wavelengths, and combined the discoveries into the True Key.'
              );
            }, 2200);
            timersRef.current.push(t4);
          }, 1800);
          timersRef.current.push(t3);
        }, 800);
        timersRef.current.push(t2);
      }, 600);
      timersRef.current.push(t1);
    } else {
      sound.playGlitch(soundEnabled);
      setScreenShake(true);
      setFailBanner(`INCORRECT CIPHER [${currentCode}]. TARGET WORD IS K - E - Y.`);

      const laughTimer = window.setTimeout(() => sound.playMemeLaugh(soundEnabled), 150);
      timersRef.current.push(laughTimer);

      const shakeStop = window.setTimeout(() => setScreenShake(false), 500);
      timersRef.current.push(shakeStop);

      const resetTimer = window.setTimeout(() => {
        setIsProcessing(false);
        setFailBanner(null);
      }, 2500);
      timersRef.current.push(resetTimer);
    }
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
          <Layers size={14} className="text-[#ffdd00]" />
          <span>CHAMBER 18: DUAL-CIPHER VAULT</span>
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

      {/* Main Interactive Chamber Console */}
      <div className="w-full max-w-2xl bg-[#181832] border-4 sm:border-6 border-black p-3 sm:p-5 shadow-[6px_6px_0_0_#000] flex flex-col items-center gap-3">
        {/* Error / Failure Banner */}
        {failBanner && (
          <div className="w-full bg-[#ff4444] text-black p-2 border-3 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-1.5 font-heading font-black text-xs uppercase">
              <XCircle size={16} className="text-black shrink-0" />
              <span>{failBanner}</span>
            </div>
          </div>
        )}

        {/* --- STAGE 1: DISCOVER THE RULE (Dismantle Physical Alarm) --- */}
        {currentStage === 1 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#ffdd00] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#ffdd00] font-black uppercase">
                STAGE 1 / 3: DISCOVER THE PHYSICAL INTERLOCK RULE
              </span>
              <span className="font-mono text-[9px] text-[#ff8888] font-bold">
                SIREN LOCKOUT
              </span>
            </div>

            {/* Physical Siren Box mounted on Chamber Wall */}
            <div
              onClick={handleToggleAlarmCover}
              className={`w-full cursor-pointer border-3 border-black p-3 shadow-[4px_4px_0_0_#000] flex items-center justify-between transition-all active:scale-98 ${
                batteryRemoved
                  ? 'bg-[#1a2e1a] text-[#44ff44] border-[#44ff44]'
                  : 'bg-[#3a0a10] text-[#ff4444] border-[#ff4444] animate-pulse'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {batteryRemoved ? (
                  <VolumeX size={20} className="text-[#44ff44]" />
                ) : (
                  <Volume2 size={20} className="text-[#ff4444] animate-bounce" />
                )}
                <div className="flex flex-col text-left">
                  <span className="font-pixel text-xs font-black uppercase tracking-wider">
                    {batteryRemoved ? 'SIREN: MUTED [OFFLINE]' : 'MASTER ALARM BEACON [BLARING]'}
                  </span>
                  <span className="font-mono text-[9px] text-[#a0a0d0] font-bold">
                    {alarmCoverOpen ? '[CASING OPENED — EXPOSED POWER CELL]' : '[CLICK CASING TO UNLATCH FRONT COVER]'}
                  </span>
                </div>
              </div>

              {alarmCoverOpen && (
                <div>
                  {!batteryRemoved ? (
                    <button
                      onClick={handleRemoveBattery}
                      className="px-3 py-1 bg-[#ffdd00] hover:bg-[#ffee44] text-black font-mono text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0_0_#000] animate-pulse cursor-pointer"
                    >
                      PULL BATTERY ⚡
                    </button>
                  ) : (
                    <span className="font-mono text-xs text-[#44ff44] font-black">
                      [POWER CELL EJECTED ✓]
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Decoy Digital Breaker Box */}
            <div className="w-full bg-[#101026] border-2 border-black p-2.5 flex items-center justify-between">
              <div className="font-mono text-[10px] text-[#8888aa]">
                Digital Circuit Breaker (Software Bypass Interface)
              </div>
              <button
                onClick={handleDecoyBreaker}
                className="px-3 py-1 bg-[#2a1018] hover:bg-[#3a1520] text-[#ff8888] border border-black font-pixel text-[9px] uppercase font-bold cursor-pointer"
              >
                TRIP DIGITAL BREAKER
              </button>
            </div>
          </div>
        )}

        {/* --- STAGE 2: APPLY THE RULE (Chromatic Dual-Beam Synthesis) --- */}
        {currentStage === 2 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#00f0ff] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#00f0ff] font-black uppercase">
                STAGE 2 / 3: SYNTHESIZE DUAL-WAVELENGTH PHOSPHORS
              </span>
              <Sliders size={14} className="text-[#00f0ff]" />
            </div>

            {/* Color Switchboard */}
            <div className="w-full grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  sound.playClick(soundEnabled);
                  setRedLight((p) => !p);
                }}
                className={`py-2 px-1 border-2 border-black font-pixel text-xs font-black uppercase shadow-[2px_2px_0_0_#000] cursor-pointer transition-all ${
                  redLight
                    ? 'bg-[#ff4444] text-black shadow-[0_0_10px_#ff4444]'
                    : 'bg-[#2a1018] text-[#ff8888]'
                }`}
              >
                RED [{redLight ? 'ON' : 'OFF'}]
              </button>

              <button
                onClick={() => {
                  sound.playClick(soundEnabled);
                  setGreenLight((p) => !p);
                }}
                className={`py-2 px-1 border-2 border-black font-pixel text-xs font-black uppercase shadow-[2px_2px_0_0_#000] cursor-pointer transition-all ${
                  greenLight
                    ? 'bg-[#44ff44] text-black shadow-[0_0_10px_#44ff44]'
                    : 'bg-[#102a18] text-[#88ff88]'
                }`}
              >
                GRN [{greenLight ? 'ON' : 'OFF'}]
              </button>

              <button
                onClick={() => {
                  sound.playClick(soundEnabled);
                  setBlueLight((p) => !p);
                }}
                className={`py-2 px-1 border-2 border-black font-pixel text-xs font-black uppercase shadow-[2px_2px_0_0_#000] cursor-pointer transition-all ${
                  blueLight
                    ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]'
                    : 'bg-[#10182a] text-[#88ddff]'
                }`}
              >
                BLU [{blueLight ? 'ON' : 'OFF'}]
              </button>
            </div>

            {/* Spectral Phosphor Lenses */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 py-1">
              {/* Lens 1 */}
              <div className="h-20 bg-black border-2 border-black flex flex-col items-center justify-center p-1 relative overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="absolute top-1 left-1.5 font-mono text-[8px] text-[#666688] font-bold">
                  LENS 1 (R+G)
                </span>
                {redLight && greenLight ? (
                  <div className="font-pixel font-black text-3xl text-[#ffdd00] drop-shadow-[0_0_8px_#ffdd00] animate-pulse">
                    K
                  </div>
                ) : redLight ? (
                  <div className="font-mono font-black text-2xl text-[#ff4444] opacity-70">
                    | &lt;
                  </div>
                ) : greenLight ? (
                  <div className="font-mono font-black text-2xl text-[#44ff44] opacity-70">
                    &lt;
                  </div>
                ) : (
                  <div className="font-mono text-[9px] text-[#444466] uppercase font-bold">[BLANK]</div>
                )}
              </div>

              {/* Lens 2 */}
              <div className="h-20 bg-black border-2 border-black flex flex-col items-center justify-center p-1 relative overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="absolute top-1 left-1.5 font-mono text-[8px] text-[#666688] font-bold">
                  LENS 2 (G+B)
                </span>
                {greenLight && blueLight ? (
                  <div className="font-pixel font-black text-3xl text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff] animate-pulse">
                    E
                  </div>
                ) : greenLight ? (
                  <div className="font-mono font-black text-2xl text-[#44ff44] opacity-70">[</div>
                ) : blueLight ? (
                  <div className="font-mono font-black text-2xl text-[#00f0ff] opacity-70">---</div>
                ) : (
                  <div className="font-mono text-[9px] text-[#444466] uppercase font-bold">[BLANK]</div>
                )}
              </div>

              {/* Lens 3 */}
              <div className="h-20 bg-black border-2 border-black flex flex-col items-center justify-center p-1 relative overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="absolute top-1 left-1.5 font-mono text-[8px] text-[#666688] font-bold">
                  LENS 3 (R+B)
                </span>
                {redLight && blueLight ? (
                  <div className="font-pixel font-black text-3xl text-[#ff00ea] drop-shadow-[0_0_8px_#ff00ea] animate-pulse">
                    Y
                  </div>
                ) : redLight ? (
                  <div className="font-mono font-black text-2xl text-[#ff4444] opacity-70">\ /</div>
                ) : blueLight ? (
                  <div className="font-mono font-black text-2xl text-[#00f0ff] opacity-70">|</div>
                ) : (
                  <div className="font-mono text-[9px] text-[#444466] uppercase font-bold">[BLANK]</div>
                )}
              </div>
            </div>

            <button
              onClick={handleAdvanceFromStage2}
              className="w-full py-2.5 bg-[#00f0ff] hover:bg-[#66f6ff] text-black border-3 border-black font-heading font-black text-xs uppercase shadow-[3px_3px_0_0_#000] cursor-pointer"
            >
              PROCEED TO DIAL TERMINAL ➔
            </button>
          </div>
        )}

        {/* --- STAGE 3: COMBINE (The Final Cipher Dials) --- */}
        {currentStage === 3 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#ffdd00] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#ffdd00] font-black uppercase flex items-center gap-1.5">
                <Key size={14} />
                STAGE 3 / 3: COMBINE DISCOVERIES INTO THE VAULT CIPHER
              </span>
              <Unlock size={14} className="text-[#44ff44]" />
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4 my-1">
              {/* DIAL 1 */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleCycleDial(1, 1)}
                  className="w-10 h-7 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▲
                </button>
                <div className="w-14 h-14 bg-black border-3 border-[#ffdd00] flex items-center justify-center font-heading font-black text-2xl text-[#ffdd00]">
                  {ALPHABET[dial1]}
                </div>
                <button
                  onClick={() => handleCycleDial(1, -1)}
                  className="w-10 h-7 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▼
                </button>
              </div>

              {/* DIAL 2 */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleCycleDial(2, 1)}
                  className="w-10 h-7 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▲
                </button>
                <div className="w-14 h-14 bg-black border-3 border-[#ffdd00] flex items-center justify-center font-heading font-black text-2xl text-[#ffdd00]">
                  {ALPHABET[dial2]}
                </div>
                <button
                  onClick={() => handleCycleDial(2, -1)}
                  className="w-10 h-7 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▼
                </button>
              </div>

              {/* DIAL 3 */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleCycleDial(3, 1)}
                  className="w-10 h-7 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▲
                </button>
                <div className="w-14 h-14 bg-black border-3 border-[#ffdd00] flex items-center justify-center font-heading font-black text-2xl text-[#ffdd00]">
                  {ALPHABET[dial3]}
                </div>
                <button
                  onClick={() => handleCycleDial(3, -1)}
                  className="w-10 h-7 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▼
                </button>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleEngageOverride}
              className="w-full py-2.5 bg-[#ffdd00] hover:bg-[#ffee44] text-black border-3 border-black font-heading font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0_0_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              ENGAGE GATE OVERRIDE
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

          <div className="relative z-10 max-w-md w-full bg-[#1a1a3a] border-8 border-black p-6 shadow-[0_0_30px_rgba(255,221,0,0.4),8px_8px_0_0_#000] flex flex-col items-center text-center">
            {victoryPhase === 'freeze' && (
              <div className="py-8 font-mono text-sm text-[#ffdd00] font-black uppercase animate-pulse">
                [ CIPHER ACCEPTED // OPTICAL BYPASS AUTHENTICATED ]
              </div>
            )}

            {(victoryPhase === 'cleared' || victoryPhase === 'elzzup-reaction') && (
              <div className="flex flex-col items-center my-4 animate-fadeIn">
                <div className="font-mono text-xs text-[#44ff44] font-black tracking-widest uppercase mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  CHAMBER_18 // ACCESS GRANTED
                </div>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#ffdd00] uppercase tracking-tight drop-shadow-[3px_3px_0_#000]">
                  FLOOR 18
                </h1>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-widest mt-1 drop-shadow-[2px_2px_0_#000]">
                  CLEARED
                </h2>
              </div>
            )}

            {victoryPhase === 'elzzup-reaction' && (
              <div className="bg-[#0c0c1e] border-2 border-[#ffdd00] p-3 mt-3 w-full animate-fadeIn shadow-[2px_2px_0_0_#000]">
                <div className="font-pixel text-[10px] text-[#ffdd00] uppercase font-bold mb-1">
                  ELZZUP:
                </div>
                <p className="font-dialogue text-xs sm:text-sm text-[#c0c0e8] font-bold">
                  "...Wait. You actually dismantled the alarm AND overlapped the optical wavelengths?! ...Fine. Floor 19 won't be that generous."
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
