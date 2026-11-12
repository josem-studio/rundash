import React from 'react';
import { LayoutDashboard, List, Target, BarChart3 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities', label: 'Historial', icon: List },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'stats', label: 'Análisis', icon: BarChart3 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#08090B]/90 backdrop-blur-lg border-t border-[#1a1212] px-4 py-2 z-50 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300",
              isActive ? "text-[#ff0000]" : "text-[#666666] hover:text-[#aaaaaa]"
            )}
          >
            <Icon size={20} className={isActive ? "text-[#ff0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]" : ""} />
            <span className="text-[10px] font-bold tracking-tight mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileNav;