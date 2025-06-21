import winston from "winston";

const customLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    },
    colors: {
        debug: 'white',
        http: 'magenta',
        info: 'green',
        warning: 'yellow',
        error: 'red',
        fatal: 'red',
    },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    // Este formato GLOBAL para el logger principal es bueno, pero el transport puede tener su propio formato
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // Transporte para consola
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
        }),

        // TRANSPORTE DE ARCHIVOS - ¡Modificamos el formato aquí!
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error', // <--- ¡Esto es CRUCIAL y debe funcionar!
            // Usa un formato más simple o solo el JSON para el archivo
            format: winston.format.json() // Opcional: winston.format.simple() si quieres un texto plano
        }),
    ],
});

// ¡Descomenta la sobrescritura de console.log AHORA!
// Si ya lo tenías comentado, descoméntalo. Lo vamos a necesitar.
if (process.env.NODE_ENV !== 'production') {
    logger.debug('*** Modo Desarrollo Activado: Logging a partir de nivel "debug" ***');
    console.log = function() {
        logger.debug.apply(logger, arguments);
    };
    console.info = function() {
        logger.info.apply(logger, arguments);
    };
    console.warn = function() {
        logger.warning.apply(logger, arguments);
    };
    console.error = function() {
        logger.error.apply(logger, arguments);
    };
} else {
    logger.info('*** Modo Producción Activado: Logging a partir de nivel "info" ***');
    console.log = function() {
        logger.info.apply(logger, arguments);
    };
    console.info = function() {
        logger.info.apply(logger, arguments);
    };
    console.warn = function() {
        logger.warning.apply(logger, arguments);
    };
    console.error = function() {
        logger.error.apply(logger, arguments);
    };
}

export default logger;