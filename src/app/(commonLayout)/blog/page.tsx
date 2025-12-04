import Container from "@/components/shared/Container";
import { Title } from "@/components/ui/text";
import { fetchBlogPosts } from "@/services/product/blog.actions";
import dayjs from "dayjs";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogPage = async () => {
  // Fetch blog posts from your backend
  const blogsResult = await fetchBlogPosts({
    limit: 6,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  const blogs = blogsResult.success ? blogsResult.data : [];

  return (
    <div className="py-10">
      <Container>
        <div className="text-center mb-10">
          <Title className="text-3xl md:text-4xl font-bold mb-4">
            Latest Blog Posts
          </Title>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest news, tips, and insights about
            products, technology, and lifestyle.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No blog posts yet
            </h3>
            <p className="text-gray-500">
              Check back soon for our latest articles and updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              // Get primary category
              const primaryCategory = blog.blogPostCategories?.[0]?.category;

              // Calculate reading time if not provided
              const readingTime =
                blog.readingTime ||
                Math.ceil((blog.content?.length || 0) / 1000);

              return (
                <article
                  key={blog.id}
                  className="group rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-shop_dark_green/30 hover:shadow-lg transition-all duration-300"
                >
                  {/* Blog Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    {blog.featuredImageUrl ? (
                      <Image
                        src={blog.featuredImageUrl}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {blog.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-semibold bg-shop_dark_green text-white rounded">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Category Badge */}
                    {primaryCategory && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs font-semibold bg-white/90 text-gray-800 rounded backdrop-blur-sm">
                          {primaryCategory.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Blog Content */}
                  <div className="p-5">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      {/* Date */}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {dayjs(blog.publishedAt || blog.createdAt).format(
                            "MMM D, YYYY"
                          )}
                        </span>
                      </div>

                      {/* Reading Time */}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{readingTime} min read</span>
                      </div>

                      {/* Views */}
                      {blog.viewCount > 0 && (
                        <div className="text-gray-500">
                          {blog.viewCount} views
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${blog.slug}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-shop_dark_green transition-colors">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Categories */}
                    {blog.blogPostCategories &&
                      blog.blogPostCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.blogPostCategories
                            .slice(0, 2)
                            .map((postCategory) => (
                              <Link
                                key={postCategory.id}
                                href={`/blog/category/${postCategory.category.slug}`}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-shop_dark_green hover:text-white transition-colors"
                              >
                                {postCategory.category.name}
                              </Link>
                            ))}
                          {blog.blogPostCategories.length > 2 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{blog.blogPostCategories.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                    {/* Author Info */}
                    {blog.user && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        {blog.user.profileImageUrl ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={blog.user.profileImageUrl}
                              alt={blog.user.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {blog.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {blog.user.name}
                          </p>
                          {blog.user.email && (
                            <p className="text-xs text-gray-500">
                              {blog.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Read More Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-sm font-medium text-shop_dark_green hover:text-shop_dark_green/80 transition-colors group"
                      >
                        Read More
                        <svg
                          className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More Button (if you want pagination) */}
        {blogsResult.meta && blogsResult.meta.total > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/blog/all"
              className="inline-flex items-center px-6 py-3 bg-shop_dark_green text-white font-medium rounded-lg hover:bg-shop_dark_green/90 transition-colors"
            >
              View All Posts
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              Showing {blogs.length} of {blogsResult.meta.total} posts
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
