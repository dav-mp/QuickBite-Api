import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  SUPABASE_URL: get('SUPABASE_URL').required().asString(),
  SUPABASE_ANON_KEY: get('SUPABASE_ANON_KEY').required().asString(),
  // Si también necesitas el SEED para JWT
  SEED: get('SEED').default('YOUR_DEFAULT_SEED').asString(),
};
