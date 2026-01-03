
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  dob: string;
  profileImage: string;
  bio?: string;
  theme: ThemeMode;
  createdAt: string;
  onboardingCompleted: boolean;
  followersCount: number;
  followingCount: number;
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  authorImage: string;
  content: string;
  mediaUrl?: string;
  link?: string;
  likes: number;
  replies: number;
  reposts: number;
  createdAt: string;
  hasLiked?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'reply' | 'mention' | 'system';
  userId: string;
  fromName: string;
  fromImage: string;
  content: string;
  postId?: string;
  createdAt: string;
}

export interface Trend {
  id: string;
  hashtag: string;
  postsCount: string;
}
