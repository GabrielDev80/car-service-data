import "dotenv/config";
import config from "./config/config.js";
import express from "express";
import __dirname from "./dirname.js";
import cors from "cors";

import passport from "passport";
import initializePassport from "./controllers/passportStrategies.controller.js";
import session from "express-session";
import MongoStore from "connect-mongo";

import indexRouter from "./routes/index.routes.js";

import morgan from "morgan";
import db from "./config/dbConnection.js";
import getLogger from "./utils/logger.utils.js";

/* Logger */
const log = getLogger();

/* CONFIGURATIONS */
const app = express();
const port = config.server.port;

/* Express */
app.use(
  cors({
    origin: ["http://localhost:5173/*", "https://autotrack-seven.vercel.app/*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

/* Session */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.db.cs,
      ttl: config.session.ttl,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // maxAge: config.session.ttl * 1000,
      secure: false, // Cambiar a true en producción
      httpOnly: true,
    },
  })
);

/* Passport */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/* Morgan */
app.use(morgan("dev"));

/* Routes */
app.use(indexRouter);

/* Server */
const server = app.listen(port, (err) => {
  db;
  if (err) {
    log.error("*** CONNECTION ERROR ***: ", err.message);
    return;
  }
  log.info(`Running on port ${port}, in ${config.environment.env} mode`);
});

export default app;
