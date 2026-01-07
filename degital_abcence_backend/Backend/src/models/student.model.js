import mongoose, { Schema } from 'mongoose';

import jwt from 'jsonwebtoken';

const studentSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            minlength:3,
            maxlength:30,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
            maxlength:12,
        
        },
        
        createdat:{
            type:Date,
            default:Date.now,
        }
    },
    {
        timestamps:true,
    });
studentSchema.methods.isPasswordCorrect = async function(password) {
    // Si tu n'as pas encore mis en place le hachage avec bcrypt, fais une comparaison simple :
    return password === this.password;
};
studentSchema.methods.generateToken = async function() {
    const token = jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '1d' }
    );
    return token;
};

export const Student = mongoose.model('Student',studentSchema
);
