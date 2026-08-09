// Reference text keyed by the ACTIVE INGREDIENT (generic name), not by brand.
//
// The catalog in medicines.sql supplies a real generic name for every row, so
// this describes what the ingredient is for and its common side effects. It is
// deliberately ingredient-level and general: nothing here is brand-specific,
// and no dosing is given, because dose depends on strength, form and patient.

export interface IngredientInfo {
  description: string;
  sideEffects: string;
}

export const INGREDIENT_INFO: Record<string, IngredientInfo> = {
  // --- Analgesics, antipyretics, anti-inflammatories -----------------------
  PARACETAMOL: {
    description: "Relieves mild to moderate pain and reduces fever.",
    sideEffects: "Generally well tolerated; rash is rare. Overdose can cause serious liver damage.",
  },
  "PARACETAMOL BP": {
    description: "Relieves mild to moderate pain and reduces fever.",
    sideEffects: "Generally well tolerated; rash is rare. Overdose can cause serious liver damage.",
  },
  "PARACETAMOL+TRAMADOL": {
    description: "Combination pain reliever for moderate to severe pain.",
    sideEffects: "Nausea, dizziness, drowsiness, constipation. Tramadol can be habit-forming.",
  },
  IBUPROFEN: {
    description: "Non-steroidal anti-inflammatory used for pain, fever and inflammation.",
    sideEffects: "Stomach upset, heartburn, ulcers with prolonged use, kidney strain.",
  },
  ACECLOFENAC: {
    description: "Non-steroidal anti-inflammatory used for arthritis and musculoskeletal pain.",
    sideEffects: "Indigestion, nausea, abdominal pain, dizziness.",
  },
  "ACECLOFENAC+PARACETAMOL": {
    description: "Combination anti-inflammatory and pain reliever for joint and muscle pain.",
    sideEffects: "Indigestion, nausea, abdominal pain; liver strain in overdose.",
  },
  "DICLOFENAC SODIUM": {
    description: "Non-steroidal anti-inflammatory for pain, swelling and arthritis.",
    sideEffects: "Stomach irritation, nausea, headache; ulcers with prolonged use.",
  },
  "DICLOFENAC GEL": {
    description: "Topical anti-inflammatory applied to painful joints and muscles.",
    sideEffects: "Local redness, itching or dryness at the application site.",
  },
  ETORICOXIB: {
    description: "Selective anti-inflammatory used for arthritis and acute pain.",
    sideEffects: "Raised blood pressure, swelling of the legs, indigestion.",
  },

  // --- Acid, gut and digestion --------------------------------------------
  OMEPRAZOLE: {
    description: "Proton pump inhibitor that reduces stomach acid; treats reflux and ulcers.",
    sideEffects: "Headache, nausea, abdominal pain, diarrhoea.",
  },
  ESOMEPRAZOLE: {
    description: "Proton pump inhibitor for acid reflux and peptic ulcer disease.",
    sideEffects: "Headache, diarrhoea, dizziness, nausea.",
  },
  PANTOPRAZOLE: {
    description: "Proton pump inhibitor that lowers stomach acid production.",
    sideEffects: "Headache, diarrhoea, nausea, dizziness.",
  },
  FAMOTIDINE: {
    description: "Reduces stomach acid; used for heartburn, reflux and ulcers.",
    sideEffects: "Headache, dizziness, constipation or diarrhoea.",
  },
  "FAMOTIDINE USP": {
    description: "Reduces stomach acid; used for heartburn, reflux and ulcers.",
    sideEffects: "Headache, dizziness, constipation or diarrhoea.",
  },
  ANTACID: {
    description: "Neutralises stomach acid for quick relief of heartburn and indigestion.",
    sideEffects: "Constipation or diarrhoea depending on the salts used; bloating.",
  },
  "CALCIUM CARBONATE": {
    description: "Antacid and calcium supplement; neutralises stomach acid and supports bone health.",
    sideEffects: "Constipation, bloating, belching.",
  },
  "MAGNESIUM HYDROXIDE": {
    description: "Antacid and osmotic laxative for indigestion and constipation.",
    sideEffects: "Loose stools, abdominal cramps.",
  },
  DOMPERIDONE: {
    description: "Relieves nausea, vomiting, bloating and delayed stomach emptying.",
    sideEffects: "Dry mouth, headache; rarely heart rhythm changes.",
  },
  "DOMPERIDONE+OMEPRAZOLE": {
    description: "Combination for acid reflux with nausea, bloating or regurgitation.",
    sideEffects: "Headache, dry mouth, abdominal discomfort.",
  },
  METOCLOPRAMIDE: {
    description: "Controls nausea and vomiting and speeds up stomach emptying.",
    sideEffects: "Drowsiness, restlessness; movement disorders with prolonged use.",
  },
  LOPERAMIDE: {
    description: "Slows bowel movement to control acute diarrhoea.",
    sideEffects: "Constipation, abdominal cramps, dry mouth, dizziness.",
  },
  "ORAL REHYDRATION SALT": {
    description: "Replaces water and electrolytes lost through diarrhoea or vomiting.",
    sideEffects: "Very well tolerated; vomiting if drunk too quickly.",
  },
  ORS: {
    description: "Replaces water and electrolytes lost through diarrhoea or vomiting.",
    sideEffects: "Very well tolerated; vomiting if drunk too quickly.",
  },
  BISACODYL: {
    description: "Stimulant laxative used for short-term relief of constipation.",
    sideEffects: "Abdominal cramps, nausea, loose stools.",
  },
  GLYCERIN: {
    description: "Draws water into the bowel to relieve constipation.",
    sideEffects: "Local irritation, mild cramping.",
  },
  "GLYCERIN SUPPOSITORY": {
    description: "Rectal laxative that softens stool and relieves constipation quickly.",
    sideEffects: "Local irritation, mild cramping.",
  },
  "HYOSCINE BUTYLBROMIDE": {
    description: "Antispasmodic that relieves abdominal cramps and colic.",
    sideEffects: "Dry mouth, blurred vision, fast heartbeat, constipation.",
  },
  "HYOSCINE HYDROBROMIDE": {
    description: "Prevents motion sickness, nausea and vomiting while travelling.",
    sideEffects: "Drowsiness, dry mouth, blurred vision.",
  },
  "ACID TANNIC 33%": {
    description: "Astringent preparation traditionally used for bowel irritation.",
    sideEffects: "Nausea, stomach discomfort.",
  },
  "POTASSIUM CITRATE & CITRIC ACID": {
    description: "Alkalinises urine to ease burning urination and help prevent kidney stones.",
    sideEffects: "Nausea, stomach upset; raised potassium in kidney disease.",
  },
  "URSODEOXYCHOLIC ACID": {
    description: "Bile acid used for gallstones and certain chronic liver conditions.",
    sideEffects: "Diarrhoea, nausea, abdominal discomfort.",
  },
  SILYMARIN: {
    description: "Milk thistle extract taken to support liver function.",
    sideEffects: "Mild stomach upset, loose stools.",
  },
  PROBIOTIC: {
    description: "Live beneficial bacteria that help restore normal gut flora.",
    sideEffects: "Temporary bloating or gas.",
  },
  ORLISTAT: {
    description: "Blocks absorption of dietary fat as part of a weight-management plan.",
    sideEffects: "Oily stools, urgent bowel movements, flatulence, reduced vitamin absorption.",
  },

  // --- Allergy, cough and respiratory --------------------------------------
  CETIRIZINE: {
    description: "Antihistamine for allergic rhinitis, itching and hives.",
    sideEffects: "Drowsiness, dry mouth, fatigue.",
  },
  "CETIRIZINE+PSEUDOEPHEDRINE": {
    description: "Antihistamine with a decongestant for allergy with a blocked nose.",
    sideEffects: "Insomnia, restlessness, raised blood pressure, dry mouth.",
  },
  LORATADINE: {
    description: "Non-drowsy antihistamine for hay fever, itching and hives.",
    sideEffects: "Headache, dry mouth, fatigue.",
  },
  FEXOFENADINE: {
    description: "Non-drowsy antihistamine for allergy symptoms and hives.",
    sideEffects: "Headache, nausea, drowsiness (uncommon).",
  },
  "CHLORPHENIRAMINE MALEATE": {
    description: "Sedating antihistamine for allergies, itching and cold symptoms.",
    sideEffects: "Drowsiness, dry mouth, blurred vision.",
  },
  MONTELUKAST: {
    description: "Prevents asthma attacks and controls allergic rhinitis.",
    sideEffects: "Headache, abdominal pain; mood or sleep changes uncommonly.",
  },
  "MONTELUKAST SODIUM": {
    description: "Prevents asthma attacks and controls allergic rhinitis.",
    sideEffects: "Headache, abdominal pain; mood or sleep changes uncommonly.",
  },
  "MONTELUKAST+LEVOCETIRIZINE": {
    description: "Combination for allergic rhinitis with asthma symptoms.",
    sideEffects: "Drowsiness, headache, dry mouth.",
  },
  "COUGH SYRUP": {
    description: "Eases cough and soothes irritated airways.",
    sideEffects: "Drowsiness, nausea, dizziness depending on the formulation.",
  },
  "HERBAL COUGH SYRUP": {
    description: "Traditional herbal preparation used to soothe cough and throat irritation.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },
  DEXTROMETHORPHAN: {
    description: "Suppresses a persistent dry cough.",
    sideEffects: "Drowsiness, dizziness, nausea.",
  },
  GUAIFENESIN: {
    description: "Loosens chest mucus so a productive cough clears more easily.",
    sideEffects: "Nausea, vomiting, dizziness.",
  },
  BROMHEXINE: {
    description: "Thins mucus to make a chesty cough more productive.",
    sideEffects: "Stomach upset, nausea, rash (rare).",
  },
  THEOPHYLLINE: {
    description: "Opens the airways in asthma and chronic obstructive lung disease.",
    sideEffects: "Nausea, palpitations, tremor, insomnia.",
  },
  "IPRATROPIUM BROMIDE": {
    description: "Inhaled bronchodilator that relaxes and opens the airways.",
    sideEffects: "Dry mouth, throat irritation, headache.",
  },
  "FLUTICASONE NASAL SPRAY": {
    description: "Steroid nasal spray that reduces inflammation in allergic rhinitis.",
    sideEffects: "Nasal dryness, irritation, nosebleeds.",
  },
  "BECLOMETHASONE NASAL SPRAY": {
    description: "Steroid nasal spray for persistent nasal allergy and congestion.",
    sideEffects: "Nasal irritation, dryness, nosebleeds.",
  },
  XYLOMETAZOLINE: {
    description: "Decongestant that shrinks swollen nasal passages.",
    sideEffects: "Nasal burning or dryness; rebound congestion if used more than a few days.",
  },
  OXYMETAZOLINE: {
    description: "Nasal decongestant for short-term relief of a blocked nose.",
    sideEffects: "Nasal dryness, stinging; rebound congestion with prolonged use.",
  },

  // --- Anti-infectives ------------------------------------------------------
  AZITHROMYCIN: {
    description: "Macrolide antibiotic for respiratory, skin and soft tissue infections.",
    sideEffects: "Diarrhoea, nausea, abdominal discomfort.",
  },
  CLARITHROMYCIN: {
    description: "Macrolide antibiotic for chest, sinus and skin infections.",
    sideEffects: "Taste disturbance, nausea, diarrhoea.",
  },
  CEFIXIME: {
    description: "Cephalosporin antibiotic for respiratory and urinary tract infections.",
    sideEffects: "Nausea, diarrhoea, rash.",
  },
  CEFUROXIME: {
    description: "Cephalosporin antibiotic for respiratory, urinary and skin infections.",
    sideEffects: "Nausea, diarrhoea, rash.",
  },
  "AMOXICILLIN+CLAVULANIC ACID": {
    description: "Broad-spectrum penicillin antibiotic for resistant bacterial infections.",
    sideEffects: "Diarrhoea, nausea, rash; thrush with longer courses.",
  },
  FLUCLOXACILLIN: {
    description: "Penicillin antibiotic used mainly for skin and soft tissue infections.",
    sideEffects: "Nausea, diarrhoea, rash.",
  },
  CIPROFLOXACIN: {
    description: "Fluoroquinolone antibiotic for urinary, gut and respiratory infections.",
    sideEffects: "Nausea, diarrhoea, dizziness; rarely tendon problems.",
  },
  METRONIDAZOLE: {
    description: "Treats anaerobic bacterial and protozoal infections such as amoebiasis.",
    sideEffects: "Metallic taste, nausea, dark urine. Avoid alcohol during treatment.",
  },
  MUPIROCIN: {
    description: "Topical antibiotic for impetigo and small infected skin lesions.",
    sideEffects: "Local burning, stinging or itching.",
  },
  "NEOMYCIN+BACITRACIN+POLYMYXIN B": {
    description: "Topical triple antibiotic for minor cuts, grazes and burns.",
    sideEffects: "Local irritation or allergic contact dermatitis.",
  },
  "SILVER SULFADIAZINE": {
    description: "Antibacterial cream used to prevent infection in burns.",
    sideEffects: "Local burning, itching; rarely low white cell count.",
  },
  "IODINE ANTISEPTIC": {
    description: "Antiseptic for cleaning skin, wounds and before procedures.",
    sideEffects: "Skin staining, irritation, allergic reaction.",
  },
  "ANTIFUNGAL CREAM": {
    description: "Treats fungal skin infections such as ringworm and athlete's foot.",
    sideEffects: "Local burning, redness or itching.",
  },
  "KETOCONAZOLE CREAM": {
    description: "Antifungal cream for ringworm, dandruff and other fungal skin infections.",
    sideEffects: "Local irritation, burning, itching.",
  },
  TERBINAFINE: {
    description: "Antifungal for skin and nail infections.",
    sideEffects: "Stomach upset, taste changes, rash; liver effects rarely.",
  },
  RAVUCONAZOLE: {
    description: "Antifungal used for systemic and resistant fungal infections.",
    sideEffects: "Nausea, headache, liver enzyme changes.",
  },
  "PERMETHRIN 5%": {
    description: "Topical treatment for scabies and lice.",
    sideEffects: "Itching, burning or stinging after application.",
  },

  // --- Cardiovascular -------------------------------------------------------
  AMLODIPINE: {
    description: "Calcium channel blocker that lowers blood pressure and eases angina.",
    sideEffects: "Ankle swelling, flushing, headache, dizziness.",
  },
  "LOSARTAN POTASSIUM": {
    description: "Lowers blood pressure and protects the kidneys in diabetes.",
    sideEffects: "Dizziness, fatigue, raised potassium.",
  },
  TELMISARTAN: {
    description: "Angiotensin receptor blocker used to control high blood pressure.",
    sideEffects: "Dizziness, back pain, raised potassium.",
  },
  ENALAPRIL: {
    description: "ACE inhibitor for high blood pressure and heart failure.",
    sideEffects: "Dry cough, dizziness, raised potassium.",
  },
  BISOPROLOL: {
    description: "Beta blocker that slows the heart rate in hypertension and heart failure.",
    sideEffects: "Fatigue, cold hands and feet, slow heartbeat.",
  },
  "METOPROLOL SUCCINATE": {
    description: "Beta blocker for high blood pressure, angina and heart failure.",
    sideEffects: "Tiredness, dizziness, slow heartbeat.",
  },
  ATORVASTATIN: {
    description: "Statin that lowers cholesterol and cardiovascular risk.",
    sideEffects: "Muscle aches, headache, liver enzyme changes.",
  },
  ROSUVASTATIN: {
    description: "Statin that lowers LDL cholesterol and cardiovascular risk.",
    sideEffects: "Muscle pain, headache, nausea.",
  },
  SIMVASTATIN: {
    description: "Statin used to lower cholesterol.",
    sideEffects: "Muscle aches, constipation, liver enzyme changes.",
  },

  // --- Diabetes and endocrine ----------------------------------------------
  "METFORMIN HCL": {
    description: "First-line medicine for type 2 diabetes; improves insulin sensitivity.",
    sideEffects: "Diarrhoea, nausea, metallic taste, abdominal discomfort.",
  },
  "METFORMIN HCL+GLIBENCLAMIDE": {
    description: "Combination tablet for type 2 diabetes not controlled by one agent.",
    sideEffects: "Low blood sugar, nausea, diarrhoea, weight gain.",
  },
  GLIMEPIRIDE: {
    description: "Sulfonylurea that stimulates insulin release in type 2 diabetes.",
    sideEffects: "Low blood sugar, weight gain, nausea.",
  },
  GLICLAZIDE: {
    description: "Sulfonylurea used to lower blood sugar in type 2 diabetes.",
    sideEffects: "Low blood sugar, weight gain, stomach upset.",
  },
  VILDAGLIPTIN: {
    description: "DPP-4 inhibitor that improves blood sugar control in type 2 diabetes.",
    sideEffects: "Headache, dizziness, nausea.",
  },
  "VILDAGLIPTIN+METFORMIN": {
    description: "Combination therapy for type 2 diabetes.",
    sideEffects: "Nausea, diarrhoea, headache, low blood sugar.",
  },
  "SITAGLIPTIN+METFORMIN": {
    description: "Combination therapy for type 2 diabetes.",
    sideEffects: "Nausea, diarrhoea, headache, low blood sugar.",
  },
  PIOGLITAZONE: {
    description: "Improves insulin sensitivity in type 2 diabetes.",
    sideEffects: "Weight gain, fluid retention, swelling; bone fracture risk.",
  },
  "INSULIN HUMAN": {
    description: "Replacement insulin used to control blood glucose in diabetes.",
    sideEffects: "Low blood sugar, injection site reactions, weight gain.",
  },
  // Keys are matched uppercased, so this must be "RDNA", not "rDNA".
  "RDNA HUMAN INSULIN": {
    description: "Biosynthetic human insulin for blood glucose control in diabetes.",
    sideEffects: "Low blood sugar, injection site reactions, weight gain.",
  },
  "INSULIN DETEMIR": {
    description: "Long-acting insulin providing steady background glucose control.",
    sideEffects: "Low blood sugar, injection site reactions, weight gain.",
  },
  "INSULIN GLARGINE": {
    description: "Long-acting basal insulin given once daily.",
    sideEffects: "Low blood sugar, injection site reactions, weight gain.",
  },
  "GLUCOSE CONTROL SOLUTION": {
    description: "Control solution used to check that a blood glucose meter is reading accurately.",
    sideEffects: "Not for internal use; for device testing only.",
  },
  "DIABETIC FOOT CREAM": {
    description: "Emollient for dry, cracked diabetic skin to help prevent foot complications.",
    sideEffects: "Local irritation in sensitive skin.",
  },
  "LEVOTHYROXINE SODIUM": {
    description: "Thyroid hormone replacement for an underactive thyroid.",
    sideEffects: "Palpitations, tremor, weight loss and insomnia if the dose is too high.",
  },
  CARBIMAZOLE: {
    description: "Reduces thyroid hormone production in an overactive thyroid.",
    sideEffects: "Rash, joint pain; rarely a serious drop in white blood cells.",
  },
  OXYTOCIN: {
    description: "Hormone used in obstetric care to stimulate uterine contractions.",
    sideEffects: "Strong contractions, nausea, changes in blood pressure.",
  },

  // --- Steroids and skin ----------------------------------------------------
  PREDNISOLONE: {
    description: "Corticosteroid that suppresses inflammation and immune response.",
    sideEffects: "Increased appetite, weight gain, raised blood sugar, mood changes.",
  },
  DEXAMETHASONE: {
    description: "Potent corticosteroid used for severe inflammation and swelling.",
    sideEffects: "Raised blood sugar, insomnia, mood changes, fluid retention.",
  },
  HYDROCORTISONE: {
    description: "Mild corticosteroid for inflamed, itchy skin conditions.",
    sideEffects: "Skin thinning with prolonged use, local burning.",
  },
  BETAMETHASONE: {
    description: "Potent corticosteroid for inflammatory skin and allergic conditions.",
    sideEffects: "Skin thinning, stretch marks, local irritation.",
  },
  "CLOBETASOL PROPIONATE": {
    description: "Very potent topical steroid for stubborn inflammatory skin disease.",
    sideEffects: "Skin thinning, stretch marks, burning; avoid long unsupervised use.",
  },
  "FLUOCINOLONE ACETONIDE": {
    description: "Topical corticosteroid for eczema, dermatitis and psoriasis.",
    sideEffects: "Skin thinning, irritation, discolouration.",
  },
  "BENZOYL PEROXIDE": {
    description: "Topical acne treatment that kills bacteria and unblocks pores.",
    sideEffects: "Dryness, peeling, redness; bleaches fabric.",
  },
  ISOTRETINOIN: {
    description: "Oral retinoid for severe, treatment-resistant acne.",
    sideEffects: "Very dry lips and skin, nosebleeds, raised lipids. Causes serious birth defects.",
  },

  // --- Neurology and psychiatry --------------------------------------------
  SERTRALINE: {
    description: "SSRI antidepressant for depression, anxiety and panic disorder.",
    sideEffects: "Nausea, insomnia, sexual dysfunction, initial restlessness.",
  },
  AMITRIPTYLINE: {
    description: "Tricyclic used for depression and for chronic nerve pain.",
    sideEffects: "Drowsiness, dry mouth, constipation, weight gain.",
  },
  MIRTAZAPINE: {
    description: "Antidepressant that also improves sleep and appetite.",
    sideEffects: "Drowsiness, increased appetite, weight gain.",
  },
  ARIPIPRAZOLE: {
    description: "Antipsychotic for schizophrenia and bipolar disorder.",
    sideEffects: "Restlessness, insomnia, headache, tremor.",
  },
  OLANZAPINE: {
    description: "Antipsychotic for schizophrenia and acute mania.",
    sideEffects: "Weight gain, drowsiness, raised blood sugar and lipids.",
  },
  QUETIAPINE: {
    description: "Antipsychotic used in schizophrenia, bipolar disorder and as a mood stabiliser.",
    sideEffects: "Drowsiness, dizziness, weight gain, dry mouth.",
  },
  RISPERIDONE: {
    description: "Antipsychotic for schizophrenia and irritability in autism.",
    sideEffects: "Weight gain, drowsiness, tremor, raised prolactin.",
  },
  ALPRAZOLAM: {
    description: "Short-acting benzodiazepine for anxiety and panic attacks.",
    sideEffects: "Drowsiness, poor coordination, dependence with prolonged use.",
  },
  DIAZEPAM: {
    description: "Benzodiazepine for anxiety, muscle spasm and seizures.",
    sideEffects: "Drowsiness, muscle weakness, dependence with prolonged use.",
  },
  CLONAZEPAM: {
    description: "Benzodiazepine used for seizure disorders and panic disorder.",
    sideEffects: "Drowsiness, poor coordination, dependence with prolonged use.",
  },
  MIDAZOLAM: {
    description: "Short-acting sedative used before procedures and for acute seizures.",
    sideEffects: "Drowsiness, slowed breathing, amnesia around the dose.",
  },
  MELATONIN: {
    description: "Hormone supplement used for jet lag and difficulty falling asleep.",
    sideEffects: "Morning grogginess, headache, vivid dreams.",
  },
  PHENYTOIN: {
    description: "Anticonvulsant used to prevent and control seizures.",
    sideEffects: "Gum overgrowth, unsteadiness, rash, dizziness.",
  },
  CARBAMAZEPINE: {
    description: "Anticonvulsant used for epilepsy and trigeminal neuralgia.",
    sideEffects: "Drowsiness, dizziness, double vision, low sodium.",
  },
  LEVETIRACETAM: {
    description: "Anticonvulsant used to control several seizure types.",
    sideEffects: "Drowsiness, irritability, dizziness.",
  },
  "SODIUM VALPROATE+VALPORIC ACID": {
    description: "Anticonvulsant and mood stabiliser for epilepsy and bipolar disorder.",
    sideEffects: "Weight gain, tremor, hair thinning. Causes serious birth defects.",
  },
  BACLOFEN: {
    description: "Muscle relaxant that eases spasticity and muscle spasm.",
    sideEffects: "Drowsiness, weakness, dizziness, nausea.",
  },
  TOLPERISONE: {
    description: "Muscle relaxant used for painful muscle spasm.",
    sideEffects: "Muscle weakness, headache, low blood pressure.",
  },
  "TRIHEXYPHENIDYL HCL": {
    description: "Controls tremor and stiffness in Parkinsonism and drug-induced movement disorders.",
    sideEffects: "Dry mouth, blurred vision, confusion, constipation.",
  },
  PROCYCLIDINE: {
    description: "Relieves drug-induced movement disorders and Parkinsonian symptoms.",
    sideEffects: "Dry mouth, blurred vision, dizziness.",
  },

  // --- Eye ------------------------------------------------------------------
  "EYE LUBRICANT": {
    description: "Artificial tears that relieve dry, gritty or irritated eyes.",
    sideEffects: "Temporary blurred vision, mild stinging.",
  },
  LUBRICATING: {
    description: "Artificial tears that relieve dry, gritty or irritated eyes.",
    sideEffects: "Temporary blurred vision, mild stinging.",
  },
  "SODIUM HYALURONATE EYE DROP": {
    description: "Lubricating eye drop that retains moisture on the eye surface.",
    sideEffects: "Temporary blurring, mild irritation.",
  },
  "OLOPATADINE EYE DROP": {
    description: "Antihistamine eye drop for itchy, watery allergic eyes.",
    sideEffects: "Stinging on instillation, headache, dry eye.",
  },
  "TIMOLOL EYE DROP": {
    description: "Lowers pressure inside the eye in glaucoma.",
    sideEffects: "Stinging, slow heart rate, breathing difficulty in asthma.",
  },

  // --- Urology and men's health --------------------------------------------
  FINASTERIDE: {
    description: "Shrinks the prostate in benign enlargement and treats male pattern hair loss.",
    sideEffects: "Reduced libido, erectile difficulty, breast tenderness.",
  },
  DUTASTERIDE: {
    description: "Reduces prostate size in benign prostatic enlargement.",
    sideEffects: "Reduced libido, erectile difficulty, breast tenderness.",
  },
  "PROSTATE HEALTH SUPPLEMENT": {
    description: "Dietary supplement marketed to support prostate and urinary comfort.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },
  "HAIR LOSS TABLET": {
    description: "Supplement or medicine taken to slow hair loss and support hair growth.",
    sideEffects: "Varies by formulation; stomach upset is most common.",
  },
  "L-ARGININE": {
    description: "Amino acid supplement taken to support blood flow and exercise performance.",
    sideEffects: "Bloating, abdominal pain, low blood pressure at high doses.",
  },
  "ZINC FOR MEN": {
    description: "Zinc supplement supporting immunity, testosterone and sperm health.",
    sideEffects: "Nausea and stomach upset, particularly on an empty stomach.",
  },
  "MULTIVITAMIN FOR MEN": {
    description: "Daily multivitamin and mineral formulated for men.",
    sideEffects: "Mild stomach upset; harmless change in urine colour.",
  },
  "ENERGY SUPPLEMENT": {
    description: "Supplement taken to reduce tiredness and support daily energy levels.",
    sideEffects: "Restlessness or insomnia if it contains stimulants.",
  },

  // --- Women's health -------------------------------------------------------
  "CONTRACEPTIVE PILL": {
    description: "Combined hormonal pill taken daily to prevent pregnancy.",
    sideEffects: "Nausea, breast tenderness, spotting, mood changes; small clot risk.",
  },
  "EMERGENCY CONTRACEPTIVE": {
    description: "Taken after unprotected sex to reduce the chance of pregnancy.",
    sideEffects: "Nausea, irregular bleeding, delayed next period.",
  },
  LEVONORGESTREL: {
    description: "Progestogen used in contraception and emergency contraception.",
    sideEffects: "Irregular bleeding, nausea, headache.",
  },
  "LEVONORGESTREL WITH ETHINYL ESTRADIOL": {
    description: "Combined oral contraceptive taken to prevent pregnancy.",
    sideEffects: "Nausea, breast tenderness, spotting; small clot risk.",
  },
  "ETHINYL ESTRADIOL+LEVONORGESTREL": {
    description: "Combined oral contraceptive taken to prevent pregnancy.",
    sideEffects: "Nausea, breast tenderness, spotting; small clot risk.",
  },
  "ULIPRISTAL ACETATE": {
    description: "Emergency contraceptive effective up to five days after unprotected sex.",
    sideEffects: "Headache, nausea, abdominal pain, delayed period.",
  },
  PROGESTIN: {
    description: "Synthetic progesterone used in contraception and hormone therapy.",
    sideEffects: "Irregular bleeding, breast tenderness, mood changes.",
  },
  PROGESTERONE: {
    description: "Hormone used to support the uterine lining and in fertility treatment.",
    sideEffects: "Drowsiness, bloating, breast tenderness.",
  },
  "PREGNANCY TEST KIT": {
    description: "Home test that detects the pregnancy hormone hCG in urine.",
    sideEffects: "Diagnostic device; not taken internally.",
  },
  "VAGINAL WASH": {
    description: "Intimate wash formulated to maintain natural vaginal pH.",
    sideEffects: "Local irritation in sensitive skin.",
  },
  VWASH: {
    description: "Intimate wash formulated to maintain natural vaginal pH.",
    sideEffects: "Local irritation in sensitive skin.",
  },
  "IRON SUPPLEMENT FOR WOMEN": {
    description: "Iron supplement to treat or prevent iron deficiency anaemia.",
    sideEffects: "Constipation, dark stools, nausea, stomach upset.",
  },
  "FOLIC ACID FOR PREGNANCY": {
    description: "Folic acid taken before and during pregnancy to prevent neural tube defects.",
    sideEffects: "Very well tolerated; occasional nausea.",
  },
  "PRENATAL VITAMIN": {
    description: "Vitamin and mineral supplement formulated for pregnancy and breastfeeding.",
    sideEffects: "Nausea, constipation from the iron content.",
  },
  "CALCIUM FOR WOMEN": {
    description: "Calcium supplement supporting bone strength.",
    sideEffects: "Constipation, bloating.",
  },
  "MULTIVITAMIN FOR WOMEN": {
    description: "Daily multivitamin and mineral formulated for women.",
    sideEffects: "Mild stomach upset; harmless change in urine colour.",
  },

  // --- Vitamins, minerals and supplements ----------------------------------
  MULTIVITAMIN: {
    description: "Daily supplement covering common vitamin and mineral requirements.",
    sideEffects: "Mild stomach upset; harmless change in urine colour.",
  },
  "MULTIVITAMIN + MINERALS": {
    description: "Combined vitamin and mineral supplement for general nutritional support.",
    sideEffects: "Mild stomach upset; harmless change in urine colour.",
  },
  "MULTIVITAMIN FOR KIDS": {
    description: "Children's multivitamin supporting growth and development.",
    sideEffects: "Mild stomach upset. Keep out of reach — iron overdose is dangerous.",
  },
  "VITAMIN C": {
    description: "Supports immune function and prevents vitamin C deficiency.",
    sideEffects: "Stomach upset and diarrhoea at high doses.",
  },
  "VITAMIN D3": {
    description: "Supports calcium absorption, bone strength and immune health.",
    sideEffects: "Rare at normal doses; excess causes high calcium, nausea and weakness.",
  },
  "VITAMIN E": {
    description: "Antioxidant vitamin supporting skin and cell health.",
    sideEffects: "Nausea at high doses; may increase bleeding risk.",
  },
  "VITAMIN B COMPLEX": {
    description: "Combined B vitamins supporting nerve function and energy metabolism.",
    sideEffects: "Nausea, harmless bright yellow urine.",
  },
  "VITAMIN B1,B6,B12": {
    description: "B vitamin combination used to support nerve health.",
    sideEffects: "Nausea, harmless bright yellow urine.",
  },
  RIBOFLAVIN: {
    description: "Vitamin B2, used for deficiency and sometimes migraine prevention.",
    sideEffects: "Harmless bright yellow urine.",
  },
  "FOLIC ACID": {
    description: "Vitamin B9, needed for red blood cell formation and in pregnancy.",
    sideEffects: "Very well tolerated; occasional nausea.",
  },
  "IRON+FOLIC ACID": {
    description: "Treats and prevents iron and folate deficiency anaemia.",
    sideEffects: "Constipation, dark stools, nausea.",
  },
  "FERROUS SULFATE": {
    description: "Iron salt used to treat iron deficiency anaemia.",
    sideEffects: "Constipation, dark stools, stomach upset.",
  },
  CALCIUM: {
    description: "Calcium supplement supporting bones and teeth.",
    sideEffects: "Constipation, bloating.",
  },
  "CALCIUM + VITAMIN D3": {
    description: "Calcium with vitamin D for bone health and absorption.",
    sideEffects: "Constipation, bloating.",
  },
  "CALCIUM+VITAMIN D3": {
    description: "Calcium with vitamin D for bone health and absorption.",
    sideEffects: "Constipation, bloating.",
  },
  MAGNESIUM: {
    description: "Mineral supporting muscle and nerve function and sleep quality.",
    sideEffects: "Loose stools, abdominal cramps at higher doses.",
  },
  "MAGNESIUM SULFATE": {
    description: "Used medically for eclampsia, severe asthma and magnesium deficiency.",
    sideEffects: "Flushing, drowsiness, low blood pressure.",
  },
  ZINC: {
    description: "Mineral supporting immunity, wound healing and recovery from diarrhoea.",
    sideEffects: "Nausea and stomach upset, particularly on an empty stomach.",
  },
  BIOTIN: {
    description: "Vitamin B7, taken to support hair, skin and nail health.",
    sideEffects: "Very well tolerated; may interfere with some lab tests.",
  },
  COLLAGEN: {
    description: "Protein supplement taken for skin elasticity and joint comfort.",
    sideEffects: "Bloating, feeling of fullness.",
  },
  "OMEGA 3 FISH OIL": {
    description: "Essential fatty acids supporting heart, brain and joint health.",
    sideEffects: "Fishy aftertaste, belching, loose stools.",
  },
  "COD LIVER OIL": {
    description: "Source of omega-3 fats with vitamins A and D.",
    sideEffects: "Fishy aftertaste, belching, loose stools.",
  },
  "COENZYME Q10": {
    description: "Antioxidant taken to support cellular energy and heart health.",
    sideEffects: "Mild stomach upset, insomnia if taken late.",
  },
  "L-CARNITINE": {
    description: "Amino acid derivative taken to support fat metabolism and energy.",
    sideEffects: "Nausea, stomach upset, body odour at high doses.",
  },
  "PROTEIN POWDER": {
    description: "Concentrated dietary protein used to support muscle and recovery.",
    sideEffects: "Bloating, gas; caution in kidney disease.",
  },
  GLUCOSAMINE: {
    description: "Supplement taken to support joint cartilage and ease osteoarthritis.",
    sideEffects: "Nausea, heartburn, loose stools.",
  },
  "GLUCOSAMINE SULFATE": {
    description: "Supplement taken to support joint cartilage and ease osteoarthritis.",
    sideEffects: "Nausea, heartburn, loose stools.",
  },

  // --- Traditional, herbal and Unani ---------------------------------------
  ASHWAGANDHA: {
    description: "Ayurvedic adaptogen traditionally used for stress and stamina.",
    sideEffects: "Drowsiness, stomach upset; avoid in pregnancy.",
  },
  SHATAVARI: {
    description: "Ayurvedic herb traditionally used to support women's reproductive health.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },
  "BRAHMI CAPSULE": {
    description: "Ayurvedic herb traditionally taken to support memory and concentration.",
    sideEffects: "Stomach upset, dry mouth, fatigue.",
  },
  "NEEM CAPSULE": {
    description: "Traditional herb used for skin health and its antimicrobial properties.",
    sideEffects: "Stomach upset; avoid in pregnancy.",
  },
  "GILOY TABLET": {
    description: "Ayurvedic herb traditionally taken to support immunity.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },
  "TULSI EXTRACT": {
    description: "Holy basil extract traditionally used for cough, cold and stress.",
    sideEffects: "Generally well tolerated; may thin the blood slightly.",
  },
  "TRIPHALA POWDER": {
    description: "Ayurvedic three-fruit blend traditionally used for digestion and regularity.",
    sideEffects: "Loose stools, abdominal cramps.",
  },
  "GINGER EXTRACT": {
    description: "Traditionally used for nausea, indigestion and inflammation.",
    sideEffects: "Heartburn, mild stomach upset.",
  },
  "AMLA JUICE": {
    description: "Indian gooseberry, a traditional source of vitamin C and antioxidants.",
    sideEffects: "Acidity, loose stools in some people.",
  },
  "AYURVEDIC DIGESTIVE SYRUP": {
    description: "Traditional herbal syrup taken to aid digestion and appetite.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },
  "SAFI HERBAL SYRUP": {
    description: "Traditional herbal blood-purifier syrup used for skin complaints and constipation.",
    sideEffects: "Loose stools, mild abdominal cramps.",
  },
  "UNANI MEDICINE": {
    description: "Traditional Unani preparation used as a general tonic.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },
  "UNANI TONIC": {
    description: "Traditional Unani tonic taken for general wellbeing and vitality.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },

  // --- Generic / unspecified dataset labels --------------------------------
  CAPSULE: {
    description: "Capsule preparation; see the pack or ask your pharmacist for details.",
    sideEffects: "Not specified — ask your doctor or pharmacist.",
  },
  SYRUP: {
    description: "Syrup preparation; see the pack or ask your pharmacist for details.",
    sideEffects: "Not specified — ask your doctor or pharmacist.",
  },
};

// Used when the ingredient is not in the table above, so every medicine still
// carries a truthful, category-level explanation.
export const CATEGORY_FALLBACK: Record<string, IngredientInfo> = {
  "Diabetic Accessories": {
    description: "Product used in day-to-day diabetes care and monitoring.",
    sideEffects: "Not specified — ask your doctor or pharmacist.",
  },
  "Herbal Supplements": {
    description: "Traditional herbal supplement taken for general wellbeing.",
    sideEffects: "Generally well tolerated; occasional stomach upset.",
  },
  "Men's Care": {
    description: "Supplement or product formulated for men's health.",
    sideEffects: "Not specified — ask your doctor or pharmacist.",
  },
  "OTC Medicine": {
    description: "Over-the-counter medicine for short-term relief of common symptoms.",
    sideEffects: "Not specified — read the pack insert or ask your pharmacist.",
  },
  "Prescription Medicine": {
    description: "Prescription-only medicine — take it exactly as your doctor directs.",
    sideEffects: "Not specified — ask your doctor or pharmacist.",
  },
  "Supplements & Vitamins": {
    description: "Nutritional supplement used to support daily vitamin and mineral intake.",
    sideEffects: "Mild stomach upset is the most common complaint.",
  },
  "Women's Care": {
    description: "Product formulated for women's health and intimate care.",
    sideEffects: "Not specified — ask your doctor or pharmacist.",
  },

  // --- therapeutic classes used by the drugdirectorybd.com import -----------
  // The scrape carries no clinical text at all, and its ~500 distinct
  // ingredients are far more than INGREDIENT_INFO covers. These entries give
  // every imported row honest drug-class text instead of a blank panel. They
  // describe the class, never the brand, and deliberately give no dosing.
  "Analgesic & Anaesthetic": {
    description: "Relieves moderate to severe pain, or numbs an area for a procedure.",
    sideEffects: "Drowsiness, dizziness, nausea and constipation. Opioid painkillers can be habit-forming.",
  },
  "Analgesic & Anti-inflammatory": {
    description: "Anti-inflammatory painkiller used for pain, swelling and stiffness.",
    sideEffects: "Stomach upset and heartburn; ulcers or bleeding on prolonged use; may raise blood pressure and strain the kidneys.",
  },
  "Analgesic & Antipyretic": {
    description: "Relieves mild to moderate pain and reduces fever.",
    sideEffects: "Generally well tolerated; rash is rare. Overdose can cause serious liver damage.",
  },
  "Anti-Parkinson": {
    description: "Controls the tremor, stiffness and slowed movement of Parkinson's disease.",
    sideEffects: "Nausea, dizziness on standing, drowsiness, involuntary movements and confusion.",
  },
  Antibiotic: {
    description: "Treats infections caused by bacteria. Finish the whole course even once you feel better.",
    sideEffects: "Nausea, diarrhoea, thrush and allergic rash. Seek help at once for swelling or difficulty breathing.",
  },
  "Anticoagulant & Antiplatelet": {
    description: "Thins the blood to prevent clots, strokes and heart attacks.",
    sideEffects: "Bruising and bleeding more easily, nosebleeds, blood in urine or stool. Report unusual bleeding promptly.",
  },
  Anticonvulsant: {
    description: "Prevents seizures; also used for nerve pain and mood stabilisation.",
    sideEffects: "Drowsiness, dizziness, unsteadiness, blurred vision and mood changes. Do not stop suddenly.",
  },
  Antidepressant: {
    description: "Treats depression and anxiety disorders; can take several weeks to take full effect.",
    sideEffects: "Nausea, sleep changes, dry mouth, weight change and reduced libido. Do not stop suddenly.",
  },
  Antidiabetic: {
    description: "Lowers blood sugar as part of diabetes management.",
    sideEffects: "Low blood sugar, nausea and stomach upset. Learn to recognise and treat hypoglycaemia.",
  },
  Antifungal: {
    description: "Treats fungal infections of the skin, nails or mucous membranes.",
    sideEffects: "Burning or irritation where applied; nausea and liver effects with tablets and capsules.",
  },
  Antihistamine: {
    description: "Relieves allergic symptoms such as sneezing, itching, rash and a runny nose.",
    sideEffects: "Drowsiness — much less with the newer non-sedating types — plus dry mouth and headache.",
  },
  Antihypertensive: {
    description: "Lowers blood pressure and reduces the workload on the heart.",
    sideEffects: "Dizziness on standing, headache, ankle swelling, tiredness, and a dry cough with some types.",
  },
  Antimigraine: {
    description: "Treats a migraine attack or reduces how often attacks happen.",
    sideEffects: "Drowsiness, dizziness, tingling, chest or throat tightness; weight gain with preventive types.",
  },
  Antiparasitic: {
    description: "Treats worm, protozoal and other parasitic infections.",
    sideEffects: "Nausea, abdominal pain, headache and dizziness.",
  },
  Antipsychotic: {
    description: "Treats psychosis, schizophrenia and bipolar disorder.",
    sideEffects: "Drowsiness, weight gain, restlessness, tremor, and raised blood sugar and cholesterol.",
  },
  "Antiseptic & Oral Care": {
    description: "Cleans and disinfects skin, wounds or the mouth.",
    sideEffects: "Local stinging, dryness or temporary staining. For external use only unless the pack says otherwise.",
  },
  Antiviral: {
    description: "Treats viral infection by stopping the virus multiplying.",
    sideEffects: "Nausea, headache, tiredness and diarrhoea. Some types need kidney or liver monitoring.",
  },
  Corticosteroid: {
    description: "Reduces inflammation and damps down an overactive immune response.",
    sideEffects: "Raised blood sugar, fluid retention, mood change and stomach irritation. Longer courses must be tapered, never stopped abruptly.",
  },
  Dermatological: {
    description: "Applied to the skin or scalp to treat a skin condition.",
    sideEffects: "Burning, dryness or itching where applied; skin thinning with prolonged use of steroid creams.",
  },
  Diuretic: {
    description: "Clears excess fluid, easing swelling and lowering blood pressure.",
    sideEffects: "Passing urine more often, dizziness, dehydration, and shifts in potassium and sodium.",
  },
  Gastrointestinal: {
    description: "Acts on the stomach, gut, liver or bowel to relieve digestive symptoms.",
    sideEffects: "Constipation or diarrhoea, bloating, nausea and abdominal cramps.",
  },
  "Haematology & Renal": {
    description: "Supports blood formation, bone strength or kidney function.",
    sideEffects: "Nausea and constipation, dark stools with iron, injection-site reactions. Usually needs blood monitoring.",
  },
  Hormonal: {
    description: "Replaces or regulates a hormone the body makes too little or too much of.",
    sideEffects: "Weight and mood change, headache, plus effects specific to the hormone. Needs regular blood tests.",
  },
  "Lipid Lowering": {
    description: "Lowers cholesterol and triglycerides to reduce heart and stroke risk.",
    sideEffects: "Muscle aches, stomach upset and headache. Report severe or unexplained muscle pain.",
  },
  "Mineral & Electrolyte": {
    description: "Replaces minerals, salts or fluid the body is short of.",
    sideEffects: "Stomach upset, nausea or loose stools. Too much can upset the body's salt balance.",
  },
  "Muscle Relaxant": {
    description: "Relieves muscle spasm and stiffness.",
    sideEffects: "Drowsiness, dizziness, weakness and dry mouth. Avoid driving until you know how it affects you.",
  },
  Neurological: {
    description: "Acts on the brain, the nerves, or blood flow to the brain.",
    sideEffects: "Dizziness, headache, nausea and drowsiness.",
  },
  Oncology: {
    description: "Cancer treatment, taken only under specialist supervision.",
    sideEffects: "Serious effects are expected: low blood counts, infection risk, nausea, tiredness and hair loss. Requires close monitoring.",
  },
  Ophthalmic: {
    description: "Used in the eye to treat or relieve an eye condition.",
    sideEffects: "Brief stinging, blurred vision or redness just after use.",
  },
  "Proton Pump Inhibitor": {
    description: "Cuts stomach acid to heal ulcers, reflux and heartburn.",
    sideEffects: "Headache, diarrhoea and abdominal pain. Long-term use can affect magnesium, vitamin B12 and bone density.",
  },
  Respiratory: {
    description: "Opens the airways or eases cough and difficult breathing.",
    sideEffects: "Tremor, fast heartbeat and headache; hoarseness or thrush with inhaled steroids — rinse your mouth after each dose.",
  },
  Rheumatology: {
    description: "Treats arthritis, joint disease and inflammatory joint conditions.",
    sideEffects: "Stomach upset, raised infection risk with immune-suppressing types, and abnormal blood tests. Needs monitoring.",
  },
  "Sedative & Anxiolytic": {
    description: "Calms anxiety or helps with sleep, intended for short-term use.",
    sideEffects: "Drowsiness, poor concentration and unsteadiness. Habit-forming — avoid long-term use and do not stop abruptly.",
  },
  Urological: {
    description: "Treats bladder and urinary symptoms.",
    sideEffects: "Dry mouth, constipation, blurred vision, dizziness and difficulty passing urine.",
  },
  "Vitamin Supplement": {
    description: "Supplement used to correct or prevent a vitamin deficiency.",
    sideEffects: "Usually well tolerated; mild stomach upset. Very high doses of fat-soluble vitamins can be harmful.",
  },
};

// Some ingredient names imply a delivery route ("EYE LUBRICANT", "GLYCERIN
// SUPPOSITORY", "GLUCOSE CONTROL SOLUTION"). The source catalog pairs synthetic
// brand names with generics at random, so a row can end up as e.g. a capsule of
// "DIABETIC FOOT CREAM". Describing the ingredient there would contradict the
// form, so those rows fall back to neutral category text instead.
const ROUTE_RULES: [RegExp, string[]][] = [
  [/^ORS$|ORAL REHYDRATION/i, ["Syrup", "Powder", "Suspension", "Oral Solution", "Tablet", "Other"]],
  [/EYE DROP|EYE LUBRICANT|^LUBRICATING$/i, ["Drop", "Eye Drop", "Gel", "Other"]],
  [/SUPPOSITORY/i, ["Suppository", "Other"]],
  [/NASAL SPRAY/i, ["Nasal Spray", "Nasal Drop", "Drop", "Other"]],
  [/CREAM$|GEL$/i, ["Cream", "Ointment", "Gel", "Other"]],
  [/COUGH SYRUP/i, ["Syrup", "Suspension", "Drop", "Oral Solution", "Other"]],
  [/PREGNANCY TEST KIT/i, ["Other"]],
  [/VAGINAL WASH|^VWASH$/i, ["Other", "Cream", "Gel"]],
  [/GLUCOSE CONTROL SOLUTION/i, ["Other"]],
  [/CONTRACEPTIVE PILL|^PROGESTIN$/i, ["Tablet", "Capsule", "Other"]],
  [/PROTEIN POWDER/i, ["Powder", "Suspension", "Other"]],
  [/INSULIN/i, ["Injection", "Vial", "Other"]],
  [/^ANTACID$/i, ["Tablet", "Suspension", "Syrup", "Oral Solution", "Powder", "Other"]],
];

/** False when the ingredient's implied route conflicts with the dosage form. */
export function isRouteCompatible(genericName: string, form: string): boolean {
  for (const [pattern, allowed] of ROUTE_RULES) {
    if (pattern.test(genericName)) return allowed.includes(form);
  }
  return true;
}

// Salt and ester suffixes that name the same active ingredient. Stripped only
// as a last resort, because removing them from a name that genuinely needs them
// ("CALCIUM CARBONATE") loses the match rather than finding a better one.
const SALT_SUFFIXES =
  /\b(SODIUM|POTASSIUM|CALCIUM|MAGNESIUM|HYDROCHLORIDE|DIHYDROCHLORIDE|HYDROBROMIDE|MALEATE|TARTRATE|CITRATE|SUCCINATE|MESYLATE|MESILATE|BESILATE|BESYLATE|SULPHATE|SULFATE|ACETATE|FUMARATE|OXALATE|PHOSPHATE|BISULPHATE|TROMETHAMINE|TRIHYDRATE|MONOHYDRATE|DIHYDRATE|PENTAHYDRATE|HEMIHYDRATE|AXETIL|PROXETIL|DIPROPIONATE|PROPIONATE|FUROATE)\b/g;

/**
 * Progressively looser spellings of an ingredient name, best first.
 *
 * The scraped dataset names ingredients more fully than the bundled catalog
 * does — "Ceftriaxone Sodium", "Cholecalciferol [Vitamin D3]", "Cetirizine
 * Hydrochloride/Dihydrochloride" — so an exact miss is retried without the
 * bracketed gloss, the alternate salt after the slash, and finally the salt.
 */
function nameVariants(genericName: string): string[] {
  const base = genericName.trim().toUpperCase();
  const tidy = (s: string) => s.replace(/\s*\+\s*/g, "+").replace(/\s+/g, " ").trim();

  return [
    base,
    tidy(base.replace(/\[[^\]]*\]/g, " ")),
    tidy(base.replace(/\[[^\]]*\]/g, " ").replace(/\/[^\s+]*/g, "")),
    tidy(base.replace(/\[[^\]]*\]/g, " ").replace(/\/[^\s+]*/g, "").replace(SALT_SUFFIXES, " ")),
  ];
}

/**
 * Looks up ingredient text. Falls back to neutral category text when the
 * ingredient is unknown, or when its implied route contradicts `form`.
 */
export function lookupInfo(
  genericName: string,
  category: string,
  form?: string
): IngredientInfo | null {
  let direct: IngredientInfo | undefined;
  for (const variant of nameVariants(genericName)) {
    direct = INGREDIENT_INFO[variant];
    if (direct) break;
  }
  const conflicts = form ? !isRouteCompatible(genericName, form) : false;

  if (direct && !conflicts) return direct;
  return CATEGORY_FALLBACK[category] ?? (conflicts ? null : direct) ?? null;
}
