import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "file_manager_jwt_secret";

export const signToken = (payload, options = { expiresIn: "1h" }) => {
  return jwt.sign(payload, SECRET, options);
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
