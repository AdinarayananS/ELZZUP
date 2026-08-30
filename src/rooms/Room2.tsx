import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';

export const Room2: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  roomKey,
  soundEnabled,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isDepressed, setIsDepressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRedButtonClick = () => {
    if (isProcessing) return;

    if (clickCount === 0) {
      // First click: give subtle feedback (click sound, notch lamp 1, bounce animation)
      sound.playButtonPress(soundEnabled);
      setIsDepressed(true);
      setClickCount(1);

      setTimeout(() => {
        setIsDepressed(false);
      }, 150);
    } else if (clickCount === 1) {
      // Second click: solve puzzle!
      setIsProcessing(true);
      setIsDepressed(true);
      setClickCount(2);
      sound.playButtonPress(soundEnabled);

      setTimeout(() => {
        onSuccess('Nice Math.', '1 + 1 = Success. Look at you following instructions.');
      }, 450);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 geo-dots-bg select-none">
      {/* Center Interactive Button Pedestal */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Top Status & Notch Plate */}
          <div className="mb-4 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-3 shadow-[2px_2px_0_0_#000]">
            <span className="font-bold text-[#f0f0ff]">CYCLE COUNT:</span>
            <div className="flex items-center gap-1.5">
              {/* Notch 1 */}
              <div
                className={`w-3 h-3 border border-black transition-colors ${
                  clickCount >= 1 ? 'bg-[#ffdd00] shadow-[0_0_8px_#ffdd00]' : 'bg-[#2a2a4a]'
                }`}
              />
              {/* Notch 2 */}
              <div
                className={`w-3 h-3 border border-black transition-colors ${
                  clickCount >= 2 ? 'bg-[#44ff44] shadow-[0_0_8px_#44ff44]' : 'bg-[#2a2a4a]'
                }`}
              />
            </div>
            <span className="text-[10px] text-[#ffdd00] font-bold">
              [{clickCount}/2]
            </span>
          </div>

          {/* The Red Button Pedestal */}
          <div className="relative p-6 sm:p-8 bg-[#2a2a4a] border-8 border-black shadow-[0_12px_0_0_#000] flex items-center justify-center">
            {/* Inner frame */}
            <div className="absolute inset-2 border-2 border-black pointer-events-none" />

            {/* THE RED BUTTON */}
            <button
              onClick={handleRedButtonClick}
              disabled={isProcessing}
              title="Press twice to solve"
              className={`
                group relative select-none cursor-pointer
                w-28 h-28 sm:w-36 sm:h-36
                rounded-full
                bg-[#ff4444] hover:bg-[#ff6666]
                border-8 border-black
                flex flex-col items-center justify-center
                transition-all duration-100 ease-out
                ${
                  isDepressed
                    ? 'translate-y-3 shadow-[0_2px_0_0_#990000] bg-[#990000]'
                    : 'shadow-[0_12px_0_0_#990000,0_16px_0_0_#000] hover:-translate-y-1 hover:shadow-[0_14px_0_0_#990000,0_18px_0_0_#000] active:translate-y-3 active:shadow-[0_2px_0_0_#990000]'
                }
              `}
            >
              {/* Button Top Gloss Highlight */}
              <div className="absolute top-2 left-6 right-6 h-3.5 bg-white/30 pointer-events-none rounded-full" />

              {/* Icon / Glyph */}
              <div className="relative z-10 font-heading font-extrabold text-sm sm:text-base text-white tracking-widest uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {clickCount === 0 ? 'PRESS ME' : clickCount === 1 ? 'ONCE MORE' : 'DONE!'}
              </div>

              {/* Button rim indicator */}
              <div className="absolute bottom-3 font-mono text-[9px] text-white/70 uppercase tracking-widest font-bold">
                [ {clickCount} / 2 ]
              </div>
            </button>
          </div>

          {/* Pedestal Footing */}
          <div className="w-56 sm:w-64 h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
        </div>
      </div>

      {/* Decorative ambient wall lever */}
      <div
        onClick={() => sound.playGlitch(soundEnabled)}
        title="Just decorative..."
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
