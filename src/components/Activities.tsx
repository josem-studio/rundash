import React, { useState } from 'react';
import type { Activity } from '../types';
import { formatDuration, formatDate, getPaceLabel } from '../utils/formatters';
import { Activity as ActivityIcon } from 'lucide-react';

interface ActivitiesProps {
  activities: Activity[];
}

const Activities: React.FC<ActivitiesProps> = ({ activities }) => {
  const [filter, setFilter] = useState<'all' | 'running' | 'cycling'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const filteredActivities = activities.filter((activity) => {
    const isTypeMatch = filter === 'all' || activity.type.toLowerCase() === filter;
    const isDateMatch = () => {
      const activityDate = new Date(activity.date);
      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);

      if (timeRange === 'week') return activityDate >= weekAgo;
      if (timeRange === 'month') return activityDate >= monthAgo;
      return true; // 'all'
    };

    return isTypeMatch && isDateMatch();
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Entrenamientos</h2>
        <div className="flex space-x-4">
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            onClick={() => setFilter('all')}
          >
            <ActivityIcon size={16} />
            <span>Todos</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            onClick={() => setFilter('running')}
          >
            <ActivityIcon size={16} />
            <span>Correr</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            onClick={() => setFilter('cycling')}
          >
            <ActivityIcon size={16} />
            <span>Ciclismo</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg border border-gray-700 ${timeRange === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
          onClick={() => setTimeRange('week')}
        >
          Última semana
        </button>
        <button
          className={`px-4 py-2 rounded-lg border border-gray-700 ${timeRange === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
          onClick={() => setTimeRange('month')}
        >
          Último mes
        </button>
        <button
          className={`px-4 py-2 rounded-lg border border-gray-700 ${timeRange === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
          onClick={() => setTimeRange('all')}
        >
          Todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-xl border border-gray-700">
          <thead>
            <tr className="bg-gray-900/50 border-b border-gray-700">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actividad</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Distancia</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Duración</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ritmo</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">FC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(activity.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{activity.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{activity.distance.toFixed(1)} km</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDuration(activity.duration)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{activity.pace} {getPaceLabel(activity.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{activity.heartRate ? `${activity.heartRate} bpm` : '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No hay entrenamientos en este periodo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activities;
