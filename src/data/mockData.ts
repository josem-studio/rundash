import { MOCK_ACTIVITIES } from './mockActivities';
export { MOCK_ACTIVITIES };
import type { AthleteProfile, Goals, TrainingDay } from '../types';

// Mock data for demonstration purposes only
const mockProfile: AthleteProfile = {
  name: 'Juan Deportista',
  age: 40,
  weight: 63.3,
  height: 166,
  device: 'Garmin Forerunner 165',
  weeklyRunningGoal: 40,
  monthlyRunningGoal: 200,
  primaryGoalText: 'Preparar una media maratón',
};

const mockTrainingDays: TrainingDay[] = [
  {
    id: '2026-11-04',
    dayOfWeek: 'Lunes',
    date: '2026-11-04',
    title: 'Descanso',
    type: 'Rest',
    completed: true,
    intensity: 'Descanso',
  },
  {
    id: '2026-11-05',
    dayOfWeek: 'Martes',
    date: '2026-11-05',
    title: 'Running suave',
    type: 'Running',
    plannedDistance: 8.0,
    plannedDuration: '40 min',
    intensity: 'Suave',
    completed: true,
  },
  {
    id: '2026-11-06',
    dayOfWeek: 'Miércoles',
    date: '2026-11-06',
    title: 'Fuerza',
    type: 'Strength',
    intensity: 'Moderado',
    completed: true,
  },
  {
    id: '2026-11-07',
    dayOfWeek: 'Jueves',
    date: '2026-11-07',
    title: 'Series',
    type: 'Running',
    plannedDistance: 10.0,
    plannedDuration: '60 min',
    intensity: 'Alto',
    completed: true,
  },
  {
    id: '2026-11-08',
    dayOfWeek: 'Viernes',
    date: '2026-11-08',
    title: 'Descanso',
    type: 'Rest',
    completed: true,
    intensity: 'Descanso',
  },
  {
    id: '2026-11-09',
    dayOfWeek: 'Sábado',
    date: '2026-11-09',
    title: 'Running',
    type: 'Running',
    plannedDistance: 12.5,
    plannedDuration: '1h 07m',
    intensity: 'Suave',
    completed: true,
  },
  {
    id: '2026-11-10',
    dayOfWeek: 'Domingo',
    date: '2026-11-10',
    title: 'Rodaje largo',
    type: 'Running',
    plannedDistance: 15.0,
    plannedDuration: '1h 20m',
    intensity: 'Moderado',
    completed: true,
  },
];

export const MOCK_PROFILE = mockProfile;

export const MOCK_GOALS: Goals = {
  weekly: {
    type: 'weekly' as const,
    target: 40,
    current: 35.5,
  },
  monthly: {
    type: 'monthly' as const,
    target: 200,
    current: 156.8,
  },
};

export const MOCK_TRAINING_DAYS = mockTrainingDays;

export const MOCK_CHART_DATA = [
  { name: 'Lun', km: 0 },
  { name: 'Mar', km: 8 },
  { name: 'Mié', km: 0 },
  { name: 'Jue', km: 10 },
  { name: 'Vie', km: 0 },
  { name: 'Sáb', km: 12.5 },
  { name: 'Dom', km: 21.1 },
];