import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Post } from '../types';
import { db } from '../services/db';
import { realtime } from '../services/realtime';
import PostCard from '../components/PostCard';
import { LinkIcon } from '../components/Icons';

interface HomeScreenProps {
  user: User;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(db.getPosts());

    // Subscribe to real-time updates for a "live" feel
    const unsubscribe = realtime.subscribe((event) => {
      if (event.type === 'NEW_POST') {
        const newPost = event.payload;
        setPosts(prev => {
          if (prev.find(p => p.id === newPost.id)) return prev;
          return [newPost, ...prev];
        });
      } else if (event.type === 'LIKE_UPDATE') {
        const { postId, likes, hasLiked } = event.payload;
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, likes, hasLiked } : p
        ));
      }
    });

    return () => unsubscribe();
  }, []);

  // Reliability: Media Upload Simulation with actual File processing
  const startUpload = async (file: File) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadError(null);

    // Image/Video validation
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime']; // MOV is quicktime
    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      setUploadError('Invalid format. Use JPG, PNG, WEBP, MP4, or MOV.');
      setUploadStatus('error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB Limit
      setUploadError('File too large (max 50MB).');
      setUploadStatus('error');
      return;
    }

    // Generate local preview immediately for UX
    const localUrl = URL.createObjectURL(file);
    setMediaPreview(localUrl);

    // Simulate reliable upload process
    return new Promise<void>((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        const step = Math.floor(Math.random() * 20) + 5;
        progress += step;
        
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(100);
          clearInterval(interval);
          
          // 5% simulated failure rate to demonstrate error handling/retry
          if (Math.random() < 0.05) {
            setUploadStatus('error');
            setUploadError('Network interrupted. Tap to retry.');
            reject('Upload failed');
          } else {
            setUploadStatus('success');
            resolve();
          }
        } else {
          setUploadProgress(progress);
        }
      }, 150);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    try {
      await startUpload(file);
    } catch (err) {
      console.log('Upload error handled by state');
    }
  };

  const handleRetryUpload = () => {
    if (mediaFile) startUpload(mediaFile);
  };

  const handleCreatePost = () => {
    const trimmedContent = newPostContent.trim();
    if (!trimmedContent && !mediaFile && !link) return;
    if (mediaFile && uploadStatus !== 'success') return;
    if (isPosting) return;
    
    setIsPosting(true);
    const newPost: Post = {
      id: 'p' + Math.random().toString(36).substring(7),
      userId: user.id,
      authorName: user.name,
      authorUsername: user.username,
      authorImage: user.profileImage,
      content: trimmedContent,
      mediaUrl: mediaPreview || undefined,
      link: link || undefined,
      likes: 0,
      replies: 0,
      reposts: 0,
      createdAt: new Date().toISOString(),
    };

    // Simulate DB save latency
    setTimeout(() => {
      db.savePost(newPost);
      resetForm();
      setIsPosting(false);
    }, 500);
  };

  const resetForm = () => {
    setNewPostContent('');
    setMediaFile(null);
    setMediaPreview(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError(null);
    setLink('');
    setShowLinkInput(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = () => resetForm();

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="md:hidden">
          <img src={user.profileImage} className="w-8 h-8 rounded-full" alt="Profile" />
        </div>
      </header>

      {/* Create Post Section */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex space-x-4">
        <img src={user.profileImage} className="w-12 h-12 rounded-full flex-shrink-0 object-cover" alt="Me" />
        <div className="flex-1 min-w-0">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full bg-transparent text-xl outline-none resize-none mt-2 placeholder:text-gray-500 min-h-[80px]"
            placeholder="What's happening?"
          />

          {/* Media Upload UI */}
          {(mediaPreview || uploadStatus !== 'idle') && (
            <div className="relative mt-3 mb-2 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm">
              {mediaPreview && (
                <div className={`${uploadStatus === 'uploading' || uploadStatus === 'error' ? 'opacity-30 blur-[2px]' : 'opacity-100'} transition-all duration-300`}>
                  {mediaFile?.type.startsWith('video') ? (
                    <video src={mediaPreview} className="w-full rounded-2xl" muted />
                  ) : (
                    <img src={mediaPreview} className="w-full h-auto object-cover max-h-[400px]" alt="Media preview" />
                  )}
                </div>
              )}

              {uploadStatus === 'uploading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/5 dark:bg-white/5">
                  <div className="w-full max-w-[240px] bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-3">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-200 ease-out" 
                      style={{ width: `${uploadProgress}%` }} 
                    />
                  </div>
                  <span className="text-blue-500 text-xs font-black uppercase tracking-widest">{uploadProgress}% Uploading...</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-red-500/10 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="text-red-600 dark:text-red-400 font-bold text-sm mb-3 text-center">{uploadError}</p>
                  <div className="flex space-x-3">
                    <button onClick={handleRetryUpload} className="bg-blue-500 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-600 transition-colors">Retry Upload</button>
                    <button onClick={removeMedia} className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {uploadStatus === 'success' && !isPosting && (
                <button 
                  onClick={removeMedia} 
                  className="absolute top-3 right-3 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-all hover:scale-110"
                  aria-label="Remove media"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </div>
          )}

          {showLinkInput && (
            <div className="mt-2 mb-3 flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all">
              <LinkIcon />
              <input 
                type="url" 
                placeholder="https://example.com" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
                className="bg-transparent text-sm flex-1 outline-none" 
                autoFocus 
              />
              <button onClick={() => { setShowLinkInput(false); setLink(''); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-4">
             <div className="flex space-x-1">
               <input 
                 type="file" 
                 accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" 
                 className="hidden" 
                 ref={fileInputRef} 
                 onChange={handleFileChange} 
                 disabled={uploadStatus === 'uploading' || isPosting} 
               />
               <button 
                 onClick={() => fileInputRef.current?.click()} 
                 className={`p-2.5 rounded-full text-blue-500 transition-all ${uploadStatus === 'uploading' || isPosting ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-90'}`}
                 title="Media"
                 disabled={uploadStatus === 'uploading' || isPosting}
               >
                 <ImageIcon />
               </button>
               <button 
                 onClick={() => setShowLinkInput(!showLinkInput)} 
                 className={`p-2.5 rounded-full text-blue-500 transition-all ${showLinkInput ? 'bg-blue-50 dark:bg-blue-900/40' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-90'}`} 
                 disabled={isPosting}
                 title="Link"
               >
                 <LinkIcon />
               </button>
               <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2.5 rounded-full transition-all active:scale-90" disabled={isPosting}><EmojiIcon /></button>
             </div>
             <button 
               onClick={handleCreatePost} 
               disabled={(!newPostContent.trim() && !mediaFile && !link) || isPosting || uploadStatus === 'uploading' || (mediaFile && uploadStatus !== 'success')} 
               className="bg-blue-500 disabled:opacity-50 text-white font-black px-8 py-2.5 rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center space-x-2"
             >
               {isPosting ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Posting</span>
                 </>
               ) : 'Post'}
             </button>
          </div>
        </div>
      </div>

      {/* Feed Area */}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
        {posts.length === 0 ? (
          <div className="p-20 text-center animate-fade-in">
             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
             </div>
             <p className="text-gray-500 font-medium">Nothing to see here yet.</p>
             <p className="text-gray-400 text-sm">Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

const ImageIcon = () => <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><g><path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.41 0 .75.34.75.75v12.56l-5.24-5.25c-.3-.3-.77-.3-1.06 0L11 14.72l-2.73-2.73c-.3-.3-.77-.3-1.06 0l-3.71 3.71V4.25c0-.41.34-.75.75-.75zM3.5 19.75v-1.87l4.5-4.5 2.73 2.72c.3.3.77.3 1.06 0l3.25-3.25 4.71 4.71v2.19c0 .41-.34.75-.75.75H4.25c-.41 0-.75-.34-.75-.75zM8.5 11c1.38 0 2.5-1.12 2.5-2.5S9.88 6 8.5 6 6 7.12 6 8.5 7.12 11 8.5 11zm0-3.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"></path></g></svg>;
const EmojiIcon = () => <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><g><path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25 22.75 6.07 22.75 12 17.93 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12s4.15 9.25 9.25 9.25 9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path><path d="M12 17.11c-1.73 0-3.32-.97-4.13-2.53-.13-.24-.03-.54.21-.67.24-.13.54-.03.67.21.65 1.25 1.93 2.02 3.25 2.02s2.6-.77 3.25-2.02c.13-.24.43-.34.67-.21.24.13.34.43.21.67-.81 1.56-2.4 2.53-4.13 2.53zm-3.14-5.91c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6.28 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></g></svg>;

export default HomeScreen;