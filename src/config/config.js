import dotenv from "dotenv";

const config = {};

const environment = "development"; // change environment to 'production', 'development'or 'testing'.

dotenv.config({
  path:
    environment === "development"
      ? ".env.development"
      : environment === "testing"
        ? ".env.testing"
        : ".env.production",
});

config.environment = {
  env: process.env.NODE_ENV,
};

config.url = {
  url: process.env.BASE_URL,
};

config.server = {
  port: process.env.PORT,
};

config.db = {
  cs: process.env.MONGO_URI, // connection string for MongoDB
  dbUser: process.env.MONGO_USER,
  dbPass: process.env.MONGO_PASS,
  dbName: process.env.MONGO_NAME,
  testing: process.env.MONGO_TEST,
};

config.postgresql = {
  cs: process.env.DATABASE_URL, // connection string for PostgreSQL
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  testDatabase: process.env.PG_TEST_DATABASE,
};

config.session = {
  secret: process.env.SESSION_SECRET,
  ttl: process.env.SESSION_TTL,
};

config.jwt = {
  secret: process.env.JWT_SECRET,
  expire: process.env.JWT_EXPIRE,
};
// console.log("config.js: ", config);

export default config;
