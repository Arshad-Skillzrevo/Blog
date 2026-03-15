import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/utils/helpers'
import { Clock, ArrowLeft } from 'lucide-react'

// ✅ Use plain supabase-js client for public server pages (no auth needed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ✅ await params
export async function generateMetadata({ params }) {
  const { slug } = await params

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!blog) return {}

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.short_description,
    keywords: blog.meta_keywords,
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.short_description,
      images: blog.og_image
        ? [blog.og_image]
        : blog.featured_image
        ? [blog.featured_image]
        : [],
    },
    alternates: { canonical: blog.canonical_url || undefined },
  }
}

// ✅ await params
export default async function BlogPage({ params }) {
  const { slug } = await params

  const { data: blog } = await supabase
    .from('blogs')
    .select('*, categories(name, slug), subcategories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!blog) notFound()

  const { data: related } = await supabase
    .from('blogs')
    .select('id, title, slug, featured_image, short_description')
    .eq('category_id', blog.category_id)
    .eq('status', 'published')
    .neq('id', blog.id)
    .limit(3)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Link href="/blogs"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {blog.featured_image && (
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-72 md:h-96 object-cover rounded-2xl mb-10"
          />
        )}

        <div className="flex items-center gap-3 flex-wrap mb-6">
          {blog.categories && (
            <Link href={`/category/${blog.categories.slug}`}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition">
              {blog.categories.name}
            </Link>
          )}
          {blog.subcategories && (
            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {blog.subcategories.name}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          {blog.title}
        </h1>

        <div className="flex items-center gap-5 text-sm text-slate-500 mb-10 pb-10 border-b border-slate-100">
          <span className="font-medium text-slate-900">{blog.author}</span>
          <span>{formatDate(blog.publish_date)}</span>
          {blog.reading_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {blog.reading_time} min read
            </span>
          )}
        </div>

        <div
          className="prose prose-lg prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-slate-100">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {blog.schema_markup && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: blog.schema_markup }}
          />
        )}

        {related?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.id} href={`/blogs/${r.slug}`}
                  className="group rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition overflow-hidden">
                  {r.featured_image && (
                    <img
                      src={r.featured_image}
                      alt={r.title}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}