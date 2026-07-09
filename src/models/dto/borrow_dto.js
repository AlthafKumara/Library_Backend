/**
 * Format a single Borrow row into a clean API response.
 * Expects the row to be queried with:
 *   .select('*, book(id, title, author), profiles(id, name)')
 */
export const formatBorrowResponse = (borrow) => ({
  id: borrow.id,
  userId: borrow.user_id,
  dueDate: borrow.due_date,
  borrowDate: borrow.borrow_date,
  actualReturnDate: borrow.actual_return_date,
  status: borrow.status,
  isReviewed: borrow.is_reviewed,
  qrText: borrow.qr_text,
  createdAt: borrow.created_at,
  updatedAt: borrow.updated_at,
  // Enriched joins — supports QR scan detail view on web and mobile
  book: borrow.book
    ? { id: borrow.book.id, title: borrow.book.title, author: borrow.book.author }
    : null,
  user: borrow.profiles
    ? { id: borrow.profiles.id, name: borrow.profiles.name }
    : null,
});
