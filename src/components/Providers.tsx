'use client';

import React, { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore, initializeHydration } from '@/store';
import { addIncomingItem } from '@/store/slices/contentSlice';
import { REAL_TIME_SIMULATION_POOL } from '@/data/mockData';

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      // Hydrate saved state from localStorage
      initializeHydration(storeRef.current);

      // Apply initial theme
      const state = storeRef.current.getState();
      const currentTheme = state.preferences.theme;
      applyTheme(currentTheme);

      // Listen for Redux store theme changes
      const unsubscribe = storeRef.current.subscribe(() => {
        const updatedState = storeRef.current?.getState();
        if (updatedState) {
          applyTheme(updatedState.preferences.theme);
        }
      });

      // Real-time live updates simulation loop
      let poolIndex = 0;
      const interval = setInterval(() => {
        const currentState = storeRef.current?.getState();
        if (currentState?.preferences.realTimeUpdates) {
          const item = {
            ...REAL_TIME_SIMULATION_POOL[poolIndex % REAL_TIME_SIMULATION_POOL.length],
            id: `live-${Date.now()}-${poolIndex}`,
            publishedAt: new Date().toISOString(),
          };
          storeRef.current?.dispatch(addIncomingItem(item));
          poolIndex++;
        }
      }, 24000); // Trigger a realistic update every 24s

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }
  }, []);

  const applyTheme = (theme: 'dark' | 'light' | 'system') => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  return <Provider store={storeRef.current}>{children}</Provider>;
}
