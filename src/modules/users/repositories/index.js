import mongooseRepository from "./mongoose.repository.js";
import config from "../../../config/config.js";

const client = config.dbClient.client || "mongoose";

export default client === "mongoose" ? mongooseRepository : prismaRepository;
