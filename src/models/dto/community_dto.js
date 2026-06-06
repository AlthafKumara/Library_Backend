// ==========================================
// 1. FORMAT SINGLE MESSAGE RESPONSE
// ==========================================
export const formatMessageResponse = (message) => {
  if (!message) return null;

  return {
    id: message.id,
    userId: message.user_id,
    parentId: message.parent_id,
    bookId: message.book_id,
    messageText: message.message_text,
    createdAt: message.created_at,
    updatedAt: message.updated_at,
    user: message.profiles ? {
      id: message.profiles.id,
      name: message.profiles.name
    } : null
  };
};

// ==========================================
// 2. FORMAT MESSAGE LIST RESPONSE
// ==========================================
export const formatMessageListResponse = (message) => {
  if (!message) return null;

  return {
    id: message.id,
    userId: message.user_id,
    parentId: message.parent_id,
    bookId: message.book_id,
    messageText: message.message_text,
    createdAt: message.created_at,
    updatedAt: message.updated_at,
    user: message.profiles ? {
      id: message.profiles.id,
      name: message.profiles.name
    } : null,
    repliesCount: message.replies && message.replies[0] ? message.replies[0].count : 0
  };
};
