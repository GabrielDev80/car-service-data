import { Router } from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleByRegistration,
  updateVehicleById,
  updateVehicleByRegistration,
  deleteVehicle,
} from "../vehicles/vehicle.controller.js";
import upload from "../../utils/upload.utils.js";
import { jwtAuth } from "../../middlewares/jwt.middleware.js";

const vehicleRouter = Router();

vehicleRouter.post("/", jwtAuth, createVehicle);
vehicleRouter.get("/", jwtAuth, getAllVehicles);
vehicleRouter.get("/:id", jwtAuth, getVehicleById);
vehicleRouter.get(
  "/registration/:registration",
  jwtAuth,
  getVehicleByRegistration,
);
vehicleRouter.patch(
  "/:id",
  jwtAuth,
  upload.array("thumbnails", 5),
  updateVehicleById,
);
vehicleRouter.patch(
  "/registration/:registration",
  jwtAuth,
  upload.array("thumbnails", 5),
  updateVehicleByRegistration,
);
vehicleRouter.delete("/:id", jwtAuth, deleteVehicle); // WARN: This controller should be preceded by a middleware that checks if the user is authenticated.

export default vehicleRouter;
