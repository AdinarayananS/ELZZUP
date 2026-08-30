import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';

interface ButtonChoice {
  id: string;
  name: string;
  colorHex: string;
  hoverHex: string;
  borderHex: string;
  shadowHex: string;
  isCorrect: boolean;
  trollMsg: string;
}

const BUTTONS: ButtonChoice[] = [
  {
    id: 'red',
    name: 'RED',
    colorHex: '#ff4444',
    hoverHex: '#ff6666',
    borderHex: '#000000',
    shadowHex: '#990000',
    isCorrect: false,
    trollMsg: 'Red is so Room 1.',
  },
  {
    id: 'blue',
    name: 'BLUE',
    colorHex: '#2277ff',
    hoverHex: '#4499ff',
    borderHex: '#000000',
    shadowHex: '#0033aa',
    isCorrect: false,
    trollMsg: 'Blue was last room. Move on.',
  },
  {
    id: 'green',
    name: 'GREEN',
    colorHex: '#22cc55',
    hoverHex: '#44ee77',
    borderHex: '#000000',
    shadowHex: '#007722',
    isCorrect: false,
    trollMsg: 'Green means go... back to start.',
  },
  {
    id: 'yellow',
    name: 'YELLOW',
    colorHex: '#ffdd00',
    hoverHex: '#ffee44',
    borderHex: '#000000',
    shadowHex: '#aa9900',
    isCorrect: true,
    trollMsg: '',
  },
  {
    id: 'purple',
    name: 'PURPLE',
    colorHex: '#b833ff',
    hoverHex: '#d166ff',
    borderHex: '#000000',
    shadowHex: '#660099',
    isCorrect: false,
    trollMsg: 'Purple is pretty, but incorrect.',
  },
];

export const Room7: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleButtonClick = (btn: ButtonChoice) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActiveButton(btn.id);

    if (btn.isCorrect) {
      sound.playSuccess(soundEnabled);
      setTimeout(() => {
        onSuccess(
          'You actually looked around.',
          'Observation beats impulsive clicking every single time.'
        );
      }, 450);
    } else {
      sound.playTroll(soundEnabled);
      setTimeout(() => {
        onTroll(
          'Wrong Button.',
          btn.trollMsg,
          `ERR_INVALID_PORT // ATTEMPTED: ${btn.name}`
        );
      }, 350);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none">
      {/* Environmental Clue: Chamber Plaque in top-right */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 bg-[#1a1a3a] border-2 border-black p-2 shadow-[2px_2px_0_0_#000] max-w-[180px] sm:max-w-[220px]">
        <div className="font-mono text-[10px] text-[#a0a0d0] uppercase tracking-wider font-bold">
          // SYS_MAINTENANCE_LOG
        </div>
        <div className="font-mono text-[11px] text-[#ffdd00] mt-0.5 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#ffdd00] rotate-45 inline-block" />
          ACTIVE BYPASS: YELLOW
        </div>
      </div>

      {/* Top Banner */}
      <div className="relative z-10 mb-6 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <span className="w-2 h-2 rotate-45 bg-[#ffdd00]" />
        <span className="font-bold text-[#f0f0ff]">CIRCUIT SELECTION // 5 POSSIBILITIES</span>
      </div>

      {/* 5 Buttons Layout in Row / Flex Grid */}
      <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6 flex-wrap max-w-2xl">
        {BUTTONS.map((btn) => {
          const isPressed = activeButton === btn.id;
          const isYellow = btn.id === 'yellow';

          return (
            <div key={btn.id} className="flex flex-col items-center">
              <div className="relative p-3 sm:p-4 bg-[#2a2a4a] border-4 sm:border-8 border-black shadow-[0_8px_0_0_#000] flex items-center justify-center">
                <div className="absolute inset-1 border border-black pointer-events-none" />

                <button
                  onClick={() => handleButtonClick(btn)}
                  disabled={isProcessing}
                  title={`Press ${btn.name}`}
                  style={{
                    backgroundColor: btn.colorHex,
                  }}
                  className={`
                    group relative select-none cursor-pointer
                    w-16 h-16 sm:w-20 sm:h-20
                    rounded-full
                    border-4 sm:border-6 border-black
                    flex flex-col items-center justify-center
                    transition-all duration-100 ease-out
                    ${
                      isPressed
                        ? 'translate-y-2 shadow-none'
                        : 'shadow-[0_8px_0_0_#000] hover:-translate-y-1 hover:brightness-110 active:translate-y-2 active:shadow-none'
                    }
                  `}
                >
                  <div className="absolute top-1 left-2 right-2 h-2 bg-white/30 pointer-events-none rounded-full" />
                  <span
                    className={`relative z-10 font-heading font-extrabold text-[11px] sm:text-xs tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                      isYellow ? 'text-black' : 'text-white'
                    }`}
                  >
                    {btn.name}
                  </span>
                </button>
              </div>
              <div className="w-24 sm:w-28 h-2.5 bg-[#1a1a3a] border-2 border-black shadow-[1px_1px_0_0_#000] -mt-0.5" />
            </div>
          );
        })}
      </div>

      {/* Decorative geometric diamond in corner */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
