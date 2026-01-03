
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ThemeMode } from '../types';

interface SettingsScreenProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onUpdateUser, onLogout }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleThemeChange = (mode: ThemeMode) => {
    onUpdateUser({ ...user, theme: mode });
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      setIsDeleting(true);
      setTimeout(() => {
        onLogout();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-100 dark:border-gray-800 p-4 flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <div className="p-4 space-y-8">
        <section>
          <h2 className="text-lg font-bold mb-4">Display</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => handleThemeChange(ThemeMode.LIGHT)}
              className={`w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 ${user.theme === ThemeMode.LIGHT ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <span>Light Mode</span>
              {user.theme === ThemeMode.LIGHT && <CheckIcon />}
            </button>
            <button 
              onClick={() => handleThemeChange(ThemeMode.DARK)}
              className={`w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 ${user.theme === ThemeMode.DARK ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <span>Dark Mode</span>
              {user.theme === ThemeMode.DARK && <CheckIcon />}
            </button>
            <button 
              onClick={() => handleThemeChange(ThemeMode.SYSTEM)}
              className={`w-full p-4 flex items-center justify-between ${user.theme === ThemeMode.SYSTEM ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <span>System Default</span>
              {user.theme === ThemeMode.SYSTEM && <CheckIcon />}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <button 
              onClick={onLogout}
              className="w-full p-4 flex items-center space-x-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span className="font-bold">Logout</span>
            </button>
            <button 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full p-4 flex items-center space-x-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              <span className="font-bold">{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
            </button>
          </div>
        </section>

        <section className="text-center pt-8">
           <p className="text-gray-500 text-sm">Clix v1.0.0 (Free Plan)</p>
           <p className="text-gray-500 text-xs mt-1">Built with Gemini Flash 3.0</p>
        </section>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
);

export default SettingsScreen;
