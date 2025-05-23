// src/models/Pet.model.js
import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: Number },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Referencia a User, puede ser null
    adopted: { type: Boolean, default: false },
}, { timestamps: true }); // Añade createdAt y updatedAt automáticamente

const PetModel = mongoose.model('Pet', petSchema);

export default PetModel;