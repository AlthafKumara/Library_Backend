import { supabase, supabaseAdmin } from '../config/db.js';
import { formatProfileResponse } from '../models/dto/profile_dto.js';
import { PROFILE, PHOTO_PROFILE_BUCKET } from '../constants/db_constant.js';

// ==========================================
// 1. COMPLETE PROFILE CONTROLLER
// ==========================================
export const completeProfile = async (req, res) => {
  try {
    // Ambil user dari token JWT yang sudah diverifikasi middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Pengguna tidak terautentikasi.',
      });
    }

    const { name, photo_profile, gender } = req.body;
    const email = req.user?.email;

    // Upsert profil: buat baru jika belum ada, update jika sudah ada
    const { data, error } = await supabase
      .from(PROFILE)
      .upsert({
        id: userId,
        email,
        name,
        photo_profile: photo_profile || null,
        gender,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil pengguna tidak ditemukan.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Profil berhasil dilengkapi.',
      data: formatProfileResponse(data),
    });

  } catch (error) {
    console.error('[completeProfile Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};


// ==========================================
// 2. GET PROFILE BY ID CONTROLLER
// ==========================================
export const getProfileById = async (req, res) => {
  try {

    const { id: userId } = req.params;


    // Ambil profil berdasarkan ID dari tabel profiles
    const { data, error } = await supabase
      .from(PROFILE)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Kode PGRST116 = baris tidak ditemukan di PostgREST
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Profil dengan ID tersebut tidak ditemukan.',
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Profil berhasil ditemukan.',
      data: formatProfileResponse(data),
    });

  } catch (error) {
    console.error('[getProfileById Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 3. GET PROFILE LOGIN
// ==========================================

export const getProfileLogin = async (req, res) => {
  try {
    // Ambil user dari token JWT yang sudah diverifikasi middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Pengguna tidak terautentikasi.',
      });
    }

    // Ambil profil berdasarkan ID dari tabel profiles
    const { data, error } = await supabase
      .from(PROFILE)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Case Call Berhasil tetapi Baris tidak ada di database (User sudah daftar namun belum mengisi Profile)
      // Kode PGRST116 = baris tidak ditemukan di PostgREST Case
      if (error.code === 'PGRST116') {
        return res.status(200).json({
          status: 'success',
          message: 'User berhasil register tanpa data profile',
          data : null
        });
      } else {
        
          return res.status(404).json({  
          status: 'success',
          message: 'Profil pengguna yang sedang login tidak ditemukan.',
        });
      }
      
    }

    return res.status(200).json({
      status: 'success',
      message: 'Profil berhasil ditemukan.',
      data: formatProfileResponse(data),
    });

  } catch (error) {
    console.error('[getProfileLogin Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// ==========================================
// 4. UPLOAD PHOTO PROFILE CONTROLLER
// ==========================================
export const uploadPhotoProfile = async (req, res) => {
  try {
    // 1. Auth guard — userId dari token JWT
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Pengguna tidak terautentikasi.',
      });
    }

    // 2. File guard — memastikan multer berhasil memproses file
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'File foto tidak ditemukan. Pastikan field bernama "photo_profile".',
      });
    }

    // 3. Bangun path penyimpanan: {userId}/avatar.{ext}
    const ext = req.file.mimetype.split('/')[1]; // e.g. "jpeg", "png", "webp"
    const storagePath = `${userId}/avatar.${ext}`;

    // 4. Upload Buffer ke Supabase Storage (menggunakan service-role key agar melewati RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from(PHOTO_PROFILE_BUCKET)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true, // menimpa file lama jika path sama
      });

    if (uploadError) throw uploadError;

    // 5. Dapatkan URL publik dari file yang diupload
    const { data: urlData } = supabaseAdmin.storage
      .from(PHOTO_PROFILE_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 6. Update tabel profiles dengan URL foto baru
    const { data, error: updateError } = await supabase
      .from(PROFILE)
      .update({
        photo_profile: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil pengguna tidak ditemukan.',
      });
    }

    // 7. Kembalikan respons sukses dengan profil yang diformat
    return res.status(200).json({
      status: 'success',
      message: 'Foto profil berhasil diupload.',
      data: formatProfileResponse(data),
    });

  } catch (error) {
    console.error('[uploadPhotoProfile Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};




