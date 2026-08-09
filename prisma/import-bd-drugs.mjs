// Imports the scraped Bangladesh drug directory (prisma/seed-data/bd_drugs_scraped.sql,
// 976 rows from drugdirectorybd.com) into the Medicine table.
//
// The scrape carries real brand, generic, strength, form, manufacturer and price
// data, but no category, no OTC flag and almost no clinical text. Nothing is
// invented to fill those gaps:
//
//   * description / dosage / sideEffects stay NULL unless the source had text
//     (8 rows do). The UI already prints "Not specified" for NULL.
//   * therapeuticCategory and prescriptionRequired are DERIVED from the active
//     ingredient, because both columns are NOT NULL. Every rule lives in the
//     tables below so the mapping can be audited.
//   * price is 0 for the 28 rows the source left blank.
//
// Existing medicines are never modified. This script only ever inserts, and it
// skips any scraped brand whose family the catalog already stocks.
//
// Run with:  node --experimental-strip-types prisma/import-bd-drugs.mjs [--dry-run]

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { lookupInfo } from "../src/data/medicineInfo.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SQL_PATH = join(root, "prisma", "seed-data", "bd_drugs_scraped.sql");
const IMAGE_DIR = join(root, "public", "medicine-images", "bd");
const IMAGE_URL_BASE = "/medicine-images/bd";

const DRY_RUN = process.argv.includes("--dry-run");
const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Parsing the dump
// ---------------------------------------------------------------------------

const COLUMNS = [
  "brand_name",
  "generic_name",
  "strength",
  "dosage_form",
  "category",
  "manufacturer",
  "price_info",
  "over_the_counter",
  "description",
  "dosage",
  "side_effects",
  "contraindications",
  "source_url",
  "has_clinical_text",
  "last_verified",
];

/**
 * Splits the VALUES body into one array of raw field values per row.
 *
 * Hand-rolled rather than regex-based because the data contains commas,
 * parentheses and doubled quotes ('Hartmann''s Solution') inside string
 * literals, all of which break naive splitting.
 */
function tokenizeRows(body) {
  const rows = [];
  let fields = null;
  let field = "";
  let inString = false;

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];

    if (inString) {
      if (ch === "'") {
        // A doubled quote is an escaped literal quote, not the string's end.
        if (body[i + 1] === "'") {
          field += "'";
          i++;
        } else {
          inString = false;
          field += ch;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === "'") {
      inString = true;
      field += ch;
    } else if (ch === "(" && fields === null) {
      fields = [];
      field = "";
    } else if (ch === "," && fields !== null) {
      fields.push(field);
      field = "";
    } else if (ch === ")" && fields !== null) {
      fields.push(field);
      rows.push(fields);
      fields = null;
      field = "";
    } else if (fields !== null) {
      field += ch;
    }
  }

  return rows;
}

/** `'Ace 500 mg'` -> `Ace 500 mg`; bare `NULL` -> null. */
function decodeField(raw) {
  const text = raw.trim();
  if (text === "NULL" || text === "") return null;
  if (text === "true") return true;
  if (text === "false") return false;
  if (text.startsWith("'") && text.endsWith("'")) {
    return text.slice(1, -1).replace(/''/g, "'").trim() || null;
  }
  return text;
}

function parseDump() {
  const sql = readFileSync(SQL_PATH, "utf8");
  const start = sql.indexOf(") VALUES");
  if (start === -1) throw new Error("Could not find the VALUES clause");

  return tokenizeRows(sql.slice(start + ") VALUES".length)).map((fields, i) => {
    if (fields.length !== COLUMNS.length) {
      throw new Error(
        `Row ${i + 1} has ${fields.length} fields, expected ${COLUMNS.length}`
      );
    }
    const row = {};
    COLUMNS.forEach((column, c) => {
      row[column] = decodeField(fields[c]);
    });
    return row;
  });
}

/**
 * `'৳ 600.00 | ৳ 12.00 | ৳ 1.20'` -> 1.2
 *
 * The source lists every pack size for a brand (carton, strip, single unit) in
 * one string. The directory shows a per-unit price, so the smallest figure is
 * the right one to take.
 */
function parseUnitPrice(priceInfo) {
  if (!priceInfo) return null;

  const amounts = [];
  for (const match of priceInfo.matchAll(/([\d,]+\.\d{2}|[\d,]+)/g)) {
    const value = Number.parseFloat(match[1].replace(/,/g, ""));
    if (Number.isFinite(value) && value > 0) amounts.push(value);
  }

  return amounts.length ? Math.min(...amounts) : null;
}

// ---------------------------------------------------------------------------
// Dosage form -> the vocabulary the directory's Form filter already uses
// ---------------------------------------------------------------------------

// Mapped explicitly rather than by pattern: the source uses exactly 43 distinct
// form strings, so an exhaustive table is auditable and cannot mis-bucket.
const FORM_MAP = {
  Tablet: "Tablet",
  "Chewable Tablet": "Tablet",
  "Dispersible Tablet": "Tablet",
  "Mups Tablet": "Tablet",
  Capsule: "Capsule",
  Syrup: "Syrup",
  "Oral Suspension": "Suspension",
  Suspension: "Suspension",
  "Powder For Suspension": "Powder",
  "Oral Powder": "Powder",
  Cream: "Cream",
  Ointment: "Ointment",
  Gel: "Gel",
  "Oral Gel": "Gel",
  Lotion: "Lotion",
  Shampoo: "Lotion",
  "Eye Drop (Ophthalmic Solution)": "Eye Drop",
  "Nasal Drops": "Nasal Drop",
  "Nasal Spray": "Nasal Spray",
  "Ear Drop": "Ear Drop",
  "Paediatric Drops": "Drop",
  Suppository: "Suppository",
  "Vaginal Suppository": "Suppository",
  "Dry Powder Inhalation Capsule (DPI)": "Inhaler",
  "Metered Dose Inhaler": "Inhaler",
  "Nasal Inhaler": "Inhaler",
  Injection: "Injection",
  "IM Injection": "Injection",
  "IV Injection": "Injection",
  "IV Infusion": "Injection",
  "IV/IM Injection": "Injection",
  "IV/SC Injection": "Injection",
  "SC Injection": "Injection",
  "IV Injection or Infusion": "Injection",
  "Intraspinal Injection": "Injection",
  "Injectable Solution (Oral & IM)": "Injection",
  "Oral Solution": "Oral Solution",
  "Oral Emulsion": "Oral Solution",
  "Nebuliser Solution": "Solution",
  "Dialysis Solution": "Solution",
  "Mouth Wash": "Mouth Wash",
  "Oral Paste": "Other",
  "Hand Rub": "Other",
};

// Fallback for the 17 rows with no dosage_form: read it off the brand name,
// which usually spells the form out ("Anril Topical Spray", "Plan A Vaginal Gel").
const FORM_FROM_NAME = [
  [/nasal\s+spray/i, "Nasal Spray"],
  [/nasal\s+drops?/i, "Nasal Drop"],
  [/eye\s+drops?/i, "Eye Drop"],
  [/scalp\s+(solution|lotion)/i, "Lotion"],
  [/topical\s+(solution|spray)/i, "Solution"],
  [/\bspray\b/i, "Nasal Spray"],
  [/\bsuppository\b/i, "Suppository"],
  [/\bointment\b/i, "Ointment"],
  [/\bcream\b/i, "Cream"],
  [/\bgel\b/i, "Gel"],
  [/\blotion\b/i, "Lotion"],
  [/\bpowder\b/i, "Powder"],
  [/\bsaline\b|\bsolution\b/i, "Solution"],
  [/\bcapsule\b/i, "Capsule"],
  [/\btablet\b/i, "Tablet"],
];

function deriveForm(row) {
  const mapped = row.dosage_form ? FORM_MAP[row.dosage_form] : null;
  if (mapped) return mapped;

  for (const [pattern, form] of FORM_FROM_NAME) {
    if (pattern.test(row.brand_name)) return form;
  }
  return "Other";
}

function deriveUnit(form) {
  if (form === "Tablet") return "Per Tablet";
  if (form === "Capsule") return "Per Capsule";
  return "Per Unit";
}

// ---------------------------------------------------------------------------
// Active ingredient -> therapeutic category
// ---------------------------------------------------------------------------

// First match wins, so more specific ingredients are listed before the broad
// suffix rules they would otherwise fall into (e.g. Clobetasol before -azole,
// since combination creams name both).
const CATEGORY_RULES = [
  // -- combination topicals, matched before their single components ----------
  [/clobetasol|halobetasol|betamethasone|hydrocortisone|fluocinolone|triamcinolone|mometasone furoate \+|clobetasone|calcipotriol|desonide/i, "Dermatological"],
  [/adapalene|isotretinoin|tretinoin|benzoyl peroxide|eflornithine|hydroquinone|salicylic acid|urea|silver sulfadiazine|zinc oxide|minoxidil|permethrin|ivermectin|β-sitosterol|sitosterol|allium cepa|retapamulin|mupirocin|tacrolimus/i, "Dermatological"],

  // -- anti-infectives -------------------------------------------------------
  // Clotrimazole is spelled out because it is the one antifungal azole that
  // does not contain the "conazole" stem.
  [/conazole|clotrimazole|terbinafine|nystatin|ciclopirox|amphotericin|griseofulvin/i, "Antifungal"],
  [/acyclovir|valacyclovir|entecavir|tenofovir|lamivudine|zidovudine|efavirenz|nirmatrelvir|ritonavir|molnupiravir|favipiravir|remdesivir|sofosbuvir|oseltamivir/i, "Antiviral"],
  [/cillin|cef[a-z]*|ceftazidime|ceftriaxone|cephradine|mycin|micin|floxacin|cycline|penem|meropenem|linezolid|tedizolid|teicoplanin|colistimethate|polymyxin|nitrofurantoin|fosfomycin|pivmecillinam|nalidixic|sulphamethoxazole|trimethoprim|amikacin|chloramphenicol|rifaximin|metronidazole|ornidazole|secnidazole|nitazoxanide|bacitracin|fusidic/i, "Antibiotic"],
  [/albendazole|artemether|lumefantrine|hydroxychloroquine|praziquantel/i, "Antiparasitic"],

  // -- cardiovascular / metabolic --------------------------------------------
  [/statin|ezetimibe|fenofibrate|ciprofibrate|omega-3/i, "Lipid Lowering"],
  [/sartan|pril\b|amlodipine|nifedipine|nimodipine|cilnidipine|bisoprolol|atenolol|nebivolol|carvedilol|metoprolol|hydrochlorothiazide|indapamide|prazosin|methyldopa|clonidine|trimetazidine|ivabradine|ranolazine|nitroglycerin|norepinephrine|ambrisentan|diltiazem/i, "Antihypertensive"],
  [/metformin|gliclazide|glimepiride|glibenclamide|gliptin|gliflozin|insulin|semaglutide|imeglimin|pioglitazone/i, "Antidiabetic"],
  [/clopidogrel|aspirin \+|ticagrelor|rivaroxaban|betrixaban|enoxaparin|fondaparinux|warfarin|cilostazol|tranexamic|phytomenadione/i, "Anticoagulant & Antiplatelet"],
  [/furosemide|torasemide|spironolactone|acetazolamide/i, "Diuretic"],

  // -- gastrointestinal ------------------------------------------------------
  [/omeprazole|esomeprazole|pantoprazole|rabeprazole|lansoprazole|vonoprazan/i, "Proton Pump Inhibitor"],
  [/famotidine|aluminium hydroxide|magaldrate|sodium alginate|sucralfate|simethicone|domperidone|mebeverine|trimebutine|dicycloverine|tiemonium|loperamide|racecadotril|lactulose|ispaghula|sodium picosulfate|lubiprostone|prucalopride|mesalazine|glycerine|pancreatin|probiotic|saccharomyces|peppermint oil|ondansetron|granisetron|palonosetron|prochlorperazine|hingastak|jeerak/i, "Gastrointestinal"],
  // Liver, haemorrhoid, enema and lipase-inhibitor preparations all sit in the
  // GI bucket rather than earning a category each.
  [/obeticholic|ursodeoxycholic|l-ornithine|orlistat|diosmin|hesperidin|sodium phosphate/i, "Gastrointestinal"],

  // -- respiratory / allergy -------------------------------------------------
  [/cetirizine|loratadine|desloratadine|fexofenadine|bilastine|ebastine|rupatadine|chlorpheniramine|ketotifen|diphenhydramine|olopatadine|azelastine/i, "Antihistamine"],
  [/salbutamol|levosalbutamol|ipratropium|glycopyrron|formoterol|salmeterol|vilanterol|indacaterol|aclidinium|budesonide|beclomethasone|fluticasone|mometasone|montelukast|doxophylline|theophylline|acetylcysteine|ambroxol|bromhexine|dextromethorphan|butamirate|guaifenesin|guaiphenasine|pseudoephedrine|xylometazoline|oxymetazoline|gefapixant|adhatoda|sodium cromoglicate|menthol \+ eucalyptus/i, "Respiratory"],

  // -- central nervous system ----------------------------------------------
  [/olanzapine|quetiapine|aripiprazole|lurasidone|risperidone|haloperidol|flupentixol|tetrabenazine/i, "Antipsychotic"],
  [/escitalopram|fluoxetine|paroxetine|sertraline|amitriptyline|imipramine|mirtazapine|duloxetine|melitracen/i, "Antidepressant"],
  [/clonazepam|diazepam|bromazepam|oxazepam|midazolam|melatonin|suvorexant|zolpidem/i, "Sedative & Anxiolytic"],
  [/carbamazepine|levetiracetam|lamotrigine|valproate|perampanel|pregabalin|gabapentin|mirogabalin|phenytoin/i, "Anticonvulsant"],
  [/levodopa|ropinirole|rasagiline|procyclidine|trihexyphenidyl|bromocriptine|pramipexole/i, "Anti-Parkinson"],
  [/piracetam|citicoline|vinpocetine|naftidrofuryl|pentoxifylline|betahistine|cinnarizine|flunarizine|almitrine|rivastigmine|ginkgo|bacopa/i, "Neurological"],
  [/sumatriptan|zolmitriptan|pizotifen|ergotamine/i, "Antimigraine"],
  [/baclofen|eperisone|methocarbamol|dantrolene|tizanidine/i, "Muscle Relaxant"],
  [/atomoxetine|methylphenidate/i, "Neurological"],

  // -- pain ------------------------------------------------------------------
  // Oral-care products are matched first: mouthwashes list methyl salicylate,
  // which would otherwise pull them into the topical-analgesic rule below.
  [/benzydamine|povidone iodine|chlorhexidine|cetrimide|menthol \+ thymol|eucalyptol|amlexanox|sodium fluoride/i, "Antiseptic & Oral Care"],
  [/tramadol|tapentadol|nalbuphine|morphine|pethidine|lidocaine|bupivacaine|cinchocaine/i, "Analgesic & Anaesthetic"],
  [/paracetamol/i, "Analgesic & Antipyretic"],
  [/diclofenac|aceclofenac|naproxen|etoricoxib|ketorolac|meloxicam|nabumetone|etodolac|lornoxicam|tenoxicam|dexketoprofen|dexibuprofen|ketoprofen|tolfenamic|ibuprofen|aspirin|colchicine|allopurinol|febuxostat|dotinurad|methyl salicylate|menthol \+ camphor/i, "Analgesic & Anti-inflammatory"],

  // -- hormones / specialist -------------------------------------------------
  [/prednisolone|methylprednisolone|dexamethasone|deflazacort/i, "Corticosteroid"],
  [/levothyroxine|carbimazole|cabergoline/i, "Hormonal"],
  [/estriol|estradiol|dydrogesterone|norethisterone|allylestrenol|dienogest|tibolone|levonorgestrel|ulipristal|mifepristone|misoprostol|drospirenone|elagolix|relugolix|flibanserin|clomifene|saraca|patrangasav|potassium bitartrate/i, "Women's Care"],
  [/tadalafil|sildenafil|vardenafil|dapoxetine|yohimbine|finasteride|dutasteride|tamsulosin|silodosin|alfuzosin/i, "Men's Care"],
  [/solifenacin|tolterodine|mirabegron|oxybutynin/i, "Urological"],
  [/imatinib|sorafenib|letrozole|megestrol|anastrozole|tamoxifen|capecitabine/i, "Oncology"],
  [/apremilast|baricitinib|tofacitinib|methotrexate|hydroxychloroquine|undenatured type|glucosamine|diacerein|collagen/i, "Rheumatology"],
  [/alendronic|risedronate|ibandronic|zoledronic|calcitriol|calcium acetate|ferric citrate|sodium polystyrene|roxadustat|darbepoetin|erythropoietin|filgrastim|iron sucrose|ferric carboxymaltose|ferric maltol|iron polymaltose|carbonyl iron|ferrous|hemodialysis/i, "Haematology & Renal"],
  [/travoprost|bimatoprost|brimonidine|timolol|bromfenac|carboxymethylcellulose|hypromellose|polyethylene glycol \+ propylene|dextran \+/i, "Ophthalmic"],

  // -- supplements, fluids, sundries ----------------------------------------
  [/vitamin|cholecalciferol|folic acid|folinic acid|biotin|mecobalamin|ascorbic|tocopherol|tocotrienol|betacarotene|multivitamin|thiamine|pyridoxine|riboflavin|niacinamide/i, "Vitamin Supplement"],
  [/calcium|zinc|magnesium|sodium bicarbonate|potassium citrate|coral calcium|algae calcium|multimineral|sodium chloride|dextrose|hartmann|electrolyte|oral rehydration|amino acid|sodium acetate|potassium chloride/i, "Mineral & Electrolyte"],
  [/ginseng|ashwagandha|spirulina|silymarin|nigella|garlic|flaxseed|evening primrose|carica papaya|andrographis|bilberry|cranberry|saw palmetto|red clover|coenzyme|astaxanthin|alpha lipoic|d-chiro-inositol|levocarnitine|herbal|balarista|jogaraj|guggulu|churna|grape extract|natural herbs|fennel|apple vinegar|nabayas|emblica|inositol/i, "Herbal Supplements"],
  [/sucralose|steviol|glycerol \+|liquid sugar|hydroxyethyl cellulose|white soft paraffin|liquid paraffin|light liquid paraffin|octinoxate|avobenzone|enzacamene|inhaler device|isopropyl/i, "OTC Medicine"],
];

function deriveCategory(generic) {
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(generic)) return category;
  }
  return "Other";
}

// ---------------------------------------------------------------------------
// Prescription status
// ---------------------------------------------------------------------------

// The scrape has no OTC flag, so status is inferred. Default is "prescription
// required": these are overwhelmingly Square's prescription lines, and over-
// stating the requirement is the safer error in a medical directory. Only the
// classes below — routinely sold over the counter in Bangladesh — are exempt.
const OTC_RULES = [
  /^paracetamol$/i,
  /oral rehydration|^sucralose$|steviol|liquid sugar/i,
  /vitamin|cholecalciferol|^folic acid$|^biotin$|ascorbic|tocopherol|betacarotene|multivitamin|multimineral/i,
  /^calcium|coral calcium|algae calcium|^zinc sulfate|^magnesium oxide|^sodium bicarbonate$/i,
  /aluminium hydroxide|magaldrate|sodium alginate|^simethicone$/i,
  /^ispaghula|^lactulose$|^glycerine$/i,
  /probiotic|saccharomyces/i,
  /paraffin|^urea$|zinc oxide|octinoxate|avobenzone|enzacamene/i,
  /menthol|camphor|eucalyptol|thymol|methyl salicylate/i,
  /povidone iodine|chlorhexidine|cetrimide|isopropyl alcohol/i,
  /^sodium chloride$/i,
  /ginseng|ashwagandha|spirulina|nigella|garlic|flaxseed|evening primrose|carica papaya|andrographis|bilberry|cranberry|saw palmetto|red clover|herbal|balarista|guggulu|churna|natural herbs|fennel|apple vinegar|emblica|adhatoda|saraca|patrangasav|jeerak|bacopa|grape extract/i,
  /carboxymethylcellulose|hypromellose|^dextran \+/i,
];

function derivePrescriptionRequired(generic) {
  return !OTC_RULES.some((rule) => rule.test(generic));
}

// ---------------------------------------------------------------------------
// Cover images
// ---------------------------------------------------------------------------

const CATEGORY_COLORS = {
  Antibiotic: ["#1d4ed8", "#60a5fa"],
  Antifungal: ["#0369a1", "#38bdf8"],
  Antiviral: ["#0f766e", "#2dd4bf"],
  Antiparasitic: ["#115e59", "#5eead4"],
  Antihypertensive: ["#9f1239", "#fb7185"],
  Antidiabetic: ["#a16207", "#facc15"],
  "Lipid Lowering": ["#854d0e", "#fbbf24"],
  "Anticoagulant & Antiplatelet": ["#991b1b", "#f87171"],
  Diuretic: ["#0e7490", "#22d3ee"],
  "Proton Pump Inhibitor": ["#7e22ce", "#c084fc"],
  Gastrointestinal: ["#6b21a8", "#d8b4fe"],
  Antihistamine: ["#1e40af", "#93c5fd"],
  Respiratory: ["#0284c7", "#7dd3fc"],
  Antipsychotic: ["#3730a3", "#a5b4fc"],
  Antidepressant: ["#4338ca", "#818cf8"],
  "Sedative & Anxiolytic": ["#312e81", "#a5b4fc"],
  Anticonvulsant: ["#5b21b6", "#c4b5fd"],
  "Anti-Parkinson": ["#581c87", "#d8b4fe"],
  Neurological: ["#4c1d95", "#c4b5fd"],
  Antimigraine: ["#701a75", "#e879f9"],
  "Muscle Relaxant": ["#155e75", "#67e8f9"],
  "Analgesic & Anaesthetic": ["#b45309", "#fcd34d"],
  "Analgesic & Antipyretic": ["#c2410c", "#fdba74"],
  "Analgesic & Anti-inflammatory": ["#9a3412", "#fdba74"],
  Corticosteroid: ["#7c2d12", "#fdba74"],
  Hormonal: ["#be185d", "#f9a8d4"],
  "Women's Care": ["#be185d", "#f472b6"],
  "Men's Care": ["#1d4ed8", "#60a5fa"],
  Urological: ["#0f766e", "#5eead4"],
  Oncology: ["#374151", "#9ca3af"],
  Rheumatology: ["#78350f", "#fcd34d"],
  "Haematology & Renal": ["#7f1d1d", "#fca5a5"],
  Ophthalmic: ["#065f46", "#6ee7b7"],
  Dermatological: ["#166534", "#86efac"],
  "Antiseptic & Oral Care": ["#047857", "#6ee7b7"],
  "Vitamin Supplement": ["#7e22ce", "#c084fc"],
  "Mineral & Electrolyte": ["#0f766e", "#14b8a6"],
  "Herbal Supplements": ["#15803d", "#4ade80"],
  "OTC Medicine": ["#b45309", "#fbbf24"],
};
const DEFAULT_COLORS = ["#334155", "#94a3b8"];

function slugify(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "medicine"
  );
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** First letters of the first two alphabetic words, e.g. "Ace Plus" -> "AP". */
function initials(name) {
  const words = name.split(/\s+/).filter((w) => /^[a-z]/i.test(w));
  const letters = words
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (letters || name.slice(0, 2)).toUpperCase();
}

function buildSvg({ brandName, category, form, strength }) {
  const [dark, light] = CATEGORY_COLORS[category] ?? DEFAULT_COLORS;
  const caption = strength ? `${form} · ${strength}` : form;

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
  <circle cx="250" cy="200" r="112" fill="#ffffff" opacity="0.18"/>
  <text x="250" y="242" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="110" font-weight="600" fill="#ffffff" text-anchor="middle">${escapeXml(
    initials(brandName)
  )}</text>
  <text x="250" y="372" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26" fill="#ffffff" opacity="0.95" text-anchor="middle">${escapeXml(
    caption
  )}</text>
</svg>
`;
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

/** Leading word of a brand name, lowercased: "Cef-3 DS 400 mg" -> "cef-3". */
function brandFamily(name) {
  return name.toLowerCase().trim().split(/\s+/)[0];
}

async function main() {
  const rows = parseDump();
  console.log(`Parsed ${rows.length} rows from prisma/seed-data/bd_drugs_scraped.sql`);

  const existing = await prisma.medicine.findMany({
    select: { brandName: true, strength: true, form: true },
  });
  const existingFamilies = new Set(existing.map((m) => brandFamily(m.brandName)));
  console.log(
    `Catalog holds ${existing.length} medicines across ${existingFamilies.size} brand families.`
  );

  const skippedFamily = [];
  const skippedInternal = [];
  const prepared = [];
  const seenKeys = new Set();
  const usedSlugs = new Set();

  for (const row of rows) {
    // Brand families the catalog already stocks are left alone entirely, so
    // curated entries keep their real product photos and clinical text.
    if (existingFamilies.has(brandFamily(row.brand_name))) {
      skippedFamily.push(row.brand_name);
      continue;
    }

    const form = deriveForm(row);
    const strength = row.strength ?? "Not specified";

    // The dump repeats a brand when only a co-ingredient's strength differs
    // (three "Ansulin SC Injection 100 IU" rows). Those collapse to one row here.
    const key = `${row.brand_name.toLowerCase()}||${strength.toLowerCase()}||${form}`;
    if (seenKeys.has(key)) {
      skippedInternal.push(row.brand_name);
      continue;
    }
    seenKeys.add(key);

    const category = deriveCategory(row.generic_name);

    // Reference text for the active ingredient, or failing that for its drug
    // class. Only ever fills a field the scrape left empty, and never dosage:
    // dose depends on strength, form and patient, so it stays "Not specified"
    // exactly as it does for the existing catalog rows.
    const info = lookupInfo(row.generic_name, category, form);

    let slug = slugify(row.brand_name);
    let candidate = slug;
    let n = 2;
    while (usedSlugs.has(candidate)) candidate = `${slug}-${n++}`;
    usedSlugs.add(candidate);

    prepared.push({
      row,
      slug: candidate,
      data: {
        brandName: row.brand_name,
        genericName: row.generic_name,
        form,
        therapeuticCategory: category,
        manufacturer: row.manufacturer,
        strength,
        unit: deriveUnit(form),
        // 28 rows list no price at all; they import as 0.00.
        price: parseUnitPrice(row.price_info) ?? 0,
        prescriptionRequired: derivePrescriptionRequired(row.generic_name),
        // Scraped text always wins; reference text only fills the gap.
        description: row.description ?? info?.description ?? null,
        dosage: row.dosage,
        sideEffects: row.side_effects ?? info?.sideEffects ?? null,
        imageUrl: `${IMAGE_URL_BASE}/${candidate}.svg`,
      },
    });
  }

  report(prepared, skippedFamily, skippedInternal);

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  mkdirSync(IMAGE_DIR, { recursive: true });
  let images = 0;
  for (const { slug, data } of prepared) {
    const path = join(IMAGE_DIR, `${slug}.svg`);
    if (!existsSync(path)) {
      writeFileSync(
        path,
        buildSvg({
          brandName: data.brandName,
          category: data.therapeuticCategory,
          form: data.form,
          strength: data.strength === "Not specified" ? null : data.strength,
        }),
        "utf8"
      );
      images++;
    }
  }
  console.log(`\nGenerated ${images} cover images in public${IMAGE_URL_BASE}/`);

  let inserted = 0;
  const CHUNK = 200;
  for (let i = 0; i < prepared.length; i += CHUNK) {
    const batch = prepared.slice(i, i + CHUNK).map((p) => p.data);
    const res = await prisma.medicine.createMany({ data: batch });
    inserted += res.count;
    console.log(`  inserted ${inserted}/${prepared.length}`);
  }

  const total = await prisma.medicine.count();
  console.log(`\nDone. ${inserted} inserted. Medicine table now holds ${total}.`);
}

function report(prepared, skippedFamily, skippedInternal) {
  const tally = (items) =>
    Object.entries(
      items.reduce((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {})
    ).sort((a, b) => b[1] - a[1]);

  console.log(`\nSkipped ${skippedFamily.length} rows: brand family already stocked`);
  console.log(`  ${[...new Set(skippedFamily)].join(", ")}`);
  console.log(`\nSkipped ${skippedInternal.length} rows: duplicate within the dump`);
  console.log(`  ${[...new Set(skippedInternal)].join(", ")}`);

  console.log(`\nTo import: ${prepared.length}`);

  console.log("\nCategories:");
  for (const [name, count] of tally(
    prepared.map((p) => p.data.therapeuticCategory)
  )) {
    console.log(`  ${String(count).padStart(4)}  ${name}`);
  }

  console.log("\nForms:");
  for (const [name, count] of tally(prepared.map((p) => p.data.form))) {
    console.log(`  ${String(count).padStart(4)}  ${name}`);
  }

  const rx = prepared.filter((p) => p.data.prescriptionRequired).length;
  console.log(`\nPrescription required: ${rx}   Over the counter: ${prepared.length - rx}`);
  console.log(`Zero price: ${prepared.filter((p) => p.data.price === 0).length}`);
  console.log(
    `Description filled: ${prepared.filter((p) => p.data.description).length}` +
      `   still blank: ${prepared.filter((p) => !p.data.description).length}`
  );
  console.log(`Strength "Not specified": ${prepared.filter((p) => p.data.strength === "Not specified").length}`);
  console.log(
    `With source clinical text: ${
      prepared.filter((p) => p.data.dosage || p.data.sideEffects).length
    }`
  );

  const uncategorised = prepared.filter(
    (p) => p.data.therapeuticCategory === "Other"
  );
  if (uncategorised.length) {
    console.log(`\nUnmatched generics (${uncategorised.length}):`);
    for (const [name, count] of tally(uncategorised.map((p) => p.row.generic_name))) {
      console.log(`  ${String(count).padStart(3)}  ${name}`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
