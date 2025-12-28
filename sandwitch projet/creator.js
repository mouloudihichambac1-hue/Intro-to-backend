
let timeLeft = 10; 
let timerInterval;
let timerStarted = false;

function startTimer() {
    if (timerStarted) return; 
    timerStarted = true;
    
    document.getElementById('start-timer-btn').disabled = true;
    document.getElementById('start-timer-btn').style.backgroundColor = '#ccc';

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown-display').innerText = `Temps restant : ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    document.getElementById('countdown-display').innerText = "Temps écoulé ! Trop tard !";
    document.getElementById('countdown-display').style.color = "black";
    //deux class de blockage
    document.querySelector('.left').classList.add('disabled-controls');
    document.querySelector('.right').classList.add('disabled-controls');
    
    alert("Fin du temps ! Votre sandwich est prêt (ou pas !).");
}
function addIngredient(type) {
    if (!timerStarted) {
        alert("Cliquez sur 'Démarrer la préparation' d'abord !");
        return;
    }
    const container = document.querySelector('.ingredients');
    const div = document.createElement('div');
    
    // On ajoute de classe correspondant à l'ingrédient (ex: salad, tomato)
    div.classList.add(type);
    
    container.prepend(div);
}

// Fonction pour supprimer les ingridients
function removeIngredient(type) {
    const container = document.querySelector('.ingredients');
    // On cherche tous les ingrédients de type .type
    const elements = container.querySelectorAll('.' + type);
    
    // si il existe des  element en les suprime.
    if (elements.length > 0) {
        elements[0].remove();
    }
}
//fonction pour acheter le sandwich
function Buy_Sandwich() {
    const container = document.querySelector('.ingredients');
    
    // Si le sandwich est vide, on n'achète rien
    if (container.children.length === 0) {
        alert("Ajoutez des ingrédients d'abord !");
        return;
    }

    // On vide le sandwich 
    container.innerHTML = "";
    
    
}

