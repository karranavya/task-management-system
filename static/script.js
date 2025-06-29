class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || {
            todo: [],
            inProgress: [],
            completed: []
        };
        this.init();
    }

    init() {
        this.renderTasks();
        this.startCountdowns();
    }

    startCountdowns() {
        setInterval(() => {
            this.tasks.inProgress.forEach(task => {
                const deadlineDate = new Date(task.deadline);
                const now = new Date();
                const timeLeft = deadlineDate - now;

                if (timeLeft <= 0) {
                    const countdownElement = document.querySelector(`#${task.id} .countdown`);
                    if (countdownElement) {
                        countdownElement.textContent = 'Deadline passed!';
                    }
                }
            });
        }, 1000);
    }

    deleteTask(taskId, status) {
        const taskIndex = this.tasks[status].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[status].splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
        }
    }

    startTask(taskId) {
        const taskIndex = this.tasks.todo.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const task = this.tasks.todo[taskIndex];
            this.tasks.todo.splice(taskIndex, 1);
            this.tasks.inProgress.push(task);
            this.saveTasks();
            this.renderTasks();
        }
    }

    completeTask(taskId) {
        const taskIndex = this.tasks.inProgress.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const task = this.tasks.inProgress[taskIndex];
            this.tasks.inProgress.splice(taskIndex, 1);
            this.tasks.completed.push({...task, completedAt: new Date().toISOString()});
            this.saveTasks();
            this.renderTasks();
        }
    }

    updateTask(taskId, status) {
        window.location.href = `/update-task?id=${taskId}&status=${status}`;
    }
    

    formatTimeLeft(deadline) {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const timeLeft = deadlineDate - now;

        if (timeLeft <= 0) {
            return 'Deadline passed!';
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        return `${days}d ${hours}h ${minutes}m remaining`;
    }

    createTaskElement(task, status) {
        const div = document.createElement('div');
        div.className = 'task';
        div.id = task.id;

        let taskContent = `
            <div class="task-header">
                <span class="task-title">${task.taskName}</span>
                <span class="task-project">${task.projectName}</span>
            </div>
            <div class="task-info">${task.taskInfo}</div>
            <div class="task-deadline">Deadline: ${new Date(task.deadline).toLocaleString()}</div>
        `;

        if (status === 'todo') {
            taskContent += `
                <div class="task-actions">
                    <button class="btn btn-update" onclick="taskManager.updateTask('${task.id}', 'todo');">Update</button>
                    <button class="btn btn-delete" onclick="taskManager.deleteTask('${task.id}', 'todo')">Delete</button>
                    <button class="btn btn-start" onclick="taskManager.startTask('${task.id}')">Start Task</button>
                </div>
            `;
        } else if (status === 'inProgress') {
            taskContent += `
                <div class="countdown">${this.formatTimeLeft(task.deadline)}</div>
                <div class="task-actions">
                    <button class="btn btn-update" onclick="taskManager.updateTask('${task.id}', 'inProgress')">Update</button>
                    <button class="btn btn-complete" onclick="taskManager.completeTask('${task.id}')">Complete</button>
                </div>
            `;
        } else if (status === 'completed') {
            taskContent += `
                <div class="task-completed">Completed: ${new Date(task.completedAt).toLocaleString()}</div>
            `;
        }

        div.innerHTML = taskContent;
        return div;
    }

    renderTasks() {
        Object.keys(this.tasks).forEach(status => {
            const taskList = document.querySelector(`#${status} .task-list`);
            taskList.innerHTML = '';

            this.tasks[status].forEach(task => {
                const taskElement = this.createTaskElement(task, status);
                taskList.appendChild(taskElement);
            });
        });
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the Task Manager
const taskManager = new TaskManager();

// Make taskManager available globally
window.taskManager = taskManager;