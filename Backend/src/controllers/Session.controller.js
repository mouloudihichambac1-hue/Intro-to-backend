import { Session } from '../models/session.model.js';
import { Student } from '../models/student.model.js';
import { Teacher } from '../models/teacher.model.js';
// 1. Le Professeur lance le cours

export const startSession = async (req, res) => {
    try {
        const { courseName, sessionCode } = req.body;
        const teacherId = req.user.id; // Récupéré via  middleware d'auth
        const teacher = await Teacher.findById(req.user.id);
        if (!courseName || !sessionCode) {
            return res.status(400).json({ message: "Le nom du cours et le code sont requis" });
        }

        const newSession = await Session.create({
            courseName,
            sessionCode,
            university:teacher.university,
            teacher: teacherId,
            isActive: true,
            attendees: []
        });

        res.status(201).json({
            message: "Session de cours lancée !",
            session: newSession
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du lancement", error: error.message });
    }
};

// 2. L'Étudiant marque sa présence
export const markPresence = async (req, res) => {
    try {
        const { sessionCode } = req.body;
        const studentId = req.user.id; // Récupéré via le token de l'étudiant
        const student = await Student.findById(req.user.id);
        // Trouver la session active avec ce code
        const session = await Session.findOne({ sessionCode, isActive: true,university:student.university });

        if (!session) {
            return res.status(404).json({ message: "Code invalide ou session fermée" });
        }

        // Vérifier si l'étudiant n'a pas déjà pointé
        const alreadyPresent = session.attendees.find(a => a.studentId.toString() === studentId);
        if (alreadyPresent) {
            return res.status(400).json({ message: "Vous avez déjà marqué votre présence" });
        }

        // Ajouter l'étudiant à la liste
        session.attendees.push({ studentId });
        await session.save();

        res.status(200).json({ message: "Présence validée avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
//3.recuperation de la liste des etudiants
export const getSessionStatus = async (req, res) => {
    try {
        //  pour avoir les noms des élèves
        const session = await Session.findById(req.params.sessionId)
                                     .populate('attendees.studentId', 'nom prenom num_Authentication');
        
        if (!session) return res.status(404).json({ message: "Session non trouvée" });
        
        res.status(200).json({ session });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 4. Le Professeur ferme l'appel
export const closeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findByIdAndUpdate(sessionId, { isActive: false, endTime: Date.now() }, { new: true });
        
        res.status(200).json({ message: "Session fermée-à la prochaine", session });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la fermeture" });
    }
};