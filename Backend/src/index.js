import dotenv from 'dotenv';
import connectDB from './config/detabase.js';
import app from './app.js';
dotenv.config({
    path: '../.env'
});
const startServer =async () => {
    try {
        await connectDB();
        app.on("error",(error) => {
            console.log("Error in server",error);
            throw error;

        });
        app.listen(process.env.PORT ||8000, () => {
            console.log(`Server is running on port ${process.env.PORT ||8000}`);
        });
    } 
    catch (error) {
        console.log("Error in starting server" ,error);
        console.log("URI reçue :", process.env.MONGODB_URI);
    }
}
startServer();