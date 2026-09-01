import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RoomComponentProps } from '../types';
import { sound } from '../audio';
import {
  Zap,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Thermometer,
  Key,
} from 'lucide-react';

interface ChoiceItem {
  id: string;
  name: string;
  material: string;
  isCorrect: boolean;
  failFeedback: string;
}

export const Room17: React.FC<RoomComponentProps> = ({
  onSuccess,
  onTroll,
  soundEnabled,
}) => {
  // Stage state: 1, 2, or 3
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [isFailing, setIsFailing] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>('');

  // Stage 1 State: Circuit Conductor Choice
  const [stage1Selected, setStage1Selected] = useState<string | null>(null);

  // Stage 2 State: Thermal Conductor Choice (Alpha/Beta/Gamma randomized)
  const [stage2Selected, setStage2Selected] = useState<string | null>(null);

  // Stage 3 State: 3-Dial Final Deduction
  const [dialA, setDialA] = useState<number>(0);
  const [dialB, setDialB] = useState<number>(0);
  const [dialC, setDialC] = useState<number>(0);

  // Victory Sequence
  const [victoryPhase, setVictoryPhase] = useState<'idle' | 'freeze' | 'cleared' | 'elzzup-reaction'>('idle');

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // --- STAGE 1 CHOICES (Notice: Everyday metal paperclip vs polymer/wood) ---
  const stage1Choices: ChoiceItem[] = [
    {
      id: 'rubber',
      name: 'TITANIUM-COATED SYNTHETIC ERASER',
      material: 'Synthetic Elastomer Polymer',
      isCorrect: false,
      failFeedback: 'Rubber is an insulator! Coating cannot carry 12V current.',
    },
    {
      id: 'paperclip',
      name: 'COMMON STEEL PAPERCLIP',
      material: 'Galvanized Iron Wire',
      isCorrect: true,
      failFeedback: '',
    },
    {
      id: 'wood',
      name: 'CRYSTALLINE HARDWOOD PEG',
      material: 'Kiln-Dried Timber Dowel',
      isCorrect: false,
      failFeedback: 'Wood cannot conduct electrical charge!',
    },
  ];

  // --- STAGE 2 CHOICES (Question: Pure Copper vs Cryo-Liquid Gel vs Dense Ceramic) ---
  // Randomize physical positions of Alpha, Beta, Gamma every run
  const stage2Choices: ChoiceItem[] = useMemo(() => {
    const raw: ChoiceItem[] = [
      {
        id: 'copper',
        name: 'RAW COPPER HEATSINK SLAB',
        material: 'Elemental Cu (Thermal Cond: 400 W/m·K)',
        isCorrect: true,
        failFeedback: '',
      },
      {
        id: 'aerogel',
        name: 'QUANTUM CRYOGENIC AEROGEL',
        material: 'Ultra-Low Density Silica Foam',
        isCorrect: false,
        failFeedback: 'Aerogel is the world\'s best thermal INSULATOR, not a conductor!',
      },
      {
        id: 'ceramic',
        name: 'REINFORCED SILICON CERAMIC',
        material: 'Vitrified Thermal Barrier',
        isCorrect: false,
        failFeedback: 'Ceramic is a heat shield! Heat cannot dissipate through it.',
      },
    ];

    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    return raw;
  }, []);

  // Stage-specific Progressive Hints
  const HINTS: Record<1 | 2 | 3, Array<{ level: number; title: string; text: string }>> = {
    1: [
      {
        level: 1,
        title: 'HINT 1 [NOTICE]',
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
        text: "Elzzup: \"Think about basic science: Rubber and wood are INSULATORS. Only METAL allows electricity to flow.\"",
      },
    ],
    2: [
      {
        level: 1,
        title: 'HINT 1 [QUESTION]',
        text: "Elzzup: \"You assumed 'Cryogenic Aerogel' cools the core because it sounds cold? Aerogel traps heat inside.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [DIRECT]',
        text: "Elzzup: \"A heat sink must CONDUCT heat away from the CPU core into the radiator.\"",
      },
      {
        level: 3,
        title: 'HINT 3 [STRONG]',
        text: "Elzzup: \"Pure Copper is the universal thermal conductor used in real-world computers and heatsinks.\"",
      },
    ],
    3: [
      {
        level: 1,
        title: 'HINT 1 [DEDUCE]',
        text: "Elzzup: \"Combine your discoveries: Stage 1 bridged Electricity, Stage 2 transferred Heat. Look at the 3 physical dials.\"",
      },
      {
        level: 2,
        title: 'HINT 2 [CONNECTION]',
        text: "Elzzup: \"Dial A is Electrical Bridge count (1), Dial B is Thermal Bridge count (1), Dial C is Chamber Level (17).\"",
      },
      {
        level: 3,
        title: 'HINT 3 [NEAR-SOLUTION]',
        text: "Elzzup: \"Set Dial A to 1, Dial B to 1, and Dial C to 17 (or 7 if single-digit modulo), then press DISENGAGE.\"",
      },
    ],
  };

  const handleCycleHint = () => {
    sound.playClick(soundEnabled);
    setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  // --- STAGE 1 HANDLER ---
  const handleStage1Select = (choice: ChoiceItem) => {
    if (isProcessing || currentStage !== 1) return;
    sound.playClick(soundEnabled);
    setStage1Selected(choice.id);
    setIsProcessing(true);

    if (choice.isCorrect) {
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setHintLevel(0);
        setCurrentStage(2);
      }, 1000);
      timersRef.current.push(t);
    } else {
      handleFail(choice.failFeedback);
    }
  };

  // --- STAGE 2 HANDLER ---
  const handleStage2Select = (choice: ChoiceItem) => {
    if (isProcessing || currentStage !== 2) return;
    sound.playClick(soundEnabled);
    setStage2Selected(choice.id);
    setIsProcessing(true);

    if (choice.isCorrect) {
      sound.playSuccess(soundEnabled);
      const t = window.setTimeout(() => {
        setIsProcessing(false);
        setHintLevel(0);
        setCurrentStage(3);
      }, 1000);
      timersRef.current.push(t);
    } else {
      handleFail(choice.failFeedback);
    }
  };

  // --- STAGE 3 HANDLER ---
  const handleStage3Submit = () => {
    if (isProcessing || currentStage !== 3) return;
    sound.playClick(soundEnabled);
    setIsProcessing(true);

    // Target: Dial A = 1 (1st Conductor), Dial B = 1 (2nd Conductor), Dial C = 7 (Last digit of 17)
    if (dialA === 1 && dialB === 1 && dialC === 7) {
      sound.playSuccess(soundEnabled);

      const t1 = window.setTimeout(() => {
        setVictoryPhase('freeze');
        setScreenShake(true);

        const t2 = window.setTimeout(() => {
          setVictoryPhase('cleared');
          setScreenShake(false);
          sound.playLatchOpen(soundEnabled);

          const t3 = window.setTimeout(() => {
            setVictoryPhase('elzzup-reaction');

            const t4 = window.setTimeout(() => {
              onSuccess(
                'CHAMBER 17 OVERRIDDEN',
                'You noticed the true conductors, questioned the misleading jargon, and deduced the harmonic key.'
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
      handleFail('INCORRECT HARMONIC RATIO! Dial A = 1, Dial B = 1, Dial C = 7 (Floor 17 key).');
    }
  };

  const handleFail = (msg: string) => {
    setIsFailing(true);
    setFailMessage(msg);
    setScreenShake(true);
    sound.playGlitch(soundEnabled);

    const laughTimer = window.setTimeout(() => sound.playMemeLaugh(soundEnabled), 150);
    timersRef.current.push(laughTimer);

    const shakeTimer = window.setTimeout(() => setScreenShake(false), 500);
    timersRef.current.push(shakeTimer);

    const resetTimer = window.setTimeout(() => {
      setIsFailing(false);
      setIsProcessing(false);
      setStage1Selected(null);
      setStage2Selected(null);
    }, 2400);
    timersRef.current.push(resetTimer);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 select-none ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Top Chamber Header & Stage Progress Bar */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
        <div className="font-pixel text-[11px] sm:text-xs text-[#ffdd00] tracking-wider uppercase font-bold flex items-center gap-1.5 bg-[#0c0c1e] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0_0_#000]">
          <Zap size={14} className="text-[#ffdd00]" />
          <span>CHAMBER 17: EMPIRICAL DEDUCTION</span>
        </div>

        {/* 3-Stage Progress Indicator */}
        <div className="flex items-center gap-1.5 bg-[#101026] border-2 border-black px-2 py-1 shadow-[2px_2px_0_0_#000]">
          <span className="font-pixel text-[9px] text-[#a0a0d0] font-bold mr-1">
            STAGES:
          </span>
          {[1, 2, 3].map((stg) => (
            <span
              key={stg}
              className={`px-2 py-0.5 font-pixel text-[9px] font-black border border-black ${
                currentStage === stg
                  ? 'bg-[#ffdd00] text-black shadow-[0_0_8px_#ffdd00]'
                  : currentStage > stg
                  ? 'bg-[#44ff44] text-black'
                  : 'bg-[#1e1e38] text-[#666688]'
              }`}
            >
              STAGE {stg}
            </span>
          ))}
        </div>
      </div>

      {/* Main Console Box */}
      <div className="w-full max-w-2xl bg-[#1a1a3a] border-4 sm:border-6 border-black p-3 sm:p-5 shadow-[6px_6px_0_0_#000] flex flex-col items-center gap-3">
        {/* Error / Failure Banner */}
        {isFailing && (
          <div className="w-full bg-[#ff4444] text-black p-2.5 border-3 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-1.5 font-heading font-black text-xs sm:text-sm uppercase">
              <XCircle size={16} className="text-black shrink-0" />
              <span>WRONG!</span>
            </div>
            <div className="font-mono text-[10px] sm:text-xs font-black uppercase text-right">
              {failMessage}
            </div>
          </div>
        )}

        {/* --- STAGE 1: NOTICE (Electrical Conductivity) --- */}
        {currentStage === 1 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#ffdd00] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#ffdd00] font-black uppercase">
                STAGE 1 / 3: NOTICE THE TRUE CONDUCTOR
              </span>
              <span className="font-mono text-[9px] text-[#a0a0d0] font-bold">
                12V CURRENT GAP
              </span>
            </div>

            <div className="w-full bg-[#0c0c1e] border-3 border-black p-3 flex items-center justify-between">
              <div className="font-mono text-xs text-[#ffdd00] font-bold">
                BATTERY (+) ─── [ GAP ] ─── LIGHTBULB
              </div>
              <Lightbulb size={20} className="text-[#ffdd00] animate-pulse" />
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {stage1Choices.map((choice) => (
                <button
                  key={choice.id}
                  disabled={isProcessing}
                  onClick={() => handleStage1Select(choice)}
                  className={`p-3 border-3 border-black flex flex-col justify-between text-left cursor-pointer shadow-[3px_3px_0_0_#000] active:translate-y-0.5 min-h-[95px] ${
                    stage1Selected === choice.id
                      ? choice.isCorrect
                        ? 'bg-[#44ff44] text-black font-bold'
                        : 'bg-[#ff4444] text-white font-bold'
                      : 'bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#f0f0ff]'
                  }`}
                >
                  <div className="font-heading font-black text-xs uppercase leading-tight">
                    {choice.name}
                  </div>
                  <div className="font-mono text-[9px] text-[#ffdd00] font-bold mt-1">
                    {choice.material}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STAGE 2: QUESTION (Thermal Conduction vs Insulation) --- */}
        {currentStage === 2 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#ffdd00] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#ffdd00] font-black uppercase">
                STAGE 2 / 3: QUESTION THE JARGON (THERMAL HEATSINK)
              </span>
              <Thermometer size={14} className="text-[#ff4444] animate-pulse" />
            </div>

            <p className="font-mono text-[10px] text-[#a0a0d0] text-center leading-tight">
              The overheated CPU core is throttling at 98°C. Select the material that conducts heat AWAY from the chip into the heatsink fins.
            </p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {stage2Choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  disabled={isProcessing}
                  onClick={() => handleStage2Select(choice)}
                  className={`p-3 border-3 border-black flex flex-col justify-between text-left cursor-pointer shadow-[3px_3px_0_0_#000] active:translate-y-0.5 min-h-[95px] ${
                    stage2Selected === choice.id
                      ? choice.isCorrect
                        ? 'bg-[#44ff44] text-black font-bold'
                        : 'bg-[#ff4444] text-white font-bold'
                      : 'bg-[#2a2a4a] hover:bg-[#3a3a6a] text-[#f0f0ff]'
                  }`}
                >
                  <div className="w-full flex items-center justify-between border-b border-black/40 pb-1 mb-1">
                    <span className="font-pixel text-[10px] font-black px-1.5 py-0.2 bg-black text-[#ffdd00]">
                      [{idx === 0 ? 'ALPHA' : idx === 1 ? 'BETA' : 'GAMMA'}]
                    </span>
                  </div>
                  <div className="font-heading font-black text-xs uppercase leading-tight">
                    {choice.name}
                  </div>
                  <div className="font-mono text-[9px] text-[#ffdd00] font-bold mt-1">
                    {choice.material}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STAGE 3: DEDUCE (Harmonic Combination) --- */}
        {currentStage === 3 && (
          <div className="w-full flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-full bg-[#101026] border-2 border-[#44ff44] p-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#44ff44] font-black uppercase flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                STAGE 3 / 3: DEDUCE THE CHAMBER KEY
              </span>
              <Key size={14} className="text-[#ffdd00]" />
            </div>

            <p className="font-mono text-[10px] text-[#a0a0d0] text-center leading-tight">
              Combine your Stage 1 & 2 bridges with Chamber 17's frequency signature. Set: Dial A = Electrical Bridges (1), Dial B = Thermal Bridges (1), Dial C = Floor Key (7).
            </p>

            <div className="flex items-center justify-center gap-4 my-2">
              {/* Dial A */}
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[9px] text-[#a0a0d0] font-bold">DIAL A</span>
                <button
                  onClick={() => {
                    sound.playClick(soundEnabled);
                    setDialA((p) => (p + 1) % 10);
                  }}
                  className="w-12 h-8 bg-[#2a2a4a] hover:bg-[#ffdd00] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▲
                </button>
                <div className="w-12 h-12 bg-black border-3 border-[#ffdd00] flex items-center justify-center font-heading font-black text-2xl text-[#ffdd00]">
                  {dialA}
                </div>
              </div>

              {/* Dial B */}
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[9px] text-[#a0a0d0] font-bold">DIAL B</span>
                <button
                  onClick={() => {
                    sound.playClick(soundEnabled);
                    setDialB((p) => (p + 1) % 10);
                  }}
                  className="w-12 h-8 bg-[#2a2a4a] hover:bg-[#ffdd00] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▲
                </button>
                <div className="w-12 h-12 bg-black border-3 border-[#ffdd00] flex items-center justify-center font-heading font-black text-2xl text-[#ffdd00]">
                  {dialB}
                </div>
              </div>

              {/* Dial C */}
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[9px] text-[#a0a0d0] font-bold">DIAL C</span>
                <button
                  onClick={() => {
                    sound.playClick(soundEnabled);
                    setDialC((p) => (p + 1) % 10);
                  }}
                  className="w-12 h-8 bg-[#2a2a4a] hover:bg-[#ffdd00] hover:text-black border-2 border-black font-pixel text-xs font-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                >
                  ▲
                </button>
                <div className="w-12 h-12 bg-black border-3 border-[#ffdd00] flex items-center justify-center font-heading font-black text-2xl text-[#ffdd00]">
                  {dialC}
                </div>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleStage3Submit}
              className="w-full py-2.5 bg-[#44ff44] hover:bg-[#66ff66] text-black border-3 border-black font-heading font-black text-xs sm:text-sm uppercase shadow-[3px_3px_0_0_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              DISENGAGE CHAMBER 17 INTERLOCK
            </button>
          </div>
        )}

        {/* Progressive Hint Drawer */}
        <div className="w-full bg-[#121228] border-2 border-black p-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#ffdd00] font-bold uppercase">
              <HelpCircle size={13} />
              <span>STAGE {currentStage} RELUCTANT GUIDANCE</span>
            </div>
            <button
              onClick={handleCycleHint}
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
                {HINTS[currentStage][hintLevel - 1].title}:
              </span>
              <span>{HINTS[currentStage][hintLevel - 1].text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Victory Overlay Modal */}
      {victoryPhase !== 'idle' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, #00f0ff 2px, #00f0ff 4px)',
            }}
          />

          <div className="relative z-10 max-w-md w-full bg-[#1a1a3a] border-8 border-black p-6 shadow-[0_0_30px_rgba(255,221,0,0.4),8px_8px_0_0_#000] flex flex-col items-center text-center">
            {victoryPhase === 'freeze' && (
              <div className="py-8 font-mono text-sm text-[#ffdd00] font-black uppercase animate-pulse">
                [ CURRENT HARMONIZED // INTERLOCK BREACHED ]
              </div>
            )}

            {(victoryPhase === 'cleared' || victoryPhase === 'elzzup-reaction') && (
              <div className="flex flex-col items-center my-4 animate-fadeIn">
                <div className="font-mono text-xs text-[#44ff44] font-black tracking-widest uppercase mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  CHAMBER_17 // COMPLETE
                </div>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#ffdd00] uppercase tracking-tight drop-shadow-[3px_3px_0_#000]">
                  FLOOR 17
                </h1>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-widest mt-1 drop-shadow-[2px_2px_0_#000]">
                  CLEARED
                </h2>
              </div>
            )}

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
