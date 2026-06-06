import { z } from 'zod';

// ==========================================
// 1. CREATE SAVED LIST SCHEMA
// ==========================================
export const createSavedListSchema = z.object({
  body: z.object({
    list_name: z.string({ required_error: 'Nama List diperlukan' }).min(1, 'Nama List tidak boleh kosong'),
    book_id: z.coerce.number().int({ message: 'ID Buku harus berupa bilangan bulat' }),
  }),
});

// ==========================================
// 2. GET/DELETE SAVED LIST BY ID SCHEMA
// ==========================================
export const savedListByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int({ message: 'ID Saved List harus berupa bilangan bulat' })
  }),
});

// ==========================================
// 3. UPDATE SAVED LIST SCHEMA
// ==========================================
export const updateSavedListSchema = z.object({
  params: z.object({
    id: z.coerce.number().int({ message: 'ID Saved List harus berupa bilangan bulat' })
  }),
  body: z.object({
    list_name: z.string({ required_error: 'Nama List diperlukan' }).min(1, 'Nama List tidak boleh kosong'),
  }),
});
