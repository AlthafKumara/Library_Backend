import multer from 'multer';
import { MAX_FILE_SIZE_MB, allowedFileTypesArray } from '../config/env.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (allowedFileTypesArray.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Tipe file tidak didukung. Gunakan: ${allowedFileTypesArray.join(', ')}`),
      false
    );
  }
};

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter,
}).single('photo_profile');
