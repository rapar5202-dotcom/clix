
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ThemeMode } from '../types';

interface ThemeSelectionProps {
  user: User;
  onUpdate: (user: User) => void;
}

const ThemeSelectionScreen: React.FC<ThemeSelectionProps> = ({ user, onUpdate }) => {
  const navigate = useNavigate();

  const handleThemeChange = (mode: ThemeMode) => {
    onUpdate({ ...user, theme: mode });
  };

  const handleFinish = () => {
    onUpdate({ ...user, onboardingCompleted: true });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-2xl font-bold">Choose your theme</h1>
        </div>
        <p className="text-gray-500 mb-10 ml-10">Select how you want Clix to look on your device.</p>

        <div className="grid grid-cols-1 gap-4">
          <ThemeCard 
            title="Dark Mode" 
            mode={ThemeMode.DARK} 
            active={user.theme === ThemeMode.DARK} 
            onClick={() => handleThemeChange(ThemeMode.DARK)}
            icon="🌙"
          />
          <ThemeCard 
            title="Light Mode" 
            mode={ThemeMode.LIGHT} 
            active={user.theme === ThemeMode.LIGHT} 
            onClick={() => handleThemeChange(ThemeMode.LIGHT)}
            icon="☀️"
          />
          <ThemeCard 
            title="System Default" 
            mode={ThemeMode.SYSTEM} 
            active={user.theme === ThemeMode.SYSTEM} 
            onClick={() => handleThemeChange(ThemeMode.SYSTEM)}
            icon="⚙️"
          />
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
           <p className="font-bold mb-2">Preview</p>
           <div className="flex space-x-2 items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">X</div>
              <div className="flex-1 h-2 rounded bg-gray-300 dark:bg-gray-700"></div>
           </div>
           <div className="mt-4 space-y-2">
              <div className="w-full h-12 rounded bg-white dark:bg-black border border-gray-200 dark:border-gray-800"></div>
              <div className="w-3/4 h-3 rounded bg-gray-200 dark:bg-gray-800"></div>
           </div>
        </div>

        <button 
          onClick={handleFinish}
          className="w-full mt-10 bg-blue-500 text-white rounded-full py-4 font-bold hover:bg-blue-600 transition-colors"
        >
          Enter Clix
        </button>
      </div>
    </div>
  );
};

const ThemeCard = ({ title, mode, active, onClick, icon }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-2xl cursor-pointer flex items-center justify-between border-2 transition-all ${
      active ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-800'
    }`}
  >
    <div className="flex items-center space-x-4">
      <span className="text-2xl">{icon}</span>
      <span className="font-bold text-lg">{title}</span>
    </div>
    {active && <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
    </div>}
  </div>
);

export default ThemeSelectionScreen;
