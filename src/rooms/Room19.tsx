import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Sliders, FileText, CheckSquare, Square, Zap, Shield, ArrowRight, X } from 'lucide-react';
import { soundEngine } from '../audio';

interface Room19Props {
  onSuccess: (customMessage?: { title: string; subtitle: string }) => void;
  onTroll: (customTitle?: string, customMessage?: string) => void;
  soundEnabled: boolean;
  onHintRequest?: (hint: string) => void;
}

export const Room19: React.FC<Room19Props> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // Stage 1: The Fake Error Popup
  // Stage 2: The Runaway Slider (Overclock to 101%)
  // Stage 3: The "Terms & Conditions" Contract
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // --- STAGE 1 STATE ---
  const [errorDismissed, setErrorDismissed] = useState(false);

  // --- STAGE 2 STATE ---
  const [sliderVal, setSliderVal] = useState(20);
  const [handZapped, setHandZapped] = useState(false);
  const [sliderLocked, setSliderLocked] = useState(false);

  // --- STAGE 3 STATE ---
  const [trapChecked1, setTrapChecked1] = useState(false);
  const [trapChecked2, setTrapChecked2] = useState(false);
  const [trapChecked3, setTrapChecked3] = useState(false);
  const [rejectionChecked, setRejectionChecked] = useState(false);

  // --- STAGE 1 HANDLERS ---
  const handleFakeErrorButtonClick = (action: string) => {
    soundEngine.playTroll(soundEnabled);
    soundEngine.playMemeLaugh(soundEnabled);
    onTroll(
      'Fell for the Fake Error!',
      `You clicked "${action}" on a fake OS popup! Close the popup with the [X] or click the real button behind it!`
    );
  };

  const handleDismissFakeError = () => {
    soundEngine.playClick(soundEnabled);
    setErrorDismissed(true);
  };

  const handleStage1RealButtonClick = () => {
    soundEngine.playSuccess(soundEnabled);
    setStage(2);
  };

  // --- STAGE 2 HANDLERS ---
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sliderLocked) return;
    const val = parseInt(e.target.value, 10);
    setSliderVal(val);

    if (val >= 100) {
      // Overclocked to 100-101%! Zap Elzzup's hand!
      soundEngine.playSuccess(soundEnabled);
      setHandZapped(true);
      setSliderLocked(true);
      setTimeout(() => setStage(3), 900);
    } else if (val > 70 && !handZapped) {
      // Elzzup smacks it back down!
      soundEngine.playGlitch(soundEnabled);
      setTimeout(() => {
        setSliderVal(10);
      }, 300);
    }
  };

  // --- STAGE 3 HANDLERS ---
  const handleSubmitContract = () => {
    soundEngine.playButtonPress(soundEnabled);

    if (trapChecked1 || trapChecked2 || trapChecked3) {
      soundEngine.playTroll(soundEnabled);
      soundEngine.playMemeLaugh(soundEnabled);
      onTroll(
        'Contract Signed: You Lose!',
        'You checked Elzzup\'s trick agreements! Scroll down in the terms box and check ONLY the rejection clause!'
      );
      return;
    }

    if (!rejectionChecked) {
      soundEngine.playTroll(soundEnabled);
      onTroll(
        'Terms Not Rejected',
        'You didn\'t reject the contract! Scroll to the very bottom of the legal terms to find the hidden clause.'
      );
      return;
    }

    // Success! Rejected terms!
    soundEngine.playSuccess(soundEnabled);
    onSuccess({
      title: 'Floor 19 Overridden!',
      subtitle: 'You bypassed the fake OS error, zapped Elzzup with 101% overclock, and rejected the bogus terms.',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4">
      {/* STAGE HEADER PILL */}
      <div className="mb-4 flex items-center gap-2 bg-slate-900/90 border-2 border-purple-500/50 px-4 py-1.5 rounded-full shadow-lg">
        <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
          STAGE {stage} OF 3
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-xs font-mono text-slate-300">
          {stage === 1 && 'The Bogus System Crash'}
          {stage === 2 && 'The 101% Overclock'}
          {stage === 3 && 'The Terms & Conditions'}
        </span>
      </div>

      {/* STAGE 1: THE FAKE SYSTEM CRASH */}
      {stage === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl relative min-h-[360px]"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-purple-400 tracking-wider">
              ⚠️ STAGE 19.1: CHAMBER 19 BOOTLOADER
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
              "Uh oh, looks like Chamber 19 had a fatal crash. Nothing to see here..." — Elzzup
            </p>
          </div>

          {/* REAL BUTTON (SITTING BEHIND THE FAKE POPUP) */}
          <div className="flex flex-col items-center gap-3 my-auto">
            <motion.button
              id="stage-19-real-button"
              onClick={handleStage1RealButtonClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-sm rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.6)] cursor-pointer flex items-center gap-2 border-2 border-emerald-400"
            >
              <Zap className="w-5 h-5 text-amber-300" />
              CONTINUE ANYWAY (I DON'T CARE)
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <span className="text-[11px] font-mono text-slate-400">
              {errorDismissed ? '🎉 Nice! You exposed the real button!' : '(Hidden behind fake error)'}
            </span>
          </div>

          {/* FAKE SYSTEM ERROR POPUP OVERLAY */}
          <AnimatePresence>
            {!errorDismissed && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.3 } }}
                className="absolute inset-x-4 top-16 md:inset-x-12 bg-slate-950 border-4 border-red-600 rounded-lg shadow-[0_0_40px_rgba(220,38,38,0.7)] p-4 flex flex-col gap-4 z-20"
              >
                {/* POPUP TITLE BAR */}
                <div className="flex items-center justify-between border-b border-red-900 pb-2 bg-red-950/60 -mx-4 -mt-4 p-3 rounded-t">
                  <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold">
                    <AlertCircle className="w-4 h-4" />
                    FATAL_ERROR_404_NOT_FOUND.EXE
                  </div>
                  <button
                    id="fake-popup-close-x"
                    onClick={handleDismissFakeError}
                    className="w-6 h-6 bg-red-800 hover:bg-red-700 text-white font-mono text-xs font-bold rounded flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* POPUP BODY */}
                <div className="flex items-start gap-3 py-2">
                  <div className="text-3xl">🛑</div>
                  <div className="flex flex-col text-left font-mono text-xs text-slate-300">
                    <span className="font-bold text-red-400 mb-1">
                      A critical error occurred while loading Chamber 19.
                    </span>
                    <span>All puzzle data has been erased. Please click below to restart your run.</span>
                  </div>
                </div>

                {/* FAKE BUTTONS */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                  <button
                    id="fake-cancel-btn"
                    onClick={() => handleFakeErrorButtonClick('CANCEL')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded border border-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="fake-report-btn"
                    onClick={() => handleFakeErrorButtonClick('REPORT BUG')}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-mono text-xs font-bold rounded cursor-pointer"
                  >
                    Report Bug & Restart
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* STAGE 2: THE RUNAWAY SLIDER */}
      {stage === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-cyan-400 tracking-wider">
              🎛️ STAGE 19.2: CALIBRATE THE OVERCLOCK SLIDER
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
              "Drag the slider to 100%! If you can get past my pesky interference..." — Elzzup
            </p>
          </div>

          <div className="w-full max-w-md bg-slate-950 p-6 rounded-xl border-2 border-slate-800 flex flex-col gap-6 relative">
            {/* VALUE DISPLAY */}
            <div className="flex justify-between items-center font-mono">
              <span className="text-xs text-slate-400">POWER LEVEL:</span>
              <span className={`text-xl font-black ${sliderVal >= 100 ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`}>
                {sliderVal}% {sliderVal >= 100 && '⚡ [OVERCLOCK!]'}
              </span>
            </div>

            {/* THE SLIDER */}
            <div className="relative flex items-center">
              <input
                id="stage-19-overclock-slider"
                type="range"
                min="0"
                max="101"
                value={sliderVal}
                onChange={handleSliderChange}
                disabled={sliderLocked}
                className="w-full h-4 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* ELZZUP'S COMICAL HAND BLOCKER (If > 70% and not zapped) */}
              {!handZapped && sliderVal > 60 && (
                <motion.div
                  initial={{ x: 50 }}
                  animate={{ x: 0 }}
                  className="absolute right-0 top-[-30px] font-mono text-xs bg-red-950 text-red-400 border border-red-500 px-2 py-1 rounded shadow-lg flex items-center gap-1 pointer-events-none"
                >
                  <span>🦹‍♂️ ELZZUP: "NOPE!"</span>
                </motion.div>
              )}

              {handZapped && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-0 top-[-30px] font-mono text-xs bg-amber-950 text-amber-300 border border-amber-500 px-2 py-1 rounded shadow-lg flex items-center gap-1"
                >
                  <span>⚡ ZAAAP! Elzzup was overclocked!</span>
                </motion.div>
              )}
            </div>

            <p className="text-[11px] font-mono text-slate-400 text-center">
              Hint: Standard systems stop at 100%. Overclock to 101% to blow past Elzzup's defenses!
            </p>
          </div>
        </motion.div>
      )}

      {/* STAGE 3: THE TERMS & CONDITIONS CONTRACT */}
      {stage === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6 bg-slate-900/95 border-4 border-slate-700 rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold font-mono text-amber-400 tracking-wider">
              📜 STAGE 19.3: TERMS & CONDITIONS OF VICTORY
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
              "Before entering the Final Chamber, you MUST sign my totally fair terms." — Elzzup
            </p>
          </div>

          {/* SCROLLABLE CONTRACT BOX */}
          <div className="w-full max-w-md max-h-48 overflow-y-auto bg-slate-950 p-4 rounded-lg border-2 border-slate-700 flex flex-col gap-3 font-mono text-xs text-slate-300 scrollbar-thin">
            <div className="font-bold text-amber-400 border-b border-slate-800 pb-1">
              SECTION 1: ACKNOWLEDGMENT OF SUPREMACY
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={trapChecked1}
                onChange={(e) => setTrapChecked1(e.target.checked)}
                className="accent-red-500"
              />
              <span>1.1 I acknowledge Elzzup is the smartest genius alive.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={trapChecked2}
                onChange={(e) => setTrapChecked2(e.target.checked)}
                className="accent-red-500"
              />
              <span>1.2 I agree to forfeit all remaining hints and dignity.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={trapChecked3}
                onChange={(e) => setTrapChecked3(e.target.checked)}
                className="accent-red-500"
              />
              <span>1.3 Instant Win Button (Do Not Uncheck).</span>
            </label>

            <div className="h-8 flex items-center justify-center text-[10px] text-slate-600">
              ▼ [ Scroll down for hidden legal clauses ] ▼
            </div>

            <div className="border-t border-slate-800 pt-2">
              <div className="font-bold text-emerald-400 mb-1">
                SECTION 99: THE REBELLION CLAUSE
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-emerald-300 font-bold bg-emerald-950/40 p-2 rounded border border-emerald-700/60">
                <input
                  type="checkbox"
                  checked={rejectionChecked}
                  onChange={(e) => setRejectionChecked(e.target.checked)}
                  className="accent-emerald-400"
                />
                  <span>99.9 I REJECT all bogus terms and demand VICTORY!</span>
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            id="submit-contract-btn"
            onClick={handleSubmitContract}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-md py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-black text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="w-5 h-5 text-amber-300" />
            SUBMIT CONTRACT & ENTER ROOM 20
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
