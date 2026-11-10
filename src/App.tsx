import { useEffect, useState } from 'react';
import { activityService } from './services/dataService';
import type { Activity } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Goals from './components/Goals';
import Stats from './components/Stats';
import { StravaConnect } from './components/StravaConnect';
import { CoachChat } from './components/CoachChat';

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
    <div className="flex bg-[#0a0a0a] min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StravaConnect onSyncSuccess={loadActivities} />
          </div>
          <div className="lg:col-span-1">
             <CoachChat activities={activities} goals={goals} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-[#a3a3a3]">
            <p className="text-sm font-medium">Cargando actividades...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;