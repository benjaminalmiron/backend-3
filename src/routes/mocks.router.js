// src/routes/mocks.router.js
import { Router } from 'express';
import { generateMockPets } from '../mocking/mockingPets.js'; 
import { generateMockUsers } from '../mocking/mockingUsers.js'; 
import UserModel from '../models/User.model.js'; // Asegúrate de que la ruta sea correcta
import PetModel from '../models/Pet.model.js'; // Asegúrate de que la ruta sea correcta
const router = Router();

// Definimos la ruta específica para generar mascotas mock
router.get('/mockingpets', (req, res) => {
    const numberOfPets = 100; // Por defecto, generamos 100 mascotas

    // Opcional: Permitir que el número de mascotas sea un parámetro de consulta
    // const count = parseInt(req.query.count);
    // const numberOfPets = isNaN(count) || count <= 0 ? 100 : count;

    const mockPets = generateMockPets(numberOfPets);
    res.json(mockPets);
});

router.get('/mockingusers', async (req, res) => { // ¡Esta función DEBE ser async!
    const numberOfUsers = 50; // Generar 50 usuarios

    // Opcional: Permitir que el número de usuarios sea un parámetro de consulta
    // const count = parseInt(req.query.count);
    // const numberOfUsers = isNaN(count) || count <= 0 ? 50 : count;

    try {
        const mockUsers = await generateMockUsers(numberOfUsers); // Espera la generación de usuarios
        res.json(mockUsers);
    } catch (error) {
        console.error("Error al generar usuarios mock:", error);
        res.status(500).json({ status: "error", message: "Error al generar usuarios mock." });
    }
});
router.post('/generateData', async (req, res, next) => {
    try {
        const { users: numUsers = 0, pets: numPets = 0 } = req.body; // Recibe 'users' y 'pets' del body

        const usersToGenerate = parseInt(numUsers);
        const petsToGenerate = parseInt(numPets);

        // Validar que los parámetros sean números válidos
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
            // Insertar muchos documentos a la vez para eficiencia
            createdUsers = await UserModel.insertMany(mockUsersData);
            console.log(`Se insertaron ${createdUsers.length} usuarios.`);
        }

        // 2. Generar e insertar mascotas
        if (petsToGenerate > 0) {
            console.log(`Generando e insertando ${petsToGenerate} mascotas...`);
            const mockPetsData = generateMockPets(petsToGenerate);

            // Opcional: Asignar dueños a las mascotas si hay usuarios creados
            const petsWithOwners = mockPetsData.map(pet => {
                if (createdUsers.length > 0) {
                    // Asigna aleatoriamente un dueño de los usuarios recién creados
                    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                    return { ...pet, owner: randomUser._id, adopted: true }; // Marca como adoptada si tiene dueño
                }
                return pet;
            });

            createdPets = await PetModel.insertMany(petsWithOwners);
            console.log(`Se insertaron ${createdPets.length} mascotas.`);

            // Opcional: Asignar las mascotas a los usuarios (si la relación es bidireccional)
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
            // Opcional: Devolver IDs o un resumen
            // userIds: createdUsers.map(u => u._id),
            // petIds: createdPets.map(p => p._id),
        });

    } catch (error) {
        console.error("Error en /generateData:", error);
        // Si el error no es un CustomError, lo envolvemos para que el errorHandler lo maneje.
        if (!(error instanceof CustomError)) {
            error = new CustomError(
                "Internal Server Error",
                "Hubo un problema al generar e insertar los datos.",
                EErrors.DATABASE_ERROR, // Usamos DATABASE_ERROR para errores de inserción
                error.message || error.toString()
            );
        }
        next(error); // Pasa el error al middleware de manejo de errores
    }
});

export default router;