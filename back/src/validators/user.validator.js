import { z } from "zod";

export const registerSchema = z.object({
  first_name: z
    .string({ required_error: "Le prénom est obligatoire." })
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères."),
  last_name: z
    .string({ required_error: "Le nom est obligatoire." })
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom ne doit pas dépasser 50 caractères."),
  email: z
    .string({ required_error: "L'email est obligatoire." })
    .email("L'email n'est pas valide."),
  password: z
    .string({ required_error: "Le mot de passe est obligatoire." })
    .min(6, "Le mot de passe doit contenir au moins 6 caractères.")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères."),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire." })
    .email("L'email n'est pas valide."),
  password: z
    .string({ required_error: "Le mot de passe est obligatoire." }),
});

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères.")
    .optional(),
  last_name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom ne doit pas dépasser 50 caractères.")
    .optional(),
  email: z
    .string()
    .email("L'email n'est pas valide.")
    .optional(),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères.")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères.")
    .optional(),
});
