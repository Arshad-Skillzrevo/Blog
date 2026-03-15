'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/utils/helpers'
import { Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function handleNameChange(val) {
    setForm(f => ({ ...f, name: val, slug: generateSlug(val) }))
  }

  async function handleSave() {
    if (!form.name) return
    setSaving(true)
    if (editing) {
      await supabase.from('categories').update(form).eq('id', editing)
    } else {
      await supabase.from('categories').insert(form)
    }
    setForm({ name: '', slug: '', description: '' })
    setEditing(null)
    await load()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id)
    await load()
  }

  function startEdit(cat) {
    setEditing(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' })
  }

  const inputClass = "border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Categories</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">{editing ? 'Edit Category' : 'Add Category'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input placeholder="Name *" value={form.name} onChange={e => handleNameChange(e.target.value)} className={inputClass} />
          <input placeholder="Slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} />
          <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputClass} />
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving || !form.name}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-500 transition flex items-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', description: '' }) }}
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
              <th className="text-left px-6 py-3.5 font-medium text-slate-600 hidden sm:table-cell">Slug</th>
              <th className="text-left px-6 py-3.5 font-medium text-slate-600 hidden md:table-cell">Description</th>
              <th className="text-right px-6 py-3.5 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                <td className="px-6 py-4 hidden sm:table-cell text-slate-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4 hidden md:table-cell text-slate-500">{cat.description || '—'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => startEdit(cat)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !categories.length && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}