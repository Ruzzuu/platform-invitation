import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 9
const LEGACY_CATALOG_SLUGS = ['classic-dark', 'romantic-floral', 'javanese-gold', 'mahogany']

/**
 * Fetch a list of templates with optional filtering, sorting, and pagination.
 * @param {object} options
 * @param {string}  options.style  - Filter by style ('All' or specific style)
 * @param {string}  options.sort   - 'featured' | 'price_asc' | 'price_desc' | 'newest'
 * @param {number}  options.page   - 1-based page number
 * @param {boolean} options.featuredOnly - Only return is_featured templates
 * @param {number}  options.limit  - Max rows (overrides PAGE_SIZE when set)
 */
export function useTemplates({ style = 'All', sort = 'featured', page = 1, featuredOnly = false, limit } = {}) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      const pageSize = limit ?? PAGE_SIZE
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      async function runQuery(useVisibilityColumn) {
        let query = supabase
          .from('templates')
          .select('*', { count: 'exact' })

        query = useVisibilityColumn
          ? query.eq('catalog_visible', true)
          : query.in('slug', LEGACY_CATALOG_SLUGS)

        if (featuredOnly) query = query.eq('is_featured', true)
        if (style && style !== 'All') query = query.eq('style', style)

        switch (sort) {
          case 'price_asc':  query = query.order('price', { ascending: true });  break
          case 'price_desc': query = query.order('price', { ascending: false }); break
          case 'newest':     query = query.order('created_at', { ascending: false }); break
          default:           query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: true })
        }

        return query.range(from, to)
      }

      let result = await runQuery(true)
      if (result.error?.code === '42703' || result.error?.message?.includes('catalog_visible')) {
        result = await runQuery(false)
      }

      const { data: rows, count, error: err } = result

      if (cancelled) return
      if (err) { setError(err.message); setLoading(false); return }

      setData(rows ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    }

    fetchData()
    return () => { cancelled = true }
  }, [style, sort, page, featuredOnly, limit])

  return { data, total, loading, error, pageSize: limit ?? PAGE_SIZE }
}

/**
 * Fetch a single template by slug.
 * @param {string} slug
 */
export function useTemplate(slug) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      const { data: row, error: err } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .single()

      if (cancelled) return
      if (err) { setError(err.message); setLoading(false); return }

      setData(row)
      setLoading(false)
    }

    fetchData()
    return () => { cancelled = true }
  }, [slug])

  return { data, loading, error }
}
