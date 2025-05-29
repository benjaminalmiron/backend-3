
import { Router } from 'express';
import { generateMockPets } from '../mocking/mockingPets.js'; 
import { generateMockUsers } from '../mocking/mockingUsers.js'; 
import UserModel from '../models/User.model.js'; 
import PetModel from '../models/Pet.model.js'; 
const router = Router();


router.get('/mockingpets', (req, res) => {
    const numberOfPets = 100; 
    const mockPets = generateMockPets(numberOfPets);
    res.json(mockPets);
});

router.get('/mockingusers', async (req, res) => { 
    const numberOfUsers = 50; 

    try {
        const mockUsers = await generateMockUsers(numberOfUsers); 
        res.json(mockUsers);
    } catch (error) {
        console.error("Error al generar usuarios mock:", error);
        res.status(500).json({ status: "error", message: "Error al generar usuarios mock." });
    }
});
router.post('/generateData', async (req, res, next) => {
    try {
        const { users: numUsers = 0, pets: numPets = 0 } = req.body; 

        const usersToGenerate = parseInt(numUsers);
        const petsToGenerate = parseInt(numPets);

        
        if (isNaN(usersToGenerate) || usersToGenerate < 0 || isNaN(petsToGenerate) || petsToGenerate < 0) {
            throw new CustomError(
                "Invalid Input",
                ErrorMessages[EErrors.INVALID_TYPES_ERROR],
                EErrors.INVALID_TYPES_ERROR,
                "Los parámetros 'users' y 'pets' deben ser números positivos."
            );
        }

        let createdUsers = [];
        let createdPets = [];

        // 1. Generar e insertar usuarios
        if (usersToGenerate > 0) {
            console.log(`Generando e insertando ${usersToGenerate} usuarios...`);
            const mockUsersData = await generateMockUsers(usersToGenerate);
            
            createdUsers = await UserModel.insertMany(mockUsersData);
            console.log(`Se insertaron ${createdUsers.length} usuarios.`);
        }

        // 2. Generar e insertar mascotas
        if (petsToGenerate > 0) {
            console.log(`Generando e insertando ${petsToGenerate} mascotas...`);
            const mockPetsData = generateMockPets(petsToGenerate);

            
            const petsWithOwners = mockPetsData.map(pet => {
                if (createdUsers.length > 0) {
                    
                    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                    return { ...pet, owner: randomUser._id, adopted: true };
                }
                return pet;
            });

            createdPets = await PetModel.insertMany(petsWithOwners);
            console.log(`Se insertaron ${createdPets.length} mascotas.`);

            
            for (const pet of createdPets) {
                if (pet.owner) {
                    await UserModel.findByIdAndUpdate(
                        pet.owner,
                        { $push: { pets: pet._id } },
                        { new: true }
                    );
                }
            }
        }

        res.status(200).json({
            status: 'success',
            message: `Datos generados e insertados: ${createdUsers.length} usuarios y ${createdPets.length} mascotas.`,
            usersCount: createdUsers.length,
            petsCount: createdPets.length,
        
        });

    } catch (error) {
        console.error("Error en /generateData:", error);
       
        if (!(error instanceof CustomError)) {
            error = new CustomError(
                "Internal Server Error",
                "Hubo un problema al generar e insertar los datos.",
                Errors.DATABASE_ERROR, 
                error.message || error.toString()
            );
        }
        next(error); 
    }
});

export default router;