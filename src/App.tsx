import React, { useState, useEffect, useCallback } from 'react';
import { ScreenState, GameSettings } from './types';
import { loadGameData, saveGameData, resetGameProgress } from './storage';
import { sound } from './audio';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Scanlines } from './components/Scanlines';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { PauseOverlay } from './components/PauseOverlay';
import { FinalVictory } from './components/FinalVictory';
import { FakeVictory10 } from './components/FakeVictory10';
import { KnowHowGuide } from './components/KnowHowGuide';
import { TOTAL_ROOMS } from './rooms/RoomRegistry';

export default function App() {
  const [saveData, setSaveData] = useState(() => loadGameData());
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('main-menu');
  const [currentRoomId, setCurrentRoomId] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Sync Audio when settings change
  useEffect(() => {
    if (saveData.settings.music && currentScreen === 'game') {
      sound.startMusic(true, saveData.settings.masterVol);
    } else {
      sound.stopMusic();
    }
  }, [saveData.settings.music, saveData.settings.masterVol, currentScreen]);

  // Update settings handler
  const handleUpdateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSaveData((prev) => {
      const updated = {
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      };
      saveGameData(updated);
      return updated;
    });
  }, []);

  // Toggle sound shortcut
  const handleToggleSound = useCallback(() => {
    handleUpdateSettings({ sound: !saveData.settings.sound });
  }, [handleUpdateSettings, saveData.settings.sound]);

  // Start New Game (starts from Room 1)
  const handleNewGame = () => {
    setCurrentRoomId(1);
    setCurrentScreen('game');
    sound.playClick(saveData.settings.sound);
  };

  // Continue from highest unlocked room
  const handleContinue = () => {
    const nextRoom = Math.min(saveData.highestCompletedRoom + 1, TOTAL_ROOMS);
    setCurrentRoomId(nextRoom);
    setCurrentScreen('game');
    sound.playClick(saveData.settings.sound);
  };

  // Room Completed handler
  const handleRoomComplete = (roomId: number) => {
    const nextHighest = Math.min(Math.max(saveData.highestCompletedRoom, roomId), TOTAL_ROOMS);
    setSaveData((prev) => {
      const updated = {
        ...prev,
        highestCompletedRoom: nextHighest,
        currentRoom: Math.min(roomId + 1, TOTAL_ROOMS),
      };
      saveGameData(updated);
      return updated;
    });

    if (roomId === 10) {
      // Trigger the Fake Victory Glitch Sequence!
      setCurrentScreen('fake-victory-10');
    } else if (roomId >= TOTAL_ROOMS) {
      // True Final Victory at Room 20!
      setCurrentScreen('victory');
    } else {
      setCurrentRoomId(roomId + 1);
    }
  };

  // Callback when Fake Victory glitch sequence concludes and launches Floor 11
  const handleProceedToFloor11 = () => {
    setCurrentRoomId(11);
    setCurrentScreen('game');
  };

  // Reset Progress
  const handleResetProgress = () => {
    const fresh = resetGameProgress();
    setSaveData(fresh);
    setCurrentRoomId(1);
    setCurrentScreen('main-menu');
    setIsSettingsOpen(false);
    sound.playClick(saveData.settings.sound);
  };

  return (
    <div className="min-h-screen bg-[#0c0c1e] text-[#f0f0ff] flex flex-col justify-between selection:bg-[#ffdd00] selection:text-black relative overflow-x-hidden">
      {/* Scanline CRT overlay */}
      <Scanlines intensity={isGlitching ? 'glitch' : 'normal'} />

      {/* Global Game Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          sound.playClick(saveData.settings.sound);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={saveData.settings.sound}
        onToggleSound={handleToggleSound}
        isGlitching={isGlitching}
      />

      {/* Main Game Frame Container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 pt-20 sm:pt-24 pb-8 relative z-10 w-full max-w-[1280px] mx-auto">
        {currentScreen === 'main-menu' && (
          <MainMenu
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            onOpenKnowHow={() => {
              setCurrentScreen('know-how');
              sound.playClick(saveData.settings.sound);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            hasSavedProgress={saveData.highestCompletedRoom > 0}
            highestCompletedRoom={saveData.highestCompletedRoom}
            soundEnabled={saveData.settings.sound}
          />
        )}

        {currentScreen === 'know-how' && (
          <KnowHowGuide
            onBack={() => {
              setCurrentScreen('main-menu');
              sound.playClick(saveData.settings.sound);
            }}
            soundEnabled={saveData.settings.sound}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            currentRoomId={currentRoomId}
            settings={saveData.settings}
            onUpdateSettings={handleUpdateSettings}
            onRoomComplete={handleRoomComplete}
            onResetProgress={handleResetProgress}
            onExitToMenu={() => setCurrentScreen('main-menu')}
            isGlitching={isGlitching}
            setIsGlitching={setIsGlitching}
          />
        )}

        {currentScreen === 'fake-victory-10' && (
          <FakeVictory10
            onProceedToFloor11={handleProceedToFloor11}
            soundEnabled={saveData.settings.sound}
          />
        )}

        {currentScreen === 'victory' && (
          <FinalVictory
            onBackToMenu={() => setCurrentScreen('main-menu')}
            soundEnabled={saveData.settings.sound}
          />
        )}
      </main>

      {/* Global Settings / Pause Overlay */}
      <PauseOverlay
        isOpen={isSettingsOpen}
        onResume={() => setIsSettingsOpen(false)}
        onRestart={() => {
          setIsSettingsOpen(false);
        }}
        settings={saveData.settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />

      {/* Global Game Footer */}
      <Footer isGlitching={isGlitching} />
    </div>
  );
}
