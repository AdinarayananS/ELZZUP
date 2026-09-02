import React, { useState, useEffect, useRef } from 'react';
import { PixelButton } from './PixelButton';
import { Logo } from './Logo';
import { Home, Sparkles, CheckCircle2, Trophy, ShieldCheck, Flame, Heart } from 'lucide-react';
import { sound } from '../audio';

interface FinalVictoryProps {
  onBackToMenu: () => void;
  soundEnabled: boolean;
}

type EndingPhase =
  | 'phase-1-final-hit'       // 1. Final hit, freeze, massive impact boom, flash, shake
  | 'phase-2-elzzup-falls'     // 2. Sprite disintegration, glitch collapse -> Silence
  | 'phase-3-world-reacts'     // 3. Glitch clears, world restores to calm emerald/gold
  | 'phase-4-final-words'      // 4. Elzzup's final lines ("...You actually did it." "I hate that." "...Well played.")
  | 'phase-5-massive-reveal'   // 5. 20 -> FLOORS -> ELZZUP DEFEATED
  | 'phase-6-celebration'      // 6. Retro pixel fireworks, confetti, arcade victory fanfare
  | 'phase-7-floor10-callback' // 7. "ELZZUP DEFEATED?" -> "ELZZUP DEFEATED. ...FOR REAL."
  | 'phase-8-journey-summary'  // 8. The Elzzup Gauntlet (20 Floors, 1 Trickster, Countless Mistakes, 1 Victory)
  | 'phase-9-final-message'    // 9. YOU WIN. Thanks for playing. "...and yes. This time, you really won."
  | 'phase-10-menu-button';    // 10. Genuine RETURN TO MAIN MENU

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  gravity: number;
  life: number;
}

export const FinalVictory: React.FC<FinalVictoryProps> = ({ onBackToMenu, soundEnabled }) => {
  const [phase, setPhase] = useState<EndingPhase>('phase-1-final-hit');
  const [elzzupDialogueStep, setElzzupDialogueStep] = useState<number>(0);
  const [screenFlash, setScreenFlash] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [floor10Step, setFloor10Step] = useState<'normal' | 'question' | 'for-real'>('normal');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  // Timeline progression through all 10 phases
  useEffect(() => {
    // PHASE 1: Final Hit (0.0s - 1.2s)
    // Instant impact flash & screen shake
    setScreenFlash(true);
    setScreenShake(true);
    sound.playBossImpact(soundEnabled);

    const flashOff = window.setTimeout(() => setScreenFlash(false), 300);
    timersRef.current.push(flashOff);

    const shakeOff = window.setTimeout(() => setScreenShake(false), 800);
    timersRef.current.push(shakeOff);

    // PHASE 2: Elzzup Falls & Disintegrates (1.2s - 3.8s)
    const t2 = window.setTimeout(() => {
      setPhase('phase-2-elzzup-falls');
      sound.playGlitch(soundEnabled);
    }, 1200);
    timersRef.current.push(t2);

    // PHASE 3: The World Reacts (3.8s - 7.2s)
    const t3 = window.setTimeout(() => {
      setPhase('phase-3-world-reacts');
      sound.playRestoreChime(soundEnabled);
    }, 3800);
    timersRef.current.push(t3);

    // PHASE 4: The Final Elzzup Moment (7.2s - 11.0s)
    const t4 = window.setTimeout(() => {
      setPhase('phase-4-final-words');
      setElzzupDialogueStep(1); // "...You actually did it."
      sound.playClick(soundEnabled);

      const d2 = window.setTimeout(() => {
        setElzzupDialogueStep(2); // "I hate that."
        sound.playClick(soundEnabled);
      }, 1200);
      timersRef.current.push(d2);

      const d3 = window.setTimeout(() => {
        setElzzupDialogueStep(3); // "...Well played."
        sound.playClick(soundEnabled);
      }, 2400);
      timersRef.current.push(d3);
    }, 7200);
    timersRef.current.push(t4);

    // PHASE 5: Massive Victory Reveal (11.0s - 14.5s)
    const t5 = window.setTimeout(() => {
      setPhase('phase-5-massive-reveal');
      setScreenShake(true);
      sound.playVictoryFanfare(soundEnabled);
      const shakeOff2 = window.setTimeout(() => setScreenShake(false), 600);
      timersRef.current.push(shakeOff2);
    }, 11000);
    timersRef.current.push(t5);

    // PHASE 6: Celebration (Fireworks & Confetti) (14.5s - 18.0s)
    const t6 = window.setTimeout(() => {
      setPhase('phase-6-celebration');
      spawnFirework(150, 120, '#ffdd00');
      spawnFirework(450, 100, '#00f0ff');
      spawnFirework(300, 80, '#ff4444');
      sound.playPixelFirework(soundEnabled);

      const fw2 = window.setTimeout(() => {
        spawnFirework(200, 90, '#44ff44');
        spawnFirework(500, 130, '#ff00ea');
        sound.playPixelFirework(soundEnabled);
      }, 800);
      timersRef.current.push(fw2);
    }, 14500);
    timersRef.current.push(t6);

    // PHASE 7: Callback to Floor 10 (18.0s - 21.5s)
    const t7 = window.setTimeout(() => {
      setPhase('phase-7-floor10-callback');
      setFloor10Step('normal'); // "ELZZUP DEFEATED"

      const qStep = window.setTimeout(() => {
        setFloor10Step('question'); // "ELZZUP DEFEATED?"
        sound.playGlitch(soundEnabled, 0.3);
      }, 1100);
      timersRef.current.push(qStep);

      const realStep = window.setTimeout(() => {
        setFloor10Step('for-real'); // "ELZZUP DEFEATED. ...FOR REAL."
        setScreenShake(true);
        sound.playSuccess(soundEnabled);
        const shakeOff3 = window.setTimeout(() => setScreenShake(false), 400);
        timersRef.current.push(shakeOff3);
      }, 2200);
      timersRef.current.push(realStep);
    }, 18000);
    timersRef.current.push(t7);

    // PHASE 8: The Journey Summary (21.5s - 24.5s)
    const t8 = window.setTimeout(() => {
      setPhase('phase-8-journey-summary');
      sound.playLatchOpen(soundEnabled);
    }, 21500);
    timersRef.current.push(t8);

    // PHASE 9: Final Message (24.5s - 27.5s)
    const t9 = window.setTimeout(() => {
      setPhase('phase-9-final-message');
      sound.playSuccess(soundEnabled, 0.6);
    }, 24500);
    timersRef.current.push(t9);

    // PHASE 10: Menu Button (27.5s+)
    const t10 = window.setTimeout(() => {
      setPhase('phase-10-menu-button');
    }, 27500);
    timersRef.current.push(t10);

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [soundEnabled]);

  // Pixel particle & firework spawner
  const spawnFirework = (x: number, y: number, color: string) => {
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() > 0.5 ? 4 : 6,
        alpha: 1.0,
        gravity: 0.06,
        life: 1.0,
      });
    }
  };

  // Continuous celebratory confetti in Phase 6 & Phase 10
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn falling confetti
      if ((phase === 'phase-6-celebration' || phase === 'phase-10-menu-button') && Math.random() < 0.3) {
        const colors = ['#ffdd00', '#00f0ff', '#44ff44', '#ff4444', '#ff00ea', '#ffffff'];
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 1.5 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.floor(Math.random() * 4),
          alpha: 1.0,
          gravity: 0.02,
          life: 1.0,
        });
      }

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= dt * 0.7;
        p.alpha = Math.max(0, p.life);

        if (p.alpha <= 0 || p.y > canvas.height + 20) return false;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        return true;
      });

      ctx.globalAlpha = 1.0;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [phase]);

  // Fast forward helper for players replaying
  const handleSkipToEnd = () => {
    sound.playSuccess(soundEnabled);
    setPhase('phase-10-menu-button');
  };

  return (
    <div
      className={`relative w-full max-w-[840px] my-auto select-none transition-all duration-100 ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Screen Bright Flash Overlay during Impact */}
      {screenFlash && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none animate-pulse" />
      )}

      {/* Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        width={840}
        height={580}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* Main Victory Outer Frame */}
      <div className="w-full bg-[#121228] border-8 border-black p-1 shadow-[0_16px_0_0_#000] relative overflow-hidden">
        {/* Skip button for replaying players */}
        {phase !== 'phase-10-menu-button' && (
          <button
            onClick={handleSkipToEnd}
            className="absolute top-3 right-3 z-40 px-2.5 py-1 bg-black/80 hover:bg-black text-[#a0a0d0] hover:text-[#ffdd00] font-mono text-[10px] font-bold uppercase border border-black cursor-pointer tracking-wider"
          >
            [ Skip Finale ▶ ]
          </button>
        )}

        <div
          className={`border-4 border-black p-6 sm:p-10 flex flex-col items-center justify-center text-center relative min-h-[500px] sm:min-h-[560px] transition-colors duration-1000 ${
            phase === 'phase-3-world-reacts'
              ? 'bg-[#0a1e1e]'
              : phase === 'phase-5-massive-reveal' || phase === 'phase-6-celebration'
              ? 'bg-[#180a2a]'
              : 'bg-[#0f0c1a]'
          }`}
        >
          {/* Subtle Ambient Scanlines & Particle Glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #ffdd00 2px, #ffdd00 4px)',
            }}
          />

          {/* ========================================================= */}
          {/* PHASE 1: FINAL HIT                                        */}
          {/* ========================================================= */}
          {phase === 'phase-1-final-hit' && (
            <div className="my-auto flex flex-col items-center gap-4 animate-fadeIn">
              <div className="w-24 h-24 bg-black border-4 border-[#ff4444] shadow-[0_0_30px_#ff4444] flex items-center justify-center scale-110">
                <Logo size="md" mood="glitched" isCorrupted={true} animated={false} />
              </div>
              <div className="font-heading font-black text-2xl text-[#ff4444] uppercase tracking-widest animate-pulse">
                [ CRITICAL IMPACT // MATRIX SEVERED ]
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 2: ELZZUP FALLS & DISINTEGRATES                     */}
          {/* ========================================================= */}
          {phase === 'phase-2-elzzup-falls' && (
            <div className="my-auto flex flex-col items-center gap-4 animate-fadeOut">
              <div className="w-28 h-28 bg-black border-4 border-[#ff4444] p-2 flex items-center justify-center animate-spin scale-75 opacity-60">
                <Logo size="md" mood="worried" isCorrupted={true} animated={false} />
              </div>
              <div className="font-mono text-xs text-[#a0a0d0] uppercase tracking-widest animate-pulse">
                // ENTITY CORE DISSOLVING...
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 3: THE WORLD REACTS & RESTORES                      */}
          {/* ========================================================= */}
          {phase === 'phase-3-world-reacts' && (
            <div className="my-auto flex flex-col items-center gap-5 animate-fadeIn max-w-lg">
              <div className="w-20 h-20 bg-[#08201a] border-4 border-[#44ff44] shadow-[0_0_30px_rgba(68,255,68,0.4)] flex items-center justify-center">
                <Sparkles size={36} className="text-[#44ff44] animate-spin" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-[#44ff44] uppercase tracking-wider drop-shadow-[2px_2px_0_#000]">
                  SYSTEM STABILIZED
                </h3>
                <p className="font-mono text-xs sm:text-sm text-[#a0ffd0] mt-1 font-bold tracking-wide">
                  Corrupted sectors cleared. Neural architecture restored to harmony.
                </p>
              </div>
              <div className="font-mono text-[10px] text-[#55aa88] uppercase tracking-widest">
                [ ELZZUP HAS BEEN DISCONNECTED FROM THE MAINFRAME ]
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 4: THE FINAL ELZZUP MOMENT                          */}
          {/* ========================================================= */}
          {phase === 'phase-4-final-words' && (
            <div className="my-auto flex flex-col items-center gap-4 animate-fadeIn max-w-md w-full">
              <div className="w-20 h-20 bg-black border-3 border-[#ff8888] flex items-center justify-center p-1">
                <Logo size="sm" mood="worried" isCorrupted={false} animated={false} />
              </div>
              <div className="w-full bg-[#120820] border-4 border-[#ffdd00] p-5 shadow-[6px_6px_0_0_#000] text-center">
                <div className="font-pixel text-[10px] text-[#ffdd00] uppercase font-bold mb-2 flex items-center justify-center gap-1.5">
                  <Flame size={12} className="text-[#ffdd00]" />
                  <span>ELZZUP // FINAL TRANSMISSION</span>
                </div>
                {elzzupDialogueStep >= 1 && (
                  <p className="font-dialogue font-black text-base sm:text-lg text-white leading-snug animate-fadeIn">
                    "...You actually did it."
                  </p>
                )}
                {elzzupDialogueStep >= 2 && (
                  <p className="font-dialogue font-black text-sm sm:text-base text-[#ff8888] mt-1.5 animate-fadeIn">
                    "I hate that."
                  </p>
                )}
                {elzzupDialogueStep >= 3 && (
                  <p className="font-dialogue font-bold text-xs sm:text-sm text-[#a0a0d0] mt-2 italic animate-fadeIn">
                    "...Well played."
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 5 & 6: MASSIVE VICTORY REVEAL & CELEBRATION         */}
          {/* ========================================================= */}
          {(phase === 'phase-5-massive-reveal' || phase === 'phase-6-celebration') && (
            <div className="my-auto flex flex-col items-center w-full animate-fadeIn">
              <div className="font-mono text-xs sm:text-sm text-[#44ff44] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>20 FLOORS SURVIVED</span>
              </div>

              {/* Giant Chunky Pixel Art Headline: ELZZUP DEFEATED */}
              <div className="my-2">
                <h1 className="font-heading font-black text-5xl sm:text-7xl md:text-8xl text-[#ffdd00] uppercase tracking-tight text-glitch drop-shadow-[5px_5px_0_#000] leading-none">
                  ELZZUP
                </h1>
                <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-widest drop-shadow-[4px_4px_0_#000] mt-1">
                  DEFEATED
                </h2>
              </div>

              <div className="font-mono text-xs sm:text-sm text-[#00f0ff] uppercase tracking-widest font-bold mt-2 animate-pulse">
                ★ TRUE VICTORY ACHIEVED ★
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 7: CALLBACK TO FLOOR 10                             */}
          {/* ========================================================= */}
          {phase === 'phase-7-floor10-callback' && (
            <div className="my-auto flex flex-col items-center w-full max-w-lg p-6 bg-[#0a0a1a] border-4 border-black shadow-[6px_6px_0_0_#000] animate-fadeIn">
              {floor10Step === 'normal' && (
                <div className="font-heading font-black text-3xl sm:text-4xl text-[#ffdd00] uppercase">
                  ELZZUP DEFEATED
                </div>
              )}

              {floor10Step === 'question' && (
                <div className="font-heading font-black text-3xl sm:text-4xl text-[#ff4444] uppercase animate-pulse">
                  ELZZUP DEFEATED?
                </div>
              )}

              {floor10Step === 'for-real' && (
                <div className="flex flex-col items-center gap-2 animate-fadeIn">
                  <div className="font-heading font-black text-4xl sm:text-5xl text-[#ffdd00] uppercase drop-shadow-[3px_3px_0_#000]">
                    ELZZUP DEFEATED.
                  </div>
                  <div className="font-mono font-bold text-2xl sm:text-3xl text-[#44ff44] tracking-widest uppercase drop-shadow-[2px_2px_0_#000]">
                    ...FOR REAL.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 8: THE JOURNEY SUMMARY                              */}
          {/* ========================================================= */}
          {phase === 'phase-8-journey-summary' && (
            <div className="my-auto flex flex-col items-center w-full max-w-md bg-[#100c24] border-4 border-[#ffdd00] p-6 shadow-[8px_8px_0_0_#000] animate-fadeIn">
              <div className="font-pixel text-xs text-[#ffdd00] uppercase font-bold tracking-wider mb-4 border-b-2 border-black pb-2 w-full text-center">
                THE ELZZUP GAUNTLET
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mb-2">
                <div className="bg-[#080816] border-2 border-black p-2.5 flex flex-col items-center">
                  <span className="font-heading font-black text-xl text-[#44ff44]">20</span>
                  <span className="font-mono text-[11px] text-[#e0e0ff] uppercase font-black">FLOORS</span>
                </div>
                <div className="bg-[#080816] border-2 border-black p-2.5 flex flex-col items-center">
                  <span className="font-heading font-black text-xl text-[#ff4444]">1</span>
                  <span className="font-mono text-[11px] text-[#e0e0ff] uppercase font-black">TRICKSTER</span>
                </div>
                <div className="bg-[#080816] border-2 border-black p-2.5 flex flex-col items-center">
                  <span className="font-heading font-black text-xl text-[#ff8888]">COUNTLESS</span>
                  <span className="font-mono text-[11px] text-[#e0e0ff] uppercase font-black">MISTAKES</span>
                </div>
                <div className="bg-[#080816] border-2 border-black p-2.5 flex flex-col items-center">
                  <span className="font-heading font-black text-xl text-[#ffdd00]">1</span>
                  <span className="font-mono text-[11px] text-[#e0e0ff] uppercase font-black">TRUE VICTORY</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 9: FINAL MESSAGE                                    */}
          {/* ========================================================= */}
          {phase === 'phase-9-final-message' && (
            <div className="my-auto flex flex-col items-center gap-3 animate-fadeIn">
              <h1 className="font-heading font-black text-5xl sm:text-6xl text-[#44ff44] uppercase tracking-tight drop-shadow-[4px_4px_0_#000]">
                YOU WIN.
              </h1>
              <p className="font-dialogue font-bold text-base sm:text-lg text-white">
                Thanks for playing.
              </p>
              <div className="bg-[#1a1a3a] border-2 border-[#ffdd00] px-4 py-2 mt-2">
                <p className="font-mono text-xs sm:text-sm text-[#ffdd00] font-bold">
                  "...and yes. This time, you really won."
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 10: RETURN TO MAIN MENU                             */}
          {/* ========================================================= */}
          {phase === 'phase-10-menu-button' && (
            <div className="my-auto flex flex-col items-center w-full max-w-sm animate-fadeIn">
              <div className="w-16 h-16 bg-black border-3 border-[#44ff44] flex items-center justify-center mb-3">
                <Trophy size={32} className="text-[#ffdd00]" />
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#ffdd00] uppercase tracking-tight drop-shadow-[3px_3px_0_#000] mb-1">
                YOU WIN.
              </h1>
              <p className="font-mono text-xs text-[#e0e0ff] uppercase font-bold tracking-wider mb-6">
                THE GAUNTLET IS COMPLETE.
              </p>

              <PixelButton
                variant="primary"
                size="lg"
                fullWidth
                soundEnabled={soundEnabled}
                onClick={onBackToMenu}
                icon={<Home size={20} className="text-black" />}
              >
                RETURN TO MAIN MENU
              </PixelButton>

              <p className="font-mono text-xs text-[#a0a0d0] mt-3 font-bold">
                [ 100% CLEAN EXIT // PROGRESS PRESERVED ]
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
