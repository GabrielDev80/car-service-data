import userModel from "../models/user.model.js";
import * as service from "../services/vehicle.services.js";
import getLogger from "../utils/logger.utils.js";
import {
  dataFormatter,
  registrationFormatter,
} from "../utils/vehicle.utils.js";

const log = getLogger();

const createVehicle = async (req, res) => {
  const data = req.body;
  // Asociar el vehículo al usuario actual
  if (data.user_id) {
    data.owner = data.user_id;
    delete data.user_id;
  }
  console.log("DATA DEL FRONT: ", data);

  ["make", "model", "year", "color"].forEach((key) => {
    if (data[key]) data[key] = dataFormatter(data[key]);
  });

  data.vehicle_registration = registrationFormatter(data.vehicle_registration);

  try {
    const vehicle = await service.create(data);
    if (!vehicle) {
      log.error("Error creating vehicle", { data });
      return res
        .status(400)
        .json({ status: "Error", message: "Error creating vehicle" });
    }
    // Si el vehículo se crea correctamente, se asocia al usuario
    if (vehicle && data.owner) {
      const userUpdated = await userModel.findByIdAndUpdate(
        data.owner,
        { $push: { vehicles: vehicle._id } },
        { new: true }
      );

      if (!userUpdated) {
        log.error("Error updating user with vehicle", { data });
        return res
          .status(400)
          .json({ status: "Error", message: "Error updating user" });
      }
    }

    res.status(201).json({
      status: "Success",
      message: "Vehicle created successfully",
      payload: vehicle,
    });
  } catch (error) {
    log.fatal("createVehicle controller - Internal Server Error: ", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await service.getAll();
    if (!vehicles) {
      log.error("getAllVehicles controller - No vehicles found");
      return res.ststus(404).json({ status: "Error", message: "Not Found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Vehicles listed successfully",
      payload: vehicles,
    });
  } catch (error) {
    log.fatal("getAllVehicles controller - Internal ServerError: ", error);
    res.status(500).json({ status: "Error", message: "Internal server Error" });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;
  // console.log("getVehicleById - id: ", req.params);
  try {
    const vehicle = await service.getById(id);
    if (!vehicle) {
      log.error("getVehicleById controller - Vehicle not found: ", { id });
      return res
        .status(404)
        .json({ status: "Error", message: "Vehicle not Found" });
    }
    console.log("vehicle: ", vehicle);
    res.status(200).json({
      status: "Success",
      message: "Vehicle found successfully",
      payload: vehicle,
    });
  } catch (error) {
    log.fatal("getVehicleById controller - Vehicle not found: ", error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

const getVehicleByRegistration = async (req, res) => {
  const registration = req.body;
  const formattedRegistration = registrationFormatter(registration);
  try {
    const vehicle = await service.getByRegistration(formattedRegistration);
    if (!vehicle) {
      log.error("getVehicleByRegistration controller - Vehicle not found: ", {
        formattedRegistration,
      });
      return res.status(404).json({ status: "Error", message: "Not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Vehicle found succesfully",
      payload: vehicle,
    });
  } catch (error) {
    log.fatal(
      "getVehicleByRegistration controller - Vehicle not found: ",
      error
    );
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

const updateVehicleById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log("id: ", id);
  console.log("data: ", data);

  // Si hay imagen, guarda solo el string base64
  if (req.files && req.files.length > 0) {
    data.thumbnails = req.files.map((file) => file.buffer.toString("base64"));
    // Si quieres guardar el mimeType, usa otro campo, por ejemplo:
    // data.thumbnailMime = req.file.mimetype;
  }

  ["make", "model", "year", "color"].forEach((key) => {
    if (data[key]) data[key] = dataFormatter(data[key]);
  });

  data.vehicle_registration = registrationFormatter(data.vehicle_registration);

  try {
    const vehicle = await service.update(id, data);
    if (!vehicle) {
      log.error("updateVehicleById controller - Vehicle not found: ", { id });
      return res
        .status(404)
        .json({ status: "Error", message: "Vehicle not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "Vehicle updated successfully",
      payload: vehicle,
    });
  } catch (error) {
    log.fatal("updateVehicleById controller - Internal Server Error: ", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

const updateVehicleByRegistration = async (req, res) => {
  const registration = req.params;
  const data = req.body;
  try {
    const vehicle = await service.update(registration, data);
    if (!vehicle) {
      log.error("updateVehicleById controller - Vehicle not found: ", {
        registration,
      });
      return res
        .status(404)
        .json({ status: "Error", message: "Vehicle not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "Vehicle updated successfully",
      payload: vehicle,
    });
  } catch (error) {
    log.fatal("updateVehicleById controller - Internal Server Error: ", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Servefr Error",
    });
  }
};

const deleteVehicle = async (req, res) => {
  const id = req.params;
  try {
    const deletedVehicle = await service.eliminate(id);
    if (!deletedVehicle) {
      log.error("deleteVehicle controller - Vehicle not found: ", { id });
      return res.status(404).json({ status: "Error", message: "Not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    log.fatal("deleteVehicle controller - Internal Server Error: ", error);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
};

export {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleByRegistration,
  updateVehicleById,
  updateVehicleByRegistration,
  deleteVehicle,
};
