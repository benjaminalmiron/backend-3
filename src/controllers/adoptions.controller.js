// src/controllers/adoptions.controller.js
// Importamos los servicios desde el archivo index.js de la carpeta services
import { adoptionsService, petsService, usersService } from "../services/index.js";
// Si usas un logger, impórtalo también
// import logger from "../config/logger.js";

const getAllAdoptions = async(req,res, next)=>{
    try {
        const result = await adoptionsService.getAll(); // Llama a 'getAll' del repositorio/servicio
        res.status(200).json({status:"success", payload:result});
    } catch (error) { /* ... */ }
};
const getAdoption = async(req,res, next)=>{
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({_id:adoptionId}); // Llama a 'getBy' del repositorio/servicio
        if(!adoption) return res.status(404).json({status:"error",error:"Adoption not found"});
        res.status(200).json({status:"success",payload:adoption});
    } catch (error) { /* ... */ }
};

const createAdoption = async(req,res, next)=>{
    try {
        const {uid,pid} = req.params;
        const user = await usersService.getBy({_id:uid}); // Usar .getBy o .getUserById según tu servicio
        if(!user) return res.status(404).json({status:"error", error:"user Not found"});
        
        const pet = await petsService.getBy({_id:pid});
        if(!pet) return res.status(404).json({status:"error",error:"Pet not found"});
        
        if(pet.adopted) return res.status(400).json({status:"error",error:"Pet is already adopted"});
        
        // Actualiza el usuario y la mascota (asumo que estos servicios devuelven lo actualizado o el éxito)
        user.pets.push(pet._id); // Añadir la mascota al array de pets del usuario
        await usersService.update(user._id,{pets:user.pets}); // Actualizar el usuario
        
        await petsService.update(pet._id,{adopted:true,owner:user._id}); // Marcar la mascota como adoptada
        
        const newAdoption = await adoptionsService.create({owner:user._id,pet:pet._id});
        
        // ¡CONFIRMA ESTA RESPUESTA!
        res.status(201).json({ // Usa 201 Created para un nuevo recurso
            status:"success",
            message:"Pet adopted successfully",
            payload: newAdoption // ¡Aquí va el objeto de la adopción con su _id!
        });

    } catch (error) {
        // logger.error(`Error en createAdoption: ${error.message}`, { stack: error.stack });
        next(error);
    }
};
// Exporta tus funciones del controlador
export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
};