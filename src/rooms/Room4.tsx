import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';

export const Room4: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  roomKey,
  soundEnabled,
}) => {
  // Dodge tracking: after 3 dodges, the button gets tired and stops moving
  const [dodgeCount, setDodgeCount] = useState(0);
  const [positionIndex, setPositionIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTaunt, setLastTaunt] = useState('PRESS ME');

  // Pre-calculated safe offset percentages within the chamber
  const POSITIONS = [
    { x: '0%', y: '0%' },       // 0: Center
    { x: '-26%', y: '-22%' },   // 1: Top-Left
    { x: '26%', y: '-22%' },    // 2: Top-Right
    { x: '0%', y: '25%' },      // 3: Bottom-Center (Tired)
  ];

  const TAUNTS = ['PRESS ME', 'NOPE! 💨', 'MISSED! 🏃', 'TIRED... 😮‍💨', 'CLICK ME'];

  const triggerDodge = () => {
    if (isProcessing) return;
    if (dodgeCount < 3) {
      sound.playDodge(soundEnabled);
      const nextCount = dodgeCount + 1;
      setDodgeCount(nextCount);
      setPositionIndex(nextCount % POSITIONS.length);
      setLastTaunt(TAUNTS[nextCount] || 'WHOOSH!');
    }
  };

  const handleButtonClick = () => {
    if (isProcessing) return;

    if (dodgeCount < 3) {
      // Still active - dodges on click (especially on touch devices where hover doesn't fire beforehand)
      triggerDodge();
    } else {
      // Button is tired - success click!
      setIsProcessing(true);
      setIsPressed(true);
      sound.playButtonPress(soundEnabled);

      setTimeout(() => {
        onSuccess('Gotcha!', 'Cardio is important for buttons too.');
      }, 450);
    }
  };

  const currentPos = POSITIONS[positionIndex] || POSITIONS[0];
  const isTired = dodgeCount >= 3;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 geo-dots-bg select-none overflow-hidden">
      {/* Top Warning Banner */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 bg-black/60 border-2 border-black font-mono text-[11px] sm:text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <span className={`w-2 h-2 rotate-45 ${isTired ? 'bg-[#44ff44]' : 'bg-[#ffdd00]'}`} />
        <span className="font-bold text-[#f0f0ff]">
          {isTired ? 'STATUS: TARGET FATIGUED (CLICKABLE)' : `EVASION LEVEL: ${dodgeCount}/3`}
        </span>
      </div>

      {/* Moving Button Wrapper */}
      <div
        className="relative z-20 transition-all duration-300 ease-out flex flex-col items-center justify-center"
        style={{
          transform: `translate(${currentPos.x}, ${currentPos.y})`,
        }}
        onMouseEnter={() => {
          if (!isTired && !isProcessing) {
            triggerDodge();
          }
        }}
      >
        <div className="relative p-4 sm:p-6 bg-[#2a2a4a] border-8 border-black shadow-[0_12px_0_0_#000] flex items-center justify-center">
          <div className="absolute inset-2 border-2 border-black pointer-events-none" />

          <button
            onClick={handleButtonClick}
            disabled={isProcessing}
            title={isTired ? 'Click the tired button!' : 'Try to catch me!'}
            className={`
              group relative select-none cursor-pointer
              w-24 h-24 sm:w-32 sm:h-32
              rounded-full
              ${isTired ? 'bg-[#ffdd00] hover:bg-[#fff380]' : 'bg-[#ff4444] hover:bg-[#ff6666]'}
              border-8 border-black
              flex flex-col items-center justify-center
              transition-all duration-100 ease-out
              ${
                isPressed
                  ? 'translate-y-3 shadow-[0_2px_0_0_#990000] bg-[#990000]'
                  : isTired
                  ? 'shadow-[0_10px_0_0_#bb9900,0_14px_0_0_#000] active:translate-y-3'
                  : 'shadow-[0_12px_0_0_#990000,0_16px_0_0_#000] hover:-translate-y-1 active:translate-y-3'
              }
            `}
          >
            <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 pointer-events-none rounded-full" />
            <span
              className={`relative z-10 font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase text-center px-1 ${
                isTired ? 'text-black' : 'text-white'
              }`}
            >
              {lastTaunt}
            </span>
            <span
              className={`absolute bottom-2 font-mono text-[9px] uppercase tracking-widest font-bold ${
                isTired ? 'text-black/70' : 'text-white/70'
              }`}
            >
              {isTired ? '[FATIGUED]' : `[DODGE: ${dodgeCount}/3]`}
            </span>
          </button>
        </div>
        <div className="w-36 sm:w-44 h-3 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
      </div>

      {/* Decorative original pedestal footprint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-black/60 rounded-full" />
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
