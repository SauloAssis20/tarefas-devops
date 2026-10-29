// Regras da lista de tarefas (funções puras: fáceis de testar no pipeline).
// Funciona no navegador (window.Tasks) e no Node/Jest (require).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Tasks = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function addTask(list, text) {
    const clean = String(text == null ? '' : text).trim();
    if (!clean) {
      throw new Error('O texto da tarefa não pode ser vazio');
    }
    const id = list.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    return [...list, { id, text: clean, done: false }];
  }

  function toggleTask(list, id) {
    return list.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  }

  function removeTask(list, id) {
    return list.filter((t) => t.id !== id);
  }

  function countPending(list) {
    return list.filter((t) => !t.done).length;
  }

  function clearCompleted(list) {
    return list.filter((t) => !t.done);
  }
  return { addTask, toggleTask, removeTask, countPending, clearCompleted };
});
