
import React, { useState } from 'react';
import { Post } from '../types';
import { db } from '../services/db';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);

  const handleLike = () => {
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    const newLikes = newLikedState ? likes + 1 : likes - 1;
    setLikes(newLikes);
    db.updatePost({ ...post, likes: newLikes, hasLiked: newLikedState });
  };

  return (
    <div className="p-4 flex space-x-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group">
      <img src={post.authorImage} className="w-12 h-12 rounded-full flex-shrink-0" alt={post.authorUsername} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1 mb-0.5">
          <span className="font-bold truncate">{post.authorName}</span>
          <span className="text-gray-500 truncate">@{post.authorUsername}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500 whitespace-nowrap">2h</span>
        </div>
        <p className="text-sm md:text-base leading-normal whitespace-pre-wrap">{post.content}</p>
        
        {post.link && (
          <a 
            href={post.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 block p-3 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              <span className="text-sm text-blue-500 truncate font-medium">{post.link}</span>
            </div>
          </a>
        )}

        {post.mediaUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {post.mediaUrl.includes('video') || post.mediaUrl.startsWith('blob:') && post.mediaUrl.includes('video') ? (
              <video src={post.mediaUrl} className="w-full h-auto" controls />
            ) : (
              <img src={post.mediaUrl} className="w-full h-auto object-cover max-h-96" alt="Post media" />
            )}
          </div>
        )}

        <div className="flex justify-between mt-3 text-gray-500 max-w-md">
          <button className="flex items-center space-x-2 group-hover:text-blue-500 transition-colors">
            <div className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"><ReplyIcon /></div>
            <span className="text-sm">{post.replies}</span>
          </button>
          <button className="flex items-center space-x-2 group-hover:text-green-500 transition-colors">
            <div className="p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"><RepostIcon /></div>
            <span className="text-sm">{post.reposts}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className={`flex items-center space-x-2 transition-colors ${hasLiked ? 'text-pink-600' : 'group-hover:text-pink-500'}`}>
            <div className={`p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20`}>{hasLiked ? <HeartFilledIcon /> : <HeartIcon />}</div>
            <span className="text-sm">{likes}</span>
          </button>
          <button className="flex items-center space-x-2 group-hover:text-blue-500 transition-colors">
            <div className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"><ShareIcon /></div>
          </button>
        </div>
      </div>
    </div>
  );
};

const ReplyIcon = () => <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current"><g><path d="M1.75 1.75h20.5c.966 0 1.75.784 1.75 1.75v15.5c0 .966-.784 1.75-1.75 1.75h-8.83l-5.27 5.09c-.23.22-.54.34-.86.34-.31 0-.61-.11-.84-.32-.23-.22-.36-.52-.36-.83V20.75H1.75c-.966 0-1.75-.784-1.75-1.75V3.5c0-.966.784-1.75 1.75-1.75zm0 1.5c-.14 0-.25.11-.25.25V19c0 .14.11.25.25.25H6.25v2.43l3.98-3.84.18-.17h11.84c.14 0 .25-.11.25-.25V3.5c0-.14-.11-.25-.25-.25H1.75z"></path></g></svg>;
const RepostIcon = () => <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current"><g><path d="M16.697 5.5c-1.222 0-2.379.51-3.213 1.389L12 8.406l-1.484-1.517C9.683 6.01 8.526 5.5 7.304 5.5 4.931 5.5 3 7.432 3 9.805c0 1.135.432 2.152 1.127 2.914l7.144 7.29c.196.2.453.3.729.3.276 0 .533-.1.729-.3l7.144-7.29c.695-.762 1.127-1.779 1.127-2.914 0-2.373-1.931-4.305-4.303-4.305zm-6.106 13.06L4.317 12.25c-.482-.527-.717-1.12-.717-1.745 0-1.546 1.257-2.805 2.804-2.805 1.155 0 2.15.753 2.503 1.874l.117.371.117-.371c.353-1.121 1.348-1.874 2.503-1.874 1.547 0 2.804 1.259 2.804 2.805 0 .625-.235 1.218-.717 1.745l-6.274 6.31z"></path></g></svg>;
const HeartFilledIcon = () => <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current"><g><path d="M20.884 13.19c.473-.526.716-1.13.716-1.743 0-2.372-1.93-4.303-4.303-4.303-1.222 0-2.379.51-3.213 1.389L12 10.067l-2.084-2.127c-.834-.879-1.991-1.389-3.213-1.389-2.373 0-4.303 1.931-4.303 4.303 0 .613.243 1.217.716 1.743l7.02 7.1c.49.495 1.288.495 1.778 0l7.01-7.1z"></path></g></svg>;
const ShareIcon = () => <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current"><g><path d="M4 4.5c0-.28.22-.5.5-.5H6v2H4.5c-.28 0-.5-.22-.5-.5v-10c0-.28.22-.5.5-.5h15c.28 0 .5.22.5.5v10c0 .28-.22.5-.5.5H18v-2h1.5c.28 0 .5-.22.5-.5v-10c0-.28-.22-.5-.5-.5h-15c-.28 0-.5.22-.5.5v10z"></path><path d="M12 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"></path></g></svg>;

export default PostCard;
