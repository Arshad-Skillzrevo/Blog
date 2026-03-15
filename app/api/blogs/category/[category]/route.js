import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).single()
  if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  const { data } = await supabase
    .from('blogs')
    .select('*, categories(id, name, slug), subcategories(id, name, slug)')
    .eq('category_id', cat.id)
    .eq('status', 'published')
    .order('publish_date', { ascending: false })

  return NextResponse.json({ data: (data || []).map(formatBlog) }, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  })
}