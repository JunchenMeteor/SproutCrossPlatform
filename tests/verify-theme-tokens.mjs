/**
 * 主题 tokens 与规范一致性校验（可在 Node 直接运行，无需 uni 工具链）。
 * 运行：node tests/verify-theme-tokens.mjs
 *
 * 校验内容：
 * 1. 解析 docs/standards/ProjectEngineeringStandard.md 第6节表格（十套 base
 *    与 L/D 固定组合），确认 theme/ThemeTokens.uts 中每个色值字面量都来自
 *    规范、且规范十套 base 全部出现在实现中（无多出、无缺失）。
 * 2. 按规范组合规则对每套主题重算 WCAG sRGB 对比度断言：三级文字×四表面
 *    >=4.5、主按钮字/accent >=4.5、link >=4.5、focus/border >=3、disabled、
 *    四状态 fg/bg >=4.5、progress fill >=3。
 * 本脚本为文本/数学核验，不代替真实 UI、读屏或设备验收（规范第7节）。
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const spec = readFileSync(join(root, "docs/standards/ProjectEngineeringStandard.md"), "utf8");
const impl = readFileSync(join(root, "theme/ThemeTokens.uts"), "utf8");

const hexPattern = /#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?/g;
let failures = 0;

function fail(message) {
  failures += 1;
  console.error("FAIL: " + message);
}

/* 截取规范第6节（主题）到第7节之间的文本作为色值权威范围。 */
const sectionStart = spec.indexOf("## 6.");
const sectionEnd = spec.indexOf("## 7.");
if (sectionStart < 0 || sectionEnd < 0) {
  fail("规范第6节/第7节标题未找到");
  process.exit(1);
}
const section = spec.slice(sectionStart, sectionEnd);
const specColors = new Set((section.match(hexPattern) ?? []).map((c) => c.toUpperCase()));

const implColors = (impl.match(hexPattern) ?? []).map((c) => c.toUpperCase());
const implColorSet = new Set(implColors);
for (const color of implColorSet) {
  if (!specColors.has(color)) {
    fail("实现中出现规范外的色值 " + color);
  }
}

/* 解析十套 base 表：| SkyLight / 晴空蓝 | #87CEFA | #FAF8F3 | ... | */
const baseRows = [];
for (const line of section.split("\n")) {
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 7) {
    continue;
  }
  const idCell = cells[1] ?? "";
  if (!/^(Sky|Mist|Lavender|Peach|Lemon)(Light|Dark) /.test(idCell)) {
    continue;
  }
  const hexes = (line.match(hexPattern) ?? []).map((c) => c.toUpperCase());
  if (hexes.length !== 5) {
    fail("base 行色值数量异常: " + idCell);
    continue;
  }
  baseRows.push({
    id: idCell.split(" ")[0],
    dark: idCell.includes("Dark"),
    accent: hexes[0],
    surfaces: [hexes[1], hexes[2], hexes[3], hexes[4]],
  });
}
if (baseRows.length !== 10) {
  fail("base 表应解析出 10 套主题，实际 " + baseRows.length);
}
for (const row of baseRows) {
  for (const color of [row.accent, ...row.surfaces]) {
    if (!implColorSet.has(color)) {
      fail("规范 base 色值未在实现中出现: " + row.id + " " + color);
    }
  }
}

/* 解析 L/D 组合表指定行的色值。 */
function rowHexes(labelPrefix) {
  for (const line of section.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 4) {
      continue;
    }
    if (!(cells[1] ?? "").startsWith(labelPrefix)) {
      continue;
    }
    return {
      light: (cells[2].match(hexPattern) ?? []).map((c) => c.toUpperCase()),
      dark: (cells[3].match(hexPattern) ?? []).map((c) => c.toUpperCase()),
    };
  }
  fail("L/D 表缺少行: " + labelPrefix);
  return { light: [], dark: [] };
}

const textRows = [
  rowHexes("text.primary"),
  rowHexes("text.secondary"),
  rowHexes("text.tertiary"),
];
const linkRow = rowHexes("link");
const focusRow = rowHexes("focus.border");
const borderRow = rowHexes("border / divider");
const disabledRow = rowHexes("disabled.bg/fg/icon/border");
const statusRows = [
  rowHexes("success.bg/fg/icon"),
  rowHexes("warning.bg/fg/icon"),
  rowHexes("error.bg/fg/icon"),
  rowHexes("info.bg/fg/icon"),
];

/* WCAG sRGB 相对亮度与对比度（规范第7节公式）。 */
function luminance(hex) {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = rgb.map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function assertRatio(fg, bg, min, label) {
  if (ratio(fg, bg) + 1e-9 < min) {
    fail(label + ": " + fg + " on " + bg + " = " + ratio(fg, bg).toFixed(2)
      + " < " + min);
  }
}

let checks = 0;
for (const theme of baseRows) {
  const pick = (row, index) => {
    const cell = theme.dark ? row.dark : row.light;
    const value = cell[index];
    return value === undefined ? null : value;
  };
  const surfaces = theme.surfaces;
  for (const textRow of textRows) {
    const fg = pick(textRow, 0);
    for (const surface of surfaces) {
      assertRatio(fg, surface, 4.5, theme.id + " text");
      checks += 1;
    }
  }
  assertRatio("#14243B", theme.accent, 4.5, theme.id + " buttonPrimaryFg");
  checks += 1;
  const link = pick(linkRow, 0);
  for (const surface of surfaces) {
    assertRatio(link, surface, 4.5, theme.id + " link");
    checks += 1;
  }
  const focus = theme.dark ? theme.accent : pick(focusRow, 0);
  for (const surface of surfaces) {
    assertRatio(focus, surface, 3, theme.id + " focus");
    checks += 1;
  }
  const border = pick(borderRow, 0);
  for (const surface of surfaces) {
    assertRatio(border, surface, 3, theme.id + " border");
    checks += 1;
  }
  const disabled = theme.dark ? disabledRow.dark : disabledRow.light;
  assertRatio(disabled[1], disabled[0], 3, theme.id + " disabled");
  checks += 1;
  for (const statusRow of statusRows) {
    const cell = theme.dark ? statusRow.dark : statusRow.light;
    assertRatio(cell[1], cell[0], 4.5, theme.id + " status");
    checks += 1;
  }
  const progressFill = theme.dark ? theme.accent : link;
  assertRatio(progressFill, surfaces[3], 3, theme.id + " progressFill");
  checks += 1;
}

console.log("themes=" + baseRows.length + " contrastChecks=" + checks
  + " implColors=" + implColorSet.size + " specColors=" + specColors.size);
if (failures > 0) {
  console.error("共 " + failures + " 项失败");
  process.exit(1);
}
console.log("PASS: 色值集合与规范一致，对比度断言全部通过");
