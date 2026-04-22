import mongoose from "mongoose";
import config from "./config.js";
import getLogger from "../utils/logger.utils.js";

const log = getLogger();

const connection = mongoose
  .connect(config.db.cs, {
    dbName: config.db.dbName,
  })
  .catch((err) => log.fatal(err.message));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "*** MongoDB connection error ***"));
db.once("open", () => {
  log.info("Connection succesfully to MongoDB");
});

export default db;
