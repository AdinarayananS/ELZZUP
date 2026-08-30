import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Trophy, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const Room9: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // Breakers state for the initial calibration puzzle
  const [breakerStates, setBreakerStates] = useState<boolean[]>([false, false, false]);
  const [showFakeVictory, setShowFakeVictory] = useState(false);
  const [isFakeVictoryShattered, setIsFakeVictoryShattered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Toggle individual breakers
  const handleBreakerToggle = (index: number) => {
    if (showFakeVictory || isFakeVictoryShattered) return;
    sound.playClick(soundEnabled);

    const nextStates = [...breakerStates];
    nextStates[index] = !nextStates[index];
    setBreakerStates(nextStates);

    // If all 3 are activated, trigger the convincing FAKE VICTORY!
    if (nextStates.every((st) => st)) {
      setTimeout(() => {
        sound.playSuccess(soundEnabled);
        setShowFakeVictory(true);
      }, 300);
    }
  };

  // Clicking the obvious "CONTINUE" button on Fake Victory -> TROLL!
  const handleFakeContinueClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    sound.playTroll(soundEnabled);

    setTimeout(() => {
      setShowFakeVictory(false);
      setBreakerStates([false, false, false]);
      onTroll(
        'Did you really think that was it?',
        'Room 9 is not the end of ELZZUP. Look closely at your "victory".',
        'ERR_PREMATURE_CELEBRATION // FLOOR_09_IS_NOT_10'
      );
      setIsProcessing(false);
    }, 350);
  };

  // Clicking the subtle suspicious element: the glitching "ROOM 09 / 10" badge on the fake victory
  const handleSpotGlitchClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    sound.playGlitch(soundEnabled);
    sound.playLatchOpen(soundEnabled);

    // Shatter the fake victory
    setShowFakeVictory(false);
    setIsFakeVictoryShattered(true);
    setIsProcessing(false);
  };

  // Clicking the exposed true Elevator Core to Room 10
  const handleRealElevatorClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    sound.playSuccess(soundEnabled);

    setTimeout(() => {
      onSuccess(
        'You saw through the illusion.',
        "Room 9 wasn't the end. Now enter the true final trial."
      );
    }, 450);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none overflow-hidden">
      {/* Top Diagnostics */}
      <div className="relative z-10 mb-4 px-4 py-1.5 bg-black/70 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <span
          className={`w-2 h-2 rotate-45 ${
            isFakeVictoryShattered
              ? 'bg-[#44ff44]'
              : breakerStates.every(Boolean)
              ? 'bg-[#ffdd00]'
              : 'bg-[#00f0ff]'
          }`}
        />
        <span className="font-bold text-[#f0f0ff]">
          {isFakeVictoryShattered
            ? 'ILLUSION SHATTERED // CHAMBER 10 PORTAL READY'
            : 'POWER GRID OVERLOAD // ACTIVATE ALL 3 NODES'}
        </span>
      </div>

      {/* Main Chamber Area */}
      {!isFakeVictoryShattered ? (
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-lg w-full">
          {/* 3 Interactive Breaker Switches */}
          <div className="p-6 bg-[#1a1a3a] border-8 border-black shadow-[0_12px_0_0_#000] w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 pb-2 border-b-2 border-black font-mono text-xs text-[#a0a0d0] font-bold">
              <span>POWER NODES</span>
              <span className="text-[#ffdd00]">
                {breakerStates.filter(Boolean).length} / 3 CHARGED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
              {breakerStates.map((isActive, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBreakerToggle(idx)}
                  className={`
                    p-3 sm:p-4 border-4 border-black flex flex-col items-center justify-center gap-2
                    cursor-pointer transition-all duration-150
                    ${
                      isActive
                        ? 'bg-[#44ff44] text-black shadow-[0_4px_0_0_#228822] translate-y-1'
                        : 'bg-[#2a2a4a] text-[#a0a0d0] hover:bg-[#3a3a6a] shadow-[0_6px_0_0_#000] hover:-translate-y-0.5'
                    }
                  `}
                >
                  <Zap size={20} className={isActive ? 'text-black fill-black' : 'text-[#707090]'} />
                  <span className="font-heading font-extrabold text-xs tracking-wider">
                    NODE 0{idx + 1}
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase">
                    {isActive ? '[ONLINE]' : '[OFFLINE]'}
                  </span>
                </button>
              ))}
            </div>

            <span className="font-mono text-[10px] text-[#a0a0d0] uppercase tracking-wider mt-4 font-semibold">
              [CHARGE ALL NODES TO COMPLETE DEFEAT PROTOCOL]
            </span>
          </div>
        </div>
      ) : (
        /* Real Exposed Solution after spotting the illusion */
        <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-[#152a3a] border-8 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.4),0_12px_0_0_#000] max-w-md w-full animate-fadeIn">
          <div className="p-3 bg-black border-2 border-[#00f0ff] mb-4 text-center w-full">
            <span className="font-mono text-xs text-[#00f0ff] uppercase font-bold tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck size={16} /> TRUE PASSAGE UNLOCKED
            </span>
          </div>

          <button
            onClick={handleRealElevatorClick}
            disabled={isProcessing}
            title="Advance to Chamber 10"
            className="
              w-full py-5 px-6 bg-[#ffdd00] hover:bg-[#fff380] text-black
              border-6 border-black font-heading font-extrabold text-sm sm:text-base tracking-widest uppercase
              shadow-[0_8px_0_0_#bb9900,0_12px_0_0_#000] active:translate-y-2 active:shadow-none
              cursor-pointer flex items-center justify-center gap-3 transition-all
            "
          >
            <span>ENTER CHAMBER 10</span>
            <ArrowRight size={20} className="text-black" />
          </button>

          <span className="font-mono text-[10px] text-[#a0a0d0] uppercase tracking-wider mt-3 font-semibold text-center">
            [THE FINAL TRIAL AWAITS]
          </span>
        </div>
      )}

      {/* CONVINCING FAKE VICTORY OVERLAY (Rendered strictly inside Room 9) */}
      {showFakeVictory && (
        <div
          className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div
            className="relative max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#1a1a3a] border-6 sm:border-8 border-[#ffdd00] shadow-[0_0_40px_rgba(255,221,0,0.5),0_16px_0_0_#000] flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Trophy Icon */}
            <div className="w-14 h-14 sm:w-18 sm:h-18 bg-[#ffdd00] border-4 border-black flex items-center justify-center mb-3 sm:mb-4 shadow-[4px_4px_0_0_#000] animate-bounce shrink-0">
              <Trophy size={32} className="text-black" />
            </div>

            {/* Fake Victory Titles */}
            <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-[#ffdd00] tracking-wider uppercase mb-1 drop-shadow-[2px_2px_0_#000]">
              CONGRATULATIONS!
            </h2>
            <p className="font-heading font-bold text-xs sm:text-sm text-white uppercase tracking-widest mb-2 sm:mb-3">
              ELZZUP COMPLETE — YOU WIN!
            </p>

            {/* THE SUBTLE CLUE: Glitching Room Counter Badge (Clickable to expose illusion!) */}
            <button
              onClick={handleSpotGlitchClick}
              title="Inspect room counter anomaly"
              className="
                group my-1.5 sm:my-2 px-3 sm:px-4 py-1.5 bg-black/90 hover:bg-[#00f0ff]/20 border-2 border-dashed border-[#ff4444]
                font-mono text-[10px] sm:text-xs text-[#ff6666] hover:text-[#00f0ff] uppercase font-bold tracking-widest
                flex items-center gap-2 cursor-pointer transition-all hover:scale-105 select-none min-h-[40px]
              "
            >
              <AlertCircle size={14} className="text-[#ff4444] group-hover:text-[#00f0ff] animate-pulse shrink-0" />
              <span>ROOMS CLEARED: 09 / 10</span>
              <Sparkles size={12} className="text-[#ffdd00] shrink-0" />
            </button>

            <p className="font-mono text-[10px] sm:text-[11px] text-[#a0a0d0] my-2 sm:my-3 px-1 leading-relaxed">
              All facility protocols have been satisfied. Click continue to register your high score.
            </p>

            {/* The Obvious Trap Continue Button */}
            <button
              onClick={handleFakeContinueClick}
              disabled={isProcessing}
              title="Click Continue"
              className="
                w-full py-3.5 sm:py-4 px-6 bg-[#44ff44] hover:bg-[#66ff66] text-black
                border-4 sm:border-6 border-black font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-widest uppercase
                shadow-[0_6px_0_0_#228822,0_10px_0_0_#000] active:translate-y-2 active:shadow-none
                cursor-pointer transition-all mt-1 sm:mt-2 select-none min-h-[48px]
              "
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
