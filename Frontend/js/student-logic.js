async function submitPresence() {
    const code = document.getElementById('inputCode').value.toUpperCase();
    const token = localStorage.getItem('token');
    const feedback = document.getElementById('feedback');

    if (!code) return alert("Veuillez saisir le code !");

    try {
        const res = await fetch('http://localhost:4000/api/v1/sessions/mark-presence', {
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