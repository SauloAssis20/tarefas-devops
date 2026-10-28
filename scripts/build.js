// Etapa de BUILD: gera a pasta dist/ pronta para publicar.
// A variável de ambiente APP_NAME troca o título da aplicação (ver pipeline).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const appName = process.env.APP_NAME || 'Lista de Tarefas DevOps';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

console.log('Iniciando o processo de build...');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const html = fs
  .readFileSync(path.join(root, 'index.html'), 'utf8')
  .split('{{APP_NAME}}')
  .join(escapeHtml(appName));
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.cpSync(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true });

// Garante que o artefato está completo; se faltar algo, o build falha.
const required = ['index.html', 'src/tasks.js', 'src/app.js', 'src/style.css'];
const missing = required.filter((f) => !fs.existsSync(path.join(dist, f)));
if (missing.length > 0) {
  console.error('Erro durante o build! Arquivos ausentes: ' + missing.join(', '));
  process.exit(1);
}

console.log('Build concluído: "' + appName + '" -> dist/');
