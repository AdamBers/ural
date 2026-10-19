import { cp, mkdir, readdir } from "node:fs/promises";
const project = new URL("../", import.meta.url);
const target = new URL("public/ocr/", project);
await mkdir(new URL("core/", target), { recursive: true });
await mkdir(new URL("lang/", target), { recursive: true });
await cp(
  new URL("node_modules/tesseract.js/dist/worker.min.js", project),
  new URL("worker.min.js", target),
);
const core = new URL("node_modules/tesseract.js-core/", project);
for (const file of await readdir(core))
  if (/^tesseract-core.*\.(?:js|wasm)$/.test(file))
    await cp(new URL(file, core), new URL(`core/${file}`, target));
await cp(
  new URL(
    "node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz",
    project,
  ),
  new URL("lang/eng.traineddata.gz", target),
);
for (const [from, to] of [
  ["node_modules/tesseract.js/LICENSE.md", "LICENSE-tesseract.txt"],
  ["node_modules/tesseract.js-core/LICENSE", "LICENSE-core.txt"],
])
  await cp(new URL(from, project), new URL(to, target));
console.log("Local OCR assets ready");
