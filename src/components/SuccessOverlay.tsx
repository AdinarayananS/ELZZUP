import React, { useEffect } from 'react';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../audio';

interface SuccessOverlayProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  elapsedSeconds: number;
  errorsCount: number;
  onNextRoom: () => void;
  soundEnabled: boolean;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
  isOpen,
  title = 'Wow. You did it.',
  subtitle = '(Somehow.)',
  elapsedSeconds,
  errorsCount,
  onNextRoom,
  soundEnabled,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccess(soundEnabled);
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  const formattedErrors = errorsCount.toString().padStart(3, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1e]/90 backdrop-blur-md animate-fade-in">
      {/* Background celebration particle glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#ffdd00]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#44ff44]/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Main Success Dialog Container */}
      <div className="relative z-10 flex flex-col items-center max-w-[640px] w-full max-h-[92vh] overflow-y-auto p-1">
        <div className="w-full bg-[#1a1a3a] border-6 sm:border-8 border-black p-1 shadow-[0_12px_0_0_#000] relative">
          <div className="border-2 border-black bg-[#2a2a4a] p-4 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] relative overflow-hidden text-center">
            {/* Window Top Bar */}
            <div className="absolute top-0 left-0 w-full bg-[#ffdd00] flex items-center justify-between px-3 py-1.5 border-b-4 border-black">
              <span className="font-mono text-[10px] sm:text-xs font-bold text-black uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} />
                SYSTEM_MESSAGE // LEVEL_CLEARED
              </span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 bg-black" />
                <div className="w-2.5 h-2.5 bg-black" />
                <div className="w-2.5 h-2.5 bg-black" />
              </div>
            </div>

            {/* Trophy Icon */}
            <div className="mt-4 sm:mt-5 mb-4 sm:mb-6 w-20 h-20 sm:w-28 sm:h-28 border-4 border-black bg-[#1a1a3a] shadow-[4px_4px_0_0_#000] flex items-center justify-center relative animate-bounce shrink-0">
              <Trophy size={40} className="text-[#ffdd00]" />
            </div>

            {/* Main Glitchy Success Headline */}
            <div className="relative w-full max-w-lg my-1 sm:my-2">
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#ffdd00] uppercase tracking-tighter drop-shadow-[2px_2px_0_#000]">
                {title}
              </h2>
            </div>

            {/* Subtitle / Troll quip */}
            <p className="font-mono font-bold text-sm sm:text-base md:text-lg text-[#a0a0d0] uppercase tracking-widest mt-1 mb-4 sm:mb-6">
              {subtitle}
            </p>

            {/* Stats Summary */}
            <div className="flex gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm my-1 sm:my-2">
              <div className="flex-1 bg-[#1a1a3a] border-2 border-black p-2 sm:p-2.5 text-center shadow-[2px_2px_0_0_#000]">
                <div className="font-mono text-[10px] sm:text-xs text-[#a0a0d0] uppercase tracking-wider mb-0.5 font-bold">
                  Time
                </div>
                <div className="font-mono font-bold text-xs sm:text-base text-[#ffdd00]">
                  {minutes}:{seconds}
                </div>
              </div>
              <div className="flex-1 bg-[#1a1a3a] border-2 border-black p-2 sm:p-2.5 text-center shadow-[2px_2px_0_0_#000]">
                <div className="font-mono text-[10px] sm:text-xs text-[#a0a0d0] uppercase tracking-wider mb-0.5 font-bold">
                  Errors
                </div>
                <div className="font-mono font-bold text-xs sm:text-base text-[#ff4444]">
                  {formattedErrors}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Room Action Button */}
        <div className="mt-4 sm:mt-6 w-full max-w-[360px]">
          <button
            onClick={onNextRoom}
            className="group relative w-full block bg-[#ffdd00] hover:bg-[#fff380] border-4 border-black shadow-[4px_4px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100 ease-in-out cursor-pointer py-3.5 sm:py-4 px-6 select-none min-h-[48px]"
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              <span className="font-heading font-extrabold text-base sm:text-xl text-black uppercase tracking-widest whitespace-nowrap">
                Next Room
              </span>
              <ArrowRight size={22} className="text-black group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
