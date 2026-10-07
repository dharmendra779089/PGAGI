'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleCategoryPreference,
  setTheme,
  setLanguage,
  setViewMode,
  setItemsPerPage,
  setRealTimeUpdates,
  setCompactCards,
  resetPreferences,
} from '@/store/slices/preferencesSlice';
import { useTranslation } from '@/lib/i18n';
import { Category, Language, ThemeMode, ViewMode } from '@/types';
import {
  X,
  Sliders,
  Check,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Sparkles,
  Zap,
  LayoutGrid,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const {
    favoriteCategories,
    theme,
    language,
    viewMode,
    itemsPerPage,
    realTimeUpdates,
    compactCards,
  } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation(language);

  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const allCategories: { id: Category; labelKey: string }[] = [
    { id: 'technology', labelKey: 'technology' },
    { id: 'sports', labelKey: 'sports' },
    { id: 'finance', labelKey: 'finance' },
    { id: 'entertainment', labelKey: 'entertainment' },
    { id: 'science', labelKey: 'science' },
    { id: 'health', labelKey: 'health' },
    { id: 'gaming', labelKey: 'gaming' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ja', label: '日本語 (Japanese)' },
  ];

  const handleSaveAndClose = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('settings')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize your feed algorithms and viewing preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Category Preferences Multi-Select */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t('categoriesConfig')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('categoriesSubtext')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {allCategories.map((cat) => {
              const isSelected = favoriteCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => dispatch(toggleCategoryPreference(cat.id))}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 fill-white text-indigo-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-400" />
                  )}
                  <span>{t(cat.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Theme Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('theme')}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'dark' as ThemeMode, label: t('darkMode'), icon: Moon },
              { id: 'light' as ThemeMode, label: t('lightMode'), icon: Sun },
              { id: 'system' as ThemeMode, label: t('systemMode'), icon: Laptop },
            ].map((th) => {
              const Icon = th.icon;
              const isCurrent = theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => dispatch(setTheme(th.id))}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium gap-2 transition-all ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Feed Pagination vs Infinite Scroll */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('viewMode')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'infinite' as ViewMode, label: t('infiniteScroll') },
              { id: 'paginated' as ViewMode, label: t('paginated') },
            ].map((vm) => (
              <button
                key={vm.id}
                onClick={() => dispatch(setViewMode(vm.id))}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                  viewMode === vm.id
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {vm.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Language & Batch Density */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              {t('language')}
            </label>
            <select
              value={language}
              onChange={(e) => dispatch(setLanguage(e.target.value as Language))}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              {t('itemsPerPage')}
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              {[4, 6, 8, 12, 16].map((num) => (
                <option key={num} value={num}>
                  {num} cards per request
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Toggles: Real-time ticker and Compact cards */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {t('realTimeUpdates')}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Receive live incoming breaking news and trending social alerts
              </p>
            </div>
            <button
              onClick={() => dispatch(setRealTimeUpdates(!realTimeUpdates))}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                realTimeUpdates ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  realTimeUpdates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {t('compactMode')}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tighter grid spacing with condensed card padding
              </p>
            </div>
            <button
              onClick={() => dispatch(setCompactCards(!compactCards))}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                compactCards ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  compactCards ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => dispatch(resetPreferences())}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetDefault')}</span>
          </button>

          <button
            onClick={handleSaveAndClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
          >
            {savedToast ? (
              <>
                <Check className="w-4 h-4" />
                <span>Applied!</span>
              </>
            ) : (
              <span>{t('saveSettings')}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
