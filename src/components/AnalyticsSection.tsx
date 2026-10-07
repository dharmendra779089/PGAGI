'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { useTranslation } from '@/lib/i18n';
import {
  BarChart3,
  BookOpen,
  Bookmark,
  TrendingUp,
  Cpu,
  Coins,
  Clapperboard,
  Atom,
  Flame,
  CheckCircle,
  Share2,
} from 'lucide-react';

export function AnalyticsSection() {
  const { user } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.items);
  const { favoriteCategories, language } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation(language);

  // Distribution computation
  const categoryCounts = favorites.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const typeCounts = favorites.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <span>{t('analytics')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personal consumption trends, content velocity, and algorithmic preference health
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Articles Read
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {user?.stats.articlesRead || 0}
          </p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18% this week</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Saved Bookmarks
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {favorites.length}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {Object.keys(categoryCounts).length} categories
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Reading Streak
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            14 Days
          </p>
          <p className="text-[11px] text-rose-500 font-semibold mt-1">
            Mastery tier unlocked 🔥
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Topics Tracked
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {favoriteCategories.length} / 7
          </p>
          <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
            Active personalization
          </p>
        </div>
      </div>

      {/* Visual Distribution Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Categories Progress Bars */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Category Affinity Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estimated engagement distribution across personalized topics
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              { name: 'Technology', pct: 45, color: 'bg-cyan-500' },
              { name: 'Science', pct: 25, color: 'bg-violet-500' },
              { name: 'Finance', pct: 15, color: 'bg-emerald-500' },
              { name: 'Entertainment', pct: 10, color: 'bg-fuchsia-500' },
              { name: 'Others', pct: 5, color: 'bg-amber-500' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                  <span className="text-slate-500">{cat.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Type Preference & Algorithm Health */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Content Medium Balance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ratio between in-depth reporting, movie/audio recommendations, and social pulse
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <p className="text-xl font-bold text-cyan-500">52%</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">News</p>
              <p className="text-[10px] text-slate-400">Deep Reads</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <p className="text-xl font-bold text-fuchsia-500">28%</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Media</p>
              <p className="text-[10px] text-slate-400">Watch & Listen</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
              <p className="text-xl font-bold text-emerald-500">20%</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Social</p>
              <p className="text-[10px] text-slate-400">Discussions</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              <strong>Feed Health Score: 94/100.</strong> Your balanced consumption across multiple categories prevents filter bubbles and optimizes recommendation diversity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
