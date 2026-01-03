
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ClixLogo } from './Icons';

interface MainLayoutProps {
  user: User;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, children }) => {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white max-w-7xl mx-auto">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-gray-100 dark:border-gray-800 p-4 sticky top-0 h-screen">
        <div className="mb-8 px-2 flex items-center">
          <ClixLogo className="w-10 h-10" />
          <span className="hidden lg:block ml-3 text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">Clix</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <SidebarLink to="/" icon={<HomeIcon />} label="Home" />
          <SidebarLink to="/explore" icon={<SearchIcon />} label="Explore" />
          <SidebarLink to="/notifications" icon={<BellIcon />} label="Notifications" />
          <SidebarLink to="/profile" icon={<UserIcon />} label="Profile" />
          <SidebarLink to="/settings" icon={<SettingsIcon />} label="Settings" />
        </nav>

        <div className="mt-auto pt-4 flex items-center lg:space-x-3 cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
          <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="hidden lg:block overflow-hidden">
            <p className="font-bold truncate text-sm">{user.name}</p>
            <p className="text-gray-500 text-xs truncate">@{user.username}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto border-x border-gray-100 dark:border-gray-800 pb-20 md:pb-0">
        {children}
      </main>

      {/* Widgets - Desktop Only */}
      <aside className="hidden lg:block w-80 p-4 space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
          <h2 className="font-extrabold text-xl mb-3">Who to follow</h2>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <img src={`https://picsum.photos/seed/${i + 10}/200`} className="w-10 h-10 rounded-full" />
                   <div>
                     <p className="font-bold text-sm">Suggested User {i}</p>
                     <p className="text-gray-500 text-xs">@user_{i}</p>
                   </div>
                 </div>
                 <button className="bg-black dark:bg-white text-white dark:text-black rounded-full px-4 py-1 text-sm font-bold hover:opacity-90">Follow</button>
               </div>
             ))}
          </div>
        </div>
      </aside>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50">
        <NavLink to="/" className={({isActive}) => isActive ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}><HomeIcon /></NavLink>
        <NavLink to="/explore" className={({isActive}) => isActive ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}><SearchIcon /></NavLink>
        <NavLink to="/notifications" className={({isActive}) => isActive ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}><BellIcon /></NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}><UserIcon /></NavLink>
      </nav>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({isActive}) => `flex items-center space-x-4 p-3 rounded-full transition-all duration-200 ${isActive ? 'font-bold scale-105' : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}
  >
    {icon}
    <span className="hidden lg:block text-xl">{label}</span>
  </NavLink>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true"><g><path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path><path d="M21.906 12.906C21.799 8.534 18.267 5 13.9 5H11V3h2c5.965 0 10.817 4.805 10.997 10.746l-.003.159c0 .553-.447 1-1 1s-1-.447-1-1l.012-.999zM2.094 11.094C2.201 15.466 5.733 19 10.1 19h2.9v2h-2.9C4.135 21 .283 16.195.103 10.254l.003-.159c0-.553.447-1 1-1s1 .447 1 1l-.012.999z"></path></g></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true"><g><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></g></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true"><g><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></g></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true"><g><path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zM19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65c-.03-.24-.24-.42-.49-.42h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"></path></g></svg>
);

export default MainLayout;
