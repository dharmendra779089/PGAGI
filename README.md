# ⚡ NexusFeed — Personalized Content Dashboard

> **Frontend Development SDE Intern Assignment**  
> A high-performance, interactive, and customizable dashboard built with **React 19**, **Next.js 16 (App Router)**, **TypeScript**, **Redux Toolkit**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 🌟 Live Demo & Preview
- **Application Name**: NexusFeed v2.0
- **Local Dev Server**: `http://localhost:3000`
- **Build Status**: ✅ Passing all 24 Vitest unit & integration tests

---

## 🚀 Key Features

### 1. 🎯 Personalized Content Feed
- **Category Preferences Engine**: Select from 7 major content categories (*Technology, Sports, Finance, Entertainment, Science, Health, Gaming*). The feed automatically tailors content items according to user selections.
- **Multi-Source Ingestion**:
  - 📰 **News API**: Breaking news articles with category tags, publication timestamps, and estimated read times.
  - 🎬 **Recommendations API**: Curated movie and music recommendations with ratings, release year, duration, and trailer links.
  - 💬 **Social Media Buzz**: Simulated live community posts with handles, verified checkmarks, and engagement metrics (likes, reposts, comments).
- **Interactive Cards**:
  - High-resolution media banners with hover zoom effects.
  - Category badges, verified author information, and relative timestamps.
  - Direct call-to-actions: *"Read Article"*, *"Preview Trailer"*, *"View Discussion"*.
  - One-click **Bookmark / Favorite** toggle.
  - Quick **Share** button with clipboard feedback toast.

### 2. 🎛️ User Dashboard Layout
- **Responsive Navigation**: Collapsible sidebar on mobile/tablet and sticky desktop navigation.
- **Dedicated Views**:
  - 📰 **Personalized Feed**: Unified stream of news, recommendations, and social updates.
  - 🔥 **Trending Now**: Top-trending items with real-time virality indicators.
  - ⭐ **Favorites Section**: Dedicated bookmark library with in-favorites search and batch clear.
  - 📊 **Consumption Analytics**: Charts visualizing category affinity, reading streaks, and feed health score (94/100).

### 3. 🔍 Debounced Search & Filtering
- **Debounced Search Bar**: Optimized 300ms debounce across titles, descriptions, authors, sources, and hashtags.
- **Keyboard Shortcut**: Press `/` from anywhere on the page to instantly focus the search bar.
- **Filter Chips**: Instant filtering by source (*All, News Articles, Recommendations, Social Buzz*) and category.
- **Sorting Options**: Sort on-the-fly by *Newest First*, *Most Popular*, or *Highest Rated*.

### 4. ✋ Drag-and-Drop Feed Organization
- Integrated with **Framer Motion** reordering (`Reorder.Group` & `Reorder.Item`).
- Click **"Reorder Feed"** to activate drag handles on cards. Reorder priority items effortlessly; changes are saved directly to Redux and local storage.

### 5. 🌓 Dynamic Dark Mode
- Full dark / light / system mode switching powered by CSS variables and Tailwind CSS.
- Smooth background and text color transitions with glassmorphic backdrop filters.

### 6. ⚡ Real-Time Streaming Ticker (Bonus)
- Simulated real-time WebSocket / SSE event engine emitting live breaking news and trending tweets every 24 seconds.
- Interactive pulsing notification pill: *"⚡ X new updates available — Click to load"*.
- Smooth entrance animation when prepending incoming stories to the active feed.

### 7. 🌍 Multi-Language Internationalization (Bonus)
- Built-in multi-language translation engine (`src/lib/i18n.ts`) supporting **6 languages**:
  - 🇺🇸 English (`en`)
  - 🇪🇸 Spanish (`es`)
  - 🇫🇷 French (`fr`)
  - 🇩🇪 German (`de`)
  - 🇮🇳 Hindi (`hi`)
  - 🇯🇵 Japanese (`ja`)
- Instant language switching directly from the top header without reloading.

### 8. 👤 User Authentication & Profile Customization (Bonus)
- Profile modal allowing users to edit display name, handle, bio, and choose from avatar styles.
- Live consumption metrics: articles read counter, bookmarks saved, topics tracked.

---

## 🏗️ Architecture & State Management

The application is structured following modern production Next.js guidelines:

```
src/
├── app/
│   ├── api/
│   │   └── feed/
│   │       └── route.ts          # REST endpoint for filtering, sorting, pagination & search
│   ├── globals.css               # Design system tokens, CSS variables, dark mode styling
│   ├── layout.tsx                # App root layout with font optimization & Redux provider
│   └── page.tsx                  # Main dashboard view orchestrating tabs and modals
├── components/
│   ├── AnalyticsSection.tsx      # Consumption insights & category affinity charts
│   ├── ContentCard.tsx           # Interactive multimedia card with CTAs & bookmarks
│   ├── DetailModal.tsx           # Full article reader, trailer player, and discussion modal
│   ├── FavoritesSection.tsx      # Saved bookmarks library with dedicated search
│   ├── FeedSection.tsx           # Feed container with infinite scroll & drag-and-drop
│   ├── FilterBar.tsx             # Type tabs, sort dropdown, and drag-and-drop trigger
│   ├── Header.tsx                # Header with debounced search, theme toggle, and i18n
│   ├── ProfileModal.tsx          # User profile editor and activity stats
│   ├── Providers.tsx             # Redux provider, hydration sync, and real-time simulator
│   ├── SettingsModal.tsx         # Preference configurator for categories, layout, theme
│   └── Sidebar.tsx               # Responsive navigation sidebar & category quick-filters
├── data/
│   └── mockData.ts               # Curated multi-source dataset and live simulation pool
├── lib/
│   └── i18n.ts                   # Internationalization dictionary and translation hook
├── store/
│   ├── hooks.ts                  # Typed Redux hooks (useAppDispatch, useAppSelector)
│   ├── index.ts                  # Redux store & localStorage persistence middleware
│   └── slices/
│       ├── authSlice.ts          # User profile and reading progress
│       ├── contentSlice.ts       # Feed items, filters, search query, incoming queue
│       ├── favoritesSlice.ts     # Saved items state and persistence
│       └── preferencesSlice.ts   # Category preferences, theme, language, view mode
├── test/
│   ├── setup.ts                  # DOM and matchMedia mock setup for Vitest
│   ├── preferencesSlice.test.ts  # Redux preferences unit tests
│   ├── favoritesSlice.test.ts    # Favorites bookmarking unit tests
│   ├── contentSlice.test.ts      # Feed filtering & drag-and-drop tests
│   └── components.test.tsx       # React Testing Library integration tests
└── types/
    └── index.ts                  # Shared TypeScript interfaces & types
```

---

## 💾 Local Storage Persistence

User settings and bookmarks automatically synchronize to browser `localStorage` using Redux middleware:
- `user_preferences_v1`: Selected categories, theme mode, language, view mode, items per page, and custom drag-and-drop order.
- `user_favorites_v1`: Array of bookmarked content items.

---

## 🛠️ Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested with Node v24)
- **npm**: v9.0.0 or higher

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd PGAGI
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🧪 Running Tests

The test suite runs with **Vitest** and **React Testing Library**:

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Highlights
- ✅ **`preferencesSlice.test.ts`**: Verifies category toggle logic, safety bounds (preventing deselecting all categories), theme switching, and order updates.
- ✅ **`favoritesSlice.test.ts`**: Verifies bookmark addition, toggling, ID removal, batch clearing, and storage hydration.
- ✅ **`contentSlice.test.ts`**: Verifies filtering, search queries, real-time incoming queues, and drag-and-drop item reordering.
- ✅ **`components.test.tsx`**: Integration tests verifying that ContentCards, FilterBars, and SettingsModals render and respond to user clicks appropriately.

---

## 🎨 Design & Accessibility (WCAG)

- **Color Contrast**: Compliant with WCAG AA guidelines for both light and dark themes.
- **Semantic HTML**: Built using `<header>`, `<main>`, `<aside>`, `<article>`, and appropriate heading hierarchies (`<h1>`-`<h3>`).
- **Interactive States**: Smooth keyboard focus outlines (`focus:ring-2`), ARIA labels on icon buttons, and non-blocking modals with backdrop dismiss.
