import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import AppError from "../utils/apperror.util.js";
import catchAsync from "../utils/catchasync.util.js";
import { signToken } from "../utils/jwt.util.js";

export const index = catchAsync(async (req, res) => {
  const users = await User.find({}, "-password");
  return res.json(users);
});

export const show = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id, "-password");
  if (!user) throw new AppError("User not found.", 404);
  return res.json(user);
});

export const store = catchAsync(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already in use.", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });
});

export const update = catchAsync(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const payload = { first_name, last_name, email };

  if (password) {
    payload.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
    select: "-password",
  });

  if (!user) throw new AppError("User not found.", 404);
  return res.json(user);
});

export const destroy = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError("User not found.", 404);
  return res.status(204).send();
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Wrong credentials.", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Wrong credentials.", 401);

  const token = signToken({ sub: user._id, email: user.email });

  return res.json({
    token,
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
  });
});
