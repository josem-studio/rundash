import React from 'react';
import type { Activity, AthleteProfile, Goals, TrainingDay } from '../types';
import { Activity as ActivityIcon, Timer, TrendingUp, Zap, Calendar, Play } from 'lucide-react';
import { RunningTrackWidget } from './RunningTrackWidget';
import ProfileCard from './ProfileCard';
import TrainingCalendar from './TrainingCalendar';
import { Card } from '@/components/ui/card';

interface DashboardProps {
  activities: Activity[];
  goals: Goals;
  profile: AthleteProfile;
  trainingDays: TrainingDay[];
}

const StatCard = ({ title, value, unit, icon: Icon, colorClass, trend }: any) => (
  <Card className="p-5 flex flex-col justify-between border-[#24272D] bg-[#14161A] hover:border-[#FF3038]/40 transition-all">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10 border border-current/20`}>
        <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend > 0 ? 'text-[#A3E635] bg-[#A3E635]/10' : 'text-red-500 bg-red-500/10'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-[10px] text-[#8B929E] font-black uppercase tracking-wider">{title}</h3>
      <div className="flex items-baseline space-x-1.5 mt-1">
        <span className="text-3xl font-black text-white tracking-tight tabular-nums">{value}</span>
        <span className="text-[10px] text-[#8B929E] font-bold uppercase">{unit}</span>
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ activities, goals, profile, trainingDays }) => {
  const weeklyRunningKm = activities
    .filter((a) => a.type === 'Running')
    .reduce((acc, curr) => acc + curr.distance, 0);

  const monthlyKm = activities.reduce((acc, curr) => acc + curr.distance, 0);
  const totalDuration = activities.reduce((acc, curr) => acc + curr.duration, 0);

  // Find today's workout (simulated/first non-completed or current day)
  const todayWorkout = trainingDays.find(d => !d.completed) || trainingDays[0];

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">

      {/* 1. Encabezado */}
      <header className="flex items-center justify-between pb-4 border-b border-[#24272D]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase italic leading-none">Dashboard</h2>
          <p className="text-[#8B929E] text-xs font-bold uppercase tracking-widest mt-1">SG RUNNING CLUB · Performance</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#FF3038]/10 text-[#FF3038] border border-[#FF3038]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3038] mr-2 animate-pulse"></span>
            Live Performance
          </span>
        </div>
      </header>

      {/* 2. PISTA OVALADA Y PROGRESO SEMANAL (Héroe Absoluto) */}
      <section className="w-full bg-[#14161A] border border-[#24272D] p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-black text-[#FF3038] uppercase tracking-[0.3em]">HÉROE SEMANAL</span>
          <span className="text-xs font-bold text-[#8B929E]">SEMANA ACTUAL</span>
        </div>
        <RunningTrackWidget weeklyGoal={goals.weekly} activities={activities} />
      </section>

      {/* 3. Entrenamiento Recomendado para Hoy */}
      {todayWorkout && (
        <section className="w-full bg-gradient-to-r from-[#FF3038]/10 via-[#14161A] to-[#14161A] border border-[#FF3038]/30 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#FF3038] text-xs font-black uppercase tracking-widest">
              <Calendar size={14} />
              <span>SESIÓN DE HOY · {todayWorkout.dayOfWeek}</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">{todayWorkout.title}</h3>
            <p className="text-xs text-[#8B929E] font-medium">
              Intensidad: <span className="text-white font-bold">{todayWorkout.intensity}</span> {todayWorkout.plannedDistance ? `· Objetivo: ${todayWorkout.plannedDistance} km` : ''}
            </p>
          </div>
          <button className="self-start md:self-auto bg-[#FF3038] hover:bg-[#E60000] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-[#FF3038]/20 transition-all">
            <Play size={14} fill="currentColor" />
            <span>Comenzar Sesión</span>
          </button>
        </section>
      )}

      {/* 4. KPIs Deportivos */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Km Semanales" value={weeklyRunningKm.toFixed(1)} unit="km" icon={ActivityIcon} colorClass="bg-[#A3E635]" trend={12} />
        <StatCard title="Km Mensuales" value={monthlyKm.toFixed(1)} unit="km" icon={TrendingUp} colorClass="bg-[#A3E635]" trend={5} />
        <StatCard title="Sesiones" value={activities.length} unit="total" icon={Zap} colorClass="bg-[#FF3038]" />
        <StatCard title="Tiempo Total" value={Math.floor(totalDuration / 3600)} unit="horas" icon={Timer} colorClass="bg-[#FF3038]" />
      </section>

      {/* 5 & 6. Calendario y Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TrainingCalendar days={trainingDays} />
        </div>
        <div className="lg:col-span-5">
          <ProfileCard profile={profile} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;