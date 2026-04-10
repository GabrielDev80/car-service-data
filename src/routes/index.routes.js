import { Router } from "express";
import userRouter from "../modules/users/user.routes.js";
import authRouter from "../modules/auth/auth.routes.js";
import vehicleRouter from "../modules/vehicles/vehicle.routes.js";
import { jwtAuth } from "../middlewares/jwt.middleware.js";

const indexRouter = Router();

// Routes that handle authentication (register / login / logout)
indexRouter.use("/v1/api/sessions", authRouter);

// Protected routes: require an access token
indexRouter.use("/v1/api/users", jwtAuth, userRouter);
indexRouter.use("/v1/api/vehicles", jwtAuth, vehicleRouter);

export default indexRouter;
