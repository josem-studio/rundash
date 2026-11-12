import { useEffect, useState } from 'react';
import { activityService } from './services/dataService';
import type { Activity } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Goals from './components/Goals';
import Stats from './components/Stats';
import { CoachChat } from './components/CoachChat';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Bot } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const profile = activityService.getProfile();
  const goals = activityService.getGoals();
  const trainingDays = activityService.getTrainingDays();

  const loadActivities = async () => {
    setLoading(true);
    const data = await activityService.getActivities();
    setActivities(data);
    setLoading(false);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <div className="flex bg-[#08090B] min-h-screen text-[#F4F4F5] selection:bg-[#ff0000]/30 pb-20 lg:pb-0">
      <div className="hidden lg:block w-64 shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-[#8B929E]">
            <p className="text-sm font-medium animate-pulse">Cargando...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard activities={activities} goals={goals} profile={profile} trainingDays={trainingDays} />
            )}
            {activeTab === 'activities' && (
              <Activities activities={activities} />
            )}
            {activeTab === 'goals' && (
              <Goals profile={profile} goals={goals} trainingDays={trainingDays} activities={activities} />
            )}
            {activeTab === 'stats' && (
              <Stats activities={activities} />
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button for Coach */}
      <Dialog>
        <DialogTrigger>
          <button className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 w-14 h-14 bg-[#ff0000] rounded-full shadow-2xl shadow-[#ff0000]/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-50">
            <Bot size={24} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-[400px] p-0 border-none bg-transparent">
          <CoachChat activities={activities} goals={goals} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;