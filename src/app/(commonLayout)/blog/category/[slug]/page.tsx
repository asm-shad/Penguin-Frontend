import Container from "@/components/shared/Container";
import { Clock, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import {
  fetchBlogCategoryBySlug,
  fetchBlogPosts,
} from "@/services/product/blog.actions";

export const dynamic = 'force-dynamic';

const BlogCategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Fetch category by slug
  const categoryResult = await fetchBlogCategoryBySlug(slug);

  if (!categoryResult.success || !categoryResult.data) {
    return notFound();
  }

  const category = categoryResult.data;

  // Fetch blog posts for this category
  const blogsResult = await fetchBlogPosts({
    categorySlug: slug,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  const blogs = blogsResult.success ? blogsResult.data : [];
  const totalBlogs = blogsResult.meta?.total || 0;

  return (
    <div className="py-10">
      <Container>
        {/* Category Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {category.description}
            </p>
          )}
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-shop_dark_green/10 text-shop_dark_green">
              {totalBlogs} {totalBlogs === 1 ? "Post" : "Posts"}
            </span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-500">
            <Link href="/blog" className="hover:text-shop_dark_green">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>

        {/* Blog Posts Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No posts in this category yet
            </h3>
            <p className="text-gray-500 mb-6">
              Check back soon for new posts in this category.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 bg-shop_dark_green text-white font-medium rounded-lg hover:bg-shop_dark_green/90 transition-colors"
            >
              Back to All Posts
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => {
                const readingTime =
                  blog.readingTime ||
                  Math.ceil((blog.content?.length || 0) / 1000);

                return (
                  <article
                    key={blog.id}
                    className="rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Blog Image */}
                    <div className="relative h-48 overflow-hidden">
                      {blog.featuredImageUrl ? (
                        <Image
                          src={blog.featuredImageUrl}
                          alt={blog.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            No image
                          </span>
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
                    </div>

                    {/* Blog Content */}
                    <div className="p-5">
                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                        {/* Date */}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {dayjs(blog.publishedAt || blog.createdAt).format(
                              "MMM D"
                            )}
                          </span>
                        </div>

                        {/* Reading Time */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{readingTime} min</span>
                        </div>

                        {/* Author */}
                        {blog.user && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{blog.user.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${blog.slug}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-shop_dark_green transition-colors">
                          {blog.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}

                      {/* Read More Link */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="text-sm font-medium text-shop_dark_green hover:text-shop_dark_green/80 transition-colors"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination (optional) */}
            {blogsResult.meta && blogsResult.meta.total > 6 && (
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page 1 of {Math.ceil(totalBlogs / 6)}
                  </span>
                  <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Back to Blog Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-shop_dark_green hover:text-shop_dark_green/80 font-semibold"
          >
            ← Back to All Blog Posts
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default BlogCategoryPage;
