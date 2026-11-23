// The joke about the demo — make.fun micro-text entry.
//
// Writes exactly one line — the joke below — to entry.txt inside the
// output directory and nothing else. No network, no clock, no randomness,
// only the Node standard library.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "I asked my AI agent to fix the demo — it deleted the bug, the feature, and, just to be thorough, the demo itself.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 280;

function countChars(text: string): number {
  // Count Unicode code points, not UTF-16 code units.
  return [...text].length;
}

function validateJoke(text: string): void {
  const length = countChars(text);
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `joke must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be blank");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be a single line");
  }
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  return "/output";
}

function main(): void {
  validateJoke(JOKE);

  const outputDir = resolveOutputDir();
  const entryPath = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(entryPath, JOKE, "utf8");

  // Read it back and confirm the file holds exactly the joke, byte for byte.
  const written = readFileSync(entryPath, "utf8");
  if (written !== JOKE) {
    throw new Error("entry.txt does not match the joke exactly");
  }
}

main();
