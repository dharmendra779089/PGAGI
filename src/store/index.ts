import { configureStore, Middleware } from '@reduxjs/toolkit';
import preferencesReducer, { setHydratedPreferences } from './slices/preferencesSlice';
import contentReducer from './slices/contentSlice';
import favoritesReducer, { setHydratedFavorites } from './slices/favoritesSlice';
import authReducer from './slices/authSlice';

const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  const result = next(action);

  // Sync to localStorage after state changes
  if (typeof window !== 'undefined') {
    const actionType = action.type || '';
    if (actionType.startsWith('preferences/')) {
      const { preferences } = storeAPI.getState();
      try {
        localStorage.setItem('user_preferences_v1', JSON.stringify({
          favoriteCategories: preferences.favoriteCategories,
          theme: preferences.theme,
          language: preferences.language,
          viewMode: preferences.viewMode,
          itemsPerPage: preferences.itemsPerPage,
          realTimeUpdates: preferences.realTimeUpdates,
          compactCards: preferences.compactCards,
          customCardOrder: preferences.customCardOrder,
        }));
      } catch (e) {
        console.error('Failed to persist preferences to localStorage', e);
      }
    }

    if (actionType.startsWith('favorites/')) {
      const { favorites } = storeAPI.getState();
      try {
        localStorage.setItem('user_favorites_v1', JSON.stringify(favorites.items));
      } catch (e) {
        console.error('Failed to persist favorites to localStorage', e);
      }
    }
  }

  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      preferences: preferencesReducer,
      content: contentReducer,
      favorites: favoritesReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(localStorageMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const initializeHydration = (store: AppStore) => {
  if (typeof window === 'undefined') return;

  try {
    const savedPrefs = localStorage.getItem('user_preferences_v1');
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      store.dispatch(setHydratedPreferences(parsed));
    }

    const savedFavs = localStorage.getItem('user_favorites_v1');
    if (savedFavs) {
      const parsedFavs = JSON.parse(savedFavs);
      store.dispatch(setHydratedFavorites(parsedFavs));
    }
  } catch (e) {
    console.error('Failed to hydrate state from localStorage', e);
  }
};
