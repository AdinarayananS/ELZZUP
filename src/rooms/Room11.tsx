import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Binary, ShieldCheck } from 'lucide-react';

export const Room11: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [pressedSequence, setPressedSequence] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const TARGET_SEQUENCE = [4, 3, 2, 1];

  const handleButtonPress = (num: number) => {
    if (isProcessing) return;

    if (pressedSequence.includes(num)) {
      sound.playClick(soundEnabled);
      return;
    }

    sound.playClick(soundEnabled);
    const nextSeq = [...pressedSequence, num];
    setPressedSequence(nextSeq);

    // Check if current step matches TARGET_SEQUENCE
    const currentStepIndex = nextSeq.length - 1;
    if (nextSeq[currentStepIndex] !== TARGET_SEQUENCE[currentStepIndex]) {
      // Wrong sequence!
      setIsProcessing(true);
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setPressedSequence([]);
        onTroll(
          'Counter Inverted',
          'Did you really think counting forward works in a corrupted system? Look at the register log.',
          'ERR_REV_COUNT'
        );
      }, 500);
      timersRef.current.push(t);
      return;
    }

    // If completed all 4 in correct reversed order
    if (nextSeq.length === 4) {
      setIsProcessing(true);
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        onSuccess('Register Inverted.', 'Counting backwards: the first altered rule.');
      }, 600);
      timersRef.current.push(t);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none">
      {/* Background Tech Markings */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
        <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] tracking-wider uppercase flex items-center gap-2 font-bold bg-[#0c0c1e] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <Binary size={15} className="text-[#ffdd00]" />
          <span>STACK: [ 4 → 3 → 2 → 1 ]</span>
        </div>

        <div className="font-mono text-xs text-[#ff4444] bg-[#0c0c1e] border-2 border-black px-2 py-1 font-bold">
          [RULE: INVERSION]
        </div>
      </div>

      {/* Main Terminal Box */}
      <div className="bg-[#1a1a3a] border-4 sm:border-6 border-black p-5 sm:p-7 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-md w-full">
        <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] uppercase tracking-wider mb-4 font-black flex items-center gap-2">
          <ShieldCheck size={18} />
          <span>SEQUENCE TERMINAL</span>
        </div>

        {/* Step Indicator Lamps */}
        <div className="flex gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const isLit = pressedSequence.length > idx;
            return (
              <div
                key={idx}
                className={`w-8 h-8 border-3 border-black flex items-center justify-center font-mono text-sm font-black shadow-[2px_2px_0_0_#000] transition-colors ${
                  isLit ? 'bg-[#44ff44] text-black animate-pulse' : 'bg-[#2a2a4a] text-[#7777aa]'
                }`}
              >
                {isLit ? '✓' : idx + 1}
              </div>
            );
          })}
        </div>

        {/* 4 Chunky Pixel Number Buttons */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {[1, 2, 3, 4].map((num) => {
            const isPressed = pressedSequence.includes(num);
            return (
              <button
                key={num}
                disabled={isPressed || isProcessing}
                onClick={() => handleButtonPress(num)}
                className={`h-18 border-4 border-black font-heading font-black text-2xl shadow-[4px_4px_0_0_#000] transition-all cursor-pointer ${
                  isPressed
                    ? 'bg-[#2a2a4a] text-[#555577] translate-x-1 translate-y-1 shadow-none cursor-default'
                    : 'bg-[#ffdd00] hover:bg-[#ffee44] text-black active:translate-x-1 active:translate-y-1 active:shadow-none'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* High-Contrast Diagnostic Footer */}
        <div className="mt-6 w-full bg-[#0c0c1e] border-2 border-[#ffdd00] p-2.5 text-center font-mono text-xs text-[#f0f0ff] font-bold tracking-wide uppercase shadow-[2px_2px_0_0_#000]">
          DIAGNOSTIC CLUE: ASCEND BY DESCENDING.
        </div>
      </div>
    </div>
  );
};
