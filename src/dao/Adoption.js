// src/dao/Adoption.js
import adoptionModel from "./models/Adoption.js"; // Este es tu modelo de Mongoose (donde está el schema)

export default class Adoption {

    // Cambiado de 'get' a 'getAll' para consistencia y añadiendo .lean().populate()
    getAll = (params) => {
        // Asegúrate de poblar 'owner' y 'pet' si los necesitas en la respuesta del test
        return adoptionModel.find(params).lean().populate('owner').populate('pet');
    }

    // El nombre 'getBy' ya lo tenías, ¡genial! Añadiendo .lean().populate()
    getBy = (params) => {
        // Asegúrate de poblar 'owner' y 'pet'
        return adoptionModel.findOne(params).lean().populate('owner').populate('pet');
    }

    // Cambiado de 'save' a 'create' para consistencia con adoptionsService.create
    create = (doc) => {
        return adoptionModel.create(doc); // Esto devuelve el documento creado con su _id
    }

    // Mantener 'update' y 'delete' como los tenías
    update = (id, doc) => {
        return adoptionModel.findByIdAndUpdate(id, { $set: doc });
    }

    delete = (id) => {
        return adoptionModel.findByIdAndDelete(id);
    }
}