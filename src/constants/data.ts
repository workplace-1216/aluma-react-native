import {BreathworkExercise} from '../utils/types';

export const options = [
  'Regular emotions',
  'Improve sleep',
  'Improve focus',
  'Relax and reduce stress',
];

export const breathworkExercises: BreathworkExercise[] = [
  {
    _id: '1234567890abcdef12345678',
    title: 'Square 4 : 4 : 4 : 4',
    description:
      'A breathing technique using equal inhalation, hold, exhalation, and hold time.',
    steps: [4, 4, 4, 4],
    created_at: new Date('2025-03-14T10:00:00Z'),
    updated_at: new Date('2025-03-14T10:00:00Z'),
  },
  {
    _id: 'abcdef123456789012345678',
    title: 'Detox 4 : 7 : 8',
    description:
      'A breathwork exercise designed to promote relaxation and detoxification.',
    steps: [4, 7, 8],
    created_at: new Date('2025-03-14T10:05:00Z'),
    updated_at: new Date('2025-03-14T10:05:00Z'),
  },
  {
    _id: '7890abcdef12345678901234',
    title: '10 Minutes Reset',
    description:
      'A 10-minute guided breathing session to reset the mind and body.',
    steps: [10, 0, 10, 0],
    created_at: new Date('2025-03-14T10:10:00Z'),
    updated_at: new Date('2025-03-14T10:10:00Z'),
  },
  {
    _id: '456789abcdef123456789012',
    title: 'Nadi Shodhana',
    description:
      'A yogic alternate nostril breathing exercise for balancing energy channels.',
    steps: [1, 0, 1, 0],
    created_at: new Date('2025-03-14T10:15:00Z'),
    updated_at: new Date('2025-03-14T10:15:00Z'),
  },
];
