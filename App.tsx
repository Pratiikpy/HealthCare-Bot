
import React, { useState, useCallback } from 'react';
import type { User, Role } from './types';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const renderContent = () => {
    if (!currentUser) {
      return <Login onLogin={handleLogin} />;
    }
    switch (currentUser.role) {
      case 'user':
        return <UserDashboard user={currentUser} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Healthcare Bot. All rights reserved.</p>
        <p className="mt-1">This is a simulation and does not provide real medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
