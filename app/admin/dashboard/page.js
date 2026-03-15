import { createSupabaseServerClient } from '@/lib/supabase-server'
import { FileText, FolderOpen, Tag, Star, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/utils/helpers'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  // ✅ await the client — it's now async
  const supabase = await createSupabaseServerClient()

  const [
    { count: blogsCount },
    { count: categoriesCount },
    { count: subcategoriesCount },
    { data: latestBlogs }
  ] = await Promise.all([
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('subcategories').select('*', { count: 'exact', head: true }),
    supabase.from('blogs')
      .select('id, title, slug, status, created_at, author')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Total Blogs', value: blogsCount || 0, icon: FileText, color: 'indigo', href: '/admin/blogs' },
    { label: 'Categories', value: categoriesCount || 0, icon: FolderOpen, color: 'emerald', href: '/admin/categories' },
    { label: 'Subcategories', value: subcategoriesCount || 0, icon: Tag, color: 'amber', href: '/admin/subcategories' },
  ]

  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <Link href="/admin/blogs/create"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-500 transition shadow-sm">
          <Plus className="w-4 h-4" /> New Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-md transition group">
            <div className={`inline-flex p-3 rounded-xl border ${colorMap[color]} mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{value}</div>
            <div className="text-slate-500 text-sm mt-1 flex items-center gap-1">
              {label}
              <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Latest Blogs
          </h2>
          <Link href="/admin/blogs" className="text-indigo-600 text-sm hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {latestBlogs?.map(blog => (
            <div key={blog.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{blog.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{blog.author} · {formatDate(blog.created_at)}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {blog.status}
              </span>
              <Link href={`/admin/blogs/edit/${blog.id}`}
                className="text-slate-400 hover:text-indigo-600 transition">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
          {!latestBlogs?.length && (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No blogs yet. Create your first one!</div>
          )}
        </div>
      </div>
    </div>
  )
}