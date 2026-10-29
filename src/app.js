// Interface: liga os elementos da página às regras de src/tasks.js
(function () {
  let tasks = [];

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const list = document.getElementById('list');
  const counter = document.getElementById('counter');
  const error = document.getElementById('error');

  function render() {
    list.innerHTML = '';

    tasks.forEach((t) => {
      const li = document.createElement('li');
      if (t.done) li.classList.add('done');

      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = t.done;
      checkbox.addEventListener('change', () => {
        tasks = Tasks.toggleTask(tasks, t.id);
        render();
      });
      const span = document.createElement('span');
      span.textContent = t.text;
      label.append(checkbox, span);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove';
      remove.textContent = 'Remover';
      remove.addEventListener('click', () => {
        tasks = Tasks.removeTask(tasks, t.id);
        render();
      });

      li.append(label, remove);
      list.appendChild(li);
    });

    const n = Tasks.countPending(tasks);
    counter.textContent = n === 1 ? '1 tarefa pendente' : n + ' tarefas pendentes';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      tasks = Tasks.addTask(tasks, input.value);
      error.textContent = '';
      input.value = '';
    } catch (err) {
      error.textContent = err.message;
    }
    render();
  });

  document.getElementById('clear').addEventListener('click', () => {
    tasks = Tasks.clearCompleted(tasks);
    render();
  });
  
  render();
})();
