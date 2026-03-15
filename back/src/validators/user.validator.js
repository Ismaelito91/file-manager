import Joi from "joi";

const fields = {
  first_name: Joi.string().min(2).max(50),
  last_name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(100),
};

export const registerSchema = Joi.object(fields).options({
  presence: "required",
});

export const loginSchema = Joi.object({
  email: fields.email,
  password: Joi.string(),
}).options({ presence: "required" });

export const updateUserSchema = Joi.object(fields).min(1);
