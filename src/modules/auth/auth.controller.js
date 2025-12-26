import { loginAdmin } from "./auth.service.js";
import Admin from "./auth.model.js";

export const login = async (req, res, next) => {
  try {
    const result = await loginAdmin(req.body);
    res.json(result);
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};
export const getAllUsers = async (req, res) => {
  const users = await Admin.find().select("-password");
  res.json(users);
};