import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Sparkles, Wrench, Shield, Lock } from 'lucide-react';

export const Room13: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pressedDecoy, setPressedDecoy] = useState<string | null>(null);

  const handleDecoyClick = (decoyName: string, trollMsg: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPressedDecoy(decoyName);
    sound.playTroll(soundEnabled);

    setTimeout(() => {
      onTroll(
        'Decoy Triggered.',
        trollMsg,
        `ERR_OBVIOUS_OBJECT // ATTEMPTED: ${decoyName}`
      );
    }, 350);
  };

  const handleSmallSecretClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    sound.playSuccess(soundEnabled);

    setTimeout(() => {
      onSuccess(
        'Maybe look a little closer.',
        'The most important switch was hiding right in the corner.'
      );
    }, 450);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none">
      {/* Top Banner Status */}
      <div className="relative z-10 mb-4 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <span className="w-2 h-2 rotate-45 bg-[#ffdd00]" />
        <span className="font-bold text-[#f0f0ff]">INSPECTION MODE // FIND THE WAY OUT</span>
      </div>

      {/* Visually Busy Center Chamber */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
        <div className="w-full bg-[#1a1a3a] border-8 border-black p-6 sm:p-8 shadow-[0_12px_0_0_#000] flex flex-col items-center gap-6">
          {/* Decoy 1: Giant Vault Lock */}
          <div className="w-full flex items-center justify-between gap-4 p-4 bg-[#2a2a4a] border-4 border-black">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ff4444] border-2 border-black">
                <Lock size={22} className="text-white" />
              </div>
              <div className="text-left">
                <div className="font-heading font-extrabold text-sm sm:text-base text-white uppercase">
                  HEAVY VAULT PORTAL
                </div>
                <div className="font-mono text-[10px] text-[#a0a0d0]">[PRESSURE SEALED]</div>
              </div>
            </div>
            <button
              onClick={() => handleDecoyClick('VAULT_LOCK', 'Too big, too loud, completely fake.')}
              disabled={isProcessing}
              title="Force open vault"
              className="bg-[#ff4444] hover:bg-[#ff6666] border-3 border-black py-2 px-4 shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none font-heading font-bold text-xs text-white uppercase cursor-pointer"
            >
              BREACH
            </button>
          </div>

          {/* Decoy 2: Power Generator Reactor */}
          <div className="w-full flex items-center justify-between gap-4 p-4 bg-[#2a2a4a] border-4 border-black">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2277ff] border-2 border-black">
                <Shield size={22} className="text-white" />
              </div>
              <div className="text-left">
                <div className="font-heading font-extrabold text-sm sm:text-base text-white uppercase">
                  AUXILIARY POWER GRID
                </div>
                <div className="font-mono text-[10px] text-[#a0a0d0]">[ONLINE - 480V]</div>
              </div>
            </div>
            <button
              onClick={() => handleDecoyClick('REACTOR_SWITCH', 'Generators generate power, not exits.')}
              disabled={isProcessing}
              title="Engage Power Grid"
              className="bg-[#2277ff] hover:bg-[#4499ff] border-3 border-black py-2 px-4 shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none font-heading font-bold text-xs text-white uppercase cursor-pointer"
            >
              ENGAGE
            </button>
          </div>
        </div>

        {/* Base Footing */}
        <div className="w-[90%] h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
      </div>

      {/* THE ACTUAL SECRET: A small environmental micro-key / switch tucked in the bottom right corner of the room */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
        <button
          onClick={handleSmallSecretClick}
          disabled={isProcessing}
          title="Small Service Toggle"
          className="group relative select-none cursor-pointer p-2.5 sm:p-3 bg-[#ffdd00] hover:bg-[#ffee44] border-3 border-black shadow-[3px_3px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-2 transition-transform"
        >
          <div className="p-1 bg-black text-[#ffdd00]">
            <Sparkles size={14} className="group-hover:rotate-90 transition-transform" />
          </div>
          <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider">
            [SERVICE BYPASS]
          </span>
        </button>
      </div>

      {/* Decoy environmental icon on left */}
      <div
        onClick={() => handleDecoyClick('MAINTENANCE_WRENCH', 'Just a decorative tool icon.')}
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 p-2 bg-[#2a2a4a] border-2 border-black opacity-60 hover:opacity-100 cursor-pointer"
      >
        <Wrench size={18} className="text-[#a0a0d0]" />
      </div>

      {/* Decorative corner diamond */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
