import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*, categories(id, name, slug), subcategories(id, name, slug)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(formatBlog(data), {
    headers: { 'Access-Control-Allow-Origin': '*' }
  })
}