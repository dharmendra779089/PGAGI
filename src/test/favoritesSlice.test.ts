import { describe, it, expect } from 'vitest';
import favoritesReducer, {
  toggleFavorite,
  removeFavorite,
  clearFavorites,
  setHydratedFavorites,
} from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/types';

describe('favoritesSlice', () => {
  const mockItem: ContentItem = {
    id: 'test-1',
    type: 'news',
    category: 'technology',
    title: 'Test Article',
    description: 'Test description',
    imageUrl: 'https://example.com/image.jpg',
    source: 'Test Source',
    publishedAt: '2026-10-05T00:00:00Z',
    author: { name: 'Test Author' },
    stats: { likes: 10, views: 100 },
    tags: ['test'],
  };

  it('should add an item to favorites if not already present', () => {
    const state = favoritesReducer({ items: [], isHydrated: true }, toggleFavorite(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('test-1');
  });

  it('should remove an item from favorites if already present (toggle)', () => {
    const state = favoritesReducer(
      { items: [mockItem], isHydrated: true },
      toggleFavorite(mockItem)
    );
    expect(state.items).toHaveLength(0);
  });

  it('should remove a favorite by id', () => {
    const state = favoritesReducer(
      { items: [mockItem], isHydrated: true },
      removeFavorite('test-1')
    );
    expect(state.items).toHaveLength(0);
  });

  it('should clear all favorites', () => {
    const state = favoritesReducer(
      { items: [mockItem, { ...mockItem, id: 'test-2' }], isHydrated: true },
      clearFavorites()
    );
    expect(state.items).toHaveLength(0);
  });

  it('should hydrate stored favorites correctly', () => {
    const state = favoritesReducer(
      { items: [], isHydrated: false },
      setHydratedFavorites([mockItem])
    );
    expect(state.isHydrated).toBe(true);
    expect(state.items).toEqual([mockItem]);
  });
});
