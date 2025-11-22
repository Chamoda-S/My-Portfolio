import { createBrowserClient as createBrowserClientSSR } from "@supabase/ssr"

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables are not configured. Using mock client.")

    const mockQueryBuilder = {
      select: () => mockQueryBuilder,
      eq: () => mockQueryBuilder,
      order: () => mockQueryBuilder,
      then: (resolve: any) => resolve({ data: [], error: null }),
    }

    return {
      from: () => mockQueryBuilder,
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
        signUp: async () => ({ data: { user: null, session: null }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as any
  }

  return createBrowserClientSSR(supabaseUrl, supabaseAnonKey)
}
