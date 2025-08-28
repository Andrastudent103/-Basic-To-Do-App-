class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'created';
        this.editingTaskId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateCurrentDate();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        // Input elements
        this.taskInput = document.getElementById('taskInput');
        this.taskDate = document.getElementById('taskDate');
        this.taskTime = document.getElementById('taskTime');
        this.taskCategory = document.getElementById('taskCategory');
        this.taskPriority = document.getElementById('taskPriority');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        
        // Filter and sort elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sortBy = document.getElementById('sortBy');
        this.clearCompleted = document.getElementById('clearCompleted');
        
        // Display elements
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.currentDate = document.getElementById('currentDate');
        
        // Stats elements
        this.allCount = document.getElementById('allCount');
        this.pendingCount = document.getElementById('pendingCount');
        this.completedCount = document.getElementById('completedCount');
        this.progressText = document.getElementById('progressText');
        this.progressFill = document.getElementById('progressFill');
        
        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editTaskDate = document.getElementById('editTaskDate');
        this.editTaskTime = document.getElementById('editTaskTime');
        this.editTaskCategory = document.getElementById('editTaskCategory');
        this.editTaskPriority = document.getElementById('editTaskPriority');
        this.saveEdit = document.getElementById('saveEdit');
        this.cancelEdit = document.getElementById('cancelEdit');
        this.closeModal = document.getElementById('closeModal');
    }

    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        
        // Sort event
        this.sortBy.addEventListener('change', () => {
            this.currentSort = this.sortBy.value;
            this.renderTasks();
        });
        
        // Clear completed event
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        
        // Modal events
        this.saveEdit.addEventListener('click', () => this.saveEditedTask());
        this.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        
        // Close modal on outside click
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeEditModal();
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        this.currentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) {
            this.showNotification('Please enter a task!', 'error');
            return;
        }

        const task = {
            id: this.generateId(),
            text: text,
            completed: false,
            date: this.taskDate.value,
            time: this.taskTime.value,
            category: this.taskCategory.value,
            priority: this.taskPriority.value,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.clearForm();
        this.renderTasks();
        this.updateStats();
        this.showNotification('Task added successfully!', 'success');
    }

    clearForm() {
        this.taskInput.value = '';
        this.taskDate.value = '';
        this.taskTime.value = '';
        this.taskCategory.value = 'personal';
        this.taskPriority.value = 'medium';
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            const message = task.completed ? 'Task completed!' : 'Task reopened!';
            this.showNotification(message, 'success');
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Task deleted!', 'success');
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.editingTaskId = id;
            this.editTaskInput.value = task.text;
            this.editTaskDate.value = task.date || '';
            this.editTaskTime.value = task.time || '';
            this.editTaskCategory.value = task.category;
            this.editTaskPriority.value = task.priority;
            this.openEditModal();
        }
    }

    openEditModal() {
        this.editModal.classList.add('active');
        this.editTaskInput.focus();
    }

    closeEditModal() {
        this.editModal.classList.remove('active');
        this.editingTaskId = null;
    }

    saveEditedTask() {
        const text = this.editTaskInput.value.trim();
        if (!text) {
            this.showNotification('Please enter a task!', 'error');
            return;
        }

        const task = this.tasks.find(t => t.id === this.edit)
    }ingTaskId;
        if (task) {
            task.text = text;
            task.date = this.editTaskDate.value;
            task.time = this.editTaskTime.value;
            task.category = this.editTaskCategory.value;
            task.priority = this.editTaskPriority.value;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.closeEditModal();
            this.showNotification('Task updated successfully!', 'success');
        }
