import userModel from "./models/User.js";


export default class Users {
    
    getAll = (params = {}) => { // Agregamos un valor por defecto de {} para params
        return userModel.find(params);
    }

    getBy = (params) =>{
        return userModel.findOne(params);
    }

    // *** ¡CAMBIA ESTA LÍNEA! ***
    // Antes: save = (doc) => {
    create = (doc) => { // ¡Ahora se llama 'create'!
        return userModel.create(doc);
    }

    update = (id,doc) =>{
        return userModel.findByIdAndUpdate(id,{$set:doc})
    }

    delete = (id) =>{
        return userModel.findByIdAndDelete(id);
    }
}