import { check, validationResult } from "express-validator";
import getLogger from "../../utils/logger.utils.js";

const log = getLogger();

const validateVehicleFields = [
  check("make")
    .notEmpty()
    .withMessage("Make is required")
    .isString()
    .withMessage("Make must be a string"),
  check("model")
    .notEmpty()
    .withMessage("Model is required")
    .isString()
    .withMessage("Model must be a string"),
  check("year")
    .notEmpty()
    .withMessage("Year is required")
    .isNumeric()
    .withMessage("Year must be a number")
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be 4 digits long")
    .custom((value) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear) {
        throw new Error("Year cannot be in the future");
      }
      return true;
    }),
  check("vehicle_registration")
    .notEmpty()
    .withMessage("vehicle_registration is required")
    .isString()
    .withMessage("vehicle_registration must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log.error("Validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // If no errors, proceed to the next middleware
    next();
  },
];

const validateDocumentationFields = [
  check("document_name")
    .notEmpty()
    .withMessage("Document name is required")
    .isString()
    .withMessage("Document name must be a string"),
  check("expiration_date")
    .notEmpty()
    .withMessage("Expiration date is required")
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage("Expiration date must be in the format DD-MM-YYYY"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log.error("Validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // If no errors, proceed to the next middleware
    next();
  },
];

const validateServiceFields = [
  check("service_date")
    .notEmpty()
    .withMessage("Service date is required")
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage("Service date must be in the format DD-MM-YYYY"),
  check("service_type")
    .notEmpty()
    .withMessage("Service Type is requiered")
    .isString()
    .withMessage("Service Type must be a string"),
  check("service_description")
    .notEmpty()
    .withMessage("Service description is required")
    .isString()
    .withMessage("Service description must be a string"),
  check("service_mileage")
    .notEmpty()
    .withMessage("Service mileage is required")
    .isNumeric()
    .withMessage("Service mileage must be a number"),
  check("service_cost")
    .notEmpty()
    .withMessage("Service cost is required")
    .isNumeric()
    .withMessage("Service cost must be a number"),
  check("service_location")
    .notEmpty()
    .withMessage("Service location is required")
    .isString()
    .withMessage("Service location must be a string"),
  check("next_service_mileage")
    .optional()
    .isNumeric()
    .withMessage("Next service mileage must be a number"),
  check("next_service_date")
    .optional()
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage("Next service date must be in the format DD-MM-YYYY"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log.error("Validation error", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // If no errors, proceed to the next middleware
    next();
  },
];

export {
  validateVehicleFields,
  validateServiceFields,
  validateDocumentationFields,
};
