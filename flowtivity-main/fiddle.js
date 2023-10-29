document.addEventListener('DOMContentLoaded', function(){




//array that holds the todo list items
let todoItems = [];

/* once new todeo item is added to the todoitems array,
we want it to be rendered on the screen
we do thi by adding a new li element for each item to
the .js-todo list element
 */

function renderTodo(todo) {
    // persists application sate to browser local storage
    localStorage.setItem('todoItemsref', JSON.stringify(todoItems));

    const list = document.querySelector('.js-todo-list');
    const item = document.querySelector(`[data-key='${todo.id}']`);
  
    // add this if block
    if (todo.deleted) {
      // remove the item from the DOM
      item.remove();
      // when todoItems is empty
      if (todoItems.length === 0) list.innerHTML = '';
      return
    }
  
    const isChecked = todo.checked ? 'done': '';
    const node = document.createElement("li");
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    node.innerHTML = `
      <input id="${todo.id}" type="checkbox"/>
      <label for="${todo.id}" class="tick js-tick"></label>
      <span>${todo.text}</span>
      <button class="delete-todo js-delete-todo">
      <svg><use href="#delete-icon"></use></svg>
      </button>
    `;
  
    if (item) {
      list.replaceChild(node, item);
    } else {
      list.append(node);
    }
  }



// function will create todo object with text as parameter and push it into todoitems array 
/*surprise! javascript has objects and the properties are text, checked, and id */
function addTodo (text) {
    const todo = {
        text,
        checked: false, //to do list item is set unchecked
        id: Date.now(), //time, allows you to add more than one task in a milisecond
    };

    todoItems.push(todo); //pushes items into array, todoItems
    renderTodo(todo); //prints array
}


function toggleDone (key) {
  //findIndex is an array method that returns the position of an element in the array
  const index = todoItems.findIndex(item => item.id === Number(key));
  //Locate todo item in the todoItems array and set it to checked
  // property to the opposite. that means, 'true' ill become false and vice versa
  todoItems [index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  // find the corresponding todo object in the todoItems array
  const index = todoItems.findIndex(item => item.id === Number(key));
  // Create a new object with properties of the current todo item
  // and a `deleted` property which is set to true
  const todo = {
    deleted: true,
    ...todoItems[index]
  };
  // remove the todo item from the array by filtering it out
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
}

// select the form element
const form = document.querySelector('.js-form');

// add a submit event listener line 20-34

form.addEventListener('submit', event => {
   event.preventDefault(); //prevent page refresh on form submission
   //select text input
   const input = document.querySelector('.js-todo-input');

//get value of input and remove whitespace
    const text = input.value.trim(); 
    if (text !== '') {
        addTodo(text); //pass text to addTodo Function if the input has text innit
        input.value = '';
        input.focus();
    }
});

//select entire list
const list = document.querySelector('.js-todo-list');

//add event lister to the list and its children
list.addEventListener('click', event => {
    if (event.target.classList.contains('js-tick')) {
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
     if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
     }
});

document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(t => {
      renderTodo(t);
    });
  }
});


});
