const BASE_URL = "http://localhost:4000/api/v1/admins";

// --- 1. GESTION DES FENÊTRES (MODAL & SIDE PANEL) ---

function openModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = 'none';
}

function openEditPanel(id, role, nom, prenom, age, email, extraData) {
    const panel = document.getElementById('editPanel');
    if (panel) panel.classList.add('open');
    
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-role').value = role;
    document.getElementById('edit-nom').value = nom;
    document.getElementById('edit-prenom').value = prenom;
    document.getElementById('edit-age').value = age;
    document.getElementById('edit-email').value = email;

    const teacherFields = document.getElementById('teacher-only-edit');
    const studentFields = document.getElementById('student-only-edit');

    if (role === 'teacher') {
        teacherFields.style.display = 'block';
        studentFields.style.display = 'none';
        document.getElementById('edit-adders').value = extraData || "";
    } else {
        teacherFields.style.display = 'none';
        studentFields.style.display = 'block';
        // On pré-sélectionne la filière si extraData contient l'ID
        document.getElementById('edit-filiere').value = extraData || "";
    }
}


function closeEditPanel() {
    const panel = document.getElementById('editPanel');
    if (panel) panel.classList.remove('open');
}

// Affichage dynamique du champ spécialité dans le Modal d'ajout
function toggleSpeciality() {
    const userType = document.getElementById('userType').value;
    const specContainer = document.getElementById('speciality-container');
    const filiereContainer = document.getElementById('filiere-container');

    if (userType === 'teacher') {
        // Mode Enseignant
        specContainer.style.display = 'block';   // Montre spécialité
        filiereContainer.style.display = 'none'; // Cache filière
        
        // Optionnel : vider la valeur de la filière pour éviter les erreurs
        document.getElementById('studentFiliere').value = "";
    } else {
        // Mode Étudiant
        specContainer.style.display = 'none';    // Cache spécialité
        filiereContainer.style.display = 'block'; // Montre filière
        
        // Optionnel : vider la spécialité
        document.getElementById('speciality').value = "";
    }
}

// Fermeture des fenêtres en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('addModal');
    if (event.target == modal) closeModal();
};
//le nomme pour le Bienvenu
document.addEventListener('DOMContentLoaded', async () => {
    const univSpan = document.getElementById('univ-name');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${BASE_URL}/getAdmin`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Vérifions si le backend renvoie 'AdminName' ou juste 'name'
            univSpan.innerText = "Bienvenu : "+ data.username.toUpperCase(); 
        } else {
            univSpan.innerText = "Rafraicher la page,et resayer";
        }
    } catch (error) {
        console.error("Erreur d'affichage :", error);
        univSpan.innerText = "Erreur réseau";
    }
});
//get membrs
async function loadMembers() {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('membersBody');
    const filterSelect = document.getElementById('filterType');
    const filter = filterSelect ? filterSelect.value : "all";
    
    if (!tbody) return;
    tbody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>Récupération des données...</td></tr>";

    try {
        let students = [];
        let teachers = [];

        // Appels API conditionnels selon le filtre
        if (filter === "all" || filter === "student") {
            const res = await fetch(`${BASE_URL}/getStudents`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
            students = await res.json();
            
        }

        if (filter === "all" || filter === "teacher") {
            const res = await fetch(`${BASE_URL}/getTeachers`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
            teachers = await res.json();
        }

        tbody.innerHTML = ""; // Nettoyage du tableau

        // Rendu des professeurs
        if (filter === "all" || filter === "teacher") {
            teachers.forEach(t => renderRow(t, 'teacher', tbody));
        }
        
        // Rendu des étudiants
        if (filter === "all" || filter === "student") {
            students.forEach(s => renderRow(s, 'student', tbody));
        }

        if (tbody.innerHTML === "") {
            tbody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>Aucun membre trouvé.</td></tr>";
        }

    } catch (error) {
        console.error("Erreur de récupération:", error);
        tbody.innerHTML = "<tr><td colspan='8' style='text-align:center; color:red;'>Erreur de connexion au serveur.</td></tr>";
    }
}

function renderRow(user, role, container) {
    // On récupère la donnée spécifique selon le rôle
    const extraData = role === 'teacher' ? user.speciality : (user.filiere?._id || user.filiere);
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.num_Authentication || 'N/A'}</td>
        <td><span class="badge ${role}">${role === 'teacher' ? 'Prof' : 'Élève'}</span></td>
        <td>${user.nom}</td>
        <td>${user.prenom}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td>${user.sex || 'N/A'}</td>
        <td>
            <button class="btn-edit" onclick="openEditPanel('${user._id}', '${role}', '${user.nom}', '${user.prenom}', ${user.age}, '${user.email}', '${extraData}')" title="Modifier">✏️</button>
            <button class="btn-delete" onclick="deleteUser('${user._id}', '${role}')" title="Supprimer">🗑️</button>
        </td>
    `;
    container.appendChild(row);
}

// --- 3. ACTIONS DE MODIFICATION (POST, PATCH, DELETE) ---

// AJOUT (POST)
// Écouteur sur la soumission du formulaire
document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const token = localStorage.getItem('token');
    const userType = document.getElementById('userType').value;

    // 1. Données communes
    const baseData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        num_Authentication: document.getElementById('num_auth').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    let endpoint = "";
    let finalData = { ...baseData };

    // 2. Distinction selon le rôle
    if (userType === 'student') {
        const filiereId = document.getElementById('studentFiliere').value;
        if (!filiereId) return alert("Veuillez sélectionner une filière pour l'étudiant");
        
        finalData.filiere = filiereId;
        endpoint = "/registerStudent";
    } else {
        const speciality = document.getElementById('speciality').value;
        if (!speciality) return alert("Veuillez saisir la spécialité de l'enseignant");
        
        finalData.speciality = speciality;
        endpoint = "/registerTeacher";
    }

    // 3. Envoi au serveur
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(finalData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Membre enregistré avec succès !");
            closeModal();
            document.getElementById('addMemberForm').reset();
            loadMembers(); // Rafraîchir le tableau
        } else {
            alert("Erreur : " + result.message);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
        alert("Impossible de contacter le serveur.");
    }
});


// MISE À JOUR (PATCH)
const editForm = document.getElementById('editMemberForm');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token'); // Récupération du token
        const id = document.getElementById('edit-id').value;
        const role = document.getElementById('edit-role').value;
        
        const updates = {
            nom: document.getElementById('edit-nom').value,
            prenom: document.getElementById('edit-prenom').value,
            age: parseInt(document.getElementById('edit-age').value),
            email: document.getElementById('edit-email').value
        };

        // Si c'est un enseignant,  mettre à jour sa spécialité
        if (role === 'teacher') {
            updates.speciality = document.getElementById('edit-adders').value;
        }

        const endpoint = role === 'student' ? 'updateStudent' : 'updateTeacher';

        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Header indispensable
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                alert("Modification enregistrée !");
                closeEditPanel();
                loadMembers();
            } else {
                const err = await response.json();
                alert("Erreur: " + err.message);
            }
        } catch (error) {
            console.error("Erreur PATCH:", error);
            alert("Erreur lors de la mise à jour.");
        }
    });
}

// SUPPRESSION (DELETE)
async function deleteUser(id, role) {
    const token = localStorage.getItem('token');
    const displayRole = role === 'student' ? 'étudiant' : 'enseignant';
    
    if (!confirm(`Supprimer définitivement cet ${displayRole} ?`)) return;

    const endpoint = role === 'student' ? 'deleteStudent' : 'deleteTeacher';
    
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Token requis pour la sécurité
            }
        });

        if (response.ok) {
            loadMembers();
        } else {
            alert("Erreur lors de la suppression.");
        }
    } catch (error) {
        console.error("Erreur DELETE:", error);
        alert("Erreur serveur lors de la suppression.");
    }
}

// --- 4. AUTHENTICATION & UTILITAIRES ---

function logout() {
    if (confirm("Voulez-vous vous déconnecter ?")) {
        localStorage.removeItem('token');
        window.location.href = "login.html";
    }
}
// Fonction pour charger les filières dans le menu déroulant du formulaire
async function loadFilieresList() {
    const token = localStorage.getItem('token');
    const filiereSelect = document.getElementById('studentFiliere');
    const editFiliereSelect = document.getElementById('edit-filiere');
    if (!filiereSelect) return;

    try {
        const response = await fetch('http://localhost:4000/api/v1/admins/getFilieres', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const filieres = await response.json();

        // vide le menu (sauf la première option par défaut)
        filiereSelect.innerHTML = '<option value="">-- Choisir une filière --</option>';

        filieres.forEach(filiere => {
            const option = document.createElement('option');
            option.value = filiere._id; // C'est l'ID technique envoyé au Backend
            option.textContent = filiere.nom.toUpperCase(); // C'est le nom affiché à l'Admin
            filiereSelect.appendChild(option);
            if(editFiliereSelect) editFiliereSelect.appendChild(option.cloneNode(true));
        });

    } catch (error) {
        console.error("Erreur lors du chargement des filières :", error);
    }
}
// --- 1. CHARGER ET AFFICHER LES FILIÈRES ---
async function displayFilieres() {
    const tbody = document.getElementById('filiereBody');
    const token = localStorage.getItem('token');
    if (!tbody) return;

    try {
        const res = await fetch('http://localhost:4000/api/v1/admins/getFilieres', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const filieres = await res.json();

        tbody.innerHTML = "";
        filieres.forEach(f => {
            const row = `
                <tr>
                    <td><strong>${f.nom.toUpperCase()}</strong></td>
                    <td>
                        <button class="btn-edit" onclick="editFilierePrompt('${f._id}', '${f.nom}')">✏️</button>
                        <button class="btn-delete" onclick="removeFiliere('${f._id}')">🗑️</button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) {
        console.error("Erreur d'affichage des filières", err);
    }
}

// --- 2. CRÉER UNE FILIÈRE (POST) ---
async function createNewFiliere() {
    const nomInput = document.getElementById('newFiliereName');
    const token = localStorage.getItem('token');

    

    try {
        const res = await fetch('http://localhost:4000/api/v1/admins/registerFiliere', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nom: nomInput.value })
        });

        if (res.ok) {
            nomInput.value = "";
            displayFilieres(); // Rafraîchir la liste
            loadFilieresList(); // Rafraîchir le menu déroulant du formulaire étudiant
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (err) { alert("Erreur lors de la création"); }
}

// --- 3. SUPPRIMER UNE FILIÈRE (DELETE) ---
async function removeFiliere(id) {
    if (!confirm("Supprimer cette filière ? Les étudiants liés risquent d'avoir des problèmes de pointage.")) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:4000/api/v1/admins/deleteFiliere/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            displayFilieres();
            loadFilieresList();
        }
    } catch (err) { alert("Erreur de suppression"); }
}

// --- 4. MODIFIER UNE FILIÈRE (PATCH) ---
async function editFilierePrompt(id, oldName) {
    const newName = prompt("Nouveau nom pour la filière :", oldName);
    if (!newName || newName === oldName) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:4000/api/v1/admins/updateFiliere/${id}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nom: newName })
        });

        if (res.ok) {
            displayFilieres();
            loadFilieresList();
        }
    } catch (err) { alert("Erreur de modification"); }
}
const filterType = document.getElementById('filterType');
if (filterType) {
    filterType.addEventListener('change', loadMembers);
}
window.onload = () => {
    displayFilieres();
    loadMembers();
    loadFilieresList(); 
    
    
};