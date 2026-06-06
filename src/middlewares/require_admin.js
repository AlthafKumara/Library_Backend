import { supabase } from '../config/db.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || profile?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat mengakses endpoint ini.',
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
