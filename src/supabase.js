import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const isValidUrl = (() => {
  if (!supabaseUrl) return false

  try {
    const url = new URL(supabaseUrl)
    return url.protocol === 'https:' || url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  } catch {
    return false
  }
})()

export const isSupabaseConfigured = Boolean(
  isValidUrl
  && supabaseAnonKey
  && !supabaseUrl.includes('your-project')
  && !supabaseAnonKey.includes('your-public-anon-key'),
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  })
  : null
