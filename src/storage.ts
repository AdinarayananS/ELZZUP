import { GameSettings } from './types';

const STORAGE_KEY = 'ELZZUP_SAVE_V1';

export interface SaveData {
  highestCompletedRoom: number;
  currentRoom: number;
  settings: GameSettings;
  stats: {
    totalAttempts: number;
    totalPlayTimeSeconds: number;
    totalTrollsEncountered: number;
  };
}

const DEFAULT_SAVE: SaveData = {
  highestCompletedRoom: 0,
  currentRoom: 1,
  settings: {
    sound: true,
    music: true,
    masterVol: 0.8,
  },
  stats: {
    totalAttempts: 0,
    totalPlayTimeSeconds: 0,
    totalTrollsEncountered: 0,
  },
};

export function loadGameData(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      highestCompletedRoom: Math.min(Math.max(parsed.highestCompletedRoom || 0, 0), 20),
      currentRoom: Math.min(Math.max(parsed.currentRoom || 1, 1), 20),
      settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings || {}) },
      stats: { ...DEFAULT_SAVE.stats, ...(parsed.stats || {}) },
    };
  } catch (e) {
    console.error('Failed to load save data from localStorage:', e);
    return DEFAULT_SAVE;
  }
}

export function saveGameData(data: Partial<SaveData>): void {
  try {
    const current = loadGameData();
    const updated = {
      ...current,
      ...data,
      settings: { ...current.settings, ...(data.settings || {}) },
      stats: { ...current.stats, ...(data.stats || {}) },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
  }
}

export function resetGameProgress(): SaveData {
  try {
    const current = loadGameData();
    const resetData: SaveData = {
      ...DEFAULT_SAVE,
      settings: current.settings, // Preserve user's audio settings on progress reset
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    return resetData;
  } catch (e) {
    console.error('Failed to reset progress in localStorage:', e);
    return DEFAULT_SAVE;
  }
}
