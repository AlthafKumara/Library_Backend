// ==========================================
// FORMAT MESSAGE RESPONSE (single & list)
// Both formatMessageResponse and formatMessageListResponse
// previously duplicated 90% of the same code (DRY violation).
// Consolidated into one function with an optional flag.
// ==========================================

const buildBase = (message) => ({
  id: message.id,
  userId: message.user_id,
  parentId: message.parent_id,
  bookId: message.book_id,
  messageText: message.message_text,
  createdAt: message.created_at,
  updatedAt: message.updated_at,
  user: message.profiles
    ? { id: message.profiles.id, name: message.profiles.name }
    : null,
});

// Used for single-message responses (detail, create, update)
export const formatMessageResponse = (message) => {
  if (!message) return null;
  return buildBase(message);
};

// Used for list responses — includes repliesCount aggregation
export const formatMessageListResponse = (message) => {
  if (!message) return null;
  return {
    ...buildBase(message),
    repliesCount: message.replies?.[0]?.count ?? 0,
  };
};
