import * as path from 'path';

// Every location the generators touch, resolved from this directory so the tool works from any cwd.
export const ROOT = path.resolve(__dirname, '../..');
export const CONFIG_DIR = path.join(__dirname, 'config');
export const META_DIR = path.join(__dirname, 'meta');
export const TEMPLATE_PATH = path.join(__dirname, 'templates', 'details.tsx.hbs');
export const OUTPUT_DIR = path.join(ROOT, 'src', 'renderer', 'components', 'gen');

// Type paths in config/k8s-resources.yaml are relative to the repo root.
export const resolveFromRoot = (relativePath: string): string => path.resolve(ROOT, relativePath);

// The 0.22 client names model files with a lower-camel first character: V1PodSpec -> v1PodSpec.d.ts
export const modelFileName = (typeName: string): string => `${typeName.charAt(0).toLowerCase()}${typeName.slice(1)}.d.ts`;
