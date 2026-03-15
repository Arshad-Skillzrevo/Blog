'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { generateSlug, calculateReadingTime } from '@/utils/helpers'
import { Save, Upload, X, Loader2 } from 'lucide-react'

export default function BlogForm({ blog }) {
  const router = useRouter()

  // ✅ Create fresh browser client inside component — guarantees session cookie is read
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [filteredSubs, setFilteredSubs] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(blog?.featured_image || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    category_id: blog?.category_id || '',
    subcategory_id: blog?.subcategory_id || '',
    short_description: blog?.short_description || '',
    content: blog?.content || '',
    author: blog?.author || 'Admin',
    publish_date: blog?.publish_date || new Date().toISOString().split('T')[0],
    status: blog?.status || 'draft',
    meta_title: blog?.meta_title || '',
    meta_description: blog?.meta_description || '',
    meta_keywords: blog?.meta_keywords || '',
    canonical_url: blog?.canonical_url || '',
    og_image: blog?.og_image || '',
    schema_markup: blog?.schema_markup || '',
    tags: blog?.tags?.join(', ') || '',
    featured: blog?.featured || false,
  })

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: subs }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name'),
      ])
      setCategories(cats || [])
      setSubcategories(subs || [])
    }
    load()
  }, [])

  useEffect(() => {
    if (form.category_id) {
      setFilteredSubs(subcategories.filter(s => s.category_id === form.category_id))
    } else {
      setFilteredSubs([])
    }
  }, [form.category_id, subcategories])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleTitleChange(e) {
    const title = e.target.value
    set('title', title)
    if (!blog) set('slug', generateSlug(title))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadImage() {
    if (!imageFile) return blog?.featured_image || ''
    const ext = imageFile.name.split('.').pop()
    const filename = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filename, imageFile, { upsert: true })
    if (error) throw new Error(`Image upload failed: ${error.message}`)
    const { data } = supabase.storage.from('blog-images').getPublicUrl(filename)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ✅ Check session first before attempting any DB operation
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('You are not logged in. Please refresh and log in again.')
        setLoading(false)
        return
      }

      const imageUrl = await uploadImage()

      // ✅ Clean payload — no duplicate tags, no messy delete
      const payload = {
        title: form.title,
        slug: form.slug,
        category_id: form.category_id || null,
        subcategory_id: form.subcategory_id || null,
        short_description: form.short_description,
        content: form.content,
        author: form.author,
        publish_date: form.publish_date,
        status: form.status,
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        meta_keywords: form.meta_keywords,
        canonical_url: form.canonical_url || null,
        og_image: form.og_image || null,
        schema_markup: form.schema_markup || null,
        featured: form.featured,
        featured_image: imageUrl,
        reading_time: calculateReadingTime(form.content),
        tags: form.tags
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      }

      if (blog) {
        const { error } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', blog.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert(payload)
        if (error) throw new Error(error.message)
      }

      router.push('/admin/blogs')
      router.refresh()

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-900">Blog Content</h2>

            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text" value={form.title} onChange={handleTitleChange}
                required className={inputClass} placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text" value={form.slug}
                onChange={e => set('slug', e.target.value)}
                required className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Short Description</label>
              <textarea
                rows={3} value={form.short_description}
                onChange={e => set('short_description', e.target.value)}
                className={inputClass} placeholder="Brief summary shown in listings"
              />
            </div>

            <div>
              <label className={labelClass}>Content *</label>
              <textarea
                rows={15} value={form.content}
                onChange={e => set('content', e.target.value)}
                required className={`${inputClass} font-mono`}
                placeholder="Write your blog content here... (HTML supported)"
              />
              <p className="text-xs text-slate-400 mt-1">You can use HTML tags for formatting</p>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-900">SEO Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input type="text" value={form.meta_title}
                  onChange={e => set('meta_title', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Canonical URL</label>
                <input type="text" value={form.canonical_url}
                  onChange={e => set('canonical_url', e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea rows={3} value={form.meta_description}
                onChange={e => set('meta_description', e.target.value)} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Meta Keywords</label>
                <input type="text" value={form.meta_keywords}
                  onChange={e => set('meta_keywords', e.target.value)}
                  className={inputClass} placeholder="keyword1, keyword2" />
              </div>
              <div>
                <label className={labelClass}>OG Image URL</label>
                <input type="text" value={form.og_image}
                  onChange={e => set('og_image', e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Schema Markup (JSON-LD)</label>
              <textarea rows={5} value={form.schema_markup}
                onChange={e => set('schema_markup', e.target.value)}
                className={`${inputClass} font-mono text-xs`}
                placeholder='{"@context": "https://schema.org",...}' />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Publish</h2>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Publish Date</label>
              <input type="date" value={form.publish_date}
                onChange={e => set('publish_date', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Author</label>
              <input type="text" value={form.author}
                onChange={e => set('author', e.target.value)} className={inputClass} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600" />
              <span className="text-sm text-slate-700">Featured blog</span>
            </label>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Category</h2>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category_id}
                onChange={e => { set('category_id', e.target.value); set('subcategory_id', '') }}
                className={inputClass}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Subcategory</label>
              <select value={form.subcategory_id}
                onChange={e => set('subcategory_id', e.target.value)}
                className={inputClass} disabled={!form.category_id}>
                <option value="">Select subcategory</option>
                {filteredSubs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tags (comma separated)</label>
              <input type="text" value={form.tags}
                onChange={e => set('tags', e.target.value)}
                className={inputClass} placeholder="ai, machine learning, tech" />
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Featured Image</h2>
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} alt="" className="w-full h-40 object-cover rounded-xl" />
                <button type="button"
                  onClick={() => { setImagePreview(''); setImageFile(null) }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            )}
            <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-5 cursor-pointer hover:border-indigo-300 transition">
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-sm text-slate-500">Click to upload image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-500 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {blog ? 'Update Blog' : 'Create Blog'}
            </button>
            <button type="button" onClick={() => router.push('/admin/blogs')}
              className="w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}