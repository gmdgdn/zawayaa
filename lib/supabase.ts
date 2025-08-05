/**
 * Mock Supabase Client for Zawaya Platform
 * TODO: Install @supabase/supabase-js and implement real client
 */

// Mock Supabase client for development
export const createClient = () => {
  console.warn('Supabase client is mocked. Install @supabase/supabase-js for real functionality.')
  
  return {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ data: null, error: null }),
      getUser: () => Promise.resolve({ data: null, error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
      }),
    },
  }
}

// Default client instance
export const supabase = createClient()

// Export for backward compatibility
export default supabase