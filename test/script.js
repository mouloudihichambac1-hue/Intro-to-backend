// Game State
const state = {
    wallet: 0.00,
    sandwich: [],
    currentCategory: 'bread'
};

// Ingredients Data
const ingredients = {
    bread: [
        { id: 'white_bread', name: 'Pain Blanc', price: 2.00, emoji: '🍞', color: '#F5DEB3' },
        { id: 'baguette', name: 'Baguette', price: 2.50, emoji: '🥖', color: '#E6C288' },
        { id: 'bagel', name: 'Bagel', price: 3.00, emoji: '🥯', color: '#DEB887' }
    ],
    meat: [
        { id: 'ham', name: 'Jambon', price: 3.50, emoji: '🍖', color: '#FFB7B2' },
        { id: 'bacon', name: 'Bacon', price: 4.00, emoji: '🥓', color: '#CD5C5C' },
        { id: 'chicken', name: 'Poulet', price: 3.00, emoji: '🍗', color: '#F0E68C' }
    ],
    veggie: [
        { id: 'lettuce', name: 'Laitue', price: 1.00, emoji: '🥬', color: '#90EE90' },
        { id: 'tomato', name: 'Tomate', price: 1.50, emoji: '🍅', color: '#FF6347' },
        { id: 'cheese', name: 'Fromage', price: 2.00, emoji: '🧀', color: '#FFD700' },
        { id: 'onion', name: 'Oignon', price: 0.50, emoji: '🧅', color: '#E6E6FA' }
    ],
    sauce: [
        { id: 'ketchup', name: 'Ketchup', price: 0.50, emoji: '🥫', color: '#FF0000' },
        { id: 'mayo', name: 'Mayonnaise', price: 0.50, emoji: '🥚', color: '#FFFACD' },
        { id: 'mustard', name: 'Moutarde', price: 0.50, emoji: '🌭', color: '#FFD700' }
    ]
};

// DOM Elements
const walletDisplay = document.getElementById('wallet-balance');
const workBtn = document.getElementById('work-btn');
const shopGrid = document.getElementById('shop-grid');
const tabBtns = document.querySelectorAll('.tab-btn');
const sandwichStack = document.getElementById('sandwich-stack');
const eatBtn = document.getElementById('eat-btn');

// --- Game Logic ---

function updateWalletDisplay() {
    walletDisplay.textContent = state.wallet.toFixed(2);
    
    // Animate wallet update
    walletDisplay.parentElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        walletDisplay.parentElement.style.transform = 'scale(1)';
    }, 100);
}

workBtn.addEventListener('click', () => {
    state.wallet += 1.00;
    updateWalletDisplay();
    
    // Simple particle effect or feedback could go here
});

// --- Shop Logic ---

function renderShop(category) {
    shopGrid.innerHTML = '';
    const items = ingredients[category];
    
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'shop-item';
        itemEl.innerHTML = `
            <span class="shop-item-emoji">${item.emoji}</span>
            <span class="shop-item-name">${item.name}</span>
            <span class="shop-item-price">${item.price.toFixed(2)} €</span>
        `;
        
        itemEl.addEventListener('click', () => buyIngredient(item));
        shopGrid.appendChild(itemEl);
    });
}

function buyIngredient(item) {
    if (state.wallet >= item.price) {
        state.wallet -= item.price;
        updateWalletDisplay();
        addIngredientToSandwich(item);
    } else {
        alert("Pas assez d'argent ! Travaillez plus ! 💼");
    }
}

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');
        // Render new category
        renderShop(btn.dataset.category);
    });
});

// --- Builder Logic ---

function addIngredientToSandwich(item) {
    // Remove placeholder if it exists
    const placeholder = sandwichStack.querySelector('.placeholder-text');
    if (placeholder) {
        placeholder.remove();
    }

    state.sandwich.push(item);
    
    const layer = document.createElement('div');
    layer.className = 'ingredient-layer';
    layer.style.backgroundColor = item.color;
    layer.textContent = item.emoji;
    
    // Random slight rotation for "messy" realistic look
    const rotation = Math.random() * 10 - 5; // -5 to 5 degrees
    layer.style.transform = `rotate(${rotation}deg)`;
    
    sandwichStack.appendChild(layer);
    eatBtn.disabled = false;
}

eatBtn.addEventListener('click', () => {
    state.sandwich = [];
    sandwichStack.innerHTML = '<div class="placeholder-text">Miam ! C\'était délicieux. Recommencez !</div>';
    eatBtn.disabled = true;
});

// Init
renderShop('bread');
updateWalletDisplay();
