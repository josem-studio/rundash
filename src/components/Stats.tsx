import React from 'react';
import type { Activity } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity as ActivityIcon, Clock, HeartPulse } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';

interface StatsProps {
  activities: Activity[];
}

const StatCard = ({ title, value, unit, icon: Icon, colorClass }: any) => (
  <Card className="p-5 flex flex-col justify-between border-border bg-[#0a0a0a]">
    <div className="flex items-center space-x-3 mb-4">
      <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10 border border-current/20`}>
        <Icon size={18} className={colorClass.replace('bg-', 'text-')} />
      </div>
      <span className="text-[10px] font-black text-[#555555] uppercase tracking-widest">{title}</span>
    </div>
    <div className="flex items-baseline space-x-1.5">
      <span className="text-2xl font-black text-white tracking-tight tabular-nums">{value}</span>
      <span className="text-[10px] text-[#444444] font-medium">{unit}</span>
    </div>
  </Card>
);

const Stats: React.FC<StatsProps> = ({ activities }) => {
  const runningKm = activities.filter((a) => a.type === 'Running').reduce((acc, a) => acc + a.distance, 0);
  const cyclingKm = activities.filter((a) => a.type === 'Cycling').reduce((acc, a) => acc + a.distance, 0);

  const disciplineData = [
    { name: 'Running', value: runningKm, color: '#ff0000' },
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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="pb-6 border-b border-[#1a1212]">
        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Análisis</h2>
        <p className="text-[#555555] text-sm mt-1 font-medium">Evolución detallada de tu rendimiento.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Km Totales" value={activities.reduce((acc, a) => acc + a.distance, 0).toFixed(1)} unit="km" icon={TrendingUp} colorClass="bg-[#ff0000]" />
        <StatCard title="Sesiones" value={activities.length} unit="sesiones" icon={ActivityIcon} colorClass="bg-[#ff0000]" />
        <StatCard title="Tiempo Total" value={Math.floor(activities.reduce((acc, a) => acc + a.duration, 0) / 3600)} unit="horas" icon={Clock} colorClass="bg-[#ff0000]" />
        <StatCard title="FC Media" value={Math.round(activities.reduce((acc, a) => acc + (a.heartRate || 0), 0) / activities.length || 0)} unit="bpm" icon={HeartPulse} colorClass="bg-[#ff0000]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-[#0a0a0a]">
          <CardTitle className="text-sm font-black text-white uppercase tracking-widest mb-6">Distribución</CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={disciplineData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                  {disciplineData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#08090B', borderColor: '#221515', borderRadius: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-border bg-[#0a0a0a]">
          <CardTitle className="text-sm font-black text-white uppercase tracking-widest mb-6">Ritmo Medio (Running)</CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1212" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#555555', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#555555', fontSize: 10}} domain={[4, 6]} />
                <Tooltip contentStyle={{backgroundColor: '#08090B', borderColor: '#221515', borderRadius: '12px'}} />
                <Bar dataKey="ritmo" fill="#ff0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;