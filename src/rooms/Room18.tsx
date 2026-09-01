import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Fan, RotateCcw, Lock, CheckCircle, Flame, Coffee, HelpCircle, ArrowRight } from 'lucide-react';
import { soundEngine } from '../audio';

interface Room18Props {
  onSuccess: (customMessage?: { title: string; subtitle: string }) => void;
  onTroll: (customTitle?: string, customMessage?: string) => void;
  soundEnabled: boolean;
  onHintRequest?: (hint: string) => void;
}

export const Room18: React.FC<Room18Props> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // Stage 1: The Power Breaker & Overheated Fan
  // Stage 2: Opposite Day Inversion (Reverse sequence)
  // Stage 3: The Interactive Environment Combination Safe
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // --- STAGE 1 STATE ---
  const [pluggedIn, setPluggedIn] = useState(false);
  const [fanRunning, setFanRunning] = useState(true);
  const [powerProgress, setPowerProgress] = useState(0);

  // --- STAGE 2 STATE ---
  // Elzzup says: RED -> GREEN -> YELLOW -> BLUE
  // Solution (Reverse): BLUE -> YELLOW -> GREEN -> RED
  const correctSequence = ['BLUE', 'YELLOW', 'GREEN', 'RED'];
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);

  // --- STAGE 3 STATE ---
  const [revealedCoffee, setRevealedCoffee] = useState(false);
  const [revealedPicture, setRevealedPicture] = useState(false);
  const [revealedThermostat, setRevealedThermostat] = useState(false);
  const [dial1, setDial1] = useState(0);
  const [dial2, setDial2] = useState(0);
  const [dial3, setDial3] = useState(0);
  const [safeOpened, setSafeOpened] = useState(false);

  // --- STAGE 1 HANDLERS ---
  const togglePlug = () => {
    soundEngine.playClick(soundEnabled);
    const newPlugState = !pluggedIn;
    setPluggedIn(newPlugState);

    if (newPlugState) {
      if (fanRunning) {
        // Fan is draining power! Stalls at 30%
        setPowerProgress(30);
      } else {
        // Fan is off! Full power!
        setPowerProgress(100);
        soundEngine.playSuccess(soundEnabled);
        setTimeout(() => setStage(2), 700);
      }
    } else {
      setPowerProgress(0);
    }
  };

  const toggleFan = () => {
    soundEngine.playButtonPress(soundEnabled);
    const newFanState = !fanRunning;
    setFanRunning(newFanState);

    if (pluggedIn) {
      if (!newFanState) {
        // Turn off fan while plugged in -> power surges to 100%!
        setPowerProgress(100);
        soundEngine.playSuccess(soundEnabled);
        setTimeout(() => setStage(2), 700);
      } else {
        setPowerProgress(30);
      }
    }
  };

  // --- STAGE 2 HANDLERS ---
  const handleColorButtonClick = (color: string) => {
    soundEngine.playButtonPress(soundEnabled);
    const newSeq = [...playerSequence, color];
    setPlayerSequence(newSeq);

    // Check if matching prefix of correctSequence
    const currentIndex = newSeq.length - 1;
    if (newSeq[currentIndex] !== correctSequence[currentIndex]) {
      // Wrong sequence!
      soundEngine.playGlitch(soundEnabled);
      soundEngine.playMemeLaugh(soundEnabled);
      onTroll(
        'Obeyed Elzzup Again!',
        'You followed Elzzup\'s exact order! It\'s Opposite Day: you should have reversed the entire sequence.'
      );
      setPlayerSequence([]);
      return;
    }

    // If completed all 4 in reverse order
    if (newSeq.length === 4) {
      soundEngine.playSuccess(soundEnabled);
      setTimeout(() => setStage(3), 700);
    }
  };

  // --- STAGE 3 HANDLERS ---
  const handleDialClick = (dialNum: 1 | 2 | 3) => {
    soundEngine.playClick(soundEnabled);
    if (dialNum === 1) setDial1((prev) => (prev + 1) % 10);
    if (dialNum === 2) setDial2((prev) => (prev + 1) % 10);
    if (dialNum === 3) setDial3((prev) => (prev + 1) % 10);
  };

  const handlePullSafeLever = () => {
    soundEngine.playButtonPress(soundEnabled);
    // Correct combination is 3 - 6 - 9
    if (dial1 === 3 && dial2 === 6 && dial3 === 9) {
      soundEngine.playLatchOpen(soundEnabled);
      soundEngine.playSuccess(soundEnabled);
      setSafeOpened(true);
      setTimeout(() => {
        onSuccess({
          title: 'Floor 18 Overridden!',
          subtitle: 'You turned off the power-hogging fan, reversed Elzzup\'s orders, and found the 3-6-9 vault code.',
        });
      }, 900);
    } else {
      soundEngine.playTroll(soundEnabled);
      soundEngine.playMemeLaugh(soundEnabled);
      onTroll(
        'Safe Jammed!',
        `Current code: ${dial1}-${dial2}-${dial3}. Inspect the room environment (the mug, picture, and thermostat) to find the 3 digits!`
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4">
      {/* STAGE HEADER PILL */}
      <div className="mb-4 flex items-center gap-2 bg-slate-900/90 border-2 border-indigo-500/50 px-4 py-1.5 rounded-full shadow-lg">
        <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
          STAGE {stage} OF 3
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-xs font-mono text-slate-300">
          {stage === 1 && 'The Greedy Cooling Fan'}
          {stage === 2 && 'Opposite Day Protocol'}
          {stage === 3 && 'The Interactive Vault'}
        </span>
      </div>

      {/* STAGE 1: POWER BREAKER & COOLING FAN */}
      {stage === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-indigo-400 tracking-wider">
              ⚡ STAGE 18.1: CHARGE THE MAIN CAPACITOR TO 100%
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
              "Plug in the power cable, but warning: this industrial cooling fan draws WAY too much juice!"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 w-full max-w-md bg-slate-950/80 p-6 rounded-lg border border-slate-800">
            {/* POWER OUTLET & PLUG */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300">
                WALL OUTLET
              </span>
              <button
                id="power-cord-button"
                onClick={togglePlug}
                className={`px-4 py-3 rounded-lg border-2 font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  pluggedIn
                    ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-amber-400'
                }`}
              >
                <Zap className={`w-4 h-4 ${pluggedIn ? 'text-amber-300' : 'text-slate-500'}`} />
                {pluggedIn ? '🔌 CORD: PLUGGED IN' : '🔌 CORD: UNPLUGGED'}
              </button>
            </div>

            {/* INDUSTRIAL COOLING FAN */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300">
                COOLING FAN
              </span>
              <button
                id="fan-toggle-button"
                onClick={toggleFan}
                className={`px-4 py-3 rounded-lg border-2 font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  fanRunning
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400'
                }`}
              >
                <motion.div
                  animate={fanRunning ? { rotate: 360 } : { rotate: 0 }}
                  transition={fanRunning ? { repeat: Infinity, duration: 0.5, ease: 'linear' } : {}}
                >
                  <Fan className="w-4 h-4" />
                </motion.div>
                {fanRunning ? '💨 FAN: RUNNING (DRAINING)' : '🛑 FAN: STOPPED (SAVING)'}
              </button>
            </div>
          </div>

          {/* POWER CHARGE BAR */}
          <div className="w-full max-w-md flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>BATTERY LEVEL:</span>
              <span className={powerProgress === 100 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {powerProgress}%
              </span>
            </div>
            <div className="w-full h-4 bg-slate-800 border border-slate-600 rounded-full overflow-hidden">
              <motion.div
                className={`h-full transition-all duration-500 ${
                  powerProgress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-amber-500'
                }`}
                style={{ width: `${powerProgress}%` }}
              />
            </div>
            {pluggedIn && fanRunning && (
              <span className="text-[11px] font-mono text-red-400 text-center animate-pulse">
                ⚠️ Fan is consuming 70% power! Turn it off to reach 100%!
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* STAGE 2: OPPOSITE DAY INVERSION */}
      {stage === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-cyan-400 tracking-wider">
              🔄 STAGE 18.2: OPPOSITE DAY PROTOCOL
            </h3>
            <p className="text-xs md:text-sm font-mono text-amber-300 font-bold mt-1">
              📢 ELZZUP: "Press RED, then GREEN, then YELLOW, then BLUE! Hurry!"
            </p>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/40 px-3 py-1.5 rounded text-[11px] font-mono text-amber-300 text-center">
            ⚠️ NOTICE: Opposite Day Protocol is active. Reverse everything Elzzup says!
          </div>

          {/* 4 COLOR BUTTONS */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            {[
              { name: 'RED', bg: 'bg-red-600 hover:bg-red-500 border-red-400' },
              { name: 'GREEN', bg: 'bg-green-600 hover:bg-green-500 border-green-400' },
              { name: 'YELLOW', bg: 'bg-amber-500 hover:bg-amber-400 border-amber-300 text-black' },
              { name: 'BLUE', bg: 'bg-blue-600 hover:bg-blue-500 border-blue-400' },
            ].map((col) => (
              <motion.button
                key={col.name}
                id={`opposite-btn-${col.name.toLowerCase()}`}
                onClick={() => handleColorButtonClick(col.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-4 px-6 rounded-lg font-mono font-black text-sm tracking-wider border-2 shadow-lg cursor-pointer ${col.bg}`}
              >
                {col.name}
              </motion.button>
            ))}
          </div>

          {/* PROGRESS DISPLAY */}
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>INPUT:</span>
            {playerSequence.length === 0 ? (
              <span className="text-slate-600">[ Waiting for first reversed button... ]</span>
            ) : (
              playerSequence.map((c, i) => (
                <span key={i} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700 font-bold">
                  {c}
                </span>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* STAGE 3: INTERACTIVE COMBINATION VAULT */}
      {stage === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-amber-400 tracking-wider">
              🔐 STAGE 18.3: THE 3-DIGIT COMBINATION VAULT
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
              "The 3 secret digits are hidden somewhere in this room. Click around to find them!"
            </p>
          </div>

          {/* INTERACTIVE ENVIRONMENT OBJECTS */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            {/* OBJECT 1: COFFEE MUG */}
            <button
              id="env-coffee-mug"
              onClick={() => {
                soundEngine.playClick(soundEnabled);
                setRevealedCoffee(true);
              }}
              className="bg-slate-950 p-3 rounded-lg border border-slate-700 hover:border-amber-400 flex flex-col items-center gap-1 group transition-colors"
            >
              <div className="text-2xl group-hover:rotate-12 transition-transform">☕</div>
              <span className="text-[10px] font-mono text-slate-400">Coffee Mug</span>
              {revealedCoffee ? (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700">
                  Digit 1 = 3
                </span>
              ) : (
                <span className="text-[9px] font-mono text-slate-500">(Click to tip)</span>
              )}
            </button>

            {/* OBJECT 2: ELZZUP PORTRAIT */}
            <button
              id="env-picture-frame"
              onClick={() => {
                soundEngine.playClick(soundEnabled);
                setRevealedPicture(true);
              }}
              className="bg-slate-950 p-3 rounded-lg border border-slate-700 hover:border-amber-400 flex flex-col items-center gap-1 group transition-colors"
            >
              <div className="text-2xl group-hover:-rotate-12 transition-transform">🖼️</div>
              <span className="text-[10px] font-mono text-slate-400">Portrait</span>
              {revealedPicture ? (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700">
                  Digit 2 = 6
                </span>
              ) : (
                <span className="text-[9px] font-mono text-slate-500">(Click to tilt)</span>
              )}
            </button>

            {/* OBJECT 3: WALL THERMOSTAT */}
            <button
              id="env-thermostat"
              onClick={() => {
                soundEngine.playClick(soundEnabled);
                setRevealedThermostat(true);
              }}
              className="bg-slate-950 p-3 rounded-lg border border-slate-700 hover:border-amber-400 flex flex-col items-center gap-1 group transition-colors"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">🌡️</div>
              <span className="text-[10px] font-mono text-slate-400">Thermostat</span>
              {revealedThermostat ? (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700">
                  Digit 3 = 9
                </span>
              ) : (
                <span className="text-[9px] font-mono text-slate-500">(Click to check)</span>
              )}
            </button>
          </div>

          {/* THE 3-DIGIT DIALS & LEVER */}
          <div className="flex flex-col items-center gap-4 bg-slate-950 p-6 rounded-xl border-2 border-slate-700 shadow-xl">
            <div className="flex items-center gap-4">
              {[
                { label: 'DIAL 1', val: dial1, num: 1 as const },
                { label: 'DIAL 2', val: dial2, num: 2 as const },
                { label: 'DIAL 3', val: dial3, num: 3 as const },
              ].map((d) => (
                <div key={d.num} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{d.label}</span>
                  <button
                    id={`safe-dial-${d.num}`}
                    onClick={() => handleDialClick(d.num)}
                    className="w-14 h-16 bg-slate-800 hover:bg-slate-700 border-2 border-amber-500/60 rounded-lg flex items-center justify-center text-2xl font-mono font-black text-amber-300 shadow-inner active:scale-95 transition-transform"
                  >
                    {d.val}
                  </button>
                  <span className="text-[9px] font-mono text-slate-600">▲ click</span>
                </div>
              ))}
            </div>

            {/* PULL LEVER BUTTON */}
            <motion.button
              id="pull-safe-lever-btn"
              onClick={handlePullSafeLever}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-mono font-black text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              PULL VAULT LEVER
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
