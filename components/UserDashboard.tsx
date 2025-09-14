import React, { useState } from 'react';
import type { User } from '../types';
import Chatbot from './Chatbot';
import FindHealthcare from './FindHealthcare';
import Profile from './Profile';

interface UserDashboardProps {
  user: User;
}

type ActiveTab = 'chat' | 'find' | 'profile';

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chatbot />;
      case 'find':
        return <FindHealthcare />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return null;
    }
  };

  // Fix: Replaced JSX.Element with React.ReactNode to resolve the "Cannot find namespace 'JSX'" error.
  const TabButton: React.FC<{ tabName: ActiveTab; label: string; icon: React.ReactNode; }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tabName
          ? 'bg-teal-500 text-white'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <TabButton 
            tabName="chat" 
            label="Chat with Bot" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>} 
          />
          <TabButton 
            tabName="find" 
            label="Find Healthcare" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>} 
          />
          <TabButton 
            tabName="profile" 
            label="My Profile" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
          />
        </div>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default UserDashboard;