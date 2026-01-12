import mongoose from 'mongoose';

const filiereSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true, 
        trim: true 
    },
    university: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: true 
    }
}, { timestamps: true });

export const Filiere = mongoose.model('Filiere', filiereSchema);