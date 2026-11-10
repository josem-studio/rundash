import React from 'react';
import type { Activity } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity as ActivityIcon, Clock, HeartPulse } from 'lucide-react';

interface StatsProps {
  activities: Activity[];
}

const Stats: React.FC<StatsProps> = ({ activities }) => {
  const runningKm = activities.filter((a) => a.type === 'Running').reduce((acc, a) => acc + a.distance, 0);
  const cyclingKm = activities.filter((a) => a.type === 'Cycling').reduce((acc, a) => acc + a.distance, 0);

  const disciplineData = [
    { name: 'Running', value: runningKm, color: '#ff6600' },
    { name: 'Ciclismo', value: cyclingKm, color: '#3b82f6' },
  ];

  const paceData = activities
    .filter(a => a.type === 'Running')
    .slice(-7)
    .map((a) => ({
      name: new Date(a.date).toLocaleDateString('es-ES', { weekday: 'short' }),
      ritmo: parseFloat(a.pace.replace(':', '.')),
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header>
        <h2 className="text-3xl font-extrabold text-[#fafafa] tracking-tight">Análisis de Rendimiento</h2>
        <p className="text-[#a3a3a3] text-sm mt-1">Evolución y desglose de tus métricas deportivas.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Km Totales", value: activities.reduce((acc, a) => acc + a.distance, 0).toFixed(1), unit: "km", icon: TrendingUp },
          { title: "Sesiones", value: activities.length, unit: "sesiones", icon: ActivityIcon },
          { title: "Tiempo", value: Math.floor(activities.reduce((acc, a) => acc + a.duration, 0) / 3600), unit: "horas", icon: Clock },
          { title: "FC Media", value: Math.round(activities.reduce((acc, a) => acc + (a.heartRate || 0), 0) / activities.length || 0), unit: "bpm", icon: HeartPulse },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#141414] p-6 rounded-2xl border border-[#262626]">
            <kpi.icon size={20} className="text-orange-500 mb-3" />
            <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider block">{kpi.title}</span>
            <p className="text-2xl font-extrabold text-[#fafafa] mt-1">{kpi.value} <span className="text-sm font-medium text-[#525252]">{kpi.unit}</span></p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Discipline Pie */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-[#262626]">
          <h3 className="text-sm font-bold text-[#fafafa] mb-6">Distribución de Disciplinas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={disciplineData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {disciplineData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pace Bar Chart */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-[#262626]">
          <h3 className="text-sm font-bold text-[#fafafa] mb-6">Ritmo Medio Reciente (Running)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12}} domain={[4, 6]} />
                <Tooltip contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px'}} />
                <Bar dataKey="ritmo" fill="#ff6600" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;