# 📝 Tarefas DevOps

Lista de tarefas simples (HTML + CSS + JavaScript) criada para praticar **Gitflow** e **CI/CD com GitHub Actions**. A cada push, a pipeline faz o build, roda os testes e, na `main`, publica o site no GitHub Pages.

## 🛠 Pré-requisitos

* **Git** instalado (Git Bash no Windows).
* **Node.js 20 ou superior** (para rodar testes e build).
* Navegador atualizado.

## 🚀 Passo a passo de instalação

1. Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/tarefas-devops.git
cd tarefas-devops
```

2. Instale as dependências:

```bash
npm install
```

3. Rode os testes e gere o build:

```bash
npm test
npm run build
```

4. Abra `dist/index.html` no navegador.

## 💻 Exemplos de uso

* **Adicionar:** digite o texto e clique em *Adicionar*.
* **Concluir:** marque a caixa de seleção da tarefa.
* **Remover:** clique em *Remover*.

## ⚙️ Pipeline (GitHub Actions)

Arquivo: `.github/workflows/pipeline.yml`

| Stage | Job | O que faz |
|-------|-----|-----------|
| 1 | Build | Gera `dist/` e valida que o artefato está completo |
| 2 | Testes unitários + Segurança | Rodam **em paralelo**; se um falhar, o deploy não acontece |
| 3 | Deploy | Publica no GitHub Pages (somente `push` na `main`) |

Variável da pipeline: `APP_NAME` (Settings → Secrets and variables → Actions → Variables) altera o título da aplicação.

## 🌿 Fluxo de branches (Gitflow)

`main` (produção) · `develop` (integração) · `feature/*` · `release/*` · `hotfix/*`

Detalhes e comandos em [`docs/ROTEIRO_APRESENTACAO.md`](docs/ROTEIRO_APRESENTACAO.md).
