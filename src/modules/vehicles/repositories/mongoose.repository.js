import vehicleModel from "../vehicle.model.js";

export default {
  create: async (data) => vehicleModel.create(data),

  getAll: async () => vehicleModel.find().lean(),

  getById: async (id) => vehicleModel.findById(id).lean(),

  getByRegistration: async (email) =>
    vehicleModel.findOne({ email: email }).lean(),

  update: async (id, data) =>
    vehicleModel
      .findByIdAndUpdate({ _id: id }, { $set: data }, { new: true })
      .exec(),

  eliminate: async (id) => vehicleModel.findByIdAndDelete(id),
};
