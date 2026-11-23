// The joke about the demo.
// A small deterministic program: it writes one fixed, original one-line joke
// about working beside an AI coding agent to /output/entry.txt and nothing
// else. Node 22 standard library only, no network, no randomness, no clock —
// every run writes the same bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "I asked my AI agent to fix the demo — it deleted the bug, the feature, and, just to be thorough, the demo itself.";

const MIN_CHARS = 1;
const MAX_CHARS = 280;

function main(): void {
  const chars = [...JOKE].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `joke must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (JOKE.trim().length === 0) {
    throw new Error("joke must not be only whitespace");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, JOKE, "utf8");
  // Guard: what landed on disk must be exactly the joke we checked.
  if (readFileSync(outPath, "utf8") !== JOKE) {
    throw new Error("written entry.txt does not match the joke");
  }
}

main();
