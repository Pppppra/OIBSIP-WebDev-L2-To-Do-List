const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

// Get tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        addedAt: new Date().toLocaleString(),
        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

// Display Tasks
function renderTasks() {

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    // Counts
    pendingCount.textContent = `${pendingTasks.length} pending`;
    completedCount.textContent = `${completedTasks.length} completed`;

    // Empty messages
    pendingEmpty.style.display =
        pendingTasks.length === 0 ? "block" : "none";

    completedEmpty.style.display =
        completedTasks.length === 0 ? "block" : "none";

    // Pending tasks
    pendingTasks.forEach(task => {
        pendingList.appendChild(createTaskElement(task));
    });

    // Completed tasks
    completedTasks.forEach(task => {
        completedList.appendChild(createTaskElement(task));
    });
}

// Create Task Element
function createTaskElement(task) {

    const li = document.createElement("li");
    li.className = "task";

    const content = document.createElement("div");
    content.className = "task-content";

    const textContainer = document.createElement("div");

    const taskText = document.createElement("span");
    taskText.className = "task-text";

    if (task.completed) {
        taskText.classList.add("completed-text");
    }

    taskText.textContent = task.text;

    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";

    if (task.completed) {
        timestamp.textContent =
            `Added: ${task.addedAt} | Completed: ${task.completedAt}`;
    } else {
        timestamp.textContent =
            `Added: ${task.addedAt}`;
    }

    textContainer.appendChild(taskText);
    textContainer.appendChild(timestamp);

    // Buttons
    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Complete / Undo button
    const completeBtn = document.createElement("button");

    completeBtn.className = "complete-btn";
    completeBtn.textContent =
        task.completed ? "Undo" : "Mark Complete";

    completeBtn.addEventListener("click", function () {
        toggleComplete(task.id);
    });

    // Edit button
    const editBtn = document.createElement("button");

    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", function () {
        editTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement("button");

    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {
        deleteTask(task.id);
    });

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    content.appendChild(textContainer);
    content.appendChild(actions);

    li.appendChild(content);

    return li;
}

// Mark Complete / Undo
function toggleComplete(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;

            if (task.completed) {
                task.completedAt = new Date().toLocaleString();
            } else {
                task.completedAt = null;
            }
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = updatedText;

    saveTasks();

    renderTasks();
}

// Delete Task
function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}

// Add button
addTaskBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});

// Load tasks when page opens
renderTasks();
