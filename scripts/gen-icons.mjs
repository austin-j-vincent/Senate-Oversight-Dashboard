// Rasterizes public/icon.svg into the PNG sizes the PWA manifest references.
// Run with: npm run gen-icons
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public", "icon.svg");
const sizes = [192, 512];

const svg = await readFile(src);

for (const size of sizes) {
  const out = join(root, "public", `pwa-${size}x${size}.png`);
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: "#060d18" })
    .png()
    .toFile(out);
  console.log(`wrote public/pwa-${size}x${size}.png`);
}
