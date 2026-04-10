// Verificar que los datos proporcionados tienen un formato válido y que éste no este vacío
export const validateFormatData = (req, res, next) => {
  const data = req.body;
  if (!(typeof data === "object" || Object.keys(data) > 0)) {
    return res.status(400).json({
      status: "error",
      message: "Bad request: invalid sent format",
    });
  }
  // si no tiene errores
  next();
};
