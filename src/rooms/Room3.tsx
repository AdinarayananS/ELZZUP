import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';

export const Room3: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  roomKey,
  soundEnabled,
}) => {
  const [pressedButton, setPressedButton] = useState<'red' | 'blue' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRedClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPressedButton('red');
    try {
      localStorage.setItem('elzzup_room3_choice', 'RED');
    } catch {
      // safe fallback
    }
    sound.playButtonPress(soundEnabled);

    setTimeout(() => {
      onSuccess('Good Choice.', 'You actually listened this time.');
    }, 450);
  };

  const handleBlueClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPressedButton('blue');
    try {
      localStorage.setItem('elzzup_room3_choice', 'BLUE');
    } catch {
      // safe fallback
    }
    sound.playTroll(soundEnabled);

    setTimeout(() => {
      onTroll(
        'Wrong Choice.',
        'I said RED.',
        'ERR_COLOR_MISMATCH // SELECTION: BLUE'
      );
    }, 350);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 geo-dots-bg select-none">
      {/* Dual Button Layout */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Top Warning Banner */}
        <div className="mb-4 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
          <span className="w-2 h-2 rotate-45 bg-[#ffdd00]" />
          <span className="font-bold text-[#f0f0ff]">CHOOSE CAREFULLY // 50-50 PROTOCOL</span>
        </div>

        {/* Dual Pedestals Container */}
        <div className="flex items-center gap-6 sm:gap-12 flex-wrap justify-center">
          {/* 1. RED BUTTON */}
          <div className="flex flex-col items-center">
            <div className="relative p-4 sm:p-6 bg-[#2a2a4a] border-8 border-black shadow-[0_12px_0_0_#000] flex items-center justify-center">
              <div className="absolute inset-2 border-2 border-black pointer-events-none" />

              <button
                onClick={handleRedClick}
                disabled={isProcessing}
                title="Press the Red Button"
                className={`
                  group relative select-none cursor-pointer
                  w-24 h-24 sm:w-32 sm:h-32
                  rounded-full
                  bg-[#ff4444] hover:bg-[#ff6666]
                  border-8 border-black
                  flex flex-col items-center justify-center
                  transition-all duration-100 ease-out
                  ${
                    pressedButton === 'red'
                      ? 'translate-y-3 shadow-[0_2px_0_0_#990000] bg-[#990000]'
                      : 'shadow-[0_12px_0_0_#990000,0_16px_0_0_#000] hover:-translate-y-1 hover:shadow-[0_14px_0_0_#990000,0_18px_0_0_#000] active:translate-y-3 active:shadow-[0_2px_0_0_#990000]'
                  }
                `}
              >
                <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 pointer-events-none rounded-full" />
                <span className="relative z-10 font-heading font-extrabold text-xs sm:text-sm text-white tracking-widest uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  RED
                </span>
                <span className="absolute bottom-2 font-mono text-[9px] text-white/70 uppercase tracking-widest font-bold">
                  [#FF4444]
                </span>
              </button>
            </div>
            <div className="w-36 sm:w-44 h-3 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
          </div>

          {/* 2. BLUE BUTTON */}
          <div className="flex flex-col items-center">
            <div className="relative p-4 sm:p-6 bg-[#2a2a4a] border-8 border-black shadow-[0_12px_0_0_#000] flex items-center justify-center">
              <div className="absolute inset-2 border-2 border-black pointer-events-none" />

              <button
                onClick={handleBlueClick}
                disabled={isProcessing}
                title="Press the Blue Button"
                className={`
                  group relative select-none cursor-pointer
                  w-24 h-24 sm:w-32 sm:h-32
                  rounded-full
                  bg-[#2277ff] hover:bg-[#4499ff]
                  border-8 border-black
                  flex flex-col items-center justify-center
                  transition-all duration-100 ease-out
                  ${
                    pressedButton === 'blue'
                      ? 'translate-y-3 shadow-[0_2px_0_0_#0033aa] bg-[#0033aa]'
                      : 'shadow-[0_12px_0_0_#0033aa,0_16px_0_0_#000] hover:-translate-y-1 hover:shadow-[0_14px_0_0_#0033aa,0_18px_0_0_#000] active:translate-y-3 active:shadow-[0_2px_0_0_#0033aa]'
                  }
                `}
              >
                <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 pointer-events-none rounded-full" />
                <span className="relative z-10 font-heading font-extrabold text-xs sm:text-sm text-white tracking-widest uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  BLUE
                </span>
                <span className="absolute bottom-2 font-mono text-[9px] text-white/70 uppercase tracking-widest font-bold">
                  [#2277FF]
                </span>
              </button>
            </div>
            <div className="w-36 sm:w-44 h-3 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
          </div>
        </div>
      </div>

      {/* Decorative geometric diamond in corner */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
