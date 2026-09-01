import React, { useState, useEffect } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';

interface SafePosition {
  id: string;
  name: string;
  containerClass: string;
  decorType: 'vent' | 'crate' | 'conduit' | 'pillar' | 'grate' | 'switch' | 'tile' | 'pipe';
}

const SAFE_POSITIONS: SafePosition[] = [
  {
    id: 'top-left',
    name: 'NW SUB-STATION',
    containerClass: 'top-4 left-4 sm:top-8 sm:left-8',
    decorType: 'conduit',
  },
  {
    id: 'top-right',
    name: 'NE VENTILATION',
    containerClass: 'top-4 right-4 sm:top-8 sm:right-8',
    decorType: 'vent',
  },
  {
    id: 'bottom-left',
    name: 'SW CRATE SHADOW',
    containerClass: 'bottom-4 left-4 sm:bottom-8 sm:left-8',
    decorType: 'crate',
  },
  {
    id: 'bottom-right',
    name: 'SE SWITCH ALCOVE',
    containerClass: 'bottom-4 right-4 sm:bottom-8 sm:right-8',
    decorType: 'switch',
  },
  {
    id: 'mid-left',
    name: 'WEST RELAY WALL',
    containerClass: 'top-1/2 -translate-y-1/2 left-3 sm:left-6',
    decorType: 'pillar',
  },
  {
    id: 'mid-right',
    name: 'EAST POWER BEAM',
    containerClass: 'top-1/2 -translate-y-1/2 right-3 sm:right-6',
    decorType: 'pipe',
  },
  {
    id: 'upper-left-flank',
    name: 'NW UPPER CONDUIT',
    containerClass: 'top-1/4 left-3 sm:left-8',
    decorType: 'grate',
  },
  {
    id: 'lower-right-flank',
    name: 'SE LOWER HATCH',
    containerClass: 'bottom-1/4 right-3 sm:right-8',
    decorType: 'tile',
  },
];

export const Room5: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  roomKey,
  soundEnabled,
}) => {
  const [hasDisappeared, setHasDisappeared] = useState(false);
  const [isGhostPressed, setIsGhostPressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [spawnIndex, setSpawnIndex] = useState<number>(0);

  // Pick a random safe spawn position whenever the room initializes or restarts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * SAFE_POSITIONS.length);
    setSpawnIndex(randomIndex);
    setHasDisappeared(false);
    setIsGhostPressed(false);
    setIsProcessing(false);
  }, [roomKey]);

  // When player tries to click/hover the initial button, it vanishes
  const handleInitialInteract = () => {
    if (hasDisappeared || isProcessing) return;
    setHasDisappeared(true);
    sound.playVanish(soundEnabled);
  };

  // Clicking the disguised ghost button solves the puzzle
  const handleGhostClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setIsGhostPressed(true);
    sound.playSuccess(soundEnabled);

    setTimeout(() => {
      onSuccess(
        'Ghost Located.',
        'Sharp observation! The de-materialized node could not escape detection.'
      );
    }, 450);
  };

  const activeSpawn = SAFE_POSITIONS[spawnIndex];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 pixel-tile-bg select-none overflow-hidden">
      {/* Environmental Decorative Pixel Props in Corners to naturally blend props */}
      <div className="absolute top-3 left-3 w-8 h-8 border-2 border-black bg-[#15152a] flex items-center justify-center shadow-[2px_2px_0_0_#000] pointer-events-none opacity-60">
        <div className="w-3 h-3 bg-[#ffdd00]/40 rotate-45" />
      </div>
      <div className="absolute top-3 right-3 w-8 h-8 border-2 border-black bg-[#15152a] flex items-center justify-center shadow-[2px_2px_0_0_#000] pointer-events-none opacity-60">
        <div className="w-4 h-1 bg-[#00f0ff]/40" />
      </div>
      <div className="absolute bottom-3 left-3 w-8 h-8 border-2 border-black bg-[#15152a] flex items-center justify-center shadow-[2px_2px_0_0_#000] pointer-events-none opacity-60">
        <div className="w-2 h-4 bg-[#ff4444]/40" />
      </div>
      <div className="absolute bottom-3 right-3 w-8 h-8 border-2 border-black bg-[#15152a] flex items-center justify-center shadow-[2px_2px_0_0_#000] pointer-events-none opacity-60">
        <div className="w-3 h-3 bg-[#44ff44]/40" />
      </div>

      {/* Center Interactive Pedestal */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Top Warning Banner */}
        <div className="mb-4 px-4 py-1.5 bg-black/80 border-2 border-black font-mono text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
          <span
            className={`w-2 h-2 rotate-45 ${
              hasDisappeared ? 'bg-[#ff4444] animate-ping' : 'bg-[#ffdd00]'
            }`}
          />
          <span className="font-bold text-[#f0f0ff]">
            {hasDisappeared
              ? 'ANOMALY: OBJECT RELOCATED IN CHAMBER'
              : 'PRIMARY TARGET // UNIT_05'}
          </span>
        </div>

        {/* Main Pedestal Container */}
        <div className="relative p-6 sm:p-8 bg-[#2a2a4a] border-8 border-black shadow-[0_12px_0_0_#000] flex items-center justify-center min-w-[200px] min-h-[160px]">
          <div className="absolute inset-2 border-2 border-black pointer-events-none" />

          {/* 1. VISIBLE BUTTON (Disappears on pointer / hover / click) */}
          {!hasDisappeared ? (
            <button
              onClick={handleInitialInteract}
              onMouseEnter={handleInitialInteract}
              onTouchStart={handleInitialInteract}
              title="Press to solve"
              className="
                group relative select-none cursor-pointer
                w-28 h-28 sm:w-36 sm:h-36
                bg-[#ff4444] hover:bg-[#ff6666]
                border-8 border-black
                flex flex-col items-center justify-center
                transition-all duration-150 ease-out
                shadow-[0_12px_0_0_#990000,0_16px_0_0_#000]
                hover:-translate-y-1 hover:shadow-[0_14px_0_0_#990000,0_18px_0_0_#000]
              "
            >
              <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 pointer-events-none" />
              <div className="relative z-10 font-heading font-extrabold text-xs sm:text-sm text-white tracking-widest uppercase text-center drop-shadow-[0_2px_0_#000]">
                PRESS ME
              </div>
              <div className="absolute bottom-2 font-mono text-[8px] sm:text-[9px] text-white/80 uppercase tracking-widest font-bold">
                [BUTTON]
              </div>
            </button>
          ) : (
            /* Empty Pedestal Silhouette */
            <div
              onClick={() => {
                onTroll(
                  'It vanished, remember?',
                  'Clicking empty air will not bring the button back. Look around the room!',
                  'ERR_TARGET_MISSING'
                );
              }}
              className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-dashed border-[#555577]/50 flex flex-col items-center justify-center bg-black/30 p-2 text-center cursor-pointer hover:border-red-500 transition-colors"
            >
              <span className="font-mono text-[9px] sm:text-[10px] text-[#ff6666] font-bold tracking-wider uppercase mb-1 animate-pulse">
                [EMPTY]
              </span>
              <span className="font-mono text-[8px] text-[#777799] uppercase">
                TARGET DISPLACED
              </span>
            </div>
          )}
        </div>

        {/* Pedestal Footing */}
        <div className="w-56 sm:w-64 h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
      </div>

      {/* 2. THE GHOST BUTTON — Spawns at one of 8 predefined safe positions */}
      {hasDisappeared && (
        <div className={`absolute z-30 ${activeSpawn.containerClass}`}>
          <button
            onClick={handleGhostClick}
            disabled={isProcessing}
            title="Investigate anomaly"
            className={`
              group relative select-none cursor-pointer
              w-14 h-14 sm:w-16 sm:h-16
              border-4 border-black
              flex flex-col items-center justify-center
              transition-all duration-150
              ${
                isGhostPressed
                  ? 'bg-[#ffdd00] border-black scale-95 shadow-[0_0_20px_#ffdd00]'
                  : 'bg-[#222244]/80 hover:bg-[#ffdd00]/30 border-dashed border-[#a0a0d0]/60 hover:border-[#ffdd00] shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000]'
              }
            `}
          >
            {/* Subtle pixel camouflage details */}
            <div className="absolute inset-1 border border-white/10 pointer-events-none" />

            {/* Faint holographic pixel icon */}
            <div className="w-4 h-4 bg-[#ffdd00]/50 border border-black/40 rotate-45 group-hover:bg-[#ffdd00] group-hover:rotate-90 transition-transform duration-200" />

            {/* Small subtle label */}
            <span className="mt-1 font-mono text-[7px] font-bold text-[#ffdd00]/80 group-hover:text-[#ffdd00] uppercase tracking-tighter">
              {isGhostPressed ? 'FOUND' : '???'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
