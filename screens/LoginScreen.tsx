
import React from 'react';
import { User, ThemeMode } from '../types';
import { ClixLogo } from '../components/Icons';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    // Simulating Google OAuth
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      email: 'user@example.com',
      name: '',
      username: '',
      dob: '',
      profileImage: 'https://picsum.photos/seed/default/200',
      theme: ThemeMode.DARK,
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
      followersCount: 0,
      followingCount: 0,
    };
    onLogin(mockUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-black">
      <div className="mb-12">
        <ClixLogo className="w-20 h-20" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center tracking-tight">Happening now</h1>
      <p className="text-xl md:text-2xl mb-12 text-center font-bold text-gray-700 dark:text-gray-300">Join Clix today.</p>

      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-white text-black border border-gray-300 rounded-full px-6 py-4 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>
        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-800"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-800"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 text-white rounded-full px-6 py-4 font-bold hover:bg-blue-600 transition-colors text-lg"
        >
          Create account
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-500 max-w-xs text-center leading-relaxed">
        By signing up, you agree to the <span className="text-blue-500 cursor-pointer">Terms of Service</span> and <span className="text-blue-500 cursor-pointer">Privacy Policy</span>, including <span className="text-blue-500 cursor-pointer">Cookie Use</span>.
      </p>
    </div>
  );
};

export default LoginScreen;
