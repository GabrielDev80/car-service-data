import jwt from "jsonwebtoken";
import config from "../config/config.js";

const secretKey = config.jwt.secret;
const expirationTime = config.jwt.expire;

// Generar un token
export const generateToken = (payload, expiresIn = expirationTime) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

// Verificar un token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    } else {
      throw new Error("Error al verificar token");
    }
  }
};
