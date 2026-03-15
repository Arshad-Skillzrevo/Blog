'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteBlogButton({ id }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this blog?')) return
    setLoading(true)
    await supabase.from('blogs').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}