import { IBlogCategory } from "@/types/blog.interface";
import { Column } from "../../Dashboard/shared/ManagementTable";

// Create an extended type for the table data
type BlogCategoryWithDetails = IBlogCategory & {
  _count?: { blogPostCategories: number };
  createdAt?: string;
};

export const BlogCategoryColumns: Column<BlogCategoryWithDetails>[] = [
  {
    header: "Name",
    accessor: (category) => category.name,
  },
  {
    header: "Slug",
    accessor: (category) => category.slug,
  },
  {
    header: "Posts",
    accessor: (category) => category._count?.blogPostCategories || 0,
  },
  {
    header: "Created",
    accessor: (category) => {
      if (!category.createdAt) return "N/A";
      
      try {
        // Use a consistent date format that works on both server and client
        const date = new Date(category.createdAt);
        
        // Format manually to avoid locale differences
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`; // DD/MM/YYYY format
      } catch {
        return "Invalid date";
      }
    },
  },
];