
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Post } from '../types';
import { db } from '../services/db';
import PostCard from '../components/PostCard';

interface ProfileScreenProps {
  user: User;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allPosts = db.getPosts();
    setPosts(allPosts.filter(p => p.userId === user.id));
  }, [user.id]);

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-100 dark:border-gray-800 p-4 flex items-center space-x-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-gray-500 text-sm">{posts.length} posts</p>
        </div>
      </header>

      {/* Banner */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>

      <div className="px-4 relative mb-4">
        <div className="flex justify-between items-end -mt-16 mb-4">
          <img 
            src={user.profileImage} 
            className="w-32 h-32 rounded-full border-4 border-white dark:border-black bg-gray-100" 
            alt={user.name} 
          />
          <button className="bg-transparent border border-gray-300 dark:border-gray-800 rounded-full px-4 py-2 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            Edit profile
          </button>
        </div>

        <div>
          <h2 className="text-xl font-extrabold">{user.name}</h2>
          <p className="text-gray-500">@{user.username}</p>
        </div>

        <p className="mt-3 leading-relaxed">{user.bio || 'No bio yet.'}</p>

        <div className="flex items-center space-x-2 mt-3 text-gray-500 text-sm">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
           <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="flex space-x-4 mt-4 text-sm">
          <div><span className="font-bold">{user.followingCount}</span> <span className="text-gray-500">Following</span></div>
          <div><span className="font-bold">{user.followersCount}</span> <span className="text-gray-500">Followers</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        <button className="flex-1 py-4 font-bold border-b-4 border-blue-500">Posts</button>
        <button className="flex-1 py-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium">Replies</button>
        <button className="flex-1 py-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium">Likes</button>
      </div>

      {/* User's Posts */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="p-10 text-center text-gray-500">
            <p className="text-xl font-bold text-black dark:text-white">No posts yet.</p>
            <p>Start posting to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
