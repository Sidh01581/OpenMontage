// Browser preview QA for LATER.: loads the LaterFilm composition in Remotion's headless Chrome,
// captures opening / middle / climax / end frames, and records every browser console message.
// Usage (from remotion-composer/): node projects/later/qa/browser_preview_check.mjs <outDir>
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const outDir = path.resolve(process.argv[2] ?? "../projects/later/renders/qa");
fs.mkdirSync(outDir, { recursive: true });
const logs = [];
const onBrowserLog = (l) => logs.push({ type: l.type, text: l.text });

const serveUrl = await bundle({ entryPoint: path.resolve("projects/later/index.tsx"), publicDir: path.resolve("projects/later/public") });
const composition = await selectComposition({ serveUrl, id: "LaterFilm", onBrowserLog });
const frames = { opening: 30, act2: 900, act3_climax: 2700, rock_bottom: 3250, turn: 3900, end: 4740 };
const shots = {};
for (const [name, frame] of Object.entries(frames)) {
  const output = path.join(outDir, `preview_${name}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.5, onBrowserLog });
  shots[name] = { frame, output, bytes: fs.statSync(output).size };
}
const errors = logs.filter((l) => l.type === "error");
const warnings = logs.filter((l) => l.type === "warning");
const report = {
  composition: { id: composition.id, durationInFrames: composition.durationInFrames, fps: composition.fps, width: composition.width, height: composition.height },
  frames: shots, console_errors: errors, console_warnings: warnings, console_total: logs.length,
  passed: errors.length === 0 && composition.durationInFrames === 4800,
};
fs.writeFileSync(path.join(outDir, "browser_preview_check.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ passed: report.passed, errors: errors.length, warnings: warnings.length, frames: Object.keys(shots).length }));
