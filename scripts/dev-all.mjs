// Runs the Next.js dev server and the chatbot backend together so `npm run dev`
// alone is enough. The Chronicles news feed has no local backend of its own
// anymore — it's served by a deployed Cloudflare Worker (mlrit-news-worker)
// that scrapes Google News + Bing News RSS directly into D1; point NEWS_API_URL
// at it (see .env.example) even in local dev.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { platform } from 'node:process';

const isWin = platform === 'win32';
// cmd.exe (spawned under shell:true on Windows) mis-parses a forward-slash exe
// path as flags and only sees the directory name — must be backslashes here.
const chatbotPythonBin = isWin ? 'chatbot\\.venv\\Scripts\\python.exe' : 'chatbot/.venv/bin/python';

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

if (existsSync(chatbotPythonBin)) {
  run('chatbot', chatbotPythonBin, ['main.py'], { cwd: 'chatbot' });
} else {
  console.info(
    `[dev-all] no venv found at ${chatbotPythonBin} — skipping the chatbot backend.\n` +
    '[dev-all] set it up with: cd chatbot && python -m venv .venv && .venv\\Scripts\\pip install -r requirements.txt'
  );
}
