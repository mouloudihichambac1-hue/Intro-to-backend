import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        
        if (!uri) {
            throw new Error("MONGODB_URI n'est pas définie dans les variables d'environnement.");
        }

        const connectionInstance = await mongoose.connect(uri);
        
        console.log(`✅ MongoDB connecté ! Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB :");
        console.error(error.message);
        setTimeout(() => process.exit(1), 5000);
    }
}

export default connectDB;