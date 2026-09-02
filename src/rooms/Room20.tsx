import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Flame, Droplets, Trophy, Terminal, Lock, Star, Triangle, Circle, Diamond, ArrowRight, Power } from 'lucide-react';
import { soundEngine } from '../audio';

interface Room20Props {
  onSuccess: (customMessage?: { title: string; subtitle: string }) => void;
  onTroll: (customTitle?: string, customMessage?: string) => void;
  soundEnabled: boolean;
  onHintRequest?: (hint: string) => void;
  onSetObjective?: (objective: string | null) => void;
}

export const Room20: React.FC<Room20Props> = ({
  onSuccess,
  onTroll,
  soundEnabled,
  onSetObjective,
}) => {
  // Phase 1 (20.1): Tri-Elemental Boss Shields [HARD]
  // Phase 2 (20.2): The Instant Win Trophy Bait [RAGE-BAIT]
  // Phase 3 (20.3): Harmonic Glyph Sequence [HARD]
  // Phase 4 (20.4): Fake Blue Screen of Death Crash [RAGE-BAIT]
  // Phase 5 (20.5): The True Name Reversal (ELZZUP -> PUZZLE) [FINAL]
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Synchronize phase objectives with the main objective HUD banner
  React.useEffect(() => {
    if (phase === 1) {
      onSetObjective?.("Strike Elzzup's three elemental shields in order.");
    } else if (phase === 2) {
      onSetObjective?.('Choose the true path forward to advance the battle.');
    } else if (phase === 3) {
      onSetObjective?.('Input the harmonic glyph sequence to destabilize the core.');
    } else if (phase === 4) {
      onSetObjective?.('Recover the system from the emergency crash.');
    } else if (phase === 5) {
      onSetObjective?.('Reorder the letters to destroy Elzzup once and for all.');
    }
  }, [phase, onSetObjective]);

  // --- PHASE 1 STATE (Tri-Elemental Counter) ---
  // Elzzup shields in order: Fire -> Water -> Lightning
  // Counter runes needed in order: Water (quenches Fire) -> Lightning (zaps Water) -> Fire (melts Lightning generator)
  const [phase1Counters, setPhase1Counters] = useState<string[]>([]);

  // --- PHASE 2 STATE (Trophy Bait) ---
  const [trophyTrapped, setTrophyTrapped] = useState(false);

  // --- PHASE 3 STATE (Harmonic Glyph Inversion) ---
  // Target reverse sequence: CIRCLE -> TRIANGLE -> DIAMOND -> STAR
  const correctGlyphSeq = ['CIRCLE', 'TRIANGLE', 'DIAMOND', 'STAR'];
  const [playerGlyphSeq, setPlayerGlyphSeq] = useState<string[]>([]);

  // --- PHASE 4 STATE (BSOD Cable) ---
  const [bsodActive, setBsodActive] = useState(true);

  // --- PHASE 5 STATE (Spelling P-U-Z-Z-L-E) ---
  const targetWord = ['P', 'U', 'Z', 'Z', 'L', 'E'];
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const availableTiles = ['E', 'L', 'Z', 'Z', 'U', 'P'];
  const [usedTileIndices, setUsedTileIndices] = useState<number[]>([]);

  // --- PHASE 1 HANDLERS ---
  const handleElementalRuneClick = (rune: string) => {
    soundEngine.playButtonPress(soundEnabled);
    const newCounters = [...phase1Counters, rune];
    setPhase1Counters(newCounters);

    const required = ['WATER', 'LIGHTNING', 'FIRE'];
    const currIdx = newCounters.length - 1;

    if (newCounters[currIdx] !== required[currIdx]) {
      soundEngine.playTroll(soundEnabled);
      soundEngine.playMemeLaugh(soundEnabled);
      onTroll(
        'Shield Counter Failed!',
        `Water counters Fire, Lightning counters Water, and Fire counters Lightning. Strike them in order!`
      );
      setPhase1Counters([]);
      return;
    }

    if (newCounters.length === 3) {
      soundEngine.playSuccess(soundEnabled);
      setTimeout(() => setPhase(2), 800);
    }
  };

  // --- PHASE 2 HANDLERS ---
  const handleTrophyBaitClick = () => {
    soundEngine.playTroll(soundEnabled);
    soundEngine.playMemeLaugh(soundEnabled);
    setTrophyTrapped(true);
    onTroll(
      'AHAHAHA! IN ROOM 20?!',
      'You really thought there was a free Instant Win Trophy in the final boss battle?! A true challenger never takes the bait!'
    );
  };

  const handleFightFairClick = () => {
    soundEngine.playSuccess(soundEnabled);
    setPhase(3);
  };

  // --- PHASE 3 HANDLERS ---
  const handleGlyphClick = (glyph: string) => {
    soundEngine.playButtonPress(soundEnabled);
    const newSeq = [...playerGlyphSeq, glyph];
    setPlayerGlyphSeq(newSeq);

    const currIdx = newSeq.length - 1;
    if (newSeq[currIdx] !== correctGlyphSeq[currIdx]) {
      soundEngine.playGlitch(soundEnabled);
      soundEngine.playMemeLaugh(soundEnabled);
      onTroll(
        'Glyph Parity Mismatch!',
        'Harmonic parity error! Invert the core frequency sequence.'
      );
      setPlayerGlyphSeq([]);
      return;
    }

    if (newSeq.length === 4) {
      soundEngine.playSuccess(soundEnabled);
      setTimeout(() => setPhase(4), 800);
    }
  };

  // --- PHASE 4 HANDLERS ---
  const handleBsodOptionClick = (option: string) => {
    soundEngine.playTroll(soundEnabled);
    soundEngine.playMemeLaugh(soundEnabled);
    onTroll(
      'It\'s a Fake Crash!',
      `You clicked "${option}"! Don't panic over an error screen—check your hardware!`
    );
  };

  const handlePlugBsodCable = () => {
    soundEngine.playSuccess(soundEnabled);
    setBsodActive(false);
    setTimeout(() => setPhase(5), 600);
  };

  // --- PHASE 5 HANDLERS ---
  const handleTileClick = (letter: string, index: number) => {
    if (usedTileIndices.includes(index)) return;

    soundEngine.playButtonPress(soundEnabled);
    const nextExpected = targetWord[spelledLetters.length];

    if (letter !== nextExpected) {
      soundEngine.playTroll(soundEnabled);
      soundEngine.playMemeLaugh(soundEnabled);
      onTroll(
        'Incorrect Sequence!',
        'To defeat ELZZUP, reorder his name to reveal his true counterpart!'
      );
      setSpelledLetters([]);
      setUsedTileIndices([]);
      return;
    }

    const newSpelled = [...spelledLetters, letter];
    const newUsed = [...usedTileIndices, index];
    setSpelledLetters(newSpelled);
    setUsedTileIndices(newUsed);

    if (newSpelled.length === 6) {
      soundEngine.playEpicDefeat(soundEnabled);
      setTimeout(() => {
        onSuccess({
          title: 'ELZZUP DEFEATED',
          subtitle: '...for real.',
        });
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4">
      {/* PHASE HEADER PILL */}
      <div className="mb-4 flex items-center gap-2 bg-slate-900/90 border-2 border-red-500/60 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)]">
        <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-black">
          FINAL BOSS • PHASE {phase} OF 5
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-xs font-mono text-slate-300">
          {phase === 1 && 'Tri-Elemental Armor [HARD]'}
          {phase === 2 && 'The Golden Trophy Trap [RAGE-BAIT]'}
          {phase === 3 && 'Harmonic Glyph Matrix [HARD]'}
          {phase === 4 && 'The Fake System Crash [RAGE-BAIT]'}
          {phase === 5 && 'The True Identity [FINAL]'}
        </span>
      </div>

      {/* PHASE 1: TRI-ELEMENTAL BOSS SHIELDS */}
      {phase === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-red-600 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-red-400 tracking-wider">
              🛡️ PHASE 20.1: BREAK ELZZUP'S ELEMENTAL ARMOR
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-200 mt-1 font-medium">
              "My shields are rotating: 🔥 Fire, 💧 Water, ⚡ Lightning. Counter each in order!"
            </p>
          </div>

          {/* BOSS SPRITE & ROTATING SHIELD ORBS */}
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="flex flex-col items-center p-3 bg-red-950/40 border border-red-500/60 rounded-lg">
              <span className="text-2xl">🔥</span>
              <span className="text-[10px] font-mono text-red-300 font-bold">1. FIRE</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-950/40 border border-blue-500/60 rounded-lg">
              <span className="text-2xl">💧</span>
              <span className="text-[10px] font-mono text-blue-300 font-bold">2. WATER</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-amber-950/40 border border-amber-500/60 rounded-lg">
              <span className="text-2xl">⚡</span>
              <span className="text-[10px] font-mono text-amber-300 font-bold">3. LIGHTNING</span>
            </div>
          </div>

          {/* PLAYER'S COUNTER RUNES */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {[
              { name: 'WATER', icon: '💧', label: 'WATER RUNE', bg: 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white' },
              { name: 'LIGHTNING', icon: '⚡', label: 'LIGHTNING RUNE', bg: 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white' },
              { name: 'FIRE', icon: '🔥', label: 'FIRE RUNE', bg: 'bg-red-600 hover:bg-red-500 border-red-400 text-white' },
            ].map((rune) => (
              <motion.button
                key={rune.name}
                id={`boss-rune-${rune.name.toLowerCase()}`}
                onClick={() => handleElementalRuneClick(rune.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg font-mono font-black text-xs tracking-wider border-2 shadow-lg cursor-pointer flex flex-col items-center gap-1 ${rune.bg}`}
              >
                <span className="text-2xl">{rune.icon}</span>
                <span>{rune.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-300 font-semibold">
            Current Strikes: {phase1Counters.join(' ➔ ') || '[ Ready for strike 1... ]'}
          </div>
        </motion.div>
      )}

      {/* PHASE 2: THE INSTANT WIN TROPHY BAIT */}
      {phase === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-amber-500 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-amber-400 tracking-wider">
              🏆 PHASE 20.2: ELZZUP SURRENDERS?!
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-200 mt-1 font-medium">
              "Okay okay, I give up! You win! Just press this shiny golden button to finish the game right now!" — Elzzup
            </p>
          </div>

          {/* THE GOLDEN TROPHY TRAP BUTTON */}
          <motion.button
            id="instant-win-trophy-btn"
            onClick={handleTrophyBaitClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-md py-6 px-8 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-mono font-black text-base rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.8)] border-4 border-yellow-200 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <Trophy className="w-10 h-10 text-amber-900 animate-bounce" />
            <span>CLAIM INSTANT VICTORY & GRAND TROPHY</span>
            <span className="text-[10px] text-amber-900 font-normal">
              (100% Free Win • No Tricks Guaranteed!)
            </span>
          </motion.button>

          {/* THE HONEST 'FIGHT FAIR' BUTTON */}
          <button
            id="fight-fair-btn"
            onClick={handleFightFairClick}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 hover:border-amber-400 font-mono text-xs rounded-lg transition-colors cursor-pointer font-bold"
          >
            🛡️ "No thanks, I'll fight fair and finish Phase 3."
          </button>
        </motion.div>
      )}

      {/* PHASE 3: HARMONIC GLYPH MATRIX */}
      {phase === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-indigo-600 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-indigo-400 tracking-wider">
              ✨ PHASE 20.3: REVERSE HARMONIC GLYPH MATRIX
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-200 mt-1 font-medium">
              "My core pulses Star ➔ Diamond ➔ Triangle ➔ Circle. Invert the polarity to overload it!"
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md">
            {[
              { id: 'CIRCLE', icon: <Circle className="w-6 h-6" />, label: 'CIRCLE', bg: 'bg-red-600 hover:bg-red-500 text-white' },
              { id: 'TRIANGLE', icon: <Triangle className="w-6 h-6" />, label: 'TRIANGLE', bg: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
              { id: 'DIAMOND', icon: <Diamond className="w-6 h-6" />, label: 'DIAMOND', bg: 'bg-cyan-600 hover:bg-cyan-500 text-white' },
              { id: 'STAR', icon: <Star className="w-6 h-6" />, label: 'STAR', bg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black' },
            ].map((g) => (
              <motion.button
                key={g.id}
                id={`glyph-btn-${g.id.toLowerCase()}`}
                onClick={() => handleGlyphClick(g.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg font-mono font-bold text-xs flex flex-col items-center gap-2 border-2 border-slate-700 shadow-lg cursor-pointer ${g.bg}`}
              >
                {g.icon}
                <span>{g.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-300 font-semibold">
            Inverted Sequence: {playerGlyphSeq.join(' ➔ ') || '[ Awaiting glyph 1... ]'}
          </div>
        </motion.div>
      )}

      {/* PHASE 4: FAKE BLUE SCREEN OF DEATH CRASH */}
      {phase === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-blue-900 border-4 border-blue-400 rounded-xl p-6 shadow-2xl relative"
        >
          <div className="text-left w-full font-mono text-white text-xs md:text-sm flex flex-col gap-3">
            <div className="bg-white text-blue-900 font-bold px-2 py-1 inline-block w-fit">
              *** FATAL SYSTEM ERROR: ELZZUP.EXE CRASHED ***
            </div>
            <p>
              A fatal exception 0xELZZUP_TROLL occurred in Core.dll at 0028:C0011E36.
              The application will be terminated.
            </p>
            <p>
              * Press REBOOT to reset your computer.<br />
              * Press UNINSTALL to quit.<br />
              * Restore physical system link to resume execution.
            </p>
          </div>

          {/* FAKE BUTTONS */}
          <div className="flex items-center gap-4">
            <button
              id="bsod-reboot-btn"
              onClick={() => handleBsodOptionClick('REBOOT')}
              className="px-4 py-2 bg-blue-950 hover:bg-blue-800 text-white font-mono text-xs border border-white cursor-pointer font-bold"
            >
              [ REBOOT SYSTEM ]
            </button>
            <button
              id="bsod-cry-btn"
              onClick={() => handleBsodOptionClick('CRY')}
              className="px-4 py-2 bg-blue-950 hover:bg-blue-800 text-white font-mono text-xs border border-white cursor-pointer font-bold"
            >
              [ CRY ]
            </button>
          </div>

          {/* THE REAL LOOSE SPARKING POWER CABLE */}
          <motion.button
            id="bsod-loose-power-cable"
            onClick={handlePlugBsodCable}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-full max-w-sm py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer border-2 border-yellow-200 animate-pulse"
          >
            <Power className="w-4 h-4 text-slate-950" />
            🔌 [ CLICK TO RECONNECT SPARKING POWER CABLE ]
          </motion.button>
        </motion.div>
      )}

      {/* PHASE 5: THE TRUE FINAL PUZZLE (E-L-Z-Z-U-P -> P-U-Z-Z-L-E) */}
      {phase === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-amber-400 rounded-xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-black font-mono text-amber-400 tracking-wider">
              👑 PHASE 20.5: THE TRUE IDENTITY OF ELZZUP
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-200 mt-1 font-medium">
              "You may know my name, but can you decipher what it truly spells? Reorder my letters to vanquish me!"
            </p>
          </div>

          {/* SPELLED WORD SLOTS */}
          <div className="flex items-center gap-2">
            {targetWord.map((letter, idx) => (
              <div
                key={idx}
                className="w-12 h-14 bg-slate-950 border-2 border-amber-500/60 rounded-lg flex items-center justify-center text-2xl font-mono font-black text-amber-300 shadow-inner"
              >
                {spelledLetters[idx] || '_'}
              </div>
            ))}
          </div>

          {/* AVAILABLE LETTER TILES */}
          <div className="flex items-center gap-3">
            {availableTiles.map((letter, idx) => {
              const isUsed = usedTileIndices.includes(idx);
              return (
                <motion.button
                  key={idx}
                  id={`letter-tile-${letter.toLowerCase()}-${idx}`}
                  onClick={() => handleTileClick(letter, idx)}
                  disabled={isUsed}
                  whileHover={!isUsed ? { scale: 1.1, y: -4 } : {}}
                  whileTap={!isUsed ? { scale: 0.95 } : {}}
                  className={`w-12 h-14 rounded-lg font-mono font-black text-2xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                    isUsed
                      ? 'bg-slate-800 text-slate-600 border-slate-700 opacity-40 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-yellow-200 shadow-lg'
                  }`}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>

          <p className="text-xs font-mono text-slate-200 text-center font-bold">
            Select tiles in sequence to uncover the true name.
          </p>
        </motion.div>
      )}
    </div>
  );
};
