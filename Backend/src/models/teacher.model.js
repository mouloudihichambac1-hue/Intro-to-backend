import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const teacherSchema = new mongoose.Schema({
     
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
    num_Authentication:{
            type:Number,
            trim:true,
        },
    age:{
            type:Number,
            trim:true,
            maxlength:30,
        },
    speciality:{
            type:String,
            trim:true,
            minlength:2,
            maxlength:50,
        },
        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
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
        
    createdat:{
            type:Date,
            default:Date.now,
        }
    
}, { timestamps: true })
teacherSchema.pre('save', async function() {
    
    if (!this.isModified('password')) {
        return ;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
    } catch (error) {
        throw error;
    }
});
teacherSchema.methods.generateToken = async function() {
    const token = jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '1d' }
    );
    return token;
};
teacherSchema.methods.comparePassword = async function(password) {
    
    return await bcrypt.compare(password, this.password);
};
const getTeacher=async(req,res)=>{
    try {
            const Allteachers = await Teacher.find({university:req.user.id});
            res.status(200).json(Allteachers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};
export const Teacher = mongoose.model("Teacher", teacherSchema);
export {getTeacher};