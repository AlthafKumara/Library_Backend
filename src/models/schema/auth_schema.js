import { body } from "express-validator";
import {email, z} from "zod";

export const loginSchema = z.object({
    body: z.object({
        email : z.string().email("Email Tidak valid"),
        password : z.string().min(8, "Password Tidak Boleh Kurang dari 8 Karakter")
    })
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string()
  })
}).refine((data) => data.body.password === data.body.confirmPassword, {
  message: "Password dan Confirm Password tidak cocok",
  path: ["body", "confirmPassword"], 
});
