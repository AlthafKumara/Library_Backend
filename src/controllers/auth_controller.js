import { supabase } from '../config/db.js';
import { NODE_ENV } from '../config/env.js';
import { formatAuthResponse } from "../models/dto/auth_dto.js" ;



// ==========================================
// 1. REGISTER USER CONTROLLER
// ==========================================
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Memanggil Supabase Auth SignUp
    const { data, error } = await supabase.auth.signUp({
      email,
      password,  
    });

    if (error) throw error;

    if (!data.session) {
      return res.status(201).json({
        status: 'success',
        message: 'Registrasi berhasil. Silakan cek email Anda untuk konfirmasi.',
        data: { userId: data.user.id }
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: formatAuthResponse(data.session, data.user)
    });

  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message });
  }
};

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: formatAuthResponse(data.session, data.user)
    });

  } catch (error) {
    return res.status(401).json({ status: 'error', message: error.message });
  }
};

// ==========================================
// 3. LOGOUT CONTROLLER
// ==========================================
export const logout = async (req, res) => {
  try {
    // Pada backend Node.js, klien harus mengirimkan token melalui Header Authorization [cite: 26, 27]
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Token tidak ditemukan di Header' });
    }

    const token = authHeader.split(' ')[1];
    const { error: userError } = await supabase.auth.getUser(token);
    if (userError) throw userError;

    // Mengeksekusi Sign Out di sisi Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Logout tidak memiliki respons data [cite: 17]
    return res.status(200).json({
      status: 'success',
      message: 'Logout berhasil'
    });

  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==========================================
// 4. REFRESH TOKEN CONTROLLER
// ==========================================

export const refreshToken = async (req, res) => {
  try {
    // 1. Ekstrak refresh token dari HTTP-Only Cookie
    // Catatan: Pastikan Anda sudah menginstall dan menggunakan middleware 'cookie-parser' di app.js
    const currentRefreshToken = req.cookies.refreshToken;

    if (!currentRefreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token tidak ditemukan di cookie, silakan login kembali.'
      });
    }

    // 2. Minta Supabase untuk memperbarui sesi berdasarkan refresh token
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: currentRefreshToken
    });

    if (error || !data.session) {
      res.clearCookie('refreshToken');
      return res.status(403).json({
        status: 'error',
        message: 'Sesi telah kedaluwarsa atau tidak valid, silakan login kembali.'
      });
    }

    // 3. Set refresh token YANG BARU ke dalam HTTP-Only Cookie
    res.cookie('refreshToken', data.session.refresh_token, {
      httpOnly: true, 
      secure: NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.status(200).json({
      status: 'success',
      message: 'Sesi berhasil diperbarui',
      data: {
        accessToken: data.session.access_token,
        user: {
          userId: data.user.id,
          name: data.user.user_metadata?.name, 
          email: data.user.email
        }
      }
    });

  } catch (error) {
    console.error('Error in refreshToken controller:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server saat mencoba memperbarui sesi.'
    });
  }
}