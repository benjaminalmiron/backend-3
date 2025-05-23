
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Importa dotenv

dotenv.config(); // Carga las variables de entorno desde .env

const MONGODB_URI = process.env.MONGODB_URI; // <-- ¡Ahora se lee de las variables de entorno!

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a la base de datos MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;