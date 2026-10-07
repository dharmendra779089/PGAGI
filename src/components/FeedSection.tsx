'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchContent,
  reorderItems,
  consumeIncomingItems,
} from '@/store/slices/contentSlice';
import { setCustomCardOrder } from '@/store/slices/preferencesSlice';
import { ContentCard } from './ContentCard';
import { FilterBar } from './FilterBar';
import { ContentItem } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  AlertCircle,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  Move,
  Check,
} from 'lucide-react';

interface FeedSectionProps {
  onOpenDetail: (item: ContentItem) => void;
  isTrendingView?: boolean;
}

export function FeedSection({ onOpenDetail, isTrendingView = false }: FeedSectionProps) {
  const dispatch = useAppDispatch();
  const {
    items,
    status,
    error,
    page,
    hasMore,
    activeCategory,
    activeType,
    searchQuery,
    sortBy,
    incomingItems,
  } = useAppSelector((state) => state.content);

  const {
    favoriteCategories,
    viewMode,
    itemsPerPage,
    customCardOrder,
    language,
  } = useAppSelector((state) => state.preferences);

  const { t } = useTranslation(language);

  const [isReordering, setIsReordering] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch content whenever filters, preferences, or trending change
  useEffect(() => {
    dispatch(
      fetchContent({
        page: 1,
        trending: isTrendingView,
      })
    );
  }, [
    dispatch,
    activeCategory,
    activeType,
    searchQuery,
    sortBy,
    favoriteCategories,
    itemsPerPage,
    isTrendingView,
  ]);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (viewMode !== 'infinite' || !hasMore || status === 'loading') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(
            fetchContent({
              page: page + 1,
              trending: isTrendingView,
            })
          );
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [dispatch, viewMode, hasMore, status, page, isTrendingView]);

  const handleReorder = (newItems: ContentItem[]) => {
    dispatch(reorderItems(newItems));
    dispatch(setCustomCardOrder(newItems.map((i) => i.id)));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    dispatch(
      fetchContent({
        page: newPage,
        trending: isTrendingView,
      })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Real-time incoming updates floating banner */}
      <AnimatePresence>
        {incomingItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-white/20">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <p className="text-xs font-semibold">
                {incomingItems.length} {t('newUpdatesAvailable')}
              </p>
            </div>
            <button
              onClick={() => dispatch(consumeIncomingItems())}
              className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              {t('clickToLoad')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Control Bar */}
      <FilterBar
        isReordering={isReordering}
        onToggleReordering={() => setIsReordering(!isReordering)}
        itemCount={items.length}
      />

      {/* Reordering helper instruction banner */}
      {isReordering && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-indigo-800 dark:text-indigo-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4" />
            <span>{t('dragInstructions')}</span>
          </div>
          <button
            onClick={() => setIsReordering(false)}
            className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t('doneReordering')}</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {status === 'loading' && items.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 animate-pulse"
            >
              <div className="w-full aspect-video rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {status === 'failed' && (
        <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Failed to Load Content
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {error || 'An unexpected error occurred while fetching your content.'}
          </p>
          <button
            onClick={() => dispatch(fetchContent({ page: 1, trending: isTrendingView }))}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* Empty State */}
      {status !== 'loading' && items.length === 0 && status !== 'failed' && (
        <div className="text-center py-20 px-4 max-w-md mx-auto space-y-3">
          <Sparkles className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('noItemsFound')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, selecting different categories, or resetting filters.
          </p>
        </div>
      )}

      {/* Content Stream (Drag-and-drop Reorderable or Standard Grid) */}
      {items.length > 0 && (
        <>
          {isReordering ? (
            <Reorder.Group
              axis="y"
              values={items}
              onReorder={handleReorder}
              className="space-y-4"
            >
              {items.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="list-none"
                >
                  <ContentCard
                    item={item}
                    onOpenDetail={onOpenDetail}
                    isReordering={true}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ContentCard
                    item={item}
                    onOpenDetail={onOpenDetail}
                    isReordering={false}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Infinite Scroll Trigger & Spinner */}
      {viewMode === 'infinite' && items.length > 0 && (
        <div ref={observerTarget} className="py-6 flex justify-center">
          {status === 'loading' && (
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching additional updates...</span>
            </div>
          )}
          {!hasMore && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              You are all caught up with your personalized stream!
            </p>
          )}
        </div>
      )}

      {/* Classic Pagination Bar */}
      {viewMode === 'paginated' && items.length > 0 && (
        <div className="py-8 flex items-center justify-center gap-3 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('previous')}</span>
          </button>

          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {t('page')} {page}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <span>{t('next')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
