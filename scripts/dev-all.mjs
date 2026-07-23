// Runs the Next.js dev server and the FastAPI news-scraper backend together so
// `npm run dev` alone is enough — previously the backend (backend/app, port 8000)
// had to be started by hand in a second terminal, and forgetting to do so is why
// the Chronicles page always looked "stuck" on static content.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { platform } from 'node:process';

const isWin = platform === 'win32';
// cmd.exe (spawned under shell:true on Windows) mis-parses a forward-slash exe
// path as flags and only sees "backend" — must be backslashes here.
const pythonBin = isWin ? 'backend\\venv\\Scripts\\python.exe' : 'backend/venv/bin/python';

const children = [];

function run(name, command, args, opts = {}) {
  const child = spawn(command, args, { stdio: 'inherit', shell: isWin, ...opts });
  child.on('exit', (code) => {
    console.log(`[dev-all] ${name} exited (${code}) — stopping the rest`);
    shutdown(code ?? 0);
  });
  children.push(child);
  return child;
}

function shutdown(code) {
  for (const child of children) child.kill();
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('next', 'npx', ['next', 'dev']);

if (existsSync(pythonBin)) {
  // --app-dir instead of cwd: so pythonBin (relative to the repo root) still resolves.
  run('backend', pythonBin, ['-m', 'uvicorn', 'app.main:app', '--app-dir', 'backend', '--reload', '--port', '8000']);
} else {
  console.warn(
    `[dev-all] no venv found at ${pythonBin} — skipping the news scraper.\n` +
    '[dev-all] set it up with: cd backend && python -m venv venv && venv\\Scripts\\pip install -r requirements.txt'
  );
}
