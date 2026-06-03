import { supabase } from '../config/db.js';

/**
 * Middleware untuk memverifikasi JWT Supabase dari Authorization Header
 * dan menyimpan data user ke req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.',
      });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid atau sudah kedaluwarsa. Silakan login kembali.',
      });
    }

    // Lampirkan data user ke request agar tersedia di controller
    req.user = data.user;
    next();

  } catch (error) {
    console.error('[authenticate Middleware Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memverifikasi autentikasi.',
    });
  }
};
