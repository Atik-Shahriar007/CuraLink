// Second pass over the seeded catalog:
//
//  1. Redraws the generated cover images. The originals put the form/strength
//     text near the bottom edge, which the directory card crops off, and derived
//     initials from digits ("ACEFORMIN407 500MG" -> "A5").
//  2. Re-points a catalog row at a real product photo when its brand genuinely
//     matches one of the 30 curated medicines (e.g. "ACE 500 TAB" -> ace.jpg).
//  3. Fills description and side effects from the active ingredient.
//
// Run with: node --experimental-strip-types prisma/enrich-catalog-medicines.mjs

import { mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { lookupInfo } from "../src/data/medicineInfo.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_DIR = join(root, "public", "medicine-images", "catalog");
const CURATED_DIR = join(root, "public", "medicine-images", "curated");

const prisma = new PrismaClient();

const CATEGORY_COLORS = {
  "Diabetic Accessories": ["#0f766e", "#14b8a6"],
  "Herbal Supplements": ["#15803d", "#4ade80"],
  "Men's Care": ["#1d4ed8", "#60a5fa"],
  "OTC Medicine": ["#b45309", "#fbbf24"],
  "Prescription Medicine": ["#4338ca", "#818cf8"],
  "Supplements & Vitamins": ["#7e22ce", "#c084fc"],
  "Women's Care": ["#be185d", "#f472b6"],
};
const DEFAULT_COLORS = ["#334155", "#94a3b8"];

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Greedy word wrap into at most `maxLines` lines of about `maxChars` each. */
function wrap(text, maxChars, maxLines) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  // Anything that did not fit gets an ellipsis on the last line.
  const used = lines.join(" ").split(/\s+/).length;
  if (used < words.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1]}…`;
  }
  return lines;
}

/**
 * The directory card is a wide strip using object-cover, so a square image is
 * centre-cropped top and bottom. Everything is kept inside y 150-350 of the 500
 * viewBox to survive that crop.
 *
 * Shows the real brand name rather than initials, so the cover reads as a
 * deliberate label instead of a failed image load.
 */
function buildSvg({ brandName, therapeuticCategory, form }) {
  const [dark, light] = CATEGORY_COLORS[therapeuticCategory] ?? DEFAULT_COLORS;

  const lines = wrap(brandName.toUpperCase(), 16, 3);
  const longest = Math.max(...lines.map((l) => l.length));
  const size = longest <= 9 ? 58 : longest <= 13 ? 46 : 37;
  const lineHeight = size * 1.18;

  // Centre the block of lines on y = 260.
  const firstY = 260 - ((lines.length - 1) * lineHeight) / 2 + size * 0.34;

  const nameLines = lines
    .map(
      (line, i) =>
        `  <text x="250" y="${(firstY + i * lineHeight).toFixed(
          1
        )}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${size}" font-weight="600" fill="#ffffff" text-anchor="middle">${escapeXml(
          line
        )}</text>`
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" role="img" aria-label="${escapeXml(
    brandName
  )}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="100%" stop-color="${light}"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#g)"/>
  <text x="250" y="186" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" fill="#ffffff" opacity="0.85" text-anchor="middle" letter-spacing="3">${escapeXml(
    form.toUpperCase()
  )}</text>
  <rect x="205" y="203" width="90" height="3" rx="1.5" fill="#ffffff" opacity="0.55"/>
${nameLines}
</svg>
`;
}

/** Maps "ace" -> "/medicine-images/curated/ace.jpg" from what is on disk. */
function loadCuratedPhotos() {
  const map = new Map();
  let files = [];
  try {
    files = readdirSync(CURATED_DIR);
  } catch {
    return map;
  }

  for (const file of files) {
    const key = file.replace(/\.[^.]+$/, "").toLowerCase();
    map.set(key, `/medicine-images/curated/${file}`);
  }
  return map;
}

async function main() {
  mkdirSync(CATALOG_DIR, { recursive: true });

  const curated = loadCuratedPhotos();
  const medicines = await prisma.medicine.findMany({
    select: {
      id: true,
      brandName: true,
      genericName: true,
      therapeuticCategory: true,
      form: true,
      strength: true,
      imageUrl: true,
      description: true,
      // Null only on catalog-imported rows; the 30 curated medicines have a
      // real manufacturer and their own hand-written clinical text.
      manufacturer: true,
    },
  });

  let redrawn = 0;
  let photoMatched = 0;
  let described = 0;

  for (const med of medicines) {
    const data = {};

    // --- image -------------------------------------------------------------
    const isGenerated = med.imageUrl?.startsWith("/medicine-images/catalog/");

    if (isGenerated) {
      // "ACE 500 TAB" -> "ace"; only an exact first-word match counts, so
      // ACECALM never borrows ACE's photograph.
      const firstWord = med.brandName
        .split(/\s+/)[0]
        .replace(/[^A-Za-z0-9-]/g, "")
        .toLowerCase();
      const photo = curated.get(firstWord);

      if (photo) {
        data.imageUrl = photo;
        photoMatched++;
      } else {
        const file = med.imageUrl.split("/").pop();
        writeFileSync(join(CATALOG_DIR, file), buildSvg(med), "utf8");
        redrawn++;
      }
    }

    // --- description / side effects ---------------------------------------
    // Recomputed every run for catalog rows so corrections to medicineInfo.ts
    // take effect. Curated rows (which have a manufacturer) are left alone.
    if (med.manufacturer === null) {
      const info = lookupInfo(
        med.genericName,
        med.therapeuticCategory,
        med.form
      );
      if (info && info.description !== med.description) {
        data.description = info.description;
        data.sideEffects = info.sideEffects;
        described++;
      }
    }

    if (Object.keys(data).length > 0) {
      await prisma.medicine.update({ where: { id: med.id }, data });
    }
  }

  console.log(`Redrew ${redrawn} generated covers.`);
  console.log(`Matched ${photoMatched} catalog rows to a real product photo.`);
  console.log(`Filled description + side effects on ${described} medicines.`);

  const remaining = await prisma.medicine.count({ where: { description: null } });
  console.log(`Rows still without a description: ${remaining}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
