import React from 'react';
import type { Activity, AthleteProfile, Goals, TrainingDay } from '../types';
import { Activity as ActivityIcon, Timer, TrendingUp, Zap } from 'lucide-react';
import { RunningTrackWidget } from './RunningTrackWidget';
import ProfileCard from './ProfileCard';
import TrainingCalendar from './TrainingCalendar';

interface DashboardProps {
  activities: Activity[];
  goals: Goals;
  profile: AthleteProfile;
  trainingDays: TrainingDay[];
}

const StatCard = ({ title, value, unit, icon: Icon, colorClass, trend }: any) => (
  <div className="bg-[#111111] p-5 rounded-2xl border border-[#221515] hover:border-[#ff0000]/30 transition-colors flex flex-col justify-between">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10 border border-current/20`}>
        <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend > 0 ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-[10px] text-[#555555] font-bold uppercase tracking-wider">{title}</h3>
      <div className="flex items-baseline space-x-1.5 mt-1">
        <span className="text-2xl font-black text-white tracking-tight tabular-nums">{value}</span>
        <span className="text-[10px] text-[#444444] font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ activities, goals, profile, trainingDays }) => {
  const weeklyKm = activities.slice(0, 3).reduce((acc, curr) => acc + curr.distance, 0);
  const monthlyKm = activities.reduce((acc, curr) => acc + curr.distance, 0);
  const totalDuration = activities.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section - Clean & Minimalist */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1a1212]">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Dashboard</h2>
          <p className="text-[#555555] text-sm mt-1 font-medium">Tu centro de control deportivo. Vacila y corre.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#ff0000]/10 text-[#ff0000] border border-[#ff0000]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000] mr-2 animate-pulse"></span>
            Strava Activo
          </span>
        </div>
      </header>

      {/* Stats Grid - 4 Cards aligned with the design references */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Km Semanales" value={weeklyKm.toFixed(1)} unit="km" icon={ActivityIcon} colorClass="bg-[#ff0000]" trend={12} />
        <StatCard title="Km Mensuales" value={monthlyKm.toFixed(1)} unit="km" icon={TrendingUp} colorClass="bg-blue-500" trend={5} />
        <StatCard title="Sesiones" value={activities.length} unit="total" icon={Zap} colorClass="bg-yellow-500" />
        <StatCard title="Tiempo Total" value={Math.floor(totalDuration / 3600)} unit="horas" icon={Timer} colorClass="bg-green-500" />
      </div>

      {/* Main Content Grid - Reordered to prevent clipping and improve readability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Profile Card (Col 1-3) */}
        <div className="lg:col-span-3">
          <ProfileCard profile={profile} />
        </div>

        {/* Center Column: Running Track (Col 4-8) - The Hero Element */}
        <div className="lg:col-span-5">
          <RunningTrackWidget weeklyGoal={goals.weekly} activities={activities} />
        </div>

        {/* Right Column: Weekly Calendar (Col 9-12) */}
        <div className="lg:col-span-4">
          <TrainingCalendar days={trainingDays} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;