import React from 'react';
import type { AthleteProfile } from '../types';
import { User, Target } from 'lucide-react';

interface ProfileCardProps {
  profile: AthleteProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center">
          <User size={32} className="text-orange-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#fafafa]">{profile.name}</h2>
          <p className="text-[#a3a3a3] text-sm uppercase tracking-wider">Atleta</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-t border-[#262626] pt-4">
          <h3 className="text-[#a3a3a3] text-xs font-semibold uppercase tracking-wider mb-2">Objetivo Principal</h3>
          <p className="text-[#fafafa] font-medium">"{profile.primaryGoalText}"</p>
        </div>

        <div className="border-t border-[#262626] pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Target size={18} className="text-orange-500" />
            <h3 className="text-[#a3a3a3] text-xs font-semibold uppercase tracking-wider">Objetivos Semanales</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#262626]">
              <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider block mb-1">Running</span>
              <p className="text-lg font-extrabold text-orange-500 font-mono">{profile.weeklyRunningGoal} km</p>
            </div>
            <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#262626]">
              <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider block mb-1">Mensual</span>
              <p className="text-lg font-extrabold text-blue-500 font-mono">{profile.monthlyRunningGoal} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;