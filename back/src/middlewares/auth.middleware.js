import { verifyToken } from "../utils/jwt.util.js";
import AppError from "../utils/apperror.util.js";
import catchAsync from "../utils/catchasync.util.js";

const authMiddleware = catchAsync((req, res, next) => {
  const header = req.headers.authorization;
  let token = null;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) throw new AppError("Missing token.", 401);

  try {
    req.user = verifyToken(token);
  } catch (err) {
    throw new AppError("Invalid or expired token.", 401);
  }

  next();
});

export default authMiddleware;
