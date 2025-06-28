
import { adoptionModel } from '../dao/mongo/models/adoption.model.js'; // Ajusta esta ruta si es diferente


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
    
}

export const adoptionsService = new AdoptionsService(); 