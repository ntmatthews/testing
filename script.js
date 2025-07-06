// Get elements from the DOM
const counterElement = document.getElementById('counter');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const resetBtn = document.getElementById('reset');

// Initialize counter value
let count = 0;

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
    count++;
    updateCounter();
    animateCounter();
});

decreaseBtn.addEventListener('click', () => {
    count--;
    updateCounter();
    animateCounter();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateCounter();
    animateCounter();
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
        case '+':
            count++;
            updateCounter();
            animateCounter();
            break;
        case 'ArrowDown':
        case '-':
            count--;
            updateCounter();
            animateCounter();
            break;
        case ' ':
        case 'r':
        case 'R':
            count = 0;
            updateCounter();
            animateCounter();
            event.preventDefault(); // Prevent default space bar behavior
            break;
    }
});

// Initialize the display
updateCounter();
