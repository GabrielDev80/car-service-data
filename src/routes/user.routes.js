import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  userLogout,
} from "../controllers/user.controller.js";
import { validateAsAdmin } from "../middlewares/user.middlewares.js";
import upload from "../utils/upload.utils.js";

const userRouter = Router();

userRouter.get("/", validateAsAdmin, getAllUsers); // WARN: Only the development team can use this controller, should create a middleware to check if the user is part of the development team (admin).

userRouter.post("/logout", userLogout); // WARN: This controller should be preceded by a middleware that checks if the user is authenticated.

userRouter.get("/:id", getCurrentUser); // WARN: This controller should be preceded by a middleware that checks if the user is authenticated.

userRouter.patch("/:id", upload.single("thumbnail"), updateCurrentUser); // WARN: This controller should be preceded by a middleware that checks if the user is authenticated.

userRouter.delete("/:id", validateAsAdmin, deleteUser); // WARN: This controller should be preceded by a middleware that checks if the user is authenticated.

export default userRouter;
