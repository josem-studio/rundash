import React from 'react';
import type { AthleteProfile } from '../types';
import { Card } from '@/components/ui/card';
import { User, Target, ChevronRight } from 'lucide-react';

interface ProfileCardProps {
  profile: AthleteProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-surface to-background">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-red-800 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
              <User size={32} className="text-white opacity-90" />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-background rounded-full"></div>
          </div>
          <button className="p-2 rounded-xl bg-surface/50 border border-border hover:border-primary/50 transition-colors">
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{profile.name}</h2>
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Member · SG Club</p>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target size={18} className="text-primary" />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Meta Activa</span>
          </div>
          <p className="text-lg font-bold text-white leading-tight">
            "{profile.primaryGoalText}"
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Running</span>
              <p className="text-xl font-black text-white font-mono">{profile.weeklyRunningGoal} <span className="text-[10px]">KM/W</span></p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Mensual</span>
              <p className="text-xl font-black text-white font-mono">{profile.monthlyRunningGoal} <span className="text-[10px]">KM/M</span></p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;