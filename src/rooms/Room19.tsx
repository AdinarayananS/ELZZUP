import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Flame, Magnet, Compass, CheckCircle, ShieldAlert } from 'lucide-react';

export const Room19: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [thermal, setThermal] = useState(25);
  const [magnetic, setMagnetic] = useState(100);
  const [pressure, setPressure] = useState(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const TARGET_THERMAL = 75;
  const TARGET_MAGNETIC = 50;
  const TARGET_PRESSURE = 25;

  const handleAdjust = (type: 'thermal' | 'magnetic' | 'pressure', delta: number) => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);

    if (type === 'thermal') {
      setThermal((prev) => Math.max(0, Math.min(100, prev + delta)));
    } else if (type === 'magnetic') {
      setMagnetic((prev) => Math.max(0, Math.min(100, prev + delta)));
    } else {
      setPressure((prev) => Math.max(0, Math.min(100, prev + delta)));
    }
  };

  const handleDeactivateContainment = () => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);
    setIsProcessing(true);

    const isThermalOk = thermal === TARGET_THERMAL;
    const isMagneticOk = magnetic === TARGET_MAGNETIC;
    const isPressureOk = pressure === TARGET_PRESSURE;

    if (isThermalOk && isMagneticOk && isPressureOk) {
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        onSuccess(
          'Master Containment Breached.',
          'All 3 core dampeners harmonized. Entering THE VOID CORE.'
        );
      }, 700);
      timersRef.current.push(t);
    } else {
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        const errDetails = [];
        if (!isThermalOk) errDetails.push(`Thermal (${thermal}% ≠ 75%)`);
        if (!isMagneticOk) errDetails.push(`Magnetic (${magnetic}% ≠ 50%)`);
        if (!isPressureOk) errDetails.push(`Pressure (${pressure}% ≠ 25%)`);

        onTroll(
          'Containment Overpressure',
          `Core destabilized: ${errDetails.join(', ')}. Match all target calibrations.`,
          'ERR_CORE_CALIBRATION'
        );
      }, 700);
      timersRef.current.push(t);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* Top Warning Banner */}
      <div className="flex items-center justify-between max-w-lg w-full mb-3 px-1">
        <div className="font-pixel text-xs sm:text-sm text-[#ff4444] tracking-wider uppercase font-extrabold flex items-center gap-2 animate-pulse bg-[#0c0c1e] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <ShieldAlert size={16} />
          <span>SECTOR 19: CORE PERIMETER</span>
        </div>
        <div className="font-mono text-xs bg-[#ffdd00] text-black px-2 py-1 font-black uppercase border border-black shadow-[2px_2px_0_0_#000]">
          CRITICAL
        </div>
      </div>

      {/* Main Console Box */}
      <div className="bg-[#1a1a3a] border-4 sm:border-6 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-lg w-full">
        {/* 3 Pillars */}
        <div className="grid grid-cols-3 gap-3 w-full mb-4">
          {/* 1. Thermal Pillar */}
          <div className="bg-[#2a2a4a] border-3 border-black p-3 flex flex-col items-center shadow-[3px_3px_0_0_#000]">
            <div className="flex items-center gap-1.5 text-xs font-pixel font-bold text-[#ff8888] mb-1">
              <Flame size={14} />
              <span>THERMAL</span>
            </div>
            <div className="font-heading font-black text-2xl text-[#ffdd00] mb-1">
              {thermal}%
            </div>
            <div className="font-mono text-xs text-[#f0f0ff] mb-2 font-bold bg-black/80 px-1.5 py-0.5 border border-black">
              TARGET: 75%
            </div>
            <div className="flex gap-1.5 w-full">
              <button
                disabled={isProcessing || thermal <= 0}
                onClick={() => handleAdjust('thermal', -25)}
                className="flex-1 py-1.5 bg-[#1a1a2a] text-[#f0f0ff] hover:bg-[#3a3a5a] border-2 border-black font-mono text-xs font-black active:translate-y-0.5 cursor-pointer"
              >
                -
              </button>
              <button
                disabled={isProcessing || thermal >= 100}
                onClick={() => handleAdjust('thermal', 25)}
                className="flex-1 py-1.5 bg-[#ffdd00] text-black hover:bg-[#ffee44] border-2 border-black font-mono text-xs font-black active:translate-y-0.5 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* 2. Magnetic Pillar */}
          <div className="bg-[#2a2a4a] border-3 border-black p-3 flex flex-col items-center shadow-[3px_3px_0_0_#000]">
            <div className="flex items-center gap-1.5 text-xs font-pixel font-bold text-[#88aaff] mb-1">
              <Magnet size={14} />
              <span>MAGNETIC</span>
            </div>
            <div className="font-heading font-black text-2xl text-[#ffdd00] mb-1">
              {magnetic}%
            </div>
            <div className="font-mono text-xs text-[#f0f0ff] mb-2 font-bold bg-black/80 px-1.5 py-0.5 border border-black">
              TARGET: 50%
            </div>
            <div className="flex gap-1.5 w-full">
              <button
                disabled={isProcessing || magnetic <= 0}
                onClick={() => handleAdjust('magnetic', -25)}
                className="flex-1 py-1.5 bg-[#1a1a2a] text-[#f0f0ff] hover:bg-[#3a3a5a] border-2 border-black font-mono text-xs font-black active:translate-y-0.5 cursor-pointer"
              >
                -
              </button>
              <button
                disabled={isProcessing || magnetic >= 100}
                onClick={() => handleAdjust('magnetic', 25)}
                className="flex-1 py-1.5 bg-[#ffdd00] text-black hover:bg-[#ffee44] border-2 border-black font-mono text-xs font-black active:translate-y-0.5 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* 3. Pressure Pillar */}
          <div className="bg-[#2a2a4a] border-3 border-black p-3 flex flex-col items-center shadow-[3px_3px_0_0_#000]">
            <div className="flex items-center gap-1.5 text-xs font-pixel font-bold text-[#aaffaa] mb-1">
              <Compass size={14} />
              <span>PRESSURE</span>
            </div>
            <div className="font-heading font-black text-2xl text-[#ffdd00] mb-1">
              {pressure}%
            </div>
            <div className="font-mono text-xs text-[#f0f0ff] mb-2 font-bold bg-black/80 px-1.5 py-0.5 border border-black">
              TARGET: 25%
            </div>
            <div className="flex gap-1.5 w-full">
              <button
                disabled={isProcessing || pressure <= 0}
                onClick={() => handleAdjust('pressure', -25)}
                className="flex-1 py-1.5 bg-[#1a1a2a] text-[#f0f0ff] hover:bg-[#3a3a5a] border-2 border-black font-mono text-xs font-black active:translate-y-0.5 cursor-pointer"
              >
                -
              </button>
              <button
                disabled={isProcessing || pressure >= 100}
                onClick={() => handleAdjust('pressure', 25)}
                className="flex-1 py-1.5 bg-[#ffdd00] text-black hover:bg-[#ffee44] border-2 border-black font-mono text-xs font-black active:translate-y-0.5 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Master Deactivation Button */}
        <button
          disabled={isProcessing}
          onClick={handleDeactivateContainment}
          className="w-full py-3 bg-[#ff4444] hover:bg-[#ff6666] text-black border-3 border-black font-heading font-black text-xs sm:text-sm uppercase shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle size={16} />
          SHUT DOWN CONTAINMENT FIELDS
        </button>

        <div className="mt-3 font-mono text-[9px] text-[#a0a0d0] tracking-wider uppercase text-center">
          Warning: Disabling containment opens direct access to Floor 20 (The Void Core).
        </div>
      </div>
    </div>
  );
};
