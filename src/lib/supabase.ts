import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

let supabaseClient: SupabaseClient<Database> | null = null

export function getSupabaseEnvError() {
  if (supabaseUrl && supabaseAnonKey) {
    return null
  }

  return 'Faltan las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Configura .env.local antes de usar el panel.'
}

export function getSupabaseClient() {
  const envError = getSupabaseEnvError()

  if (envError) {
    throw new Error(envError)
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return supabaseClient
}
