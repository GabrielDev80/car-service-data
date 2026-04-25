import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { isValidPassword } from "../../../utils/bcrypt.utils.js";
import services from "../../users/services/index.js";
import getLogger from "../../../utils/logger.utils.js";
import { createUser } from "../../users/user.utils.js";

const log = getLogger();

const initializePassport = () => {
  // Estrategia de registro local
  passport.use(
    "local-register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        if (!req.body) {
          log.error("No se encontro el req.body...");
          return done(null, false, { message: "Invalid request data" });
        }

        const { first_name, last_name, nickname, phone, role } = req.body;
        let thumbnail = req.file ? req.file.buffer.toString("base64") : null;

        try {
          // Verificar si el email ya existe
          const userExist = await services.getByEmail(username);
          if (userExist) {
            if (userExist.email === username) {
              // log.error(
              //   "passportStrategies (local-register) - El email ya existe",
              //   req.body
              // );
              return done(null, false, { message: "duplicate key error" });
            }
          }

          const result = await createUser({
            first_name,
            last_name,
            nickname,
            email: username,
            password,
            phone,
            thumbnail,
            role,
          });

          log.info("New user registered");
          return done(null, result, { message: "New user registered" });
        } catch (error) {
          log.fatal(
            "passportStrategies (local-register) - Error al obtener el usuario: " +
              error.message,
          );
          console.error(error);
          return done("error: " + error);
        }
      },
    ),
  );

  // Estrategia de login local
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        try {
          const user = await services.getByEmail(email);
          if (!user) {
            log.error("Incorrect credentials");
            return done(null, false, {
              message: "Email incorrecto",
            });
          }

          const passwordMatch = isValidPassword(user, password);
          // log.info("passwordMatch: " + passwordMatch);
          if (!passwordMatch) {
            log.error("Incorrect password");
            return done(null, false, { message: "Password Incorrecto" });
          }
          // log.info("passportStrategies (local-login) - userSession: ", user);
          log.info(`user ${user._id} succesfully logged in`);

          return done(null, user);
        } catch (error) {
          log.fatal("Error getting user: " + error);
          return done(error);
        }
      },
    ),
  );

  // Serialización
  passport.serializeUser((user, done) => done(null, user._id));

  // Deserialización
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await services.getById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
