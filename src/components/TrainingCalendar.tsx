import React from 'react';
import type { TrainingDay } from '../types';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

interface TrainingCalendarProps {
  days: TrainingDay[];
}

const TrainingCalendar: React.FC<TrainingCalendarProps> = ({ days }) => {
  return (
    <div className="bg-[#111111] border border-[#221515] p-6 rounded-[2rem] shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-bold text-[#666666] uppercase tracking-[0.2em]">Plan Semanal</h3>
          <p className="text-lg font-bold text-white mt-0.5">Calendario de Sesiones</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1a1212] flex items-center justify-center border border-[#221515]">
          <Calendar size={18} className="text-[#ff0000]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {days.map((day) => (
          <div
            key={day.id}
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              day.completed
                ? 'bg-[#161616] border-[#333333] opacity-80'
                : 'bg-[#0d0d0d] border-[#1a1212] hover:border-[#ff0000]/30'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-[#1a1212] border border-[#221515]">
                <span className="text-[9px] font-black text-[#555555] uppercase tracking-wider">{day.dayOfWeek.substring(0, 2)}</span>
                <span className="text-xs font-black text-white tabular-nums">04</span>
              </div>

              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-white line-clamp-1">{day.title}</h4>
                <p className="text-[10px] text-[#555555] font-medium uppercase tracking-wider">
                  {day.type} {day.plannedDistance ? `· ${day.plannedDistance} km` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {day.completed ? (
                <CheckCircle2 size={18} className="text-[#ff0000]" />
              ) : (
                <Circle size={18} className="text-[#333333]" />
              )}
              {day.plannedDuration && (
                <div className="flex items-center space-x-1 text-[9px] font-bold text-[#444444] tabular-nums">
                  <Clock size={10} />
                  <span>{day.plannedDuration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingCalendar;