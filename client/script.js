document.getElementById('choresForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const choreInput = document.getElementById('choreInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const userInput = document.getElementById('userInput');

    const choreText = choreInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const user = userInput.value;

    if (choreText && dueDate && priority && user) {
        addChore(choreText, dueDate, priority, user);
        choreInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = '';
        userInput.value = '';
    }
});

function addChore(choreText, dueDate, priority, user) {
    const choresList = document.getElementById('choresList');

    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${getPriorityClass(priority)}">${choreText} (Due: ${dueDate}, Assigned to: ${user})</span>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove';
    deleteButton.onclick = function() {
        choresList.removeChild(li);
    };

    li.appendChild(deleteButton);
    choresList.appendChild(li);
}

function getPriorityClass(priority) {
    switch (priority) {
        case 'low':
            return 'priority-low';
        case 'medium':
            return 'priority-medium';
        case 'high':
            return 'priority-high';
        default:
            return '';
    }
}
