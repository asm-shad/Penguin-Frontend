import { BlogLeft } from "@/components/modules/Blog/BlogLeft";
import Container from "@/components/shared/Container";
import { fetchBlogPostBySlug } from "@/services/product/blog.actions";
import dayjs from "dayjs";
import {
  Calendar,
  ChevronLeftIcon,
  Pencil,
  Clock,
  Eye,
  Share2,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

const SingleBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Fetch single blog post from your backend
  const blogResult = await fetchBlogPostBySlug(slug);

  if (!blogResult.success || !blogResult.data) {
    return notFound();
  }

  const blog = blogResult.data;

  // Calculate reading time
  const readingTime =
    blog.readingTime || Math.ceil((blog.content?.length || 0) / 1000);

  return (
    <div className="py-10">
      <Container className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Blog Featured Image */}
          {blog.featuredImageUrl ? (
            <Image
              src={blog.featuredImageUrl}
              alt={blog.title || "Blog Image"}
              width={800}
              height={500}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 md:h-96 bg-linear-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-lg">No image available</span>
            </div>
          )}

          {/* Blog Meta Information */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Categories */}
              {blog.blogPostCategories &&
                blog.blogPostCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.blogPostCategories.map((postCategory) => (
                      <Link
                        key={postCategory.id}
                        href={`/blog/category/${postCategory.category.slug}`}
                        className="px-3 py-1 text-xs font-semibold bg-shop_dark_green/10 text-shop_dark_green rounded-full hover:bg-shop_dark_green hover:text-white transition-colors"
                      >
                        {postCategory.category.name}
                      </Link>
                    ))}
                  </div>
                )}

              {/* Author */}
              {blog.user && (
                <div className="flex items-center gap-2 text-lightColor hover:text-shop_dark_green transition-colors">
                  <Pencil size={15} />
                  <span className="text-sm font-medium">{blog.user.name}</span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-lightColor">
                <Calendar size={15} />
                <span className="text-sm">
                  {dayjs(blog.publishedAt || blog.createdAt).format(
                    "MMMM D, YYYY"
                  )}
                </span>
              </div>

              {/* Reading Time */}
              <div className="flex items-center gap-2 text-lightColor">
                <Clock size={15} />
                <span className="text-sm">{readingTime} min read</span>
              </div>

              {/* Views */}
              {blog.viewCount > 0 && (
                <div className="flex items-center gap-2 text-lightColor">
                  <Eye size={15} />
                  <span className="text-sm">{blog.viewCount} views</span>
                </div>
              )}
            </div>

            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            {/* Featured Badge */}
            {blog.isFeatured && (
              <div className="inline-flex items-center px-3 py-1 mb-6 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                <Bookmark className="w-3 h-3 mr-1" />
                Featured Post
              </div>
            )}

            {/* Blog Excerpt */}
            {blog.excerpt && (
              <div className="text-lg text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-shop_dark_green">
                {blog.excerpt}
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none text-gray-700">
              {/* Render HTML content - assuming your backend returns HTML or markdown */}
              {blog.content ? (
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-gray-500 italic">
                  No content available for this post.
                </p>
              )}
            </div>

            {/* Share and Actions */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-shop_dark_green transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-shop_dark_green transition-colors">
                    <Bookmark size={18} />
                    <span className="text-sm font-medium">Save</span>
                  </button>
                </div>

                {/* Tags */}
                {blog.metaKeywords && blog.metaKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Tags:</span>
                    {blog.metaKeywords.slice(0, 5).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Back to Blog Link */}
            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-shop_dark_green hover:text-shop_dark_green/80 font-semibold transition-colors group"
              >
                <ChevronLeftIcon className="size-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Blog</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogLeft slug={slug} />
        </div>
      </Container>
    </div>
  );
};

export default SingleBlogPage;
