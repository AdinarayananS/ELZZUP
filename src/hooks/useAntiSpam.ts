import { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../audio';

export const SPAM_TROLL_MESSAGES = [
  'STOP CLICKING.',
  'THAT IS NOT HOW THIS WORKS.',
  'ARE YOU GUESSING?',
  "YOU CAN'T JUST CLICK EVERYTHING.",
  'ELZZUP SEES YOU.',
  'TRY THINKING.',
  'THAT WAS DESPERATE.',
  'NO.',
  'DESPERATION DETECTED.',
  'THE WALLS CANNOT HELP YOU.',
];

interface AntiSpamOptions {
  soundEnabled: boolean;
  onTriggerGlitch: () => void;
  onMascotReaction: (text: string, durationMs?: number) => void;
  enabled?: boolean;
}

export interface AntiSpamState {
  isLockedOut: boolean;
  lockoutMessage: string;
  moderateGlitchActive: boolean;
  spamToastMessage: string | null;
  spamScore: number;
}

export function useAntiSpam({
  soundEnabled,
  onTriggerGlitch,
  onMascotReaction,
  enabled = true,
}: AntiSpamOptions) {
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState('STOP CLICKING.');
  const [moderateGlitchActive, setModerateGlitchActive] = useState(false);
  const [spamToastMessage, setSpamToastMessage] = useState<string | null>(null);
  const [spamScore, setSpamScore] = useState(0);

  const spamScoreRef = useRef(0);
  const lastNonInteractiveTimeRef = useRef(0);
  const lockoutTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const glitchTimeoutRef = useRef<number | null>(null);
  const lastReactionLevelRef = useRef<number>(0);

  // Helper to pick a random message avoiding immediate repeats
  const getRandomMessage = useCallback(() => {
    return SPAM_TROLL_MESSAGES[Math.floor(Math.random() * SPAM_TROLL_MESSAGES.length)];
  }, []);

  // Clear all active anti-spam timeouts
  const clearAllTimers = useCallback(() => {
    if (lockoutTimeoutRef.current) clearTimeout(lockoutTimeoutRef.current);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
  }, []);

  // Reset spam score (e.g., on room change or reset)
  const resetSpam = useCallback(() => {
    clearAllTimers();
    spamScoreRef.current = 0;
    setSpamScore(0);
    setIsLockedOut(false);
    setModerateGlitchActive(false);
    setSpamToastMessage(null);
    lastReactionLevelRef.current = 0;
  }, [clearAllTimers]);

  // Click detector handler
  const handleGlobalClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!enabled || isLockedOut) return;

      const target = (e.target as HTMLElement | null);
      if (!target) return;

      // Robust check: Is this target or its parent an interactive puzzle or UI element?
      const interactiveEl = target.closest(
        'button, a, input, select, textarea, [role="button"], [data-interactive="true"], [tabindex="0"], .cursor-pointer'
      );

      let isInteractive = Boolean(interactiveEl);

      // Check computed style cursor if not already flagged
      if (!isInteractive && typeof window !== 'undefined') {
        try {
          const style = window.getComputedStyle(target);
          if (
            style.cursor === 'pointer' ||
            style.cursor === 'grab' ||
            style.cursor === 'grabbing'
          ) {
            isInteractive = true;
          }
        } catch {
          // Ignore
        }
      }

      const now = Date.now();

      if (isInteractive) {
        // Legitimate interaction with a valid puzzle control!
        // Slightly decay spam score to reward deliberate puzzle engagement.
        spamScoreRef.current = Math.max(0, spamScoreRef.current - 0.4);
        setSpamScore(spamScoreRef.current);
        return;
      }

      // Clicks on non-interactive areas (empty backgrounds, walls, dead margins, decor)
      const timeSinceLast = now - lastNonInteractiveTimeRef.current;
      lastNonInteractiveTimeRef.current = now;

      let scoreDelta = 0;
      if (timeSinceLast < 260) {
        // Extremely rapid clicking
        scoreDelta = 2.0;
      } else if (timeSinceLast < 420) {
        // Fast clicking
        scoreDelta = 1.4;
      } else if (timeSinceLast < 750) {
        // Moderate clicking
        scoreDelta = 0.8;
      } else {
        // Isolated exploratory tap
        scoreDelta = 0.25;
      }

      const newScore = spamScoreRef.current + scoreDelta;
      spamScoreRef.current = newScore;
      setSpamScore(newScore);

      // --- ESCALATING REACTIONS ---

      // Level 3: VERY HIGH SPAM (Score >= 8.5) -> Temporary Lockout (1.25s)
      if (newScore >= 8.5 && !isLockedOut) {
        setIsLockedOut(true);
        lastReactionLevelRef.current = 3;
        const msg = getRandomMessage();
        setLockoutMessage(msg);
        onMascotReaction(msg, 2400);
        sound.playGlitch(soundEnabled, 0.7);
        onTriggerGlitch();

        if (lockoutTimeoutRef.current) clearTimeout(lockoutTimeoutRef.current);
        lockoutTimeoutRef.current = window.setTimeout(() => {
          setIsLockedOut(false);
          // Lower score after cooldown so player isn't instantly re-locked
          spamScoreRef.current = 2.0;
          setSpamScore(2.0);
          lastReactionLevelRef.current = 0;
          onMascotReaction('Think first.', 2000);
        }, 1250);

        return;
      }

      // Level 2: HIGH SPAM (Score >= 5.5) -> Toast Banner & Trolling Remark
      if (newScore >= 5.5 && lastReactionLevelRef.current < 2) {
        lastReactionLevelRef.current = 2;
        const msg = getRandomMessage();
        setSpamToastMessage(msg);
        onMascotReaction(msg, 2200);
        sound.playTroll(soundEnabled, 0.35);

        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = window.setTimeout(() => {
          setSpamToastMessage(null);
        }, 1600);

        return;
      }

      // Level 1: MODERATE SPAM (Score >= 3.2) -> Subtle UI Disturbance / Glitch Blip
      if (newScore >= 3.2 && lastReactionLevelRef.current < 1) {
        lastReactionLevelRef.current = 1;
        setModerateGlitchActive(true);
        sound.playGlitch(soundEnabled, 0.15);

        if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
        glitchTimeoutRef.current = window.setTimeout(() => {
          setModerateGlitchActive(false);
        }, 300);
      }
    },
    [
      enabled,
      isLockedOut,
      getRandomMessage,
      onMascotReaction,
      onTriggerGlitch,
      soundEnabled,
    ]
  );

  // Background smooth decay loop when clicking stops
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      const timeSinceLast = now - lastNonInteractiveTimeRef.current;

      // Only decay if player has stopped clicking for at least 700ms
      if (timeSinceLast > 700 && spamScoreRef.current > 0) {
        const decayed = Math.max(0, spamScoreRef.current - 0.7);
        spamScoreRef.current = decayed;
        setSpamScore(decayed);

        if (decayed < 3.2) {
          lastReactionLevelRef.current = 0;
          setModerateGlitchActive(false);
        } else if (decayed < 5.5) {
          lastReactionLevelRef.current = 1;
        }
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    isLockedOut,
    lockoutMessage,
    moderateGlitchActive,
    spamToastMessage,
    spamScore,
    handleGlobalClick,
    resetSpam,
  };
}
