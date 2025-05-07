
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Use the direct URL and key from the generated client file
import { supabase as generatedClient } from '../integrations/supabase/client';

// Export the supabase client from the generated file
export const supabase = generatedClient;

export type { Database };
