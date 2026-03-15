'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Menu, X, Rss, ChevronDown } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name')
      setCategories(data || [])
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
        : 'bg-white border-b border-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/blogs" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-500 transition">
              <Rss className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Blog<span className="text-indigo-600">CMS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/blogs"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/blogs')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}>
              All Posts
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dropdownOpen
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}>
                Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 overflow-hidden">
                  {categories.length === 0 && (
                    <p className="text-xs text-slate-400 px-4 py-2">No categories yet</p>
                  )}
                  {categories.map(cat => (
                    <Link key={cat.id} href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/admin/dashboard"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition px-3 py-2">
              Admin
            </Link>
            <Link href="/blogs"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 transition shadow-sm">
              Read Blog
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
            <Link href="/blogs"
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive('/blogs') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}>
              All Posts
            </Link>

            {categories.length > 0 && (
              <>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">
                  Categories
                </p>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}
                    className="block px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
                    {cat.name}
                  </Link>
                ))}
              </>
            )}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/admin/dashboard"
                className="block px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}