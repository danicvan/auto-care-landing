// Versão do cliente apenas para o lado do cliente
let supabase: any = null

if (typeof window !== "undefined") {
  // Importação dinâmica para evitar execução durante SSR/build
  import("@supabase/supabase-js").then(({ createClient }) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
  })
}

export { supabase }
