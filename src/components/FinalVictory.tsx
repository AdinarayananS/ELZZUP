import React from 'react';
import { PixelButton } from './PixelButton';
import { Home, Award, Sparkles } from 'lucide-react';

interface FinalVictoryProps {
  onBackToMenu: () => void;
  soundEnabled: boolean;
}

export const FinalVictory: React.FC<FinalVictoryProps> = ({ onBackToMenu, soundEnabled }) => {
  return (
    <div className="w-full max-w-[600px] bg-[#1a1a3a] border-8 border-black p-1 shadow-[0_12px_0_0_#000] my-auto">
      <div className="border-2 border-black bg-[#2a2a4a] p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Terminal Header */}
        <div className="absolute top-4 left-4 font-mono text-xs text-[#a0a0d0] tracking-widest font-bold">
          SYS.HALT.0000
        </div>
        <div className="absolute top-4 right-4 font-mono text-xs text-[#ffdd00] tracking-widest flex items-center gap-1 font-bold">
          <Sparkles size={14} />
          END_OF_LINE_
        </div>

        {/* Victory Headline */}
        <div className="mt-8 mb-6">
          <h1
            className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#ffdd00] uppercase tracking-tighter text-glitch drop-shadow-[2px_2px_0_#000]"
            data-text="YOU WIN."
          >
            YOU WIN.
          </h1>
        </div>

        {/* Humorous Epilogue Quote */}
        <div className="relative my-6 max-w-md w-full bg-[#1a1a3a] border-l-8 border-[#ff4444] border-2 border-black p-4 text-left shadow-[4px_4px_0_0_#000]">
          <div className="font-mono text-xs text-[#ff4444] uppercase tracking-widest mb-1 font-bold">
            [SYSTEM OFFLINE]
          </div>
          <p className="font-mono text-base sm:text-lg text-[#f0f0ff] leading-relaxed">
            You finally learned not to trust me.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-sm">
          <PixelButton
            variant="primary"
            size="md"
            fullWidth
            soundEnabled={soundEnabled}
            onClick={onBackToMenu}
            icon={<Home size={18} className="text-black" />}
          >
            Back to Menu
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
