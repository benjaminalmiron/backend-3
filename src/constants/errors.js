// src/constants/errors.js

const EErrors = {
    ROUTING_ERROR: 1,       // La ruta no existe
    INVALID_TYPES_ERROR: 2, // Tipos de datos inválidos en la petición (ej. body incorrecto)
    DATABASE_ERROR: 3,      // Error de base de datos (MongoDB, etc.)
    AUTH_ERROR: 4,          // Error de autenticación/autorización
    PET_CREATION_ERROR: 5,  // Error al crear una mascota (ej. campos faltantes)
    USER_REGISTRATION_ERROR: 6, // Error al registrar un usuario (ej. usuario ya existe)
    MISSING_FIELDS_ERROR: 7, // Campos obligatorios faltantes
    // Puedes añadir más códigos de error según tus necesidades
};

const ErrorMessages = {
    [EErrors.ROUTING_ERROR]: "La ruta solicitada no existe.",
    [EErrors.INVALID_TYPES_ERROR]: "Uno o más tipos de datos proporcionados son inválidos. Por favor, revisa la información enviada.",
    [EErrors.DATABASE_ERROR]: "Error en la base de datos. Por favor, intenta de nuevo más tarde o contacta al soporte.",
    [EErrors.AUTH_ERROR]: "Credenciales de autenticación inválidas o token expirado. Acceso denegado.",
    [EErrors.PET_CREATION_ERROR]: "No se pudo crear la mascota debido a datos incompletos o incorrectos.",
    [EErrors.USER_REGISTRATION_ERROR]: "No se pudo registrar el usuario. El correo electrónico o nombre de usuario ya pueden estar en uso.",
    [EErrors.MISSING_FIELDS_ERROR]: "Faltan campos obligatorios en la solicitud.",
    // Añade mensajes para otros errores si los defines en EErrors
};

module.exports = {
    EErrors,
    ErrorMessages
};