import getLogger from "../../utils/logger.utils.js";
import repository from "./repositories/index.js";
import { userDTO } from "./user.dto.js";
import { generateToken } from "../../utils/jwt.utils.js";

const log = getLogger();

// Registro local de usuario - toda la lógica está en el controlador de registro en passportStrategies
const userRegister = async (req, res) => {
  // console.log("controller - userRegister: ", req.user);
  try {
    const data = req.user;
    if (!data) {
      log.error("controller - userRegister: No hay una data válida");
      return res
        .status(404)
        .json({ status: "Error", message: "Data not found" });
    }

    const userCreated = userDTO(data);

    res.status(201).json({
      status: "Success",
      message: "Registro exitoso. Inicia sesión para continuar.",
      payload: userCreated,
    });
  } catch (error) {
    log.error("Error creating user", error.message);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
};

// Login local de usuario - toda la lógica está en el controlador de registro en passportStrategies
const userLogin = async (req, res) => {
  try {
    const data = req.user;
    if (!data) {
      log.error("Error al iniciar sesión");
      return res.status(400).json({
        status: "Error",
        message: "Error al intentar inicio de sesión",
      });
    }

    const currentUser = userDTO(data);

    // Generar el token JWT
    const token = generateToken({
      id: currentUser.user_id,
      email: currentUser.email,
    });
    console.log("token: ", token);
    res.status(200).json({
      status: "Success",
      message: "Sesión iniciada con éxito",
      payload: { user: currentUser, token },
    });
  } catch (error) {
    log.fatal("controller - userlogin: Error de Servidor", error);
    res.status(500).json({ status: "Error", message: error.message });
  }
};

// Logout local de usuario
const userLogout = async (req, res) => {
  try {
    // Passport >=0.6 requiere callback
    req.logout(function (err) {
      if (err) {
        log.error("userLogout - Error during req.logout", err);
        return res
          .status(500)
          .json({ status: "Error", message: "Logout failed" });
      }

      // Destruir la sesión en el store (MongoStore)
      req.session.destroy((err) => {
        if (err) {
          log.error("userLogout - Error destroying session", err);
          // Intentamos limpiar la cookie aunque haya error
          res.clearCookie("connect.sid");
          return res
            .status(500)
            .json({ status: "Error", message: "Session destroy failed" });
        }

        // Limpiar cookie de sesión en cliente
        res.clearCookie("connect.sid");
        return res
          .status(200)
          .json({ status: "Success", message: "Logged out" });
      });
    });
  } catch (error) {
    log.fatal("userLogout - Internal Server Error: ", error);
    return res
      .status(500)
      .json({ status: "Error", message: "Internal Server Error" });
  }
};

// Only the development team can use this controller
const getAllUsers = async (req, res) => {
  try {
    const users = await repository.getAll();
    if (!users) {
      return res
        .status(404)
        .json({ status: "Error", message: "No users found" });
    }
    res.status(200).json({
      status: "Success",
      message: "Users retrieved successfully",
      payload: users,
    });
  } catch (error) {
    log.error("Error getting users", error.message);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
};

// this controller should be preceded by a middleware that checks if the user is authenticated
const getCurrentUser = async (req, res) => {
  // Priority: JWT auth provides req.userId
  const id = req.userId || req.session?.user?.id || req.params.id;

  try {
    if (!id) {
      log.error("getCurrentUser - No user id was provided");
      return res.status(401).json({ status: "Error", message: "Unauthorized" });
    }

    const user = await repository.getById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }
    const currentUser = userDTO(user);
    res.status(200).json({
      status: "Success",
      message: "User retrieved successfully",
      payload: currentUser,
    });
  } catch (error) {
    log.error("Error recovering user", error.message);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
};
// this controller should be preceded by a middleware that checks if the user is authenticated
const updateCurrentUser = async (req, res) => {
  const data = req.body;
  // Preferir el id validado por el token (req.userId) y evitar que el cliente lo falsifique.
  const id = req.userId || data.user_id;

  // Si hay imagen, guarda solo el string base64
  if (req.file) {
    data.thumbnail = req.file.buffer.toString("base64");
  }

  try {
    const updatedUser = await repository.update(id, data);

    if (!updatedUser) {
      log.error("try - Error updating user", "User not found");
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }
    const formattedUser = userDTO(updatedUser);
    res.status(200).json({
      status: "Success",
      message: "User updated succesfully",
      payload: formattedUser,
    });
  } catch (error) {
    log.error("catch - Error updating user: " + error.message);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
};

// this controller should be preceded by a middleware that checks if the user is authenticated
const deleteUser = async (req, res) => {
  try {
    const id = req.userId || req.session?.user?.id;
    if (!id) {
      log.error("deleteUser - No user id was provided");
      return res.status(401).json({ status: "Error", message: "Unauthorized" });
    }

    const user = await repository.eliminate(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "User deleted successfully",
    });
  } catch (error) {
    log.error("Error deleting user", error.message);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
};

export {
  userRegister,
  userLogin,
  userLogout,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteUser,
};
