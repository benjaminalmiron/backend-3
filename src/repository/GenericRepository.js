
// src/repository/GenericRepository.js

export default class GenericRepository {
    constructor(dao) {
        this.dao = dao;
    }

    // ¡CAMBIO AQUÍ! De 'get' a 'getAll'
    getAll = (params) => {
        return this.dao.getAll(params); // Ahora llama al método 'getAll' de tu DAO
    }

    getBy = (params) => {
        return this.dao.getBy(params);
    }

    // ¡CAMBIO AQUÍ! De 'save' a 'create'
    create = (doc) => {
        return this.dao.create(doc); // Ahora llama al método 'create' de tu DAO
    }

    update = (id, doc) => {
        return this.dao.update(id, doc);
    }

    delete = (id) => {
        return this.dao.delete(id);
    }
}