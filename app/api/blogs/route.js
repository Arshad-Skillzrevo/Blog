import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const featured = searchParams.get('featured')
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('blogs')
    .select(`*, categories(id, name, slug), subcategories(id, name, slug)`, { count: 'exact' })
    .eq('status', 'published')
    .order('publish_date', { ascending: false })
    .range(from, to)

  if (featured === 'true') query = query.eq('featured', true)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data: data.map(formatBlog),
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
  })
}