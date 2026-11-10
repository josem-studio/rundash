import type { Activity } from '../types';

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    date: '2026-11-07',
    type: 'Running',
    distance: 12.5,
    duration: 3600 + 450, // 1h 07m 30s
    pace: '5:24',
    heartRate: 145,
    title: 'Rodaje suave Z2',
  },
  {
    id: '2',
    date: '2026-11-05',
    type: 'Running',
    distance: 8.0,
    duration: 2400, // 40m
    pace: '5:00',
    heartRate: 152,
    title: 'Series 4x1000m',
  },
  {
    id: '3',
    date: '2026-11-03',
    type: 'Cycling',
    distance: 45.2,
    duration: 5400 + 1200, // 1h 50m
    pace: '24.6',
    heartRate: 132,
    title: 'Salida regenerativa',
  },
  {
    id: '4',
    date: '2026-11-01',
    type: 'Running',
    distance: 21.1,
    duration: 6300 + 300, // 1h 50m
    pace: '5:12',
    heartRate: 158,
    title: 'Media Maratón entrenamiento',
  },
  {
    id: '5',
    date: '2026-10-30',
    type: 'Running',
    distance: 10.0,
    duration: 3000, // 50m
    pace: '5:00',
    heartRate: 148,
    title: 'Tirada 10k',
  },
  {
    id: '6',
    date: '2026-10-28',
    type: 'Cycling',
    distance: 60.5,
    duration: 7200 + 1800, // 2h 30m
    pace: '24.2',
    heartRate: 135,
    title: 'Fondo suave',
  },
  {
    id: '7',
    date: '2026-10-25',
    type: 'Running',
    distance: 15.0,
    duration: 4500 + 300, // 1h 20m
    pace: '5:20',
    heartRate: 142,
    title: 'Rodaje largo dominical',
  },
];