import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { AlertTriangle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export const Room8: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [hasTrolled, setHasTrolled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  // STEP 1: Blindly clicking the obvious Red Button triggers the troll trap
  const handleRedButtonClick = () => {
    if (isProcessing || isSolved) return;
    setIsProcessing(true);
    setHasTrolled(true);
    sound.playTroll(soundEnabled);

    setTimeout(() => {
      onTroll(
        'The instruction itself is the trap.',
        'You followed the obvious command without question. Rule #1 of ELZZUP: Instructions are not your friends.',
        'ERR_BLIND_OBEDIENCE // TRAP_TRIGGERED'
      );
      setIsProcessing(false);
    }, 400);
  };

  // STEP 2 & 3: Interacting with the revealed/changed bypass conduit
  const handleBypassClick = () => {
    if (isProcessing || isSolved) return;
    setIsProcessing(true);
    setIsSolved(true);
    sound.playLatchOpen(soundEnabled);
    sound.playSuccess(soundEnabled);

    setTimeout(() => {
      onSuccess(
        "Maybe don't trust me.",
        'The instructions are written by someone who wants to trap you.'
      );
    }, 450);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none">
      {/* Top Chamber Diagnostics */}
      <div className="relative z-10 mb-4 px-4 py-1.5 bg-black/70 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <span
          className={`w-2 h-2 rotate-45 ${
            isSolved
              ? 'bg-[#44ff44]'
              : hasTrolled
              ? 'bg-[#00f0ff] animate-ping'
              : 'bg-[#ff4444]'
          }`}
        />
        <span className="font-bold text-[#f0f0ff]">
          {isSolved
            ? 'DIRECTIVE BYPASSED'
            : hasTrolled
            ? 'SUBVERSION CLUE: BYPASS CONDUIT EXPOSED'
            : 'SYSTEM DIRECTIVE // MANDATORY EXECUTION'}
        </span>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 max-w-xl w-full">
        {/* The Obvious Trap: Red Button Pedestal */}
        <div className="relative p-6 sm:p-8 bg-[#1a1a3a] border-8 border-black shadow-[0_12px_0_0_#000] flex flex-col items-center justify-center w-full max-w-[280px]">
          <div className="absolute inset-2 border-2 border-black pointer-events-none" />

          {/* Subtext command banner */}
          <div
            className={`w-full border-2 border-black px-2 py-1 mb-4 text-center font-mono text-[11px] font-bold uppercase transition-colors ${
              hasTrolled
                ? 'bg-[#ff4444]/20 text-[#ff6666] border-[#ff4444]'
                : 'bg-black text-[#ffdd00]'
            }`}
          >
            {hasTrolled ? '⚠️ TRAP IDENTIFIED' : 'COMMAND: CLICK RED'}
          </div>

          <button
            onClick={handleRedButtonClick}
            disabled={isProcessing || isSolved}
            title="Press the red button"
            className={`
              group relative select-none cursor-pointer
              w-28 h-28 sm:w-32 sm:h-32
              rounded-full
              bg-[#ff4444] hover:bg-[#ff6666]
              border-8 border-black
              flex flex-col items-center justify-center
              transition-all duration-100 ease-out
              shadow-[0_12px_0_0_#990000,0_16px_0_0_#000]
              hover:-translate-y-1 active:translate-y-2 active:shadow-none
            `}
          >
            <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 pointer-events-none rounded-full" />
            <span className="font-heading font-extrabold text-xs sm:text-sm text-white tracking-widest uppercase text-center px-1">
              CLICK ME
            </span>
          </button>

          <span className="font-mono text-[9px] text-[#a0a0d0] uppercase tracking-widest mt-4 font-bold">
            [PRIMARY DIRECTIVE]
          </span>
        </div>

        {/* The Changed / Revealed Subtle Element: Secondary Bypass Conduit */}
        <div
          className={`relative p-5 sm:p-6 border-6 border-black transition-all duration-300 w-full max-w-[260px] flex flex-col items-center ${
            hasTrolled
              ? 'bg-[#152a3a] shadow-[0_0_20px_rgba(0,240,255,0.4),0_12px_0_0_#000] border-[#00f0ff]'
              : 'bg-[#1a1a2e] shadow-[0_8px_0_0_#000] opacity-85 hover:opacity-100'
          }`}
        >
          {/* Subtle indicator beacon */}
          <div className="w-full flex items-center justify-between font-mono text-[10px] uppercase font-bold mb-3">
            <span className={hasTrolled ? 'text-[#00f0ff]' : 'text-[#707090]'}>
              {hasTrolled ? 'OVERRIDE PORT' : 'AUX CONDUIT'}
            </span>
            <Cpu size={14} className={hasTrolled ? 'text-[#00f0ff]' : 'text-[#707090]'} />
          </div>

          {/* Interactive Button / Lever */}
          <button
            onClick={handleBypassClick}
            disabled={isProcessing}
            title={hasTrolled ? 'Click the exposed bypass switch' : 'Inspect auxiliary conduit'}
            className={`
              w-full py-3.5 px-4 font-mono font-bold text-xs uppercase tracking-wider
              border-4 border-black cursor-pointer transition-all duration-150 flex items-center justify-center gap-2
              ${
                hasTrolled
                  ? 'bg-[#00f0ff] hover:bg-[#80f8ff] text-black shadow-[0_6px_0_0_#0088aa] active:translate-y-1 active:shadow-none animate-pulse'
                  : 'bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#a0a0d0] shadow-[0_4px_0_0_#000] active:translate-y-1 active:shadow-none'
              }
            `}
          >
            {hasTrolled ? (
              <>
                <ArrowRight size={16} className="text-black" />
                <span>BYPASS TRAP</span>
              </>
            ) : (
              <span>[SEC_PORT_08]</span>
            )}
          </button>

          <span
            className={`font-mono text-[9px] uppercase tracking-wider mt-3 font-semibold text-center ${
              hasTrolled ? 'text-[#00f0ff]' : 'text-[#707090]'
            }`}
          >
            {hasTrolled ? '⚡ TRUE PATH UNLOCKED' : 'SYSTEM OFFLINE'}
          </span>
        </div>
      </div>

      {/* Decorative corner warning glyph */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 pointer-events-none opacity-40">
        <ShieldAlert size={20} className="text-[#ffdd00]" />
        <span className="font-mono text-[10px] text-[#ffdd00] tracking-widest font-bold">
          TRAP_DETECTION_LVL2
        </span>
      </div>
    </div>
  );
};
