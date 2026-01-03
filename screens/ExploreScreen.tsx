
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_TRENDS } from '../constants';
import { gemini } from '../services/geminiService';

const ExploreScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [trendSummary, setTrendSummary] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrends = async () => {
      const summary = await gemini.getTrendingSummary();
      setTrendSummary(summary);
    };
    fetchTrends();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const result = await gemini.searchWithGrounding(searchQuery);
    setSearchResult(result);
    setIsSearching(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-100 dark:border-gray-800 p-3 flex items-center space-x-2">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors flex-shrink-0"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <form onSubmit={handleSearch} className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search Clix Grounding..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-full py-2.5 pl-12 pr-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </form>
      </header>

      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Searching the live web with Gemini...</p>
          </div>
        ) : searchResult ? (
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-blue-50/30 dark:bg-blue-900/10">
            <div className="flex items-center space-x-2 mb-2 text-blue-500">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
               <span className="font-bold text-sm">Grounding Intelligence</span>
            </div>
            <p className="text-sm md:text-base leading-relaxed mb-4">{searchResult.text}</p>
            {searchResult.sources.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500">SOURCES</p>
                {searchResult.sources.map((chunk: any, i: number) => (
                  chunk.web && (
                    <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:underline truncate">
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  )
                ))}
              </div>
            )}
            <button onClick={() => setSearchResult(null)} className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase">Clear results</button>
          </div>
        ) : null}

        <div className="p-4">
          <h2 className="text-xl font-extrabold mb-4">Trends for you</h2>
          {trendSummary && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-blue-500 mb-2">AI SUMMARY</p>
              <p className="text-sm italic">{trendSummary}</p>
            </div>
          )}
          <div className="space-y-6">
            {MOCK_TRENDS.map(trend => (
              <div key={trend.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 -mx-4 px-4 py-2 transition-colors">
                <p className="text-gray-500 text-xs">Trending in Tech</p>
                <p className="font-bold text-lg">{trend.hashtag}</p>
                <p className="text-gray-500 text-sm">{trend.postsCount} posts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreScreen;
