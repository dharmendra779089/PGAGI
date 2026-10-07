import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-101',
  name: 'Devansh Sharma',
  username: '@devansh_sde',
  email: 'devansh@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  bio: 'Frontend Engineer & Systems Architect. Passionate about AI, Next.js, and high-performance interactive interfaces.',
  joinedDate: 'Joined Oct 2026',
  stats: {
    articlesRead: 42,
    favoritesCount: 15,
    sharesCount: 8,
  },
};

const initialState: AuthState = {
  user: DEFAULT_USER,
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    incrementArticlesRead: (state) => {
      if (state.user) {
        state.user.stats.articlesRead += 1;
      }
    },
  },
});

export const { login, logout, updateProfile, incrementArticlesRead } = authSlice.actions;

export default authSlice.reducer;
