import petModel from "./models/Pet.js";

export default class Pet {

    getAll = (params) =>{
        return petModel.find(params);
    }

    getBy = (params) =>{
        return petModel.findOne(params);
    }

    create = (doc) =>{
        return petModel.create(doc);
    }

    update = (id,doc) =>{
        return petModel.findByIdAndUpdate(id,{$set:doc})
    }

    delete = (id) =>{
        return petModel.findByIdAndDelete(id);
    }
}