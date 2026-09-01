import React, { useState, useRef, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Grid, Eye, CheckCircle2, RotateCw } from 'lucide-react';

interface ConduitNode {
  id: number;
  rotation: number; // 0, 90, 180, 270
  targetRotation: number;
}

export const Room18: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // 4 Rotatable conduit nodes in a 2x2 grid
  const [nodes, setNodes] = useState<ConduitNode[]>([
    { id: 0, rotation: 90, targetRotation: 0 },
    { id: 1, rotation: 180, targetRotation: 90 },
    { id: 2, rotation: 270, targetRotation: 270 },
    { id: 3, rotation: 0, targetRotation: 180 },
  ]);

  const [filterActive, setFilterActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleRotateNode = (index: number) => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);

    setNodes((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        rotation: (updated[index].rotation + 90) % 360,
      };
      return updated;
    });
  };

  const isPowerFlowing = nodes.every(
    (n) => n.rotation === n.targetRotation || (n.rotation % 180 === n.targetRotation % 180 && n.id !== 1)
  );

  const handleToggleFilter = () => {
    sound.playClick(soundEnabled);
    setFilterActive(!filterActive);
  };

  const handleCommitBypass = () => {
    if (isProcessing) return;
    sound.playClick(soundEnabled);
    setIsProcessing(true);

    if (isPowerFlowing && filterActive) {
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        onSuccess(
          'Sub-Core Matrix Harmonized.',
          'Conduit flow aligned and spectral glyph verified.'
        );
      }, 700);
      timersRef.current.push(t);
    } else if (!isPowerFlowing) {
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        onTroll(
          'Power Grid Open Circuit',
          'The 4 conduit junctions must form a continuous channel from INPUT (Left) to OUTPUT (Right).',
          'ERR_GRID_DISCONNECT'
        );
      }, 700);
      timersRef.current.push(t);
    } else {
      sound.playGlitch(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        onTroll(
          'Unverified Matrix',
          'Power is flowing, but you must activate the SPECTRAL LENS to authenticate the sub-core glyph.',
          'ERR_UNVERIFIED_GLYPH'
        );
      }, 700);
      timersRef.current.push(t);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* Header telemetry */}
      <div className="flex items-center justify-between max-w-md w-full mb-3 px-1">
        <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] tracking-wider uppercase font-bold flex items-center gap-1.5 bg-[#0c0c1e] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <Grid size={15} className="text-[#ffdd00]" />
          <span>CHAMBER 18: MATRIX</span>
        </div>

        <button
          onClick={handleToggleFilter}
          className={`px-3 py-1.5 border-2 border-black font-pixel text-xs font-black uppercase flex items-center gap-1.5 shadow-[3px_3px_0_0_#000] cursor-pointer transition-all active:translate-y-0.5 ${
            filterActive
              ? 'bg-[#44ff44] text-black'
              : 'bg-[#2a2a4a] text-[#f0f0ff] hover:bg-[#3a3a6a]'
          }`}
        >
          <Eye size={13} />
          <span>LENS: {filterActive ? 'SPECTRUM' : 'STANDARD'}</span>
        </button>
      </div>

      {/* Main Matrix Box */}
      <div className="bg-[#1a1a3a] border-4 sm:border-6 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-md w-full">
        {/* Status Indicator */}
        <div className="w-full flex items-center justify-between border-b-3 border-black pb-2.5 mb-3.5">
          <span className="font-pixel text-xs text-[#ffdd00] font-black uppercase">
            CIRCUIT: {isPowerFlowing ? 'CONNECTED [ONLINE]' : 'BROKEN LOOP'}
          </span>
          <span
            className={`w-3.5 h-3.5 rounded-full border border-black ${
              isPowerFlowing ? 'bg-[#44ff44] animate-pulse' : 'bg-[#ff4444]'
            }`}
          />
        </div>

        {/* 2x2 Rotatable Conduit Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-black/70 border-2 border-black mb-4">
          {nodes.map((node, idx) => (
            <button
              key={node.id}
              disabled={isProcessing}
              onClick={() => handleRotateNode(idx)}
              className={`w-20 h-20 sm:w-24 sm:h-24 border-2 border-black flex flex-col items-center justify-center p-1 shadow-[2px_2px_0_0_#000] cursor-pointer transition-transform duration-150 active:scale-95 ${
                isPowerFlowing ? 'bg-[#2a3a2a]' : 'bg-[#2a2a4a] hover:bg-[#3a3a5a]'
              }`}
            >
              <div
                className="w-12 h-12 flex items-center justify-center transition-transform duration-200"
                style={{ transform: `rotate(${node.rotation}deg)` }}
              >
                {/* Conduit graphic */}
                <div
                  className={`w-full h-3.5 border border-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] ${
                    isPowerFlowing ? 'bg-[#44ff44]' : 'bg-[#ffdd00]'
                  }`}
                />
              </div>
              <span className="font-mono text-[8px] text-[#a0a0d0] mt-1 flex items-center gap-0.5">
                <RotateCw size={8} /> {node.rotation}°
              </span>
            </button>
          ))}
        </div>

        {/* Spectral Glyph Display (Visible when power is flowing + filter active) */}
        {filterActive && (
          <div className="w-full bg-[#120820] border-2 border-[#44ff44] p-2 mb-3 text-center animate-fadeIn">
            <span className="font-mono text-[10px] text-[#44ff44] font-black uppercase tracking-wider">
              {isPowerFlowing
                ? 'AUTHENTICATED SUB-CORE CIPHER: [ Ω_SIGMA_ONLINE ]'
                : 'WAITING FOR POWER ALIGNMENT...'}
            </span>
          </div>
        )}

        {/* Submit Bypass Action */}
        <button
          disabled={isProcessing}
          onClick={handleCommitBypass}
          className="w-full py-2.5 bg-[#ffdd00] hover:bg-[#ffee44] text-black border-3 border-black font-heading font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={15} />
          EXECUTE MATRIX RECONFIGURATION
        </button>
      </div>
    </div>
  );
};
