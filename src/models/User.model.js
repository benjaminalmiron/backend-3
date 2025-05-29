
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    pets: { type: [mongoose.Schema.Types.ObjectId], ref: 'Pet', default: [] }, 
}, { timestamps: true }); 

const UserModel = mongoose.model('User', userSchema);

export default UserModel;