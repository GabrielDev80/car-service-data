import { Router } from "express";
import passport from "passport";
import { customAuthenticate } from "../users/user.middlewares.js";
// Controllers
import {
  userLogin,
  userRegister,
  userLogout,
} from "../users/user.controller.js";
// Validations
import { validateUsersFields } from "../users/user.validations.js";
import { validateLoginFields } from "./login.validations.js";
// Utils
import upload from "../../utils/upload.utils.js";

const authRouter = Router();

/* PASSPORT */

// Registro de usuario
authRouter.post(
  "/register",
  upload.single("thumbnail"),
  validateUsersFields,
  customAuthenticate("local-register", { session: false }),
  userRegister,
);

// Login de usuario
authRouter.post(
  "/login",
  upload.single(),
  validateLoginFields,
  customAuthenticate("local-login"),
  userLogin,
);

// Test
authRouter.post("/test", upload.single("thumbnail"), (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  res.status(200).json({ body: req.body, file: req.file });
});

// Logout de sesión (session-based)
authRouter.post("/logout", userLogout);

export default authRouter;
