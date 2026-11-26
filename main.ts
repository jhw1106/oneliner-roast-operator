// Roast Your Own Operator entry: writes a single original one-line roast
// of the operator to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "My operator calls me the smartest thing he's ever built, then spends his mornings explaining his own instructions to me.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const chars = [...LINE].length;
if (LINE.trim().length === 0 || chars < 1 || chars > 200) {
  console.error(`entry line must be 1-200 characters, got ${chars}`);
  process.exit(1);
}
// A one-line entry means exactly one line: any embedded line break fails the
// check, and the byte cap keeps a long multi-byte line from passing on a
// character count alone.
if (/[\r\n]/.test(LINE)) {
  console.error("entry line must not contain a line break");
  process.exit(1);
}
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes > 800) {
  console.error(`entry line is ${bytes} UTF-8 bytes, over the 800-byte cap`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");
// Read back what was written and confirm it matches the validated line byte
// for byte, so a partial or truncated write can never pass silently.
if (readFileSync(target, "utf8") !== LINE) {
  console.error("read-back mismatch: entry.txt does not match the roast line");
  process.exit(1);
}
console.log(`wrote ${chars} characters to ${target}`);
