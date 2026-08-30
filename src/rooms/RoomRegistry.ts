import { RoomDefinition } from '../types';
import { Room1 } from './Room1';
import { Room2 } from './Room2';
import { Room3 } from './Room3';
import { Room4 } from './Room4';
import { Room5 } from './Room5';
import { Room6 } from './Room6';
import { Room7 } from './Room7';
import { Room8 } from './Room8';
import { Room9 } from './Room9';
import { Room10 } from './Room10';

export const ROOMS: RoomDefinition[] = [
  {
    id: 1,
    chapter: 1,
    chapterTitle: 'The Awakening',
    title: 'Room 01',
    instruction: 'Press the red button.',
    defaultSuccessMessage: 'Nice.',
    defaultSuccessSubmessage: 'That was suspiciously easy.',
    defaultTrollTitle: 'Really?',
    defaultTrollMessage: 'You had one job: press the red button.',
    hint: 'Literally just press the big red button. It is Room 1.',
    component: Room1,
  },
  {
    id: 2,
    chapter: 1,
    chapterTitle: 'The Awakening',
    title: 'Room 02',
    instruction: 'Press the red button twice.',
    defaultSuccessMessage: 'Nice Math.',
    defaultSuccessSubmessage: '1 + 1 = Success. Look at you following instructions.',
    defaultTrollTitle: 'Count Again',
    defaultTrollMessage: 'The button requires two presses.',
    hint: 'Press the red button two times in total.',
    component: Room2,
  },
  {
    id: 3,
    chapter: 1,
    chapterTitle: 'The Awakening',
    title: 'Room 03',
    instruction: 'Press the red button.',
    defaultSuccessMessage: 'Good Choice.',
    defaultSuccessSubmessage: 'You actually listened this time.',
    defaultTrollTitle: 'Wrong Choice.',
    defaultTrollMessage: 'I said RED.',
    hint: 'There are two buttons. Only press the red one!',
    component: Room3,
  },
  {
    id: 4,
    chapter: 1,
    chapterTitle: 'The Awakening',
    title: 'Room 04',
    instruction: 'Press the button.',
    defaultSuccessMessage: 'Gotcha!',
    defaultSuccessSubmessage: 'Cardio is important for buttons too.',
    defaultTrollTitle: 'Too Slow!',
    defaultTrollMessage: 'Keep chasing it until it runs out of breath.',
    hint: 'Keep trying to click the button. It will get tired after a few attempts!',
    component: Room4,
  },
  {
    id: 5,
    chapter: 1,
    chapterTitle: 'The Awakening',
    title: 'Room 05',
    instruction: 'Press the button.',
    defaultSuccessMessage: 'Invisible Victory.',
    defaultSuccessSubmessage: 'Object permanence is a marvelous human trait.',
    defaultTrollTitle: 'Vanished!',
    defaultTrollMessage: 'Where did it go?',
    hint: 'When the button disappears, look around the chamber walls for the relocated ghost node.',
    component: Room5,
  },
  {
    id: 6,
    chapter: 2,
    chapterTitle: 'Question Everything',
    title: 'Room 06',
    instruction: 'PRESS THE RED BUTTON.',
    defaultSuccessMessage: "Good. You're learning.",
    defaultSuccessSubmessage: 'Questioning authority is a feature, not a bug.',
    defaultTrollTitle: 'You really trust the instructions?',
    defaultTrollMessage: 'Rule #1 of ELZZUP: Instructions are not your friends.',
    hint: 'Maybe the instruction is lying to you this time.',
    component: Room6,
  },
  {
    id: 7,
    chapter: 2,
    chapterTitle: 'Question Everything',
    title: 'Room 07',
    instruction: 'Press the correct button.',
    defaultSuccessMessage: 'You actually looked around.',
    defaultSuccessSubmessage: 'Observation beats impulsive clicking every single time.',
    defaultTrollTitle: 'Wrong Button.',
    defaultTrollMessage: 'Look around the chamber for subtle clues.',
    hint: 'Check the diagnostic logs in the top corner of the chamber.',
    component: Room7,
  },
  {
    id: 8,
    chapter: 2,
    chapterTitle: 'Question Everything',
    title: 'Room 08',
    instruction: 'FOLLOW THE INSTRUCTIONS.',
    defaultSuccessMessage: "Maybe don't trust me.",
    defaultSuccessSubmessage: 'The instructions are written by someone who wants to trap you.',
    defaultTrollTitle: 'The instruction is the trap.',
    defaultTrollMessage: 'You believed the command word for word. Have you learned nothing from ELZZUP?',
    hint: 'Look closely at what changes or is bypassed when you ignore the main command.',
    component: Room8,
  },
  {
    id: 9,
    chapter: 2,
    chapterTitle: 'Question Everything',
    title: 'Room 09',
    instruction: 'INITIALIZE DEFEAT PROTOCOL.',
    defaultSuccessMessage: 'You saw through the illusion.',
    defaultSuccessSubmessage: "Room 9 wasn't the end. Now enter the true final trial.",
    defaultTrollTitle: 'Did you really think that was it?',
    defaultTrollMessage: "Room 9 is not the end. Look closely at your 'victory'.",
    hint: 'Inspect the victory screen carefully for inconsistencies or room counters.',
    component: Room9,
  },
  {
    id: 10,
    chapter: 2,
    chapterTitle: 'Question Everything',
    title: 'Room 10',
    instruction: 'DO EXACTLY WHAT I SAY.',
    defaultSuccessMessage: 'Okay.',
    defaultSuccessSubmessage: 'You win. ELZZUP defeated.',
    defaultTrollTitle: 'The archives do not lie.',
    defaultTrollMessage: 'Remember what you did in previous chambers.',
    hint: 'Invert false commands, harmonize breaker frequencies, and spell the unmasked secret backwards.',
    component: Room10,
  },
];

export function getRoomById(id: number): RoomDefinition | undefined {
  return ROOMS.find((r) => r.id === id);
}

export const TOTAL_ROOMS = 10;
