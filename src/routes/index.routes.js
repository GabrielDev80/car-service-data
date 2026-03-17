import { Router } from "express";
import userRouter from "./user.routes.js";
import sessionRouter from "./session.routes.js";
import vehicleRouter from "./vehicle.routes.js";
import { jwtAuth } from "../middlewares/jwt.middleware.js";

const indexRouter = Router();

// Routes that handle authentication (register / login / logout)
indexRouter.use("/v1/api/sessions", sessionRouter);

// Protected routes: require an access token
indexRouter.use("/v1/api/users", jwtAuth, userRouter);
indexRouter.use("/v1/api/vehicles", jwtAuth, vehicleRouter);

export default indexRouter;
