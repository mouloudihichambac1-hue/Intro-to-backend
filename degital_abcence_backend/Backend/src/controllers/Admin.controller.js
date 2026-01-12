import {Admin} from '../models/admin.model.js';
import {Student} from '../models/student.model.js';
import {Teacher} from '../models/teacher.model.js';
import { Filiere } from '../models/filiere.model.js'
const registerAdmin=async(req,res) =>{
    try {
        const {username,email,password}=req.body;
        //basic validation
        if (!username|| !email || !password){
            return res.status(400).json({message:"All fields are important!"})
        }
        //check if user already exists
        const existing =await Admin.findOne({email:email.toLowerCase()});
        if (existing){
            return res.status(400).json({message:"user already exists!"});
        }
        const useradmin=await Admin.create({
            username:username.toLowerCase(),
            email:email.toLowerCase(),
            password,
            LoggedIn:false,
        });

        res.status(201).json({
            message:"User registered successfully!",
            Admin:{id:useradmin._id,username:useradmin.username,email:useradmin.email}
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});
    }
};
const registerStudent=async(req,res) =>{
    try {
        const {nom,prenom,age,num_Authentication,sex,email,filiere,password}=req.body;
        const universityId =req.user.id;
        //basic validation
        if (!nom|| !prenom || !age ||!filiere || !num_Authentication || !sex || !email || !password){
            return res.status(400).json({message:"All fields are important!"})
        }
        //check if user already exists
        const existing =await Student.findOne({email:email.toLowerCase()});
        if (existing){
            return res.status(400).json({message:"user already exists!"});
        }
        const user=await Student.create({
            nom,
            prenom,
            age,
            num_Authentication,
            university :universityId,
            filiere:filiere,
            sex,
            email: email.toLowerCase(),
            password
        });

        res.status(201).json({
            message:"User registered successfully!",
            
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({message:"Internal server  hhh error",error:error.message});
    }
};
const registerTeacher=async(req,res) =>{
    try {
        const {nom,prenom,age,num_Authentication,speciality,sex,email,password}=req.body;
        const universityId=req.user.id;
        //basic validation
        if (!nom|| !prenom || !age || !num_Authentication || !speciality || !sex || !email || !password){
            return res.status(400).json({message:"All fields are important!"})
        }
        //check if user already exists
        const existing =await Teacher.findOne({email:email.toLowerCase()});
        if (existing){
            return res.status(400).json({message:"user already exists!"});
        }
        const teacher=await Teacher.create({
            nom,
            prenom,
            age,
            num_Authentication,
            speciality,
            university :universityId,
            sex,
            email: email.toLowerCase(),
            password
        });

        res.status(201).json({
            message:"User registered successfully!",
            Teacher:{id:teacher._id,username:teacher.username,email:teacher.email}
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});
    }
};
const updateStudent=async(req,res) =>{
    try {
        const studentId = req.params.id;
        const updates = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Student updated successfully",
            
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}; 
const loginAdmin=async(req,res) =>{
    try {
        const {email,password}=req.body;
        //basic validation
        if (!email || !password){
            return res.status(400).json({message:"All fields are important!"})
        }
        //check if user already exists
        const existing =await Admin.findOne({email:email.toLowerCase()});
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
            secure:false,
            maxAge:24*60*60*1000,
            sameSite:"lax"
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
const updateTeacher=async(req,res) =>{
    try {
        const teacherId = req.params.id;
        const updates = req.body;

        const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updates, { new: true });

        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json({
            message: "Teacher updated successfully",
            teacher: updatedTeacher
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const deleteTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedAdmin = await Admin.findByIdAndDelete(adminId);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const registerFiliere = async (req, res) => {
    try {
        const { nom } = req.body;
        const universityId = req.user.id; // Récupéré du token

        if (!nom) {
            return res.status(400).json({ message: "Le nom de la filière est requis" });
        }

        // Vérifier si la filière existe déjà pour cette université
        const existing = await Filiere.findOne({ nom: nom.toLowerCase(), university: universityId });
        if (existing) {
            return res.status(400).json({ message: "Cette filière existe déjà dans votre établissement" });
        }

        const newFiliere = await Filiere.create({
            nom: nom.toLowerCase(),
            university: universityId
        });

        res.status(201).json({
            message: "Filière créée avec succès",
            filiere: newFiliere
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const getFilieres = async (req, res) => {
    try {
        const universityId = req.user.id;
        // On récupère uniquement les filières de l'admin connecté
        const filieres = await Filiere.find({ university: universityId });
        res.status(200).json(filieres);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// --- MODIFIER UNE FILIÈRE ---
const updateFiliere = async (req, res) => {
    try {
        const filiereId = req.params.id;
        const { nom } = req.body;
        const universityId = req.user.id; // Sécurité : seul l'admin de l'école peut modifier

        // il faut que la filière appartient bien à cette université avant de modifier
        const updatedFiliere = await Filiere.findOneAndUpdate(
            { _id: filiereId, university: universityId },
            { nom: nom.toLowerCase() },
            { new: true }
        );

        if (!updatedFiliere) {
            return res.status(404).json({ message: "Filière non trouvée ou accès refusé" });
        }

        res.status(200).json({
            message: "Filière mise à jour avec succès",
            filiere: updatedFiliere
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// --- SUPPRIMER UNE FILIÈRE ---
const deleteFiliere = async (req, res) => {
    try {
        const filiereId = req.params.id;
        const universityId = req.user.id;

        //  vérifie l'université pour la sécurité
        const deletedFiliere = await Filiere.findOneAndDelete({ 
            _id: filiereId, 
            university: universityId 
        });

        if (!deletedFiliere) {
            return res.status(404).json({ message: "Filière non trouvée ou accès refusé" });
        }

        
        // pour empêcher une suppression accidentelle.

        res.status(200).json({ message: "Filière supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
export{
   getFilieres,

   registerFiliere,
   
   
    loginAdmin,

    updateFiliere,
    updateStudent,
    updateTeacher,

    registerAdmin,
    registerStudent,
    registerTeacher,
    
    deleteFiliere,
    deleteAdmin,
    deleteTeacher,
    deleteStudent
};
