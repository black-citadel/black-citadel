import * as fs from 'fs';
import * as path from 'path';
import k8s = require('@kubernetes/client-node');

function isOnPath(command: string): boolean {
  if (path.isAbsolute(command)) {
    return fs.existsSync(command);
  }
  return (process.env.PATH || '')
    .split(path.delimiter)
    .some((dir) => dir.length > 0 && fs.existsSync(path.join(dir, command)));
}

// Returns a user-facing explanation when the current context authenticates through an exec
// credential plugin whose binary cannot be found, otherwise null. The Kubernetes client only
// reports such failures as an opaque error deep inside the first API call.
export function describeMissingExecPlugin(kc: k8s.KubeConfig): string | null {
  const user = kc.getCurrentUser();
  const exec = user?.exec ?? user?.authProvider?.config?.exec;
  const command: string | undefined = exec?.command;
  if (!command || isOnPath(command)) {
    return null;
  }

  return [
    `The context "${kc.getCurrentContext()}" authenticates by running "${command}", but that command was not found.`,
    '',
    'Install it or add its directory to your shell PATH, then restart Black Citadel.',
    '',
    `Searched PATH: ${process.env.PATH}`,
  ].join('\n');
}
