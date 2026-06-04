import { supabase, supabaseAdmin } from '../config/db.js';
import { formatBookResponse, formatCategoryResponse } from '../models/dto/book_dto.js';
import { BOOK, BOOK_CATEGORY, COVER_BOOK_BUCKET } from '../constants/db_constant.js';

// ==========================================
// 1. ADD NEW BOOK CONTROLLER
// ==========================================
export const addBook = async (req, res) => {
  try {
    const { title, author, description, stock, cover_url, category_id } = req.body;

    // Check if category_id exists before inserting
    if (category_id) {
      const { data: categoryData, error: categoryError } = await supabase
        .from(BOOK_CATEGORY)
        .select('id')
        .eq('id', category_id)
        .single();

      if (categoryError || !categoryData) {
        return res.status(404).json({
          status: 'error',
          message: `Nothing Category Data on ID ${category_id}`,
        });
      }
    }

    const { data, error } = await supabase
      .from(BOOK)
      .insert({
        title,
        author: author || 'Anonym',
        description: description || 'Admin Not Added Description',
        stock,
        cover_url: cover_url || null,
        category: category_id || null,
      })
      .select('*, book_category(id, category_name)')
      .single();

    if (error) throw error;

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan.',
      data: formatBookResponse(data),
    });

  } catch (error) {
    console.error('[addBook Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 2. GET ALL BOOKS CONTROLLER
// ==========================================
export const getAllBooks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(BOOK)
      .select('*, book_category(id, category_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Daftar buku berhasil diambil.',
      total: data.length,
      data: data.map(formatBookResponse),
    });

  } catch (error) {
    console.error('[getAllBooks Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 3. GET BOOK BY ID CONTROLLER
// ==========================================
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(BOOK)
      .select('*, book_category(id, category_name)')
      .eq('id', id)
      .single();

    if (error) {
      // PGRST116 = row not found in PostgREST
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Buku dengan ID tersebut tidak ditemukan.',
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil ditemukan.',
      data: formatBookResponse(data),
    });

  } catch (error) {
    console.error('[getBookById Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 4. UPDATE BOOK CONTROLLER
// ==========================================
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, stock, cover_url, category_id } = req.body;

    // Check if category_id exists before updating
    if (category_id) {
      const { data: categoryData, error: categoryError } = await supabase
        .from(BOOK_CATEGORY)
        .select('id')
        .eq('id', category_id)
        .single();

      if (categoryError || !categoryData) {
        return res.status(404).json({
          status: 'error',
          message: `Nothing Category Data on ID ${category_id}`,
        });
      }
    }

    const { data, error } = await supabase
      .from(BOOK)
      .update({
        title,
        author: author || 'Anonym',
        description: description || 'Admin Not Added Description',
        stock,
        cover_url: cover_url || null,
        category: category_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, book_category(id, category_name)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Buku dengan ID tersebut tidak ditemukan.',
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui.',
      data: formatBookResponse(data),
    });

  } catch (error) {
    console.error('[updateBook Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 5. DELETE BOOK CONTROLLER
// ==========================================
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from(BOOK)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus.',
    });

  } catch (error) {
    console.error('[deleteBook Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 6. UPLOAD COVER BOOK CONTROLLER
// ==========================================
export const uploadCoverBook = async (req, res) => {
  try {
    // 1. Auth guard
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Pengguna tidak terautentikasi.',
      });
    }

    // 2. File guard — ensure multer processed the file
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'File cover tidak ditemukan. Pastikan field bernama "cover".',
      });
    }

    const { id: bookId } = req.params;

    // 3. Check that the book exists first
    const { data: existingBook, error: findError } = await supabase
      .from(BOOK)
      .select('id')
      .eq('id', bookId)
      .single();

    if (findError || !existingBook) {
      return res.status(404).json({
        status: 'error',
        message: 'Buku dengan ID tersebut tidak ditemukan.',
      });
    }

    // 4. Build storage path: {bookId}/cover.{ext}
    const ext = req.file.mimetype.split('/')[1]; // e.g. "jpeg", "png", "webp"
    const storagePath = `${bookId}/cover.${ext}`;

    // 5. Upload buffer to Supabase Storage (using service-role key to bypass RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from(COVER_BOOK_BUCKET)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true, // overwrite existing file if same path
      });

    if (uploadError) throw uploadError;

    // 6. Get the public URL of the uploaded file
    const { data: urlData } = supabaseAdmin.storage
      .from(COVER_BOOK_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 7. Update the book row with the new cover URL
    const { data, error: updateError } = await supabase
      .from(BOOK)
      .update({
        cover_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookId)
      .select('*, book_category(id, category_name)')
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      status: 'success',
      message: 'Cover buku berhasil diupload.',
      data: formatBookResponse(data),
    });

  } catch (error) {
    console.error('[uploadCoverBook Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 7. ADD NEW CATEGORY CONTROLLER
// ==========================================
export const addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    const { data, error } = await supabase
      .from(BOOK_CATEGORY)
      .insert({ category_name })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      status: 'success',
      message: 'Kategori berhasil ditambahkan.',
      data: formatCategoryResponse(data),
    });

  } catch (error) {
    console.error('[addCategory Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 8. GET ALL CATEGORIES CONTROLLER
// ==========================================
export const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(BOOK_CATEGORY)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Daftar kategori berhasil diambil.',
      total: data.length,
      data: data.map(formatCategoryResponse),
    });

  } catch (error) {
    console.error('[getAllCategories Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 9. GET CATEGORY BY ID CONTROLLER
// ==========================================
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(BOOK_CATEGORY)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // PGRST116 = row not found in PostgREST
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Kategori dengan ID tersebut tidak ditemukan.',
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil ditemukan.',
      data: formatCategoryResponse(data),
    });

  } catch (error) {
    console.error('[getCategoryById Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 10. UPDATE CATEGORY CONTROLLER
// ==========================================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    const { data, error } = await supabase
      .from(BOOK_CATEGORY)
      .update({ category_name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Row not found
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Kategori dengan ID tersebut tidak ditemukan.',
        });
      }
      // Unique constraint — category_name already exists
      if (error.code === '23505') {
        return res.status(409).json({
          status: 'error',
          message: `Nama kategori "${category_name}" sudah digunakan.`,
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil diperbarui.',
      data: formatCategoryResponse(data),
    });

  } catch (error) {
    console.error('[updateCategory Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 11. DELETE CATEGORY CONTROLLER
// ==========================================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify category exists before deleting
    const { data: existing, error: findError } = await supabase
      .from(BOOK_CATEGORY)
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori dengan ID tersebut tidak ditemukan.',
      });
    }

    const { error } = await supabase
      .from(BOOK_CATEGORY)
      .delete()
      .eq('id', id);

    if (error) {
      // FK violation — books are still referencing this category
      if (error.code === '23503') {
        return res.status(409).json({
          status: 'error',
          message: 'Kategori tidak dapat dihapus karena masih digunakan oleh buku.',
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil dihapus.',
    });

  } catch (error) {
    console.error('[deleteCategory Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};
