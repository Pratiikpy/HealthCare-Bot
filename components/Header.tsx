
import React from 'react';
import type { User } from '../types';
import { Button } from './common/Button';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-800">AI Healthcare Bot</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-slate-600">
                Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
              </span>
              <Button onClick={onLogout} variant="secondary">Logout</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
