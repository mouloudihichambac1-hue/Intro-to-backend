import {Student} from '../models/student.model.js';
const registerStudent=async(req,res) =>{
    try {
        const {username,email,password}=req.body;
        //basic validation
        if (!username|| !email || !password){
            return res.status(400).json({message:"All fields are important!"})
        }
        //check if user already exists
        const existing =await Student.findOne({email:email.toLowerCase()});
        if (existing){
            return res.status(400).json({message:"user already exists!"});
        }
        const user=await Student.create({
            username:username.toLowerCase(),
            email:email.toLowerCase(),
            password,
            LoggedIn:false,
        });

        res.status(201).json({
            message:"User registered successfully!",
            student:{id:user._id,username:user.username,email:user.email}
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});
    }
};
const loginStudent=async(req,res) =>{
    try {
        const {email,password}=req.body;
        //basic validation
        if (!email || !password){
            return res.status(400).json({message:"All fields are important!"})
        }
        //check if user already exists
        const existing =await Student.findOne({email:email.toLowerCase()});
        if (!existing){
            return res.status(400).json({message:"email not found or incorrect,try again or register!"});
        }
        //compare password
        const isPasswordValid=await existing.isPasswordCorrect(password);
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
            user:{id:existing._id,username:existing.username,email:existing.email}
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});
    }
};

export{
    registerStudent,loginStudent
}
