// Blog Types
export interface IBlogUser {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

export interface IBlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface IBlogPostCategory {
  id: string;
  blogPostId: string;
  categoryId: string;
  category: IBlogCategory;
}

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  isFeatured: boolean;
  isLatest: boolean;
  publishedAt?: Date | null;
  viewCount: number;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userId?: string;
  user?: IBlogUser;
  blogPostCategories?: IBlogPostCategory[];

  // Prisma _count
  _count?: {
    blogPostCategories: number;
  };
}

export interface IBlogPostFilters {
  searchTerm?: string;
  userId?: string;
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  isLatest?: boolean;
  sortBy?: "publishedAt" | "createdAt" | "title" | "viewCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
