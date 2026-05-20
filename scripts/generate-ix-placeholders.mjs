import { mkdir } from "node:fs/promises";

import sharp from "sharp";

const TITLES = [
  "ix-1 — Both phones at once",
  "ix-2 — Timing in plain view",
  "ix-3 — Notification ranked",
  "ix-4 — Loud failure",
];

await mkdir("public/case-study", { recursive: true });

for (let i = 0; i < TITLES.length; i++) {
  const title = TITLES[i];
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
      <defs>
        <pattern id="stripe" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
          <rect width="10" height="20" fill="#d7dbe0"/>
          <rect x="10" width="10" height="20" fill="#e7eaed"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stripe)"/>
      <rect x="40" y="40" width="560" height="120" rx="8" fill="#fff" stroke="#bfc4cb"/>
      <text x="64" y="100" font-family="monospace" font-size="22" fill="#676c72">PLACEHOLDER · ${title}</text>
      <text x="64" y="130" font-family="monospace" font-size="16" fill="#676c72">Replace with Figma export at public/case-study/ix-${i + 1}.png</text>
    </svg>`,
  );
  await sharp(svg)
    .png()
    .toFile(`public/case-study/ix-${i + 1}.png`);
  console.log(`wrote public/case-study/ix-${i + 1}.png`);
}
