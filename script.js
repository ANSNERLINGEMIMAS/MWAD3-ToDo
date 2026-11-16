
let tasks = JSON.parse(localStorage.getItem("taskMateTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("taskMateTasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });

    input.value = "";
    saveTasks();
    displayTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    displayTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        displayTasks();
    }
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        displayTasks();
    }
}

function setFilter(filter, button) {
    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    const searchText = document.getElementById("searchInput")
        .value.toLowerCase();

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchText);

        if (currentFilter === "pending") {
            return matchesSearch && !task.completed;
        }

        if (currentFilter === "completed") {
            return matchesSearch && task.completed;
        }

        return matchesSearch;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        if (task.completed) {
            taskInfo.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const span = document.createElement("span");
        span.textContent = task.text;

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(span);

        const actions = document.createElement("div");
        actions.className = "actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editTask(task.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(taskInfo);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    document.getElementById("emptyMessage").style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateDashboard();
}

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("completedTasks").textContent = completed;
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    displayTasks();
}

document.getElementById("taskInput").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();
