import mongoose, { Schema } from 'mongoose';

import jwt from 'jsonwebtoken';
const teacherSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
}, { timestamps: true });
teacherSchema.methods.isPasswordCorrect = async function(password) {
    // Si tu n'as pas encore mis en place le hachage avec bcrypt, fais une comparaison simple :
    return password === this.password;
};
teacherSchema.methods.generateToken = async function() {
    const token = jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '1d' }
    );
    return token;
};

export const Teacher = mongoose.model("Teacher", teacherSchema);