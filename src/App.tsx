import React from 'react';
import { MOCK_ACTIVITIES, MOCK_GOALS } from './data/mockData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard activities={MOCK_ACTIVITIES} goals={MOCK_GOALS} />
        )}
        {activeTab === 'activities' && (
          <Activities activities={MOCK_ACTIVITIES} />
        )}
        {(activeTab === 'goals' || activeTab === 'stats') && (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-gray-500">Sección en construcción</h2>
            <p className="text-gray-600 mt-2">Esta funcionalidad llegará pronto.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
