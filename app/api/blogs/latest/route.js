import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '5')

  const { data } = await supabase
    .from('blogs')
    .select('*, categories(id, name, slug), subcategories(id, name, slug)')
    .eq('status', 'published')
    .order('publish_date', { ascending: false })
    .limit(limit)

  return NextResponse.json({ data: (data || []).map(formatBlog) }, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=30' }
  })
}