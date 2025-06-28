
import { adoptionsService, petsService, usersService } from "../services/index.js";


const getAllAdoptions = async(req,res, next)=>{
    try {
        const result = await adoptionsService.getAll(); 
        res.status(200).json({status:"success", payload:result});
    } catch (error) { /* ... */ }
};
const getAdoption = async(req,res, next)=>{
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({_id:adoptionId}); 
        if(!adoption) return res.status(404).json({status:"error",error:"Adoption not found"});
        res.status(200).json({status:"success",payload:adoption});
    } catch (error) { /* ... */ }
};

const createAdoption = async(req,res, next)=>{
    try {
        const {uid,pid} = req.params;
        const user = await usersService.getBy({_id:uid}); 
        if(!user) return res.status(404).json({status:"error", error:"user Not found"});
        
        const pet = await petsService.getBy({_id:pid});
        if(!pet) return res.status(404).json({status:"error",error:"Pet not found"});
        
        if(pet.adopted) return res.status(400).json({status:"error",error:"Pet is already adopted"});
        
        
        user.pets.push(pet._id); 
        await usersService.update(user._id,{pets:user.pets});
        
        await petsService.update(pet._id,{adopted:true,owner:user._id});
        
        const newAdoption = await adoptionsService.create({owner:user._id,pet:pet._id});
        
      
        res.status(201).json({ 
            status:"success",
            message:"Pet adopted successfully",
            payload: newAdoption 
        });

    } catch (error) {
        
        next(error);
    }
};

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
};