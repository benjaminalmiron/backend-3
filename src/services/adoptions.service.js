// src/services/adoptions.service.js
import { adoptionModel } from '../dao/mongo/models/adoption.model.js'; // Ajusta esta ruta si es diferente
// Si tienes un PetsService o UsersService que necesites para la lógica aquí, impórtalos
// import { petsService } from './pets.service.js';
// import { usersService } from './users.service.js';

class AdoptionsService {
    async create(adoptionData) {
        const newAdoption = await adoptionModel.create(adoptionData);
        return newAdoption;
    }

    async getAll() {
        const adoptions = await adoptionModel.find().lean();
        return adoptions;
    }

    async getBy(query) {
        const adoption = await adoptionModel.findOne(query).lean();
        return adoption;
    }
    // Si tienes otros métodos relacionados con adopciones, ponlos aquí.
}

export const adoptionsService = new AdoptionsService(); // Exporta una instancia