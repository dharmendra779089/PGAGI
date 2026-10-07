'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveTab, setActiveCategory } from '@/store/slices/contentSlice';
import { useTranslation } from '@/lib/i18n';
import { Category } from '@/types';
import {
  Rss,
  TrendingUp,
  Bookmark,
  BarChart3,
  Cpu,
  Coins,
  Clapperboard,
  Atom,
  HeartPulse,
  Trophy,
  Gamepad2,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ onOpenSettings, isOpenMobile, onCloseMobile }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { activeTab, activeCategory } = useAppSelector((state) => state.content);
  const { favoriteCategories, language } = useAppSelector((state) => state.preferences);
  const favorites = useAppSelector((state) => state.favorites.items);
  const { t } = useTranslation(language);

  const navItems = [
    {
      id: 'feed' as const,
      label: t('feed'),
      icon: Rss,
    },
    {
      id: 'trending' as const,
      label: t('trending'),
      icon: TrendingUp,
      badge: 'Hot',
    },
    {
      id: 'favorites' as const,
      label: t('favorites'),
      icon: Bookmark,
      count: favorites.length,
    },
    {
      id: 'analytics' as const,
      label: t('analytics'),
      icon: BarChart3,
    },
  ];

  const categoryList: { id: Category; labelKey: string; icon: React.ElementType; color: string }[] = [
    { id: 'technology', labelKey: 'technology', icon: Cpu, color: 'text-cyan-500' },
    { id: 'finance', labelKey: 'finance', icon: Coins, color: 'text-emerald-500' },
    { id: 'entertainment', labelKey: 'entertainment', icon: Clapperboard, color: 'text-fuchsia-500' },
    { id: 'science', labelKey: 'science', icon: Atom, color: 'text-violet-500' },
    { id: 'health', labelKey: 'health', icon: HeartPulse, color: 'text-rose-500' },
    { id: 'sports', labelKey: 'sports', icon: Trophy, color: 'text-amber-500' },
    { id: 'gaming', labelKey: 'gaming', icon: Gamepad2, color: 'text-red-500' },
  ];

  const handleTabClick = (tabId: 'feed' | 'trending' | 'favorites' | 'analytics') => {
    dispatch(setActiveTab(tabId));
    onCloseMobile();
  };

  const handleCategoryClick = (catId: Category | 'all') => {
    dispatch(setActiveCategory(catId));
    if (activeTab !== 'feed') {
      dispatch(setActiveTab('feed'));
    }
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-40 flex flex-col justify-between py-5 px-3 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Discover
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-transparent text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Categories Filter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </p>
              <button
                onClick={onOpenSettings}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                title="Configure favorite categories"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {/* All Categories Option */}
            <button
              onClick={() => handleCategoryClick('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('allCategories')}</span>
            </button>

            {/* Individual Categories */}
            {categoryList.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const isPreferred = favoriteCategories.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                    <span>{t(cat.labelKey)}</span>
                  </div>
                  {isPreferred && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                      title="Included in your personal preferences"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Preferences Quick Panel */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 px-2">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 border border-indigo-500/20 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Algorithms Active
              </p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mb-2.5">
              Feed tailored by {favoriteCategories.length} preferred genres.
            </p>
            <button
              onClick={onOpenSettings}
              className="w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors text-center"
            >
              {t('settings')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
