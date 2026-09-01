import React from 'react';
import { Logo } from './Logo';
import { PixelButton } from './PixelButton';
import { Play, RotateCcw, Settings as SettingsIcon, BookOpen } from 'lucide-react';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onOpenKnowHow: () => void;
  onOpenSettings: () => void;
  hasSavedProgress: boolean;
  highestCompletedRoom: number;
  soundEnabled: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onContinue,
  onOpenKnowHow,
  onOpenSettings,
  hasSavedProgress,
  highestCompletedRoom,
  soundEnabled,
}) => {
  return (
    <div className="relative w-full max-w-[1100px] min-h-[520px] sm:min-h-[580px] md:min-h-[640px] bg-[#1a1a3a] border-6 sm:border-8 border-black shadow-[0_12px_0_0_#000] flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden pixel-facility-wall">
      {/* Background Pixel Environmental Scene */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Conduit & Brackets */}
        <div className="absolute top-0 left-0 right-0 pixel-conduit-h opacity-70" />
        <div className="absolute top-0 left-16 w-2 h-3 bg-[#ffdd00]/30 border-x border-black" />
        <div className="absolute top-0 right-16 w-2 h-3 bg-[#ffdd00]/30 border-x border-black" />

        {/* Ambient Corner Vents */}
        <div className="absolute top-6 left-6 w-16 h-10 pixel-vent-grate opacity-40 hidden sm:block" />
        <div className="absolute top-6 right-6 w-16 h-10 pixel-vent-grate opacity-40 hidden sm:block" />

        {/* Ambient Corner LEDs */}
        <div className="absolute top-6 right-28 flex gap-1.5 p-1 bg-black/60 border border-black hidden sm:flex">
          <div className="w-1.5 h-1.5 bg-[#44ff44] animate-led-slow" />
          <div className="w-1.5 h-1.5 bg-[#ffdd00] animate-led-fast" />
        </div>

        {/* Grounded Floor Depth */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pixel-chamber-floor opacity-80 border-t-2 border-black/80" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg w-full py-4">
        {/* Central Logo */}
        <div className="relative mb-3 group cursor-pointer">
          <Logo size="lg" animated={true} />
          {/* Subtle glitch hover text */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold tracking-widest text-[#ffdd00] opacity-0 group-hover:opacity-100 transition-opacity uppercase">
            [ E L Z Z U P ]
          </div>
        </div>

        {/* Subtitle Banner */}
        <div className="relative inline-block mb-6 sm:mb-8 group">
          <div className="font-mono font-bold text-xs sm:text-sm text-[#f0f0ff] tracking-[0.15em] uppercase px-4 sm:px-6 py-2 bg-[#2a2a4a] border-3 sm:border-4 border-black shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000]">
            Something is wrong with this puzzle game.
          </div>
          <div className="absolute inset-0 bg-[#ff4444] mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none animate-pulse" />
        </div>

        {/* Menu Interactive Buttons */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm">
          {/* New Game Button */}
          <PixelButton
            variant="primary"
            size="lg"
            fullWidth
            soundEnabled={soundEnabled}
            onClick={onNewGame}
            icon={<Play size={20} className="fill-current text-black" />}
          >
            New Game
          </PixelButton>

          {/* Continue Button */}
          <PixelButton
            variant="neutral"
            size="lg"
            fullWidth
            disabled={!hasSavedProgress}
            soundEnabled={soundEnabled}
            onClick={onContinue}
            icon={<RotateCcw size={18} />}
          >
            Continue {hasSavedProgress && `(Room ${Math.min(highestCompletedRoom + 1, 20)})`}
          </PixelButton>

          {/* Know-How / How To Play Button */}
          <PixelButton
            variant="neutral"
            size="md"
            fullWidth
            soundEnabled={soundEnabled}
            onClick={onOpenKnowHow}
            icon={<BookOpen size={18} className="text-[#ffdd00]" />}
          >
            Know-How
          </PixelButton>

          {/* Settings Button */}
          <PixelButton
            variant="neutral"
            size="md"
            fullWidth
            soundEnabled={soundEnabled}
            onClick={onOpenSettings}
            icon={<SettingsIcon size={18} />}
          >
            Settings
          </PixelButton>
        </div>

        {/* Troll teaser tip */}
        <div className="mt-6 text-[10px] sm:text-[11px] font-mono text-[#a0a0d0] tracking-wider uppercase flex items-center gap-2 font-bold bg-black/50 px-3 sm:px-4 py-1.5 border border-black shadow-[2px_2px_0_0_#000]">
          <div className="w-2 h-2 bg-[#ffdd00] rotate-45" />
          <span>Tip: Read every instruction carefully. Or don't.</span>
        </div>
      </div>
    </div>
  );
};
