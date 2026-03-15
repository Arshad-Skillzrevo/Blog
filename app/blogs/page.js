import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/helpers'
import { Clock, Tag } from 'lucide-react'

export const metadata = {
  title: 'Blog',
  description: 'Read our latest articles and insights',
}

export default async function BlogsPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*, categories(name, slug)')
    .eq('status', 'published')
    .order('publish_date', { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Blog</h1>
          <p className="text-slate-500 mt-4 text-lg">Insights, tutorials, and updates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs?.map(blog => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`}
              className="group rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition overflow-hidden">
              {blog.featured_image && (
                <div className="relative h-48 overflow-hidden">
                  <img src={blog.featured_image} alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
              )}
              <div className="p-6 space-y-3">
                {blog.categories && (
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                    {blog.categories.name}
                  </span>
                )}
                <h2 className="font-bold text-slate-900 text-xl leading-snug group-hover:text-indigo-600 transition">
                  {blog.title}
                </h2>
                <p className="text-slate-500 text-sm line-clamp-3">{blog.short_description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>{formatDate(blog.publish_date)}</span>
                  {blog.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {blog.reading_time} min read
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!blogs?.length && (
          <div className="text-center py-20 text-slate-400">No blogs published yet.</div>
        )}
      </div>
    </div>
  )
}