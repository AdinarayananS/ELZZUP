import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import { Zap, AlertTriangle, Lightbulb, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';

interface ChoiceItem {
  id: 'rubber' | 'paperclip' | 'wood';
  label: 'ALPHA' | 'BETA' | 'GAMMA';
  name: string;
  material: string;
  isCorrect: boolean;
  failFeedback: string;
  trapReason: string;
}

export const Room17: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // Progressive Hint Level (0 = none, 1 = subtle, 2 = direct, 3 = strong)
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [circuitPowered, setCircuitPowered] = useState<boolean>(false);
  
  // Failure / Meme Laugh State
  const [isFailing, setIsFailing] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>('');
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Victory Sequence State
  const [victoryPhase, setVictoryPhase] = useState<'idle' | 'freeze' | 'cleared' | 'elzzup-reaction'>('idle');

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Items definition
  const baseItems: Array<Omit<ChoiceItem, 'label'>> = [
    {
      id: 'rubber',
      name: 'TITANIUM-COATED RUBBER ERASER',
      material: 'Synthetic Elastomer Polymer',
      isCorrect: false,
      failFeedback: 'Rubber is an insulator! Electricity cannot flow through it.',
      trapReason: '"Titanium-coated" is just paint! Rubber blocks electrical current.',
    },
    {
      id: 'paperclip',
      name: 'COMMON STEEL PAPERCLIP',
      material: 'Standard Zinc-Galvanized Iron Wire',
      isCorrect: true,
      failFeedback: '',
      trapReason: 'The humble everyday metal item is the only true electrical conductor.',
    },
    {
      id: 'wood',
      name: 'CRYSTALLINE HARDWOOD PEG',
      material: 'Kiln-Dried Organic Timber Dowel',
      isCorrect: false,
      failFeedback: 'Wood is a non-conductive insulator! Current is blocked.',
      trapReason: 'Even fancy polished hardwood cannot conduct electrical charge.',
    },
  ];

  // Randomize physical positions of ALPHA, BETA, GAMMA on every mount/restart
  const shuffledChoices: ChoiceItem[] = useMemo(() => {
    // Fisher-Yates shuffle
    const shuffled = [...baseItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const labels: Array<'ALPHA' | 'BETA' | 'GAMMA'> = ['ALPHA', 'BETA', 'GAMMA'];
    return shuffled.map((item, idx) => ({
      ...item,
      label: labels[idx],
    }));
  }, []);

  // Progressive Hints list with Elzzup's reluctant voice
  const HINTS = [
    {
      level: 1,
      title: 'HINT 1 [SUBTLE]',
      text: "Elzzup: \"You're looking at the wrong thing. Stop getting distracted by the fancy sounding labels.\"",
    },
    {
      level: 2,
      title: 'HINT 2 [DIRECT]',
      text: "Elzzup: \"Forget the techno-jargon. Look at what those three objects actually are in the real world.\"",
    },
    {
      level: 3,
      title: 'HINT 3 [STRONG]',
      text: "Elzzup: \"Think about 4th grade science: Rubber and wood are INSULATORS. Only METAL allows electricity to flow and complete a circuit.\"",
    },
  ];

  const handleProgressiveHint = () => {
    sound.playClick(soundEnabled);
    setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  const handleSelectChoice = (choice: ChoiceItem) => {
    if (isProcessing || circuitPowered || victoryPhase !== 'idle') return;
    sound.playClick(soundEnabled);
    setSelectedChoice(choice);
    setIsProcessing(true);

    if (choice.isCorrect) {
      // Correct: Paperclip conducts electricity!
      setCircuitPowered(true);
      sound.playSuccess(soundEnabled);

      // Trigger Dramatic Floor 17 Victory Sequence
      // 1. Brief Freeze (0.5s)
      const t1 = window.setTimeout(() => {
        setVictoryPhase('freeze');
        setScreenShake(true);

        // 2. Screen darkens, CRT glitch, Particles, Large Text: FLOOR 17 CLEARED (0.8s)
        const t2 = window.setTimeout(() => {
          setVictoryPhase('cleared');
          setScreenShake(false);
          sound.playLatchOpen(soundEnabled);

          // 3. Short Elzzup reaction (1.8s)
          const t3 = window.setTimeout(() => {
            setVictoryPhase('elzzup-reaction');

            // 4. Proceed to Floor 18
            const t4 = window.setTimeout(() => {
              onSuccess(
                'CHAMBER 17 CLEARED',
                'You ignored the misleading jargon and bridged the circuit with a conductive steel paperclip.'
              );
            }, 1800);
            timersRef.current.push(t4);
          }, 1800);
          timersRef.current.push(t3);
        }, 800);
        timersRef.current.push(t2);
      }, 500);
      timersRef.current.push(t1);
    } else {
      // Wrong: Insulator selected -> Trigger Meme Laugh Failure Sequence!
      setIsFailing(true);
      setFailMessage(choice.failFeedback);
      setScreenShake(true);
      sound.playGlitch(soundEnabled);

      // Play short meme laugh
      const laughTimer = window.setTimeout(() => {
        sound.playMemeLaugh(soundEnabled);
      }, 150);
      timersRef.current.push(laughTimer);

      const shakeTimer = window.setTimeout(() => {
        setScreenShake(false);
      }, 500);
      timersRef.current.push(shakeTimer);

      const failResetTimer = window.setTimeout(() => {
        setIsFailing(false);
        setIsProcessing(false);
        setSelectedChoice(null);
      }, 2400);
      timersRef.current.push(failResetTimer);
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 select-none ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Top Chamber Header & Misleading Diagnostic */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
        <div className="font-pixel text-[11px] sm:text-xs text-[#ffdd00] tracking-wider uppercase font-bold flex items-center gap-1.5 bg-[#0c0c1e] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <Zap size={14} className="text-[#ffdd00]" />
          <span>CHAMBER 17: CIRCUIT BRIDGING</span>
        </div>

        {/* Misleading Elzzup Warning Banner */}
        <div className="bg-[#2a0a10] border-2 border-[#ff4444] px-2.5 py-1 shadow-[2px_2px_0_0_#000] flex items-center gap-1.5">
          <AlertTriangle size={13} className="text-[#ff4444] animate-pulse shrink-0" />
          <span className="font-mono text-[10px] sm:text-[11px] text-[#ff8888] font-bold uppercase tracking-wide">
            ELZZUP NOTE: "ONLY ADVANCED SYNTHETICS RESIST THE CORE!"
          </span>
        </div>
      </div>

      {/* Main Interactive Circuit Display Panel */}
      <div className="w-full max-w-2xl bg-[#1a1a3a] border-4 sm:border-6 border-black p-3 sm:p-5 shadow-[6px_6px_0_0_#000] flex flex-col items-center gap-3">
        {/* Visual Circuit Diagram Viewport */}
        <div className="w-full bg-[#101026] border-3 border-black p-3 sm:p-4 shadow-[3px_3px_0_0_#000] relative overflow-hidden">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#44ff44 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] sm:text-xs text-[#a0a0d0] uppercase font-black flex items-center gap-1">
                <Zap size={12} className={circuitPowered ? 'text-[#44ff44]' : 'text-[#ffdd00]'} />
                12V DIRECT-CURRENT RELAY
              </span>
              <span
                className={`font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 border border-black ${
                  circuitPowered
                    ? 'bg-[#44ff44] text-black animate-pulse'
                    : 'bg-[#ff4444] text-white'
                }`}
              >
                {circuitPowered ? 'CIRCUIT CLOSED (CURRENT ACTIVE)' : 'OPEN CIRCUIT (GAP DETECTED)'}
              </span>
            </div>

            {/* Circuit Wire & Gap Graphic */}
            <div className="w-full h-20 sm:h-24 bg-black/90 border-2 border-black flex items-center justify-between px-4 sm:px-8 relative my-1">
              {/* Left Wire & Battery */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-12 bg-[#2a2a4a] border-2 border-[#ffdd00] flex flex-col items-center justify-center font-mono text-[9px] font-black text-[#ffdd00]">
                  <span>+</span>
                  <span className="text-[7px]">BAT</span>
                  <span>-</span>
                </div>
                <div
                  className={`h-2 w-12 sm:w-20 transition-all ${
                    circuitPowered
                      ? 'bg-[#44ff44] shadow-[0_0_10px_#44ff44]'
                      : 'bg-[#555577]'
                  }`}
                />
              </div>

              {/* Center Gap with Inserted Item */}
              <div className="flex-1 max-w-[160px] sm:max-w-[200px] h-12 sm:h-14 border-2 border-dashed border-[#ffdd00] bg-[#1a1a2e] flex flex-col items-center justify-center p-1 text-center relative mx-2">
                {selectedChoice ? (
                  <div
                    className={`font-mono text-[10px] sm:text-xs font-black uppercase leading-tight ${
                      circuitPowered ? 'text-[#44ff44]' : isFailing ? 'text-[#ff4444]' : 'text-[#ffdd00]'
                    }`}
                  >
                    <div>[{selectedChoice.label}]</div>
                    <div className="text-[9px] truncate max-w-[150px]">{selectedChoice.name}</div>
                  </div>
                ) : (
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#8888aa] uppercase font-bold">
                    [ INSERT CONDUCTOR HERE ]
                  </div>
                )}

                {/* Live Spark Effect on Success */}
                {circuitPowered && (
                  <div className="absolute inset-0 bg-[#44ff44]/20 border-2 border-[#44ff44] animate-pulse flex items-center justify-center">
                    <Sparkles size={20} className="text-[#44ff44] animate-spin" />
                  </div>
                )}
              </div>

              {/* Right Wire & Lightbulb Terminal */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-12 sm:w-20 transition-all ${
                    circuitPowered
                      ? 'bg-[#44ff44] shadow-[0_0_10px_#44ff44]'
                      : 'bg-[#555577]'
                  }`}
                />
                <div
                  className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-all ${
                    circuitPowered
                      ? 'bg-[#ffdd00] shadow-[0_0_16px_#ffdd00] animate-pulse text-black'
                      : 'bg-[#222233] text-[#555577]'
                  }`}
                >
                  <Lightbulb size={22} className={circuitPowered ? 'text-black fill-current' : 'text-[#555577]'} />
                </div>
              </div>
            </div>

            {/* Subtle Environmental Clue Note */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#a0a0d0] mt-1.5 px-1">
              <span className="font-bold text-[#ffdd00]">
                SCHEMATIC NOTE: Gap requires a conductive bridge.
              </span>
              <span className="text-[#8888aa] hidden sm:inline">
                Physics Law: Current flow = Metal conductor.
              </span>
            </div>
          </div>
        </div>

        {/* Meme Laugh / Failure Overlay Banner */}
        {isFailing && (
          <div className="w-full bg-[#ff4444] text-black p-2.5 border-3 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-2 font-heading font-black text-xs sm:text-sm uppercase">
              <XCircle size={18} className="text-black" />
              <span>WRONG! NO CURRENT FLOWS</span>
            </div>
            <div className="font-mono text-[10px] sm:text-xs font-black uppercase text-right">
              {failMessage}
            </div>
          </div>
        )}

        {/* 3 Physical Randomized Choices: ALPHA, BETA, GAMMA */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {shuffledChoices.map((choice) => {
            const isThisSelected = selectedChoice?.id === choice.id;
            return (
              <button
                key={choice.id}
                disabled={isProcessing || circuitPowered || victoryPhase !== 'idle'}
                onClick={() => handleSelectChoice(choice)}
                className={`p-3 border-3 sm:border-4 border-black flex flex-col items-center justify-between text-center transition-all cursor-pointer shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none min-h-[110px] ${
                  isThisSelected && choice.isCorrect
                    ? 'bg-[#44ff44] text-black font-black'
                    : isThisSelected && isFailing
                    ? 'bg-[#ff4444] text-white font-black'
                    : 'bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#f0f0ff]'
                }`}
              >
                {/* Button Letter Header */}
                <div className="w-full flex items-center justify-between border-b border-black/40 pb-1 mb-1.5">
                  <span className="font-pixel text-xs font-black px-1.5 py-0.5 bg-black text-[#ffdd00] border border-black">
                    [{choice.label}]
                  </span>
                  <span className="font-mono text-[9px] text-[#a0a0d0] font-bold uppercase">
                    ITEM REF
                  </span>
                </div>

                {/* Name */}
                <div className="font-heading font-extrabold text-xs sm:text-[13px] uppercase tracking-wide leading-tight my-1">
                  {choice.name}
                </div>

                {/* Material Subtitle */}
                <div className="font-mono text-[9px] sm:text-[10px] text-[#ffdd00] font-bold uppercase opacity-90">
                  {choice.material}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progressive Hint Drawer Bar */}
        <div className="w-full bg-[#121228] border-2 border-black p-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#ffdd00] font-bold uppercase">
              <HelpCircle size={13} />
              <span>NEED RELUCTANT GUIDANCE?</span>
            </div>
            <button
              onClick={handleProgressiveHint}
              className="px-2 py-0.5 bg-[#2a2a4a] hover:bg-[#ffdd00] text-[#f0f0ff] hover:text-black font-pixel text-[10px] font-black uppercase border border-black cursor-pointer transition-colors shadow-[1px_1px_0_0_#000]"
            >
              {hintLevel === 0
                ? 'REVEAL HINT 1'
                : hintLevel === 1
                ? 'REVEAL HINT 2'
                : hintLevel === 2
                ? 'REVEAL HINT 3'
                : 'CYCLE HINTS'}
            </button>
          </div>

          {hintLevel > 0 && (
            <div className="bg-[#080816] border border-[#ffdd00] p-2 text-left font-mono text-[11px] text-[#f0f0ff] animate-fadeIn">
              <span className="font-bold text-[#ffdd00] mr-1.5">
                {HINTS[hintLevel - 1].title}:
              </span>
              <span>{HINTS[hintLevel - 1].text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dramatic Floor 17 Victory Screen Overlay */}
      {victoryPhase !== 'idle' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          {/* Dark scanlines & CRT glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00f0ff 2px, #00f0ff 4px)',
            }}
          />

          <div className="relative z-10 max-w-md w-full bg-[#1a1a3a] border-8 border-black p-6 shadow-[0_0_30px_rgba(255,221,0,0.4),8px_8px_0_0_#000] flex flex-col items-center text-center">
            {/* Phase 1: Freeze / Impact */}
            {victoryPhase === 'freeze' && (
              <div className="py-8 font-mono text-sm text-[#ffdd00] font-black uppercase animate-pulse">
                [ CURRENT SURGE DETECTED // CONTACT ESTABLISHED ]
              </div>
            )}

            {/* Phase 2: FLOOR 17 CLEARED */}
            {(victoryPhase === 'cleared' || victoryPhase === 'elzzup-reaction') && (
              <div className="flex flex-col items-center my-4 animate-fadeIn">
                <div className="font-mono text-xs text-[#44ff44] font-black tracking-widest uppercase mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  CHAMBER_17 // OVERRIDE SUCCESS
                </div>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#ffdd00] uppercase tracking-tight drop-shadow-[3px_3px_0_#000]">
                  FLOOR 17
                </h1>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-widest mt-1 drop-shadow-[2px_2px_0_#000]">
                  CLEARED
                </h2>
              </div>
            )}

            {/* Phase 3: Short Elzzup Reaction */}
            {victoryPhase === 'elzzup-reaction' && (
              <div className="bg-[#0c0c1e] border-2 border-[#ffdd00] p-3 mt-3 w-full animate-fadeIn shadow-[2px_2px_0_0_#000]">
                <div className="font-pixel text-[10px] text-[#ffdd00] uppercase font-bold mb-1">
                  ELZZUP:
                </div>
                <p className="font-dialogue text-xs sm:text-sm text-[#c0c0e8] font-bold">
                  "...Tch. Basic grade-school physics. Don't get cocky. Floor 18 won't be that simple."
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
