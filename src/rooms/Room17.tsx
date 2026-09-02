import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Key, AlertTriangle, Cat, Bomb, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundEngine } from '../audio';

interface Room17Props {
  onSuccess: (customMessage?: { title: string; subtitle: string }) => void;
  onTroll: (customTitle?: string, customMessage?: string) => void;
  soundEnabled: boolean;
  onHintRequest?: (hint: string) => void;
  onSetObjective?: (objective: string | null) => void;
}

export const Room17: React.FC<Room17Props> = ({
  onSuccess,
  onTroll,
  soundEnabled,
  onSetObjective,
}) => {
  // Stage 1: The Obvious Button
  // Stage 2: The Suspicious Shuffle (Cat vs TNT) with randomized order
  // Stage 3: Move Out of the Way, Elzzup!
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // Synchronize clear objective for every stage
  useEffect(() => {
    if (stage === 1) {
      onSetObjective?.('Bypass the security lockdown to unlock the next stage.');
    } else if (stage === 2) {
      onSetObjective?.('Pick the safe container to retrieve the chamber key.');
    } else if (stage === 3) {
      onSetObjective?.('Clear the doorway and press the exit button.');
    }
  }, [stage, onSetObjective]);

  // Stage 1 State
  const [holdingButton, setHoldingButton] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<number | null>(null);

  // Stage 2 State (Randomized box positions)
  interface BoxOption {
    id: 'alpha' | 'beta' | 'gamma';
    type: 'cat' | 'tnt1' | 'tnt2';
    label: string;
  }
  const [boxes, setBoxes] = useState<BoxOption[]>([]);
  const [stage2Revealed, setStage2Revealed] = useState<string | null>(null);

  // Stage 3 State (Tickling / Pushing Elzzup)
  const [elzzupPokes, setElzzupPokes] = useState(0);
  const [elzzupFlung, setElzzupFlung] = useState(false);
  const [doorUnlocked, setDoorUnlocked] = useState(false);

  // Setup Stage 2 randomized order
  const initStage2Boxes = () => {
    const boxTypes: Array<'cat' | 'tnt1' | 'tnt2'> = ['cat', 'tnt1', 'tnt2'];
    // Fisher-Yates shuffle
    for (let i = boxTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [boxTypes[i], boxTypes[j]] = [boxTypes[j], boxTypes[i]];
    }

    const labels: Array<{ id: 'alpha' | 'beta' | 'gamma'; label: string }> = [
      { id: 'alpha', label: 'BOX ALPHA' },
      { id: 'beta', label: 'BOX BETA' },
      { id: 'gamma', label: 'BOX GAMMA' },
    ];

    // Shuffle labels as well so Alpha/Beta/Gamma physical order is randomized
    for (let i = labels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [labels[i], labels[j]] = [labels[j], labels[i]];
    }

    const newBoxes: BoxOption[] = labels.map((l, idx) => ({
      id: l.id,
      label: l.label,
      type: boxTypes[idx],
    }));

    setBoxes(newBoxes);
    setStage2Revealed(null);
  };

  useEffect(() => {
    if (stage === 2) {
      initStage2Boxes();
    }
  }, [stage]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  // --- STAGE 1 HANDLERS ---
  const handleFakeMathClick = (name: string) => {
    soundEngine.playTroll(soundEnabled);
    soundEngine.playMemeLaugh(soundEnabled);
    onTroll(
      'Why Are You Doing Math?',
      `You clicked "${name}". There is literally a giant glowing red button right in front of you.`
    );
  };

  const startHoldingRedButton = () => {
    setHoldingButton(true);
    soundEngine.playButtonPress(soundEnabled);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = window.setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + 5;
        soundEngine.playChargeProgress(next / 100, soundEnabled);
        if (next >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          soundEngine.playSuccess(soundEnabled);
          setTimeout(() => {
            setStage(2);
            setHoldingButton(false);
            setHoldProgress(0);
          }, 400);
          return 100;
        }
        return next;
      });
    }, 50);
  };

  const stopHoldingRedButton = () => {
    if (holdProgress < 100) {
      setHoldingButton(false);
      setHoldProgress(0);
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    }
  };

  // --- STAGE 2 HANDLERS ---
  const handleBoxClick = (box: BoxOption) => {
    if (stage2Revealed) return;
    setStage2Revealed(box.id);

    if (box.type === 'cat') {
      soundEngine.playSuccess(soundEnabled);
      setTimeout(() => {
        setStage(3);
      }, 1000);
    } else {
      soundEngine.playGlitch(soundEnabled);
      soundEngine.playMemeLaugh(soundEnabled);
      onTroll(
        'BOOM! That was TNT!',
        'You picked the box that was literally shaking with a burning fuse. The cat was in the purring box!'
      );
      // Re-shuffle for next attempt
      setTimeout(() => {
        initStage2Boxes();
      }, 600);
    }
  };

  // --- STAGE 3 HANDLERS ---
  const handleElzzupPoke = () => {
    if (elzzupFlung) return;
    const nextPoke = elzzupPokes + 1;
    setElzzupPokes(nextPoke);

    if (nextPoke === 1) {
      soundEngine.playClick(soundEnabled);
    } else if (nextPoke === 2) {
      soundEngine.playDodge(soundEnabled);
    } else if (nextPoke >= 3) {
      soundEngine.playVanish(soundEnabled);
      setElzzupFlung(true);
      setDoorUnlocked(true);
    }
  };

  const handleFinalDoorClick = () => {
    if (!doorUnlocked) return;
    soundEngine.playSuccess(soundEnabled);
    onSuccess({
      title: 'Floor 17 Overridden!',
      subtitle: 'You clicked the forbidden button, petted the cat, and tickled Elzzup into oblivion.',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4">
      {/* STAGE HEADER PILL */}
      <div className="mb-4 flex items-center gap-2 bg-slate-900/90 border-2 border-amber-500/50 px-4 py-1.5 rounded-full shadow-lg">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
          STAGE {stage} OF 3
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-xs font-mono text-slate-300">
          {stage === 1 && 'The Forbidden Impulse'}
          {stage === 2 && 'The Suspicious Shuffle'}
          {stage === 3 && 'The Guard at the Gate'}
        </span>
      </div>

      {/* STAGE 1: THE OBVIOUS BUTTON */}
      {stage === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-red-400 tracking-wider">
              ⚠️ STAGE 17.1: DO NOT CLICK THE RED BUTTON
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
              "Whatever you do, don't press it. Solve the 4 academic equations instead." — Elzzup
            </p>
          </div>

          {/* FAKE ACADEMIC MATH BUTTONS */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {[
              'Solve Quantum Differential',
              'Calculate Hyper-Logarithm',
              'Sub-Atomic Particle Drift',
              'Inverse Fourier Polynomial',
            ].map((mathLabel, idx) => (
              <button
                key={idx}
                id={`fake-math-btn-${idx}`}
                onClick={() => handleFakeMathClick(mathLabel)}
                className="bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-600 text-slate-300 font-mono text-xs p-2.5 rounded text-left transition-colors flex items-center justify-between group"
              >
                <span className="truncate">{mathLabel}</span>
                <span className="text-slate-500 group-hover:text-amber-400 text-[10px]">f(x)</span>
              </button>
            ))}
          </div>

          {/* THE GIANT TEMPTING RED BUTTON */}
          <div className="flex flex-col items-center gap-3 my-2">
            <motion.button
              id="the-forbidden-red-button"
              onMouseDown={startHoldingRedButton}
              onMouseUp={stopHoldingRedButton}
              onMouseLeave={stopHoldingRedButton}
              onTouchStart={startHoldingRedButton}
              onTouchEnd={stopHoldingRedButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-44 h-44 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-800 border-8 border-red-950 shadow-[0_0_30px_rgba(239,68,68,0.5)] flex flex-col items-center justify-center p-4 cursor-pointer select-none transition-all"
            >
              <div className="text-white font-mono font-black text-center text-sm md:text-base drop-shadow-md leading-tight">
                DO NOT CLICK
                <span className="block text-[11px] text-amber-300 font-bold mt-1">
                  [ OVERRIDE TERMINAL ]
                </span>
              </div>

              {/* RADIAL / CHARGE PROGRESS OVERLAY */}
              {holdingButton && (
                <div
                  className="absolute inset-0 rounded-full border-4 border-amber-300 pointer-events-none animate-ping opacity-40"
                />
              )}
            </motion.button>

            {/* HOLD PROGRESS BAR */}
            <div className="w-48 h-3.5 bg-slate-950 border border-slate-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-green-400"
                style={{ width: `${holdProgress}%` }}
              />
            </div>
            <p className="text-xs font-mono text-slate-200 font-bold">
              {holdingButton ? `Overriding... ${holdProgress}%` : 'Hold to engage override.'}
            </p>
          </div>
        </motion.div>
      )}

      {/* STAGE 2: THE SUSPICIOUS SHUFFLE */}
      {stage === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-amber-400 tracking-wider">
              📦 STAGE 17.2: THE SUSPICIOUS SHUFFLE
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-200 mt-1 font-medium">
              "One box holds the key. The other two are armed with cartoon TNT. Good luck!" — Elzzup
            </p>
          </div>

          {/* 3 SHUFFLED BOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {boxes.map((box) => {
              const isRevealed = stage2Revealed === box.id;
              const isCat = box.type === 'cat';

              return (
                <motion.button
                  key={box.id}
                  id={`shuffle-box-${box.id}`}
                  onClick={() => handleBoxClick(box)}
                  disabled={stage2Revealed !== null}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-lg border-4 transition-all min-h-[160px] ${
                    isRevealed
                      ? isCat
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                        : 'bg-red-950/80 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]'
                      : 'bg-slate-800/90 border-slate-600 hover:border-amber-400 shadow-lg'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-slate-300 mb-2">
                    {box.label}
                  </span>

                  {/* UNREVEALED TEASERS */}
                  {!isRevealed && (
                    <div className="flex flex-col items-center gap-2">
                      {isCat ? (
                        <motion.div
                          animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="flex flex-col items-center"
                        >
                          <div className="text-2xl">📦</div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 mt-1">
                            *purr...* (=^･ω･^=)
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="flex flex-col items-center"
                        >
                          <div className="text-2xl">📦</div>
                          <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/60 mt-1 flex items-center gap-1">
                            <Bomb className="w-3 h-3 text-red-500 animate-pulse" /> *tick...*
                          </span>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* REVEALED CONTENT */}
                  {isRevealed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      {isCat ? (
                        <>
                          <div className="text-4xl">🐱</div>
                          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                            <Key className="w-4 h-4 text-amber-400" /> KEY FOUND!
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl">💥</div>
                          <span className="text-xs font-mono font-bold text-red-400">
                            KABOOM!
                          </span>
                        </>
                      )}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <p className="text-xs font-mono text-slate-200 text-center font-medium">
            Listen closely... one of these boxes isn't armed with explosives.
          </p>
        </motion.div>
      )}

      {/* STAGE 3: MOVE OUT OF THE WAY, ELZZUP */}
      {stage === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl relative min-h-[340px]"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-emerald-400 tracking-wider">
              🚪 STAGE 17.3: THE EXIT DOOR
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-200 mt-1 font-medium">
              "The exit is right there. Too bad I'm standing right in front of it." — Elzzup
            </p>
          </div>

          {/* THE DOOR AREA */}
          <div className="relative w-full max-w-sm h-48 bg-slate-950 border-2 border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
            {/* THE DOOR BUTTON */}
            <motion.button
              id="room-17-exit-button"
              onClick={handleFinalDoorClick}
              disabled={!doorUnlocked}
              whileHover={doorUnlocked ? { scale: 1.05 } : {}}
              whileTap={doorUnlocked ? { scale: 0.95 } : {}}
              className={`w-48 py-4 px-6 rounded-lg font-mono font-black text-sm tracking-wider flex items-center justify-center gap-2 transition-all ${
                doorUnlocked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] cursor-pointer'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              PROCEED TO ROOM 18
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* ELZZUP BLOCKING THE BUTTON */}
            <AnimatePresence>
              {!elzzupFlung && (
                <motion.div
                  id="elzzup-blocker"
                  onClick={handleElzzupPoke}
                  animate={
                    elzzupPokes === 1
                      ? { x: [-4, 4, -4, 0], rotate: [0, 5, -5, 0] }
                      : elzzupPokes === 2
                      ? { y: [-10, 0, -10, 0], scale: 1.1 }
                      : {}
                  }
                  exit={{
                    x: 300,
                    y: -150,
                    rotate: 360,
                    opacity: 0,
                    transition: { duration: 0.5 },
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-[2px] cursor-pointer group"
                >
                  <div className="text-5xl mb-1 group-hover:scale-110 transition-transform">
                    🦹‍♂️
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-black/80 px-3 py-1 rounded-full border border-amber-500/50">
                    {elzzupPokes === 0 && 'ELZZUP: "NO ENTRY!"'}
                    {elzzupPokes === 1 && 'ELZZUP: "HEY! STOP POKING ME!"'}
                    {elzzupPokes === 2 && 'ELZZUP: "WOAH THAT TICKLES! STOP!"'}
                  </span>
                  <span className="text-xs font-mono text-slate-300 mt-1 font-semibold">
                    [ Chamber transit path obstructed ]
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {elzzupFlung && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono text-emerald-400 text-center font-bold"
            >
              🎉 Elzzup was tickled away! The exit door is now clear!
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
};
