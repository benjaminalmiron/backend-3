// src/errors/customErrors.js

class CustomError extends Error {
    constructor(name, message, code, cause) {
        super(message); 
        this.name = name;      
        this.code = code;      
        this.cause = cause;    
        Error.captureStackTrace(this, CustomError); 
    }
}

module.exports = CustomError;