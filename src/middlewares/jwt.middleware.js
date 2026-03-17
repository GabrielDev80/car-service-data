import getLogger from "../utils/logger.utils.js";
import { verifyToken } from "../utils/jwt.utils.js";

const log = getLogger();

export const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "Error", message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    req.userId = payload.id;
    next();
  } catch (error) {
    log.error("jwtAuth - invalid token", error.message);
    return res
      .status(401)
      .json({ status: "Error", message: "Invalid or expired token" });
  }
};
