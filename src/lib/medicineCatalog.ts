import { prisma } from "./prisma";

export interface CatalogMedicine {
  /** Brand / trade name. */
  name: string;
  genericName: string;
  strengthForm: string;
  category: string;
  price: number;
}

// Lower rank sorts first, so a brand-name prefix beats a generic-name substring.
const RANK_NAME_PREFIX = 0;
const RANK_NAME_WORD = 1;
const RANK_GENERIC_PREFIX = 2;
const RANK_NAME_CONTAINS = 3;
const RANK_GENERIC_CONTAINS = 4;

function wordStartsWith(haystack: string, needle: string) {
  let from = haystack.indexOf(" ");
  while (from !== -1) {
    if (haystack.startsWith(needle, from + 1)) return true;
    from = haystack.indexOf(" ", from + 1);
  }
  return false;
}

function rank(name: string, generic: string, q: string): number {
  if (name.startsWith(q)) return RANK_NAME_PREFIX;
  if (wordStartsWith(name, q)) return RANK_NAME_WORD;
  if (generic.startsWith(q)) return RANK_GENERIC_PREFIX;
  if (name.includes(q)) return RANK_NAME_CONTAINS;
  return RANK_GENERIC_CONTAINS;
}

/**
 * Type-ahead over the medicines actually stocked in the catalog.
 *
 * Reads the Medicine table rather than the bundled medicines.sql dataset: that
 * file's 937 synthetic_sample rows are invented brand names, and some of them
 * collide with real drugs while carrying the wrong ingredient (UNIPRIL is a
 * real ramipril tablet but is listed there as an ashwagandha suspension).
 * Prescribing must only ever offer medicines that exist.
 */
export async function searchCatalog(
  query: string,
  limit = 8
): Promise<CatalogMedicine[]> {
  const q = query.trim();
  if (!q) return [];

  const select = {
    brandName: true,
    genericName: true,
    strength: true,
    therapeuticCategory: true,
    price: true,
  };

  // Brand-name prefix hits are fetched on their own so they can never be
  // crowded out. The catalog holds ~1,000 medicines, where a bare `contains`
  // query matches hundreds of rows ("met" matches over a hundred), and a single
  // capped, unordered fetch would discard the obvious answer before the ranking
  // below ever saw it.
  const prefixed = await prisma.medicine.findMany({
    where: { brandName: { startsWith: q, mode: "insensitive" } },
    select,
    orderBy: { brandName: "asc" },
    take: limit,
  });

  // Only reach for weaker matches when the prefix hits do not already fill the
  // list. Ordered so the cap drops a stable tail rather than an arbitrary one.
  const others =
    prefixed.length >= limit
      ? []
      : await prisma.medicine.findMany({
          where: {
            OR: [
              { brandName: { contains: q, mode: "insensitive" } },
              { genericName: { contains: q, mode: "insensitive" } },
            ],
            NOT: { brandName: { startsWith: q, mode: "insensitive" } },
          },
          select,
          orderBy: { brandName: "asc" },
          take: 50,
        });

  const rows = [...prefixed, ...others];

  const lower = q.toLowerCase();

  return rows
    .map((r) => ({
      medicine: {
        name: r.brandName,
        genericName: r.genericName,
        strengthForm: r.strength,
        category: r.therapeuticCategory,
        price: r.price,
      },
      rank: rank(r.brandName.toLowerCase(), r.genericName.toLowerCase(), lower),
    }))
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.medicine.name.length !== b.medicine.name.length) {
        return a.medicine.name.length - b.medicine.name.length;
      }
      return a.medicine.name.localeCompare(b.medicine.name);
    })
    .slice(0, limit)
    .map((h) => h.medicine);
}

/** True when the catalog stocks a medicine with this exact brand name. */
export async function isInCatalog(name: string): Promise<boolean> {
  const trimmed = name.trim();
  if (!trimmed) return false;

  const found = await prisma.medicine.findFirst({
    where: { brandName: { equals: trimmed, mode: "insensitive" } },
    select: { id: true },
  });

  return found !== null;
}
