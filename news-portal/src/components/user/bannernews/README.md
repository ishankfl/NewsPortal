# Banner News Page Components

This folder contains the user-facing banner news page components for the News Portal application.

## Components Overview

### 1. BannerNewsPage.jsx
The main page component that orchestrates all other components and provides the overall layout.

**Features:**
- Responsive layout with main content area and sidebar
- Header navigation
- Footer with links and categories
- Integration of all sub-components

### 2. BannerSlider.jsx
A dynamic banner slider that displays featured news articles.

**Features:**
- Auto-sliding functionality (5-second intervals)
- Manual navigation with arrow buttons
- Dot indicators for slide navigation
- Thumbnail navigation on larger screens
- Responsive design
- Cover photo and title display
- Author and publication date information

### 3. CategoryNews.jsx
Displays news articles organized by categories.

**Features:**
- Category filtering (All News + specific categories)
- Featured article display (first article with larger layout)
- Grid layout for regular articles
- Load more functionality with pagination
- Article cards with cover images, titles, summaries
- Author and date information
- Bookmark and share buttons

### 4. TrendingNews.jsx
Sidebar component showing trending/popular news articles.

**Features:**
- Ranked list of trending articles (1-8)
- Thumbnail images for each article
- View count display
- Popular categories section
- Newsletter signup form
- Responsive design for sidebar placement

### 5. Advertisement.jsx
Handles display of advertisements in different positions.

**Features:**
- Multiple ad positions (banner, sidebar)
- Auto-rotation for multiple ads
- Close functionality for individual ads
- Click tracking capability
- External link handling
- Responsive layouts for different positions

## Usage

```jsx
import { BannerNewsPage } from './components/user/bannernews';

// Use in your routing
<Route path="/bannernews" element={<BannerNewsPage />} />
```

## API Dependencies

The components rely on the following API services:

- `getPublishedArticles()` - Fetch published news articles
- `getCategories()` - Fetch news categories
- `getBanners()` - Fetch advertisement banners

## Styling

- Uses Tailwind CSS for styling
- Additional custom styles in `BannerNews.css`
- Responsive design with mobile-first approach
- Hover effects and smooth transitions

## Features Implemented

✅ **Banner News Display**
- Featured articles in slider format
- Cover photo and title display
- Auto-sliding with manual controls

✅ **Advertisement Integration**
- Banner advertisements
- Sidebar advertisements
- Auto-rotation and close functionality

✅ **Category-wise News**
- Filter by categories
- Featured article layout
- Grid display for regular articles
- Load more functionality

✅ **Trending News Sidebar**
- Ranked trending articles
- Thumbnail display
- Popular categories
- Newsletter signup

✅ **Responsive Design**
- Mobile-friendly layout
- Adaptive grid systems
- Touch-friendly controls

## File Structure

```
bannernews/
├── BannerNewsPage.jsx    # Main page component
├── BannerSlider.jsx      # Banner slider component
├── CategoryNews.jsx      # Category news display
├── TrendingNews.jsx      # Trending news sidebar
├── Advertisement.jsx     # Advertisement component
├── BannerNews.css       # Custom styles
├── index.js             # Export file
└── README.md            # This documentation
```

## Future Enhancements

- Search functionality
- Social media sharing
- Comment system integration
- User authentication for bookmarks
- Real-time notifications
- Dark mode support
- PWA capabilities
