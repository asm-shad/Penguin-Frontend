/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "./user.interface";

// BlogCategory interface - MATCHES YOUR SCHEMA
export interface IBlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  blogPostCategories?: IBlogPostCategory[];
}

// BlogPost interface - MATCHES YOUR UPDATED SCHEMA (with userId instead of authorId)
export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: any; // Json type from Prisma
  featuredImageUrl?: string;
  isLatest: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations - UPDATED: userId instead of authorId
  userId: string;
  user?: IUser;
  blogPostCategories?: IBlogPostCategory[];

  // Helper/computed fields for frontend
  categories?: IBlogCategory[];
  authorName?: string;
  authorImage?: string;
  readTime?: string;
}

// BlogPostCategory (Junction Table) - MATCHES YOUR SCHEMA
export interface IBlogPostCategory {
  id: string;
  createdAt: Date;
  blogPostId: string;
  blogPost: IBlogPost;
  categoryId: string;
  category: IBlogCategory;
}

// Blog creation/update DTO
export interface ICreateBlogPostDto {
  title: string;
  slug: string;
  excerpt?: string;
  content?: any;
  featuredImageUrl?: string;
  isLatest?: boolean;
  publishedAt?: Date;
  categoryIds?: string[];
}

// Blog filter types
export interface IBlogPostFilters {
  category?: string;
  searchTerm?: string;
  isLatest?: boolean;
  author?: string;
  sortBy?: "createdAt" | "publishedAt" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Blog comment interface (if you add comments later)
export interface IBlogComment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  blogPostId: string;
  blogPost?: IBlogPost;
  parentId?: string;
  replies?: IBlogComment[];
}
