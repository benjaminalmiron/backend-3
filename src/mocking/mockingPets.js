// src/mocking/mockingPets.js
import { faker } from '@faker-js/faker';

/**
 * Genera una mascota mock (sin _id, createdAt, updatedAt para que Mongoose los genere).
 * @returns {Object} Un objeto mascota listo para insertar.
 */
const generateMockPet = () => {
  return {
    name: faker.animal.type() + ' ' + faker.person.firstName(),
    species: faker.animal.type(),
    breed: faker.word.noun(), // O la opción que hayas elegido para la raza
    age: faker.number.int({ min: 1, max: 15 }),
    description: faker.lorem.sentence(),
    owner: null, // Sin owner (se podrá asignar después de crear usuarios)
    adopted: false,
  };
};

const generateMockPets = (count) => {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push(generateMockPet());
  }
  return pets;
};

export {
  generateMockPets
};