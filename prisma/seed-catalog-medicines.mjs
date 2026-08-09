// Seeds every medicine from the bundled catalog (src/data/medicines.ts, itself
// generated from prisma/seed-data/medicines.sql) into the Medicine table so the
// public directory can browse all of them.
//
// The catalog carries no manufacturer or clinical text, so those columns are
// left NULL rather than invented — the UI shows "Not specified" instead.
//
// A placeholder cover image is generated per medicine into
// public/medicine-images/catalog/, because no product photography exists for
// these rows (most are synthetic sample data).
//
// Run with: node --experimental-strip-types prisma/seed-catalog-medicines.mjs

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { MEDICINES } from "../src/data/medicines.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_DIR = join(root, "public", "medicine-images", "catalog");
const IMAGE_URL_BASE = "/medicine-images/catalog";

const prisma = new PrismaClient();

// Longest / most specific patterns first so "Nasal Spray" wins over "Spray".
const FORM_PATTERNS = [
  [/nasal\s+spray/i, "Nasal Spray"],
  [/eye\s+drop/i, "Eye Drop"],
  [/nasal\s+drop/i, "Nasal Drop"],
  [/oral\s+solution/i, "Oral Solution"],
  [/\bsuppository\b/i, "Suppository"],
  [/\bsuspension\b/i, "Suspension"],
  [/\bointment\b/i, "Ointment"],
  [/\binhaler\b/i, "Inhaler"],
  [/\binjection\b/i, "Injection"],
  [/\bpowder\b/i, "Powder"],
  [/\bsyrup\b/i, "Syrup"],
  [/\bcream\b/i, "Cream"],
  [/\bdrops?\b/i, "Drop"],
  [/\bgel\b/i, "Gel"],
  [/\bvial\b/i, "Vial"],
  [/\bpfs\b/i, "Injection"],
  [/\bpill\b/i, "Tablet"],
  [/\btablets?\b/i, "Tablet"],
  [/\btab\b/i, "Tablet"],
  [/\bcapsules?\b/i, "Capsule"],
  [/\bcap\b/i, "Capsule"],
];

function deriveForm(strengthForm) {
  for (const [pattern, form] of FORM_PATTERNS) {
    if (pattern.test(strengthForm)) return form;
  }
  return "Other";
}

function deriveUnit(form) {
  if (form === "Tablet") return "Per Tablet";
  if (form === "Capsule") return "Per Capsule";
  return "Per Unit";
}

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

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** First letters of the first two words, e.g. "LEVEMIR FLEXPEN" -> "LF". */
function initials(name) {
  const words = name.split(/\s+/).filter(Boolean);
  const letters = words
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (letters || name.slice(0, 2)).toUpperCase();
}

function buildSvg(medicine, form) {
  const [dark, light] =
    CATEGORY_COLORS[medicine.category] ?? DEFAULT_COLORS;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" role="img" aria-label="${escapeXml(
    medicine.name
  )}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="100%" stop-color="${light}"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#g)"/>
  <circle cx="250" cy="205" r="110" fill="#ffffff" opacity="0.18"/>
  <text x="250" y="245" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="110" font-weight="600" fill="#ffffff" text-anchor="middle">${escapeXml(
    initials(medicine.name)
  )}</text>
  <text x="250" y="380" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="30" fill="#ffffff" opacity="0.95" text-anchor="middle">${escapeXml(
    form
  )}</text>
  <text x="250" y="425" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" fill="#ffffff" opacity="0.8" text-anchor="middle">${escapeXml(
    medicine.strengthForm
  )}</text>
</svg>
`;
}

async function main() {
  mkdirSync(IMAGE_DIR, { recursive: true });

  // Only medicines that exist in real life. The dataset's other 937 rows are
  // marked synthetic_sample - invented brand names generated as filler - so
  // they are never imported. medicines.sql itself is left untouched.
  const catalogue = MEDICINES.filter((m) => m.source === "verified");

  console.log(
    `Preparing ${catalogue.length} verified medicines ` +
      `(skipping ${MEDICINES.length - catalogue.length} synthetic_sample rows)...`
  );

  // Existing rows are matched on brand + strength so re-running is safe.
  const existing = await prisma.medicine.findMany({
    select: { brandName: true, strength: true },
  });
  const seen = new Set(existing.map((m) => `${m.brandName}||${m.strength}`));

  const rows = [];
  const usedSlugs = new Set();
  let images = 0;

  for (const medicine of catalogue) {
    const form = deriveForm(medicine.strengthForm);

    // Slugs must stay unique — the dataset has repeated brand names.
    let slug = slugify(medicine.name);
    if (!slug) slug = "medicine";
    let candidate = slug;
    let n = 2;
    while (usedSlugs.has(candidate)) candidate = `${slug}-${n++}`;
    usedSlugs.add(candidate);

    const imagePath = join(IMAGE_DIR, `${candidate}.svg`);
    if (!existsSync(imagePath)) {
      writeFileSync(imagePath, buildSvg(medicine, form), "utf8");
      images++;
    }

    if (seen.has(`${medicine.name}||${medicine.strengthForm}`)) continue;

    rows.push({
      brandName: medicine.name,
      genericName: medicine.genericName,
      form,
      therapeuticCategory: medicine.category,
      manufacturer: null,
      strength: medicine.strengthForm,
      unit: deriveUnit(form),
      price: medicine.price,
      // The dataset's own category is the only reliable signal here.
      prescriptionRequired: medicine.category === "Prescription Medicine",
      description: null,
      dosage: null,
      sideEffects: null,
      imageUrl: `${IMAGE_URL_BASE}/${candidate}.svg`,
    });
  }

  console.log(`Generated ${images} images in public${IMAGE_URL_BASE}/`);

  if (rows.length === 0) {
    console.log("All catalog medicines are already seeded.");
    return;
  }

  let inserted = 0;
  const CHUNK = 200;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const res = await prisma.medicine.createMany({ data: batch });
    inserted += res.count;
    console.log(`  inserted ${inserted}/${rows.length}`);
  }

  const total = await prisma.medicine.count();
  console.log(`Done. ${inserted} inserted. Medicine table now holds ${total}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
