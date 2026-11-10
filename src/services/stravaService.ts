import type { Activity } from '../types';

export interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // in meters
  moving_time: number; // in seconds
  type: string; // "Run", "Ride", etc.
  start_date_local: string;
  average_heartrate?: number;
  average_speed: number; // m/s
}

export const convertStravaActivity = (stravaAct: StravaActivity): Activity => {
  const isRun = stravaAct.type === 'Run';
  const distKm = stravaAct.distance / 1000;

  // Calculate pace string (min/km for running, km/h for cycling)
  let paceStr = '';
  if (isRun && stravaAct.average_speed > 0) {
    const paceSecondsPerKm = 1000 / stravaAct.average_speed;
    const mins = Math.floor(paceSecondsPerKm / 60);
    const secs = Math.floor(paceSecondsPerKm % 60);
    paceStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  } else {
    const kmh = stravaAct.average_speed * 3.6;
    paceStr = kmh.toFixed(1);
  }

  return {
    id: `strava-${stravaAct.id}`,
    date: stravaAct.start_date_local.split('T')[0],
    type: isRun ? 'Running' : 'Cycling',
    distance: parseFloat(distKm.toFixed(2)),
    duration: stravaAct.moving_time,
    pace: paceStr,
    heartRate: stravaAct.average_heartrate ? Math.round(stravaAct.average_heartrate) : undefined,
    title: stravaAct.name,
  };
};

export const stravaService = {
  getAuthUrl: (): string => {
    const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID || '123456';
    const redirectUri = import.meta.env.VITE_STRAVA_REDIRECT_URI || 'http://localhost:5173/strava/callback';
    const scope = 'read,activity:read_all';

    return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&approval_prompt=auto&scope=${scope}`;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('strava_access_token');
  },

  saveTokens: (tokens: StravaTokenResponse) => {
    localStorage.setItem('strava_access_token', tokens.access_token);
    localStorage.setItem('strava_refresh_token', tokens.refresh_token);
    localStorage.setItem('strava_expires_at', tokens.expires_at.toString());
  },

  clearAuth: () => {
    localStorage.removeItem('strava_access_token');
    localStorage.removeItem('strava_refresh_token');
    localStorage.removeItem('strava_expires_at');
  },

  fetchActivities: async (): Promise<Activity[]> => {
    const token = localStorage.getItem('strava_access_token');
    if (!token) return [];

    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener actividades de Strava');
      }

      const rawActivities: StravaActivity[] = await response.json();
      return rawActivities.map(convertStravaActivity);
    } catch (error) {
      console.error('Strava API Error:', error);
      return [];
    }
  },
};
