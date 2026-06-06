/**
 * Encodes borrow identifiers into a raw string for QR generation on the frontend.
 * Format: "userId|borrowId|bookId"
 */
export const generateQrText = (userId, borrowId, bookId) => {
  return `${userId}|${borrowId}|${bookId}`;
};
