import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js'; // Importa tu aplicación Express
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Si lo necesitas aquí, si no, puedes quitarlo
import connectDB from '../src/config/db.config.js';

const requester = supertest(app); // Crea una instancia de supertest para tu app

describe('Testing del Módulo Adoptions', function() {
    this.timeout(10000); // Timeout de 10 segundos para todos los tests

    let userId;
    let petId;
    let adoptionId;

    before(async () => {
        console.log("TEST_HOOK_LOG: Iniciando before hook. Intentando conectar a la DB...");
        try {
            if (mongoose.connection.readyState === 0) { // Si no está conectado
                await connectDB(); // connectDB usa process.env.MONGODB_URI
                console.log("TEST_HOOK_LOG: ✅ Conectado a la base de datos MongoDB para tests.");
            } else {
                console.log("TEST_HOOK_LOG: La base de datos ya estaba conectada.");
            }
        } catch (error) {
            console.error("TEST_HOOK_LOG: ❌ ERROR en la conexión a la base de datos:", error);
            throw error; // Relanza el error para que Mocha lo capture
        }
    });

    after(async () => {
        console.log("TEST_HOOK_LOG: Ejecutando after hook. Limpiando...");
        // Puedes agregar lógica para limpiar tu DB si es necesario.
        // Por ejemplo: await mongoose.connection.dropDatabase(); // ¡CUIDADO, borra todo!
        // await mongoose.connection.close(); // Cierra la conexión si la abriste en el before
    });

    // Test para crear una adopción
    it('POST /api/adoptions/:uid/:pid debe crear una nueva adopción si los IDs son válidos', async () => {
        // Crea un usuario y una mascota de prueba para la adopción
        const userRes = await requester.post('/api/users').send({
            first_name: 'TestUser',
            last_name: 'Adoption',
            email: `test_adoption_${Date.now()}@example.com`,
            password: 'testpassword',
            age: 30
        });
        // --- CAMBIOS EN CONSOLE.LOG AQUÍ ---
        console.log('DEBUG (User Creation): userRes:', userRes);
        console.log('DEBUG (User Creation): userRes.statusCode:', userRes.statusCode);
        console.log('DEBUG (User Creation): userRes.body:', userRes.body);
        // --- FIN CAMBIOS ---
        expect(userRes.statusCode).to.equal(201); // O el código que devuelva tu creación de usuario
        userId = userRes.body.payload?._id || userRes.body.user?._id; // Uso de optional chaining para seguridad
        expect(userId).to.exist; // Asegúrate de que el userId se haya obtenido

        const petRes = await requester.post('/api/pets').send({
            name: 'TestDog',
            specie: 'Dog',
            breed: 'Labrador',
            birthDate: '2023-01-01'
        });
        // --- CAMBIOS EN CONSOLE.LOG AQUÍ ---
        console.log('DEBUG (Pet Creation): petRes:', petRes);
        console.log('DEBUG (Pet Creation): petRes.statusCode:', petRes.statusCode);
        console.log('DEBUG (Pet Creation): petRes.body:', petRes.body);
        // --- FIN CAMBIOS ---
        expect(petRes.statusCode).to.equal(200); // O el código que devuelva tu creación de mascota
        petId = petRes.body.payload?._id || petRes.body.pet?._id; // Uso de optional chaining para seguridad
        expect(petId).to.exist; // Asegúrate de que el petId se haya obtenido

        // Ahora, intenta crear la adopción
        const adoptionsRes = await requester.post(`/api/adoptions/${userId}/${petId}`);
        // --- CAMBIOS EN CONSOLE.LOG AQUÍ ---
        console.log('DEBUG (Adoption Creation): adoptionsRes.statusCode:', adoptionsRes.statusCode);
        console.log('DEBUG (Adoption Creation): adoptionsRes.body:', adoptionsRes.body);
        // --- FIN CAMBIOS ---
        
        expect(adoptionsRes.statusCode).to.equal(201);
        expect(adoptionsRes.body.status).to.equal('success');
        expect(adoptionsRes.body.message).to.equal('Pet adopted successfully'); // Revisa este mensaje, si es 'Adoption successful' u otro.
        
        // Almacena el ID de la adopción si necesitas probar getAdoption
        adoptionId = adoptionsRes.body.payload?._id; // Asumo que el payload contiene la adopción con _id
        
        if (!adoptionId) {
            const allAdoptionsRes = await requester.get('/api/adoptions');
            // --- CAMBIOS EN CONSOLE.LOG AQUÍ ---
            console.log('DEBUG (GetAllAdoptions for ID): allAdoptionsRes.statusCode:', allAdoptionsRes.statusCode);
            console.log('DEBUG (GetAllAdoptions for ID): allAdoptionsRes.body:', allAdoptionsRes.body);
            // --- FIN CAMBIOS ---
            expect(allAdoptionsRes.statusCode).to.equal(200);
            const newAdoption = allAdoptionsRes.body.payload.find(a => 
                (a.owner && a.owner._id === userId) && (a.pet && a.pet._id === petId)
            );
            adoptionId = newAdoption ? newAdoption._id : null;
        }

        expect(adoptionId).to.exist; // LÍNEA 88 APROXIMADAMENTE - Este es el que nos interesa
    });

    // Test para obtener todas las adopciones
    it('GET /api/adoptions debe devolver una lista de adopciones', async () => {
        const res = await requester.get('/api/adoptions');
        // --- CAMBIOS EN CONSOLE.LOG AQUÍ ---
        console.log('DEBUG (GET All Adoptions): res.statusCode:', res.statusCode);
        console.log('DEBUG (GET All Adoptions): res.body:', res.body);
        // --- FIN CAMBIOS ---
        
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(Array.isArray(res.body.payload)).to.be.true;
        expect(res.body.payload.some(a => a._id === adoptionId)).to.be.true;
    });

    // Test para obtener una adopción específica
    it('GET /api/adoptions/:aid debe devolver una adopción específica si el ID es válido', async () => {
        expect(adoptionId).to.exist; 
        const res = await requester.get(`/api/adoptions/${adoptionId}`);
        // --- CAMBIOS EN CONSOLE.LOG AQUÍ ---
        console.log('DEBUG (GET Single Adoption): res.statusCode:', res.statusCode);
        console.log('DEBUG (GET Single Adoption): res.body:', res.body);
        // --- FIN CAMBIOS ---
        
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.payload).to.have.property('_id', adoptionId);
    });

    // Test para obtener una adopción no existente
    it('GET /api/adoptions/:aid debe devolver 404 si la adopción no existe', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString(); // Genera un ID que no existe
        const res = await requester.get(`/api/adoptions/${nonExistentId}`);
        expect(res.statusCode).to.equal(404);
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.equal('Adoption not found');
    });

    // Test para intentar adoptar una mascota ya adoptada
    it('POST /api/adoptions/:uid/:pid debe devolver 400 si la mascota ya está adoptada', async () => {
        const res = await requester.post(`/api/adoptions/${userId}/${petId}`);
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.equal('Pet is already adopted');
    });

    // Test para intentar adoptar con usuario no existente
    it('POST /api/adoptions/:uid/:pid debe devolver 404 si el usuario no existe', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId().toString();
        const res = await requester.post(`/api/adoptions/${nonExistentUserId}/${petId}`);
        expect(res.statusCode).to.equal(404);
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.equal('user Not found');
    });

    // Test para intentar adoptar con mascota no existente
    it('POST /api/adoptions/:uid/:pid debe devolver 404 si la mascota no existe', async () => {
        const nonExistentPetId = new mongoose.Types.ObjectId().toString();
        const res = await requester.post(`/api/adoptions/${userId}/${nonExistentPetId}`);
        expect(res.statusCode).to.equal(404);
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.equal('Pet not found');
    });

});