import React from 'react';
import { PauseCircle, Play, RotateCcw, Volume2, VolumeX, Music, AlertTriangle, X } from 'lucide-react';
import { GameSettings } from '../types';
import { sound } from '../audio';

interface PauseOverlayProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  isOpen,
  onResume,
  onRestart,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !settings.sound;
    onUpdateSettings({ sound: next });
    if (next) sound.playClick(true);
  };

  const handleToggleMusic = () => {
    const next = !settings.music;
    onUpdateSettings({ music: next });
    if (next) {
      sound.startMusic(true, settings.masterVol);
    } else {
      sound.stopMusic();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    onUpdateSettings({ masterVol: vol });
    sound.updateMusicVolume(vol);
  };

  const handleConfirmReset = () => {
    if (window.confirm('WARNING: Are you sure you want to reset all game progress? This cannot be undone.')) {
      onResetProgress();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e18]/85 backdrop-blur-sm animate-fade-in">
      {/* Click outside to resume */}
      <div className="absolute inset-0" onClick={onResume} />

      {/* Main Pause Dialog Modal */}
      <div className="relative z-10 w-full max-w-[480px] max-h-[92vh] overflow-y-auto bg-[#1a1a3a] border-6 sm:border-8 border-black p-1 shadow-[0_12px_0_0_#000]">
        <div className="border-2 border-black p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 relative bg-[#2a2a4a]">
          {/* Header Banner */}
          <div className="bg-[#ffdd00] text-black -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-4 mb-2 flex items-center justify-between border-b-4 border-black">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter uppercase drop-shadow-[1px_1px_0_#fff]">
                Paused?
              </h2>
            </div>
            <button
              onClick={onResume}
              className="text-black hover:text-[#3a3a6a] transition-colors cursor-pointer p-1"
              title="Close"
            >
              <PauseCircle size={28} />
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            {/* Resume */}
            <button
              onClick={onResume}
              className="group relative w-full bg-[#3a3a6a] border-4 border-black p-4 text-left transition-all hover:bg-[#4a4a8a] hover:text-[#ffdd00] active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_#000] cursor-pointer"
            >
              <div className="font-heading font-bold text-lg text-[#f0f0ff] uppercase tracking-widest flex items-center justify-between z-10 relative group-hover:text-[#ffdd00]">
                <span>Resume</span>
                <Play size={18} className="opacity-0 group-hover:opacity-100 transition-opacity fill-current text-[#ffdd00]" />
              </div>
            </button>

            {/* Restart Room */}
            <button
              onClick={onRestart}
              className="group relative w-full bg-[#3a3a6a] border-4 border-black p-4 text-left transition-all hover:bg-[#4a4a8a] hover:text-[#ffdd00] active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_#000] cursor-pointer"
            >
              <div className="font-heading font-bold text-lg text-[#f0f0ff] uppercase tracking-widest flex items-center justify-between z-10 relative group-hover:text-[#ffdd00]">
                <span>Restart Room</span>
                <RotateCcw size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#ffdd00]" />
              </div>
            </button>
          </div>

          {/* Sys Divider */}
          <div className="w-full flex items-center justify-between my-1">
            <div className="w-[42%] h-1 bg-black" />
            <span className="font-mono text-xs text-[#a0a0d0] uppercase tracking-widest font-bold">SYS</span>
            <div className="w-[42%] h-1 bg-black" />
          </div>

          {/* Settings Section */}
          <div className="flex flex-col gap-4 bg-[#1a1a3a] p-4 border-4 border-black shadow-[2px_2px_0_0_#000]">
            <h3 className="font-heading font-bold text-sm text-[#ffdd00] uppercase tracking-wider border-b-2 border-black pb-2">
              Audio Settings
            </h3>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-[#f0f0ff]">
                {settings.sound ? <Volume2 size={16} className="text-[#ffdd00]" /> : <VolumeX size={16} className="text-[#a0a0d0]" />}
                <span>Sound FX</span>
              </div>
              <button
                onClick={handleToggleSound}
                className={`relative w-14 h-7 border-2 border-black transition-colors cursor-pointer flex items-center p-0.5 ${
                  settings.sound ? 'bg-[#ffdd00]' : 'bg-[#2a2a4a]'
                }`}
              >
                <div
                  className={`w-5 h-5 transition-transform duration-150 border-2 border-black ${
                    settings.sound ? 'translate-x-7 bg-black' : 'translate-x-0 bg-[#a0a0d0]'
                  }`}
                />
              </button>
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-[#f0f0ff]">
                <Music size={16} className={settings.music ? 'text-[#ffdd00]' : 'text-[#a0a0d0]'} />
                <span>Ambient Music</span>
              </div>
              <button
                onClick={handleToggleMusic}
                className={`relative w-14 h-7 border-2 border-black transition-colors cursor-pointer flex items-center p-0.5 ${
                  settings.music ? 'bg-[#ffdd00]' : 'bg-[#2a2a4a]'
                }`}
              >
                <div
                  className={`w-5 h-5 transition-transform duration-150 border-2 border-black ${
                    settings.music ? 'translate-x-7 bg-black' : 'translate-x-0 bg-[#a0a0d0]'
                  }`}
                />
              </button>
            </div>

            {/* Master Volume Slider */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex justify-between items-center text-xs font-mono text-[#a0a0d0] uppercase font-bold">
                <span>Master Volume</span>
                <span className="text-[#ffdd00]">{Math.round(settings.masterVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVol}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-[#2a2a4a] appearance-none cursor-pointer accent-[#ffdd00] border-2 border-black"
              />
            </div>
          </div>

          {/* Reset Progress Danger Action */}
          <button
            onClick={handleConfirmReset}
            className="group relative w-full bg-[#ff4444] border-4 border-black p-3 text-center transition-all hover:bg-[#ff6666] active:translate-x-1 active:translate-y-1 cursor-pointer shadow-[4px_4px_0_0_#000]"
          >
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-widest">
              <AlertTriangle size={15} />
              <span>Reset Game Progress</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
