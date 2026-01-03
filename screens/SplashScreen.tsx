
import React from 'react';
import { ClixLogo } from '../components/Icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="text-white animate-pulse flex flex-col items-center">
        <ClixLogo className="w-24 h-24 mb-4" />
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Clix
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
