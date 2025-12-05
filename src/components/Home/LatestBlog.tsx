// components/Home/LatestBlog.tsx
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import { Title } from "../ui/text";
import { fetchLatestBlogPosts } from "@/services/product/blog.actions";

const LatestBlog = async () => {
  // Fetch latest blog posts from your backend
  const blogPostsResult = await fetchLatestBlogPosts(4);
  const blogs = blogPostsResult.success ? blogPostsResult.data : [];

  return (
    <div className="mb-10 lg:mb-20">
      <Title>Latest Blogs</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {blogs?.map((blog) => (
          <div
            key={blog.id}
            className="rounded-lg overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image Container with Fixed Height and Relative Positioning */}
            <div className="relative h-48 w-full overflow-hidden group">
              {blog.featuredImageUrl ? (
                <Link
                  href={`/blog/${blog.slug}`}
                  className="relative block h-full w-full"
                >
                  <Image
                    src={blog.featuredImageUrl}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={false}
                  />
                </Link>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="bg-shop_light_bg p-5 flex-1 flex flex-col">
              {/* Category and Date Row - Opposite Corners */}
              <div className="flex items-center justify-between mb-3">
                {/* Left: Categories */}
                <div className="flex flex-wrap gap-2">
                  {blog.blogPostCategories &&
                  blog.blogPostCategories.length > 0 ? (
                    blog.blogPostCategories.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-shop_dark_green/10 text-shop_dark_green text-xs font-semibold rounded-full hover:bg-shop_dark_green/20 transition-colors cursor-pointer"
                      >
                        {item.category.name}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      Uncategorized
                    </span>
                  )}
                  {blog.blogPostCategories &&
                    blog.blogPostCategories.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                        +{blog.blogPostCategories.length - 2}
                      </span>
                    )}
                </div>

                {/* Right: Date */}
                {blog.publishedAt && (
                  <div className="flex items-center gap-1 text-lightColor hover:text-shop_dark_green transition-colors cursor-pointer">
                    <Calendar size={12} />
                    <span className="text-xs">
                      {dayjs(blog.publishedAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <Link
                href={`/blog/${blog.slug}`}
                className="text-base font-semibold tracking-wide line-clamp-2 hover:text-shop_dark_green transition-colors mb-2 flex-1"
              >
                {blog.title}
              </Link>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xs text-lightColor line-clamp-2">
                  {blog.excerpt}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;
