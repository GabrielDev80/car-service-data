import mongooseService from "./mongoose.services.js";
import config from "../../../config/config.js";

const client = config.dbClient.client || "mongoose";

export default client === "mongoose" ? mongooseService : prismaService;
