import React from 'react';

export interface RoomComponentProps {
  onSuccess: (message?: string, subMessage?: string) => void;
  onTroll: (title?: string, message?: string, errCode?: string) => void;
  roomKey: number;
  soundEnabled: boolean;
  onInteract?: () => void;
  onSetObjective?: (objective: string | null) => void;
}

export interface RoomDefinition {
  id: number;
  chapter: number;
  chapterTitle: string;
  title: string;
  instruction: string;
  defaultSuccessMessage: string;
  defaultSuccessSubmessage: string;
  defaultTrollTitle?: string;
  defaultTrollMessage?: string;
  hint?: string;
  component: React.ComponentType<RoomComponentProps>;
}

export type ScreenState = 'main-menu' | 'game' | 'victory' | 'fake-victory-10' | 'know-how';

export type OverlayType = 'none' | 'success' | 'troll' | 'pause' | 'victory' | 'settings';

export interface GameSettings {
  sound: boolean;
  music: boolean;
  masterVol: number;
}

export interface OverlayData {
  successTitle?: string;
  successSubtitle?: string;
  trollTitle?: string;
  trollSubtitle?: string;
  trollCode?: string;
}

export interface GameStats {
  roomStartTime: number;
  elapsedSeconds: number;
  roomErrors: number;
  totalClicks: number;
  resetsCount: number;
}
