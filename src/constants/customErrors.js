// src/errors/customErrors.js

class CustomError extends Error {
    constructor(name, message, code, cause) {
        super(message); // Llama al constructor de la clase base (Error) con el mensaje
        this.name = name;      // Nombre del error (ej. "InvalidTypeError")
        this.code = code;      // Código numérico del error (de EErrors)
        this.cause = cause;    // Causa original del error (puede ser un objeto o string)
        Error.captureStackTrace(this, CustomError); // Captura el stack trace para mejor depuración
    }
}

module.exports = CustomError;