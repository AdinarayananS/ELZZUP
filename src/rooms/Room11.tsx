import React, { useState, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const Room11: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [waitedSeconds, setWaitedSeconds] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Timer to count 5 seconds of inactivity
  useEffect(() => {
    if (isRevealed || isProcessing) return;

    const interval = setInterval(() => {
      setWaitedSeconds((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          setIsRevealed(true);
          sound.playLatchOpen(soundEnabled);
          clearInterval(interval);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRevealed, isProcessing, soundEnabled]);

  const handleTemptationClick = (itemLabel: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    sound.playTroll(soundEnabled);

    setTimeout(() => {
      onTroll(
        'You pressed something.',
        'The instruction was literally: "DON\'T PRESS ANYTHING."',
        `ERR_IMPATIENT_CLICK // TOUCHED: ${itemLabel}`
      );
    }, 350);
  };

  const handleTrueSolutionClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    sound.playSuccess(soundEnabled);

    setTimeout(() => {
      onSuccess(
        'The instruction actually meant it.',
        'Sometimes the winning move is simply not to touch anything.'
      );
    }, 450);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none">
      {/* Top Banner Status */}
      <div className="relative z-10 mb-6 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <span className={`w-2 h-2 rotate-45 ${isRevealed ? 'bg-[#44ff44]' : 'bg-[#ff4444] animate-pulse'}`} />
        <span className="font-bold text-[#f0f0ff]">
          {isRevealed ? 'RESTRAINT VERIFIED // TRUE EXIT OPEN' : `MONITORING ACTIVITY // WAIT: ${waitedSeconds}/5s`}
        </span>
      </div>

      {/* Main Chamber Grid */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
        {/* Temptation Objects Panel */}
        <div className="w-full bg-[#1a1a3a] border-8 border-black p-6 sm:p-8 shadow-[0_12px_0_0_#000] flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-[#ff4444] font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={16} />
            <span>SENSITIVE CONTROL CONSOLE</span>
          </div>

          {/* Tempting Decoy Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full justify-items-center">
            {/* Decoy 1: Big Red Button */}
            <button
              onClick={() => handleTemptationClick('BIG_RED_BUTTON')}
              disabled={isProcessing}
              title="Do not press!"
              className="group w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#ff4444] hover:bg-[#ff6666] border-6 border-black shadow-[0_8px_0_0_#990000,0_10px_0_0_#000] active:translate-y-2 active:shadow-none flex flex-col items-center justify-center cursor-pointer transition-all"
            >
              <span className="font-heading font-extrabold text-[11px] sm:text-xs text-white uppercase tracking-wider">
                TEMPTATION
              </span>
              <span className="text-[9px] font-mono text-white/70 font-bold">[DO NOT PRESS]</span>
            </button>

            {/* Decoy 2: Shiny Yellow Switch */}
            <button
              onClick={() => handleTemptationClick('YELLOW_SWITCH')}
              disabled={isProcessing}
              title="Do not flip!"
              className="group w-24 h-24 sm:w-28 sm:h-28 bg-[#ffdd00] hover:bg-[#ffee44] border-6 border-black shadow-[0_8px_0_0_#bb9900,0_10px_0_0_#000] active:translate-y-2 active:shadow-none flex flex-col items-center justify-center cursor-pointer transition-all"
            >
              <span className="font-heading font-extrabold text-[11px] sm:text-xs text-black uppercase tracking-wider">
                OVERRIDE
              </span>
              <span className="text-[9px] font-mono text-black/70 font-bold">[DANGER]</span>
            </button>

            {/* Decoy 3: Neon Blue Trigger */}
            <button
              onClick={() => handleTemptationClick('BLUE_TRIGGER')}
              disabled={isProcessing}
              title="Do not touch!"
              className="col-span-2 sm:col-span-1 group w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-[#2277ff] hover:bg-[#4499ff] border-6 border-black shadow-[0_8px_0_0_#0033aa,0_10px_0_0_#000] active:translate-y-2 active:shadow-none flex flex-col items-center justify-center cursor-pointer transition-all"
            >
              <span className="font-heading font-extrabold text-[11px] sm:text-xs text-white uppercase tracking-wider">
                BYPASS
              </span>
              <span className="text-[9px] font-mono text-white/70 font-bold">[TRAP]</span>
            </button>
          </div>

          {/* REVEALED SOLUTION (Slides in after 5s of patience) */}
          {isRevealed && (
            <div className="w-full mt-2 animate-bounce flex flex-col items-center">
              <button
                onClick={handleTrueSolutionClick}
                disabled={isProcessing}
                title="Patience verified! Click to complete."
                className="w-full bg-[#22cc55] hover:bg-[#44ee77] border-4 border-black py-3 px-6 shadow-[0_6px_0_0_#118833,0_8px_0_0_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 cursor-pointer transition-all"
              >
                <CheckCircle size={22} className="text-black" />
                <span className="font-heading font-extrabold text-sm sm:text-base text-black uppercase tracking-widest">
                  CLAIM REWARD (5s PASSED)
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Console Footing */}
        <div className="w-full max-w-[90%] h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
      </div>

      {/* Decorative corner diamond */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
