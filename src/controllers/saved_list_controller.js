import { supabase } from '../config/db.js';
import { formatSavedListResponse } from '../models/dto/saved_list_dto.js';
import { SAVED_LIST_BOOKS, BOOK } from '../constants/db_constant.js';

// ==========================================
// 1. CREATE SAVED LIST CONTROLLER
// ==========================================
export const createSavedList = async (req, res) => {
  try {
    const { list_name, book_id } = req.body;
    const userId = req.user.id;

    // Verify book exists
    const { data: bookData, error: bookError } = await supabase
      .from(BOOK)
      .select('id')
      .eq('id', book_id)
      .single();

    if (bookError || !bookData) {
      return res.status(404).json({
        status: 'error',
        message: 'Buku tidak ditemukan.',
      });
    }

    // Duplicate guard: check if book is already in user's saved list
    const { data: existingSaved, error: existingError } = await supabase
      .from(SAVED_LIST_BOOKS)
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', book_id)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingSaved) {
      return res.status(409).json({
        status: 'error',
        message: 'Buku ini sudah ada di saved list Anda.',
      });
    }

    // Insert new saved list row
    const { data: newSavedList, error: insertError } = await supabase
      .from(SAVED_LIST_BOOKS)
      .insert({
        user_id: userId,
        book_id,
        list_name,
      })
      .select('*, book(id, title, author)')
      .single();

    if (insertError) throw insertError;

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan ke saved list.',
      data: formatSavedListResponse(newSavedList),
    });

  } catch (error) {
    console.error('[createSavedList Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 2. GET MY SAVED LISTS CONTROLLER
// ==========================================
export const getMySavedLists = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from(SAVED_LIST_BOOKS)
      .select('*, book(id, title, author)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Daftar saved list Anda berhasil diambil.',
      total: data.length,
      data: data.map(formatSavedListResponse),
    });

  } catch (error) {
    console.error('[getMySavedLists Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 3. UPDATE SAVED LIST CONTROLLER
// ==========================================
export const updateSavedList = async (req, res) => {
  try {
    const { id } = req.params;
    const { list_name } = req.body;
    const userId = req.user.id;

    // Fetch existing saved list to verify ownership
    const { data: existingSavedList, error: findError } = await supabase
      .from(SAVED_LIST_BOOKS)
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Saved list tidak ditemukan.',
        });
      }
      throw findError;
    }

    if (existingSavedList.user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Anda bukan pemilik saved list ini.',
      });
    }

    // Build update payload
    const updatePayload = {
      list_name,
      updated_at: new Date().toISOString(),
    };

    // Update row
    const { data: updatedSavedList, error: updateError } = await supabase
      .from(SAVED_LIST_BOOKS)
      .update(updatePayload)
      .eq('id', id)
      .select('*, book(id, title, author)')
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      status: 'success',
      message: 'Saved list berhasil diperbarui.',
      data: formatSavedListResponse(updatedSavedList),
    });

  } catch (error) {
    console.error('[updateSavedList Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 4. DELETE SAVED LIST CONTROLLER
// ==========================================
export const deleteSavedList = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Fetch existing saved list to verify ownership
    const { data: existingSavedList, error: findError } = await supabase
      .from(SAVED_LIST_BOOKS)
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Saved list tidak ditemukan.',
        });
      }
      throw findError;
    }

    if (existingSavedList.user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Anda bukan pemilik saved list ini.',
      });
    }

    const { error: deleteError } = await supabase
      .from(SAVED_LIST_BOOKS)
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return res.status(200).json({
      status: 'success',
      message: 'Saved list berhasil dihapus.',
    });

  } catch (error) {
    console.error('[deleteSavedList Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};
