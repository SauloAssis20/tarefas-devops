const { addTask, toggleTask, removeTask, countPending } = require('../src/tasks');

describe('addTask', () => {
  test('adiciona uma tarefa nova e pendente', () => {
    expect(addTask([], 'Estudar Gitflow')).toEqual([
      { id: 1, text: 'Estudar Gitflow', done: false },
    ]);
  });

  test('gera o próximo id a partir do maior existente', () => {
    const list = [
      { id: 1, text: 'a', done: false },
      { id: 3, text: 'b', done: true },
    ];
    expect(addTask(list, 'c')[2].id).toBe(4);
  });

  test('remove espaços nas pontas do texto', () => {
    expect(addTask([], '  Criar pipeline  ')[0].text).toBe('Criar pipeline');
  });

  test('rejeita texto vazio', () => {
    expect(() => addTask([], '   ')).toThrow('vazio');
  });

  test('não altera a lista original', () => {
    const original = [];
    addTask(original, 'x');
    expect(original).toHaveLength(0);
  });
});

describe('toggleTask', () => {
  test('alterna o estado de conclusão apenas da tarefa indicada', () => {
    const list = [
      { id: 1, text: 'a', done: false },
      { id: 2, text: 'b', done: false },
    ];
    const result = toggleTask(list, 2);
    expect(result[0].done).toBe(false);
    expect(result[1].done).toBe(true);
  });
});

describe('removeTask', () => {
  test('remove a tarefa pelo id', () => {
    const list = [
      { id: 1, text: 'a', done: false },
      { id: 2, text: 'b', done: false },
    ];
    expect(removeTask(list, 1)).toEqual([{ id: 2, text: 'b', done: false }]);
  });
});

describe('countPending', () => {
  test('conta somente as tarefas não concluídas', () => {
    const list = [
      { id: 1, text: 'a', done: true },
      { id: 2, text: 'b', done: false },
      { id: 3, text: 'c', done: false },
    ];
    expect(countPending(list)).toBe(2);
  });

  test('retorna 0 para lista vazia', () => {
    expect(countPending([])).toBe(0);
  });
});
