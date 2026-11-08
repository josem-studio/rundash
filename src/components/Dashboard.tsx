import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MOCK_CHART_DATA } from '../data/mockData';
import { Activity, Goal } from '../types';
import { formatDuration } from '../utils/formatters';
import { Activity as ActivityIcon, Timer, TrendingUp, Zap } from 'lucide-react';

interface DashboardProps {
  activities: Activity[];
  goals: {
    weekly: Goal;
    monthly: Goal;
  };
}

const StatCard = ({ title, value, unit, icon: Icon, colorClass, trend }: any) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className={`text-xs font-semibold flex items-center ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <div className="flex items-baseline space-x-1 mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-gray-500 text-xs font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ activities, goals }) => {
  const weeklyKm = activities.slice(0, 3).reduce((acc, curr) => acc + curr.distance, 0);
  const monthlyKm = activities.reduce((acc, curr) => acc + curr.distance, 0);
  const totalDuration = activities.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Resumen General</h2>
        <p className="text-gray-400 mt-1">Has entrenado 5 días en la última semana. ¡Sigue así!</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Km Semanales"
          value={weeklyKm.toFixed(1)}
          unit="km"
          icon={ActivityIcon}
          colorClass="bg-orange-500"
          trend={12}
        />
        <StatCard
          title="Km Mensuales"
          value={monthlyKm.toFixed(1)}
          unit="km"
          icon={TrendingUp}
          colorClass="bg-blue-500"
          trend={5}
        />
        <StatCard
          title="Total Actividades"
          value={activities.length}
          unit="sesiones"
          icon={Zap}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Tiempo Total"
          value={Math.floor(totalDuration / 3600)}
          unit="horas"
          icon={Timer}
          colorClass="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Evolución Semanal</h3>
            <select className="bg-gray-700 text-gray-300 text-xs rounded border-none px-2 py-1 focus:ring-1 focus:ring-orange-500">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#9ca3af', fontSize: 12}}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#9ca3af', fontSize: 12}}
                />
                <Tooltip
                  contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px'}}
                  itemStyle={{color: '#f97316'}}
                />
                <Area
                  type="monotone"
                  dataKey="km"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorKm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Objetivos de Volumen</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400 font-medium">Objetivo Semanal</span>
                <span className="text-sm font-bold text-white">{goals.weekly.current} / {goals.weekly.target} km</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)] transition-all duration-1000"
                  style={{ width: `${(goals.weekly.current / goals.weekly.target) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 italic text-right">Te faltan {(goals.weekly.target - goals.weekly.current).toFixed(1)} km para completar la semana</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400 font-medium">Objetivo Mensual</span>
                <span className="text-sm font-bold text-white">{goals.monthly.current} / {goals.monthly.target} km</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000"
                  style={{ width: `${(goals.monthly.current / goals.monthly.target) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 italic text-right">Llevas un {( (goals.monthly.current / goals.monthly.target) * 100 ).toFixed(0)}% del objetivo mensual</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Próxima Carrera</h4>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-orange-500/20">
              <p className="text-sm font-bold text-white">Maratón de Valencia</p>
              <p className="text-xs text-orange-500 font-medium">1 de Diciembre, 2024</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 h-1 rounded-full">
                  <div className="bg-orange-500 w-3/4 h-1 rounded-full"></div>
                </div>
                <span className="text-[10px] text-gray-400">22 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
