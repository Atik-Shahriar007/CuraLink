// Removes the synthetic_sample rows imported from medicines.sql, leaving only
// medicines that exist in real life.
//
// The source file prisma/seed-data/medicines.sql is NOT modified - it stays the
// untouched original. Only the database rows and their generated cover images
// are removed, so this is fully reversible by re-running the catalog seeder.
//
// Run with: node --experimental-strip-types prisma/remove-synthetic-medicines.mjs

import { unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { MEDICINES } from "../src/data/medicines.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const prisma = new PrismaClient();

const key = (name, strength) => `${name}||${strength}`;

async function main() {
  const verified = new Set(
    MEDICINES.filter((m) => m.source === "verified").map((m) =>
      key(m.name, m.strengthForm)
    )
  );
  console.log(`dataset marks ${verified.size} medicines as verified.`);

  // Catalog-imported rows are the ones with no manufacturer. The 30 curated
  // medicines have one and are always kept.
  const catalog = await prisma.medicine.findMany({
    where: { manufacturer: null },
    select: { id: true, brandName: true, strength: true, imageUrl: true },
  });

  const doomed = catalog.filter((m) => !verified.has(key(m.brandName, m.strength)));
  console.log(`catalog rows: ${catalog.length}  ->  removing ${doomed.length}`);

  if (doomed.length === 0) {
    console.log("Nothing to remove.");
    return;
  }

  // Drop the generated cover images too, so public/ does not keep 900+ orphans.
  let imagesRemoved = 0;
  for (const m of doomed) {
    if (!m.imageUrl?.startsWith("/medicine-images/catalog/")) continue;
    const file = join(root, "public", m.imageUrl.replace(/^\//, ""));
    if (existsSync(file)) {
      unlinkSync(file);
      imagesRemoved++;
    }
  }

  const { count } = await prisma.medicine.deleteMany({
    where: { id: { in: doomed.map((m) => m.id) } },
  });

  const total = await prisma.medicine.count();
  console.log(`removed ${count} rows and ${imagesRemoved} generated images.`);
  console.log(`Medicine table now holds ${total}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
