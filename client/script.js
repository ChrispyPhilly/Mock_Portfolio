let currentUser = '';
const chores = {
    Jeremy: { list: [], points: 0, rewards: [], monthlyScores: {} },
    Brittany: { list: [], points: 0, rewards: [], monthlyScores: {} },
    Aisha: { list: [], points: 0, rewards: [], monthlyScores: {} }
};

//rewards to pop up automatically
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

//points being assigned for completing a chore
function completeChore(index) {
    const points = 10; 
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
    updateStoreDisplay(); 
    renderChart();
}

//js for family calender

let currentDate = new Date();
let events = []; 
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; 
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day');
        calendar.appendChild(emptyCell);
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.innerHTML = day;

        
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day;
        });

        dayEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerHTML = `${event.title} at ${event.time}`;
            dayCell.appendChild(eventDiv);
        });

        dayCell.onclick = () => openAddEventModal(day);
        calendar.appendChild(dayCell);
    }

    document.getElementById('current-month').innerText = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;
}

function openAddEventModal(day) {
    document.getElementById('add-event-modal').style.display = 'block';
    document.getElementById('event-date').value = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
}

function closeAddEventModal() {
    document.getElementById('add-event-modal').style.display = 'none';
}

document.getElementById('event-form').onsubmit = (event) => {
    event.preventDefault();
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const duration = document.getElementById('event-duration').value;

   
    const newEvent = {
        title: title,
        date: date,
        time: time,
        duration: duration
    };

    
    events.push(newEvent);
    
    
    document.getElementById('event-form').reset();

   
    renderCalendar();
};


renderCalendar();
