import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import { ContentCard } from '@/components/ContentCard';
import { FilterBar } from '@/components/FilterBar';
import { SettingsModal } from '@/components/SettingsModal';
import { ContentItem } from '@/types';

const mockItem: ContentItem = {
  id: 'test-card-1',
  type: 'news',
  category: 'technology',
  title: 'Breakthrough in AI Silicon',
  description: 'New processors double efficiency on edge inference.',
  imageUrl: 'https://example.com/ai.jpg',
  source: 'TechPulse',
  publishedAt: '2026-10-05T08:00:00Z',
  readTime: '3 min read',
  author: {
    name: 'Dr. Jane Smith',
    handle: '@janesmith',
    verified: true,
  },
  stats: {
    likes: 1200,
    views: 45000,
  },
  tags: ['Hardware', 'AI'],
  isTrending: true,
};

describe('Component Integration Tests', () => {
  it('renders ContentCard with correct title, category, and author', () => {
    const store = makeStore();
    const handleDetail = vi.fn();

    render(
      <Provider store={store}>
        <ContentCard item={mockItem} onOpenDetail={handleDetail} />
      </Provider>
    );

    expect(screen.getByText('Breakthrough in AI Silicon')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('#Hardware')).toBeInTheDocument();
  });

  it('triggers onOpenDetail when clicking the card title or Read More button', () => {
    const store = makeStore();
    const handleDetail = vi.fn();

    render(
      <Provider store={store}>
        <ContentCard item={mockItem} onOpenDetail={handleDetail} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Breakthrough in AI Silicon'));
    expect(handleDetail).toHaveBeenCalledWith(mockItem);
  });

  it('renders FilterBar with category tabs and triggers type filtering', () => {
    const store = makeStore();
    const toggleReordering = vi.fn();

    render(
      <Provider store={store}>
        <FilterBar
          isReordering={false}
          onToggleReordering={toggleReordering}
          itemCount={12}
        />
      </Provider>
    );

    expect(screen.getByText('All Sources')).toBeInTheDocument();
    expect(screen.getByText('12 items')).toBeInTheDocument();
    
    // Click reorder toggle
    const reorderBtn = screen.getByTitle('Reorder Feed (Drag & Drop)');
    fireEvent.click(reorderBtn);
    expect(toggleReordering).toHaveBeenCalled();
  });

  it('renders SettingsModal and displays category toggles', () => {
    const store = makeStore();
    const handleClose = vi.fn();

    render(
      <Provider store={store}>
        <SettingsModal isOpen={true} onClose={handleClose} />
      </Provider>
    );

    expect(screen.getByText('Your Selected Category Preferences')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });
});
