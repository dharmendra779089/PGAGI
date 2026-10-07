'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearFavorites } from '@/store/slices/favoritesSlice';
import { setActiveTab } from '@/store/slices/contentSlice';
import { ContentCard } from './ContentCard';
import { ContentItem } from '@/types';
import { useTranslation } from '@/lib/i18n';
import {
  Bookmark,
  Trash2,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface FavoritesSectionProps {
  onOpenDetail: (item: ContentItem) => void;
}

export function FavoritesSection({ onOpenDetail }: FavoritesSectionProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const { language } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation(language);

  const [favSearch, setFavSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFavorites = favorites.filter((item) => {
    const matchesSearch =
      favSearch === '' ||
      item.title.toLowerCase().includes(favSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(favSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 ring-8 ring-amber-500/5">
          <Bookmark className="w-8 h-8 fill-amber-500/20" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          No Bookmarks Saved Yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Explore news articles, streaming recommendations, and trending social posts in your feed and click the bookmark button to collect them here.
        </p>
        <button
          onClick={() => dispatch(setActiveTab('feed'))}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
        >
          <span>Explore Your Feed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
            <span>{t('favorites')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold ml-2">
              {favorites.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your saved reading list, movie watchlist, and preserved discussions
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search within favorites */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={favSearch}
              onChange={(e) => setFavSearch(e.target.value)}
              placeholder="Search saved items..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Clear all */}
          <button
            onClick={() => {
              if (window.confirm('Clear all saved bookmarks?')) {
                dispatch(clearFavorites());
              }
            }}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Clear all bookmarks"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Favorited Cards */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No bookmarks match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
