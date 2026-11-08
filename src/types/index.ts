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
