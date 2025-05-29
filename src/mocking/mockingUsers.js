// src/mocking/mockingUsers.js
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

/**
 * 
  @returns {Object} 
 */
const generateMockUser = async () => {
  const hashedPassword = await bcrypt.hash('coder123', 10);

  const roles = ['user', 'admin'];
  const randomRole = roles[faker.number.int({ min: 0, max: 1 })];

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    age: faker.number.int({ min: 18, max: 99 }),
    role: randomRole,
    pets: [],
  };
};

const generateMockUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateMockUser());
  }
  return users;
};

export {
  generateMockUser,
  generateMockUsers
};