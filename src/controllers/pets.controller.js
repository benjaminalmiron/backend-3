
import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"; 
import __dirname from "../utils/index.js";
import logger from "../config/logger.js"; 

const getAllPets = async (req, res, next) => { 
    try {
        const pets = await petsService.getAll();
        logger.info('Mascotas obtenidas con éxito desde getAllPets.'); 
        res.send({ status: "success", payload: pets });
    } catch (error) {
        
        logger.error(`Error en getAllPets: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            return res.status(400).json({ status: "error", error: "Incomplete values" }); 
        }

       
        const pet = { name, specie, birthDate }; 

        const result = await petsService.create(pet); 
       
        res.status(200).json({ status: "success", payload: result });

    } catch (error) {
        logger.error(`Error en createPet: ${error.message}`, { stack: error.stack });
        next(error);
    }
};

const updatePet = async (req, res, next) => { 
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId, petUpdateBody);
        logger.info('Mascota actualizada con éxito desde updatePet.'); 
        res.send({ status: "success", message: "pet updated" });
    } catch (error) {
        logger.error(`Error en updatePet: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

const deletePet = async (req, res, next) => { 
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        logger.info('Mascota eliminada con éxito desde deletePet.'); 
        res.send({ status: "success", message: "pet deleted" });
    } catch (error) {
        logger.error(`Error en deletePet: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

const createPetWithImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        logger.debug(`Archivo recibido: ${JSON.stringify(file)}`);
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });
        logger.debug(`Objeto mascota a crear: ${JSON.stringify(pet)}`); 
        const result = await petsService.create(pet);
        logger.info('Mascota con imagen creada con éxito desde createPetWithImage.'); 
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