
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const priority = document.getElementById("priority");
const deadline = document.getElementById("deadline");
const tasksList = document.getElementById("tasks");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved tasks from the browser.
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

// Save tasks in localStorage.
function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// Display tasks on the webpage.
function displayTasks() {
    tasksList.replaceChildren();

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        const details = document.createElement("span");
        const deleteButton = document.createElement("button");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.style.width = "auto";

        details.textContent =
            `${task.name} | Priority: ${task.priority} | Deadline: ${task.deadline}`;

        if (task.completed) {
            details.classList.add("completed");
        }

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.append(checkbox, details, deleteButton);
        tasksList.appendChild(li);
    });
}

// Handle adding a new task.
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = taskName.value.trim();

    if (!name || !deadline.value) {
        alert("Please enter a task name and deadline.");
        return;
    }

    if (deadline.value < getLocalToday()) {
        alert("Please choose today or a future deadline.");
        return;
    }

    tasks.push({
        name: name,
        priority: priority.value,
        deadline: deadline.value,
        completed: false
    });

    saveTasks();
    displayTasks();
    taskForm.reset();
});

// Get today's date in the browser's local time.
function getLocalToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Prevent selecting a past deadline.
deadline.min = getLocalToday();

// Display saved tasks when the page loads.
displayTasks();
