import mongoose, { Schema } from 'mongoose';

const sessionSchema = new Schema(
    {
        
        university: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: true
        },
        courseName: {
            type: String,
            required: true,
            trim: true
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher', // Lien vers le modèle Teacher
            required: true
        },
        // Le code que l'étudiant doit saisir ou le jeton de session
        sessionCode: {
            type: String,
            required: true,
            unique: true
        },
        isActive: {
            type: Boolean,
            default: true // La session est ouverte dès qu'elle est créée
        },
        // Liste des étudiants ayant marqué leur présence
        attendees: [
            {
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Student'
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        startTime: {
            type: Date,
            default: Date.now
        },
        endTime: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export const Session = mongoose.model('Session', sessionSchema);