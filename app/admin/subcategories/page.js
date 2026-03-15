'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/utils/helpers'
import { Save, X, Edit, Trash2, Loader2 } from 'lucide-react'

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState([])
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', slug: '', category_id: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const [{ data: cats }, { data: subsData }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('subcategories').select('*, categories(name)').order('name'),
    ])
    setCategories(cats || [])
    setSubs(subsData || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    if (!form.name || !form.category_id) return
    setSaving(true)
    if (editing) {
      await supabase.from('subcategories').update(form).eq('id', editing)
    } else {
      await supabase.from('subcategories').insert(form)
    }
    setForm({ name: '', slug: '', category_id: '' })
    setEditing(null)
    await load()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this subcategory?')) return
    await supabase.from('subcategories').delete().eq('id', id)
    await load()
  }

  const inputClass = "border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Subcategories</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">{editing ? 'Edit' : 'Add'} Subcategory</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className={inputClass}>
            <option value="">Select category *</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Name *" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))}
            className={inputClass} />
          <input placeholder="Slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} />
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving || !form.name || !form.category_id}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-500 transition flex items-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', category_id: '' }) }}
              className="border border-slate-200 px-4 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-3.5 font-medium text-slate-600">Name</th>
              <th className="text-left px-6 py-3.5 font-medium text-slate-600 hidden sm:table-cell">Category</th>
              <th className="text-left px-6 py-3.5 font-medium text-slate-600 hidden md:table-cell">Slug</th>
              <th className="text-right px-6 py-3.5 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : subs.map(sub => (
              <tr key={sub.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">{sub.name}</td>
                <td className="px-6 py-4 hidden sm:table-cell text-slate-500">{sub.categories?.name}</td>
                <td className="px-6 py-4 hidden md:table-cell text-slate-500 font-mono text-xs">{sub.slug}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditing(sub.id); setForm({ name: sub.name, slug: sub.slug, category_id: sub.category_id }) }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(sub.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !subs.length && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No subcategories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}