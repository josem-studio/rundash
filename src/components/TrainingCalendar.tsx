import React from 'react';
import type { TrainingDay } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

interface TrainingCalendarProps {
  days: TrainingDay[];
}

const TrainingCalendar: React.FC<TrainingCalendarProps> = ({ days }) => {
  return (
    <Card className="border-border/50 bg-[#08090B]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.25em]">Plan Semanal</CardTitle>
          <p className="text-sm font-bold text-white">Calendario de Sesiones</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border">
          <Calendar size={18} className="text-primary" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3">
        {days.map((day) => (
          <div
            key={day.id}
            className={`group p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              day.completed
                ? 'bg-card/50 border-border opacity-60'
                : 'bg-card border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-background border border-border">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">{day.dayOfWeek.substring(0, 2)}</span>
                <span className="text-xs font-black text-white tabular-nums">04</span>
              </div>

              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-white leading-tight mb-0.5">{day.title}</h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {day.type} {day.plannedDistance ? `· ${day.plannedDistance} km` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {day.completed ? (
                <CheckCircle2 size={18} className="text-primary" />
              ) : (
                <Circle size={18} className="text-border" />
              )}
              {day.plannedDuration && (
                <div className="flex items-center space-x-1 text-[9px] font-black text-muted-foreground tabular-nums">
                  <Clock size={10} />
                  <span>{day.plannedDuration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrainingCalendar;