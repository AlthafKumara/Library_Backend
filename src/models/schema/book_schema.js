import { z } from 'zod';

// ==========================================
// 1. ADD BOOK SCHEMA
// ==========================================
export const addBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Judul buku wajib diisi' }),
    author: z.string().optional(),
    description: z.string().optional(),
    stock: z
      .number({ invalid_type_error: 'Stok harus berupa angka' })
      .int({ message: 'Stok harus berupa bilangan bulat' })
      .min(0, { message: 'Stok tidak boleh negatif' }),
    cover_url: z
      .string()
      .url({ message: 'Format URL cover tidak valid' })
      .optional()
      .nullable(),
    category_id: z
      .coerce.number().int()
      .optional()
      .nullable(),
  }),
});

// ==========================================
// 2. UPDATE BOOK SCHEMA
// ==========================================
export const updateBookSchema = z.object({
  params: z.object({
    id: z.coerce.number().int()
  }),
  body: z.object({
    title: z.string().min(1, { message: 'Judul buku wajib diisi' }),
    author: z.string().optional(),
    description: z.string().optional(),
    stock: z
      .number({ invalid_type_error: 'Stok harus berupa angka' })
      .int({ message: 'Stok harus berupa bilangan bulat' })
      .min(0, { message: 'Stok tidak boleh negatif' }),
    cover_url: z
      .string()
      .url({ message: 'Format URL cover tidak valid' })
      .optional()
      .nullable(),
    category_id: z
      .coerce.number().int()
      .optional()
      .nullable(),
  }),
});

// ==========================================
// 3. GET BOOK BY ID SCHEMA
// ==========================================
export const getBookByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int()
  }),
});

// ==========================================
// 4. ADD CATEGORY SCHEMA
// ==========================================
export const addCategorySchema = z.object({
  body: z.object({
    category_name: z.string().min(1, { message: 'Nama kategori wajib diisi' }),
  }),
});

// ==========================================
// 5. GET CATEGORY BY ID SCHEMA
// ==========================================
export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int("ID Harus Bilangan Bulat")
  }),
});

// ==========================================
// 6. UPDATE CATEGORY SCHEMA
// ==========================================
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number().int('ID Harus Bilangan Bulat'),
  }),
  body: z.object({
    category_name: z.string().min(1, { message: 'Nama kategori wajib diisi' }),
  }),
});

// ==========================================
// 7. DELETE CATEGORY SCHEMA
// ==========================================
export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number().int('ID Harus Bilangan Bulat'),
  }),
});
