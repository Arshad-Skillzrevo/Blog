import slugify from 'slugify'

export function generateSlug(text) {
  return slugify(text, { lower: true, strict: true, trim: true })
}

export function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const wordCount = content?.split(/\s+/).length || 0
  return Math.ceil(wordCount / wordsPerMinute)
}

export function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

export function truncate(str, n) {
  return str?.length > n ? str.slice(0, n - 1) + '…' : str
}