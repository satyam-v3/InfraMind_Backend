import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "./auth.model.js";
import { env } from "../../config/env.js";

export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;

    // const hashed = await bcrypt.hash(password, 10)
    // const admin = Admin.create({ email, password: hashed })
    // const token = jwt.sign({ id: admin._id, email: admin.email }, env.JWT_SECRET, { expiresIn: '1d' })
    // return token
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};
