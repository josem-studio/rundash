import type { Activity, AthleteProfile, Goals, TrainingDay } from '../types';
import { MOCK_ACTIVITIES, MOCK_PROFILE, MOCK_GOALS, MOCK_TRAINING_DAYS } from '../data/mockData';
import { stravaService } from './stravaService';

// Data service combining mock data and live Strava data
export const activityService = {
  getActivities: async (): Promise<Activity[]> => {
    if (stravaService.isAuthenticated()) {
      const stravaActs = await stravaService.fetchActivities();
      if (stravaActs.length > 0) {
        return stravaActs;
      }
    }
    // Fallback to local mock data
    return MOCK_ACTIVITIES;
  },
  getProfile: (): AthleteProfile => MOCK_PROFILE,
  getGoals: (): Goals => MOCK_GOALS,
  getTrainingDays: (): TrainingDay[] => MOCK_TRAINING_DAYS,
};
