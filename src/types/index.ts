export type ActivityType = 'Running' | 'Cycling';

export interface Activity {
  id: string;
  date: string;
  type: ActivityType;
  distance: number; // in km
  duration: number; // in seconds
  pace: string; // "min/km" for running, "km/h" for cycling
  heartRate?: number;
  calories?: number;
  title: string;
}

export interface WeeklyStats {
  distance: number;
  duration: number;
  count: number;
  avgPace: string;
}

export interface MonthlyStats {
  distance: number;
  duration: number;
  count: number;
}

export interface Goal {
  type: 'weekly' | 'monthly';
  target: number;
  current: number;
}

export interface Goals {
  weekly: Goal;
  monthly: Goal;
}

export interface AthleteProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  device: string;
  weeklyRunningGoal: number; // km
  monthlyRunningGoal: number; // km
  primaryGoalText: string;
}

export interface TrainingDay {
  id: string;
  dayOfWeek: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  date: string;
  title: string;
  type: ActivityType | 'Rest' | 'Strength';
  plannedDistance?: number; // km
  plannedDuration?: string; // e.g. "45 min"
  intensity: 'Suave' | 'Moderado' | 'Alto' | 'Descanso';
  completed: boolean;
  notes?: string;
}