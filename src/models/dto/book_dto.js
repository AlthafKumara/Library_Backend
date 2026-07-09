/**
 * Format a single Book row (with optional joined book_category) into a clean API response.
 * @param {Object} book - Raw row from the `book` table
 */
export const formatBookResponse = (book) => ({
  id: book.id,
  title: book.title,
  author: book.author || 'Anonym',
  description: book.description || 'Admin Not Added Description',
  stock: book.stock,
  coverUrl: book.cover_url || null,
  category: book.book_category
    ? { id: book.book_category.id, name: book.book_category.category_name }
    : null,
  createdAt: book.created_at,
  updatedAt: book.updated_at,
});

/**
 * Format a single Book Category row into a clean API response.
 * @param {Object} category - Raw row from the `book_category` table
 */
export const formatCategoryResponse = (category) => ({
  id: category.id,
  categoryName: category.category_name,
  createdAt: category.created_at,
});
