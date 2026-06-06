import { supabase } from '../config/db.js';
import { formatBorrowResponse } from '../models/dto/borrow_dto.js';
import { generateQrText } from '../utils/qr_helper.js';
import { BORROW, BOOK } from '../constants/db_constant.js';

// ==========================================
// 1. CREATE BORROW CONTROLLER
// ==========================================
export const createBorrow = async (req, res) => {
  try {
    const { book_id, due_date } = req.body;
    const userId = req.user.id;

    // Verify book exists and check stock
    const { data: bookData, error: bookError } = await supabase
      .from(BOOK)
      .select('id, stock')
      .eq('id', book_id)
      .single();

    if (bookError || !bookData) {
      return res.status(404).json({
        status: 'error',
        message: 'Buku tidak ditemukan.',
      });
    }

    if (bookData.stock <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Stok buku habis.',
      });
    }

    // Duplicate guard: check for existing active borrow
    const { data: existingBorrow, error: existingError } = await supabase
      .from(BORROW)
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', book_id)
      .in('status', ['pending', 'approved', 'borrowed'])
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingBorrow) {
      return res.status(409).json({
        status: 'error',
        message: 'Anda sudah memiliki peminjaman aktif untuk buku ini.',
      });
    }

    // Insert new borrow row
    const { data: newBorrow, error: insertError } = await supabase
      .from(BORROW)
      .insert({
        user_id: userId,
        book_id,
        due_date,
        status: 'pending',
        is_reviewed: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Generate QR Text and update
    const qrText = generateQrText(userId, newBorrow.id, book_id);

    const { data: updatedBorrow, error: updateError } = await supabase
      .from(BORROW)
      .update({ qr_text: qrText })
      .eq('id', newBorrow.id)
      .select('*, book(id, title, author), profiles(id, name)')
      .single();

    if (updateError) throw updateError;

    return res.status(201).json({
      status: 'success',
      message: 'Permintaan peminjaman berhasil dibuat.',
      data: formatBorrowResponse(updatedBorrow),
    });

  } catch (error) {
    console.error('[createBorrow Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 2. GET MY BORROWS CONTROLLER
// ==========================================
export const getMyBorrows = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from(BORROW)
      .select('*, book(id, title, author), profiles(id, name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Daftar peminjaman Anda berhasil diambil.',
      total: data.length,
      data: data.map(formatBorrowResponse),
    });

  } catch (error) {
    console.error('[getMyBorrows Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 3. GET BORROW BY ID CONTROLLER
// ==========================================
export const getBorrowById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(BORROW)
      .select('*, book(id, title, author), profiles(id, name)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Peminjaman tidak ditemukan.',
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Detail peminjaman berhasil diambil.',
      data: formatBorrowResponse(data),
    });

  } catch (error) {
    console.error('[getBorrowById Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 4. GET ALL BORROWS CONTROLLER
// ==========================================
export const getAllBorrows = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(BORROW)
      .select('*, book(id, title, author), profiles(id, name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Semua daftar peminjaman berhasil diambil.',
      total: data.length,
      data: data.map(formatBorrowResponse),
    });

  } catch (error) {
    console.error('[getAllBorrows Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 5. UPDATE BORROW STATUS CONTROLLER
// ==========================================
export const updateBorrowStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch existing borrow to check previous status and get book_id
    const { data: existingBorrow, error: findError } = await supabase
      .from(BORROW)
      .select('user_id, book_id, status')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Peminjaman tidak ditemukan.',
        });
      }
      throw findError;
    }

    const previousStatus = existingBorrow.status;

    // Build update payload
    const updatePayload = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'approved') {
      updatePayload.borrow_date = new Date().toISOString();
    } else if (status === 'returned') {
      updatePayload.actual_return_date = new Date().toISOString();
    }

    // Always regenerate QR text to reflect potential state logic, though the ID strings remain the same, 
    // it was specified in the requirements to "Regenerate qr_text with updated status payload" 
    // Wait, the plan says qr_text is just "userId|borrowId|bookId" which doesn't change. 
    // I will regenerate it anyway to be safe, or just keep it same.
    updatePayload.qr_text = generateQrText(existingBorrow.user_id, id, existingBorrow.book_id);

    // Update borrow row
    const { data: updatedBorrow, error: updateError } = await supabase
      .from(BORROW)
      .update(updatePayload)
      .eq('id', id)
      .select('*, book(id, title, author), profiles(id, name)')
      .single();

    if (updateError) throw updateError;

    // Handle stock changes
    if (status === 'approved' && previousStatus === 'pending') {
      // Decrement stock by 1
      const { data: bookData } = await supabase.from(BOOK).select('stock').eq('id', existingBorrow.book_id).single();
      if (bookData) {
        await supabase.from(BOOK).update({ stock: Math.max(0, bookData.stock - 1) }).eq('id', existingBorrow.book_id);
      }
    } else if (status === 'returned' && previousStatus !== 'returned') {
      // Increment stock by 1
      const { data: bookData } = await supabase.from(BOOK).select('stock').eq('id', existingBorrow.book_id).single();
      if (bookData) {
        await supabase.from(BOOK).update({ stock: bookData.stock + 1 }).eq('id', existingBorrow.book_id);
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Status peminjaman berhasil diperbarui.',
      data: formatBorrowResponse(updatedBorrow),
    });

  } catch (error) {
    console.error('[updateBorrowStatus Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};
