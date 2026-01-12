document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche la page de se recharger
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    // 1. Récupérer les données du formulaire
    const email = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;
    
    // 2. Détecter le rôle actuel via l'URL (pour savoir quelle API appeler)
    let apiUrl = "";

if (role === 'admin') {
    
    apiUrl = `http://localhost:4000/api/v1/admins/loginAdmin`;
} else if (role === 'prof') {
    
    apiUrl = `http://localhost:4000/api/v1/teachers/loginTeacher`;
} else {
    apiUrl = `http://localhost:4000/api/v1/students/loginStudent`;
}
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // SUCCÈS : On stocke le token et on redirige
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', role);
            
            alert("Connexion réussie ! Redirection...");
            window.location.href = `${role}-dashboard.html`; 
        } else {
            // ERREUR : On affiche le message d'erreur du backend
            alert("Erreur : " + (data.message || "Identifiants incorrects"));
        }
    } catch (error) {
        console.error("Erreur de connexion au serveur:", error);
        alert("Impossible de contacter le serveur. Vérifiez qu'il est bien lancé sur le port 4000.");
    }
});