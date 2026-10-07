import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CONTENT_ITEMS } from '@/data/mockData';
import { ContentItem } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const categoryParam = searchParams.get('category');
  const typeParam = searchParams.get('type');
  const searchQuery = searchParams.get('search')?.toLowerCase().trim() || '';
  const trendingOnly = searchParams.get('trending') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  let filtered: ContentItem[] = [...INITIAL_CONTENT_ITEMS];

  // Filter by Category
  if (categoryParam && categoryParam !== 'all') {
    const categories = categoryParam.split(',').map((c) => c.trim().toLowerCase());
    filtered = filtered.filter((item) => categories.includes(item.category.toLowerCase()));
  }

  // Filter by Type
  if (typeParam && typeParam !== 'all') {
    filtered = filtered.filter((item) => item.type.toLowerCase() === typeParam.toLowerCase());
  }

  // Filter by Trending
  if (trendingOnly) {
    filtered = filtered.filter((item) => item.isTrending);
  }

  // Filter by Search Query
  if (searchQuery) {
    filtered = filtered.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(searchQuery);
      const matchDesc = item.description.toLowerCase().includes(searchQuery);
      const matchSource = item.source.toLowerCase().includes(searchQuery);
      const matchAuthor = item.author.name.toLowerCase().includes(searchQuery);
      const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(searchQuery));
      return matchTitle || matchDesc || matchSource || matchAuthor || matchTags;
    });
  }

  // Sorting
  if (sort === 'popular') {
    filtered.sort((a, b) => (b.stats.views || 0) - (a.stats.views || 0));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => (b.stats.rating || 0) - (a.stats.rating || 0));
  } else {
    // 'newest' default
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedItems = filtered.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < total;

  return NextResponse.json({
    success: true,
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore,
    },
    meta: {
      categories: ['technology', 'finance', 'entertainment', 'science', 'health', 'sports', 'gaming'],
      types: ['news', 'recommendation', 'social'],
    }
  });
}
