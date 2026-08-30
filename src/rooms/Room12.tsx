import React, { useState, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Hourglass, Key, Zap } from 'lucide-react';

export const Room12: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [secondsWaited, setSecondsWaited] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isUnlocked || isProcessing) return;

    const timer = setInterval(() => {
      setSecondsWaited((prev) => {
        const next = prev + 1;
        if (next >= 4) {
          setIsUnlocked(true);
          sound.playLatchOpen(soundEnabled);
          clearInterval(timer);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isUnlocked, isProcessing, soundEnabled]);

  const handleDormantConsoleClick = () => {
    if (isProcessing) return;
    if (!isUnlocked) {
      sound.playTroll(soundEnabled);
      setIsProcessing(true);
      setTimeout(() => {
        onTroll(
          'Too impatient.',
          'The instruction literally said: "WAIT."',
          'ERR_CALIBRATION_INTERRUPTED // SYS_BUSY'
        );
      }, 350);
    }
  };

  const handleRevealedKeyClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    sound.playSuccess(soundEnabled);

    setTimeout(() => {
      onSuccess(
        'Observation rewarded.',
        'Patience and keen eyes beat blind button mashing.'
      );
    }, 450);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none">
      {/* Top Banner Status */}
      <div className="relative z-10 mb-6 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <Hourglass size={14} className={isUnlocked ? 'text-[#44ff44]' : 'text-[#ffdd00] animate-spin'} />
        <span className="font-bold text-[#f0f0ff]">
          {isUnlocked ? 'SYSTEM DORMANT LOCK DEACTIVATED' : 'FACILITY CALIBRATION IN PROGRESS...'}
        </span>
      </div>

      {/* Main Dormant Vault Console */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        <div className="w-full bg-[#1a1a3a] border-8 border-black p-6 sm:p-8 shadow-[0_12px_0_0_#000] flex flex-col items-center gap-5 text-center">
          {/* Main Display Screen */}
          <div
            onClick={handleDormantConsoleClick}
            className={`w-full bg-[#0a0a1a] border-4 border-black p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
              !isUnlocked ? 'hover:border-[#ff4444]' : ''
            }`}
          >
            <div className="font-mono text-xs text-[#a0a0d0] uppercase tracking-wider">
              TERMINAL // OFFLINE
            </div>
            <div className="w-full h-2 bg-[#1a1a3a] border border-black overflow-hidden relative">
              <div
                className={`h-full transition-all duration-1000 ease-linear ${
                  isUnlocked ? 'bg-[#44ff44]' : 'bg-[#ffdd00]'
                }`}
                style={{ width: `${Math.min((secondsWaited / 4) * 100, 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#ffdd00]">
              {isUnlocked ? 'OVERRIDE HATCH REVEALED BELOW' : `STANDBY: ${Math.min((secondsWaited / 4) * 100, 100)}%`}
            </span>
          </div>

          {/* Dormant Lever Slot */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 bg-[#2a2a4a] border-4 border-black flex flex-col items-center justify-center p-2 opacity-50">
              <Zap size={24} className="text-[#a0a0d0]" />
              <span className="font-mono text-[8px] text-[#a0a0d0] mt-1">LOCKED</span>
            </div>
            <div className="w-16 h-20 bg-[#2a2a4a] border-4 border-black flex flex-col items-center justify-center p-2 opacity-50">
              <Zap size={24} className="text-[#a0a0d0]" />
              <span className="font-mono text-[8px] text-[#a0a0d0] mt-1">LOCKED</span>
            </div>
          </div>

          {/* HIDDEN / REVEALED KEYCARD MODULE */}
          {isUnlocked && (
            <div className="w-full animate-bounce mt-1">
              <button
                onClick={handleRevealedKeyClick}
                disabled={isProcessing}
                title="Collect Revealed Access Key"
                className="w-full bg-[#ffdd00] hover:bg-[#ffee44] border-4 border-black py-3 px-4 shadow-[0_6px_0_0_#aa9900,0_8px_0_0_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 cursor-pointer transition-all"
              >
                <Key size={20} className="text-black" />
                <span className="font-heading font-extrabold text-xs sm:text-sm text-black uppercase tracking-wider">
                  INSERT OVERRIDE KEY
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Base Footing */}
        <div className="w-[85%] h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
      </div>

      {/* Decorative corner diamond */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
