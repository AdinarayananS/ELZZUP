import React, { useState } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { ArrowLeftRight, Check, X } from 'lucide-react';

interface StageConfig {
  stageNumber: number;
  prompt: string;
  subPrompt: string;
  optionA: { label: string; isOpposite: boolean; colorClass: string };
  optionB: { label: string; isOpposite: boolean; colorClass: string };
}

const STAGES: StageConfig[] = [
  {
    stageNumber: 1,
    prompt: 'INSTRUCTION: SELECT RED',
    subPrompt: 'TARGET COLOR: RED',
    optionA: { label: 'RED', isOpposite: false, colorClass: 'bg-[#ff4444] hover:bg-[#ff6666] text-white' },
    optionB: { label: 'BLUE', isOpposite: true, colorClass: 'bg-[#2277ff] hover:bg-[#4499ff] text-white' },
  },
  {
    stageNumber: 2,
    prompt: 'INSTRUCTION: GO LEFT',
    subPrompt: 'TARGET DIRECTION: LEFT',
    optionA: { label: 'LEFT', isOpposite: false, colorClass: 'bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#ffdd00]' },
    optionB: { label: 'RIGHT', isOpposite: true, colorClass: 'bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#ffdd00]' },
  },
  {
    stageNumber: 3,
    prompt: 'INSTRUCTION: SWITCH ON',
    subPrompt: 'TARGET STATE: ACTIVE',
    optionA: { label: 'ON', isOpposite: false, colorClass: 'bg-[#22cc55] hover:bg-[#44ee77] text-black' },
    optionB: { label: 'OFF', isOpposite: true, colorClass: 'bg-[#666688] hover:bg-[#8888aa] text-white' },
  },
];

export const Room14: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const stage = STAGES[currentStageIndex];

  const handleChoice = (isOpposite: boolean, chosenLabel: string) => {
    if (isProcessing) return;

    if (!isOpposite) {
      setIsProcessing(true);
      sound.playTroll(soundEnabled);
      setTimeout(() => {
        onTroll(
          "That's not the opposite.",
          `The instruction asked for ${chosenLabel}, but the rule is: DO THE OPPOSITE.`,
          `ERR_LITERAL_OBEDIENCE // SELECTED: ${chosenLabel}`
        );
      }, 350);
      return;
    }

    sound.playButtonPress(soundEnabled);

    if (currentStageIndex + 1 >= STAGES.length) {
      setIsProcessing(true);
      sound.playSuccess(soundEnabled);
      setTimeout(() => {
        onSuccess(
          'You finally read between the lines.',
          'Inverting every command is the true way forward.'
        );
      }, 450);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 geo-dots-bg select-none">
      {/* Top Warning Banner */}
      <div className="relative z-10 mb-4 px-4 py-1.5 bg-black/60 border-2 border-black font-mono text-xs text-[#a0a0d0] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <ArrowLeftRight size={14} className="text-[#ffdd00]" />
        <span className="font-bold text-[#f0f0ff]">
          INVERSION PROTOCOL // STAGE {currentStageIndex + 1} OF {STAGES.length}
        </span>
      </div>

      {/* Main Console Box */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        <div className="w-full bg-[#1a1a3a] border-8 border-black p-6 sm:p-8 shadow-[0_12px_0_0_#000] flex flex-col items-center gap-6 text-center">
          {/* Prompt Header */}
          <div className="w-full bg-[#0a0a1a] border-4 border-black p-4 flex flex-col items-center gap-1">
            <div className="font-mono text-[11px] text-[#ffdd00] uppercase font-bold tracking-wider">
              {stage.subPrompt}
            </div>
            <div className="font-heading font-extrabold text-sm sm:text-base text-white uppercase">
              {stage.prompt}
            </div>
          </div>

          {/* Dual Inversion Choice Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              onClick={() => handleChoice(stage.optionA.isOpposite, stage.optionA.label)}
              disabled={isProcessing}
              title={`Choose ${stage.optionA.label}`}
              className={`
                group relative select-none cursor-pointer py-4 px-3
                border-6 border-black
                flex flex-col items-center justify-center
                transition-all duration-100 ease-out
                shadow-[0_8px_0_0_#000] hover:-translate-y-1 active:translate-y-2 active:shadow-none
                ${stage.optionA.colorClass}
              `}
            >
              <span className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-wider">
                {stage.optionA.label}
              </span>
            </button>

            <button
              onClick={() => handleChoice(stage.optionB.isOpposite, stage.optionB.label)}
              disabled={isProcessing}
              title={`Choose ${stage.optionB.label}`}
              className={`
                group relative select-none cursor-pointer py-4 px-3
                border-6 border-black
                flex flex-col items-center justify-center
                transition-all duration-100 ease-out
                shadow-[0_8px_0_0_#000] hover:-translate-y-1 active:translate-y-2 active:shadow-none
                ${stage.optionB.colorClass}
              `}
            >
              <span className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-wider">
                {stage.optionB.label}
              </span>
            </button>
          </div>

          {/* Stage Progress Indicators */}
          <div className="flex items-center gap-3">
            {STAGES.map((_, idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 border-2 border-black rotate-45 ${
                  idx < currentStageIndex
                    ? 'bg-[#44ff44]'
                    : idx === currentStageIndex
                    ? 'bg-[#ffdd00]'
                    : 'bg-[#2a2a4a]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Console Footing */}
        <div className="w-[85%] h-3.5 bg-[#1a1a3a] border-4 border-black shadow-[2px_2px_0_0_#000] -mt-1" />
      </div>

      {/* Decorative corner diamond */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 border-2 border-black bg-[#ffdd00] rotate-45 shadow-[2px_2px_0_0_#000] pointer-events-none" />
    </div>
  );
};
