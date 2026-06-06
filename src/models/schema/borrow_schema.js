import { z } from 'zod';

// ==========================================
// 1. CREATE BORROW SCHEMA
// ==========================================
export const createBorrowSchema = z.object({
  body: z.object({
    book_id: z.coerce.number().int({ message: 'ID Buku harus berupa bilangan bulat' }),
    due_date: z.string()
  .refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal due_date tidak valid',
  })
  .refine((date) => {
    const inputDate = new Date(date);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return inputDate > today; 
  }, {
    message: 'due_date tidak boleh hari ini atau hari yang sudah terlewat',
  }),
  }),
});

// ==========================================
// 2. GET BORROW BY ID SCHEMA
// ==========================================
export const getBorrowByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int({ message: 'ID Buku harus berupa bilangan bulat' })
  }),
});

// ==========================================
// 3. UPDATE BORROW STATUS SCHEMA
// ==========================================
export const updateBorrowStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int({ message: 'ID Buku harus berupa bilangan bulat' })
  }),
  body: z.object({
    status: z.enum(['pending', 'approved', 'borrowed', 'returned', 'overdue', 'lost'], {
      errorMap: () => ({ message: 'Status tidak valid' }),
    }),
  }),
});
