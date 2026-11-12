import React, { useState } from 'react';
import type { Activity } from '../types';
import { formatDate, getPaceLabel } from '../utils/formatters';
import { Activity as ActivityIcon, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ActivitiesProps {
  activities: Activity[];
}

const Activities: React.FC<ActivitiesProps> = ({ activities }) => {
  const [filter, setFilter] = useState<'all' | 'running' | 'cycling'>('all');
  const filtered = activities.filter((a) => {
    const typeMatch = filter === 'all' || a.type.toLowerCase() === filter;
    return typeMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1a1212]">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Historial</h2>
          <p className="text-[#555555] text-sm mt-1 font-medium">Análisis profundo de tus sesiones.</p>
        </div>
        <div className="flex bg-[#0a0a0a] p-1 rounded-2xl border border-[#1a1212]">
          {(['all', 'running', 'cycling'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#ff0000] text-white shadow-lg' : 'text-[#555555]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((activity) => (
          <Dialog key={activity.id}>
            <DialogTrigger render={
              <Card className="p-4 flex items-center justify-between cursor-pointer hover:border-[#ff0000]/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-[#1a1212] flex items-center justify-center">
                    <ActivityIcon size={20} className="text-[#ff0000]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{activity.title}</h4>
                    <p className="text-[10px] text-[#555555] font-medium uppercase tracking-wider">{formatDate(activity.date)} · {activity.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-black text-white tabular-nums">{activity.distance} <span className="text-[9px] text-[#444444]">km</span></p>
                  </div>
                  <ChevronRight size={18} className="text-[#333333]" />
                </div>
              </Card>
            } />
            <DialogContent className="bg-[#0a0a0a] border-[#221515] text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-black italic uppercase">{activity.title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-[#111111] rounded-xl border border-[#221515]">
                  <p className="text-[9px] text-[#555555] uppercase font-bold tracking-widest">Distancia</p>
                  <p className="text-lg font-black text-white">{activity.distance} km</p>
                </div>
                <div className="p-4 bg-[#111111] rounded-xl border border-[#221515]">
                  <p className="text-[9px] text-[#555555] uppercase font-bold tracking-widest">Ritmo</p>
                  <p className="text-lg font-black text-white">{activity.pace} {getPaceLabel(activity.type)}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default Activities;
