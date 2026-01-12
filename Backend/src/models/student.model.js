import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const studentSchema = new Schema(
    {
        nom:{
            type:String,
            trim:true,
            minlength:2,
            maxlength:30,
        },
        prenom:{
            type:String,
            trim:true,
            minlength:2,
            maxlength:30,
        },
        age:{
            type:Number,
            trim:true,
            maxlength:30,
        },
        num_Authentication:{
            type:Number,
            trim:true,
        },
        sex:{
            type:String,
            trim:true,
        },
        email:{
            type:String,
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        filiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiere',
        required: true
        },
        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        },
        
        createdat:{
            type:Date,
            default:Date.now,
        }
    },
    {
        timestamps:true,
    })
studentSchema.pre('save', async function() {
    if (!this.isModified('password')) { 
        return;
    }

    try {
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
         
    } catch (error) {
        
        throw error;
    }
});
studentSchema.methods.generateToken = async function() {
    const token = jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '1d' }
    );
    return token;
};
studentSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
const getStudent =async (req,res) => {
    try {
        const Allstudents = await Student.find({university:req.user.id}).populate('filiere', 'nom');
        res.status(200).json(Allstudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const Student = mongoose.model('Student',studentSchema
);
export {getStudent};