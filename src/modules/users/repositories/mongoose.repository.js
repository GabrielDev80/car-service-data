import userModel from "../user.model.js";

export default {
  create: async (data) => userModel.create(data),

  getAll: async () => userModel.find().lean(),

  getById: async (id) => userModel.findById(id).lean().populate("vehicles"),

  getByEmail: async (email) => userModel.findOne({ email: email }).lean(),

  getByUsername: async (username) =>
    userModel.findOne({ username: username }).lean(),

  getByEmailOrUsername: async (email, username) => {
    return userModel
      .findOne({
        $or: [{ email: email }, { username: username }],
      })
      .lean();
  },

  update: async (id, data) => {
    return userModel
      .findByIdAndUpdate({ _id: id }, { $set: data }, { new: true })
      .exec();
  },
  eliminate: async (id) => userModel.findByIdAndDelete(id),
};
