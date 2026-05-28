
export const formValidate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err.errors || err.issues) {
      const zodErrors = err.errors || err.issues;
      return res.status(400).json({
        status: 'error',
        message: 'Validasi input Auth gagal',
        errors: zodErrors.map(e => ({ path: e.path.join('.'), message: e.message })),
      });
    }

    return res.status(400).json({
      status: 'error',
      message: 'Kesalahan pada sistem validasi',
      error: err.message,
    });
  }

};