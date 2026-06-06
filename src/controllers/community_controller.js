import { supabase } from '../config/db.js';
import { formatMessageResponse, formatMessageListResponse } from '../models/dto/community_dto.js';
import { COMMUNITY } from '../constants/db_constant.js';

// ==========================================
// 1. CREATE MESSAGE
// ==========================================
export const createMessage = async (req, res) => {
  try {
    const { message_text, parent_id, book_id } = req.body;
    const userId = req.user.id;

    // Optional: Validate parent_id references a real message
    if (parent_id) {
      const { data: parentData, error: parentError } = await supabase
        .from(COMMUNITY)
        .select('id')
        .eq('id', parent_id)
        .single();

      if (parentError || !parentData) {
        return res.status(404).json({
          status: 'error',
          message: 'Pesan induk tidak ditemukan.',
        });
      }
    }

    const { data, error } = await supabase
      .from(COMMUNITY)
      .insert({
        user_id: userId,
        parent_id: parent_id || null,
        book_id: book_id || null,
        message_text
      })
      .select('*, profiles(id, name)')
      .single();

    if (error) throw error;

    return res.status(201).json({
      status: 'success',
      message: 'Pesan berhasil dibuat.',
      data: formatMessageResponse(data),
    });

  } catch (error) {
    console.error('[createMessage Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 2. READ ALL MESSAGES (Top-Level)
// ==========================================
export const getAllMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : Number.MAX_SAFE_INTEGER;

    const { data, error } = await supabase
      .from(COMMUNITY)
      .select('*, profiles(id, name), replies:community!parent_id(count)')
      .is('parent_id', null)
      .lt('id', cursor)
      .order('id', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    return res.status(200).json({
      status: 'success',
      data: data.map(formatMessageListResponse),
      next_cursor: nextCursor
    });

  } catch (error) {
    console.error('[getAllMessages Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 3. READ DETAIL MESSAGE + REPLIES
// ==========================================
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : Number.MAX_SAFE_INTEGER;

    // Step 1: Fetch parent message
    const { data: parentData, error: parentError } = await supabase
      .from(COMMUNITY)
      .select('*, profiles(id, name)')
      .eq('id', id)
      .single();

    if (parentError) {
      if (parentError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Pesan tidak ditemukan.',
        });
      }
      throw parentError;
    }

    // Step 2: Fetch replies with cursor
    const { data: repliesData, error: repliesError } = await supabase
      .from(COMMUNITY)
      .select('*, profiles(id, name)')
      .eq('parent_id', id)
      .lt('id', cursor)
      .order('id', { ascending: false })
      .limit(limit);

    if (repliesError) throw repliesError;

    const nextCursor = repliesData.length > 0 ? repliesData[repliesData.length - 1].id : null;

    return res.status(200).json({
      status: 'success',
      message: 'Pesan berhasil ditemukan.',
      data: {
        parent: formatMessageResponse(parentData),
        replies: repliesData.map(formatMessageResponse),
        next_cursor: nextCursor
      }
    });

  } catch (error) {
    console.error('[getMessageById Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 4. UPDATE MESSAGE
// ==========================================
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message_text } = req.body;
    const userId = req.user.id;

    // Fetch existing
    const { data: existing, error: findError } = await supabase
      .from(COMMUNITY)
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Pesan tidak ditemukan.',
        });
      }
      throw findError;
    }

    if (existing.user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Anda tidak memiliki izin.',
      });
    }

    const { data, error } = await supabase
      .from(COMMUNITY)
      .update({
        message_text,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, profiles(id, name)')
      .single();

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Pesan berhasil diperbarui.',
      data: formatMessageResponse(data),
    });

  } catch (error) {
    console.error('[updateMessage Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 5. DELETE MESSAGE
// ==========================================
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Fetch existing
    const { data: existing, error: findError } = await supabase
      .from(COMMUNITY)
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Pesan tidak ditemukan.',
        });
      }
      throw findError;
    }

    if (existing.user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Anda tidak memiliki izin.',
      });
    }

    const { error } = await supabase
      .from(COMMUNITY)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Pesan berhasil dihapus.',
    });

  } catch (error) {
    console.error('[deleteMessage Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};
