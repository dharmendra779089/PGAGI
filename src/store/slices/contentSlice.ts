import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, ContentType, Category, SortOption } from '@/types';
import { RootState } from '../index';

interface ContentState {
  items: ContentItem[];
  activeTab: 'feed' | 'trending' | 'favorites' | 'analytics';
  activeCategory: Category | 'all';
  activeType: ContentType | 'all';
  searchQuery: string;
  sortBy: SortOption;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  hasMore: boolean;
  incomingItems: ContentItem[];
  reorderedIds: string[];
}

const initialState: ContentState = {
  items: [],
  activeTab: 'feed',
  activeCategory: 'all',
  activeType: 'all',
  searchQuery: '',
  sortBy: 'newest',
  status: 'idle',
  error: null,
  page: 1,
  hasMore: true,
  incomingItems: [],
  reorderedIds: [],
};

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (
    params: {
      page?: number;
      category?: string;
      type?: string;
      search?: string;
      trending?: boolean;
      sort?: string;
    } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const targetPage = params.page || 1;
      const category = params.category ?? (state.content.activeCategory !== 'all' ? state.content.activeCategory : state.preferences.favoriteCategories.join(','));
      const type = params.type ?? state.content.activeType;
      const search = params.search ?? state.content.searchQuery;
      const trending = params.trending ?? (state.content.activeTab === 'trending');
      const sort = params.sort ?? state.content.sortBy;

      const url = new URL('/api/feed', window.location.origin);
      if (category) url.searchParams.set('category', category);
      if (type) url.searchParams.set('type', type);
      if (search) url.searchParams.set('search', search);
      if (trending) url.searchParams.set('trending', 'true');
      if (sort) url.searchParams.set('sort', sort);
      url.searchParams.set('page', targetPage.toString());
      url.searchParams.set('limit', state.preferences.itemsPerPage.toString());

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Failed to fetch content: ${res.statusText}`);
      }
      const data = await res.json();
      return {
        items: data.items as ContentItem[],
        hasMore: data.pagination.hasMore as boolean,
        page: targetPage,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network error';
      return rejectWithValue(message);
    }
  }
);

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'feed' | 'trending' | 'favorites' | 'analytics'>) => {
      state.activeTab = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<Category | 'all'>) => {
      state.activeCategory = action.payload;
    },
    setActiveType: (state, action: PayloadAction<ContentType | 'all'>) => {
      state.activeType = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    addIncomingItem: (state, action: PayloadAction<ContentItem>) => {
      // Avoid duplicate incoming items
      if (!state.incomingItems.some((item) => item.id === action.payload.id) &&
          !state.items.some((item) => item.id === action.payload.id)) {
        state.incomingItems.unshift(action.payload);
      }
    },
    consumeIncomingItems: (state) => {
      if (state.incomingItems.length > 0) {
        state.items = [...state.incomingItems, ...state.items];
        state.incomingItems = [];
      }
    },
    dismissIncomingItems: (state) => {
      state.incomingItems = [];
    },
    reorderItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.reorderedIds = action.payload.map((i) => i.id);
    },
    setItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.page === 1) {
          state.items = action.payload.items;
        } else {
          // Append for infinite scroll, avoiding duplicates
          const existingIds = new Set(state.items.map((i) => i.id));
          const newItems = action.payload.items.filter((i) => !existingIds.has(i.id));
          state.items = [...state.items, ...newItems];
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Error loading content';
      });
  },
});

export const {
  setActiveTab,
  setActiveCategory,
  setActiveType,
  setSearchQuery,
  setSortBy,
  addIncomingItem,
  consumeIncomingItems,
  dismissIncomingItems,
  reorderItems,
  setItems,
} = contentSlice.actions;

export default contentSlice.reducer;
