// Parses prisma/seed-data/medicines.sql into a typed, in-code dataset at
// src/data/medicines.ts so the prescription autocomplete needs no database.
//
// Run with: node scripts/generate-medicines.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SQL_PATH = join(root, "prisma", "seed-data", "medicines.sql");
const OUT_PATH = join(root, "src", "data", "medicines.ts");

/** Splits one VALUES tuple body into its raw fields, honouring '' escapes. */
function splitTuple(body) {
  const fields = [];
  let i = 0;

  while (i < body.length) {
    while (i < body.length && /[\s,]/.test(body[i])) i++;
    if (i >= body.length) break;

    if (body[i] === "'") {
      i++;
      let value = "";
      while (i < body.length) {
        if (body[i] === "'") {
          if (body[i + 1] === "'") {
            value += "'";
            i += 2;
            continue;
          }
          i++;
          break;
        }
        value += body[i++];
      }
      fields.push(value);
    } else {
      let value = "";
      while (i < body.length && body[i] !== ",") value += body[i++];
      fields.push(value.trim());
    }
  }

  return fields;
}

const sql = readFileSync(SQL_PATH, "utf8");
const rows = [];

for (const line of sql.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("('")) continue;

  const body = trimmed.replace(/^\(/, "").replace(/\)[,;]?$/, "");
  const [name, category, genericName, strengthForm, price, source] =
    splitTuple(body);

  if (!name || !category) {
    throw new Error(`Could not parse row: ${trimmed}`);
  }

  rows.push({
    name,
    category,
    genericName: genericName ?? "",
    strengthForm: strengthForm ?? "",
    price: Number(price),
    source: source ?? "synthetic_sample",
  });
}

if (rows.length === 0) throw new Error("No medicine rows parsed");

// The compact encoding below is pipe-delimited, so a literal pipe or newline in
// the data would silently corrupt a row.
for (const row of rows) {
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === "string" && /[|\n\r`$]/.test(value)) {
      throw new Error(`Unsupported character in ${key}: ${value}`);
    }
  }
  if (!Number.isFinite(row.price)) {
    throw new Error(`Bad price for ${row.name}`);
  }
}

const encoded = rows
  .map((r) =>
    [r.name, r.category, r.genericName, r.strengthForm, r.price, r.source].join(
      "|"
    )
  )
  .join("\n");

const out = `// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Source: prisma/seed-data/medicines.sql (${rows.length} rows)
// Regenerate with: node scripts/generate-medicines.mjs

export interface CatalogMedicine {
  /** Brand / trade name as it appears in the dataset. */
  name: string;
  category: string;
  genericName: string;
  strengthForm: string;
  price: number;
  source: string;
}

// Pipe-delimited to keep the bundle small; parsed once at module load.
const RAW = \`
${encoded}
\`;

export const MEDICINES: CatalogMedicine[] = RAW.trim()
  .split("\\n")
  .map((line) => {
    const [name, category, genericName, strengthForm, price, source] =
      line.split("|");
    return {
      name,
      category,
      genericName,
      strengthForm,
      price: Number(price),
      source,
    };
  });

export const MEDICINE_CATEGORIES: string[] = [
  ...new Set(MEDICINES.map((m) => m.category)),
].sort();
`;

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, out, "utf8");

console.log(`Generated ${OUT_PATH} with ${rows.length} medicines.`);
