import mongoose from "mongoose";

const userCollection = "users";

const licenseSchema = new mongoose.Schema({
  licenseClass: {
    type: String,
    required: true,
  },
  expireDate: {
    type: Date,
    required: true,
  },
});
const lintiSchema = new mongoose.Schema({
  psichoPhysicalTest: {
    type: Date,
  },
  expPsichoPhysicalTest: {
    type: Date,
  },
  course: {
    type: Date,
  },
  expCourse: {
    type: Date,
  },
});

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    thumbnail: {
      type: String,
      required: false,
    },
    license: licenseSchema,
    linti: lintiSchema,
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicles",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
