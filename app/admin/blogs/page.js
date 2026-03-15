import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import DeleteBlogButton from './DeleteBlogButton'

export const metadata = { title: 'Manage Blogs' }

export default async function BlogsPage({ searchParams }) {
  const supabase = await createSupabaseServerClient()
const { page: pageParam, search: searchParam } = await searchParams

  const page = parseInt(pageParam || '1')
  const search = searchParam || ''
  const perPage = 10
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  

  let query = supabase
    .from('blogs')
    .select('id, title, slug, status, featured, author, created_at, categories(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) query = query.ilike('title', `%${search}%`)

  const { data: blogs, count } = await query
  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
        <Link href="/admin/blogs/create"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-500 transition">
          <Plus className="w-4 h-4" /> New Blog
        </Link>
      </div>

      <form className="flex gap-3">
        <input name="search" defaultValue={search} placeholder="Search blogs..."
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition">Search</button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3.5 text-slate-600 font-medium">Title</th>
                <th className="text-left px-6 py-3.5 text-slate-600 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3.5 text-slate-600 font-medium hidden sm:table-cell">Status</th>
                <th className="text-left px-6 py-3.5 text-slate-600 font-medium hidden lg:table-cell">Date</th>
                <th className="text-right px-6 py-3.5 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs?.map(blog => (
                <tr key={blog.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 truncate max-w-xs">{blog.title}</div>
                    <div className="text-slate-400 text-xs mt-0.5">/{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-600">{blog.categories?.name || '—'}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-slate-500">{formatDate(blog.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blogs/${blog.slug}`} target="_blank"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/blogs/edit/${blog.id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteBlogButton id={blog.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {!blogs?.length && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No blogs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`?page=${page - 1}&search=${search}`}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition">Prev</Link>
              )}
              {page < totalPages && (
                <Link href={`?page=${page + 1}&search=${search}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 transition">Next</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}