import React from 'react';
import { Pause, RotateCcw } from 'lucide-react';
import { Logo, MascotMood } from './Logo';

interface RoomHeaderProps {
  roomId: number;
  chapterId: number;
  chapterTitle: string;
  elapsedSeconds: number;
  onPause: () => void;
  onRestart: () => void;
  isGlitching?: boolean;
  mascotMood?: MascotMood;
  elzzupReaction?: string | null;
  onMascotPoke?: () => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomId,
  chapterId,
  chapterTitle,
  elapsedSeconds,
  onPause,
  onRestart,
  isGlitching = false,
  mascotMood = 'smug',
  elzzupReaction = null,
  onMascotPoke,
}) => {
  const formattedRoomId = roomId.toString().padStart(2, '0');
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 border-b-4 border-black bg-[#1a1a3a] z-20 gap-3">
      {/* 1. Primary Room & Chapter Identity + Mascot Reaction */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        {/* ELZZUP Living Mascot Eye/Avatar in HUD */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={onMascotPoke}
            title="ELZZUP is watching"
            className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2a2a4a] border-2 border-black p-0.5 shadow-[2px_2px_0_0_#000] hover:bg-[#3a3a6a] active:scale-95 transition-all cursor-pointer relative shrink-0"
          >
            <div className="w-full h-full">
              <Logo
                size="sm"
                animated={false}
                mood={mascotMood}
                isCorrupted={isGlitching}
                className="!w-full !h-full"
              />
            </div>
          </button>

          {/* Crisp, Subtle Speech Reaction Bubble */}
          {elzzupReaction && (
            <div className="animate-fadeIn font-mono text-[10px] sm:text-xs font-bold text-[#ffdd00] bg-black/95 border-2 border-[#ffdd00] px-2 sm:px-2.5 py-0.5 shadow-[2px_2px_0_0_#000] tracking-wider whitespace-nowrap flex items-center gap-1.5 z-30">
              <span className="w-1.5 h-1.5 bg-[#ffdd00] rotate-45 shrink-0" />
              <span>"{elzzupReaction}"</span>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] sm:text-xs text-[#a0a0d0] uppercase tracking-widest font-bold">
            FLOOR
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#ffdd00] tracking-tighter uppercase drop-shadow-[2px_2px_0_#000]">
            {formattedRoomId}
          </h1>
        </div>

        <div className="h-6 w-0.5 bg-black hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] sm:text-xs text-black font-extrabold uppercase tracking-wider bg-[#ffdd00] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]">
            CH.{chapterId}
          </span>
          <span className="font-mono text-xs sm:text-sm text-[#c0c0e8] font-medium tracking-wide">
            "{chapterTitle}"
          </span>
        </div>
      </div>

      {/* 2. Status & Controls (Secondary HUD) */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-black/60 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <span
            className={`w-2 h-2 rotate-45 ${
              isGlitching ? 'bg-[#ff4444] animate-ping' : 'bg-[#44ff44]'
            }`}
          />
          <span className="font-mono text-[10px] sm:text-xs text-[#a0a0d0] tracking-wider uppercase font-bold">
            {isGlitching ? 'GLITCHED' : 'ONLINE'}
          </span>
        </div>

        {/* Timer Badge */}
        <div className="font-mono text-xs text-[#f0f0ff] bg-[#2a2a4a] border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">
          <span className="text-[#a0a0d0] mr-1">T:</span>
          <span className="text-[#ffdd00] font-bold tracking-wider">{minutes}:{seconds}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRestart}
            title="Restart Floor"
            className="p-1.5 sm:p-2 bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#f0f0ff] hover:text-[#ffdd00] border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={onPause}
            title="Pause Protocol"
            className="p-1.5 sm:p-2 bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#f0f0ff] hover:text-[#ffdd00] border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Pause size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

