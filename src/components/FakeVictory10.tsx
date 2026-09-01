import React, { useState, useEffect, useRef } from 'react';
import { PixelButton } from './PixelButton';
import { Home, Sparkles, AlertOctagon } from 'lucide-react';
import { Logo } from './Logo';
import { sound } from '../audio';

interface FakeVictory10Props {
  onProceedToFloor11: () => void;
  soundEnabled: boolean;
}

type GlitchPhase =
  | 'idle'
  | 'freeze'
  | 'flicker-distort'
  | 'fade-black'
  | 'elzzup-appears'
  | 'dialogue-1'
  | 'dialogue-2'
  | 'transition-out';

const CYCLING_TITLES = [
  'ELZZUP DEFEATED',
  'ELZZUP DEFEATED?',
  'ERROR',
  'VICTORY CANCELLED',
  'CORRUPTED_SECTOR',
  'VICTORY CANCELLED',
];

export const FakeVictory10: React.FC<FakeVictory10Props> = ({
  onProceedToFloor11,
  soundEnabled,
}) => {
  const [phase, setPhase] = useState<GlitchPhase>('idle');
  const [displayedTitle, setDisplayedTitle] = useState('ELZZUP DEFEATED');
  const [typedText, setTypedText] = useState('');
  const [isUiDistorted, setIsUiDistorted] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const addTimer = (id: number) => {
    timeoutsRef.current.push(id);
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleMainMenuClick = () => {
    if (phase !== 'idle') return;

    sound.playClick(soundEnabled);
    setPhase('freeze');

    // 1. Freeze briefly (600ms)
    addTimer(
      window.setTimeout(() => {
        setPhase('flicker-distort');
        setIsUiDistorted(true);
        sound.playGlitch(soundEnabled, 0.8);

        // Rapid title cycling during flicker
        let titleIdx = 0;
        const cycleInterval = window.setInterval(() => {
          titleIdx = (titleIdx + 1) % CYCLING_TITLES.length;
          setDisplayedTitle(CYCLING_TITLES[titleIdx]);
          sound.playGlitch(soundEnabled, 0.2);
        }, 180);

        // 2. Flicker & distort for 2.2s, then fade to black
        addTimer(
          window.setTimeout(() => {
            clearInterval(cycleInterval);
            setPhase('fade-black');
            sound.playGlitch(soundEnabled, 0.9);

            // 3. Elzzup appears through glitch
            addTimer(
              window.setTimeout(() => {
                setPhase('elzzup-appears');
                sound.playTroll(soundEnabled, 0.7);

                // 4. First Dialogue: "You thought it was that easy?"
                addTimer(
                  window.setTimeout(() => {
                    setPhase('dialogue-1');
                    sound.playGlitch(soundEnabled, 0.4);
                    typeOutText('You thought it was that easy?', () => {
                      // 5. Second Dialogue: "Oh... you actually believed that was the end?"
                      addTimer(
                        window.setTimeout(() => {
                          setPhase('dialogue-2');
                          sound.playGlitch(soundEnabled, 0.5);
                          typeOutText(
                            'Oh... you actually believed that was the end?',
                            () => {
                              // 6. Transition out into Floor 11!
                              addTimer(
                                window.setTimeout(() => {
                                  setPhase('transition-out');
                                  sound.playGlitch(soundEnabled, 1.0);
                                  addTimer(
                                    window.setTimeout(() => {
                                      onProceedToFloor11();
                                    }, 800)
                                  );
                                }, 1500)
                              );
                            }
                          );
                        }, 1200)
                      );
                    });
                  }, 800)
                );
              }, 1000)
            );
          }, 2400)
        );
      }, 600)
    );
  };

  const typeOutText = (fullText: string, onDone: () => void) => {
    setTypedText('');
    let idx = 0;
    const interval = window.setInterval(() => {
      if (idx < fullText.length) {
        setTypedText(fullText.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 45);
  };

  // Full black screen / Elzzup confrontation sequence
  if (
    phase === 'fade-black' ||
    phase === 'elzzup-appears' ||
    phase === 'dialogue-1' ||
    phase === 'dialogue-2' ||
    phase === 'transition-out'
  ) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050510] flex flex-col items-center justify-center p-4 select-none overflow-hidden">
        {/* Intense Corrupted Red/Cyan Scanlines */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,68,68,0.15)_0%,rgba(0,0,0,0.9)_80%)] animate-pulse" />
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.75)_50%)] bg-[length:100%_4px]" />

        {/* Glitched Elzzup Avatar */}
        {phase !== 'fade-black' && (
          <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
            <div className="relative mb-6 animate-bounce">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#1a0a20] border-4 border-[#ff4444] p-2 shadow-[0_0_35px_rgba(255,68,68,0.6),4px_4px_0_0_#000] flex items-center justify-center">
                <Logo size="lg" mood="glitched" isCorrupted={true} animated={true} />
              </div>
              <div className="absolute -top-3 -right-3 bg-[#ff4444] text-black px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest border border-black animate-ping">
                CORRUPTED
              </div>
            </div>

            {/* Terminal Window for Dialogue */}
            <div className="w-full bg-[#120820] border-4 border-[#ff4444] p-4 sm:p-6 shadow-[0_0_20px_rgba(255,68,68,0.4),4px_4px_0_0_#000] min-h-[130px] flex flex-col items-center justify-center">
              <div className="w-full text-left mb-2 flex items-center gap-2 border-b border-[#ff4444]/40 pb-1">
                <AlertOctagon size={14} className="text-[#ff4444] animate-pulse" />
                <span className="font-mono text-[10px] text-[#ff6666] uppercase tracking-widest font-bold">
                  KERNEL_HIJACK // ELZZUP_CONSCIOUSNESS
                </span>
              </div>

              <div className="font-mono font-bold text-base sm:text-xl md:text-2xl text-[#ffdd00] tracking-wide my-auto text-center leading-relaxed">
                "{typedText}"
                <span className="inline-block w-2.5 h-5 bg-[#ff4444] ml-1.5 animate-pulse align-middle" />
              </div>
            </div>

            {/* Stage Indicator */}
            <div className="mt-6 font-mono text-xs text-[#a0a0d0] uppercase tracking-widest font-bold">
              [ ACCESSING UNMAPPED SECTOR: FLOOR 11 ]
            </div>
          </div>
        )}
      </div>
    );
  }

  // Initial Fake Victory Screen with Distortions
  return (
    <div
      className={`w-full max-w-[640px] bg-[#1a1a3a] border-8 border-black p-1 shadow-[0_12px_0_0_#000] my-auto transition-all duration-150 ${
        isUiDistorted
          ? 'animate-pulse scale-[1.02] border-[#ff4444] shadow-[0_0_30px_rgba(255,68,68,0.8)]'
          : ''
      }`}
    >
      <div
        className={`border-2 border-black bg-[#2a2a4a] p-6 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden ${
          isUiDistorted ? 'filter contrast-150 brightness-110' : ''
        }`}
      >
        {/* Terminal Header */}
        <div className="absolute top-4 left-4 font-mono text-xs text-[#a0a0d0] tracking-widest font-bold">
          {isUiDistorted ? 'SYS.ERR.6666' : 'SYS.HALT.0000'}
        </div>
        <div className="absolute top-4 right-4 font-mono text-xs text-[#ffdd00] tracking-widest flex items-center gap-1 font-bold">
          <Sparkles size={14} />
          {isUiDistorted ? 'INTERRUPT_' : 'END_OF_LINE_'}
        </div>

        {/* Victory Headline */}
        <div className="mt-8 mb-4">
          <h1
            className={`font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-glitch drop-shadow-[2px_2px_0_#000] ${
              isUiDistorted ? 'text-[#ff4444]' : 'text-[#ffdd00]'
            }`}
            data-text={displayedTitle}
          >
            {displayedTitle}
          </h1>
        </div>

        {/* Epilogue Quote */}
        <div
          className={`relative my-4 max-w-md w-full border-l-8 border-2 border-black p-4 text-left shadow-[4px_4px_0_0_#000] ${
            isUiDistorted
              ? 'bg-[#2a0a1a] border-l-[#ffdd00] border-[#ff4444]'
              : 'bg-[#1a1a3a] border-l-[#44ff44]'
          }`}
        >
          <div
            className={`font-mono text-xs uppercase tracking-widest mb-1 font-bold ${
              isUiDistorted ? 'text-[#ffdd00]' : 'text-[#44ff44]'
            }`}
          >
            {isUiDistorted ? '[MEMORY OVERFLOW]' : '[SYSTEM OFFLINE]'}
          </div>
          <p className="font-mono text-sm sm:text-base text-[#f0f0ff] leading-relaxed">
            {isUiDistorted
              ? 'FATAL: Core integrity restored from shadow register.'
              : 'Facility protocols terminated. You actually beat ELZZUP.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-xs sm:max-w-sm">
          <PixelButton
            variant="primary"
            size="md"
            fullWidth
            disabled={phase !== 'idle'}
            soundEnabled={soundEnabled}
            onClick={handleMainMenuClick}
            icon={<Home size={18} className="text-black" />}
          >
            {phase === 'freeze' ? 'ERROR...' : 'Main Menu'}
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
