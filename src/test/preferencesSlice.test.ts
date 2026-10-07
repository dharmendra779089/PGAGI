import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  toggleCategoryPreference,
  setTheme,
  setLanguage,
  setViewMode,
  setCustomCardOrder,
  resetPreferences,
} from '@/store/slices/preferencesSlice';

describe('preferencesSlice', () => {
  const initial = {
    favoriteCategories: ['technology', 'sports', 'finance'] as any,
    theme: 'dark' as const,
    language: 'en' as const,
    viewMode: 'infinite' as const,
    itemsPerPage: 6,
    realTimeUpdates: true,
    compactCards: false,
    customCardOrder: [],
    isHydrated: false,
  };

  it('should toggle an existing category off if more than 1 category exists', () => {
    const state = preferencesReducer(initial, toggleCategoryPreference('sports'));
    expect(state.favoriteCategories).not.toContain('sports');
    expect(state.favoriteCategories).toContain('technology');
  });

  it('should add a category if not currently present', () => {
    const state = preferencesReducer(initial, toggleCategoryPreference('gaming'));
    expect(state.favoriteCategories).toContain('gaming');
  });

  it('should not remove the last remaining category to prevent empty state break', () => {
    const singleCatState = {
      ...initial,
      favoriteCategories: ['technology'] as any,
    };
    const state = preferencesReducer(singleCatState, toggleCategoryPreference('technology'));
    expect(state.favoriteCategories).toEqual(['technology']);
  });

  it('should change theme correctly', () => {
    const state = preferencesReducer(initial, setTheme('light'));
    expect(state.theme).toBe('light');
  });

  it('should change language correctly', () => {
    const state = preferencesReducer(initial, setLanguage('es'));
    expect(state.language).toBe('es');
  });

  it('should toggle view mode between infinite and paginated', () => {
    const state = preferencesReducer(initial, setViewMode('paginated'));
    expect(state.viewMode).toBe('paginated');
  });

  it('should update customCardOrder on drag-and-drop', () => {
    const order = ['tech-1', 'fin-2', 'sci-1'];
    const state = preferencesReducer(initial, setCustomCardOrder(order));
    expect(state.customCardOrder).toEqual(order);
  });

  it('should reset to default preferences', () => {
    const modified = {
      ...initial,
      theme: 'light' as const,
      favoriteCategories: ['gaming'] as any,
    };
    const state = preferencesReducer(modified, resetPreferences());
    expect(state.theme).toBe('dark');
    expect(state.favoriteCategories.length).toBeGreaterThan(3);
  });
});
