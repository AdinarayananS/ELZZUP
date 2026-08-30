import React, { useState, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { History, Database } from 'lucide-react';

export const Room15: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [rememberedChoice, setRememberedChoice] = useState<'RED' | 'BLUE'>('RED');
  const [pressedButton, setPressedButton] = useState<'RED' | 'BLUE' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if player had a saved choice from Room 3, fallback to RED (standard Room 3 solution)
    const stored = localStorage.getItem('elzzup_room3_choice');
    if (stored === 'BLUE' || stored === 'RED') {
      setRememberedChoice(stored);
    } else {
      setRememberedChoice('RED');
    }
  }, []);

  const handleSelection = (chosen: 'RED' | 'BLUE') => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPressedButton(chosen);

    if (chosen === rememberedChoice) {
      sound.playSuccess(soundEnabled);
      setTimeout(() => {
        onSuccess(
          'Yes. I remember that.',
          `Your choice of ${chosen} in Room 3 was verified against facility memory logs.`
        );
      }, 450);
    } else {
      sound.playTroll(soundEnabled);
      setTimeout(() => {
        onTroll(
          'Memory Mismatch.',
          `Facility records indicate you trusted ${rememberedChoice} previously.`,
          `ERR_MEMORY_RECALL // ATTEMPTED: ${chosen} vs LOGGED: ${rememberedChoice}`
        );
      }, 350);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none">
      {/* Top Banner Warning */}
      <div className="relative z-10 mb-4 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <Database size={14} className="text-[#ffdd00]" />
        <span className="font-bold text-[#f0f0ff]">ARCHIVE RECALL // ROOM 03 VERIFICATION</span>
      </div>

      {/* Main Chamber Pedestals */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
        <div className="w-full bg-[#1a1a3a] border-8 border-black p-6 sm:p-8 shadow-[0_12px_0_0_#000] flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-[#a0a0d0] font-mono text-xs font-bold uppercase tracking-wider">
            <History size={16} className="text-[#ffdd00]" />
            <span>Which button did you trust in Room 03?</span>
          </div>

          {/* Dual Choice Buttons */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 w-full flex-wrap">
            {/* RED OPTION */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSelection('RED')}
                disabled={isProcessing}
                title="Select RED button memory"
                className={`
                  group relative select-none cursor-pointer
                  w-24 h-24 sm:w-28 sm:h-28
                  rounded-full
                  bg-[#ff4444] hover:bg-[#ff6666]
                  border-8 border-black
                  flex flex-col items-center justify-center
                  transition-all duration-100 ease-out
                  ${
                    pressedButton === 'RED'
                      ? 'translate-y-3 shadow-[0_2px_0_0_#990000] bg-[#990000]'
                      : 'shadow-[0_10px_0_0_#990000,0_14px_0_0_#000] hover:-translate-y-1 active:translate-y-3'
                  }
                `}
              >
                <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 pointer-events-none rounded-full" />
                <span className="relative z-10 font-heading font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider">
                  RED
                </span>
              </button>
              <div className="w-32 sm:w-36 h-2.5 bg-[#2a2a4a] border-2 border-black shadow-[1px_1px_0_0_#000] -mt-1" />
            </div>

            {/* BLUE OPTION */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSelection('BLUE')}
                disabled={isProcessing}
                title="Select BLUE button memory"
                className={`
                  group relative select-none cursor-pointer
                  w-24 h-24 sm:w-28 sm:h-28
                  rounded-full
                  bg-[#2277ff] hover:bg-[#4499ff]
                  border-8 border-black
                  flex flex-col items-center justify-center
                  transition-all duration-100 ease-out
                  ${
                    pressedButton === 'BLUE'
                      ? 'translate-y-3 shadow-[0_2px_0_0_#0033aa] bg-[#0033aa]'
                      : 'shadow-[0_10px_0_0_#0033aa,0_14px_0_0_#000] hover:-translate-y-1 active:translate-y-3'
                  }
                `}
              >
                <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 pointer-events-none rounded-full" />
                <span className="relative z-10 font-heading font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider">
                  BLUE
                </span>
              </button>
              <div className="w-32 sm:w-36 h-2.5 bg-[#2a2a4a] border-2 border-black shadow-[1px_1px_0_0_#000] -mt-1" />
            </div>
          </div>
        </div>

        {/* Base Footing */}
        <div className="w-[85%] h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
      </div>

      {/* Decorative corner diamond */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
