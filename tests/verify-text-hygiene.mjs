/**
 * 手写文本规范核验（可在 Node 直接运行）。
 * 运行：node tests/verify-text-hygiene.mjs
 *
 * 校验仓库内所有手写文本文件（排除 .git）：UTF-8 无 BOM、纯 LF（无 CR）、
 * 无 tab、无行尾空格、末尾恰好一个换行（规范第4节）。二进制扩展名跳过。
 * 本脚本只覆盖编码与空白规则；行数/复杂度门禁的定制 checker 尚未实现，
 * 不得以本脚本冒充完整流水线。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const binaryExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp3", ".m4a", ".aac",
  ".wav", ".mp4", ".ttf", ".woff", ".woff2", ".zip",
]);
const skipDirs = new Set([".git", "node_modules", "unpackage", "dist"]);
/* 具名排除：docs/progress/evidence/*.log 为工具原始输出捕获（非手写文本），
   保留原字节不做规范化。 */
const skipPattern = /docs[\/\\]progress[\/\\]evidence[\/\\].*\.log$/;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!skipDirs.has(name)) {
        out.push(...walk(full));
      }
    } else {
      const dot = name.lastIndexOf(".");
      const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
      if (!binaryExtensions.has(ext) && !skipPattern.test(full)) {
        out.push(full);
      }
    }
  }
  return out;
}

let failures = 0;
let checked = 0;
for (const file of walk(root)) {
  checked += 1;
  const bytes = readFileSync(file);
  const rel = file.slice(root.length + 1);
  if (bytes.includes(13)) {
    failures += 1;
    console.error("FAIL(CR): " + rel);
  }
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    failures += 1;
    console.error("FAIL(BOM): " + rel);
  }
  const text = bytes.toString("utf8");
  if (text.includes("\t")) {
    failures += 1;
    console.error("FAIL(TAB): " + rel);
  }
  if (/ \n/.test(text)) {
    failures += 1;
    console.error("FAIL(TRAILING_SPACE): " + rel);
  }
  if (!text.endsWith("\n") || text.endsWith("\n\n")) {
    failures += 1;
    console.error("FAIL(EOF_NEWLINE): " + rel);
  }
}

console.log("files=" + checked);
if (failures > 0) {
  console.error("共 " + failures + " 项失败");
  process.exit(1);
}
console.log("PASS: 全部手写文本 UTF-8 无 BOM / LF / 无 tab / 无行尾空格 / 末尾单换行");
