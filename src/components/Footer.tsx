import React from 'react';

interface FooterProps {
  statusText?: string;
  isGlitching?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  statusText = 'SYSTEM STATUS: STABLE',
  isGlitching = false,
}) => {
  return (
    <footer className="w-full bg-[#1a1a3a] border-t-4 border-black py-3 z-30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-[#a0a0d0]">
        <div className="flex items-center gap-2 uppercase tracking-wider bg-black/40 border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">
          <span
            className={`w-2.5 h-2.5 rotate-45 ${
              isGlitching ? 'bg-[#ff4444] animate-ping' : 'bg-[#44ff44]'
            }`}
          />
          <span className={isGlitching ? 'text-[#ff4444] font-bold animate-pulse' : 'text-[#f0f0ff] font-bold'}>
            {isGlitching ? 'SYSTEM: INTEGRITY_ERR_0x99' : statusText}
          </span>
        </div>

        {/* Center Geometric Progress visual indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#a0a0d0] uppercase tracking-widest mr-1">PROGRESS:</span>
          <div className="w-3.5 h-3.5 bg-[#ffdd00] border-2 border-black shadow-[1px_1px_0_0_#000]" />
          <div className="w-3.5 h-3.5 bg-[#2a2a4a] border-2 border-black" />
          <div className="w-3.5 h-3.5 bg-[#2a2a4a] border-2 border-black" />
          <div className="w-3.5 h-3.5 bg-[#2a2a4a] border-2 border-black" />
          <div className="w-3.5 h-3.5 bg-[#2a2a4a] border-2 border-black" />
        </div>

        <div className="tracking-wider uppercase text-[#a0a0d0] text-right font-bold text-[11px]">
          [!] TRUST_INDEX: <span className="text-[#ffdd00]">100%</span> // NORMAL GAMEPLAY
        </div>
      </div>
    </footer>
  );
};
