export type ContentType = 'news' | 'recommendation' | 'social';

export type Category = 
  | 'technology'
  | 'sports'
  | 'finance'
  | 'entertainment'
  | 'science'
  | 'health'
  | 'gaming';

export interface Author {
  name: string;
  handle?: string;
  avatar?: string;
  verified?: boolean;
}

export interface ContentStats {
  likes?: number;
  reposts?: number;
  comments?: number;
  rating?: number;
  views?: number;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  category: Category;
  title: string;
  description: string;
  fullContent?: string;
  imageUrl: string;
  source: string;
  sourceIcon?: string;
  url?: string;
  publishedAt: string;
  readTime?: string;
  author: Author;
  stats: ContentStats;
  tags: string[];
  isTrending?: boolean;
  mediaType?: 'article' | 'movie' | 'music' | 'post';
  trailerUrl?: string;
  duration?: string;
  releaseYear?: number;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type ViewMode = 'infinite' | 'paginated';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ja';
export type SortOption = 'newest' | 'popular' | 'rating';

export interface UserPreferences {
  favoriteCategories: Category[];
  theme: ThemeMode;
  language: Language;
  viewMode: ViewMode;
  itemsPerPage: number;
  realTimeUpdates: boolean;
  compactCards: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  stats: {
    articlesRead: number;
    favoritesCount: number;
    sharesCount: number;
  };
}
