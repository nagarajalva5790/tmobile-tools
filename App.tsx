import React, { useState, useEffect, useMemo } from 'react';
import { APP_DATA } from './data';
import { AppDefinition, Category } from './types';
import { AppCard } from './components/AppCard';
import { SegmentedControl } from './components/SegmentedControl';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('app-portal-favorites-v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-portal-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('app-portal-favorites-v2', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app-portal-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app-portal-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const favoriteApps = useMemo(() => {
    return APP_DATA.filter((app) => favorites.includes(app.id));
  }, [favorites]);

  const filteredApps = useMemo(() => {
    let result = APP_DATA;

    // Filter by Category
    if (activeCategory !== 'ALL') {
      result = result.filter((app) => app.category === activeCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((app) => app.name.toLowerCase().includes(query) || app.category.toLowerCase().includes(query));
    }

    return result;
  }, [searchQuery, activeCategory]);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className='min-h-screen pb-20 bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500'>
      {/* Background blobs for "Alternative Design" feel */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20'>
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 blur-[120px] rounded-full'></div>
        <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 blur-[120px] rounded-full'></div>
      </div>

      <header className='sticky top-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill='none'
                stroke='white'
                strokeWidth='2.5'
              >
                <path d='M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z' />
                <polyline points='12 12 20 7.5' />
                <polyline points='12 12 12 21' />
                <polyline points='12 12 4 7.5' />
                <line x1='12' y1='3' x2='12' y2='12' />
              </svg>
            </div>
            <div>
              <h1 className='text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400'>
                T-MOBILE TOOLS
              </h1>
              <p className='text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest'>
                Enterprise Central
              </p>
            </div>
          </div>

          <div className='flex-1 max-w-lg mx-12 hidden lg:block'>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                  <circle cx='11' cy='11' r='8' />
                  <line x1='21' y1='21' x2='16.65' y2='16.65' />
                </svg>
              </div>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Find an application...'
                className='w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/5 rounded-2xl text-sm font-medium transition-all outline-none'
              />
            </div>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className='w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90'
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className='relative z-10 max-w-7xl mx-auto px-6 py-12'>
        {/* Navigation Switch */}
        <div className='mb-16 space-y-8'>
          <div className='text-center space-y-2'>
            <h2 className='text-4xl font-black text-slate-800 dark:text-white tracking-tighter'>Where to next?</h2>
            <p className='text-slate-500 dark:text-slate-400 font-medium'>Select your environment to browse available tools.</p>
          </div>
          <SegmentedControl active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Favorites Section (Floating Row) */}
        {!hasSearch && activeCategory === 'ALL' && favoriteApps.length > 0 && (
          <div className='mb-20'>
            <div className='flex items-center gap-3 mb-8'>
              <span className='p-2 bg-amber-500/10 rounded-xl text-amber-600'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
                  <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                </svg>
              </span>
              <h3 className='text-lg font-bold text-slate-800 dark:text-slate-200'>Quick Access</h3>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {favoriteApps.map((app) => (
                <AppCard key={app.id} app={app} isFavorite={true} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
            <div className='mt-12 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent'></div>
          </div>
        )}

        {/* Dynamic App Grid */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
              {activeCategory === 'ALL' ? 'Discovery' : `${activeCategory} Results`}
            </h3>
            <span className='px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500'>
              {filteredApps.length} APPS
            </span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} isFavorite={favorites.includes(app.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className='py-32 text-center bg-white/40 dark:bg-slate-800/20 backdrop-blur rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800'>
              <div className='w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400'>
                <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <circle cx='11' cy='11' r='8' />
                  <line x1='21' y1='21' x2='16.65' y2='16.65' />
                </svg>
              </div>
              <h4 className='text-xl font-bold text-slate-800 dark:text-white'>No applications match your search</h4>
              <p className='text-slate-500 dark:text-slate-400 mt-2'>Try switching categories or clearing your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                }}
                className='mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20'
              >
                Reset Dashboard
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Mobile Bottom Nav */}
      <div className='fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg lg:hidden z-50'>
        <div className='bg-slate-900/90 dark:bg-blue-600/90 backdrop-blur shadow-2xl rounded-3xl p-2 flex items-center gap-2 border border-white/10'>
          <div className='relative flex-1'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search...'
              className='w-full bg-white/10 border-none rounded-2xl py-3 pl-10 text-sm text-white placeholder-white/50 focus:ring-0'
            />
            <div className='absolute left-3 top-3.5 text-white/50'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                <circle cx='11' cy='11' r='8' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className='w-12 h-12 flex items-center justify-center bg-white/10 rounded-2xl text-white'
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
