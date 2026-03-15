import { createSupabaseServerClient } from '@/lib/supabase-server'
import BlogForm from '@/components/BlogForm'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Blog' }

export default async function EditBlogPage({ params }) {
  const supabase = await createSupabaseServerClient()
  const { data: blog } = await supabase.from('blogs').select('*').eq('id', params.id).single()
  if (!blog) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Blog</h1>
      <BlogForm blog={blog} />
    </div>
  )
}