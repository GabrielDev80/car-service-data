import vehicleModel from "../models/vehicle.model.js";

const create = async (data) => vehicleModel.create(data);

const getAll = async () => vehicleModel.find().lean();

const getById = async (id) => vehicleModel.findById(id).lean();

const getByRegistration = async (email) =>
  vehicleModel.findOne({ email: email }).lean();

const update = async (id, data) =>
  vehicleModel
    .findByIdAndUpdate({ _id: id }, { $set: data }, { new: true })
    .exec();

const eliminate = async (id) => vehicleModel.findByIdAndDelete(id);

export { create, getAll, getById, getByRegistration, update, eliminate };
