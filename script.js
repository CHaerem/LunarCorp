// Lunar Corp Command Center - Interactive Dashboard

// Task Management System
let draggedElement = null;

// Initialize drag and drop for tasks
function initializeDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');
    const taskLists = document.querySelectorAll('.task-list');

    taskCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    taskLists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('drop', handleDrop);
        list.addEventListener('dragenter', handleDragEnter);
        list.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.style.opacity = '1';

    // Remove all dragover highlights
    document.querySelectorAll('.task-list').forEach(list => {
        list.style.background = '';
        list.style.borderColor = '';
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.style.background = 'rgba(244, 196, 48, 0.1)';
    this.style.borderColor = '#f4c430';
}

function handleDragLeave(e) {
    this.style.background = '';
    this.style.borderColor = '';
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this && draggedElement !== null) {
        this.appendChild(draggedElement);
        updateStats();
    }

    this.style.background = '';
    this.style.borderColor = '';

    return false;
}

// Add new task
function addNewTask() {
    const input = document.getElementById('newTaskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        return;
    }

    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.draggable = true;

    const priorities = ['low', 'medium', 'high'];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

    taskCard.innerHTML = `
        <span class="task-priority ${randomPriority}">${randomPriority.toUpperCase()}</span>
        <p>${taskText}</p>
    `;

    // Add drag events to new task
    taskCard.addEventListener('dragstart', handleDragStart);
    taskCard.addEventListener('dragend', handleDragEnd);

    // Add to todo list
    document.getElementById('todo').appendChild(taskCard);

    // Clear input
    input.value = '';

    updateStats();
}

// Update production stats dynamically
function updateStats() {
    const todoTasks = document.getElementById('todo').children.length;
    const inProgressTasks = document.getElementById('inprogress').children.length;
    const doneTasks = document.getElementById('done').children.length;

    // Calculate efficiency based on completed tasks
    const totalTasks = todoTasks + inProgressTasks + doneTasks;
    const efficiency = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 34;

    // Update efficiency stat
    const efficiencyStat = document.querySelectorAll('.stat-value')[1];
    if (efficiencyStat) {
        efficiencyStat.textContent = `${efficiency}%`;
    }
}

// Sector interaction
function handleSectorClick(e) {
    const sector = e.currentTarget;
    const sectorName = sector.querySelector('.sector-name').textContent;
    const status = sector.dataset.status;

    // Create a subtle feedback
    sector.style.transform = 'scale(1.05)';
    setTimeout(() => {
        sector.style.transform = '';
    }, 200);

    console.log(`Clicked on ${sectorName} - Status: ${status}`);
}

// Add click handlers to sectors
function initializeSectors() {
    const sectors = document.querySelectorAll('.sector');
    sectors.forEach(sector => {
        sector.addEventListener('click', handleSectorClick);
    });
}

// Simulate production updates
function simulateProduction() {
    const productionStat = document.querySelectorAll('.stat-value')[0];
    if (productionStat) {
        let currentProduction = parseInt(productionStat.textContent.replace(',', ''));

        setInterval(() => {
            // Random increase between 1-5 kg
            const increase = Math.floor(Math.random() * 5) + 1;
            currentProduction += increase;

            // Format with comma
            productionStat.textContent = currentProduction.toLocaleString();
        }, 5000); // Update every 5 seconds
    }
}

// Simulate robot status changes
function simulateRobotStatus() {
    const robotStat = document.querySelectorAll('.stat-value')[2];
    if (robotStat) {
        setInterval(() => {
            const active = Math.floor(Math.random() * 6) + 4; // 4-10 robots active
            robotStat.textContent = `${active}/12`;
        }, 8000); // Update every 8 seconds
    }
}

// Update ETA countdown
function updateFlightETA() {
    const etaElement = document.querySelector('.flight-details .detail-value');
    if (!etaElement) return;

    let totalMinutes = 48 * 60 + 23; // 48h 23m in minutes

    setInterval(() => {
        totalMinutes -= 1;
        if (totalMinutes < 0) totalMinutes = 0;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        etaElement.textContent = `${hours}h ${minutes}m`;
    }, 60000); // Update every minute (or use 1000 for every second in demo)
}

// Add keyboard shortcut for adding tasks (Enter key)
function initializeKeyboardShortcuts() {
    const input = document.getElementById('newTaskInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    initializeSectors();
    initializeKeyboardShortcuts();

    // Add click handler to add task button
    document.getElementById('addTaskBtn').addEventListener('click', addNewTask);

    // Start simulations
    simulateProduction();
    simulateRobotStatus();
    updateFlightETA();

    console.log('🌙 Lunar Corp Command Center initialized');
    console.log('Drag tasks between columns to manage operations');
});

// Easter egg: Konami code for crisis level
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        const crisisValue = document.querySelector('.crisis-level .value');
        crisisValue.textContent = 'MAGNIFIQUE!';
        crisisValue.style.background = '#2ecc71';
        setTimeout(() => {
            crisisValue.textContent = 'CRITIQUE';
            crisisValue.style.background = '';
        }, 3000);
    }
});
