import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'staging', 'development']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DB_BASE_URL: z.string().url('Supabase URL Tidak Valid'),
  DB_PUBLIC_KEY: z.string().min(1, 'Supabase Public Key Wajib diisi'),
  DB_SERVICE_KEY: z.string().min(1, 'Supabase Service Key Wajib diisi'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET minimal 32 karakter'),
  JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, 'Format: 60s / 15m / 2h / 7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET minimal 32 karakter'),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, 'Format: 60s / 15m / 2h / 7d').default('30d'),

  BCRYPT_ROUNDS: z.coerce.number().min(8).max(14).default(12),

  SUPABASE_STORAGE_BUCKET: z.string().min(1, 'Nama Bucket Wajib diisi'),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().max(50).default(5),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,application/pdf'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Env Validation Failed:');
  parsed.error.issues.forEach((issue) => {
    console.error(`  [${issue.path.join('.')}] ${issue.message}`);
  });
  console.error('\n');
  process.exit(1);
}

const env = parsed.data;

env.allowedFileTypesArray = env.ALLOWED_FILE_TYPES.split(',').map((t) => t.trim());

export const {
  NODE_ENV,
  PORT,
  DB_BASE_URL,
  DB_PUBLIC_KEY,
  DB_SERVICE_KEY,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  BCRYPT_ROUNDS,
  SUPABASE_STORAGE_BUCKET,
  MAX_FILE_SIZE_MB,
  ALLOWED_FILE_TYPES,
  allowedFileTypesArray,
} = env;

export default env;
