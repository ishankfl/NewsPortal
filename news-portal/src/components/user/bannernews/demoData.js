// Demo data for testing banner news page when backend is not available

export const demoArticles = [
  {
    id: 1,
    title: "Breaking: Major Technology Breakthrough Announced",
    summary: "Scientists have made a groundbreaking discovery that could revolutionize the way we think about renewable energy and sustainable technology.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    authorName: "John Smith",
    categoryName: "Technology",
    categoryId: 1,
    publicationDatetime: "2025-01-10T10:00:00Z",
    createdAt: "2025-01-10T09:00:00Z",
    viewCount: 1250,
    status: "published"
  },
  {
    id: 2,
    title: "Sports Update: Championship Finals This Weekend",
    summary: "The most anticipated championship finals are set to take place this weekend with record-breaking ticket sales.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    coverImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
    authorName: "Sarah Johnson",
    categoryName: "Sports",
    categoryId: 2,
    publicationDatetime: "2025-01-10T08:00:00Z",
    createdAt: "2025-01-10T07:30:00Z",
    viewCount: 890,
    status: "published"
  },
  {
    id: 3,
    title: "Economic Markets Show Strong Growth",
    summary: "Global markets continue to show positive trends with technology and healthcare sectors leading the growth.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    coverImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    authorName: "Michael Brown",
    categoryName: "Business",
    categoryId: 3,
    publicationDatetime: "2025-01-09T15:00:00Z",
    createdAt: "2025-01-09T14:30:00Z",
    viewCount: 567,
    status: "published"
  },
  {
    id: 4,
    title: "Climate Change Summit Reaches Historic Agreement",
    summary: "World leaders have reached a consensus on new climate policies that could significantly impact global carbon emissions.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    coverImageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop",
    authorName: "Emily Davis",
    categoryName: "Environment",
    categoryId: 4,
    publicationDatetime: "2025-01-09T12:00:00Z",
    createdAt: "2025-01-09T11:30:00Z",
    viewCount: 2100,
    status: "published"
  },
  {
    id: 5,
    title: "New Medical Research Shows Promising Results",
    summary: "Recent clinical trials have shown remarkable progress in treating previously incurable diseases.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    coverImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    authorName: "Dr. Robert Wilson",
    categoryName: "Health",
    categoryId: 5,
    publicationDatetime: "2025-01-08T16:00:00Z",
    createdAt: "2025-01-08T15:30:00Z",
    viewCount: 1450,
    status: "published"
  }
];

export const demoCategories = [
  { id: 1, name: "Technology", description: "Latest tech news and innovations" },
  { id: 2, name: "Sports", description: "Sports news and updates" },
  { id: 3, name: "Business", description: "Business and economic news" },
  { id: 4, name: "Environment", description: "Environmental and climate news" },
  { id: 5, name: "Health", description: "Health and medical news" },
  { id: 6, name: "Politics", description: "Political news and analysis" },
  { id: 7, name: "Entertainment", description: "Entertainment and celebrity news" }
];

export const demoAdvertisements = [
  {
    id: 1,
    title: "Premium Business Solutions",
    description: "Transform your business with our cutting-edge solutions",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=200&fit=crop",
    linkUrl: "https://example.com/business",
    position: "Header Banner",
    isActive: true,
    priority: 1
  },
  {
    id: 2,
    title: "Learn Programming Online",
    description: "Master coding skills with expert instructors",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
    linkUrl: "https://example.com/coding",
    position: "Sidebar",
    isActive: true,
    priority: 1
  },
  {
    id: 3,
    title: "Travel the World",
    description: "Discover amazing destinations with exclusive deals",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=200&fit=crop",
    linkUrl: "https://example.com/travel",
    position: "Header Banner",
    isActive: true,
    priority: 2
  },
  {
    id: 4,
    title: "Fitness & Wellness",
    description: "Transform your health with our fitness programs",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    linkUrl: "https://example.com/fitness",
    position: "Sidebar",
    isActive: true,
    priority: 2
  }
];

// Mock API responses
export const mockApiResponse = {
  articles: demoArticles,
  totalCount: demoArticles.length,
  page: 1,
  pageSize: 10
};

export const mockCategoriesResponse = demoCategories;

export const mockBannersResponse = {
  data: {
    items: demoAdvertisements,
    totalItems: demoAdvertisements.length
  }
};
