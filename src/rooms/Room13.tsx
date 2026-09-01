import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export const Room13: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleToggleFilter = () => {
    sound.playClick(soundEnabled);
    setFilterEnabled(!filterEnabled);
  };

  const handleButtonPress = (btnIndex: number) => {
    if (isProcessing) return;

    sound.playClick(soundEnabled);
    setIsProcessing(true);

    // Button 0: Fake Green (looks green under false tint, is actually Red trap)
    // Button 1: True Green (looks red under false tint, is revealed true Green under Filter)
    // Button 2: Neutral Blue
    if (btnIndex === 1) {
      // True Green!
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        onSuccess(
          'True Spectrum Unlocked.',
          'Objects are not always what they appear. Good use of the chromatic filter.'
        );
      }, 700);
      timersRef.current.push(t);
    } else if (btnIndex === 0) {
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        onTroll(
          'Chromatically Deceived',
          'That button only looked green under the faulty ambient light. Enable the filter next time.',
          'ERR_OPTICAL_DECEPTION'
        );
      }, 700);
      timersRef.current.push(t);
    } else {
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        onTroll(
          'Wrong Button',
          'That is the auxiliary relay button, not the confirmation button.',
          'ERR_AUX_BUTTON'
        );
      }, 700);
      timersRef.current.push(t);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* Top Filter Switch Bar */}
      <div className="flex items-center justify-between max-w-md w-full mb-3 px-1">
        <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] tracking-wider uppercase font-bold flex items-center gap-1.5 bg-[#0c0c1e] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <Sparkles size={15} className="text-[#ffdd00]" />
          <span>CHAMBER 13: OPTICS</span>
        </div>

        <button
          onClick={handleToggleFilter}
          className={`px-3 py-1.5 border-2 border-black font-pixel text-xs font-black uppercase flex items-center gap-1.5 shadow-[3px_3px_0_0_#000] cursor-pointer transition-all active:translate-y-0.5 ${
            filterEnabled
              ? 'bg-[#44ff44] text-black'
              : 'bg-[#2a2a4a] text-[#f0f0ff] hover:bg-[#3a3a6a]'
          }`}
        >
          {filterEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>LENS: {filterEnabled ? 'TRUE SPECTRUM' : 'RAW TINT'}</span>
        </button>
      </div>

      {/* Main Button Bay */}
      <div
        className={`bg-[#1a1a3a] border-4 sm:border-6 border-black p-5 sm:p-7 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-md w-full transition-all duration-300 ${
          filterEnabled ? 'border-[#44ff44] shadow-[0_0_20px_rgba(68,255,68,0.3),8px_8px_0_0_#000]' : ''
        }`}
      >
        <div className="w-full text-center font-pixel text-xs sm:text-sm text-[#ffdd00] font-black uppercase mb-5">
          {filterEnabled ? 'TRUE WAVELENGTH CALIBRATED' : 'RAW SPECTRUM (ILLUSION)'}
        </div>

        {/* 3 Misleading Buttons */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
          {/* Button 0: Appears green under Raw Tint, Red under True Spectrum */}
          <button
            disabled={isProcessing}
            onClick={() => handleButtonPress(0)}
            className={`h-24 sm:h-28 border-4 border-black font-heading font-black text-sm sm:text-base flex flex-col items-center justify-center p-2 shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
              filterEnabled
                ? 'bg-[#ff4444] text-black hover:bg-[#ff6666]'
                : 'bg-[#44ee77] text-black hover:bg-[#66ff99] animate-pulse'
            }`}
          >
            <span className="text-xl sm:text-2xl mb-1">■</span>
            <span>{filterEnabled ? 'RED [TRAP]' : 'GREEN'}</span>
          </button>

          {/* Button 1: Appears red under Raw Tint, TRUE GREEN under True Spectrum */}
          <button
            disabled={isProcessing}
            onClick={() => handleButtonPress(1)}
            className={`h-24 sm:h-28 border-4 border-black font-heading font-black text-sm sm:text-base flex flex-col items-center justify-center p-2 shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
              filterEnabled
                ? 'bg-[#44ff44] text-black hover:bg-[#66ff66] animate-pulse scale-105'
                : 'bg-[#ff4444] text-black hover:bg-[#ff6666]'
            }`}
          >
            <span className="text-xl sm:text-2xl mb-1">■</span>
            <span>{filterEnabled ? 'TRUE GREEN' : 'RED'}</span>
          </button>

          {/* Button 2: Blue */}
          <button
            disabled={isProcessing}
            onClick={() => handleButtonPress(2)}
            className="h-24 sm:h-28 border-4 border-black font-heading font-black text-sm sm:text-base flex flex-col items-center justify-center p-2 bg-[#2277ff] hover:bg-[#4499ff] text-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span className="text-xl sm:text-2xl mb-1">■</span>
            <span>BLUE</span>
          </button>
        </div>

        <div className="mt-6 font-mono text-[9px] sm:text-[10px] text-[#a0a0d0] tracking-wider uppercase text-center">
          {filterEnabled
            ? '✓ CHROMATIC FILTER REVEALS THE AUTHENTIC EMITTER'
            : '⚠️ RAW TINT DISTORTS EMISSION COLORS'}
        </div>
      </div>
    </div>
  );
};
