import { supabase } from '../config/db.js';

const formatAuthResponse = (session, user) => {
  return {
    userId: user.id, 
    name: user.user_metadata?.name || 'Unknown', 
    accessToken: session.access_token, 
    refreshToken: session.refresh_token, 
  };
};

// ==========================================
// 1. REGISTER USER CONTROLLER
// ==========================================
export const registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Memanggil Supabase Auth SignUp
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      data : {
        role : "user",
      }
      
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

export const registerAdmin = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Memanggil Supabase Auth SignUp
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      data : {
        role : "Admin",
      }
      
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