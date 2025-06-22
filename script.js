// Get the input element
const todoInput = document.querySelector('.js-todo-input');

// Get the add todo button
const addTodoBtn = document.querySelector('.js-add-todo-btn');

// Get the todo checkbox
const todoCheckbox = document.querySelector('.js-todo-checkbox');

// Initialize todo lists from localStorage or empty arrays
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let completedTodoList = JSON.parse(localStorage.getItem('completedTodoList')) || [];

// -------------------- Functions --------------------

function saveToLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
    localStorage.setItem('completedTodoList', JSON.stringify(completedTodoList));
}

function addTodo() {
    const todo = {
        id: Date.now(), // Use timestamp as unique ID
        text: todoInput.value,
        completed: false
    };
    todoList.push(todo);
    saveToLocalStorage();
    renderTodoList();
}

function renderTodoList() {
    let todoListHTML = '';

    todoList.forEach(todo => {
        todoListHTML += `
            <li class="flex justify-between items-center mb-2">
                    <div class="flex items-center justify-center gap-2">
                        <input type="checkbox" class="w-5 h-5 border-indigo-400 accent-green-500 js-todo-checkbox" data-id="${todo.id}">
                        <p class="text-lg">${todo.text}</p>
                    </div>
                    
                    <button data-id="${todo.id}" class="bg-red-400 text-white px-2 py-1 rounded-md text-3xl hover:bg-red-500 js-delete-btn"><i class="bi bi-trash"></i></button>
                </li>
        `;
    });
    document.querySelector('.js-todo-list').innerHTML = todoListHTML;
    
    // Reattach delete button event listeners after rendering
    attachDeleteButtonListeners();
    attachCheckboxListeners();
}

function attachDeleteButtonListeners() {
    document.querySelectorAll('.js-delete-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            todoList = todoList.filter(todo => todo.id !== id);
            completedTodoList = completedTodoList.filter(todo => todo.id !== id);
            saveToLocalStorage();
            renderTodoList();
            renderCompletedTodoList();
        });
    });
}

function attachCheckboxListeners() {
    document.querySelectorAll('.js-todo-checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const id = parseInt(checkbox.dataset.id);
            todoList.forEach(todo => {
                if (todo.id === id) {
                    todo.completed = !todo.completed;
                    if (todo.completed) {
                        completedTodoList.push(todo);
                        todoList = todoList.filter(t => t.id !== id);
                    } else {
                        todoList.push(todo);
                        completedTodoList = completedTodoList.filter(t => t.id !== id);
                    }
                }
            });
            saveToLocalStorage();
            renderTodoList();
            renderCompletedTodoList();
        });
    });
}

addTodoBtn.addEventListener('click', () => {
    addTodo();
    todoInput.value = '';
    renderTodoList();
    renderCompletedTodoList();
});

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
        todoInput.value = '';
        renderTodoList();
        renderCompletedTodoList();
    }
});

function renderCompletedTodoList() {
    let completedTodoListHTML = '';


    completedTodoList.forEach(todo => {
        completedTodoListHTML += `
            <li class="flex justify-between items-center mb-2">
                <p class="text-lg line-through text-green-800 font-bold">${todo.text}</p>
            </li>
        `;
    });

    document.querySelector('.js-completed-todo-list').innerHTML = completedTodoListHTML;
}

// Initial setup
renderTodoList();
renderCompletedTodoList();
attachDeleteButtonListeners();
attachCheckboxListeners();

//clear local storage
document.querySelector('.js-reset-btn').addEventListener('click', () => {
    localStorage.clear();
    todoList = [];
    completedTodoList = [];
    renderTodoList();
    renderCompletedTodoList();
});


