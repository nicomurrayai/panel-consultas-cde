interface ImportMetaEnv {
  readonly VITE_PANEL_AUTH_PASSWORD?: string
  readonly VITE_PANEL_AUTH_USERNAME?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}