import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';

export const Room1: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  roomKey,
  soundEnabled,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRedButtonClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setIsPressed(true);

    // Play tactile mechanical thud and 8-bit blip
    sound.playButtonPress(soundEnabled);

    // Small interaction animation before popping success
    setTimeout(() => {
      onSuccess('Nice.', 'That was suspiciously easy.');
    }, 450);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 geo-dots-bg">
      {/* Center Interactive Button Pedestal */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Shadow Pedestal Base */}
        <div className="relative flex flex-col items-center">
          {/* Top warning plate */}
          <div className="mb-4 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
            <span className="w-2 h-2 rotate-45 bg-[#ffdd00]" />
            <span className="font-bold text-[#f0f0ff]">PRIMARY TARGET // UNIT_01</span>
          </div>

          {/* The Red Button Pedestal */}
          <div className="relative p-6 sm:p-8 bg-[#2a2a4a] border-8 border-black shadow-[0_12px_0_0_#000] flex items-center justify-center">
            {/* Inner frame */}
            <div className="absolute inset-2 border-2 border-black pointer-events-none" />

            {/* THE RED BUTTON */}
            <button
              onClick={handleRedButtonClick}
              disabled={isProcessing}
              title="Press to solve"
              className={`
                group relative select-none cursor-pointer
                w-28 h-28 sm:w-36 sm:h-36
                rounded-full
                bg-[#ff4444] hover:bg-[#ff6666]
                border-8 border-black
                flex flex-col items-center justify-center
                transition-all duration-100 ease-out
                ${
                  isPressed
                    ? 'translate-y-3 shadow-[0_2px_0_0_#990000] bg-[#990000]'
                    : 'shadow-[0_12px_0_0_#990000,0_16px_0_0_#000] hover:-translate-y-1 hover:shadow-[0_14px_0_0_#990000,0_18px_0_0_#000] active:translate-y-3 active:shadow-[0_2px_0_0_#990000]'
                }
              `}
            >
              {/* Button Top Gloss Highlight */}
              <div className="absolute top-2 left-6 right-6 h-3.5 bg-white/30 pointer-events-none rounded-full" />

              {/* Icon / Glyph */}
              <div className="relative z-10 font-heading font-extrabold text-sm sm:text-base text-white tracking-widest uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {isProcessing ? 'CLICKED' : 'PRESS ME'}
              </div>

              {/* Button rim indicator */}
              <div className="absolute bottom-3 font-mono text-[9px] text-white/70 uppercase tracking-widest font-bold">
                [RED]
              </div>
            </button>
          </div>

          {/* Pedestal Footing */}
          <div className="w-56 sm:w-64 h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
        </div>
      </div>

      {/* Distraction/Ambient Wall Lever */}
      <div
        onClick={() => {
          sound.playGlitch(soundEnabled);
        }}
        title="Just decorative... or is it?"
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-20 flex flex-col items-center justify-end opacity-40 hover:opacity-90 transition-opacity cursor-pointer group"
      >
        <div className="w-2 h-12 bg-[#a0a0d0] border border-black origin-bottom -rotate-45 group-hover:rotate-45 transition-transform duration-200" />
        <div className="w-10 h-8 bg-[#2a2a4a] border-2 border-black shadow-[2px_2px_0_0_#000]" />
      </div>

      {/* Decorative geometric diamond in corner */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
