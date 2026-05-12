const pc_mob =window.location.hostname;
const BASE_URL2 = `http://${pc_mob}:4000/api/v1/students`;
async function submitPresence() {
    const code = document.getElementById('inputCode').value.toUpperCase();
    const token = localStorage.getItem('token');
    const feedback = document.getElementById('feedback');

    if (!code) return alert("Veuillez saisir le code !");

    try {
        const res = await fetch(`http://${pc_mob}:4000/api/v1/sessions/mark-presence`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionCode: code })
        });

        const data = await res.json();

        if (res.ok) {
            feedback.innerText = "✅ Présence enregistrée !";
            feedback.className = "msg success";
            document.getElementById('btnMark').disabled = true;
        } else {
            feedback.innerText = "❌ " + data.message;
            feedback.className = "msg error";
        }
    } catch (err) {
        feedback.innerText = "Erreur de connexion au serveur.";
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const studheader = document.getElementById('student-name1');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${BASE_URL2}/getStudent1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            studheader.innerText = "Bienvenu : "+ data.nom.toUpperCase() +" "+data.prenom.toUpperCase(); 
        } else {
            console.warn("Impossible de récupérer le profil etudiant");
           studheader.innerText = "Rafraicher la page,et resayer";
        }
    } catch (error) {
        console.error("Erreur d'affichage :", error);
        studheader.innerText = "Erreur réseau";
    }
});