import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Scissors, AlertTriangle, FileText } from 'lucide-react';

interface Wire {
  id: string;
  name: string;
  colorHex: string;
  accentHex: string;
  isCorrect: boolean;
  trollTitle: string;
  trollMsg: string;
}

const WIRES: Wire[] = [
  {
    id: 'red',
    name: 'RED WIRE [PRIMARY]',
    colorHex: '#ff4444',
    accentHex: '#ff8888',
    isCorrect: false,
    trollTitle: 'Obvious Trap',
    trollMsg: 'You cut the giant flashing red wire. Did you even glance at the schematic?',
  },
  {
    id: 'blue',
    name: 'BLUE WIRE [BYPASS]',
    colorHex: '#2277ff',
    accentHex: '#66aaff',
    isCorrect: true,
    trollTitle: '',
    trollMsg: '',
  },
  {
    id: 'green',
    name: 'GREEN WIRE [AUX]',
    colorHex: '#22cc55',
    accentHex: '#66ee88',
    isCorrect: false,
    trollTitle: 'Auxiliary Cut',
    trollMsg: 'Auxiliary loop severed. System locked down.',
  },
  {
    id: 'yellow',
    name: 'YELLOW WIRE [GRID]',
    colorHex: '#ffdd00',
    accentHex: '#ffee88',
    isCorrect: false,
    trollTitle: 'Power Surge',
    trollMsg: 'Cutting live grid line triggered facility backup.',
  },
];

export const Room12: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [cutWires, setCutWires] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleCutWire = (wire: Wire) => {
    if (isProcessing || cutWires.includes(wire.id)) return;

    sound.playClick(soundEnabled);
    setCutWires((prev) => [...prev, wire.id]);
    setIsProcessing(true);

    if (wire.isCorrect) {
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        onSuccess(
          'Circuit Disarmed.',
          'You actually checked the schematic instead of falling for the flashing red bait.'
        );
      }, 700);
      timersRef.current.push(t);
    } else {
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setCutWires([]);
        onTroll(wire.trollTitle, wire.trollMsg, 'ERR_WIRE_CUT');
      }, 700);
      timersRef.current.push(t);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* High-Contrast Schematic Clue Banner (Visible on all screens) */}
      <div className="w-full max-w-lg bg-[#0c0c1e] border-3 border-[#ffdd00] p-3 mb-3 text-left shadow-[4px_4px_0_0_#000]">
        <div className="font-pixel text-xs text-[#ffdd00] uppercase font-bold flex items-center gap-1.5 mb-1">
          <FileText size={14} className="text-[#ffdd00]" />
          <span>BLUEPRINT SCHEMATIC // JUNCTION #12</span>
        </div>
        <p className="font-mono text-xs text-[#f0f0ff] leading-relaxed">
          <strong className="text-[#ff4444] font-black">CRITICAL:</strong> RED WIRE is wired to emergency alarm triggers.{' '}
          Disarm the power relay safely via the <strong className="text-[#66aaff] font-black underline">BLUE WIRE (GROUND ⏚)</strong>.
        </p>
      </div>

      {/* Main Defusal Junction Box */}
      <div className="bg-[#1a1a3a] border-4 sm:border-6 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-lg w-full">
        <div className="w-full flex items-center justify-between border-b-3 border-black pb-3 mb-4">
          <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] font-black uppercase flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#ff4444] animate-pulse" />
            <span>JUNCTION RELAY 44</span>
          </div>
          <div className="font-mono text-xs bg-[#ff4444] text-black px-2 py-0.5 font-black uppercase animate-pulse border border-black shadow-[2px_2px_0_0_#000]">
            LIVE WIRES
          </div>
        </div>

        {/* Wire Rack */}
        <div className="w-full flex flex-col gap-3 my-2">
          {WIRES.map((wire) => {
            const isCut = cutWires.includes(wire.id);
            const isRedTrap = wire.id === 'red';

            return (
              <div
                key={wire.id}
                className="w-full bg-[#2a2a4a] border-2 border-black p-2 flex items-center justify-between gap-3 shadow-[2px_2px_0_0_#000]"
              >
                {/* Left Wire Visual Terminal */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-4 h-4 rounded-full border-2 border-black bg-black flex items-center justify-center shrink-0">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: wire.colorHex }}
                    />
                  </div>

                  {/* Wire Strand */}
                  <div className="flex-1 h-3 bg-black/60 relative overflow-hidden flex items-center">
                    {isCut ? (
                      <div className="w-full flex justify-between px-1">
                        <div
                          className="h-2 w-1/3 border-r-2 border-black"
                          style={{ backgroundColor: wire.colorHex }}
                        />
                        <div
                          className="h-2 w-1/3 border-l-2 border-black"
                          style={{ backgroundColor: wire.colorHex }}
                        />
                      </div>
                    ) : (
                      <div
                        className={`h-2 w-full transition-all ${
                          isRedTrap ? 'animate-pulse' : ''
                        }`}
                        style={{
                          backgroundColor: wire.colorHex,
                          boxShadow: isRedTrap
                            ? '0 0 8px rgba(255,68,68,0.8)'
                            : undefined,
                        }}
                      />
                    )}
                  </div>

                  <span className="font-mono text-[10px] font-bold text-[#f0f0ff] uppercase w-28 text-left hidden sm:inline">
                    {wire.name}
                  </span>
                </div>

                {/* Snip Action Button */}
                <button
                  disabled={isCut || isProcessing}
                  onClick={() => handleCutWire(wire)}
                  className={`px-3 py-1.5 border-2 border-black font-mono text-[10px] font-extrabold uppercase flex items-center gap-1 shadow-[2px_2px_0_0_#000] cursor-pointer transition-all ${
                    isCut
                      ? 'bg-[#1a1a2a] text-[#555577] shadow-none cursor-default'
                      : 'bg-[#ffdd00] hover:bg-[#ffee44] text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                  }`}
                >
                  <Scissors size={12} />
                  {isCut ? 'SEVERED' : 'SNIP'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Small mobile schematic hint */}
        <div className="mt-3 sm:hidden font-mono text-[9px] text-[#ffdd00] text-center uppercase font-bold">
          [SCHEMATIC: BLUE = ⏚ GROUND DISARM]
        </div>
      </div>
    </div>
  );
};
