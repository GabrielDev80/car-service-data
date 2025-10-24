import getLogger from "./logger.utils.js";

const log = getLogger();

export const dataFormatter = (data) => {
  try {
    if (typeof data !== "string") {
      throw new Error("La data debe ser un string");
    }
    const trimmed = data.trim();
    if (trimmed.length === 0) return "";
    const formattedData =
      trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    return formattedData;
  } catch (error) {
    log.error("Error formatting data: ", error.message);
    // Si el formato es inválido, lanza un error
    throw new Error("Formato de data inválido");
  }
};

export const registrationFormatter = (registration) => {
  try {
    // Si no se envía registration (por ejemplo al actualizar sólo la imagen),
    // no queremos lanzar un error: devolvemos cadena vacía para indicar "sin cambio"
    if (registration === undefined || registration === null) return "";

    // Si se pasa un objeto (p. ej. req.body), intentar extraer la propiedad
    if (typeof registration === "object") {
      if (typeof registration.registration === "string") {
        registration = registration.registration;
      } else {
        return "";
      }
    }

    if (typeof registration !== "string") {
      throw new Error("La patente debe ser un string");
    }

    const reg = registration.replace(/\s+/g, "").toUpperCase();
    // Formato 1: XX111XX
    const formato1 = /^([A-Z]{2})(\d{3})([A-Z]{2})$/;
    // Formato 2: XXX111
    const formato2 = /^([A-Z]{3})(\d{3})$/;
    // Formato 3: X111XXX
    const formato3 = /^([A-Z]{1})(\d{3})([A-Z]{3})$/;

    if (formato1.test(reg)) {
      const [, l1, n, l2] = reg.match(formato1);
      return `${l1.toUpperCase()} ${n} ${l2.toUpperCase()}`;
    }
    if (formato2.test(reg)) {
      const [, l, n] = reg.match(formato2);
      return `${l.toUpperCase()} ${n}`;
    }
    if (formato3.test(reg)) {
      const [, l, n, l2] = reg.match(formato3);
      return `${l.toUpperCase()} ${n} ${l2.toUpperCase()}`;
    }

    // Si no cumple ningún formato, devolver cadena vacía en vez de lanzar
    // Esto permite actualizaciones parciales (ej. sólo imagen) sin romper el flow
    return "";
  } catch (error) {
    log.error("Error formatting registration: ", error.message);
    // Si el formato es inválido, lanza un error
    throw new Error(
      "Formato de patente inválido. Debe ser 'XX111XX', 'XXX111' o 'X111XXX'"
    );
  }
};
