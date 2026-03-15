export function formatBlog(blog) {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    image: blog.featured_image,
    category: blog.categories?.name,
    category_slug: blog.categories?.slug,
    subcategory: blog.subcategories?.name,
    subcategory_slug: blog.subcategories?.slug,
    description: blog.short_description,
    content: blog.content,
    author: blog.author,
    published_at: blog.publish_date,
    tags: blog.tags,
    reading_time: blog.reading_time,
    featured: blog.featured,
    meta: {
      title: blog.meta_title,
      description: blog.meta_description,
      keywords: blog.meta_keywords,
      canonical_url: blog.canonical_url,
      og_image: blog.og_image,
    }
  }
}