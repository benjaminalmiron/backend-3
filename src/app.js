
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import connectDB from './config/db.config.js';
import loggerRouter from './routes/logger.router.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import logger from './config/logger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT|| 4000;
const swaggerSpec = YAML.load('./src/docs/swagger.yaml');


app.use(express.json());
app.use(cookieParser());
/* app.use('/', petsRouter); */

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/loggerTest', loggerRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;

app.use((err, req, res, next) => {
    logger.error(`Error no manejado: ${err.message}`, { stack: err.stack, url: req.originalUrl, method: req.method });
    res.status(500).send('¡Algo salió mal en el servidor!');
});



app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`);
    connectDB();
 });


 //docker run -p 4000:4000 benjamin343535/adoptme-api:latest para entrar al contenedor
//docker run -p 4000:4000 -d benjamin343535/adoptme-api:latest para correr el contenedor en segundo plano
//docker stop $(docker ps -aq)
//docker rm $(docker ps -aq)
//docker rmi benjamin343535/adoptme-api:latest
//docker build -t benjamin343535/adoptme-api:latest .
//docker push benjamin343535/adoptme-api:latest