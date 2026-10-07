'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setActiveType,
  setSortBy,
  setSearchQuery,
  setActiveCategory,
} from '@/store/slices/contentSlice';
import { useTranslation } from '@/lib/i18n';
import { ContentType, SortOption } from '@/types';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Move,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface FilterBarProps {
  isReordering: boolean;
  onToggleReordering: () => void;
  itemCount: number;
}

export function FilterBar({
  isReordering,
  onToggleReordering,
  itemCount,
}: FilterBarProps) {
  const dispatch = useAppDispatch();
  const { activeType, sortBy, searchQuery, activeCategory } = useAppSelector((state) => state.content);
  const { language } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation(language);

  const typeFilters: { id: ContentType | 'all'; labelKey: string }[] = [
    { id: 'all', labelKey: 'allSources' },
    { id: 'news', labelKey: 'news' },
    { id: 'recommendation', labelKey: 'recommendations' },
    { id: 'social', labelKey: 'social' },
  ];

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'newest', label: 'Newest First' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  const hasActiveFilters = searchQuery !== '' || activeCategory !== 'all' || activeType !== 'all';

  const resetAllFilters = () => {
    dispatch(setSearchQuery(''));
    dispatch(setActiveCategory('all'));
    dispatch(setActiveType('all'));
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
      
      {/* Type Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
        {typeFilters.map((tf) => {
          const isActive = activeType === tf.id;
          return (
            <button
              key={tf.id}
              onClick={() => dispatch(setActiveType(tf.id))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80'
              }`}
            >
              {t(tf.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Sort, Reorder Feed, Count, Reset */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        
        {/* Active Filter Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
            title={t('clearFilters')}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">{t('clearFilters')}</span>
          </button>
        )}

        {/* Sort Dropdown */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
            className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Drag & Drop Reorder Toggle Button */}
        <button
          onClick={onToggleReordering}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isReordering
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          title={isReordering ? t('doneReordering') : t('reorderFeed')}
        >
          {isReordering ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t('doneReordering')}</span>
            </>
          ) : (
            <>
              <Move className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('reorderFeed')}</span>
            </>
          )}
        </button>

        {/* Items count badge */}
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium pl-1">
          {itemCount} items
        </span>
      </div>
    </div>
  );
}
