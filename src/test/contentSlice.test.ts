import { describe, it, expect } from 'vitest';
import contentReducer, {
  setActiveCategory,
  setActiveType,
  setSearchQuery,
  setSortBy,
  addIncomingItem,
  consumeIncomingItems,
  reorderItems,
} from '@/store/slices/contentSlice';
import { ContentItem } from '@/types';

describe('contentSlice', () => {
  const initialState = {
    items: [],
    activeTab: 'feed' as const,
    activeCategory: 'all' as const,
    activeType: 'all' as const,
    searchQuery: '',
    sortBy: 'newest' as const,
    status: 'idle' as const,
    error: null,
    page: 1,
    hasMore: true,
    incomingItems: [],
    reorderedIds: [],
  };

  const sampleItem: ContentItem = {
    id: 'sample-1',
    type: 'social',
    category: 'technology',
    title: 'Sample Tweet',
    description: 'Tech discussion',
    imageUrl: 'https://example.com/img.jpg',
    source: 'Twitter',
    publishedAt: '2026-10-05T01:00:00Z',
    author: { name: 'Dev' },
    stats: { likes: 50 },
    tags: ['ai'],
  };

  it('should update active category filter', () => {
    const state = contentReducer(initialState, setActiveCategory('technology'));
    expect(state.activeCategory).toBe('technology');
  });

  it('should update active type filter', () => {
    const state = contentReducer(initialState, setActiveType('news'));
    expect(state.activeType).toBe('news');
  });

  it('should update search query', () => {
    const state = contentReducer(initialState, setSearchQuery('quantum computing'));
    expect(state.searchQuery).toBe('quantum computing');
  });

  it('should update sort order', () => {
    const state = contentReducer(initialState, setSortBy('popular'));
    expect(state.sortBy).toBe('popular');
  });

  it('should queue incoming real-time items without duplicates', () => {
    let state = contentReducer(initialState, addIncomingItem(sampleItem));
    expect(state.incomingItems).toHaveLength(1);

    // Adding duplicate shouldn't increase length
    state = contentReducer(state, addIncomingItem(sampleItem));
    expect(state.incomingItems).toHaveLength(1);
  });

  it('should prepend incoming real-time items to main items when consumed', () => {
    const stateWithQueue = {
      ...initialState,
      items: [{ ...sampleItem, id: 'existing-1' }],
      incomingItems: [sampleItem],
    };

    const state = contentReducer(stateWithQueue, consumeIncomingItems());
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('sample-1');
    expect(state.incomingItems).toHaveLength(0);
  });

  it('should reorder items and track reordered IDs for drag and drop', () => {
    const itemA = { ...sampleItem, id: 'a' };
    const itemB = { ...sampleItem, id: 'b' };
    const state = contentReducer(
      { ...initialState, items: [itemA, itemB] },
      reorderItems([itemB, itemA])
    );
    expect(state.items[0].id).toBe('b');
    expect(state.items[1].id).toBe('a');
    expect(state.reorderedIds).toEqual(['b', 'a']);
  });
});
