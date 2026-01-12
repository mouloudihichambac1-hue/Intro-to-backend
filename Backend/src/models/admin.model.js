import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AdminSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            minlength:2,
            maxlength:120,
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
        },
        address:{
            type:String,
            trim:true,
        },
        createdat:{
          type:Date,
            default:Date.now,
        }
    },
    {
        timestamps:true,
    })
AdminSchema.pre('save', async function() {
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
AdminSchema.methods.generateToken = async function() {
    const token = jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '1d' }
    );
    return token;
};
AdminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
const getAdmins=async()=>{
    try {
    return await Admin.find();
} 
catch (error) {
    throw error;
}
};

export const Admin = mongoose.model('Admin',AdminSchema
);
export{
    getAdmins
};

