// Reads the generated hamza outline (a .ts file) without a TypeScript build step.
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../src/components/brand/hamza-path.ts', import.meta.url), 'utf8');
export const HAMZA_SRC = JSON.parse(/HAMZA = (\{.*\}) as const/.exec(src)[1].replace(/(\w+):/g, '"$1":'));
