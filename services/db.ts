import { User, Post, Notification, ThemeMode } from '../types';
import { MOCK_POSTS } from '../constants';
import { realtime } from './realtime';

const KEYS = {
  USER: 'clix_user',
  POSTS: 'clix_posts',
  NOTIFICATIONS: 'clix_notifications',
  USERNAMES: 'clix_registered_usernames',
};

export const db = {
  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  
  saveUser: (user: User) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
    if (user.username) {
      db.registerUsername(user.username, user.id);
    }
  },

  isUsernameTaken: (username: string, currentUserId?: string): boolean => {
    const registry = db.getUsernameRegistry();
    const existingId = registry[username.toLowerCase().trim()];
    // If username is taken by a DIFFERENT user, return true
    return !!existingId && existingId !== currentUserId;
  },

  registerUsername: (username: string, userId: string) => {
    const registry = db.getUsernameRegistry();
    const cleanUsername = username.toLowerCase().trim();
    
    // 1. Remove user from any old usernames they held
    for (const key in registry) {
      if (registry[key] === userId) {
        delete registry[key];
      }
    }
    
    // 2. Register the new one
    registry[cleanUsername] = userId;
    localStorage.setItem(KEYS.USERNAMES, JSON.stringify(registry));
  },

  getUsernameRegistry: (): Record<string, string> => {
    const data = localStorage.getItem(KEYS.USERNAMES);
    if (!data) {
      // Seed with initial usernames
      const initialRegistry: Record<string, string> = {
        'ariver': 'u1',
        'ai_guru': 'u2'
      };
      localStorage.setItem(KEYS.USERNAMES, JSON.stringify(initialRegistry));
      return initialRegistry;
    }
    return JSON.parse(data);
  },
  
  getPosts: (): Post[] => {
    const data = localStorage.getItem(KEYS.POSTS);
    if (!data) {
      localStorage.setItem(KEYS.POSTS, JSON.stringify(MOCK_POSTS));
      return MOCK_POSTS;
    }
    return JSON.parse(data);
  },
  
  savePost: (post: Post) => {
    const posts = db.getPosts();
    posts.unshift(post);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    // Real-time broadcast for other components/tabs
    realtime.broadcast('NEW_POST', post);
  },

  updatePost: (updatedPost: Post) => {
    const posts = db.getPosts();
    const index = posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = updatedPost;
      localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
      // Broadcast update (likes/reposts)
      realtime.broadcast('LIKE_UPDATE', { 
        postId: updatedPost.id, 
        likes: updatedPost.likes, 
        hasLiked: updatedPost.hasLiked 
      });
    }
  },

  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },

  clearAll: () => {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.POSTS);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    // Note: Usernames registry is NOT cleared so unique identity persists in this local mock
  }
};