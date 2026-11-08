import React from 'react';
import { LayoutDashboard, List, Target, BarChart3, Settings, LogOut } from 'lucide-react';
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
    { id: 'activities', label: 'Entrenamientos', icon: List },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-500 tracking-tighter italic">RUNDASH</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Performance Lab</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              activeTab === item.id
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              activeTab === item.id ? "text-white" : "text-gray-500 group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-3 text-gray-400">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold border border-orange-500/30">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Juan Deportista</p>
            <p className="text-xs text-gray-500 truncate">Plan Maratón 2024</p>
          </div>
        </div>
        <button className="w-full flex items-center space-x-3 px-4 py-2 mt-2 text-gray-500 hover:text-red-400 transition-colors">
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
