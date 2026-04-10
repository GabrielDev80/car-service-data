import { check, validationResult } from "express-validator";
import getLogger from "../../utils/logger.utils.js";

const log = getLogger();

export const validateLoginFields = [
  check("email")
    .notEmpty()
    .withMessage("El campo Email es obligatorio.")
    .isEmail()
    .withMessage("El Email es inválido.")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("El campo Password es obligatorio.")
    .isString()
    .withMessage("El Password debe ser un string.")
    .isLength({ min: 8 })
    .withMessage("El Password debe tener una longitud minima de 8 characters.")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    .withMessage(
      "El Password debe contener al menos una letra mayúscula, una letra minúscula, y un número.",
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log.error("user.validations - Validation error: ", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // If no errors, proceed to the next middleware
    next();
  },
];
