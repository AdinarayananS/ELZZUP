import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Gauge, Sliders, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const Room14: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [dialA, setDialA] = useState(25);
  const [dialB, setDialB] = useState(25);
  const [phase, setPhase] = useState<'initial' | 'overload' | 'stabilized'>('initial');
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const adjustDial = (dial: 'A' | 'B', delta: number) => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);

    if (dial === 'A') {
      const nextA = Math.max(0, Math.min(100, dialA + delta));
      setDialA(nextA);
      checkPhase1(nextA, dialB);
    } else {
      const nextB = Math.max(0, Math.min(100, dialB + delta));
      setDialB(nextB);
      checkPhase1(dialA, nextB);
    }
  };

  const checkPhase1 = (a: number, b: number) => {
    if (phase === 'initial' && a === 100 && b === 100) {
      // Trigger false completion -> instant recalibration overload!
      setIsProcessing(true);
      sound.playSuccess(soundEnabled);

      const t1 = window.setTimeout(() => {
        sound.playGlitch(soundEnabled, 0.8);
        setPhase('overload');
        setIsProcessing(false);
      }, 900);

      timersRef.current.push(t1);
    }
  };

  const handleStabilize = () => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);
    setIsProcessing(true);

    if (phase === 'overload') {
      if (dialA + dialB === 100 && dialA > 0 && dialB > 0) {
        setPhase('stabilized');
        sound.playSuccess(soundEnabled);
        const t = window.setTimeout(() => {
          onSuccess(
            'Overload Neutralized.',
            'You adapted when the puzzle shifted the rules mid-attempt.'
          );
        }, 700);
        timersRef.current.push(t);
      } else {
        sound.playGlitch(soundEnabled);
        const t = window.setTimeout(() => {
          setIsProcessing(false);
          onTroll(
            'Equilibrium Failed',
            `Sum of Dial A (${dialA}%) and Dial B (${dialB}%) is ${dialA + dialB}%. It must equal exactly 100%.`,
            'ERR_OVERLOAD_UNSTABLE'
          );
        }, 700);
        timersRef.current.push(t);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* Header telemetry banner */}
      <div className="w-full max-w-lg mb-3 px-1">
        <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] tracking-wider uppercase flex items-center gap-2 font-bold bg-[#0c0c1e] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0_0_#000]">
          <Gauge size={16} className="text-[#ffdd00]" />
          <span>
            {phase === 'initial'
              ? 'PROTOCOL: 100% MAX POWER CALIBRATION'
              : 'PROTOCOL: REBALANCING (A + B = 100%)'}
          </span>
        </div>
      </div>

      {/* Main Dial Console */}
      <div className="bg-[#1a1a3a] border-4 sm:border-6 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-lg w-full">
        {/* Phase Notification Banner */}
        <div
          className={`w-full p-2.5 mb-4 text-center font-pixel text-xs sm:text-sm font-black uppercase border-3 border-black shadow-[3px_3px_0_0_#000] ${
            phase === 'initial'
              ? 'bg-[#2a2a4a] text-[#ffdd00]'
              : 'bg-[#ff4444] text-black animate-pulse'
          }`}
        >
          {phase === 'initial' ? (
            'DIAL ALIGNMENT REQUIRED // SYNC TO 100%'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle size={16} />
              OVERLOAD: REBALANCE EQUILIBRIUM (A + B = 100%)
            </span>
          )}
        </div>

        {/* Dual Dials */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full mb-5">
          {/* Dial A */}
          <div className="bg-[#2a2a4a] border-3 border-black p-3 flex flex-col items-center shadow-[3px_3px_0_0_#000]">
            <span className="font-mono text-xs text-[#a0a0d0] font-bold mb-1">DIAL A</span>
            <div className="font-heading font-black text-3xl text-[#ffdd00] mb-2">
              {dialA}%
            </div>
            <div className="w-full bg-black h-3 border border-black mb-3 p-0.5">
              <div
                className="h-full bg-[#ffdd00] transition-all"
                style={{ width: `${dialA}%` }}
              />
            </div>
            <div className="flex gap-2 w-full">
              <button
                disabled={isProcessing || dialA <= 0}
                onClick={() => adjustDial('A', -25)}
                className="flex-1 py-1 bg-[#1a1a2a] hover:bg-[#3a3a5a] text-[#f0f0ff] border border-black font-mono text-xs font-bold active:translate-y-0.5 cursor-pointer"
              >
                -25%
              </button>
              <button
                disabled={isProcessing || dialA >= 100}
                onClick={() => adjustDial('A', 25)}
                className="flex-1 py-1 bg-[#ffdd00] hover:bg-[#ffee44] text-black border border-black font-mono text-xs font-bold active:translate-y-0.5 cursor-pointer"
              >
                +25%
              </button>
            </div>
          </div>

          {/* Dial B */}
          <div className="bg-[#2a2a4a] border-3 border-black p-3 flex flex-col items-center shadow-[3px_3px_0_0_#000]">
            <span className="font-mono text-xs text-[#a0a0d0] font-bold mb-1">DIAL B</span>
            <div className="font-heading font-black text-3xl text-[#ffdd00] mb-2">
              {dialB}%
            </div>
            <div className="w-full bg-black h-3 border border-black mb-3 p-0.5">
              <div
                className="h-full bg-[#ffdd00] transition-all"
                style={{ width: `${dialB}%` }}
              />
            </div>
            <div className="flex gap-2 w-full">
              <button
                disabled={isProcessing || dialB <= 0}
                onClick={() => adjustDial('B', -25)}
                className="flex-1 py-1 bg-[#1a1a2a] hover:bg-[#3a3a5a] text-[#f0f0ff] border border-black font-mono text-xs font-bold active:translate-y-0.5 cursor-pointer"
              >
                -25%
              </button>
              <button
                disabled={isProcessing || dialB >= 100}
                onClick={() => adjustDial('B', 25)}
                className="flex-1 py-1 bg-[#ffdd00] hover:bg-[#ffee44] text-black border border-black font-mono text-xs font-bold active:translate-y-0.5 cursor-pointer"
              >
                +25%
              </button>
            </div>
          </div>
        </div>

        {/* Phase 2 Stabilize Action Button */}
        {phase === 'overload' && (
          <div className="w-full animate-fadeIn">
            <button
              disabled={isProcessing}
              onClick={handleStabilize}
              className="w-full py-2.5 bg-[#44ff44] hover:bg-[#66ff66] text-black border-3 border-black font-heading font-black text-sm uppercase shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              COMMIT STABILIZATION [CURRENT SUM: {dialA + dialB}%]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
