
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { db } from '../services/db';

interface ProfileSetupProps {
  user: User;
  onUpdate: (user: User) => void;
}

const ProfileSetupScreen: React.FC<ProfileSetupProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(user.username || '');
  const [dob, setDob] = useState(user.dob || '');
  const [bio, setBio] = useState(user.bio || '');
  const [image, setImage] = useState(user.profileImage || 'https://picsum.photos/seed/profile/200');
  
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameError, setUsernameError] = useState('');
  
  const navigate = useNavigate();

  // Real-time username validation
  useEffect(() => {
    const validateUsername = () => {
      const cleanUsername = username.trim().toLowerCase();
      
      if (!cleanUsername) {
        setUsernameStatus('idle');
        setUsernameError('');
        return;
      }

      // Format check
      const regex = /^[a-z0-9_]{3,20}$/;
      if (!regex.test(cleanUsername)) {
        setUsernameStatus('invalid');
        setUsernameError('3-20 chars: a-z, 0-9, _ only');
        return;
      }

      setUsernameStatus('checking');
      
      // Simulate API latency
      const timer = setTimeout(() => {
        const taken = db.isUsernameTaken(cleanUsername, user.id);
        if (taken) {
          setUsernameStatus('taken');
          setUsernameError('This username is already taken');
        } else {
          setUsernameStatus('available');
          setUsernameError('');
        }
      }, 400);

      return () => clearTimeout(timer);
    };

    const cleanup = validateUsername();
    return cleanup;
  }, [username, user.id]);

  const handleNext = () => {
    if (!name || !username || !dob) {
      alert("Please fill in all required fields.");
      return;
    }

    if (usernameStatus !== 'available' && usernameStatus !== 'idle') {
      alert("Please choose a valid and available username.");
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate > today) {
      alert("Date of birth cannot be in the future.");
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 13) {
      alert("You must be at least 13 years old to use Clix.");
      return;
    }

    const updatedUser = {
      ...user,
      name,
      username: username.toLowerCase().trim(),
      dob,
      bio,
      profileImage: image,
    };
    onUpdate(updatedUser);
    navigate('/onboarding/theme');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-2xl font-bold">Setup your profile</h1>
        </div>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-2">
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <label className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm font-bold cursor-pointer hover:bg-blue-600 transition-colors">
            Change Photo
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 rounded px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Username *</label>
              {usernameStatus === 'checking' && <span className="text-[10px] text-gray-500 animate-pulse">Checking...</span>}
              {usernameStatus === 'available' && <span className="text-[10px] text-green-500 font-bold">Available!</span>}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className={`w-full bg-transparent border rounded pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                  usernameStatus === 'available' ? 'border-green-500' : 
                  (usernameStatus === 'taken' || usernameStatus === 'invalid') ? 'border-red-500' : 
                  'border-gray-300 dark:border-gray-800'
                }`}
                placeholder="johndoe_123"
              />
            </div>
            {usernameError && <p className="text-[10px] text-red-500 mt-1">{usernameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth *</label>
            <input 
              type="date" 
              value={dob}
              min="1802-01-01"
              max="2026-12-31"
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 rounded px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-[10px] text-gray-500 mt-1">Accepted range: 1802 - 2026</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio (Optional)</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 rounded px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none h-24"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <button 
          onClick={handleNext}
          disabled={!name || !username || !dob || usernameStatus !== 'available'}
          className="w-full mt-10 bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full py-4 font-bold hover:bg-blue-600 transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
