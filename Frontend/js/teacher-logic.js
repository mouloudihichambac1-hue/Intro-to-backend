const pc_mob =window.location.hostname;
const BASE_URL = `http://${pc_mob}:4000/api/v1/sessions`;
const BASE_URL1 = `http://${pc_mob}:4000/api/v1/teachers`;
let currentSessionId = null;
let refreshInterval = null;

// --- 1. LANCER LA SESSION (POST) ---
async function generateSession() {
    const course = document.getElementById('courseName').value;
    const token = localStorage.getItem('token');
    
    if (!course) return alert("Veuillez saisir un nom de cours.");

    // Génération d'un code aléatoire de 5 lettres/chiffres
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    try {
        const res = await fetch(`${BASE_URL}/start`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ courseName: course, sessionCode: randomCode })
        });

        const data = await res.json();
        if (res.ok) {
            currentSessionId = data.session._id;
            document.getElementById('displayCode').innerText = randomCode;
            document.getElementById('activeCodeDisplay').style.display = 'block';
            document.getElementById('stopBtn').disabled = false;
            
            // Lancer la surveillance en temps réel
            startRealTimeTracking();
        } else {
            alert("Erreur serveur : " + data.message);
        }
    } catch (err) { 
        console.error(err);
        alert("Erreur de lancement de session."); 
    }
}

// --- 2. SURVEILLANCE EN TEMPS RÉEL (POLLING) ---
function startRealTimeTracking() {
    // nettoie un éventuel ancien intervalle avant de commencer
    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(async () => {
        if (!currentSessionId) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/status/${currentSessionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.session && data.session.attendees) {
                updateAttendanceTable(data.session.attendees);
            }
        } catch (err) {
            console.error("Erreur de rafraîchissement :", err);
        }
    }, 3000); // Toutes les 3 secondes
}

// --- 3. METTRE À JOUR LE TABLEAU ---
function updateAttendanceTable(attendees) {
    const tbody = document.getElementById('attendanceBody');
    document.getElementById('presentCount').innerText = attendees.length;
    
    if (attendees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty">En attente des étudiants...</td></tr>';
        return;
    }

    tbody.innerHTML = "";
    attendees.forEach(entry => {
        
        const student = entry.studentId;
        const row = `<tr>
            <td>${new Date(entry.timestamp).toLocaleTimeString()}</td>
            <td>${student.num_Authentication || '---'}</td>
            <td>${student.nom} ${student.prenom}</td>
            <td><span class="badge-present" style="color: green; font-weight: bold;">● PRÉSENT</span></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// --- 4. FERMER LA SESSION (STOP) ---
async function stopSession() {
    if (!confirm("Voulez-vous vraiment clore cette session d'appel ?")) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${BASE_URL}/end/${currentSessionId}`, {
            method: 'PATCH', 
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            clearInterval(refreshInterval); // Arrête le rafraîchissement
            document.getElementById('stopBtn').disabled = true;
            document.getElementById('activeCodeDisplay').style.display = 'none';
            alert("Session terminée avec succès.");
        }
    } catch (err) {
        alert("Erreur lors de la fermeture de la session.");
    }
}

// --- 5. DÉCONNEXION ---
function logout() {
    if (confirm("Voulez-vous vous déconnecter ?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = "login.html?role=prof";
    }
}
//salutation
document.addEventListener('DOMContentLoaded', async () => {
    const profheader = document.getElementById('prof-name');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${BASE_URL1}/getTeacher1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            profheader.innerText = "Bienvenu : "+ data.nom.toUpperCase() +" "+data.prenom.toUpperCase(); 
        } else {
            console.warn("Impossible de récupérer le profil prof");
           profheader.innerText = "Rafraicher la page,et resayer";
        }
    } catch (error) {
        console.error("Erreur d'affichage :", error);
        profheader.innerText = "Erreur réseau";
    }
});