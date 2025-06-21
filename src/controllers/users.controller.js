// src/controllers/users.controller.js

import { usersService } from "../services/index.js";
import logger from "../config/logger.js"; // <-- ¡Importa tu logger aquí!
import { createHash } from "../utils/index.js"; // Asegúrate de que esta función esté definida y exportada correctamente

const getAllUsers = async (req, res, next) => { // <-- Agrega 'next' aquí
    try {
        console.log('--- LLEGÓ A GETALLUSERS ---');  // Log de depuración
        const users = await usersService.getAll();
        logger.info('Usuarios obtenidos con éxito desde getAllUsers.'); // Log informativo
        res.send({ status: "success", payload: users });
    } catch (error) {
        // Si algo falla, lo registramos y se lo pasamos al errorHandler
        logger.error(`Error en getAllUsers: ${error.message}`, { stack: error.stack });
        next(error); // <-- Pasa el error al middleware errorHandler
    }
}

const getUser = async (req, res, next) => { // <-- Agrega 'next' aquí
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) {
            // Este es un caso de "no encontrado", que no es un error de servidor.
            // Puedes devolver un 404 directamente sin pasar al errorHandler.
            logger.info(`Usuario no encontrado para ID: ${userId}`);
            return res.status(404).send({ status: "error", error: "User not found" });
        }
        logger.info(`Usuario obtenido con éxito para ID: ${userId}`); // Log informativo
        res.send({ status: "success", payload: user });
    } catch (error) {
        logger.error(`Error en getUser: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

const updateUser = async (req, res, next) => { // <-- Agrega 'next' aquí
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) {
            // Si el usuario no existe para actualizar, es un 404
            logger.info(`Intento de actualización de usuario no existente para ID: ${userId}`);
            return res.status(404).send({ status: "error", error: "User not found" });
        }
        const result = await usersService.update(userId, updateBody);
        logger.info(`Usuario actualizado con éxito para ID: ${userId}`); // Log informativo
        res.send({ status: "success", message: "User updated" });
    } catch (error) {
        logger.error(`Error en updateUser: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

const deleteUser = async (req, res, next) => { // <-- Agrega 'next' aquí
    try {
        const userId = req.params.uid;
        // Es mejor verificar si el usuario existe antes de intentar borrar,
        // y si no existe, devolver un 404.
        const userExists = await usersService.getUserById(userId);
        if (!userExists) {
            logger.info(`Intento de eliminación de usuario no existente para ID: ${userId}`);
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        const result = await usersService.delete(userId); // Asumo que este es el método de borrado
        logger.info(`Usuario eliminado con éxito para ID: ${userId}`); // Log informativo
        res.send({ status: "success", message: "User deleted" });
    } catch (error) {
        logger.error(`Error en deleteUser: ${error.message}`, { stack: error.stack });
        next(error);
    }
}
const createUser = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ status: "error", error: "Incomplete values" }); // Usar .json()
        }

        const exists = await usersService.getBy({ email: email }); // O getUsersService.getUserByEmail(email)
        if (exists) {
            return res.status(400).json({ status: "error", error: "User with that email already exists" }); // Usar .json()
        }

        const hashedPassword = await createHash(password); // Usar await
        const newUser = { first_name, last_name, email, age, password: hashedPassword };

        const result = await usersService.create(newUser); // usersService.create debe devolver el objeto con _id

        // ¡CONFIRMA QUE ESTA ES LA RESPUESTA PARA CREAR USUARIOS!
        res.status(201).json({ status: "success", payload: result }); // ¡201 Created y JSON con payload!

    } catch (error) {
        logger.error(`Error en createUser: ${error.message}`, { stack: error.stack });
        next(error);
    }
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    createUser
}