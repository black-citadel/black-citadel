import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const START_MARKER = '__BLACK_CITADEL_PATH_START__';
const END_MARKER = '__BLACK_CITADEL_PATH_END__';

// Where kubectl and credential plugins usually live but which launchd's default PATH lacks.
const WELL_KNOWN_TOOL_DIRS = [
  '/opt/homebrew/bin',
  '/usr/local/bin',
  path.join(os.homedir(), '.krew', 'bin'),
  path.join(os.homedir(), '.local', 'bin'),
  path.join(os.homedir(), 'go', 'bin'),
  path.join(os.homedir(), 'bin'),
];

function loginShellPath(): string[] {
  const shell = process.env.SHELL || (process.platform === 'darwin' ? '/bin/zsh' : '/bin/bash');
  try {
    const result = spawnSync(shell, ['-ilc', `echo ${START_MARKER}; printenv PATH; echo ${END_MARKER}`], {
      encoding: 'utf8',
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
      // Keeps oh-my-zsh from prompting for an update inside the non-interactive probe
      env: { ...process.env, DISABLE_AUTO_UPDATE: 'true' },
    });
    const match = result.stdout?.match(new RegExp(`${START_MARKER}\\s*([\\s\\S]*?)\\s*${END_MARKER}`));
    return match ? match[1].trim().split(path.delimiter) : [];
  } catch (error) {
    console.warn('Could not read PATH from the login shell:', error);
    return [];
  }
}

// Apps started from Finder, the Dock or a desktop launcher inherit launchd's minimal PATH instead
// of the user's shell PATH, so kubeconfig exec plugins such as `kubectl oidc-login` and the
// `kubectl` used for port-forwarding cannot be found. Rebuild PATH from the login shell and
// well-known tool directories before anything spawns a process.
export function fixProcessPath(): void {
  if (process.platform === 'win32') {
    return;
  }

  const current = (process.env.PATH || '').split(path.delimiter);
  const merged = [...loginShellPath(), ...current, ...WELL_KNOWN_TOOL_DIRS].filter(
    (dir) => dir.length > 0 && fs.existsSync(dir),
  );
  process.env.PATH = Array.from(new Set(merged)).join(path.delimiter);
}
