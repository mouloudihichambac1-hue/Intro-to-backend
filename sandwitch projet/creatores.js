const container = document.getElementById("ingredients");
const timerEl = document.getElementById("timer");

let timeLeft;
let interval;

function startClient() {
  timeLeft = Math.floor(Math.random() * 5) + 5; // 5–9s
  timerEl.textContent = timeLeft;

  clearInterval(interval);
  interval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      alert("⛔ Client left! Too slow.");
      resetSandwich();
    }
  }, 1000);
}

function addIngredient(type) {
  if (timeLeft <= 0) return;

  const layer = document.createElement("div");
  layer.className = type;
  layer.dataset.type = type;
  container.appendChild(layer);
}

function removeIngredient(type) {
  const layers = [...container.children].reverse();
  const target = layers.find(el => el.dataset.type === type);
  if (target) target.remove();
}

function resetSandwich() {
  container.innerHTML = "";
  startClient();
}

startClient();
