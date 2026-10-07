import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types';

interface FavoritesState {
  items: ContentItem[];
  isHydrated: boolean;
}

const initialState: FavoritesState = {
  items: [],
  isHydrated: false,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setHydratedFavorites: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.isHydrated = true;
    },
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const existsIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (existsIndex >= 0) {
        state.items.splice(existsIndex, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { setHydratedFavorites, toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
