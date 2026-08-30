import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { sound } from '../audio';

interface TrollOverlayProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  errorCode?: string;
  onRetry: () => void;
  soundEnabled: boolean;
}

export const TrollOverlay: React.FC<TrollOverlayProps> = ({
  isOpen,
  title = 'OOPS.',
  subtitle = 'WAS THAT IMPORTANT?',
  description = 'System integrity compromised. Data fragmentation detected. Reboot sequence initiated but probably failed anyway.',
  errorCode = 'ERR_CODE: 0xDEADBEEF // SEQ: FAILED',
  onRetry,
  soundEnabled,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playTroll(soundEnabled);
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1e]/90 backdrop-blur-md animate-fade-in">
      {/* Red ambient warning pulse */}
      <div className="absolute inset-0 bg-[#ff4444]/10 mix-blend-overlay pointer-events-none animate-pulse" />

      {/* Main Troll Container */}
      <div className="relative z-10 w-full max-w-[540px] max-h-[92vh] overflow-y-auto bg-[#1a1a3a] border-6 sm:border-8 border-black p-1 shadow-[0_12px_0_0_#000]">
        <div className="border-2 border-black bg-[#2a2a4a] p-4 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle Glitch scanline overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #ff4444 2px, #ff4444 4px)',
            }}
          />

          {/* Warning Icon */}
          <div className="mb-3 sm:mb-4 text-[#ff4444] animate-bounce shrink-0">
            <AlertOctagon size={44} className="text-[#ff4444]" />
          </div>

          {/* Glitch Headline */}
          <h2
            className="font-heading font-extrabold text-2xl sm:text-4xl text-[#ff4444] uppercase tracking-tighter text-glitch mb-1 drop-shadow-[2px_2px_0_#000]"
            data-text={title}
          >
            {title}
          </h2>

          <h3
            className="font-heading font-bold text-sm sm:text-lg md:text-xl text-[#ffdd00] uppercase tracking-wider text-glitch mb-3 sm:mb-4"
            data-text={subtitle}
          >
            {subtitle}
          </h3>

          {/* Subtext description */}
          <p className="font-mono text-[11px] sm:text-sm text-[#f0f0ff] max-w-md leading-relaxed mb-4 sm:mb-6">
            {description}
          </p>

          {/* RETRY Action Button */}
          <div className="relative my-1 sm:my-2 w-full max-w-xs flex justify-center">
            <button
              onClick={onRetry}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#ff4444] hover:bg-[#ff6666] text-white font-heading font-extrabold text-base sm:text-xl uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 select-none min-h-[48px]"
            >
              <RotateCcw size={18} />
              <span>Retry</span>
            </button>
          </div>

          {/* Error code readout */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-black w-full">
            <span className="font-mono text-[9px] sm:text-[11px] text-[#a0a0d0] uppercase tracking-widest font-bold">
              {errorCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
