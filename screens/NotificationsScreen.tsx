
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const notifications = [
    {
      id: '1',
      type: 'like',
      from: 'Sarah J.',
      image: 'https://picsum.photos/seed/sarah/200',
      content: 'liked your post about Gemini API',
      time: '2h'
    },
    {
      id: '2',
      type: 'reply',
      from: 'Mark Tech',
      image: 'https://picsum.photos/seed/mark/200',
      content: 'replied: "This looks amazing!"',
      time: '5h'
    },
    {
      id: '3',
      type: 'system',
      from: 'Clix Team',
      image: 'https://picsum.photos/seed/clix/200',
      content: 'Welcome to Clix! Enjoy your free access.',
      time: '1d'
    }
  ];

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
        <h1 className="text-xl font-bold">Notifications</h1>
      </header>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.map(notif => (
          <div key={notif.id} className="p-4 flex space-x-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
            <div className="flex-shrink-0 pt-1">
              {notif.type === 'like' && <HeartFilledIcon className="text-pink-600 w-6 h-6" />}
              {notif.type === 'reply' && <ReplyFilledIcon className="text-blue-500 w-6 h-6" />}
              {notif.type === 'system' && <ClixIcon className="text-blue-500 w-6 h-6" />}
            </div>
            <div className="flex-1">
              <img src={notif.image} className="w-8 h-8 rounded-full mb-2" alt={notif.from} />
              <p className="text-sm md:text-base">
                <span className="font-bold">{notif.from}</span> {notif.content}
              </p>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HeartFilledIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className || "w-6 h-6 fill-current"}><g><path d="M20.884 13.19c.473-.526.716-1.13.716-1.743 0-2.372-1.93-4.303-4.303-4.303-1.222 0-2.379.51-3.213 1.389L12 10.067l-2.084-2.127c-.834-.879-1.991-1.389-3.213-1.389-2.373 0-4.303 1.931-4.303 4.303 0 .613.243 1.217.716 1.743l7.02 7.1c.49.495 1.288.495 1.778 0l7.01-7.1z"></path></g></svg>
);
const ReplyFilledIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className || "w-6 h-6 fill-current"}><g><path d="M1.75 1.75h20.5c.966 0 1.75.784 1.75 1.75v15.5c0 .966-.784 1.75-1.75 1.75h-8.83l-5.27 5.09c-.23.22-.54.34-.86.34-.31 0-.61-.11-.84-.32-.23-.22-.36-.52-.36-.83V20.75H1.75c-.966 0-1.75-.784-1.75-1.75V3.5c0-.966.784-1.75 1.75-1.75z"></path></g></svg>
);
const ClixIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6 fill-current"} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
);

export default NotificationsScreen;
