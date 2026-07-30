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

// On Windows we use shell:true so cmd.exe can resolve npx/python from PATH.
// DEP0190: passing an args array with shell:true is deprecated — pass a single
// pre-joined command string instead so Node never concatenates unsafely.
function run(name, command, args, opts = {}) {
  const useShell = isWin;
  // When shell is active, join into one string; otherwise keep args separate.
  const [cmd, spawnArgs] = useShell
    ? [[command, ...args].join(' '), []]
    : [command, args];

  const child = spawn(cmd, spawnArgs, { stdio: 'inherit', shell: useShell, ...opts });
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
  run('backend', pythonBin, ['-m', 'uvicorn', 'app.main:app', '--app-dir', 'backend', '--reload', '--port', '8000']);
} else {
  console.info(
    `[dev-all] no venv found at ${pythonBin} — skipping the news scraper.\n` +
    '[dev-all] set it up with: cd backend && python -m venv venv && venv\\Scripts\\pip install -r requirements.txt'
  );
}
