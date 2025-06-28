// src/dao/Adoption.js
import adoptionModel from "./models/Adoption.js"; 

export default class Adoption {

    
    getAll = (params) => {
        
        return adoptionModel.find(params).lean().populate('owner').populate('pet');
    }

   
    getBy = (params) => {
        
        return adoptionModel.findOne(params).lean().populate('owner').populate('pet');
    }

    
    create = (doc) => {
        return adoptionModel.create(doc);
    }

    
    update = (id, doc) => {
        return adoptionModel.findByIdAndUpdate(id, { $set: doc });
    }

    delete = (id) => {
        return adoptionModel.findByIdAndDelete(id);
    }
}