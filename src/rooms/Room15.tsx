import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Lock, Unlock, Zap, ShieldAlert } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Room15: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [switches, setSwitches] = useState([false, false, false]);
  const [isLocked, setIsLocked] = useState(false);
  const [interferenceActive, setInterferenceActive] = useState(false);
  const [elzzupComment, setElzzupComment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleToggleSwitch = (index: number) => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);

    const nextSwitches = [...switches];
    nextSwitches[index] = !nextSwitches[index];
    setSwitches(nextSwitches);

    // If not locked, trigger Elzzup's interference chance
    if (!isLocked) {
      const activeCount = nextSwitches.filter(Boolean).length;
      if (activeCount === 1) {
        setElzzupComment('I wouldn’t press that.');
        sound.playGlitch(soundEnabled, 0.3);
      } else if (activeCount === 2) {
        setElzzupComment('Did you actually think I’d make it that obvious?');
        setInterferenceActive(true);
        sound.playGlitch(soundEnabled, 0.5);

        // Elzzup attempts to reset a switch after 1.4s unless player engages the LOCK
        const t = window.setTimeout(() => {
          setSwitches((curr) => {
            if (isLocked) return curr;
            const reverted = [...curr];
            reverted[0] = false;
            return reverted;
          });
          setInterferenceActive(false);
        }, 1400);
        timersRef.current.push(t);
      } else if (activeCount === 3 && !isLocked) {
        // Attempted 3 without locking -> Elzzup disrupts
        setInterferenceActive(true);
        sound.playGlitch(soundEnabled, 0.7);
        const t = window.setTimeout(() => {
          setSwitches([false, false, false]);
          setInterferenceActive(false);
          onTroll(
            'Interference Overload',
            'ELZZUP reset the unsecured relays. You must ENGAGE THE OVERRIDE LOCK while switches are active.',
            'ERR_ELZZUP_RESET'
          );
        }, 600);
        timersRef.current.push(t);
      }
    }
  };

  const handleToggleLock = () => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);

    const nextLock = !isLocked;
    setIsLocked(nextLock);

    const activeCount = switches.filter(Boolean).length;
    if (nextLock && activeCount === 3) {
      // Perfect execution!
      setIsProcessing(true);
      setElzzupComment('HEY! Stop locking my controls!');
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        onSuccess(
          'Interference Outsmarted.',
          'You bypassed ELZZUP’s active disruptions by latching the override.'
        );
      }, 700);
      timersRef.current.push(t);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* Elzzup Hologram & Interference Banner */}
      <div className="flex items-center gap-2 mb-3 bg-[#120820] border-3 border-[#ff4444] px-3.5 py-2 shadow-[3px_3px_0_0_#000] max-w-md w-full justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 shrink-0">
            <Logo size="sm" mood="glitched" isCorrupted={true} animated={false} />
          </div>
          <span className="font-dialogue text-xs sm:text-sm font-bold text-[#ff8888]">
            "{elzzupComment || 'ELZZUP IS ACTIVELY CORRUPTING THIS PANEL'}"
          </span>
        </div>
        {interferenceActive && (
          <span className="font-mono text-xs bg-[#ff4444] text-black px-2 py-0.5 font-black uppercase animate-pulse border border-black">
            INTERFERING
          </span>
        )}
      </div>

      {/* Main Console Box */}
      <div
        className={`bg-[#1a1a3a] border-4 sm:border-6 border-black p-5 sm:p-7 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-md w-full transition-all ${
          interferenceActive ? 'border-[#ff4444] animate-pulse' : ''
        }`}
      >
        <div className="w-full flex items-center justify-between border-b-3 border-black pb-3 mb-4">
          <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] font-black uppercase flex items-center gap-2">
            <Zap size={16} />
            <span>TRIPLE BYPASS MATRIX</span>
          </div>
          <div className="font-mono text-xs text-[#a0a0d0] font-bold uppercase bg-black/80 px-2 py-0.5 border border-black">
            ACTIVE: {switches.filter(Boolean).length}/3
          </div>
        </div>

        {/* 3 Switches */}
        <div className="grid grid-cols-3 gap-3 w-full mb-4">
          {['ALPHA', 'BETA', 'GAMMA'].map((label, idx) => {
            const isOn = switches[idx];
            return (
              <button
                key={label}
                disabled={isLocked || isProcessing}
                onClick={() => handleToggleSwitch(idx)}
                className={`h-20 border-3 border-black font-mono flex flex-col items-center justify-center p-2 shadow-[3px_3px_0_0_#000] transition-all cursor-pointer ${
                  isOn
                    ? 'bg-[#44ff44] text-black hover:bg-[#66ff66]'
                    : 'bg-[#2a2a4a] text-[#a0a0d0] hover:bg-[#3a3a5a]'
                } ${isLocked ? 'cursor-default opacity-90' : 'active:translate-y-0.5'}`}
              >
                <span className="text-xs font-black">{label}</span>
                <span className="text-[10px] font-bold mt-1">
                  [{isOn ? 'ENGAGED' : 'OFF'}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Override Lock Button */}
        <button
          disabled={isProcessing}
          onClick={handleToggleLock}
          className={`w-full py-2.5 border-3 border-black font-heading font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-2 transition-all ${
            isLocked
              ? 'bg-[#ffdd00] hover:bg-[#ffee44] text-black'
              : 'bg-[#2a2a4a] hover:bg-[#3a3a5a] text-[#f0f0ff]'
          }`}
        >
          {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
          {isLocked ? 'OVERRIDE LATCH: ENGAGED [LOCKED]' : 'ENGAGE OVERRIDE LATCH [FREEZE]'}
        </button>

        <div className="mt-4 font-mono text-[9px] text-[#a0a0d0] uppercase tracking-wider text-center">
          Tip: Activate all 3 relays and lock them before ELZZUP reverts the matrix.
        </div>
      </div>
    </div>
  );
};
