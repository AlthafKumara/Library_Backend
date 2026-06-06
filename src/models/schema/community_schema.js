import { z } from 'zod';

// ==========================================
// 1. CREATE COMMUNITY MESSAGE SCHEMA
// ==========================================
export const createCommunitySchema = z.object({
  body: z.object({
    message_text: z.string().min(1, { message: 'Teks pesan wajib diisi' }),
    parent_id: z.coerce.number().int().optional().nullable(),
    book_id: z.coerce.number().int().optional().nullable(),
  }),
});

// ==========================================
// 2. GET ALL COMMUNITY MESSAGES SCHEMA
// ==========================================
export const getCommunityListSchema = z.object({
  query: z.object({
    cursor: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().max(50).optional().default(10),
  }),
});

// ==========================================
// 3. GET COMMUNITY MESSAGE BY ID SCHEMA
// ==========================================
export const getCommunityByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int('ID Harus Bilangan Bulat'),
  }),
  query: z.object({
    cursor: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().max(50).optional().default(10),
  }),
});

// ==========================================
// 4. UPDATE COMMUNITY MESSAGE SCHEMA
// ==========================================
export const updateCommunitySchema = z.object({
  params: z.object({
    id: z.coerce.number().int('ID Harus Bilangan Bulat'),
  }),
  body: z.object({
    message_text: z.string().min(1, { message: 'Teks pesan wajib diisi' }),
  }),
});

// ==========================================
// 5. DELETE COMMUNITY MESSAGE SCHEMA
// ==========================================
export const deleteCommunitySchema = z.object({
  params: z.object({
    id: z.coerce.number().int('ID Harus Bilangan Bulat'),
  }),
});
