import fs from "node:fs/promises";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
const component = await fs.readFile("design/AuroraRibbons.tsx", "utf8");
const code = ts.transpileModule(component, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
}).outputText;
await fs.writeFile(".sites-runtime/aurora-ribbons.mjs", code);
const { default: Ribbons } = await import(
  "../.sites-runtime/aurora-ribbons.mjs"
);
const svg = renderToStaticMarkup(React.createElement(Ribbons)).replace(
  "<svg ",
  '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" ',
);
await fs.writeFile("design/aurora-ribbons.svg", svg);
await sharp(Buffer.from(svg))
  .webp({ quality: 90, alphaQuality: 95 })
  .toFile("public/textures/aurora-ribbons.webp");
for (const name of [
  "archive-grain",
  "archive-marble",
  "washi-fibers",
  "gold-leaf",
]) {
  await sharp("public/textures/" + name + ".svg")
    .webp({ quality: 92, alphaQuality: 95 })
    .toFile("public/textures/" + name + ".webp");
}
console.log(
  "Baked static filter artwork; preserved independent CSS animation.",
);
