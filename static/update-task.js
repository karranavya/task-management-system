// Get task ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get('id');
const status = urlParams.get('status');

// Load existing task data
const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
const task = tasks[status].find(t => t.id === taskId);

// Populate form with existing task data
if (task) {
    document.getElementById('projectName').value = task.projectName;
    document.getElementById('taskName').value = task.taskName;
    document.getElementById('taskInfo').value = task.taskInfo;
    document.getElementById('deadline').value = task.deadline;
}

document.getElementById('updateTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const updatedTask = {
        ...task,
        projectName: document.getElementById('projectName').value,
        taskName: document.getElementById('taskName').value,
        taskInfo: document.getElementById('taskInfo').value,
        deadline: document.getElementById('deadline').value,
    };

    // Update task in the correct status array
    const taskIndex = tasks[status].findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[status][taskIndex] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Redirect back to main page
    window.location.href = '/';
});