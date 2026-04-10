import mongoose from "mongoose";

const vehicleCollection = "vehicles";

const serviceSchema = new mongoose.Schema(
  {
    service_date: {
      type: Date,
      required: true,
    },
    service_type: {
      type: String,
      required: true,
    },
    service_description: {
      type: String,
      required: true,
    },
    service_mileage: {
      type: Number,
      required: true,
    },
    service_cost: {
      type: Number,
      required: false,
      default: 0,
    },
    service_location: {
      type: String,
      required: true,
    },
    next_service_mileage: {
      type: Number,
      required: false,
    },
    next_service_date: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const documentationSchema = new mongoose.Schema(
  {
    document_name: {
      type: String,
      required: true,
      enum: [
        "licencia_nacional",
        "licencia_cargas-curso",
        "licencia_cargas-psicofisico",
        "seguro",
        "patente",
        "revision_tecnica",
        "ruta",
        "otro",
      ],
    },
    description: {
      type: String,
    },
    expiration_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    vehicle_registration: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    thumbnails: {
      type: [String],
      required: false,
    },
    services: [serviceSchema],
    documentation: [documentationSchema],
  },
  {
    timestamps: true,
  },
);

const vehicleModel = mongoose.model(vehicleCollection, vehicleSchema);

export default vehicleModel;
