import { body, param  } from "express-validator";
import {z} from "zod";

export const completeProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Nama wajib diisi" }),
    photo_profile: z.string().url({ message: "Format URL foto tidak valid" }).optional(),
    gender: z.enum(['Male', 'Female'], { required_error: "Gender wajib dipilih (Male/Female)" }),
  })
});

export const getProfileByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Format ID profil tidak valid (harus berupa UUID)" })
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Nama wajib diisi" }),
    photo_profile: z.string().url({ message: "Format URL foto tidak valid" }).optional(),
    gender: z.enum(['Male', 'Female'], { required_error: "Gender wajib dipilih (Male/Female)" }),
  })
});