import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Language, ThemeMode, UserPreferences, ViewMode } from '@/types';

const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteCategories: ['technology', 'finance', 'entertainment', 'science', 'sports', 'health', 'gaming'],
  theme: 'dark',
  language: 'en',
  viewMode: 'infinite',
  itemsPerPage: 6,
  realTimeUpdates: true,
  compactCards: false,
};

interface PreferencesState extends UserPreferences {
  customCardOrder: string[];
  isHydrated: boolean;
}

const initialState: PreferencesState = {
  ...DEFAULT_PREFERENCES,
  customCardOrder: [],
  isHydrated: false,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setHydratedPreferences: (state, action: PayloadAction<Partial<PreferencesState>>) => {
      return {
        ...state,
        ...action.payload,
        isHydrated: true,
      };
    },
    toggleCategoryPreference: (state, action: PayloadAction<Category>) => {
      const category = action.payload;
      const index = state.favoriteCategories.indexOf(category);
      if (index >= 0) {
        // Prevent deselecting all categories
        if (state.favoriteCategories.length > 1) {
          state.favoriteCategories.splice(index, 1);
        }
      } else {
        state.favoriteCategories.push(category);
      }
    },
    setFavoriteCategories: (state, action: PayloadAction<Category[]>) => {
      if (action.payload.length > 0) {
        state.favoriteCategories = action.payload;
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setRealTimeUpdates: (state, action: PayloadAction<boolean>) => {
      state.realTimeUpdates = action.payload;
    },
    setCompactCards: (state, action: PayloadAction<boolean>) => {
      state.compactCards = action.payload;
    },
    setCustomCardOrder: (state, action: PayloadAction<string[]>) => {
      state.customCardOrder = action.payload;
    },
    resetPreferences: () => ({
      ...DEFAULT_PREFERENCES,
      customCardOrder: [],
      isHydrated: true,
    }),
  },
});

export const {
  setHydratedPreferences,
  toggleCategoryPreference,
  setFavoriteCategories,
  setTheme,
  setLanguage,
  setViewMode,
  setItemsPerPage,
  setRealTimeUpdates,
  setCompactCards,
  setCustomCardOrder,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
