// Get elements from the DOM
const counterElement = document.getElementById('counter');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const resetBtn = document.getElementById('reset');
const stepSizeInput = document.getElementById('stepSize');
const add10Btn = document.getElementById('add10');
const add100Btn = document.getElementById('add100');
const subtract10Btn = document.getElementById('subtract10');
const subtract100Btn = document.getElementById('subtract100');
const totalClicksElement = document.getElementById('totalClicks');
const highestValueElement = document.getElementById('highestValue');
const lowestValueElement = document.getElementById('lowestValue');
const historyElement = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistory');

// Initialize counter value and statistics
let count = 0;
let totalClicks = 0;
let highestValue = 0;
let lowestValue = 0;
let history = [];

// Function to update the counter display
function updateCounter() {
    counterElement.textContent = count;
    
    // Add color classes based on counter value
    counterElement.classList.remove('positive', 'negative', 'zero');
    
    if (count > 0) {
        counterElement.classList.add('positive');
    } else if (count < 0) {
        counterElement.classList.add('negative');
    } else {
        counterElement.classList.add('zero');
    }
    
    // Update statistics
    updateStats();
}

// Function to update statistics
function updateStats() {
    totalClicksElement.textContent = totalClicks;
    
    if (count > highestValue) {
        highestValue = count;
        highestValueElement.textContent = highestValue;
    }
    
    if (count < lowestValue) {
        lowestValue = count;
        lowestValueElement.textContent = lowestValue;
    }
}

// Function to add entry to history
function addToHistory(action, value, newCount) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = {
        action,
        value,
        newCount,
        timestamp
    };
    
    history.unshift(historyItem);
    
    // Keep only last 10 entries
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

// Function to update history display
function updateHistoryDisplay() {
    historyElement.innerHTML = '';
    
    if (history.length === 0) {
        historyElement.innerHTML = '<div class="history-item">No recent changes</div>';
        return;
    }
    
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        if (item.action === 'reset') {
            div.classList.add('reset');
            div.textContent = `${item.timestamp}: Reset to ${item.newCount}`;
        } else {
            div.classList.add(item.value > 0 ? 'positive' : 'negative');
            const sign = item.value > 0 ? '+' : '';
            div.textContent = `${item.timestamp}: ${sign}${item.value} → ${item.newCount}`;
        }
        
        historyElement.appendChild(div);
    });
}

// Function to get current step size
function getStepSize() {
    return parseInt(stepSizeInput.value) || 1;
}

// Function to add a small animation effect
function animateCounter() {
    counterElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        counterElement.style.transform = 'scale(1)';
    }, 150);
}

// Event listeners for buttons
increaseBtn.addEventListener('click', () => {
    const step = getStepSize();
    count += step;
    totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('increase', step, count);
});

decreaseBtn.addEventListener('click', () => {
    const step = getStepSize();
    count -= step;
    totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('decrease', -step, count);
});

resetBtn.addEventListener('click', () => {
    count = 0;
    totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('reset', 0, count);
});

// Quick action buttons
add10Btn.addEventListener('click', () => {
    count += 10;
    totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', 10, count);
});

add100Btn.addEventListener('click', () => {
    count += 100;
    totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', 100, count);
});

subtract10Btn.addEventListener('click', () => {
    count -= 10;
    totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', -10, count);
});

subtract100Btn.addEventListener('click', () => {
    count -= 100;
    totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', -100, count);
});

// Clear history button
clearHistoryBtn.addEventListener('click', () => {
    history = [];
    updateHistoryDisplay();
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    const step = getStepSize();
    
    switch(event.key) {
        case 'ArrowUp':
        case '+':
            count += step;
            totalClicks++;
            updateCounter();
            animateCounter();
            addToHistory('keyboard', step, count);
            break;
        case 'ArrowDown':
        case '-':
            count -= step;
            totalClicks++;
            updateCounter();
            animateCounter();
            addToHistory('keyboard', -step, count);
            break;
        case ' ':
        case 'r':
        case 'R':
            count = 0;
            totalClicks++;
            updateCounter();
            animateCounter();
            addToHistory('reset', 0, count);
            event.preventDefault(); // Prevent default space bar behavior
            break;
    }
});

// Initialize the display
updateCounter();
updateHistoryDisplay();
