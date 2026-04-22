/********** SERVER **********/
import app from "./app.js";
import config from "./config/config.js";
import db from "./config/mongoConnection.js";
import getLogger from "./utils/logger.utils.js";

// Logger
const log = getLogger();

// Port
const port = config.server.port;

/* Start Server */
const server = app.listen(port, async (err) => {
  try {
    await db; // Conecta la base se datos antes de iniciar el servidor
    log.info(
      `Server running on port ${port}, in ${config.environment.env} mode`,
    );
  } catch (error) {
    log.error("*** CONNECTION ERROR ***: ", error.message);
  }
});

export default server;
