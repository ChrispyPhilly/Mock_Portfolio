let currentUser = '';
const chores = {
    Jeremy: { list: [], points: 0, rewards: [], monthlyScores: {} },
    Brittany: { list: [], points: 0, rewards: [], monthlyScores: {} },
    Aisha: { list: [], points: 0, rewards: [], monthlyScores: {} }
};

const rewards = [
    { points: 20, message: "You've earned a Snack!" },
    { points: 50, message: "You've earned a Movie Night!" },
    { points: 100, message: "You've earned a New Game!" }
];

function setUser(user) {
    currentUser = user;
    document.getElementById('current-user').innerText = user;
    document.getElementById('chore-list').innerHTML = '';
    updateChoreList();
}

function addChore() {
    const choreInput = document.getElementById('chore-input');
    const choreText = choreInput.value.trim();

    if (choreText && currentUser) {
        chores[currentUser].list.push(choreText);
        choreInput.value = '';
        updateChoreList();
    } else {
        alert('Please select a user and enter a chore.');
    }
}

function updateChoreList() {
    const choreList = document.getElementById('chore-list');
    choreList.innerHTML = '';
    const pointsDisplay = document.getElementById('points');
    pointsDisplay.innerText = chores[currentUser].points;

    
    checkForRewards();
    displayRewards();
    updateLeaderboard();

    chores[currentUser].list.forEach((chore, index) => {
        const li = document.createElement('li');
        li.textContent = chore;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.className = 'complete-btn';
        completeButton.onclick = () => completeChore(index);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = () => editChore(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteChore(index);

        li.appendChild(completeButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        choreList.appendChild(li);
    });
}

function completeChore(index) {
    const points = 10; // Points awarded for completing a chore
    chores[currentUser].points += points;

    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!chores[currentUser].monthlyScores[month]) {
        chores[currentUser].monthlyScores[month] = 0;
    }
    chores[currentUser].monthlyScores[month] += points;

    chores[currentUser].list.splice(index, 1); 
    updateChoreList();
}

function editChore(index) {
    const newChore = prompt("Edit chore:", chores[currentUser].list[index]);
    if (newChore) {
        chores[currentUser].list[index] = newChore;
        updateChoreList();
    }
}

function deleteChore(index) {
    if (confirm("Are you sure you want to delete this chore?")) {
        chores[currentUser].list.splice(index, 1);
        updateChoreList();
    }
}

function checkForRewards() {
    const userPoints = chores[currentUser].points;
    rewards.forEach(reward => {
        if (userPoints >= reward.points && !chores[currentUser].rewards.includes(reward.message)) {
            chores[currentUser].rewards.push(reward.message);
        }
    });
}

function displayRewards() {
    const rewardsList = document.getElementById('rewards-list');
    rewardsList.innerHTML = '';
    chores[currentUser].rewards.forEach(reward => {
        const li = document.createElement('li');
        li.textContent = reward;
        rewardsList.appendChild(li);
    });
}

function updateLeaderboard() {
    const monthSelect = document.getElementById('month-select');
    const selectedMonth = monthSelect.value || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    
    const sortedUsers = Object.entries(chores)
        .sort(([, userA], [, userB]) => (userB.monthlyScores[selectedMonth] || 0) - (userA.monthlyScores[selectedMonth] || 0));

    sortedUsers.forEach(([user, data]) => {
        const li = document.createElement('li');
        li.textContent = `${user}: ${data.monthlyScores[selectedMonth] || 0} points`;
        leaderboardList.appendChild(li);
    });
}

//leaderboard below here
document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.createElement('select');
    monthSelect.id = 'month-select';
    monthSelect.innerHTML = `
        <option value="">Current Month</option>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
    `;
    monthSelect.addEventListener('change', updateLeaderboard);
    document.querySelector('.leaderboard-section').insertBefore(monthSelect, document.getElementById('leaderboard-list'));
});

//chat room function

const chatMessages = [];

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const messageText = chatInput.value.trim();

    if (messageText) {
        const message = {
            user: currentUser,
            text: messageText,
            time: new Date().toLocaleTimeString()
        };
        chatMessages.push(message);
        chatInput.value = '';
        updateChatDisplay();
    } else {
        alert('Please enter a message.');
    }
}

function updateChatDisplay() {
    const chatDisplay = document.getElementById('chat-display');
    chatDisplay.innerHTML = '';
    chatMessages.forEach(message => {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${message.time} - ${message.user}: ${message.text}`;
        chatDisplay.appendChild(messageElement);
    });
}

// virtual store for family

const storeItems = [
    { name: "Choose the Next Family Movie", cost: 20 },
    { name: "Free Pass on a Chore", cost: 15 },
    { name: "Extra Screen Time", cost: 30 },
];

function updateStoreDisplay() {
    const storeDisplay = document.getElementById('store-items');
    const userPoints = chores[currentUser].points;
    document.getElementById('store-points').innerText = userPoints;

    storeDisplay.innerHTML = '';
    storeItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'store-item';
        itemElement.innerHTML = `
            <span>${item.name} - ${item.cost} Points</span>
            <button onclick="purchaseItem(${index})">Buy</button>
        `;
        storeDisplay.appendChild(itemElement);
    });
}

function purchaseItem(index) {
    const item = storeItems[index];

    if (chores[currentUser].points >= item.cost) {
        chores[currentUser].points -= item.cost;
        alert(`You have purchased: ${item.name}`);
        updateStoreDisplay();
        updateChoreList(); 
        alert('Not enough points to purchase this item.');
    }
}


function setUser(user) {
    currentUser = user;
    document.getElementById('current-user').innerText = user;
    document.getElementById('chore-list').innerHTML = '';
    updateChoreList();
    updateStoreDisplay(); // Update store when user changes
    renderChart();
}
