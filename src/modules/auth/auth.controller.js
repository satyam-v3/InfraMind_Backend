import { loginAdmin } from "./auth.service.js";

export const login = async (req, res, next) => {
  try {
    const result = await loginAdmin(req.body);
    res.json(result);
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};
