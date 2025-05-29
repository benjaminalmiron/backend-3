// src/mocking/mockingPets.js
import { faker } from '@faker-js/faker';

/**
 
 @returns {Object} 
 */
const generateMockPet = () => {
  return {
    name: faker.animal.type() + ' ' + faker.person.firstName(),
    species: faker.animal.type(),
    breed: faker.word.noun(), 
    age: faker.number.int({ min: 1, max: 15 }),
    description: faker.lorem.sentence(),
    owner: null, 
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