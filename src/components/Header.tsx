import React from 'react';
import { Settings, Volume2, VolumeX, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';
import { ScreenState } from '../types';

interface HeaderProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onOpenSettings: () => void;
  onResetRoom?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isGlitching?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  onResetRoom,
  soundEnabled,
  onToggleSound,
  isGlitching = false,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#1a1a3a] border-b-4 border-black shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
      <div className="max-w-[1200px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('main-menu')}
          className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          title="Return to Main Menu"
        >
          {/* Pixel Mascot Emblem */}
          <div className="w-9 h-9 flex items-center justify-center bg-[#2a2a4a] border-2 border-black shadow-[2px_2px_0_0_#000] p-0.5 group-hover:bg-[#3a3a6a] transition-colors">
            <div className="w-full h-full">
              <Logo size="sm" animated={false} isCorrupted={isGlitching} className="!w-full !h-full" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#ffdd00] tracking-widest uppercase drop-shadow-[2px_2px_0_#000] group-hover:text-[#fff380] transition-colors">
              ELZZUP
            </span>
            <span className="text-[9px] font-mono text-[#a0a0d0] tracking-wider uppercase -mt-1 hidden sm:block">
              REVERSE PROTOCOL ACTIVE
            </span>
          </div>
        </button>

        {/* Navigation / Quick Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#f0f0ff] hover:text-[#ffdd00] border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-[#ff4444]" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#f0f0ff] bg-[#2a2a4a] hover:bg-[#3a3a6a] hover:text-[#ffdd00] border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            title="Open Settings"
          >
            <Settings size={14} />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {currentScreen === 'game' && (
            <button
              onClick={() => onNavigate('main-menu')}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#ff4444] hover:bg-[#ff6666] border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              title="Quit to Menu"
            >
              <Home size={14} />
              <span className="hidden sm:inline">Menu</span>
            </button>
          )}

          {/* System Status Indicator */}
          <div className="flex items-center gap-2 bg-black/60 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
            <div className={`w-2.5 h-2.5 rounded-none ${isGlitching ? 'bg-[#ff4444] animate-ping' : 'bg-[#44ff44]'}`} />
            <span className="font-mono text-[10px] text-[#a0a0d0] tracking-wider uppercase hidden sm:inline font-bold">
              {isGlitching ? 'ERR_0x99' : 'ONLINE'}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
};
