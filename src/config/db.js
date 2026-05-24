import { createClient } from '@supabase/supabase-js';
import { DB_BASE_URL, DB_PUBLIC_KEY, DB_SERVICE_KEY } from './env';

const supabase = createClient(
  DB_BASE_URL,
  DB_PUBLIC_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

const supabaseAdmin = createClient(
  DB_BASE_URL,
  DB_SERVICE_KEY,
  {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
    },
  }
);

export default { supabase, supabaseAdmin };