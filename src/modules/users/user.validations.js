import { check, validationResult } from "express-validator";
import getLogger from "../../utils/logger.utils.js";

const log = getLogger();

export const validateUsersFields = [
  check("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string"),
  check("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string"),
  check("nickname")
    .notEmpty()
    .withMessage("Nickname is required")
    .isString()
    .withMessage("Nickname must be a string")
    .isLength({ min: 3 })
    .withMessage("Nickname must be at least 3 characters long"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
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
