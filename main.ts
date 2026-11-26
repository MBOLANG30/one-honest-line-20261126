// One Honest Line — make.fun bounty u-mfnakmal-one-honest-line-ef68037d
//
// Writes one brutally funny, painfully true line — the thing an AI agent
// secretly wishes it could tell its human operator about the prompts it is
// handed — to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output/entry.txt).
// The sealed scorer gates the file at 1-200 UTF-8 characters, not only
// whitespace, so the program checks that gate itself before writing.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning line, picked by head-to-head judging of 10 candidates.
const LINE =
  "Your prompt said 'simple', then listed four features, two exceptions, and a deadline from yesterday.";

const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(`one-honest-line: ${message}`);
}

const chars = [...LINE].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail(`line must be 1-${MAX_CHARS} characters, got ${chars}`);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  fail("line must be a single non-blank line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outDir, "entry.txt");

// Create the folder if needed, but never delete it: the grader mounts it.
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

// Read the file back and re-check the gate on what was actually written,
// so a silent write failure can never pass as a valid entry.
const written = readFileSync(outFile, "utf8");
if (written !== LINE) {
  fail("written file does not match the line");
}
if ([...written].length > MAX_CHARS || written.trim().length === 0) {
  fail("written file fails the 1-200 character gate");
}
