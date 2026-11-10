import type { Activity, Goals, TrainingDay } from '../types';

export interface CoachAnalysis {
  status: 'excellent' | 'on-track' | 'behind' | 'critical';
  message: string;
  recommendation: string | null;
  weeklyKm: number;
  target: number;
  progress: number;
}

export const analyzePerformance = (activities: Activity[], goals: Goals): CoachAnalysis => {
  const weeklyKm = activities
    .filter((a) => a.type === 'Running')
    .reduce((acc, a) => acc + a.distance, 0);

  const target = goals.weekly.target;
  const progress = (weeklyKm / target) * 100;

  if (progress >= 100) {
    return {
      status: 'excellent',
      message: `¡Increíble! Has superado tu objetivo semanal. Has acumulado ${weeklyKm.toFixed(1)} km de running. El resto de la semana debe ser de descanso activo para asimilar la carga.`,
      recommendation: 'Descanso activo',
      weeklyKm,
      target,
      progress,
    };
  } else if (progress >= 80) {
    return {
      status: 'on-track',
      message: `Vas muy bien, estás al ${progress.toFixed(0)}% de tu objetivo (${weeklyKm.toFixed(1)} km de ${target} km). Con un rodaje suave de 5 km mañana, cumplirás tus metas de forma segura.`,
      recommendation: 'Rodaje suave 5 km',
      weeklyKm,
      target,
      progress,
    };
  } else if (progress < 50) {
    return {
      status: 'critical',
      message: `Esta semana llevas ${weeklyKm.toFixed(1)} km. Te queda un camino por recorrer. ¿Quieres que redistribuyamos las sesiones para que sea más alcanzable?`,
      recommendation: 'Redistribuir sesiones',
      weeklyKm,
      target,
      progress,
    };
  } else {
    return {
      status: 'behind',
      message: `Llevas ${weeklyKm.toFixed(1)} km esta semana. Mantén la constancia, estás cumpliendo el ritmo de entrenamiento previsto.`,
      recommendation: null,
      weeklyKm,
      target,
      progress,
    };
  }
};

export const generateSmartPlan = (activities: Activity[], goals: Goals, trainingDays: TrainingDay[]): TrainingDay[] => {
  const analysis = analyzePerformance(activities, goals);
  const updatedDays = trainingDays.map((day) => {
    // If the user is behind on kilometers, suggest redistributing the sessions
    if (analysis.status === 'critical' && day.type === 'Running' && day.plannedDistance) {
      return {
        ...day,
        notes: 'Sesión ajustada para compensar la carga del fin de semana',
      };
    }
    return day;
  });
  return updatedDays;
};