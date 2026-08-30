import React, { useState, useEffect, useRef } from 'react';
import { RoomHeader } from './RoomHeader';
import { SuccessOverlay } from './SuccessOverlay';
import { TrollOverlay } from './TrollOverlay';
import { PauseOverlay } from './PauseOverlay';
import { PixelButton } from './PixelButton';
import { MascotMood } from './Logo';
import { getRoomById, TOTAL_ROOMS } from '../rooms/RoomRegistry';
import { GameSettings, OverlayType, OverlayData } from '../types';
import { RotateCcw, Lightbulb, X } from 'lucide-react';
import { sound } from '../audio';

interface GameScreenProps {
  currentRoomId: number;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onRoomComplete: (roomId: number) => void;
  onResetProgress: () => void;
  onExitToMenu: () => void;
  isGlitching: boolean;
  setIsGlitching: (val: boolean) => void;
}

// Subtle evolving personality remarks for ELZZUP by room
const ROOM_ENTRY_REMARKS: Record<number, string> = {
  1: 'Click it.',
  2: 'Twice as fun.',
  3: 'Choose wisely.',
  4: 'Hold still...',
  5: 'Now you see it.',
  6: 'Follow the rules.',
  7: 'Read the logs.',
  8: 'Don\'t touch that.',
  9: 'Almost done.',
  10: 'You\'re still here?',
};

const POKE_REMARKS = [
  'I\'m watching.',
  'Focus on the puzzle.',
  'Don\'t poke me.',
  '...',
  'Solve it.',
];

export const GameScreen: React.FC<GameScreenProps> = ({
  currentRoomId,
  settings,
  onUpdateSettings,
  onRoomComplete,
  onResetProgress,
  onExitToMenu,
  isGlitching,
  setIsGlitching,
}) => {
  const [roomKey, setRoomKey] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [roomErrors, setRoomErrors] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [overlay, setOverlay] = useState<OverlayType>('none');
  const [overlayData, setOverlayData] = useState<OverlayData>({});
  const [showHint, setShowHint] = useState(false);
  const [elzzupReaction, setElzzupReaction] = useState<string | null>(null);

  const reactionTimeoutRef = useRef<number | null>(null);
  const roomDef = getRoomById(currentRoomId);

  // Determine ELZZUP's mood based on floor progression
  const getMascotMood = (): MascotMood => {
    if (isGlitching) return 'glitched';
    if (currentRoomId <= 3) return 'smug';
    if (currentRoomId <= 7) return 'suspicious';
    if (currentRoomId <= 9) return 'worried';
    return 'worried';
  };

  // Helper to trigger a short ELZZUP remark
  const triggerReaction = (text: string, durationMs = 2800) => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
    }
    setElzzupReaction(text);
    reactionTimeoutRef.current = window.setTimeout(() => {
      setElzzupReaction(null);
      reactionTimeoutRef.current = null;
    }, durationMs);
  };

  // Subtle reaction when entering a new room
  useEffect(() => {
    const remark = ROOM_ENTRY_REMARKS[currentRoomId];
    if (remark) {
      const timer = setTimeout(() => {
        triggerReaction(remark);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentRoomId, roomKey]);

  // Clean up reaction timers
  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, []);

  // Timer counter
  useEffect(() => {
    if (overlay !== 'none') return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [overlay, currentRoomId, roomKey]);

  // Handle Room Reset with personality reaction
  const handleRestartRoom = () => {
    const nextResets = resetCount + 1;
    setResetCount(nextResets);
    setRoomKey((prev) => prev + 1);
    setElapsedSeconds(0);
    setOverlay('none');
    setShowHint(false);
    setIsGlitching(false);
    sound.playClick(settings.sound);

    if (nextResets === 1) {
      triggerReaction('Again?');
    } else if (nextResets === 3) {
      triggerReaction('Really?');
    } else if (nextResets === 5) {
      triggerReaction('Need a hint?');
    }
  };

  // Handle Success trigger from room
  const handleSuccess = (customTitle?: string, customSubtitle?: string) => {
    if (!roomDef) return;
    if (elapsedSeconds <= 4 && currentRoomId > 1) {
      triggerReaction('Oh.');
    }
    setOverlayData({
      successTitle: customTitle || roomDef.defaultSuccessMessage,
      successSubtitle: customSubtitle || roomDef.defaultSuccessSubmessage,
    });
    setOverlay('success');
  };

  // Handle Troll / Failure trigger from room
  const handleTroll = (title?: string, message?: string, errCode?: string) => {
    if (!roomDef) return;
    const newErrorCount = roomErrors + 1;
    setRoomErrors(newErrorCount);
    setIsGlitching(true);

    if (currentRoomId === 6) {
      triggerReaction('I said don\'t.');
    } else if (currentRoomId === 8) {
      triggerReaction('I warned you.');
    } else if (newErrorCount >= 2) {
      triggerReaction('Really?');
    } else {
      triggerReaction('I saw that.');
    }

    setOverlayData({
      trollTitle: title || roomDef.defaultTrollTitle || 'OOPS.',
      trollSubtitle: message || roomDef.defaultTrollMessage || 'WAS THAT IMPORTANT?',
      trollCode: errCode || 'ERR_CODE: 0xDEADBEEF // SEQ: FAILED',
    });
    setOverlay('troll');
  };

  // Easter egg: Clicking ELZZUP's mascot avatar
  const handleMascotPoke = () => {
    sound.playClick(settings.sound);
    const randomRemark = POKE_REMARKS[Math.floor(Math.random() * POKE_REMARKS.length)];
    triggerReaction(randomRemark, 2200);
  };

  // Proceed to Next Room
  const handleNextRoom = () => {
    setOverlay('none');
    setResetCount(0);
    setRoomErrors(0);
    onRoomComplete(currentRoomId);
  };

  if (!roomDef) {
    return (
      <div className="w-full max-w-xl bg-[#1a1a3a] border-8 border-black p-8 sm:p-12 shadow-[0_12px_0_0_#000] text-center">
        <div className="border-2 border-black bg-[#2a2a4a] p-6 sm:p-8">
          <div className="mb-2 font-mono text-xs text-[#a0a0d0] uppercase tracking-widest font-bold">
            // STATUS: RESTRICTED ACCESS
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#ffdd00] uppercase tracking-tight mb-3">
            Room {currentRoomId} Under Construction
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#f0f0ff] mb-6">
            You reached the frontier of the active facility testing protocol.
          </p>
          <PixelButton variant="primary" onClick={onExitToMenu}>
            Return to Menu
          </PixelButton>
        </div>
      </div>
    );
  }

  const RoomComponent = roomDef.component;

  return (
    <div className="w-full max-w-[1200px] min-h-[580px] sm:min-h-[660px] bg-[#1a1a3a] border-6 sm:border-8 border-black relative flex flex-col justify-between overflow-hidden shadow-[0_12px_0_0_#000]">
      {/* 1. Header Bar with Mascot HUD & Personality Reactions */}
      <RoomHeader
        roomId={roomDef.id}
        chapterId={roomDef.chapter}
        chapterTitle={roomDef.chapterTitle}
        elapsedSeconds={elapsedSeconds}
        onPause={() => setOverlay('pause')}
        onRestart={handleRestartRoom}
        isGlitching={isGlitching}
        mascotMood={getMascotMood()}
        elzzupReaction={elzzupReaction}
        onMascotPoke={handleMascotPoke}
      />

      {/* 2. Main Gameplay Stage with Atmospheric Pixel Facility Environment */}
      <div className="flex-1 relative flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 overflow-hidden pixel-facility-wall gap-3 sm:gap-4">
        {/* Subtle Background Facility Details (Low Contrast, Atmospheric) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top Industrial Ceiling Conduit Loom */}
          <div className="absolute top-0 left-0 right-0 pixel-conduit-h opacity-70" />
          <div className="absolute top-0 left-12 w-2 h-3 bg-[#ffdd00]/30 border-x border-black" />
          <div className="absolute top-0 left-1/4 w-2 h-3 bg-[#ffdd00]/30 border-x border-black" />
          <div className="absolute top-0 right-1/4 w-2 h-3 bg-[#ffdd00]/30 border-x border-black" />
          <div className="absolute top-0 right-12 w-2 h-3 bg-[#ffdd00]/30 border-x border-black" />

          {/* Left Upper Industrial Vent */}
          <div className="absolute top-6 left-4 sm:left-8 w-12 sm:w-16 h-8 sm:h-10 pixel-vent-grate opacity-40 hidden sm:block" />

          {/* Right Upper Environmental Micro Monitor & LED cluster */}
          <div className="absolute top-6 right-4 sm:right-8 flex items-center gap-3 opacity-50 hidden sm:flex">
            {/* LED Status Cluster */}
            <div className="flex flex-col gap-1.5 p-1 bg-black/60 border border-black">
              <div className="w-1.5 h-1.5 bg-[#44ff44] animate-led-slow" />
              <div className="w-1.5 h-1.5 bg-[#ffdd00] animate-led-fast" />
              <div className="w-1.5 h-1.5 bg-[#00f0ff] animate-led-slow" />
            </div>

            {/* Tiny Background Status Monitor */}
            <div className="w-20 h-10 pixel-bg-monitor p-1 font-mono text-[6px] text-[#00f0ff]/60 leading-tight select-none">
              <div>// SUB-SYS</div>
              <div>CHMBR: {roomDef.id.toString().padStart(2, '0')}</div>
              <div className={isGlitching ? 'text-[#ff4444]' : 'text-[#44ff44]/70'}>
                {isGlitching ? 'ENV: UNSTABLE' : 'ENV: STABLE'}
              </div>
            </div>
          </div>

          {/* Vertical Conduit Pipes */}
          <div className="absolute top-0 bottom-0 left-2 pixel-conduit-v opacity-30 hidden md:block" />
          <div className="absolute top-0 bottom-0 right-2 pixel-conduit-v opacity-30 hidden md:block" />

          {/* Subtle floating ambient dust pixels */}
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-[#ffdd00]/20 animate-pulse hidden sm:block" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#00f0ff]/20 animate-ping hidden sm:block" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#ffffff]/15 animate-pulse hidden sm:block" />

          {/* Grounded Chamber Base Floor Shading */}
          <div className="absolute bottom-0 left-0 right-0 h-28 pixel-chamber-floor opacity-85 border-t-2 border-black/80" />
        </div>

        {/* Crisp Instruction Objective Banner */}
        <div className="w-full max-w-4xl z-20 flex justify-center">
          <div className="bg-[#1a1a3a] border-2 sm:border-3 border-black px-4 sm:px-6 py-2 shadow-[3px_3px_0_0_#ffdd00] flex items-center justify-center gap-2 sm:gap-3 max-w-lg w-full text-center">
            <span className="font-mono text-[9px] sm:text-[10px] text-black font-extrabold uppercase tracking-wider bg-[#ffdd00] px-1.5 py-0.5 border border-black shrink-0 shadow-[1px_1px_0_0_#000]">
              OBJECTIVE
            </span>
            <p className="font-heading font-extrabold text-xs sm:text-sm text-[#f0f0ff] uppercase tracking-wide leading-tight drop-shadow-[1px_1px_0_#000]">
              {roomDef.instruction}
            </p>
          </div>
        </div>

        {/* Puzzle Room Viewport */}
        <div className="relative z-10 w-full max-w-4xl flex-1 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] border-4 border-black bg-[#161632] shadow-[6px_6px_0_0_#000] overflow-hidden group">
          {/* Subtle Chamber Ambient Lighting Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)] z-10" />

          <RoomComponent
            key={roomKey}
            roomKey={roomKey}
            onSuccess={handleSuccess}
            onTroll={handleTroll}
            soundEnabled={settings.sound}
          />
        </div>

        {/* Hint Toast Popup */}
        {showHint && roomDef.hint && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-[#2a2a4a] border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0_0_#ffdd00] animate-bounce">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-[#ffdd00] font-heading font-bold text-xs sm:text-sm uppercase">
                <Lightbulb size={16} />
                <span>HINT SYSTEM:</span>
              </div>
              <button
                onClick={() => setShowHint(false)}
                className="text-[#a0a0d0] hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#f0f0ff] mt-2">
              {roomDef.hint}
            </p>
          </div>
        )}

        {/* 3. Bottom Controls */}
        <div className="w-full max-w-4xl flex justify-between items-center z-20 px-1">
          {/* Reset Room Button */}
          <button
            onClick={handleRestartRoom}
            className="bg-[#2a2a4a] hover:bg-[#3a3a6a] border-3 sm:border-4 border-black text-[#f0f0ff] hover:text-[#ffdd00] font-mono font-bold text-xs uppercase px-3 sm:px-4 py-2 shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Floor</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={() => {
              setShowHint((prev) => !prev);
              sound.playClick(settings.sound);
            }}
            className="bg-[#ffdd00] hover:bg-[#fff380] border-3 sm:border-4 border-black text-black font-heading font-extrabold text-xs sm:text-sm uppercase px-4 sm:px-6 py-2 shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lightbulb size={16} className="text-black" />
            <span>Hint</span>
          </button>
        </div>
      </div>

      {/* Modals & Overlays */}
      <SuccessOverlay
        isOpen={overlay === 'success'}
        title={overlayData.successTitle}
        subtitle={overlayData.successSubtitle}
        elapsedSeconds={elapsedSeconds}
        errorsCount={roomErrors}
        onNextRoom={handleNextRoom}
        soundEnabled={settings.sound}
      />

      <TrollOverlay
        isOpen={overlay === 'troll'}
        title={overlayData.trollTitle}
        subtitle={overlayData.trollSubtitle}
        errorCode={overlayData.trollCode}
        onRetry={handleRestartRoom}
        soundEnabled={settings.sound}
      />

      <PauseOverlay
        isOpen={overlay === 'pause'}
        onResume={() => setOverlay('none')}
        onRestart={handleRestartRoom}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onResetProgress={onResetProgress}
      />
    </div>
  );
};

