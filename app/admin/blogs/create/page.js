import BlogForm from '@/components/BlogForm'

export const metadata = { title: 'Create Blog' }

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Create New Blog</h1>
      <BlogForm />
    </div>
  )
}