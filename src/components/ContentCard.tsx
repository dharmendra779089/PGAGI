'use client';

import React, { useState } from 'react';
import { ContentItem } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { useTranslation } from '@/lib/i18n';
import {
  Bookmark,
  Share2,
  ExternalLink,
  Play,
  FileText,
  MessageCircle,
  Heart,
  Repeat,
  Eye,
  Star,
  GripVertical,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  onOpenDetail: (item: ContentItem) => void;
  isReordering?: boolean;
}

export function ContentCard({
  item,
  onOpenDetail,
  isReordering = false,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const { compactCards, language } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation(language);

  const isFavorited = favorites.some((f) => f.id === item.id);
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const shareUrl = item.url || `${window.location.origin}/#${item.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  // Badge category colors
  const categoryStyles: Record<string, string> = {
    technology: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    finance: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    entertainment: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
    science: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    health: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    sports: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    gaming: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };

  // Formatted date
  const formattedDate = new Date(item.publishedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 card-glow ${
        compactCards ? 'p-3' : 'p-0'
      } ${isReordering ? 'cursor-grab active:cursor-grabbing border-indigo-400 dark:border-indigo-600' : ''}`}
    >
      <div>
        {/* Card Header Media Image */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Floating Category and Trending Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-md shadow-sm ${
                categoryStyles[item.category] || categoryStyles.technology
              }`}
            >
              {t(item.category)}
            </span>

            {item.isTrending && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" />
                {t('trendingBadge')}
              </span>
            )}
          </div>

          {/* Content Type Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
              {item.type === 'news' && <FileText className="w-3 h-3 text-cyan-400" />}
              {item.type === 'recommendation' && <Play className="w-3 h-3 text-fuchsia-400 fill-current" />}
              {item.type === 'social' && <MessageCircle className="w-3 h-3 text-emerald-400" />}
              <span>{item.type}</span>
            </span>
          </div>

          {/* Drag Handle Overlay when in reordering mode */}
          {isReordering && (
            <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[2px] flex items-center justify-center z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg">
                <GripVertical className="w-4 h-4" />
                <span>Drag to Reorder</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-2.5">
          {/* Author & Source */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {item.author.avatar && (
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {item.author.name}
                </span>
                {item.author.verified && (
                  <CheckCircle2 className="w-3 h-3 text-indigo-500 fill-indigo-500/20 flex-shrink-0" />
                )}
                <span>•</span>
                <span className="truncate">{item.source}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{item.readTime || formattedDate}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetail(item)}
            className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          >
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Metrics & Interactive Actions */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        
        {/* Engagement Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {item.stats.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{(item.stats.views / 1000).toFixed(1)}k</span>
            </div>
          )}
          {item.stats.likes !== undefined && (
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              <span>{item.stats.likes > 999 ? `${(item.stats.likes / 1000).toFixed(1)}k` : item.stats.likes}</span>
            </div>
          )}
          {item.stats.rating !== undefined && (
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.stats.rating}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={copied ? t('copied') : t('share')}
            aria-label="Share"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          {/* Favorite / Bookmark */}
          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-lg transition-all ${
              isFavorited
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:scale-110'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFavorited ? t('favorited') : t('favorite')}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {/* Main Call to Action Button */}
          <button
            onClick={() => onOpenDetail(item)}
            className="ml-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center gap-1"
          >
            {item.type === 'recommendation' ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>{t('playNow')}</span>
              </>
            ) : item.type === 'social' ? (
              <>
                <MessageCircle className="w-3 h-3" />
                <span>{t('viewPost')}</span>
              </>
            ) : (
              <>
                <span>{t('readMore')}</span>
                <ExternalLink className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
