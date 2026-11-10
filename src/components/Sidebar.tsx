import React from 'react';
import { LayoutDashboard, List, Target, BarChart3, LogOut, Settings, Bell } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities', label: 'Historial', icon: List },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'stats', label: 'Análisis', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-[#050505] border-r border-[#1a1212] flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-9 bg-[#ff0000] rounded-full shadow-[0_0_15px_rgba(255,0,0,0.6)]" />
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">SG RUNNING</h1>
            <p className="text-[9px] text-[#ff0000] font-black uppercase tracking-[0.25em]">Vacila y Corre</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative",
              activeTab === item.id
                ? "bg-[#110808] text-white shadow-[0_4px_20px_rgba(255,0,0,0.15)] border border-[#ff0000]/20"
                : "text-[#666666] hover:text-white hover:bg-[#0a0505]"
            )}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 w-1 h-5 bg-[#ff0000] rounded-r-full shadow-[0_0_10px_#ff0000]" />
            )}
            <item.icon size={18} className={cn(
              "transition-colors duration-300",
              activeTab === item.id ? "text-[#ff0000]" : "text-[#444444] group-hover:text-white"
            )} />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-[#1a1212] space-y-6">
        <div className="flex items-center justify-around px-2">
          <button className="text-[#444444] hover:text-[#ff0000] transition-colors">
            <Settings size={18} />
          </button>
          <button className="text-[#444444] hover:text-[#ff0000] transition-colors relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff0000] rounded-full border-2 border-[#050505]" />
          </button>
          <button className="text-[#444444] hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>

        <div className="bg-[#0c0c0c] p-4 rounded-2xl border border-[#1a1212] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#ff0000]/10 flex items-center justify-center text-[#ff0000] font-black text-xs border border-[#ff0000]/30 shadow-[0_0_10px_rgba(255,0,0,0.2)]">
            SG
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate uppercase tracking-tighter">SG Club Member</p>
            <p className="text-[9px] text-[#ff0000] font-bold truncate uppercase tracking-widest mt-0.5">Corre y Vacila</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;