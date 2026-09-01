import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Key, Radio, Check, Layers, Zap, AlertTriangle, FileText } from 'lucide-react';

interface RelayBreaker {
  id: string;
  keyNum: string;
  name: string;
  nominalVoltage: number;
  actualVoltage: number;
  description: string;
}

const STAGE1_RELAYS: RelayBreaker[] = [
  {
    id: 'alpha',
    keyNum: '1',
    name: 'ALPHA GENERATOR',
    nominalVoltage: 30,
    actualVoltage: 30,
    description: '+30V Direct Feed',
  },
  {
    id: 'beta',
    keyNum: '2',
    name: 'BETA INVERTER',
    nominalVoltage: -20,
    actualVoltage: 20, // TRICK: The kernel inverted it, so it actually yields +20V!
    description: 'Inverted by Kernel: +20V',
  },
  {
    id: 'gamma',
    keyNum: '3',
    name: 'GAMMA DAMPENER',
    nominalVoltage: -50,
    actualVoltage: -50,
    description: '-50V Ground Shunt',
  },
];

export const Room16: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // Stage 1 State: Relays active state
  const [activeRelays, setActiveRelays] = useState<{ [key: string]: boolean }>({
    alpha: false,
    beta: false,
    gamma: false,
  });
  const [hasKey, setHasKey] = useState(false);

  // Stage 2 State: Harmonic tuning sequence
  const [breakerSequence, setBreakerSequence] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Compute Net Voltage
  const currentNetVoltage =
    (activeRelays.alpha ? STAGE1_RELAYS[0].actualVoltage : 0) +
    (activeRelays.beta ? STAGE1_RELAYS[1].actualVoltage : 0) +
    (activeRelays.gamma ? STAGE1_RELAYS[2].actualVoltage : 0);

  // Toggle Relay (Stage 1)
  const handleToggleRelay = useCallback(
    (id: string) => {
      if (hasKey || isProcessing) return;
      sound.playClick(soundEnabled);
      setActiveRelays((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    },
    [hasKey, isProcessing, soundEnabled]
  );

  // Commit Stage 1 Interlock
  const handleCommitInterlock = () => {
    if (hasKey || isProcessing) return;
    sound.playClick(soundEnabled);
    setIsProcessing(true);

    // Correct Solution: All three active (Alpha +30V, Beta +20V, Gamma -50V => Net 0V)
    if (activeRelays.alpha && activeRelays.beta && activeRelays.gamma) {
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setHasKey(true);
      }, 700);
      timersRef.current.push(t);
    } else {
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        onTroll(
          'Voltage Imbalance Detected',
          `Interlock rejected net voltage of ${currentNetVoltage}V. Read the schematic: Beta Inverter polarity adds +20V. Net must equal 0V.`,
          'ERR_VOLTAGE_IMBALANCE'
        );
      }, 700);
      timersRef.current.push(t);
    }
  };

  // Tune Harmonic Resonator (Stage 2)
  const handleTuneBreaker = useCallback(
    (id: string) => {
      if (!hasKey || isProcessing) return;
      sound.playClick(soundEnabled);

      const nextSeq = [...breakerSequence, id];
      setBreakerSequence(nextSeq);

      // Correct Harmonic Reverse Order: ['gamma', 'beta', 'alpha']
      const TARGET = ['gamma', 'beta', 'alpha'];
      const curIdx = nextSeq.length - 1;

      if (nextSeq[curIdx] !== TARGET[curIdx]) {
        setIsProcessing(true);
        sound.playGlitch(soundEnabled);
        const t = window.setTimeout(() => {
          setIsProcessing(false);
          setBreakerSequence([]);
          onTroll(
            'Harmonic Surge Reflection',
            'Harmonic resonance must discharge from peak frequency to ground (Gamma 300MHz → Beta 200MHz → Alpha 100MHz).',
            'ERR_HARMONIC_ORDER'
          );
        }, 700);
        timersRef.current.push(t);
        return;
      }

      if (nextSeq.length === 3) {
        setIsProcessing(true);
        sound.playSuccess(soundEnabled);
        const t = window.setTimeout(() => {
          onSuccess(
            'Dual-Tier Bypass Synchronized.',
            'Magnetic interlock balanced and reverse harmonic frequencies calibrated.'
          );
        }, 800);
        timersRef.current.push(t);
      }
    },
    [breakerSequence, hasKey, isProcessing, onSuccess, onTroll, soundEnabled]
  );

  // Keyboard Shortcuts for PC players (1, 2, 3 / A, B, C / Space / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProcessing) return;

      const key = e.key.toLowerCase();

      if (!hasKey) {
        // Stage 1 controls
        if (key === '1' || key === 'a') {
          handleToggleRelay('alpha');
        } else if (key === '2' || key === 'b') {
          handleToggleRelay('beta');
        } else if (key === '3' || key === 'c') {
          handleToggleRelay('gamma');
        } else if (key === 'enter' || key === ' ') {
          handleCommitInterlock();
        }
      } else {
        // Stage 2 controls
        if (key === '1' || key === 'a') {
          if (!breakerSequence.includes('alpha')) handleTuneBreaker('alpha');
        } else if (key === '2' || key === 'b') {
          if (!breakerSequence.includes('beta')) handleTuneBreaker('beta');
        } else if (key === '3' || key === 'c' || key === 'g') {
          if (!breakerSequence.includes('gamma')) handleTuneBreaker('gamma');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    breakerSequence,
    handleCommitInterlock,
    handleToggleRelay,
    handleTuneBreaker,
    hasKey,
    isProcessing,
  ]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 select-none">
      {/* Header Telemetry */}
      <div className="w-full max-w-xl flex items-center justify-between mb-3 px-1">
        <div className="font-pixel text-xs sm:text-sm text-[#a0a0d0] tracking-wider uppercase font-bold flex items-center gap-2">
          <Layers size={16} className="text-[#ffdd00]" />
          <span>CHAMBER 16: DUAL-TIER BYPASS</span>
        </div>
        <div className="font-mono text-xs text-[#ffdd00] bg-black/80 border-2 border-black px-2.5 py-0.5 font-bold">
          PC CONTROLS: MOUSE / KEYS [1-3]
        </div>
      </div>

      {/* Main Console Box */}
      <div className="bg-[#1a1a3a] border-4 sm:border-6 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-xl w-full">
        {/* Stage Status Header */}
        <div className="w-full flex items-center justify-between border-b-3 border-black pb-3 mb-4">
          <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] font-black uppercase flex items-center gap-2">
            <Radio size={16} />
            <span>
              {hasKey
                ? 'STAGE 2: HARMONIC RESONANCE'
                : 'STAGE 1: MAGNETIC INTERLOCK'}
            </span>
          </div>
          <div
            className={`font-mono text-xs px-2.5 py-1 border-2 border-black font-bold uppercase flex items-center gap-1.5 shadow-[2px_2px_0_0_#000] ${
              hasKey
                ? 'bg-[#44ff44] text-black animate-pulse'
                : 'bg-[#ffdd00] text-black'
            }`}
          >
            <Key size={13} />
            <span>{hasKey ? 'BYPASS KEY: INSERTED ✓' : 'KEY: LOCKED'}</span>
          </div>
        </div>

        {/* ---------------- STAGE 1: MAGNETIC INTERLOCK ---------------- */}
        {!hasKey ? (
          <div className="w-full flex flex-col items-center">
            {/* High-Contrast Schematic Blueprint Box */}
            <div className="w-full bg-[#0c0c1e] border-3 border-[#ffdd00] p-3 mb-4 shadow-[4px_4px_0_0_#000]">
              <div className="font-pixel text-xs text-[#ffdd00] uppercase font-bold flex items-center gap-1.5 mb-1.5">
                <FileText size={14} className="text-[#ffdd00]" />
                <span>SCHEMATIC DIRECTIVE // VOLTAGE ZERO-SUM</span>
              </div>
              <p className="font-mono text-xs text-[#f0f0ff] leading-relaxed">
                To release the physical bypass key, balance the net circuit to{' '}
                <strong className="text-[#44ff44] font-black underline">
                  0 VOLTS
                </strong>
                .<br />
                <span className="text-[#ff8888] font-bold">
                  NOTICE: Beta Inverter polarity reversed by kernel (+20V when active).
                </span>
              </p>
            </div>

            {/* Live Voltage Oscilloscope */}
            <div className="w-full bg-black/90 border-3 border-black p-3 mb-4 flex items-center justify-between shadow-[3px_3px_0_0_#000]">
              <div className="flex items-center gap-2">
                <Zap
                  size={18}
                  className={
                    currentNetVoltage === 0
                      ? 'text-[#44ff44] animate-pulse'
                      : 'text-[#ffdd00]'
                  }
                />
                <span className="font-mono text-xs text-[#a0a0d0] font-bold uppercase">
                  NET VOLTAGE:
                </span>
              </div>
              <div
                className={`font-heading font-black text-xl sm:text-2xl tracking-wider ${
                  currentNetVoltage === 0
                    ? 'text-[#44ff44]'
                    : currentNetVoltage > 0
                    ? 'text-[#ffdd00]'
                    : 'text-[#ff4444]'
                }`}
              >
                {currentNetVoltage > 0 ? `+${currentNetVoltage}` : currentNetVoltage} V
              </div>
              <div className="font-mono text-xs text-[#c0c0e8] font-bold">
                [TARGET: 0 V]
              </div>
            </div>

            {/* 3 Interactive Breaker Switches */}
            <div className="grid grid-cols-3 gap-3 w-full mb-4">
              {STAGE1_RELAYS.map((relay) => {
                const isActive = activeRelays[relay.id];
                return (
                  <button
                    key={relay.id}
                    disabled={isProcessing}
                    onClick={() => handleToggleRelay(relay.id)}
                    className={`h-24 sm:h-28 border-3 border-black font-mono flex flex-col items-center justify-between p-2.5 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#ffdd00] text-black'
                        : 'bg-[#2a2a4a] text-[#f0f0ff] hover:bg-[#3a3a6a]'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="font-pixel text-xs bg-black text-[#ffdd00] px-1.5 py-0.5 border border-black font-black">
                        [{relay.keyNum}]
                      </span>
                      <span
                        className={`w-3 h-3 border border-black ${
                          isActive ? 'bg-[#44ff44]' : 'bg-[#ff4444]'
                        }`}
                      />
                    </div>
                    <div className="font-pixel text-xs font-bold text-center leading-tight">
                      {relay.name}
                    </div>
                    <div className="font-mono text-xs font-bold">
                      {isActive ? 'ONLINE' : 'OFFLINE'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Button */}
            <button
              disabled={isProcessing}
              onClick={handleCommitInterlock}
              className="w-full py-3 bg-[#44ff44] hover:bg-[#66ff66] text-black font-heading font-black text-sm sm:text-base uppercase tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Key size={18} />
              <span>ENGAGE INTERLOCK & EJECT KEY</span>
            </button>
          </div>
        ) : (
          /* ---------------- STAGE 2: HARMONIC RESONANCE ---------------- */
          <div className="w-full flex flex-col items-center animate-fadeIn">
            {/* Clue Notice Box */}
            <div className="w-full bg-[#0c0c1e] border-3 border-[#44ff44] p-3 mb-4 shadow-[4px_4px_0_0_#000]">
              <div className="font-pixel text-xs text-[#44ff44] uppercase font-bold flex items-center gap-1.5 mb-1.5">
                <AlertTriangle size={14} className="text-[#44ff44]" />
                <span>DIAGNOSTIC // HARMONIC DISCHARGE LAW</span>
              </div>
              <p className="font-mono text-xs text-[#f0f0ff] leading-relaxed">
                Resonance must discharge from{' '}
                <strong className="text-[#ffdd00] font-black underline">
                  PEAK FREQUENCY TO GROUND
                </strong>
                .<br />
                Discharge order:{' '}
                <span className="text-[#44ff44] font-bold">
                  GAMMA (300 MHz) → BETA (200 MHz) → ALPHA (100 MHz)
                </span>
                .
              </p>
            </div>

            {/* 3 Harmonic Breaker Buttons */}
            <div className="grid grid-cols-3 gap-3 w-full mb-3">
              {[
                {
                  id: 'gamma',
                  keyNum: '3',
                  label: 'GAMMA',
                  freq: '300 MHz',
                  desc: 'PEAK FREQ',
                },
                {
                  id: 'beta',
                  keyNum: '2',
                  label: 'BETA',
                  freq: '200 MHz',
                  desc: 'MID FREQ',
                },
                {
                  id: 'alpha',
                  keyNum: '1',
                  label: 'ALPHA',
                  freq: '100 MHz',
                  desc: 'LOW FREQ',
                },
              ].map((breaker) => {
                const isTuned = breakerSequence.includes(breaker.id);
                return (
                  <button
                    key={breaker.id}
                    disabled={isTuned || isProcessing}
                    onClick={() => handleTuneBreaker(breaker.id)}
                    className={`h-28 sm:h-32 border-4 border-black font-mono flex flex-col items-center justify-between p-2.5 shadow-[4px_4px_0_0_#000] transition-all cursor-pointer ${
                      isTuned
                        ? 'bg-[#44ff44] text-black shadow-none cursor-default'
                        : 'bg-[#ffdd00] hover:bg-[#ffee44] text-black active:translate-y-1 active:shadow-none'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="font-pixel text-xs bg-black text-[#ffdd00] px-1.5 py-0.5 border border-black font-black">
                        [{breaker.keyNum}]
                      </span>
                      {isTuned ? (
                        <Check size={16} className="text-black stroke-[3]" />
                      ) : (
                        <Radio size={14} className="text-black animate-pulse" />
                      )}
                    </div>
                    <div className="font-heading font-black text-sm sm:text-base">
                      {breaker.label}
                    </div>
                    <div className="font-mono text-xs font-black">
                      {breaker.freq}
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs font-bold text-black/80">
                      {isTuned ? 'DISCHARGED ✓' : breaker.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="font-mono text-xs text-[#a0a0d0] font-bold text-center mt-2">
              DISCHARGED: {breakerSequence.length}/3 RESONATORS
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
