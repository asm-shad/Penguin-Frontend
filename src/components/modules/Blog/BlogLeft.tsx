import {
  fetchBlogCategories,
  fetchBlogPosts,
} from "@/services/product/blog.actions";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogLeftProps {
  slug: string;
}

export const BlogLeft = async ({ slug }: BlogLeftProps) => {
  // Fetch categories
  const categoriesResult = await fetchBlogCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  // Fetch latest blogs (excluding current one)
  const blogsResult = await fetchBlogPosts({
    limit: 5,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  const allBlogs = blogsResult.success ? blogsResult.data : [];
  // Filter out current blog
  const latestBlogs = allBlogs.filter((blog) => blog.slug !== slug).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div className="border border-lightColor p-5 rounded-md">
        <h3 className="text-lg font-bold mb-4">Blog Categories</h3>
        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories yet.</p>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between text-gray-700 hover:text-shop_dark_green transition-colors group"
              >
                <span className="text-sm font-medium group-hover:font-semibold">
                  {category.name}
                </span>
                {category._count?.blogPosts !== undefined && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {category._count.blogPosts}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Latest Blogs Section */}
      <div className="border border-lightColor p-5 rounded-md">
        <h3 className="text-lg font-bold mb-4">Latest Blogs</h3>
        <div className="space-y-4">
          {latestBlogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No other blogs available.</p>
          ) : (
            latestBlogs.map((blog) => {
              const readingTime =
                blog.readingTime ||
                Math.ceil((blog.content?.length || 0) / 1000);

              return (
                <Link
                  href={`/blog/${blog.slug}`}
                  key={blog.id}
                  className="flex items-start gap-3 group"
                >
                  {/* Blog Thumbnail */}
                  {blog.featuredImageUrl ? (
                    <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
                      <Image
                        src={blog.featuredImageUrl}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 shrink-0 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">No image</span>
                    </div>
                  )}

                  {/* Blog Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-shop_dark_green transition-colors">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Newsletter Signup (Optional) */}
      <div className="bg-linear-to-br from-shop_dark_green/10 to-shop_dark_green/5 p-5 rounded-md border border-shop_dark_green/20">
        <h3 className="font-bold text-gray-900 mb-2">Stay Updated</h3>
        <p className="text-sm text-gray-600 mb-4">
          Subscribe to get notified about new blog posts.
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-shop_dark_green/20 focus:border-shop_dark_green"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium bg-shop_dark_green text-white rounded hover:bg-shop_dark_green/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};
