'use client';

import React, { useEffect } from 'react';
import { ContentItem } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { incrementArticlesRead } from '@/store/slices/authSlice';
import { useTranslation } from '@/lib/i18n';
import {
  X,
  Bookmark,
  Share2,
  ExternalLink,
  Play,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle2,
  Star,
  Film,
} from 'lucide-react';

interface DetailModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export function DetailModal({ item, onClose }: DetailModalProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const { language } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation(language);

  useEffect(() => {
    if (item) {
      dispatch(incrementArticlesRead());
    }
  }, [item, dispatch]);

  if (!item) return null;

  const isFavorited = favorites.some((f) => f.id === item.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden">
        
        {/* Media Banner */}
        <div className="relative aspect-video w-full bg-slate-950">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-20 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media overlay for movies / trailers */}
          {item.mediaType === 'movie' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl shadow-indigo-500/40 backdrop-blur-sm animate-pulse-glow">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Category & Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-indigo-600/90 backdrop-blur-md">
              {t(item.category)} • {item.type}
            </span>
            {item.stats.rating && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span>{item.stats.rating} / 10</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Author & Source */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {item.author.avatar && (
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.author.name}
                  </h4>
                  {item.author.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.author.handle || item.source}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(toggleFavorite(item))}
                className={`p-2 rounded-xl transition-all ${
                  isFavorited
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFavorited ? t('favorited') : t('favorite')}
              >
                <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {item.title}
          </h1>

          {/* Meta Info (Duration, Read Time, Published At) */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            {item.readTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{item.readTime}</span>
              </div>
            )}
            {item.duration && (
              <div className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-slate-400" />
                <span>{item.duration}</span>
              </div>
            )}
            {item.releaseYear && (
              <span>Year: {item.releaseYear}</span>
            )}
            <span>Published: {new Date(item.publishedAt).toLocaleDateString()}</span>
          </div>

          {/* Full Content Body or Extended Description */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
            <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200">
              {item.description}
            </p>
            {item.fullContent && (
              <p className="text-slate-600 dark:text-slate-400 leading-loose">
                {item.fullContent}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Interactive Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{item.stats.likes || 120}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>{item.stats.comments || 24} comments</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold transition-colors"
            >
              Done Reading
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
