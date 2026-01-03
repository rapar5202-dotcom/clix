
import { Post, User, ThemeMode } from './types';

export const APP_NAME = 'Clix';

export const INITIAL_USER: Partial<User> = {
  theme: ThemeMode.DARK,
  onboardingCompleted: false,
};

export const MOCK_TRENDS = [
  { id: '1', hashtag: '#GeminiAI', postsCount: '12.5K' },
  { id: '2', hashtag: '#ClixLaunch', postsCount: '8.2K' },
  { id: '3', hashtag: '#WebDev', postsCount: '4.1K' },
  { id: '4', hashtag: '#React19', postsCount: '1.9K' },
  { id: '5', hashtag: '#FutureOfSocial', postsCount: '500' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    authorName: 'Alex River',
    authorUsername: 'ariver',
    authorImage: 'https://picsum.photos/seed/alex/200',
    content: 'Just joined Clix! This UI is so fast. 🔥 #NewBeginnings',
    likes: 24,
    replies: 3,
    reposts: 2,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'p2',
    userId: 'u2',
    authorName: 'Gemini Expert',
    authorUsername: 'ai_guru',
    authorImage: 'https://picsum.photos/seed/gemini/200',
    content: 'The new Gemini models are changing everything about how we build software. #AI #Future',
    mediaUrl: 'https://picsum.photos/seed/ai/800/400',
    likes: 156,
    replies: 12,
    reposts: 45,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
];
