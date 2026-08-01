// prisma/seed-medicines.js
//
// One-time script: uploads each medicine image to Cloudinary, then creates
// the corresponding Medicine row in the database with the resulting image URL.
//
// Run with: node prisma/seed-medicines.js

const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

const IMAGE_DIR = path.join(__dirname, "seed-data", "medicine-images");

const medicines = [
  { brandName: "Napa", genericName: "Paracetamol", form: "Tablet", therapeuticCategory: "Analgesic & Antipyretic", manufacturer: "Beximco Pharma", strength: "500 mg", unit: "Per Tablet", price: 1.20, prescriptionRequired: false, description: "Used for fever and mild to moderate pain relief.", dosage: "1 tablet every 6–8 hours; max 4 tablets daily.", sideEffects: "Nausea, rash (rare), liver damage in overdose.", file: "napa.jpg" },
  { brandName: "Ace", genericName: "Paracetamol", form: "Tablet", therapeuticCategory: "Analgesic & Antipyretic", manufacturer: "Square Pharma", strength: "500 mg", unit: "Per Tablet", price: 1.50, prescriptionRequired: false, description: "Used for fever and mild to moderate pain relief.", dosage: "1 tablet every 6–8 hours; max 4 tablets daily.", sideEffects: "Nausea, rash (rare), liver damage in overdose.", file: "ace.jpg" },
  { brandName: "Seclo", genericName: "Omeprazole", form: "Capsule", therapeuticCategory: "Proton Pump Inhibitor", manufacturer: "Square Pharma", strength: "20 mg", unit: "Per Capsule", price: 7.00, prescriptionRequired: false, description: "Reduces stomach acid and treats GERD and ulcers.", dosage: "1 capsule daily before breakfast.", sideEffects: "Headache, nausea, abdominal pain.", file: "seclo.jpg" },
  { brandName: "Ometid", genericName: "Omeprazole", form: "Capsule", therapeuticCategory: "Proton Pump Inhibitor", manufacturer: "Opsonin Pharma", strength: "20 mg", unit: "Per Capsule", price: 5.00, prescriptionRequired: false, description: "Reduces stomach acid and treats GERD and ulcers.", dosage: "1 capsule daily before breakfast.", sideEffects: "Headache, nausea, abdominal pain.", file: "ometid.jpg" },
  { brandName: "Maxpro", genericName: "Esomeprazole", form: "Capsule", therapeuticCategory: "Proton Pump Inhibitor", manufacturer: "Renata Ltd.", strength: "20 mg", unit: "Per Capsule", price: 10.00, prescriptionRequired: false, description: "Treats acid reflux and peptic ulcer disease.", dosage: "1 capsule daily before meals.", sideEffects: "Headache, diarrhea, dizziness.", file: "maxpro.jpg" },
  { brandName: "Sergel", genericName: "Esomeprazole", form: "Capsule", therapeuticCategory: "Proton Pump Inhibitor", manufacturer: "Healthcare Pharma", strength: "20 mg", unit: "Per Capsule", price: 7.00, prescriptionRequired: false, description: "Treats acid reflux and peptic ulcer disease.", dosage: "1 capsule daily before meals.", sideEffects: "Headache, diarrhea, dizziness.", file: "sergel.jpg" },
  { brandName: "Fexo", genericName: "Fexofenadine", form: "Tablet", therapeuticCategory: "Antihistamine", manufacturer: "Renata Ltd.", strength: "120 mg", unit: "Per Tablet", price: 8.00, prescriptionRequired: false, description: "Relieves allergy symptoms and hives.", dosage: "1 tablet daily.", sideEffects: "Headache, nausea, drowsiness (rare).", file: "fexo.jpg" },
  { brandName: "Fenadin", genericName: "Fexofenadine", form: "Tablet", therapeuticCategory: "Antihistamine", manufacturer: "Incepta Pharma", strength: "120 mg", unit: "Per Tablet", price: 6.00, prescriptionRequired: false, description: "Relieves allergy symptoms and hives.", dosage: "1 tablet daily.", sideEffects: "Headache, nausea, drowsiness (rare).", file: "fenadin.jpg" },
  { brandName: "Histacin", genericName: "Cetirizine", form: "Tablet", therapeuticCategory: "Antihistamine", manufacturer: "Beximco Pharma", strength: "10 mg", unit: "Per Tablet", price: 3.00, prescriptionRequired: false, description: "Used for allergic rhinitis and itching.", dosage: "1 tablet daily.", sideEffects: "Drowsiness, dry mouth, fatigue.", file: "histacin.jpg" },
  { brandName: "Alatrol", genericName: "Cetirizine", form: "Tablet", therapeuticCategory: "Antihistamine", manufacturer: "Square Pharma", strength: "10 mg", unit: "Per Tablet", price: 2.00, prescriptionRequired: false, description: "Used for allergic rhinitis and itching.", dosage: "1 tablet daily.", sideEffects: "Drowsiness, dry mouth, fatigue.", file: "alatrol.jpg" },
  { brandName: "Monas", genericName: "Montelukast", form: "Tablet", therapeuticCategory: "Anti-Allergic", manufacturer: "Drug International", strength: "10 mg", unit: "Per Tablet", price: 16.00, prescriptionRequired: true, description: "Prevents asthma symptoms and allergies.", dosage: "1 tablet nightly.", sideEffects: "Headache, dizziness, abdominal pain.", file: "monas.jpg" },
  { brandName: "Montene", genericName: "Montelukast", form: "Tablet", therapeuticCategory: "Anti-Allergic", manufacturer: "Aristopharma", strength: "10 mg", unit: "Per Tablet", price: 12.00, prescriptionRequired: true, description: "Prevents asthma symptoms and allergies.", dosage: "1 tablet nightly.", sideEffects: "Headache, dizziness, abdominal pain.", file: "montene.jpg" },
  { brandName: "Azithro", genericName: "Azithromycin", form: "Tablet", therapeuticCategory: "Antibiotic", manufacturer: "Beximco Pharma", strength: "500 mg", unit: "Per Tablet", price: 35.00, prescriptionRequired: true, description: "Treats bacterial infections.", dosage: "1 tablet daily for prescribed duration.", sideEffects: "Diarrhea, nausea, stomach discomfort.", file: "azithro.jpg" },
  { brandName: "Az", genericName: "Azithromycin", form: "Tablet", therapeuticCategory: "Antibiotic", manufacturer: "Square Pharma", strength: "500 mg", unit: "Per Tablet", price: 28.00, prescriptionRequired: true, description: "Treats bacterial infections.", dosage: "1 tablet daily for prescribed duration.", sideEffects: "Diarrhea, nausea, stomach discomfort.", file: "az.jpg" },
  { brandName: "Cef-3", genericName: "Cefixime", form: "Capsule", therapeuticCategory: "Antibiotic", manufacturer: "Square Pharma", strength: "200 mg", unit: "Per Capsule", price: 45.00, prescriptionRequired: true, description: "Treats respiratory and urinary infections.", dosage: "1 capsule twice daily.", sideEffects: "Nausea, diarrhea, rash.", file: "cef-3.jpg" },
  { brandName: "Fix-A", genericName: "Cefixime", form: "Capsule", therapeuticCategory: "Antibiotic", manufacturer: "Acme Pharma", strength: "200 mg", unit: "Per Capsule", price: 35.00, prescriptionRequired: true, description: "Treats respiratory and urinary infections.", dosage: "1 capsule twice daily.", sideEffects: "Nausea, diarrhea, rash.", file: "fix-a.jpg" },
  { brandName: "Filmet", genericName: "Metformin", form: "Tablet", therapeuticCategory: "Antidiabetic", manufacturer: "Square Pharma", strength: "500 mg", unit: "Per Tablet", price: 3.00, prescriptionRequired: true, description: "Controls blood sugar in type 2 diabetes.", dosage: "1 tablet 1–2 times daily with meals.", sideEffects: "Diarrhea, nausea, abdominal discomfort.", file: "filmet.jpg" },
  { brandName: "Comet", genericName: "Metformin", form: "Tablet", therapeuticCategory: "Antidiabetic", manufacturer: "Drug International", strength: "500 mg", unit: "Per Tablet", price: 2.00, prescriptionRequired: true, description: "Controls blood sugar in type 2 diabetes.", dosage: "1 tablet 1–2 times daily with meals.", sideEffects: "Diarrhea, nausea, abdominal discomfort.", file: "comet.jpg" },
  { brandName: "Amaryl", genericName: "Glimepiride", form: "Tablet", therapeuticCategory: "Antidiabetic", manufacturer: "Sanofi Bangladesh", strength: "2 mg", unit: "Per Tablet", price: 12.00, prescriptionRequired: true, description: "Helps lower blood sugar levels.", dosage: "1 tablet daily before breakfast.", sideEffects: "Hypoglycemia, dizziness, weight gain.", file: "amaryl.jpg" },
  { brandName: "Diamez", genericName: "Glimepiride", form: "Tablet", therapeuticCategory: "Antidiabetic", manufacturer: "Incepta Pharma", strength: "2 mg", unit: "Per Tablet", price: 8.00, prescriptionRequired: true, description: "Helps lower blood sugar levels.", dosage: "1 tablet daily before breakfast.", sideEffects: "Hypoglycemia, dizziness, weight gain.", file: "diamez.jpg" },
  { brandName: "Amdocal", genericName: "Amlodipine", form: "Tablet", therapeuticCategory: "Antihypertensive", manufacturer: "Healthcare Pharma", strength: "5 mg", unit: "Per Tablet", price: 6.00, prescriptionRequired: true, description: "Used to treat high blood pressure.", dosage: "1 tablet daily.", sideEffects: "Swelling, headache, dizziness.", file: "amdocal.jpg" },
  { brandName: "Amlopin", genericName: "Amlodipine", form: "Tablet", therapeuticCategory: "Antihypertensive", manufacturer: "Acme Pharma", strength: "5 mg", unit: "Per Tablet", price: 4.00, prescriptionRequired: true, description: "Used to treat high blood pressure.", dosage: "1 tablet daily.", sideEffects: "Swelling, headache, dizziness.", file: "amlopin.jpg" },
  { brandName: "Losucon", genericName: "Losartan", form: "Tablet", therapeuticCategory: "Antihypertensive", manufacturer: "Incepta Pharma", strength: "50 mg", unit: "Per Tablet", price: 12.00, prescriptionRequired: true, description: "Treats hypertension and protects kidneys.", dosage: "1 tablet daily.", sideEffects: "Dizziness, fatigue, low blood pressure.", file: "losucon.jpg" },
  { brandName: "Angilock", genericName: "Losartan", form: "Tablet", therapeuticCategory: "Antihypertensive", manufacturer: "Square Pharma", strength: "50 mg", unit: "Per Tablet", price: 8.00, prescriptionRequired: true, description: "Treats hypertension and protects kidneys.", dosage: "1 tablet daily.", sideEffects: "Dizziness, fatigue, low blood pressure.", file: "angilock.jpg" },
  { brandName: "Ceevit", genericName: "Vitamin C", form: "Tablet", therapeuticCategory: "Vitamin Supplement", manufacturer: "Square Pharma", strength: "250 mg", unit: "Per Tablet", price: 2.50, prescriptionRequired: false, description: "Prevents vitamin C deficiency.", dosage: "1 tablet daily.", sideEffects: "Stomach upset, diarrhea (high doses).", file: "ceevit.jpg" },
  { brandName: "Xinc-C", genericName: "Vitamin C", form: "Tablet", therapeuticCategory: "Vitamin Supplement", manufacturer: "Opsonin Pharma", strength: "250 mg", unit: "Per Tablet", price: 1.50, prescriptionRequired: false, description: "Prevents vitamin C deficiency.", dosage: "1 tablet daily.", sideEffects: "Stomach upset, diarrhea (high doses).", file: "xinc-c.jpg" },
  { brandName: "Calbo-D", genericName: "Calcium + Vitamin D", form: "Tablet", therapeuticCategory: "Mineral Supplement", manufacturer: "Square Pharma", strength: "500 mg + 200 IU", unit: "Per Tablet", price: 8.00, prescriptionRequired: false, description: "Supports bone and teeth health.", dosage: "1 tablet daily after meals.", sideEffects: "Constipation, bloating.", file: "calbo-d.jpg" },
  { brandName: "Coralcal-D", genericName: "Calcium + Vitamin D", form: "Tablet", therapeuticCategory: "Mineral Supplement", manufacturer: "Healthcare Pharma", strength: "500 mg + 200 IU", unit: "Per Tablet", price: 5.00, prescriptionRequired: false, description: "Supports bone and teeth health.", dosage: "1 tablet daily after meals.", sideEffects: "Constipation, bloating.", file: "coralcal-d.jpg" },
  { brandName: "Neuro-B", genericName: "Vitamin B Complex", form: "Tablet", therapeuticCategory: "Vitamin Supplement", manufacturer: "Square Pharma", strength: "Standard", unit: "Per Tablet", price: 5.00, prescriptionRequired: false, description: "Helps maintain nerve and metabolic health.", dosage: "1 tablet daily.", sideEffects: "Nausea, mild stomach discomfort.", file: "neuro-b.jpg" },
  { brandName: "B50 Forte", genericName: "Vitamin B Complex", form: "Tablet", therapeuticCategory: "Vitamin Supplement", manufacturer: "Renata Ltd.", strength: "Standard", unit: "Per Tablet", price: 3.00, prescriptionRequired: false, description: "Helps maintain nerve and metabolic health.", dosage: "1 tablet daily.", sideEffects: "Nausea, mild stomach discomfort.", file: "b50-forte.jpg" },
];

async function main() {
  console.log(`Seeding ${medicines.length} medicines...`);

  for (const [i, med] of medicines.entries()) {
    const { file, ...data } = med;
    const filePath = path.join(IMAGE_DIR, file);

    process.stdout.write(`[${i + 1}/${medicines.length}] ${med.brandName}... `);

    try {
      const upload = await cloudinary.uploader.upload(filePath, {
        folder: "curalink/medicines",
        transformation: [{ width: 500, height: 500, crop: "fill" }],
      });

      await prisma.medicine.create({
        data: { ...data, imageUrl: upload.secure_url },
      });

      console.log("done");
    } catch (err) {
      console.error(`FAILED — ${err.message}`);
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });