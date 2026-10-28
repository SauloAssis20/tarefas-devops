# Roteiro da apresentação — Gitflow + Pipeline no GitHub Actions

Troque `SEU_USUARIO` pelo seu usuário do GitHub em todos os comandos.

## 0. Antes de tudo (uma vez só)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "email-cadastrado-no-github@exemplo.com"
git config --global init.defaultBranch main
```

Autenticação: o Git for Windows abre o navegador para login no primeiro `push` (HTTPS). Alternativa da Aula 07 (SSH, sem senha):

```bash
ssh-keygen -t ed25519 -C "seu@email.com"
cat ~/.ssh/id_ed25519.pub     # copie e cole em GitHub > Settings > SSH and GPG keys
```

## 1. Criar o projeto no GitHub

1. Em github.com: **New repository** → nome `tarefas-devops` → **Public** → **sem** README/.gitignore (o projeto já tem).
2. Descompacte o zip e, dentro da pasta, rode:

```bash
npm install          # gera package-lock.json
npm test             # confirme que passa ANTES de subir
npm run build

git init
git add .
git commit -m "feat: projeto inicial com pipeline CI/CD"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/tarefas-devops.git
git push -u origin main
```

3. Crie a `develop` (branch de integração):

```bash
git checkout -b develop
git push -u origin develop
```

## 2. Configurar o GitHub (uma vez)

* **Settings → Pages → Build and deployment → Source: GitHub Actions** (sem isso o job de deploy falha).
* **Settings → Secrets and variables → Actions → aba Variables → New repository variable**: `APP_NAME` = `Minha Lista DevOps` (demonstra "variáveis" da Aula 07).
* Opcional: **Settings → Branches → Add rule** em `main` exigindo Pull Request (reforça "nunca commit direto na main").

Ao dar o primeiro push na `main`, abra a aba **Actions** e acompanhe os 3 stages.

## 3. Demonstração do Gitflow

### 3.1 Feature — "Limpar concluídas"

```bash
git checkout develop
git pull origin develop
git checkout -b feature/limpar-concluidas
```

Edite os arquivos:

**src/tasks.js** — adicione a função e exporte:

```js
  function clearCompleted(list) {
    return list.filter((t) => !t.done);
  }

  return { addTask, toggleTask, removeTask, countPending, clearCompleted };
```

**tests/tasks.test.js** — importe `clearCompleted` na primeira linha e adicione:

```js
describe('clearCompleted', () => {
  test('remove apenas as tarefas concluídas', () => {
    const list = [
      { id: 1, text: 'a', done: true },
      { id: 2, text: 'b', done: false },
    ];
    expect(clearCompleted(list)).toEqual([{ id: 2, text: 'b', done: false }]);
  });
});
```

**index.html** — antes do `<p id="counter"...>`:

```html
<button id="clear" type="button">Limpar concluídas</button>
```

**src/app.js** — antes do `render();` final:

```js
  document.getElementById('clear').addEventListener('click', () => {
    tasks = Tasks.clearCompleted(tasks);
    render();
  });
```

Depois:

```bash
npm test
git add .
git commit -m "feat: adiciona botão para limpar tarefas concluídas"
git push -u origin feature/limpar-concluidas
```

No GitHub: **Compare & pull request** → base **develop** ← compare `feature/limpar-concluidas` → mostre a pipeline rodando no PR → **Merge pull request** (use *Create a merge commit*, não squash, para o histórico de branches ficar visível).

### 3.2 Release

```bash
git checkout develop
git pull origin develop
git checkout -b release/1.1.0
npm version 1.1.0 --no-git-tag-version
git add package.json
git commit -m "chore: prepara release 1.1.0"
git push -u origin release/1.1.0
```

PR `release/1.1.0` → **main** → após a pipeline passar, faça o merge. O **deploy** roda automaticamente. Depois:

```bash
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Versão 1.1.0"
git push origin v1.1.0

# trazer os ajustes da release de volta para a develop
git checkout develop
git merge main
git push origin develop
```

### 3.3 Hotfix (correção urgente em produção)

```bash
git checkout main
git pull origin main
git checkout -b hotfix/placeholder-input
```

Edite o `placeholder` em `index.html` (ex.: `Digite uma nova tarefa...`), então:

```bash
git add .
git commit -m "fix: ajusta placeholder do campo de tarefa"
git push -u origin hotfix/placeholder-input
```

PR → **main** (deploy automático) e, depois, o mesmo ajuste volta para a `develop`:

```bash
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

## 4. Demonstração de falha (Aula 07: "o pipeline é parado por qualquer erro")

```bash
git checkout develop
git checkout -b feature/demo-falha
```

Em `tests/tasks.test.js` troque `toBe(4)` por `toBe(99)`, então:

```bash
git commit -am "test: quebra um teste de propósito"
git push -u origin feature/demo-falha
```

Na aba Actions: **2a - Testes unitários** fica vermelho e o **Deploy** não executa. Mostre também que o job **2b - Segurança** rodou independente. Para desfazer, apague a branch:

```bash
git checkout develop
git branch -D feature/demo-falha
git push origin --delete feature/demo-falha
```

## 5. Mostrar o pipeline (se for sorteado)

1. Abra `.github/workflows/pipeline.yml` e explique: `on` (gatilhos) → `env` (variável `APP_NAME`) → `jobs` (build → testes em paralelo → deploy) → `needs` (dependência entre stages) → `if` (deploy só na main).
2. Aba **Actions** → clique em uma execução → grafo dos jobs → logs de um job.
3. Abra o site publicado (link no job de deploy) e mostre o título vindo de `APP_NAME`.
4. Opcional: mude a variável `APP_NAME`, rode **Run workflow** e mostre o título mudando.

## Checklist

- [ ] Repositório público com link para entregar
- [ ] `README.md` atualizado
- [ ] Pages ativado em *GitHub Actions*
- [ ] Pipeline verde na `main`
- [ ] Testei os comandos do Gitflow antes de apresentar
