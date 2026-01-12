import {Teacher} from '../models/teacher.model.js';

const loginTeacher=async(req,res) =>{
    try {
        const {email,password}=req.body;
        //basic validation
        if (!email || !password){
            return res.status(400).json({message:"All fields are important!"})
        }
        //check if user already exists
        const existing =await Teacher.findOne({email:email.toLowerCase()});
        if (!existing){
            return res.status(400).json({message:"email not found or incorrect,try again or register!"});
        }
        //compare password
        const isPasswordValid=await existing.comparePassword(password);
        
        if (!isPasswordValid){
            return res.status(400).json({message:"password invalid,try again!"});
        }
        //generate token
        const token=await existing.generateToken();
        //set cookie
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            maxAge:24*60*60*1000,
            sameSite:"strict"
        });
        res.status(201).json({
            message:"Connection successful!",
            token:token,
            user:{id:existing._id,username:existing.username,email:existing.email}
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});
    }
};
const getTeacher1=async(req,res)=>{
    try {
        const currentTeacher = await Teacher.findById(req.user.id);
        if (!currentTeacher) {
            return res.status(404).json({ message: "prof not existe" });
        }
    res.status(200).json({
            nom: currentTeacher.nom ,
            prenom:currentTeacher.prenom
        });
} 
catch (error) {
    res.status(500).json({ message:error.message });
}
};

export{
    loginTeacher,
    getTeacher1
}
