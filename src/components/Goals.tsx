import React from 'react';
import type { AthleteProfile, Goals, TrainingDay, Activity } from '../types';
import { RunningTrackWidget } from './RunningTrackWidget';
import TrainingCalendar from './TrainingCalendar';
import { Calendar, Target } from 'lucide-react';

interface GoalsProps {
  profile: AthleteProfile;
  goals: Goals;
  trainingDays: TrainingDay[];
  activities: Activity[];
}

const Goals: React.FC<GoalsProps> = ({ profile, goals, trainingDays, activities }) => {
  const runningKm = trainingDays
    .filter((d) => d.type === 'Running')
    .reduce((acc, d) => acc + (d.plannedDistance || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header>
        <h2 className="text-3xl font-extrabold text-[#fafafa] tracking-tight">Objetivos</h2>
        <p className="text-[#a3a3a3] text-sm mt-1">Define y monitorea tus metas deportivas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <RunningTrackWidget weeklyGoal={goals.weekly} activities={activities} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <Target size={20} className="text-orange-500" />
              <h3 className="text-lg font-bold text-[#fafafa]">Configuración de Objetivo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider block mb-2">Objetivo Principal</label>
                <input
                  type="text"
                  value={profile.primaryGoalText}
                  disabled
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-2.5 text-[#fafafa] text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider block mb-2">Disciplina</label>
                <select
                  disabled
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-2.5 text-[#fafafa] text-sm focus:outline-none focus:border-orange-500"
                >
                  <option>Running</option>
                  <option>Ciclismo</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider block mb-2">Km Semanales</label>
                <input
                  type="number"
                  value={profile.weeklyRunningGoal}
                  disabled
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-2.5 text-[#fafafa] text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider block mb-2">Frecuencia</label>
                <input
                  type="number"
                  value="4"
                  disabled
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-2.5 text-[#fafafa] text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <p className="text-[#525252] text-xs mt-4 italic">
              * Los campos están bloqueados en esta versión de demostración. La funcionalidad de edición se habilitará en la Fase 2.
            </p>
          </div>

          <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar size={20} className="text-orange-500" />
              <h3 className="text-lg font-bold text-[#fafafa]">Plan Semanal Proyectado</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#262626]">
                <span className="text-xs text-[#a3a3a3]">Km Running Programados</span>
                <p className="text-2xl font-extrabold text-orange-500 font-mono mt-1">{runningKm.toFixed(1)} km</p>
              </div>
              <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#262626]">
                <span className="text-xs text-[#a3a3a3]">Sesiones Programadas</span>
                <p className="text-2xl font-extrabold text-blue-500 font-mono mt-1">{trainingDays.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrainingCalendar days={trainingDays} />
    </div>
  );
};

export default Goals;