
document.addEventListener('DOMContentLoaded', function(){
  let todoItems = [];

  function renderTodo(todo) {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
  
    const list = document.querySelector('.js-todo-list');
    const item = document.querySelector(`[data-key='${todo.id}']`);
    
    if (todo.deleted) {
      item.remove();
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
  
  function addTodo(text) {
    const todo = {
      text,
      checked: false,
      id: Date.now(),
    };
  
    todoItems.push(todo);
    renderTodo(todo);
  }
  
  function toggleDone(key) {
    const index = todoItems.findIndex(item => item.id === Number(key));
    todoItems[index].checked = !todoItems[index].checked;
    renderTodo(todoItems[index]);
  }
  
  function deleteTodo(key) {
    const index = todoItems.findIndex(item => item.id === Number(key));
    const todo = {
      deleted: true,
      ...todoItems[index]
    };
    todoItems = todoItems.filter(item => item.id !== Number(key));
    renderTodo(todo);
  }
  
  const form = document.querySelector('.js-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('.js-todo-input');
  
    const text = input.value.trim();
    if (text !== '') {
      addTodo(text);
      input.value = '';
      input.focus();
    }
  });
  
  const list = document.querySelector('.js-todo-list');
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
    const ref = localStorage.getItem('todoItems');
    if (ref) {
      todoItems = JSON.parse(ref);
      todoItems.forEach(t => {
        renderTodo(t);
      });
    }
  });
  

  

  
  // TIMER CODE
  const timer = document.querySelector(".timer");
  const title = document.querySelector(".t1mertitle");
  const startBtn = document.querySelector(".startBtn");
  const resumeBtn = document.querySelector(".resumeBtn");
  const pauseBtn = document.querySelector(".pauseBtn");
  const resetBtn = document.querySelector(".resetBtn");
  const pomoCountsDisplay = document.querySelector(".pomoCountsDisplay");
  
  //variable for the timer. amount user works for
  const work_time = 2 * 60;
  const break_time = 0.5* 60;
  let timerID = null;
  let oneRoundCompleted = false; // one round = work time and break time
  let totalCount = 0;
  let paused = false;
  
  
  //function to update title
  const updateTitle = (msg) => {
    title.textContent = msg;
  }
  
  //function to save pomodoro counts to local storage
  const saveLocalCounts = () => {
    let counts = JSON.parse(localStorage.getItem("pomoCounts"));
    counts != null ? counts++ : counts = 1;
    localStorage.setItem("pomoCounts", JSON.stringify(counts));
  }
  //function to count down
  const countDown = (time) => {
    return () => {
      const mins = Math.floor(time / 60).toString().padStart(2,'0');
      const secs = Math.floor(time % 60).toString().padStart(2,'0');
      //timer.textContext - time;
      timer.textContent = `${mins}:${secs}`;
      time--;
      if (time < 0) {
        stopTimer();
        timerID = startTimer(break_time);
        if (!oneRoundCompleted){
          timerID = startTimer(break_time);
          oneRoundCompleted = true;
          updateTitle("It's Break Time!");
        }
        else {
          updateTitle("Round completed!");
          setTimeout(()=> updateTitle("Start Timer Again!"), 2000);
          totalCount++;
          saveLocalCounts();
          showPomodoroCounts();
        }
      }
    };
  };
  
  

  //function to start timer
  const startTimer = (startTime) => {
    //lets user know the timer started
    alert("Started Timer!");
    if (timerID !== null) {
      stopTimer();
      paused = true;
      updateTitle("Timer Paused");
    }
    return setInterval(countDown(startTime), 1000);
  }
  
  //function to stop timer
  const stopTimer = () => {
    clearInterval(timerID);
    timerID = null;
  }

  // function to get time in seconds
  const getTimeInSeconds = (timeString) => {
    const[minutes, seconds] = timeString.split(":");
    return parseInt(minutes * 60) + parseInt(seconds);
  }
  
  //to start/reset/pause/resum time when you click on event listener
  startBtn.addEventListener('click', ()=>{
    timerID = startTimer(work_time);
    updateTitle("It's Work Time!");
  });

  resetBtn.addEventListener('click', ()=>{
    stopTimer();
    timer.textContent = "25:00";
  });

  pauseBtn.addEventListener('click', ()=>{
    stopTimer();
    paused = true;
    updateTitle("Timer Paused");
  });
 
  resumeBtn.addEventListener('click', () => {
    if (paused) {
      const currentTime = getTimeInSeconds(timer.textContent);
      timerID = startTimer(currentTime);
      paused = false; // Reset paused to false to indicate the timer is running
      (!oneRoundCompleted) ? updateTitle("It's Work Time") : updateTitle("It's break!");
    }
  });
  
  // function to show completed pomodoros to user
   const showPomodoroCounts = () => {
    const counts = JSON.parse(localStorage.getItem("pomoCounts")); 
    console.log(counts);
    if (counts > 0 ){
        pomoCountsDisplay.style.display = "flex";
    }
    pomoCountsDisplay.firstElementChild.textContent = counts; 
  }
  
  showPomodoroCounts();
  
  });

