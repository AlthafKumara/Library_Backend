/**
 * Format a single SavedList row into a clean API response.
 * Expects the row to be queried with:
 *   .select('*, book(id, title, author)')
 */
export const formatSavedListResponse = (savedList) => ({
  id: savedList.id,
  userId: savedList.user_id,
  bookId: savedList.book_id,
  listName: savedList.list_name,
  createdAt: savedList.created_at,
  updatedAt: savedList.updated_at,
  book: savedList.book
    ? { id: savedList.book.id, title: savedList.book.title, author: savedList.book.author }
    : null,
});
