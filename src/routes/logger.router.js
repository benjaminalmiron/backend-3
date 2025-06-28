import { Router } from 'express';
import logger from '../config/logger.js'; // Ajusta la ruta si es necesario

const router = Router();

router.get('/', (req, res) => {
    logger.debug('Este es un mensaje de depuración desde /loggerTest.');
    logger.http('Este es un mensaje HTTP desde /loggerTest.');
    logger.info('Este es un mensaje informativo desde /loggerTest.');
    logger.warning('Este es un mensaje de advertencia desde /loggerTest.');
    logger.error('Este es un mensaje de error desde /loggerTest.');
    logger.fatal('Este es un mensaje fatal desde /loggerTest.');

    
    console.log('Este console.log ahora usa el logger de Winston desde /loggerTest.');
    console.error('Este console.error ahora usa el logger de Winston desde /loggerTest.');

    res.send('Logs de prueba enviados. Revisa tu consola y el archivo errors.log');
});

export default router;