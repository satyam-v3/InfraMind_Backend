import { generatePredictions } from "./prediction.service.js";

export const getPredictions = async (req, res, next) => {
  try {
    const predictions = await generatePredictions();
    res.json(predictions);
  } catch (err) {
    next(err);
  }
};
