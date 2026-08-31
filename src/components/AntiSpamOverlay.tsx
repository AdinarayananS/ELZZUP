import React from 'react';
import { AlertTriangle, Eye, ShieldAlert } from 'lucide-react';

interface AntiSpamOverlayProps {
  isLockedOut: boolean;
  lockoutMessage: string;
  spamToastMessage: string | null;
  moderateGlitchActive: boolean;
}

export const AntiSpamOverlay: React.FC<AntiSpamOverlayProps> = ({
  isLockedOut,
  lockoutMessage,
  spamToastMessage,
  moderateGlitchActive,
}) => {
  return (
    <>
      {/* 1. Level 1: Subtle Moderate Glitch Flicker */}
      {moderateGlitchActive && (
        <div className="absolute inset-0 pointer-events-none z-30 bg-[#ffdd00]/5 mix-blend-screen animate-pulse" />
      )}

      {/* 2. Level 2: High Spam In-Chamber Warning Toast */}
      {spamToastMessage && !isLockedOut && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 animate-fadeIn pointer-events-none select-none max-w-sm w-11/12">
          <div className="bg-[#1a1a3a]/95 border-3 border-[#ffdd00] shadow-[3px_3px_0_0_#000] p-2 flex items-center justify-center gap-2">
            <Eye size={14} className="text-[#ffdd00] animate-pulse shrink-0" />
            <span className="font-heading font-extrabold text-[11px] sm:text-xs text-[#ffdd00] tracking-wider uppercase text-center drop-shadow-[1px_1px_0_#000]">
              {spamToastMessage}
            </span>
          </div>
        </div>
      )}

      {/* 3. Level 3: Temporary Lockout Interruption (1.25s) */}
      {isLockedOut && (
        <div
          className="absolute inset-0 z-50 bg-[#0c0c1e]/90 backdrop-blur-[2px] flex items-center justify-center p-3 animate-fadeIn pointer-events-auto select-none"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {/* Scanline CRT overlay */}
          <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#ff4444_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Lockout Box */}
          <div
            className="relative max-w-sm w-full bg-[#1a1a3a] border-4 sm:border-6 border-[#ff4444] shadow-[0_0_25px_rgba(255,68,68,0.5),0_8px_0_0_#000] p-4 sm:p-5 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Warning Strip */}
            <div className="w-full bg-[#ff4444] text-black px-2 py-0.5 mb-3 flex items-center justify-between border-b-2 border-black">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <ShieldAlert size={12} />
                OVERRIDE_GUARD
              </span>
              <span className="font-mono text-[9px] font-black uppercase tracking-wider">
                [TEMP_LOCK]
              </span>
            </div>

            {/* Pixel Mascot / Warning Icon */}
            <div className="w-12 h-12 bg-[#2a1a2a] border-3 border-[#ff4444] flex items-center justify-center mb-2 shadow-[2px_2px_0_0_#000] animate-bounce shrink-0">
              <AlertTriangle size={24} className="text-[#ff4444]" />
            </div>

            {/* Stern Trolling Headline */}
            <h3 className="font-heading font-black text-base sm:text-lg text-[#ff4444] uppercase tracking-wider mb-1 drop-shadow-[2px_2px_0_#000]">
              {lockoutMessage}
            </h3>

            <p className="font-mono text-[10px] sm:text-[11px] text-[#a0a0d0] uppercase tracking-widest mb-3">
              Rapid input suspended. Observe the chamber.
            </p>

            {/* Rapid Cooldown Progress Bar */}
            <div className="w-full bg-black/80 border-2 border-black h-3.5 p-0.5 relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
              <div
                className="h-full bg-[#ffdd00] transition-all duration-[1250ms] ease-linear"
                style={{
                  width: '100%',
                  animation: 'cooldownBar 1.25s linear forwards',
                }}
              />
            </div>

            <div className="mt-2 font-mono text-[8px] text-[#ffdd00] tracking-widest uppercase font-bold">
              // RESUMING SYSTEM //
            </div>
          </div>
        </div>
      )}
    </>
  );
};
