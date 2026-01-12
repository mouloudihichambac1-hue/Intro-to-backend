import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Récupération du token dans les headers (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.user = decoded; // stocke les infos (id, email) dans l'objet request
        next(); // passe à la fonction suivante (le controller)
    } catch (error) {
        res.status(403).json({ message: "Token invalide ou expiré." });
    }
};