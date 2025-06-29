document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now().toString(),
        projectName: document.getElementById('projectName').value,
        taskName: document.getElementById('taskName').value,
        taskInfo: document.getElementById('taskInfo').value,
        deadline: document.getElementById('deadline').value,
        createdAt: new Date().toISOString(),
        status: 'todo'
    };

    // Get existing tasks or initialize empty object
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {
        todo: [],
        inProgress: [],
        completed: []
    };

    // Add new task to todo list
    tasks.todo.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Redirect back to main page
    window.location.href = '/';
});