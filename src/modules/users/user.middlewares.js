import { validateFormatData } from "../../shared/validations/commonValidations.js";
import { validateUsersFields } from "./user.validations.js";
import getLogger from "../../utils/logger.utils.js";
import passport from "passport";

const log = getLogger();

export const validateCreateUser = [validateFormatData, ...validateUsersFields];

export const validateAsAdmin = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    log.error("Forbiden acces to this resource");
    return res
      .status(403)
      .json({ status: "Error", message: "Forbiden Access" });
  }
  next();
};

// Middleware para manejar errores de Passport
export const customAuthenticate = (strategy, options) => (req, res, next) => {
  passport.authenticate(strategy, options, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "Error", message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(400).json({ status: "Error", message: info.message });
    }
    req.user = user;
    next();
  })(req, res, next);
};
