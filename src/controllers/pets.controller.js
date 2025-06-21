
import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"; // Ajusta la ruta si es necesario
import __dirname from "../utils/index.js";
import logger from "../config/logger.js"; // ¡Importa tu logger aquí!

const getAllPets = async (req, res, next) => { // Agrega 'next'
    try {
        const pets = await petsService.getAll();
        logger.info('Mascotas obtenidas con éxito desde getAllPets.'); // Log informativo
        res.send({ status: "success", payload: pets });
    } catch (error) {
        // Si hay un error, lo registramos y se lo pasamos al errorHandler
        logger.error(`Error en getAllPets: ${error.message}`, { stack: error.stack });
        next(error); // Pasa el error al middleware errorHandler
    }
}

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            return res.status(400).json({ status: "error", error: "Incomplete values" }); // Usar .json()
        }

        // Si usas PetDTO, asegúrate de que convierta correctamente
        // const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const pet = { name, specie, birthDate }; // Si no usas DTO o el DTO ya lo manejas

        const result = await petsService.create(pet); // petsService.create debe devolver el objeto con _id

        // ¡CONFIRMA QUE ESTA ES LA RESPUESTA PARA CREAR MASCOTAS!
        res.status(200).json({ status: "success", payload: result }); // ¡200 OK y JSON con payload! (o 201 si prefieres)

    } catch (error) {
        logger.error(`Error en createPet: ${error.message}`, { stack: error.stack });
        next(error);
    }
};

const updatePet = async (req, res, next) => { // Agrega 'next'
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId, petUpdateBody);
        logger.info('Mascota actualizada con éxito desde updatePet.'); // Log informativo
        res.send({ status: "success", message: "pet updated" });
    } catch (error) {
        logger.error(`Error en updatePet: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

const deletePet = async (req, res, next) => { // Agrega 'next'
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        logger.info('Mascota eliminada con éxito desde deletePet.'); // Log informativo
        res.send({ status: "success", message: "pet deleted" });
    } catch (error) {
        logger.error(`Error en deletePet: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

const createPetWithImage = async (req, res, next) => { // Agrega 'next'
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        logger.debug(`Archivo recibido: ${JSON.stringify(file)}`); // Log para depuración
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });
        logger.debug(`Objeto mascota a crear: ${JSON.stringify(pet)}`); // Log para depuración
        const result = await petsService.create(pet);
        logger.info('Mascota con imagen creada con éxito desde createPetWithImage.'); // Log informativo
        res.send({ status: "success", payload: result });
    } catch (error) {
        logger.error(`Error en createPetWithImage: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}