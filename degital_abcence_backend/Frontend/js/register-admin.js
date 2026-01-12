document.getElementById('registerAdminForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupération des données
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Route  de fichier app.js
    const apiUrl = "http://localhost:4000/api/v1/admins/registerAdmin";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Université enregistrée avec succès !");
            // Redirection vers le login après succès
            window.location.href = "login.html?role=admin";
        } else {
            alert("Erreur d'inscription : " + (data.message || "Vérifiez vos informations"));
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Impossible de joindre le serveur Backend.");
    }
});