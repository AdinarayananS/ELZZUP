import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { PixelButton } from './PixelButton';
import { sound } from '../audio';
import {
  BookOpen,
  ArrowLeft,
  MousePointerClick,
  Keyboard,
  Layers,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface KnowHowGuideProps {
  onBack: () => void;
  soundEnabled: boolean;
}

// Playful dialogue sets for the mocking intro
const INTRO_DIALOGUE_SETS = [
  // Set 1: Classic sequence requested
  [
    'Tch...',
    'You need a guide?',
    "Didn't know you were that stupid.",
    '...Fine.',
    "I'll explain it. Try to keep up.",
  ],
  // Set 2: Sarcastic variation
  [
    'Tch... you need instructions?',
    'You got lost already?',
    "Fine. I'll hold your hand.",
    "Read carefully. I won't repeat myself.",
  ],
  // Set 3: Arrogant variation
  [
    'Tch...',
    'Apparently I need to explain the obvious.',
    'This is embarrassing.',
    "...Fine. I'll explain it. Try to keep up.",
  ],
];

// Closing mocking remark options
const CLOSING_REMARKS = [
  'There. Even you should be able to manage that.',
  'Congratulations. You now know how to play a puzzle game.',
  "If you still get stuck after this, that's impressive.",
];

export const KnowHowGuide: React.FC<KnowHowGuideProps> = ({
  onBack,
  soundEnabled,
}) => {
  // Phase state: 'intro' (mocking dialogue) -> 'guide' (full manual)
  const [phase, setPhase] = useState<'intro' | 'guide'>('intro');
  const [dialogueSet, setDialogueSet] = useState<string[]>(INTRO_DIALOGUE_SETS[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [closingRemark, setClosingRemark] = useState(CLOSING_REMARKS[0]);
  const [isFlickering, setIsFlickering] = useState(true);

  const timerRef = useRef<number | null>(null);

  // Initialize random set and closing remark
  useEffect(() => {
    const randomSetIndex = Math.floor(Math.random() * INTRO_DIALOGUE_SETS.length);
    setDialogueSet(INTRO_DIALOGUE_SETS[randomSetIndex]);

    const randomRemarkIndex = Math.floor(Math.random() * CLOSING_REMARKS.length);
    setClosingRemark(CLOSING_REMARKS[randomRemarkIndex]);

    // Initial glitch/flicker sound
    sound.playGlitch(soundEnabled);
    const flickerTimer = window.setTimeout(() => {
      setIsFlickering(false);
    }, 400);

    return () => {
      clearTimeout(flickerTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [soundEnabled]);

  // Typewriter effect for intro lines
  useEffect(() => {
    if (phase !== 'intro') return;

    const fullLine = dialogueSet[currentLineIndex] || '';
    let charIdx = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typeInterval = window.setInterval(() => {
      charIdx++;
      setDisplayedText(fullLine.slice(0, charIdx));

      if (charIdx % 3 === 0) {
        sound.playClick(soundEnabled, 0.15);
      }

      if (charIdx >= fullLine.length) {
        clearInterval(typeInterval);
        setIsTyping(false);

        // If not the last line, auto-advance after pause
        if (currentLineIndex < dialogueSet.length - 1) {
          timerRef.current = window.setTimeout(() => {
            setCurrentLineIndex((prev) => prev + 1);
          }, 1100);
        } else {
          // Finished all lines! Automatically transition into guide after short pause
          timerRef.current = window.setTimeout(() => {
            sound.playLatchOpen(soundEnabled);
            setPhase('guide');
          }, 1400);
        }
      }
    }, 38);

    return () => {
      clearInterval(typeInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentLineIndex, dialogueSet, phase, soundEnabled]);

  // Handler to manually advance or skip intro
  const handleAdvanceIntro = () => {
    sound.playClick(soundEnabled);
    if (isTyping) {
      // Instantly finish typing current line
      setDisplayedText(dialogueSet[currentLineIndex]);
      setIsTyping(false);
    } else if (currentLineIndex < dialogueSet.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      sound.playLatchOpen(soundEnabled);
      setPhase('guide');
    }
  };

  const handleSkipIntro = () => {
    sound.playLatchOpen(soundEnabled);
    setPhase('guide');
  };

  return (
    <div className="relative w-full max-w-[1050px] min-h-[540px] sm:min-h-[600px] bg-[#1a1a3a] border-6 sm:border-8 border-black shadow-[0_12px_0_0_#000] flex flex-col items-center justify-between p-4 sm:p-7 overflow-hidden pixel-facility-wall">
      {/* Background Pixel Environmental Scene */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 pixel-conduit-h opacity-70" />
        <div className="absolute bottom-0 left-0 right-0 h-28 pixel-chamber-floor opacity-80 border-t-2 border-black/80" />
      </div>

      {/* Screen CRT Flicker Effect */}
      {isFlickering && (
        <div className="absolute inset-0 bg-white/20 z-50 pointer-events-none animate-pulse" />
      )}

      {/* ========================================================= */}
      {/* PHASE 1: ELZZUP MOCKING INTRO SEQUENCE                    */}
      {/* ========================================================= */}
      {phase === 'intro' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg py-6 animate-fadeIn select-none">
          {/* Elzzup Avatar Frame */}
          <div className="relative mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1e0d28] border-4 sm:border-6 border-[#ff4444] shadow-[6px_6px_0_0_#000] flex items-center justify-center p-2 relative">
              <Logo size="md" mood="glitched" isCorrupted={true} animated={false} />
              <div className="absolute -top-3 -right-3 bg-[#ff4444] text-black font-pixel text-[10px] px-2 py-0.5 border-2 border-black font-black uppercase animate-pulse">
                LIVE
              </div>
            </div>
          </div>

          {/* Speaker Header */}
          <div className="font-pixel text-xs sm:text-sm text-[#ff8888] uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
            <Zap size={14} className="text-[#ffdd00]" />
            <span>ELZZUP // ROOT CONSCIOUSNESS</span>
          </div>

          {/* Dialogue Speech Box */}
          <div className="w-full bg-[#0c0c1e] border-4 border-black p-5 sm:p-6 mb-6 shadow-[6px_6px_0_0_#000] min-h-[100px] sm:min-h-[120px] flex items-center justify-center text-center">
            <p className="font-dialogue font-bold text-base sm:text-xl text-[#ffdd00] tracking-wide leading-relaxed">
              "{displayedText}"
              {isTyping && <span className="inline-block w-2.5 h-4 bg-[#ffdd00] ml-1.5 animate-pulse" />}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <PixelButton
              variant="primary"
              size="md"
              fullWidth
              soundEnabled={soundEnabled}
              onClick={handleAdvanceIntro}
            >
              {currentLineIndex < dialogueSet.length - 1 ? 'Next ▶' : 'Open Guide ▶'}
            </PixelButton>

            <button
              onClick={handleSkipIntro}
              className="px-3 py-2 font-mono text-xs text-[#a0a0d0] hover:text-[#f0f0ff] uppercase tracking-wider font-bold underline cursor-pointer whitespace-nowrap"
            >
              [Skip Intro]
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 2: CORE KNOW-HOW GUIDE MANUAL                       */}
      {/* ========================================================= */}
      {phase === 'guide' && (
        <div className="relative z-10 w-full flex-1 flex flex-col justify-between animate-fadeIn">
          {/* Header Title Bar */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-3 mb-4 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#ffdd00] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                <BookOpen size={18} />
              </div>
              <div>
                <h2 className="font-heading font-black text-lg sm:text-2xl text-[#ffdd00] tracking-tight uppercase drop-shadow-[2px_2px_0_#000]">
                  KNOW-HOW MANUAL
                </h2>
                <div className="font-mono text-[10px] sm:text-xs text-[#a0a0d0] uppercase font-bold tracking-wider -mt-0.5">
                  KERNEL PROTOCOL // SURVIVAL DIRECTIVES
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] sm:text-xs bg-[#0c0c1e] text-[#44ff44] px-2.5 py-1 border-2 border-black font-bold uppercase shadow-[2px_2px_0_0_#000]">
                FLOORS 01 — 20
              </span>
            </div>
          </div>

          {/* Guide Content Grid (5 Core Rules) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 mb-4 max-h-[360px] sm:max-h-[390px] overflow-y-auto pr-1">
            {/* 1. CONTROLS & INTERACTION */}
            <div className="bg-[#0c0c1e] border-3 sm:border-4 border-black p-3.5 shadow-[4px_4px_0_0_#000] flex flex-col">
              <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] font-black uppercase flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-black">
                <MousePointerClick size={16} className="text-[#ffdd00]" />
                <span>1. CONTROLS & INPUTS</span>
              </div>
              <ul className="font-mono text-xs text-[#f0f0ff] space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#44ff44] font-black">▶</span>
                  <span>
                    <strong className="text-[#ffdd00]">MOUSE / TOUCH:</strong> Left click to interact, flip switches, sever cables, calibrate dials, and drag objects.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#44ff44] font-black">▶</span>
                  <span>
                    <strong className="text-[#66aaff]">KEYBOARD:</strong> Keys <code className="bg-[#2a2a4a] px-1 text-[#ffdd00] font-bold">[1-9]</code>, <code className="bg-[#2a2a4a] px-1 text-[#ffdd00] font-bold">[A-C]</code>, <code className="bg-[#2a2a4a] px-1 text-[#ffdd00] font-bold">[Space]</code>, & <code className="bg-[#2a2a4a] px-1 text-[#ffdd00] font-bold">[Enter]</code> trigger chamber shortcuts.
                  </span>
                </li>
              </ul>
            </div>

            {/* 2. SOLVE THE FLOOR */}
            <div className="bg-[#0c0c1e] border-3 sm:border-4 border-black p-3.5 shadow-[4px_4px_0_0_#000] flex flex-col">
              <div className="font-pixel text-xs sm:text-sm text-[#44ff44] font-black uppercase flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-black">
                <Layers size={16} className="text-[#44ff44]" />
                <span>2. SOLVE THE FLOOR</span>
              </div>
              <ul className="font-mono text-xs text-[#f0f0ff] space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#44ff44] font-black">▶</span>
                  <span>Each floor contains a unique chamber puzzle.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#44ff44] font-black">▶</span>
                  <span>Observe the environment, subtle diagrams, and telemetry.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#44ff44] font-black">▶</span>
                  <span>Satisfy the true objective to unlock the transit door.</span>
                </li>
              </ul>
            </div>

            {/* 3. PAY ATTENTION */}
            <div className="bg-[#0c0c1e] border-3 sm:border-4 border-black p-3.5 shadow-[4px_4px_0_0_#000] flex flex-col">
              <div className="font-pixel text-xs sm:text-sm text-[#ff8888] font-black uppercase flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-black">
                <AlertTriangle size={16} className="text-[#ff4444]" />
                <span>3. PAY ATTENTION</span>
              </div>
              <ul className="font-mono text-xs text-[#f0f0ff] space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ff4444] font-black">!</span>
                  <span><strong className="text-[#ff8888]">Not everything is what it seems.</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ff4444] font-black">!</span>
                  <span>Some clues may be inverted or deceptive.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ff4444] font-black">!</span>
                  <span>Obvious solutions might lead directly into rage traps.</span>
                </li>
              </ul>
            </div>

            {/* 4. ELZZUP'S NATURE */}
            <div className="bg-[#0c0c1e] border-3 sm:border-4 border-black p-3.5 shadow-[4px_4px_0_0_#000] flex flex-col">
              <div className="font-pixel text-xs sm:text-sm text-[#ffdd00] font-black uppercase flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-black">
                <Sparkles size={16} className="text-[#ffdd00]" />
                <span>4. ELZZUP'S DECEPTION</span>
              </div>
              <ul className="font-mono text-xs text-[#f0f0ff] space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ffdd00] font-black">▶</span>
                  <span><strong className="text-[#ffdd00]">Elzzup likes to lie.</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ffdd00] font-black">▶</span>
                  <span>He will mock your failures and tamper with labels.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ffdd00] font-black">▶</span>
                  <span>Never blindly trust everything he writes or says.</span>
                </li>
              </ul>
            </div>

            {/* 5. HINTS & STUCK */}
            <div className="bg-[#0c0c1e] border-3 sm:border-4 border-black p-3.5 shadow-[4px_4px_0_0_#000] flex flex-col md:col-span-2 lg:col-span-2">
              <div className="font-pixel text-xs sm:text-sm text-[#66aaff] font-black uppercase flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-black">
                <HelpCircle size={16} className="text-[#66aaff]" />
                <span>5. STUCK? HINTS & DIAGNOSTICS</span>
              </div>
              <ul className="font-mono text-xs text-[#f0f0ff] space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#66aaff] font-black">✓</span>
                  <span><strong className="text-[#66aaff]">Look carefully:</strong> Review the room's header title and diagnostic notes.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#66aaff] font-black">✓</span>
                  <span><strong className="text-[#f0f0ff]">Think critically:</strong> What is the game *actually* asking you to achieve?</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#66aaff] font-black">✓</span>
                  <span><strong className="text-[#44ff44]">Hint Terminal:</strong> Use the <code className="bg-[#2a2a4a] px-1.5 text-[#ffdd00] font-bold">[HINT]</code> button in the chamber header when stuck.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Elzzup Closing Remark Box (Section 4) */}
          <div className="w-full bg-[#1e0d28] border-3 sm:border-4 border-[#ff4444] p-3 sm:p-3.5 mb-4 flex items-center gap-3 shadow-[4px_4px_0_0_#000]">
            <div className="w-10 h-10 shrink-0 bg-black border-2 border-[#ff4444] flex items-center justify-center p-0.5 shadow-[2px_2px_0_0_#000]">
              <Logo size="sm" mood="smug" animated={false} isCorrupted={true} className="!w-full !h-full" />
            </div>
            <div className="flex-1">
              <div className="font-pixel text-[10px] sm:text-xs text-[#ff8888] font-bold uppercase mb-0.5">
                ELZZUP REMARK:
              </div>
              <div className="font-dialogue text-xs sm:text-sm text-[#ffdd00] font-bold tracking-wide">
                "{closingRemark}"
              </div>
            </div>
          </div>

          {/* Guide Navigation: Working BACK Button (Section 5) */}
          <div className="w-full flex items-center justify-between border-t-3 border-black pt-3">
            <div className="font-mono text-xs text-[#a0a0d0] font-bold hidden sm:block">
              READY TO TEST YOUR WITS?
            </div>

            <PixelButton
              variant="neutral"
              size="lg"
              soundEnabled={soundEnabled}
              onClick={onBack}
              icon={<ArrowLeft size={18} />}
              className="w-full sm:w-auto"
            >
              Back to Main Menu
            </PixelButton>
          </div>
        </div>
      )}
    </div>
  );
};
