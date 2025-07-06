// Get all DOM elements
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
const sessionTimeElement = document.getElementById('sessionTime');
const clicksPerMinuteElement = document.getElementById('clicksPerMinute');
const achievementCountElement = document.getElementById('achievementCount');
const historyElement = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistory');
const themeSelect = document.getElementById('themeSelect');
const soundToggle = document.getElementById('soundToggle');
const animationToggle = document.getElementById('animationToggle');
const progressBar = document.getElementById('progressBar');
const goalInput = document.getElementById('goalInput');
const setGoalBtn = document.getElementById('setGoal');
const currentGoalElement = document.getElementById('currentGoal');
const achievementsElement = document.getElementById('achievements');
const randomChallengeBtn = document.getElementById('randomChallenge');
const speedTestBtn = document.getElementById('speedTest');
const precisionTestBtn = document.getElementById('precisionTest');
const gameStatusElement = document.getElementById('gameStatus');
const saveDataBtn = document.getElementById('saveData');
const loadDataBtn = document.getElementById('loadData');
const exportDataBtn = document.getElementById('exportData');
const resetAllBtn = document.getElementById('resetAll');
const clickSound = document.getElementById('clickSound');
const achievementSound = document.getElementById('achievementSound');

// Initialize application state
let gameState = {
    count: 0,
    totalClicks: 0,
    highestValue: 0,
    lowestValue: 0,
    sessionStartTime: Date.now(),
    achievements: [],
    history: [],
    currentGoal: null,
    gameMode: null,
    gameData: {}
};

// Achievements system
const ACHIEVEMENTS = [
    { id: 'first_click', name: 'First Step', description: 'Make your first click', condition: () => gameState.totalClicks >= 1 },
    { id: 'ten_clicks', name: 'Getting Started', description: 'Reach 10 clicks', condition: () => gameState.totalClicks >= 10 },
    { id: 'hundred_clicks', name: 'Century Club', description: 'Reach 100 clicks', condition: () => gameState.totalClicks >= 100 },
    { id: 'reach_100', name: 'Centurion', description: 'Reach count of 100', condition: () => gameState.highestValue >= 100 },
    { id: 'reach_1000', name: 'Millennium', description: 'Reach count of 1000', condition: () => gameState.highestValue >= 1000 },
    { id: 'go_negative', name: 'Underground', description: 'Go below zero', condition: () => gameState.lowestValue < 0 },
    { id: 'big_range', name: 'Extreme Range', description: 'Have a range of 200 between highest and lowest', condition: () => (gameState.highestValue - gameState.lowestValue) >= 200 },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Click 60 times in a minute', condition: () => getClicksPerMinute() >= 60 },
    { id: 'goal_achiever', name: 'Goal Achiever', description: 'Complete 5 goals', condition: () => gameState.achievements.filter(a => a.includes('goal_completed')).length >= 5 }
];

// Utility functions
function playSound(soundElement) {
    if (soundToggle.checked && soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(() => {}); // Ignore autoplay policy errors
    }
}

function getSessionTime() {
    const elapsed = Date.now() - gameState.sessionStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getClicksPerMinute() {
    const elapsed = (Date.now() - gameState.sessionStartTime) / 60000;
    return elapsed > 0 ? Math.round(gameState.totalClicks / elapsed) : 0;
}

function getStepSize() {
    return parseInt(stepSizeInput.value) || 1;
}

function updateProgressBar() {
    if (gameState.currentGoal) {
        const progress = Math.min(100, Math.abs((gameState.count / gameState.currentGoal.target) * 100));
        progressBar.style.width = `${progress}%`;
    } else {
        const normalizedValue = Math.max(0, Math.min(100, ((gameState.count + 100) / 200) * 100));
        progressBar.style.width = `${normalizedValue}%`;
    }
}

// Core update functions
function updateCounter() {
    counterElement.textContent = gameState.count;
    
    // Update color classes
    counterElement.classList.remove('positive', 'negative', 'zero');
    if (gameState.count > 0) {
        counterElement.classList.add('positive');
    } else if (gameState.count < 0) {
        counterElement.classList.add('negative');
    } else {
        counterElement.classList.add('zero');
    }
    
    updateStats();
    updateProgressBar();
    checkAchievements();
    checkGoalCompletion();
}

function updateStats() {
    totalClicksElement.textContent = gameState.totalClicks;
    sessionTimeElement.textContent = getSessionTime();
    clicksPerMinuteElement.textContent = getClicksPerMinute();
    achievementCountElement.textContent = gameState.achievements.length;
    
    if (gameState.count > gameState.highestValue) {
        gameState.highestValue = gameState.count;
        highestValueElement.textContent = gameState.highestValue;
    }
    
    if (gameState.count < gameState.lowestValue) {
        gameState.lowestValue = gameState.count;
        lowestValueElement.textContent = gameState.lowestValue;
    }
}

function addToHistory(action, value, newCount) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = { action, value, newCount, timestamp };
    
    gameState.history.unshift(historyItem);
    
    if (gameState.history.length > 10) {
        gameState.history = gameState.history.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyElement.innerHTML = '';
    
    if (gameState.history.length === 0) {
        historyElement.innerHTML = '<div class="history-item">No recent changes</div>';
        return;
    }
    
    gameState.history.forEach(item => {
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

// Animation function
function animateCounter() {
    if (animationToggle.checked) {
        counterElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            counterElement.style.transform = 'scale(1)';
        }, 150);
    }
}

// Achievement system
function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id) && achievement.condition()) {
            unlockAchievement(achievement);
        }
    });
}

function unlockAchievement(achievement) {
    gameState.achievements.push(achievement.id);
    
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement';
    achievementElement.textContent = achievement.name;
    achievementElement.title = achievement.description;
    achievementsElement.appendChild(achievementElement);
    
    playSound(achievementSound);
    
    // Show notification
    showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.5s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Goal system
function setGoal() {
    const target = parseInt(goalInput.value);
    if (target && !isNaN(target)) {
        gameState.currentGoal = {
            target: target,
            startValue: gameState.count,
            startTime: Date.now()
        };
        updateGoalDisplay();
        goalInput.value = '';
        showNotification(`🎯 Goal set: Reach ${target}`);
    }
}

function updateGoalDisplay() {
    if (gameState.currentGoal) {
        const remaining = gameState.currentGoal.target - gameState.count;
        currentGoalElement.innerHTML = `
            <strong>Goal: ${gameState.currentGoal.target}</strong><br>
            Remaining: ${remaining}
        `;
        currentGoalElement.style.display = 'block';
    } else {
        currentGoalElement.style.display = 'none';
    }
}

function checkGoalCompletion() {
    if (gameState.currentGoal && gameState.count === gameState.currentGoal.target) {
        const goalId = `goal_completed_${Date.now()}`;
        gameState.achievements.push(goalId);
        
        currentGoalElement.classList.add('completed');
        showNotification('🎉 Goal Completed!');
        playSound(achievementSound);
        
        setTimeout(() => {
            gameState.currentGoal = null;
            currentGoalElement.classList.remove('completed');
            updateGoalDisplay();
        }, 2000);
    }
}

// Game modes
function startRandomChallenge() {
    const challenges = [
        { name: 'Reach exactly 42', target: 42, type: 'exact' },
        { name: 'Get to -25', target: -25, type: 'exact' },
        { name: 'Reach any number above 200', target: 200, type: 'above' },
        { name: 'Go below -50', target: -50, type: 'below' }
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    gameState.gameMode = 'challenge';
    gameState.gameData = challenge;
    
    gameStatusElement.textContent = `Challenge: ${challenge.name}`;
    showNotification(`🎲 Challenge: ${challenge.name}`);
}

function startSpeedTest() {
    gameState.gameMode = 'speed';
    gameState.gameData = {
        startTime: Date.now(),
        startClicks: gameState.totalClicks,
        duration: 30000
    };
    
    gameStatusElement.textContent = 'Speed Test: Click as fast as you can! (30s)';
    
    const timer = setInterval(() => {
        const elapsed = Date.now() - gameState.gameData.startTime;
        const remaining = Math.max(0, 30 - Math.floor(elapsed / 1000));
        
        if (remaining === 0) {
            clearInterval(timer);
            const totalClicks = gameState.totalClicks - gameState.gameData.startClicks;
            gameStatusElement.textContent = `Speed Test Complete! You clicked ${totalClicks} times in 30 seconds!`;
            gameState.gameMode = null;
            showNotification(`⚡ Speed Test: ${totalClicks} clicks in 30s!`);
        } else {
            gameStatusElement.textContent = `Speed Test: ${remaining}s remaining`;
        }
    }, 1000);
}

function startPrecisionTest() {
    const targetValue = Math.floor(Math.random() * 200) - 100;
    gameState.gameMode = 'precision';
    gameState.gameData = {
        target: targetValue,
        startValue: gameState.count,
        attempts: 0
    };
    
    gameStatusElement.textContent = `Precision Test: Reach exactly ${targetValue} (Currently: ${gameState.count})`;
    showNotification(`🎯 Precision Test: Reach exactly ${targetValue}`);
}

function checkGameProgress() {
    if (!gameState.gameMode) return;
    
    if (gameState.gameMode === 'challenge') {
        const challenge = gameState.gameData;
        let completed = false;
        
        if (challenge.type === 'exact' && gameState.count === challenge.target) {
            completed = true;
        } else if (challenge.type === 'above' && gameState.count > challenge.target) {
            completed = true;
        } else if (challenge.type === 'below' && gameState.count < challenge.target) {
            completed = true;
        }
        
        if (completed) {
            gameStatusElement.textContent = `Challenge Complete! 🎉`;
            showNotification('🏆 Challenge Completed!');
            gameState.gameMode = null;
        }
    } else if (gameState.gameMode === 'precision') {
        gameState.gameData.attempts++;
        
        if (gameState.count === gameState.gameData.target) {
            gameStatusElement.textContent = `Precision Test Complete! 🎯 (${gameState.gameData.attempts} attempts)`;
            showNotification(`🎯 Precision Complete in ${gameState.gameData.attempts} attempts!`);
            gameState.gameMode = null;
        } else {
            gameStatusElement.textContent = `Precision Test: Reach exactly ${gameState.gameData.target} (Currently: ${gameState.count}, Attempts: ${gameState.gameData.attempts})`;
        }
    }
}

// Event listeners for all buttons
increaseBtn.addEventListener('click', () => {
    const step = getStepSize();
    gameState.count += step;
    gameState.totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('increase', step, gameState.count);
    playSound(clickSound);
    checkGameProgress();
});

decreaseBtn.addEventListener('click', () => {
    const step = getStepSize();
    gameState.count -= step;
    gameState.totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('decrease', -step, gameState.count);
    playSound(clickSound);
    checkGameProgress();
});

resetBtn.addEventListener('click', () => {
    gameState.count = 0;
    gameState.totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('reset', 0, gameState.count);
    playSound(clickSound);
    checkGameProgress();
});

// Quick action buttons
add10Btn.addEventListener('click', () => {
    gameState.count += 10;
    gameState.totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', 10, gameState.count);
    playSound(clickSound);
    checkGameProgress();
});

add100Btn.addEventListener('click', () => {
    gameState.count += 100;
    gameState.totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', 100, gameState.count);
    playSound(clickSound);
    checkGameProgress();
});

subtract10Btn.addEventListener('click', () => {
    gameState.count -= 10;
    gameState.totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', -10, gameState.count);
    playSound(clickSound);
    checkGameProgress();
});

subtract100Btn.addEventListener('click', () => {
    gameState.count -= 100;
    gameState.totalClicks++;
    updateCounter();
    animateCounter();
    addToHistory('quick', -100, gameState.count);
    playSound(clickSound);
    checkGameProgress();
});

// Settings and controls
themeSelect.addEventListener('change', (e) => {
    changeTheme(e.target.value);
});

setGoalBtn.addEventListener('click', setGoal);

goalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setGoal();
    }
});

// Game mode buttons
randomChallengeBtn.addEventListener('click', startRandomChallenge);
speedTestBtn.addEventListener('click', startSpeedTest);
precisionTestBtn.addEventListener('click', startPrecisionTest);

// Data management buttons
saveDataBtn.addEventListener('click', saveData);
loadDataBtn.addEventListener('click', loadData);
exportDataBtn.addEventListener('click', exportData);
resetAllBtn.addEventListener('click', resetAll);

// Clear history button
clearHistoryBtn.addEventListener('click', () => {
    gameState.history = [];
    updateHistoryDisplay();
    showNotification('🧹 History cleared!');
});

// Enhanced keyboard support
document.addEventListener('keydown', (event) => {
    const step = getStepSize();
    
    switch(event.key) {
        case 'ArrowUp':
        case '+':
            gameState.count += step;
            gameState.totalClicks++;
            updateCounter();
            animateCounter();
            addToHistory('keyboard', step, gameState.count);
            playSound(clickSound);
            checkGameProgress();
            break;
        case 'ArrowDown':
        case '-':
            gameState.count -= step;
            gameState.totalClicks++;
            updateCounter();
            animateCounter();
            addToHistory('keyboard', -step, gameState.count);
            playSound(clickSound);
            checkGameProgress();
            break;
        case ' ':
        case 'r':
        case 'R':
            gameState.count = 0;
            gameState.totalClicks++;
            updateCounter();
            animateCounter();
            addToHistory('reset', 0, gameState.count);
            playSound(clickSound);
            checkGameProgress();
            event.preventDefault();
            break;
        case 's':
        case 'S':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                saveData();
            }
            break;
        case 'l':
        case 'L':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                loadData();
            }
            break;
    }
});

// Data persistence and theme functions
function saveData() {
    const saveData = {
        ...gameState,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('counterAppData', JSON.stringify(saveData));
    showNotification('💾 Data saved successfully!');
}

function loadData() {
    const saved = localStorage.getItem('counterAppData');
    if (saved) {
        const data = JSON.parse(saved);
        gameState = { ...gameState, ...data };
        gameState.sessionStartTime = Date.now();
        
        updateCounter();
        updateHistoryDisplay();
        updateGoalDisplay();
        
        achievementsElement.innerHTML = '';
        gameState.achievements.forEach(id => {
            const achievement = ACHIEVEMENTS.find(a => a.id === id) || { name: 'Unknown', description: 'Legacy achievement' };
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement';
            achievementElement.textContent = achievement.name;
            achievementElement.title = achievement.description;
            achievementsElement.appendChild(achievementElement);
        });
        
        showNotification('📂 Data loaded successfully!');
    } else {
        showNotification('❌ No saved data found!');
    }
}

function exportData() {
    const exportData = {
        ...gameState,
        exportedAt: new Date().toISOString(),
        version: '2.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `counter-app-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('📊 Data exported successfully!');
}

function resetAll() {
    if (confirm('Are you sure you want to reset everything? This cannot be undone!')) {
        gameState = {
            count: 0,
            totalClicks: 0,
            highestValue: 0,
            lowestValue: 0,
            sessionStartTime: Date.now(),
            achievements: [],
            history: [],
            currentGoal: null,
            gameMode: null,
            gameData: {}
        };
        
        localStorage.removeItem('counterAppData');
        achievementsElement.innerHTML = '';
        gameStatusElement.textContent = '';
        
        updateCounter();
        updateHistoryDisplay();
        updateGoalDisplay();
        
        showNotification('🔄 Everything has been reset!');
    }
}

function changeTheme(themeName) {
    document.body.className = '';
    if (themeName !== 'default') {
        document.body.classList.add(`${themeName}-theme`);
    }
    localStorage.setItem('counterAppTheme', themeName);
}

// Auto-update session time
setInterval(() => {
    sessionTimeElement.textContent = getSessionTime();
    clicksPerMinuteElement.textContent = getClicksPerMinute();
}, 1000);

// Initialize the application
function init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('counterAppTheme');
    if (savedTheme) {
        themeSelect.value = savedTheme;
        changeTheme(savedTheme);
    }
    
    // Load saved data
    const saved = localStorage.getItem('counterAppData');
    if (saved) {
        loadData();
    } else {
        updateCounter();
        updateHistoryDisplay();
        updateGoalDisplay();
    }
    
    gameStatusElement.textContent = 'Welcome to the Ultimate Counter App! 🎮';
}

// Start the application
init();
