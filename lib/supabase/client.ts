import { createBrowserClient as createBrowserClientSSR } from "@supabase/ssr"

// Mock implementation for Supabase client
const createMockSupabaseClient = () => {
  console.warn("[v0] Running in mock mode. Supabase functionality will be limited.")
  
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    insert: () => ({ select: () => mockQueryBuilder }),
    update: () => ({ eq: () => mockQueryBuilder }),
    delete: () => ({ eq: () => mockQueryBuilder }),
    then: (resolve: any) => Promise.resolve({ data: [], error: null }),
  }

  return {
    from: () => mockQueryBuilder,
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ 
        data: { user: { id: 'mock-user' }, session: {} }, 
        error: null 
      }),
      signUp: async () => ({ 
        data: { user: { id: 'mock-user' }, session: {} }, 
        error: null 
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      }),
    },
  } as any
}

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Check for mock mode
  const isMockMode = !supabaseUrl || 
                    !supabaseAnonKey || 
                    supabaseUrl === 'mock' || 
                    supabaseAnonKey === 'mock' ||
                    !supabaseUrl.startsWith('http')

  if (isMockMode) {
    return createMockSupabaseClient()
  }

  // Return real Supabase client with proper error handling
  try {
    return createBrowserClientSSR(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return createMockSupabaseClient()
  }
}
