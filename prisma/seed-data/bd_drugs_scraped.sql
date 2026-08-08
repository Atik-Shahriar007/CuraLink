-- =============================================================================
-- Bangladesh Drug Directory - Scraped Dataset
-- Source: drugdirectorybd.com (auto-scraped, 2026-08-09)
-- Rows: 976
-- Fields left NULL where the source page did not contain that information.
-- No description/dosage/side_effects text was invented.
-- =============================================================================

DROP TABLE IF EXISTS drugs;

CREATE TABLE drugs (
    id                  SERIAL PRIMARY KEY,
    brand_name          VARCHAR(255) NOT NULL,
    generic_name        VARCHAR(255),
    strength            VARCHAR(100),
    dosage_form         VARCHAR(100),
    category            VARCHAR(150),
    manufacturer        VARCHAR(255),
    price_info          VARCHAR(500),
    over_the_counter    BOOLEAN,
    description         TEXT,
    dosage              TEXT,
    side_effects        TEXT,
    contraindications   TEXT,
    source_url          VARCHAR(500) NOT NULL,
    has_clinical_text   BOOLEAN NOT NULL DEFAULT false,
    last_verified       DATE
);

INSERT INTO drugs (
    brand_name, generic_name, strength, dosage_form, category, manufacturer,
    price_info, over_the_counter, description, dosage, side_effects,
    contraindications, source_url, has_clinical_text, last_verified
) VALUES
(
    'Ace IV Infusion', 'Paracetamol', '10 mg', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-10-mgml-1159', false, '2026-08-09'
),
(
    'Ace Syrup', 'Paracetamol', '120 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-120-mg5-ml-1-1155', false, '2026-08-09'
),
(
    'Ace Oral Suspension', 'Paracetamol', '120 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-120-mg5-ml-1153', false, '2026-08-09'
),
(
    'Ace 125 mg Suppository', 'Paracetamol', '125 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-125-mg-1156', false, '2026-08-09'
),
(
    'Ace 250 mg Suppository', 'Paracetamol', '250 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-250-mg-1157', false, '2026-08-09'
),
(
    'Ace 500 mg Suppository', 'Paracetamol', '500 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-500-mg-1-1158', false, '2026-08-09'
),
(
    'Ace 500 mg Tablet', 'Paracetamol', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 12.00 | ৳ 1.20 | ৳ 300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-500-mg-1149', false, '2026-08-09'
),
(
    'Ace Paediatric Drops', 'Paracetamol', '80 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-80-mgml-1-1154', false, '2026-08-09'
),
(
    'Ace Plus Tablet', 'Paracetamol + Caffeine', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 502.00 | ৳ 25.10 | ৳ 2.51',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-plus-500-mg-65-mg-1150', false, '2026-08-09'
),
(
    'Ace Power 1000 mg Tablet', 'Paracetamol', '1000 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 22.50 | ৳ 2.25',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-power-1000-mg-1151', false, '2026-08-09'
),
(
    'Ace XR 665 mg Extended Release Tablet', 'Paracetamol', '665 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00 | ৳ 2.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ace-xr-665-mg-1152', false, '2026-08-09'
),
(
    'Aclitol Dry Powder Inhalation Capsule (DPI)', 'Aclidinium Bromide + Formoterol Fumarate', '400 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/aclitol-400-mcg-12-mcg-1160', false, '2026-08-09'
),
(
    'Adiva 600 mg Tablet', 'Efavirenz', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,007.00 | ৳ 200.70',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/adiva-600-mg-1-1161', false, '2026-08-09'
),
(
    'Adovas Syrup', 'multi-herbal cough syrup based on (Adhatoda vasica )', '0.68 gm/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00 | ৳ 110.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/adovas-068-gm5-ml-1162', false, '2026-08-09'
),
(
    'Adryl Syrup', 'Diphenhydramine Hydrochloride', '10 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/adryl-10-mg5-ml-1163', false, '2026-08-09'
),
(
    'Adsalt 300 mg Tablet', 'Sodium Chloride', '300 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 30.00 | ৳ 3.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/adsalt-300-mg-1164', false, '2026-08-09'
),
(
    'Afun Cream', 'Clotrimazole', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.11',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/afun-1-1165', false, '2026-08-09'
),
(
    'Afun VT 200 mg Vaginal Tablet', 'Clotrimazole', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.18 | ৳ 20.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/afun-vt-200-mg-1-1166', false, '2026-08-09'
),
(
    'Akicin IV/IM Injection', 'Amikacin', '100 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.50 | ৳ 16.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/akicin-100-mg2-ml-1168', false, '2026-08-09'
),
(
    'Akicin IV/IM Injection', 'Amikacin', '500 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 481.40 | ৳ 48.14',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/akicin-500-mg2-ml-1167', false, '2026-08-09'
),
(
    'Alacot Eye Drop (Ophthalmic Solution)', 'Olopatadine Hydrochloride', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 110.34',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alacot-01-1169', false, '2026-08-09'
),
(
    'Alacot DS Eye Drop (Ophthalmic Solution)', 'Olopatadine Hydrochloride', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 175.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alacot-ds-02-1170', false, '2026-08-09'
),
(
    'Alacot Max Eye Drop (Ophthalmic Solution)', 'Olopatadine Hydrochloride', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 245.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alacot-max-07-1171', false, '2026-08-09'
),
(
    'Alarid Eye Drop (Ophthalmic Solution)', 'Ketotifen Fumarate', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.30',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alarid-0025-1174', false, '2026-08-09'
),
(
    'Alarid 1 mg Tablet', 'Ketotifen Fumarate', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 30.00 | ৳ 3.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alarid-1-mg-1172', false, '2026-08-09'
),
(
    'Alarid Syrup', 'Ketotifen Fumarate', '1 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alarid-1-mg5-ml-1173', false, '2026-08-09'
),
(
    'Alatro 10 mg Tablet', 'Cetirizine Hydrochloride/Dihydrochloride', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 451.50 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alatro-10-mg-1-1175', false, '2026-08-09'
),
(
    'Alatrol Paediatric Drops', 'Cetirizine Hydrochloride/Dihydrochloride', '2.5 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 28.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alatrol-25-mgml-1177', false, '2026-08-09'
),
(
    'Alatrol Syrup', 'Cetirizine Hydrochloride/Dihydrochloride', '5 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alatrol-5-mg5-ml-1176', false, '2026-08-09'
),
(
    'Alenvir 25 mg Tablet', 'Tenofovir Alafenamide', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 900.00 | ৳ 90.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alenvir-25-mg-1178', false, '2026-08-09'
),
(
    'Alfane 300 mg Capsule', 'Alpha Lipoic Acid', '300 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alfane-300-mg-1179', false, '2026-08-09'
),
(
    'Alice Lotion', 'Ivermectin', NULL, 'Lotion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alice-05-1-1182', false, '2026-08-09'
),
(
    'Alice 12 mg Tablet', 'Ivermectin', '12 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alice-12-mg-1181', false, '2026-08-09'
),
(
    'Alice 6 mg Tablet', 'Ivermectin', '6 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/alice-6-mg-1180', false, '2026-08-09'
),
(
    'Almex Oral Suspension', 'Albendazole', '200 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 23.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/almex-200-mg5-ml-1183', false, '2026-08-09'
),
(
    'Almex 400 mg Chewable Tablet', 'Albendazole', '400 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.96 | ৳ 20.08 | ৳ 5.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/almex-400-mg-1184', false, '2026-08-09'
),
(
    'Ambrisan 5 mg Tablet', 'Ambrisentan', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 802.60 | ৳ 401.30 | ৳ 40.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ambrisan-5-mg-1185', false, '2026-08-09'
),
(
    'Ambrox Syrup', 'Ambroxol Hydrochloride', '15 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ambrox-15-mg5-ml-1187', false, '2026-08-09'
),
(
    'Ambrox Paediatric Drops', 'Ambroxol Hydrochloride', '6 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ambrox-6-mgml-1-1186', false, '2026-08-09'
),
(
    'Ambrox SR 75 mg Sustained Release Capsule', 'Ambroxol Hydrochloride', '75 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 165.00 | ৳ 55.00 | ৳ 5.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ambrox-sr-75-mg-1188', false, '2026-08-09'
),
(
    'AmCivit Syrup', 'Emblica officinalis + Piper longum', '3.03 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/amcivit-303-ml012-gm5-ml-1189', false, '2026-08-09'
),
(
    'Amodis Oral Suspension', 'Metronidazole', '200 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/amodis-200-mg5-ml-1190', false, '2026-08-09'
),
(
    'Amodis 400 mg Tablet', 'Metronidazole', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 408.00 | ৳ 17.00 | ৳ 1.70',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/amodis-400-mg-1191', false, '2026-08-09'
),
(
    'Anadol 100 mg Suppository', 'Tramadol Hydrochloride', '100 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anadol-100-mg-1193', false, '2026-08-09'
),
(
    'Anadol IV/IM Injection', 'Tramadol Hydrochloride', '100 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.40 | ৳ 20.14',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anadol-100-mg2-ml-1194', false, '2026-08-09'
),
(
    'Anadol 50 mg Capsule', 'Tramadol Hydrochloride', '50 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 322.80 | ৳ 80.70 | ৳ 8.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anadol-50-mg-1192', false, '2026-08-09'
),
(
    'Anadol Plus Controlled Delivery Tablet', 'Paracetamol + Tramadol Hydrochloride', '325 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.90 | ৳ 80.30 | ৳ 8.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anadol-plus-325-mg375-mg-1195', false, '2026-08-09'
),
(
    'Anadol SR 100 mg Sustained Release Capsule', 'Tramadol Hydrochloride', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 510.00 | ৳ 170.00 | ৳ 17.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anadol-sr-100-mg-1196', false, '2026-08-09'
),
(
    'Anclog 75 mg Tablet', 'Clopidogrel Bisulphate', '75 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 481.20 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anclog-75-mg-1197', false, '2026-08-09'
),
(
    'Anclog Plus Tablet', 'Clopidogrel + Aspirin', '75 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 481.20 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anclog-plus-75-mg-75-mg-1198', false, '2026-08-09'
),
(
    'Anema Rectal Saline', 'Monobasic Sodium Phosphate + Dibasic Sodium Phosphate', '19 gm', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anema-19-gm-7-gm118-ml-1-1199', false, '2026-08-09'
),
(
    'Anespine Intraspinal Injection', 'Bupivacaine Hydrochloride + Dextrose', NULL, 'Intraspinal Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.00 | ৳ 30.20',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anespine-058-1-1200', false, '2026-08-09'
),
(
    'Angilock 100 mg Tablet', 'Losartan Potassium', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.90 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/angilock-100-mg-1201', false, '2026-08-09'
),
(
    'Angilock 25 mg Tablet', 'Losartan Potassium', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/angilock-25-mg-1203', false, '2026-08-09'
),
(
    'Angilock 50 mg Tablet', 'Losartan Potassium', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/angilock-50-mg-1202', false, '2026-08-09'
),
(
    'Angilock Plus Tablet', 'Losartan Potassium + Hydrochlorothiazide', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/angilock-plus-100-mg-125-mg-1206', false, '2026-08-09'
),
(
    'Angilock Plus Tablet', 'Losartan Potassium + Hydrochlorothiazide', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.90 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/angilock-plus-100-mg-25-mg-1204', false, '2026-08-09'
),
(
    'Angilock Plus Tablet', 'Losartan Potassium + Hydrochlorothiazide', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/angilock-plus-50-mg-125-mg-1205', false, '2026-08-09'
),
(
    'Angivent MR 35 mg Modified Release Tablet', 'Trimetazidine Dihydrochloride', '35 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/angivent-mr-35-mg-1207', false, '2026-08-09'
),
(
    'Anleptic Oral Suspension', 'Carbamazepine', '100 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.90',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anleptic-100-mg5-ml-1208', false, '2026-08-09'
),
(
    'Anleptic CR 200 mg Controlled Release Tablet', 'Carbamazepine', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 301.00 | ৳ 60.20 | ৳ 6.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anleptic-cr-200-mg-1209', false, '2026-08-09'
),
(
    'Anoxa 10 mg Tablet', 'Oxazepam', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 105.60 | ৳ 35.20 | ৳ 3.52',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anoxa-10-mg-1210', false, '2026-08-09'
),
(
    'Anril Topical Spray', 'Nitroglycerin', '400 mcg', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anril-400-mcgspray-1-1212', false, '2026-08-09'
),
(
    'Anril IV Infusion', 'Nitroglycerin', '50 mg/10 ml', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.00 | ৳ 75.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anril-50-mg10-ml-1211', false, '2026-08-09'
),
(
    'Anril SR 2.6 mg Sustained Release Tablet', 'Nitroglycerin', '2.6 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anril-sr-26-mg-1213', false, '2026-08-09'
),
(
    'Ansulin SC Injection', 'Regular Insulin Human + Isophane Insulin Human', '100 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 415.00 | ৳ 222.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ansulin-30-70-in-100-iuml-1215', false, '2026-08-09'
),
(
    'Ansulin SC Injection', 'Regular Insulin Human + Isophane Insulin Human', '40 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 195.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ansulin-30-70-in-40-iuml-1-1214', false, '2026-08-09'
),
(
    'Ansulin SC Injection', 'Regular Insulin Human + Isophane Insulin Human', '100 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 415.00 | ৳ 222.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ansulin-50-50-in-100-iuml-1216', false, '2026-08-09'
),
(
    'Ansulin N SC Injection', 'Insulin Human [rDNA]', '100 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 415.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ansulin-n-100-iuml-1217', false, '2026-08-09'
),
(
    'Ansulin R SC Injection', 'Insulin Human [rDNA]', '100 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 415.00 | ৳ 220.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ansulin-r-100-iuml-1218', false, '2026-08-09'
),
(
    'Ansulin R SC Injection', 'Insulin Human [rDNA]', '40 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 195.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ansulin-r-40-iuml-1219', false, '2026-08-09'
),
(
    'Antazol Nasal Drops', 'Xylometazoline Hydrochloride', NULL, 'Nasal Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 216.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/antazol-005-1221', false, '2026-08-09'
),
(
    'Antazol Nasal Drops', 'Xylometazoline Hydrochloride', NULL, 'Nasal Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/antazol-01-1220', false, '2026-08-09'
),
(
    'Antazol Plus Nasal Spray', 'Sodium Cromoglicate + Xylometazoline Hydrochloride', '2.6 mg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/antazol-plus-26-mg00325-mgspray-1222', false, '2026-08-09'
),
(
    'Antiscar Topical Gel', 'Allium cepa + Heparin + Allantoin', '100 mg', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/antiscar-100-mg-50-iu-10-mg-1-1223', false, '2026-08-09'
),
(
    'Antista Syrup', 'Chlorpheniramine Maleate', '2 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/antista-2-mg5-ml-1224', false, '2026-08-09'
),
(
    'Anzitor Tablet', 'Atorvastatin Calcium', '10 ml', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anzitor-10-ml-1225', false, '2026-08-09'
),
(
    'Anzitor 20 mg Tablet', 'Atorvastatin Calcium', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anzitor-20-mg-1226', false, '2026-08-09'
),
(
    'Anzitor 40 mg Tablet', 'Atorvastatin Calcium', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00 | ৳ 28.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anzitor-40-mg-1227', false, '2026-08-09'
),
(
    'Anzitor EZ Tablet', 'Atorvastatin + Ezetimibe', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 420.00 | ৳ 140.00 | ৳ 14.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anzitor-ez-10-mg-10-mg-1228', false, '2026-08-09'
),
(
    'Anzitor EZ Tablet', 'Atorvastatin + Ezetimibe', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 660.00 | ৳ 220.00 | ৳ 22.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/anzitor-ez-20-mg-10-mg-1229', false, '2026-08-09'
),
(
    'Apsol Oral Paste', 'Amlexanox', NULL, 'Oral Paste', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/apsol-5-1230', false, '2026-08-09'
),
(
    'Ariprex 10 mg Tablet', 'Aripiprazole', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 25.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ariprex-10-mg-1233', false, '2026-08-09'
),
(
    'Ariprex 2 mg Tablet', 'Aripiprazole', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.00 | ৳ 12.00 | ৳ 2.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ariprex-2-mg-1232', false, '2026-08-09'
),
(
    'Ariprex Oral Solution', 'Aripiprazole', '5 mg/5 ml', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ariprex-5-mg5-ml-1231', false, '2026-08-09'
),
(
    'Arubin 500 mg Capsule', 'Nabayas Louha Herbal Haematinic', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/arubin-500-mg-1234', false, '2026-08-09'
),
(
    'Asynta Chewable Tablet', 'Sodium Alginate + Potassium Bicarbonate', '500 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/asynta-500-mg-100-mg-1235', false, '2026-08-09'
),
(
    'Asynta Oral Suspension', 'Sodium Alginate + Potassium Bicarbonate', '500 mg', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/asynta-500-mg-100-mg5-ml-1236', false, '2026-08-09'
),
(
    'Asynta Max Chewable Tablet', 'Sodium Alginate + Sodium Bicarbonate + Calcium Carbonate', '250 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/asynta-max-250-mg-1065-mg-1875-mg-1238', false, '2026-08-09'
),
(
    'Asynta Max Oral Suspension', 'Sodium Alginate + Sodium Bicarbonate + Calcium Carbonate', '500 mg', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/asynta-max-500-mg-213-mg-325-mg10-ml-1237', false, '2026-08-09'
),
(
    'Avaspray Nasal Spray', 'Fluticasone Furoate', '27.5 mcg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 275.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/avaspray-275-mcgspray-1239', false, '2026-08-09'
),
(
    'Avitaz IV Infusion', 'Ceftazidime + Avibactam', '2 gm', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,800.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/avitaz-2-gm-05-gmvial-1240', false, '2026-08-09'
),
(
    'Avloclav Tablet', 'Amoxicillin + Clavulanic Acid', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 486.00 | ৳ 162.00 | ৳ 27.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/avloclav-250-mg-125-mg-2233', false, '2026-08-09'
),
(
    'Avudin Tablet', 'Lamivudine + Zidovudine', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/avudin-150-mg-300-mg-1241', false, '2026-08-09'
),
(
    'Axlovir Tablet', 'Nirmatrelvir + Ritonavir', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,600.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/axlovir-150-mg-100-mg-12232', false, '2026-08-09'
),
(
    'B-50 Forte Capsule', 'Vitamin B complex', '5 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 437.50 | ৳ 17.50 | ৳ 1.75',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/b-50-forte-5-mg-2-mg-2-mg-20-mg-1244', false, '2026-08-09'
),
(
    'B-50 Forte Syrup', 'Vitamin B complex', '5 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 62.19',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/b-50-forte-5-mg-2-mg-2-mg-20-mg5-ml-1245', false, '2026-08-09'
),
(
    'B-50 Forte IV/IM Injection', 'Vitamin B complex', '50 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.60 | ৳ 10.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/b-50-forte-50-mg-548-mg-100-mg-5-mg-10-mg2-ml-1246', false, '2026-08-09'
),
(
    'B-9 Oral Solution', 'Folic Acid', '2.5 mg/5 ml', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/b-9-25-mg5-ml-1-1247', false, '2026-08-09'
),
(
    'Bacilax Capsule', 'Probiotic Combination [9 Billion]', NULL, 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bacilax-9-billion-1248', false, '2026-08-09'
),
(
    'Bactrocin Ointment', 'Mupirocin', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bactrocin-2-ww-1249', false, '2026-08-09'
),
(
    'Barif 40 mg Tablet', 'Febuxostat', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.90 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/barif-40-mg-1250', false, '2026-08-09'
),
(
    'Baritor 2 mg Tablet', 'Baricitinib', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/baritor-2-mg-1251', false, '2026-08-09'
),
(
    'Beclomin Metered Dose Inhaler', 'Beclomethasone Dipropionate', '100 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.82',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/beclomin-100-mcgpuff-1253', false, '2026-08-09'
),
(
    'Beclomin Metered Dose Inhaler', 'Beclomethasone Dipropionate', '250 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 320.96',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/beclomin-250-mcgpuff-1252', false, '2026-08-09'
),
(
    'Becospray Nasal Spray', 'Beclomethasone Dipropionate', '50 mcg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 146.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/becospray-50-mcgspray-1-1254', false, '2026-08-09'
),
(
    'Benostar Mouth Wash', 'Benzydamine Hydrochloride', NULL, 'Mouth Wash', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/benostar-015-1255', false, '2026-08-09'
),
(
    'Benzapen Injection', 'Benzathine Penicillin', NULL, 'Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/benzapen-12-lac-unitsvial-1256', false, '2026-08-09'
),
(
    'Betaburn Ointment', 'β-Sitosterol', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/betaburn-025-ww-1257', false, '2026-08-09'
),
(
    'Betameson Cream', 'Betamethasone Dipropionate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/betameson-005-1-1259', false, '2026-08-09'
),
(
    'Betameson Ointment', 'Betamethasone Dipropionate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 48.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/betameson-005-1258', false, '2026-08-09'
),
(
    'Betameson-CL Cream', 'Betamethasone + Clotrimazole', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/betameson-cl-005-1-1260', false, '2026-08-09'
),
(
    'Betameson-N Cream', 'Betamethasone + Neomycin Sulphate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/betameson-n-01-05-1261', false, '2026-08-09'
),
(
    'BetriXa 40 mg Capsule', 'Betrixaban', '40 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 650.00 | ৳ 65.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/betrixa-40-mg-1262', false, '2026-08-09'
),
(
    'BetriXa 80 mg Capsule', 'Betrixaban', '80 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,150.00 | ৳ 115.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/betrixa-80-mg-1263', false, '2026-08-09'
),
(
    'Bevicort Metered Dose Inhaler', 'Formoterol Fumarate + Glycopyrrolate + Budesonide', '5.5 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bevicort-55-mcg-104-mcg-182-mcgactuation-1264', false, '2026-08-09'
),
(
    'Beviprex Metered Dose Inhaler', 'Glycopyrronium Bromide + Formoterol Fumarate', '9 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/beviprex-9-mcg-48-mcgpuff-1265', false, '2026-08-09'
),
(
    'Bicozin Tablet', 'Vitamin B Complex + Zinc', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bicozin-1267', false, '2026-08-09'
),
(
    'Bicozin-I Syrup', 'Iron Polymaltose Complex + Vitamin B Complex + Zinc', NULL, 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bicozin-i-1268', false, '2026-08-09'
),
(
    'Bilista 20 mg Tablet', 'Bilastine', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bilista-20-mg-1269', false, '2026-08-09'
),
(
    'Bilista Kids 10 mg Dispersible Tablet', 'Bilastine', '10 mg', 'Dispersible Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bilista-kids-10-mg-1-1270', false, '2026-08-09'
),
(
    'Bimator Eye Drop (Ophthalmic Solution)', 'Bimatoprost + Timolol', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bimator-003-05-1271', false, '2026-08-09'
),
(
    'Bioprem 1 mg Capsule', 'Biotin', '1 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bioprem-1-mg-1-1272', false, '2026-08-09'
),
(
    'Bioprem 10 mg Capsule', 'Biotin', '10 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00 | ৳ 500.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bioprem-10-mg-1274', false, '2026-08-09'
),
(
    'Bioprem 2.5 mg Capsule', 'Biotin', '2.5 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bioprem-25-mg-1-1273', false, '2026-08-09'
),
(
    'Bioprem 5 mg Capsule', 'Biotin', '5 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,050.00 | ৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bioprem-5-mg-1-1275', false, '2026-08-09'
),
(
    'Bisocam Tablet', 'Bisoprolol Fumarate + Amlodipine Besilate', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bisocam-25-mg-5-mg-1276', false, '2026-08-09'
),
(
    'Bisocor 2.5 mg Tablet', 'Bisoprolol Fumarate', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bisocor-25-mg-1277', false, '2026-08-09'
),
(
    'Bisocor 5 mg Tablet', 'Bisoprolol Fumarate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 345.00 | ৳ 115.00 | ৳ 11.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bisocor-5-mg-1278', false, '2026-08-09'
),
(
    'Bisocor Plus Tablet', 'Bisoprolol Fumarate + Hydrochlorothiazide', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.60 | ৳ 60.20 | ৳ 6.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bisocor-plus-25-mg-625-mg-1279', false, '2026-08-09'
),
(
    'Bisocor Plus Tablet', 'Bisoprolol Fumarate + Hydrochlorothiazide', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.90 | ৳ 100.30 | ৳ 10.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bisocor-plus-5-mg-625-mg-1280', false, '2026-08-09'
),
(
    'Bolardi Capsule', 'Saccharomyces Boulardii', '250 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bolardi-250-mg-5-billion-cfu-1281', false, '2026-08-09'
),
(
    'Bolardi Capsule', 'Saccharomyces Boulardii', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 96.00 | ৳ 16.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bolardi-500-mg-10-billion-cfu-1282', false, '2026-08-09'
),
(
    'Bonizol IV Infusion', 'Zoledronic Acid [For osteoporosis]', '5 mg/100 ml', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 6,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bonizol-5-mg100-ml-1283', false, '2026-08-09'
),
(
    'Brofex Syrup', 'Dextromethorphan Hydrobromide', '10 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/brofex-10-mg5-ml-1284', false, '2026-08-09'
),
(
    'Brofex TS Syrup', 'Dextromethorphan Polistirex', '30 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/brofex-ts-30-mg5-ml-1-1285', false, '2026-08-09'
),
(
    'Bromolac 2.5 mg Tablet', 'Bromocriptine Mesylate', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.90 | ৳ 180.45 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bromolac-25-mg-1286', false, '2026-08-09'
),
(
    'Bufocort Dry Powder Inhalation Capsule (DPI)', 'Budesonide + Formoterol Fumarate', '200 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bufocort-200-mcg6-mcg-1288', false, '2026-08-09'
),
(
    'Bufocort Dry Powder Inhalation Capsule (DPI)', 'Budesonide + Formoterol Fumarate', '400 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 421.50 | ৳ 84.30 | ৳ 14.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/bufocort-400-mcg-12-mcg-1287', false, '2026-08-09'
),
(
    'Burna Cream', 'Silver Sulfadiazine', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/burna-1-1289', false, '2026-08-09'
),
(
    'Caberol 0.5 mg Tablet', 'Cabergoline', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 160.00 | ৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/caberol-05-mg-1290', false, '2026-08-09'
),
(
    'Calbo 500 mg Tablet', 'Calcium Carbonate', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbo-500-mg-1291', false, '2026-08-09'
),
(
    'Calbo-C Effervescent Tablet', 'Calcium Lactate Gluconate + Calcium Carbonate + Vitamin C', '1000 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbo-c-1000-mg327-mg-conventional-calcium500-mg-1294', false, '2026-08-09'
),
(
    'Calbo-D Tablet', 'Calcium + Vitamin D3', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbo-d-500-mg-200-iu-1295', false, '2026-08-09'
),
(
    'Calbo-D Vita Effervescent Tablet', 'Calcium Lactate Gluconate + Calcium Carbonate + Vitamin D3', '1358.196 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbo-d-vita-1358196-mg600-mg-elemental-calcium400-iu-1296', false, '2026-08-09'
),
(
    'Calbo Forte Effervescent Tablet', 'Calcium Lactate Gluconate + Calcium Carbonate + Vitamin C + Vitamin D3', '1000 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbo-forte-1000-mg327-mg-conventional-calcium500-mg400-iu-1-1293', false, '2026-08-09'
),
(
    'Calbo Jr 250 mg Chewable Tablet', 'Calcium Carbonate', '250 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbo-jr-250-mg-1292', false, '2026-08-09'
),
(
    'Calboplex Tablet', 'Calcium + Vitamin D3 + Multimineral', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calboplex-1297', false, '2026-08-09'
),
(
    'Calboral-D Tablet', 'Coral Calcium + Vitamin D3', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 330.00 | ৳ 66.00 | ৳ 11.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calboral-d-500-mg-200-iu-1298', false, '2026-08-09'
),
(
    'Calboral-DX Tablet', 'Coral Calcium + Vitamin D3', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calboral-dx-600-mg-400-iu-1299', false, '2026-08-09'
),
(
    'Calbostar 400 mg Tablet', 'Calcium Orotate', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.90 | ৳ 80.30 | ৳ 8.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbostar-400-mg-1301', false, '2026-08-09'
),
(
    'Calbostar 740 mg Tablet', 'Calcium Orotate', '740 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.90 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbostar-740-mg-1300', false, '2026-08-09'
),
(
    'Calbotol Tablet', 'Calcium Citrate + Calcitriol', '1200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calbotol-1200-mg-025-mcg-1302', false, '2026-08-09'
),
(
    'Calcitrol 0.25 mcg Capsule', 'Calcitriol', '0.25 mcg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.90 | ৳ 100.30 | ৳ 10.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/calcitrol-025-mcg-1303', false, '2026-08-09'
),
(
    'Caloprid 1 mg Tablet', 'Prucalopride Succinate', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00 | ৳ 140.00 | ৳ 14.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/caloprid-1-mg-1305', false, '2026-08-09'
),
(
    'Caloprid 2 mg Tablet', 'Prucalopride Succinate', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 240.00 | ৳ 24.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/caloprid-2-mg-1304', false, '2026-08-09'
),
(
    'Camlodin 5 mg Tablet', 'Amlodipine Besilate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 301.20 | ৳ 75.30 | ৳ 5.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlodin-5-mg-1306', false, '2026-08-09'
),
(
    'Camlodin Plus Tablet', 'Amlodipine Besilate + Atenolol', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlodin-plus-5-mg-25-mg-1308', false, '2026-08-09'
),
(
    'Camlodin Plus Tablet', 'Amlodipine Besilate + Atenolol', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 448.00 | ৳ 112.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlodin-plus-5-mg-50-mg-1307', false, '2026-08-09'
),
(
    'Camlopril Capsule', 'Amlodipine Besilate + Benazepril Hydrochloride', '10 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.10 | ৳ 60.42 | ৳ 10.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlopril-10-mg-20-mg-1312', false, '2026-08-09'
),
(
    'Camlopril Capsule', 'Amlodipine Besilate + Benazepril Hydrochloride', '2.5 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.90 | ৳ 24.18 | ৳ 4.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlopril-25-mg-10-mg-1309', false, '2026-08-09'
),
(
    'Camlopril Capsule', 'Amlodipine Besilate + Benazepril Hydrochloride', '5 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 181.20 | ৳ 36.24 | ৳ 6.04',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlopril-5-mg-10-mg-1310', false, '2026-08-09'
),
(
    'Camlopril Capsule', 'Amlodipine Besilate + Benazepril Hydrochloride', '5 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 241.80 | ৳ 48.36 | ৳ 8.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlopril-5-mg-20-mg-1311', false, '2026-08-09'
),
(
    'Camlosart Tablet', 'Amlodipine Besilate + Olmesartan Medoxomil', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlosart-5-mg-20-mg-1313', false, '2026-08-09'
),
(
    'Camlosart Tablet', 'Amlodipine Besilate + Olmesartan Medoxomil', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlosart-5-mg-40-mg-1314', false, '2026-08-09'
),
(
    'Camlotel Tablet', 'Amlodipine Besilate + Telmisartan', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 375.00 | ৳ 125.00 | ৳ 12.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlotel-5-mg-40-mg-1315', false, '2026-08-09'
),
(
    'Camlotel Tablet', 'Amlodipine Besilate + Telmisartan', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/camlotel-5-mg-80-mg-1316', false, '2026-08-09'
),
(
    'Canaglif 100 mg Tablet', 'Canagliflozin Hemihydrate', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/canaglif-100-mg-1317', false, '2026-08-09'
),
(
    'Candex Oral Suspension', 'Nystatin', NULL, 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 46.84',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/candex-100000-unitml-1318', false, '2026-08-09'
),
(
    'Carbizol 10 mg Tablet', 'Carbimazole', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/carbizol-10-mg-1319', false, '2026-08-09'
),
(
    'Carbizol 5 mg Tablet', 'Carbimazole', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/carbizol-5-mg-1320', false, '2026-08-09'
),
(
    'Caripa 250 mg Capsule', 'Carica Papaya Leaf Extract', '250 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/caripa-250-mg-1-1322', false, '2026-08-09'
),
(
    'Caripa Syrup', 'Carica Papaya Leaf Extract', '275 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/caripa-275-mg5-ml-1321', false, '2026-08-09'
),
(
    'Carva 75 mg Tablet', 'Aspirin', '75 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 156.00 | ৳ 12.00 | ৳ 0.80',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/carva-75-mg-1323', false, '2026-08-09'
),
(
    'Cavir 0.5 mg Tablet', 'Entecavir', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 481.40 | ৳ 48.14',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cavir-05-mg-1325', false, '2026-08-09'
),
(
    'Cavir 1 mg Tablet', 'Entecavir', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 902.70 | ৳ 90.27',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cavir-1-mg-1324', false, '2026-08-09'
),
(
    'Ceevit Syrup', 'Vitamin C [Ascorbic acid]', '100 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceevit-100-mg5-ml-1326', false, '2026-08-09'
),
(
    'Ceevit 250 mg Chewable Tablet', 'Vitamin C [Ascorbic acid]', '250 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 475.00 | ৳ 19.00 | ৳ 1.90',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceevit-250-mg-1327', false, '2026-08-09'
),
(
    'Ceevit DS 500 mg Chewable Tablet', 'Vitamin C [Ascorbic acid]', '500 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 315.00 | ৳ 21.00 | ৳ 3.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceevit-ds-500-mg-1328', false, '2026-08-09'
),
(
    'Ceevit Forte 1000 mg Effervescent Tablet', 'Vitamin C [Ascorbic acid]', '1000 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 184.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceevit-forte-1000-mg-1329', false, '2026-08-09'
),
(
    'Cef-3 Powder For Suspension', 'Cefixime Trihydrate', '100 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 145.00 | ৳ 230.00 | ৳ 260.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cef-3-100-mg5-ml-1330', false, '2026-08-09'
),
(
    'Cef-3 200 mg Capsule', 'Cefixime Trihydrate', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 630.00 | ৳ 315.00 | ৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cef-3-200-mg-1334', false, '2026-08-09'
),
(
    'Cef-3 Paediatric Drops', 'Cefixime Trihydrate', '25 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.30',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cef-3-25-mgml-1-1332', false, '2026-08-09'
),
(
    'Cef-3 DS 400 mg Capsule', 'Cefixime Trihydrate', '400 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 840.00 | ৳ 420.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cef-3-ds-400-mg-1335', false, '2026-08-09'
),
(
    'Cef-3 Forte Powder For Suspension', 'Cefixime Trihydrate', '200 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cef-3-forte-200-mg5-ml-1331', false, '2026-08-09'
),
(
    'Cef-3 Max Paediatric Drops', 'Cefixime Trihydrate', '100 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cef-3-max-100-mgml-1333', false, '2026-08-09'
),
(
    'Cefopen IV/IM Injection', 'Cefoperazone Sodium', '1 gm', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefopen-1-gmvial-1337', false, '2026-08-09'
),
(
    'Cefopen IV/IM Injection', 'Cefoperazone Sodium', '2 gm', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefopen-2-gmvial-1336', false, '2026-08-09'
),
(
    'Cefotil Powder For Suspension', 'Cefuroxime Axetil', '125 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-125-mg5-ml-1340', false, '2026-08-09'
),
(
    'Cefotil IV Injection', 'Cefuroxime Axetil', '1.5 gm', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-15-gmvial-1338', false, '2026-08-09'
),
(
    'Cefotil 250 mg Tablet', 'Cefuroxime Axetil', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 503.40 | ৳ 251.70 | ৳ 25.17',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-250-mg-1341', false, '2026-08-09'
),
(
    'Cefotil 500 mg Tablet', 'Cefuroxime Axetil', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 543.48 | ৳ 271.74 | ৳ 45.29',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-500-mg-1342', false, '2026-08-09'
),
(
    'Cefotil IV/IM Injection', 'Cefuroxime Axetil', '750 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 132.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-750-mgvial-1339', false, '2026-08-09'
),
(
    'Cefotil Plus Powder For Suspension', 'Cefuroxime Axetil + Clavulanic Acid', '125 mg', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 285.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-plus-125-mg-3125-mg5-ml-1345', false, '2026-08-09'
),
(
    'Cefotil Plus Tablet', 'Cefuroxime Axetil + Clavulanic Acid', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 420.00 | ৳ 210.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-plus-250-mg-625-mg-1344', false, '2026-08-09'
),
(
    'Cefotil Plus Tablet', 'Cefuroxime Axetil + Clavulanic Acid', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 720.00 | ৳ 360.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cefotil-plus-500-mg-125-mg-1343', false, '2026-08-09'
),
(
    'Ceftiben 400 mg Capsule', 'Ceftibuten Dihydrate', '400 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 720.00 | ৳ 120.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftiben-400-mg-1346', false, '2026-08-09'
),
(
    'Ceftiben Powder For Suspension', 'Ceftibuten Dihydrate', '90 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftiben-90-mg5-ml-1347', false, '2026-08-09'
),
(
    'Ceftron IM Injection', 'Ceftriaxone Sodium', '1 gm', 'IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftron-1-gmvial-1-1350', false, '2026-08-09'
),
(
    'Ceftron IV Injection', 'Ceftriaxone Sodium', '1 gm', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftron-1-gmvial-1349', false, '2026-08-09'
),
(
    'Ceftron IV Injection', 'Ceftriaxone Sodium', '2 gm', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftron-2-gmvial-1348', false, '2026-08-09'
),
(
    'Ceftron IV Injection', 'Ceftriaxone Sodium', '250 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftron-250-mgvial-1-1352', false, '2026-08-09'
),
(
    'Ceftron IM Injection', 'Ceftriaxone Sodium', '250 mg', 'IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftron-250-mgvial-1351', false, '2026-08-09'
),
(
    'Ceftron IM Injection', 'Ceftriaxone Sodium', '500 mg', 'IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftron-500-mgvial-1-1354', false, '2026-08-09'
),
(
    'Ceftron IV Injection', 'Ceftriaxone Sodium', '500 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ceftron-500-mgvial-1353', false, '2026-08-09'
),
(
    'Cerevas 5 mg Tablet', 'Vinpocetine', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.50 | ৳ 40.30 | ৳ 4.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cerevas-5-mg-1355', false, '2026-08-09'
),
(
    'Cholenak IV Infusion', 'Sodium Chloride + Potassium Chloride + Sodium Acetate', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.15',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cholenak-05-01-0393-1356', false, '2026-08-09'
),
(
    'Cilosta 100 mg Tablet', 'Cilostazol', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 362.70 | ৳ 120.90 | ৳ 12.09',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cilosta-100-mg-1357', false, '2026-08-09'
),
(
    'Cinaron 15 mg Tablet', 'Cinnarizine', '15 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00 | ৳ 13.50 | ৳ 1.35',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cinaron-15-mg-1358', false, '2026-08-09'
),
(
    'Cinaron Plus Tablet', 'Cinnarizine + Dimenhydrinate', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00 | ৳ 28.00 | ৳ 2.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cinaron-plus-20-mg-40-mg-1359', false, '2026-08-09'
),
(
    'Ciprocin Eye Drop (Ophthalmic Solution)', 'Ciprofloxacin', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ciprocin-03-1365', false, '2026-08-09'
),
(
    'Ciprocin IV Infusion', 'Ciprofloxacin', '200 mg/100 ml', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 146.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ciprocin-200-mg100-ml-1361', false, '2026-08-09'
),
(
    'Ciprocin 250 mg Tablet', 'Ciprofloxacin', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 428.00 | ৳ 85.60 | ৳ 8.56',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ciprocin-250-mg-1-1362', false, '2026-08-09'
),
(
    'Ciprocin Powder For Suspension', 'Ciprofloxacin', '250 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.30',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ciprocin-250-mg5-ml-1360', false, '2026-08-09'
),
(
    'Ciprocin 500 mg Tablet', 'Ciprofloxacin', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 451.50 | ৳ 150.50 | ৳ 15.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ciprocin-500-mg-1363', false, '2026-08-09'
),
(
    'Ciprocin 750 mg Tablet', 'Ciprofloxacin', '750 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 362.40 | ৳ 120.80 | ৳ 12.08',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ciprocin-750-mg-1364', false, '2026-08-09'
),
(
    'Citivas 500 mg Tablet', 'Citicoline Sodium', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/citivas-500-mg-1366', false, '2026-08-09'
),
(
    'Climycin 300 mg Capsule', 'Clindamycin', '300 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 180.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/climycin-300-mg-1367', false, '2026-08-09'
),
(
    'Clinface Topical Gel', 'Clindamycin + Tretinoin', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clinface-120025-1368', false, '2026-08-09'
),
(
    'Clofenac Gel', 'Diclofenac Sodium', NULL, 'Gel', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-1-ww-1372', false, '2026-08-09'
),
(
    'Clofenac 12.50 mg Suppository', 'Diclofenac Sodium', '12.50 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-1250-mg-1373', false, '2026-08-09'
),
(
    'Clofenac 25 mg Suppository', 'Diclofenac Sodium', '25 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-25-mg-1374', false, '2026-08-09'
),
(
    'Clofenac 50 mg Suppository', 'Diclofenac Sodium', '50 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-50-mg-1-1375', false, '2026-08-09'
),
(
    'Clofenac 50 mg Tablet', 'Diclofenac Sodium', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 20.00 | ৳ 2.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-50-mg-1369', false, '2026-08-09'
),
(
    'Clofenac DT 46.5 mg Dispersible Tablet', 'Diclofenac Sodium', '46.5 mg', 'Dispersible Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 402.00 | ৳ 40.20 | ৳ 4.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-dt-465-mg-1371', false, '2026-08-09'
),
(
    'Clofenac Plus IM Injection', 'Diclofenac Sodium + Lidocaine Hydrochloride', '75 mg', 'IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 151.00 | ৳ 15.10',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-plus-75-mg-20-mg2-ml-1376', false, '2026-08-09'
),
(
    'Clofenac SR 100 mg Sustained Release Tablet', 'Diclofenac Sodium', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clofenac-sr-100-mg-1370', false, '2026-08-09'
),
(
    'Clopirox Shampoo', 'Ciclopirox Olamine', NULL, 'Shampoo', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clopirox-1-1-1377', false, '2026-08-09'
),
(
    'Clopirox Cream', 'Ciclopirox Olamine', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 110.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clopirox-1-1378', false, '2026-08-09'
),
(
    'Clotinex SC Injection', 'Enoxaparin Sodium', '0.4 ml', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 451.36',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clotinex-4000-anti-xa-iu04-ml-1-1380', false, '2026-08-09'
),
(
    'Clotinex SC Injection', 'Enoxaparin Sodium', '0.6 ml', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 576.73',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/clotinex-6000-anti-xa-iu06-ml-1379', false, '2026-08-09'
),
(
    'Colicon 10 mg Tablet', 'Dicycloverine Hydrochloride', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.00 | ৳ 20.10 | ৳ 2.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/colicon-10-mg-1381', false, '2026-08-09'
),
(
    'Colicon Syrup', 'Dicycloverine Hydrochloride', '10 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/colicon-10-mg5-ml-1382', false, '2026-08-09'
),
(
    'Colimax 0.6 mg Tablet', 'Colchicine', '0.6 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/colimax-06-mg-1383', false, '2026-08-09'
),
(
    'Colmint Capsule', 'Peppermint Oil', '187 mg/0.2 ml', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/colmint-187-mg02-ml-1384', false, '2026-08-09'
),
(
    'Combicid Cream', 'Clobetasol Propionate + Ofloxacin + Ornidazole + Terbinafine', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/combicid-00507521-1385', false, '2026-08-09'
),
(
    'Comet 500 mg Tablet', 'Metformin Hydrochloride', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/comet-500-mg-1387', false, '2026-08-09'
),
(
    'Comet 850 mg Tablet', 'Metformin Hydrochloride', '850 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 301.00 | ৳ 60.20 | ৳ 6.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/comet-850-mg-1386', false, '2026-08-09'
),
(
    'Comet XR 1000 mg Extended Release Tablet', 'Metformin Hydrochloride', '1000 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.90 | ৳ 54.18 | ৳ 9.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/comet-xr-1000-mg-1389', false, '2026-08-09'
),
(
    'Comet XR 500 mg Extended Release Tablet', 'Metformin Hydrochloride', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 301.00 | ৳ 60.20 | ৳ 6.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/comet-xr-500-mg-1388', false, '2026-08-09'
),
(
    'Comprid 80 mg Tablet', 'Gliclazide', '80 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/comprid-80-mg-1390', false, '2026-08-09'
),
(
    'Comprid XR 30 mg Extended Release Tablet', 'Gliclazide', '30 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/comprid-xr-30-mg-1-1392', false, '2026-08-09'
),
(
    'Comprid XR 60 mg Extended Release Tablet', 'Gliclazide', '60 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/comprid-xr-60-mg-1-1391', false, '2026-08-09'
),
(
    'Contilex Tablet', 'Glucosamine Sulfate + Chondroitin', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 241.80 | ৳ 48.36 | ৳ 8.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/contilex-250-mg-200-mg-1393', false, '2026-08-09'
),
(
    'Contilex TS Tablet', 'Glucosamine Sulfate + Chondroitin', '750 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/contilex-ts-750-mg-600-mg-1394', false, '2026-08-09'
),
(
    'Cotrim Oral Suspension', 'Sulphamethoxazole + Trimethoprim', '200 mg', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 21.64',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cotrim-200-mg-40-mg5-ml-1395', false, '2026-08-09'
),
(
    'Cotrim Tablet', 'Sulphamethoxazole + Trimethoprim', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 149.00 | ৳ 14.90 | ৳ 1.49',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cotrim-400-mg-80-mg-1396', false, '2026-08-09'
),
(
    'Cotrim DS Tablet', 'Sulphamethoxazole + Trimethoprim', '800 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 266.00 | ৳ 26.60 | ৳ 2.66',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cotrim-ds-800-mg-160-mg-1397', false, '2026-08-09'
),
(
    'Cozycol 800 mg Delayed Release Tablet', 'Mesalazine [5-aminosalicylic acid]', '800 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/cozycol-800-mg-1398', false, '2026-08-09'
),
(
    'D-Balance Capsule', 'Cholecalciferol [Vitamin D3]', '2000 IU', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/d-balance-2000-iu-1402', false, '2026-08-09'
),
(
    'D-Balance Oral Solution', 'Cholecalciferol [Vitamin D3]', '2000 IU', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/d-balance-2000-iuml-1401', false, '2026-08-09'
),
(
    'D-Balance Capsule', 'Cholecalciferol [Vitamin D3]', '20000 IU', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/d-balance-20000-iu-1403', false, '2026-08-09'
),
(
    'D-Balance Injectable Solution (Oral & IM)', 'Cholecalciferol [Vitamin D3]', '200000 IU', 'Injectable Solution (Oral & IM)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/d-balance-200000-iuml-1399', false, '2026-08-09'
),
(
    'D-Balance Capsule', 'Cholecalciferol [Vitamin D3]', '40000 IU', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/d-balance-40000-iu-1404', false, '2026-08-09'
),
(
    'D-Balance Capsule', 'Cholecalciferol [Vitamin D3]', '50000 IU', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/d-balance-50000-iu-1405', false, '2026-08-09'
),
(
    'D-Sitol 500 mg Capsule', 'D-chiro-inositol', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,020.00 | ৳ 510.00 | ৳ 85.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/d-sitol-500-mg-1406', false, '2026-08-09'
),
(
    'Daizy 2 mg Tablet', 'Dienogest', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/daizy-2-mg-1407', false, '2026-08-09'
),
(
    'Darboren IV/SC Injection', 'Darbepoetin Alfa', '25 mcg/0.42 ml', 'IV/SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,800.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/darboren-25-mcg042-ml-1410', false, '2026-08-09'
),
(
    'Darboren IV/SC Injection', 'Darbepoetin Alfa', '40 mcg/0.4 ml', 'IV/SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 4,500.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/darboren-40-mcg04-ml-1409', false, '2026-08-09'
),
(
    'Darboren IV/SC Injection', 'Darbepoetin Alfa', '60 mcg/0.3 ml', 'IV/SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 5,500.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/darboren-60-mcg03-ml-1408', false, '2026-08-09'
),
(
    'De-Rash Ointment', 'Zinc Oxide [For diaper rash]', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.35',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/de-rash-40-1411', false, '2026-08-09'
),
(
    'De-Rash Plus Ointment', 'Miconazole Nitrate + Zinc Oxide + White Soft Paraffin', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 135.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/de-rash-plus-025-15-8135-1412', false, '2026-08-09'
),
(
    'Defiron IV Injection or Infusion', 'Iron Sucrose', '100 mg/5 ml', 'IV Injection or Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/defiron-100-mg5-ml-1-1413', false, '2026-08-09'
),
(
    'Deflacort 18 mg Tablet', 'Deflazacort', '18 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/deflacort-18-mg-1416', false, '2026-08-09'
),
(
    'Deflacort 24 mg Tablet', 'Deflazacort', '24 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/deflacort-24-mg-1417', false, '2026-08-09'
),
(
    'Deflacort 30 mg Tablet', 'Deflazacort', '30 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 320.00 | ৳ 32.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/deflacort-30-mg-1418', false, '2026-08-09'
),
(
    'Deflacort 6 mg Tablet', 'Deflazacort', '6 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 570.00 | ৳ 95.00 | ৳ 9.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/deflacort-6-mg-1415', false, '2026-08-09'
),
(
    'Deflacort Oral Suspension', 'Deflazacort', '6 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/deflacort-6-mg5-ml-1414', false, '2026-08-09'
),
(
    'Depram 25 mg Tablet', 'Imipramine Hydrochloride', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/depram-25-mg-1419', false, '2026-08-09'
),
(
    'Deprex 10 mg Tablet', 'Olanzapine', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 225.00 | ৳ 45.00 | ৳ 4.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/deprex-10-mg-1420', false, '2026-08-09'
),
(
    'Deprex 5 mg Tablet', 'Olanzapine', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 125.00 | ৳ 25.00 | ৳ 2.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/deprex-5-mg-1421', false, '2026-08-09'
),
(
    'Dermasol Ointment', 'Clobetasol Propionate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dermasol-005-1-1423', false, '2026-08-09'
),
(
    'Dermasol Cream', 'Clobetasol Propionate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.48',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dermasol-005-1422', false, '2026-08-09'
),
(
    'Dermasol-N Ointment', 'Clobetasol Propionate + Neomycin Sulphate + Nystatin', '0.5 mg', 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dermasol-n-05-mg-5-mg-1-lac-iugm-1427', false, '2026-08-09'
),
(
    'Dermasol-N Cream', 'Clobetasol Propionate + Neomycin Sulphate + Nystatin', '0.5 mg', 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dermasol-n-05-mg5-mg1-lac-iugm-1426', false, '2026-08-09'
),
(
    'Dermasol Plus Ointment', 'Clobetasol Propionate + Salicylic Acid', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dermasol-plus-005-3-1425', false, '2026-08-09'
),
(
    'Dermasol-S Scalp Solution', 'Clobetasol Propionate', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.61',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dermasol-s-005-1-1424', false, '2026-08-09'
),
(
    'Dexonex 0.5 mg Tablet', 'Dexamethasone', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 89.00 | ৳ 8.90 | ৳ 0.89',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dexonex-05-mg-1428', false, '2026-08-09'
),
(
    'Dexonex IV/IM Injection', 'Dexamethasone', '5 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.60 | ৳ 20.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dexonex-5-mgml-1-1429', false, '2026-08-09'
),
(
    'Dexonex-C Eye Drop (Ophthalmic Solution)', 'Dexamethasone + Chloramphenicol', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.21',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dexonex-c-01-05-1430', false, '2026-08-09'
),
(
    'Dibenol 5 mg Tablet', 'Glibenclamide', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 105.00 | ৳ 5.25 | ৳ 0.35',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dibenol-5-mg-1431', false, '2026-08-09'
),
(
    'Diliner DR 20 mg Delayed Release Capsule', 'Duloxetine Hydrochloride', '20 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 48.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/diliner-dr-20-mg-1433', false, '2026-08-09'
),
(
    'Diliner DR 60 mg Delayed Release Capsule', 'Duloxetine Hydrochloride', '60 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 289.98 | ৳ 96.66 | ৳ 16.11',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/diliner-dr-60-mg-1432', false, '2026-08-09'
),
(
    'Diltizem SR 90 mg Sustained Release Tablet', 'Diltiazem Hydrochloride', '90 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 220.25 | ৳ 55.06 | ৳ 5.51',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/diltizem-sr-90-mg-1434', false, '2026-08-09'
),
(
    'DK Capsule', 'Vitamin D3 + Vitamin K1 + Vitamin K2', '400 IU', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dk-400-iu-60-mcg-30-mcg-1435', false, '2026-08-09'
),
(
    'Dormitol IV/IM Injection', 'Midazolam', '15 mg/3 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.37',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dormitol-15-mg3-ml-1436', false, '2026-08-09'
),
(
    'Dormitol 7.5 mg Tablet', 'Midazolam', '7.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dormitol-75-mg-1437', false, '2026-08-09'
),
(
    'Dotfix 1 mg Tablet', 'Dotinurad', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dotfix-1-mg-1438', false, '2026-08-09'
),
(
    'Dotfix 2 mg Tablet', 'Dotinurad', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 240.00 | ৳ 24.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dotfix-2-mg-1439', false, '2026-08-09'
),
(
    'Doxacil 100 mg Capsule', 'Doxycycline Hydrochloride', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 25.00 | ৳ 2.50',
    NULL, NULL, 'সাধারণ ইনফেকশন: প্রথম দিন ১০০ মিলিগ্রাম করে দিনে দুইবার (মোট ২০০ মিলিগ্রাম) খেতে হয়। এর পরের দিনগুলোতে প্রতিদিন ১০০ মিলিগ্রাম করে একটি ট্যাবলেট খেতে হয়। সাধারণত রোগের তীব্রতা বুঝে ৭ থেকে ১০ দিন এই ওষুধ দেওয়া হয়।জটিল বা দীর্ঘস্থায়ী ইনফেকশন: পুরো চিকিৎসার সময়জুড়ে প্রতিদিন ১০০ মিলিগ্রাম করে দিনে দুইবার (মোট ২০০ মিলিগ্রাম) খেতে হয়।ক্ল্যামিডিয়া ও অন্যান্য বিশেষ ইনফেকশন: দিনে দুইবার ১০০ মিলিগ্রাম করে টানা ৭ দিন খেতে হয়।সিফিলিস (যাদের পেনিসিলিনে অ্যালার্জি আছে): দিনে দুইবার ১০০ মিলিগ্রাম করে রোগের অবস্থা ভেদে ২ থেকে ৪ সপ্তাহ পর্যন্ত খেতে হয়।ম্যালেরিয়া প্রতিরোধে: প্রতিদিন ১০০ মিলিগ্রাম করে একটি ট্যাবলেট খেতে হয়। ম্যালেরিয়া প্রবণ এলাকায় ভ্রমণের ১-২ দিন আগে থেকে এই ওষুধ শুরু করতে হয়, ভ্রমণকালীন সময়ে খেতে হয় এবং ভ্রমণ থেকে ফেরার পরও টানা ৪ সপ্তাহ খেয়ে যেতে হয়।অ্যানথ্রাক্স প্রতিরোধে (জীবাণুর সংস্পর্শে আসার পর): দিনে দুইবার ১০০ মিলিগ্রাম করে টানা ৬০ দিন খেতে হয়।ভ্রমণকালীন ডায়রিয়া (ট্রাভেলার্স ডায়রিয়া) প্রতিরোধে: ভ্রমণের প্রথম দিন ২০০ মিলিগ্রাম এবং পরবর্তী দিনগুলোতে প্রতিদিন ১০০ মিলিগ্রাম করে খেতে হয় (সর্বোচ্চ ২১ দিন পর্যন্ত)।লেপ্টোস্পাইরোসিস প্রতিরোধে: প্রতি সপ্তাহে ২০০ মিলিগ্রামের একটি একক মাত্রা এবং ভ্রমণ শেষে আরও একটি ২০০ মিলিগ্রামের ট্যাবলেট খেতে হয়।', NULL,
    NULL, 'https://drugdirectorybd.com/brands/doxacil-100-mg-1440', true, '2026-08-09'
),
(
    'Dubarel 0 mg Syrup', 'Aushokarist [Saraca Indica]', '0 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dubarel-0-mg-1441', false, '2026-08-09'
),
(
    'Dulamet Metered Dose Inhaler', 'Mometasone Furoate + Formoterol Fumarate', '100 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 695.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dulamet-100-mcg-5-mcgpuff-1443', false, '2026-08-09'
),
(
    'Dulamet Metered Dose Inhaler', 'Mometasone Furoate + Formoterol Fumarate', '200 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 895.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dulamet-200-mcg-5-mcgpuff-1442', false, '2026-08-09'
),
(
    'Dumeg 500 mg Tablet', 'Imeglimin Hydrochloride', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dumeg-500-mg-1444', false, '2026-08-09'
),
(
    'Duolax Oral Emulsion', 'Magnesium Hydroxide + Liquid Paraffin', '300 mg', 'Oral Emulsion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 95.29',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/duolax-300-mg-125-ml5-ml-1445', false, '2026-08-09'
),
(
    'Dyvon Ointment', 'Calcipotriol Monohydrate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 351.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dyvon-0005-ww-1446', false, '2026-08-09'
),
(
    'Dyvon Plus Ointment', 'Betamethasone + Calcipotriol', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 381.14',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dyvon-plus-005-0005-1-1448', false, '2026-08-09'
),
(
    'Dyvon Plus Topical Suspension', 'Betamethasone + Calcipotriol', NULL, 'Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 551.65',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/dyvon-plus-005-0005-2-1447', false, '2026-08-09'
),
(
    'Efaxim 200 mg Tablet', 'Rifaximin', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/efaxim-200-mg-1449', false, '2026-08-09'
),
(
    'Efaxim 550 mg Tablet', 'Rifaximin', '550 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/efaxim-550-mg-1450', false, '2026-08-09'
),
(
    'Elorim Cream', 'Eflornithine Hydrochloride', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,500.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/elorim-139-1451', false, '2026-08-09'
),
(
    'Emcil 200 mg Tablet', 'Pivmecillinam', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 451.50 | ৳ 90.30 | ৳ 15.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emcil-200-mg-1452', false, '2026-08-09'
),
(
    'Emjard 10 mg Tablet', 'Empagliflozin', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emjard-10-mg-1453', false, '2026-08-09'
),
(
    'Emjard 25 mg Tablet', 'Empagliflozin', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emjard-25-mg-1454', false, '2026-08-09'
),
(
    'Emjard M Tablet', 'Empagliflozin + Metformin Hydrochloride', '12.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emjard-m-125-mg-500-mg-1455', false, '2026-08-09'
),
(
    'Emjard M Tablet', 'Empagliflozin + Metformin Hydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 180.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emjard-m-5-mg-500-mg-1456', false, '2026-08-09'
),
(
    'Emjard M XR Extended Release Tablet', 'Empagliflozin + Metformin Hydrochloride', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emjard-m-xr-10-mg-1000-mg-1458', false, '2026-08-09'
),
(
    'Emjard M XR Extended Release Tablet', 'Empagliflozin + Metformin Hydrochloride', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00 | ৳ 200.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emjard-m-xr-25-mg-1000-mg-1459', false, '2026-08-09'
),
(
    'Emjard M XR Extended Release Tablet', 'Empagliflozin + Metformin Hydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 100.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emjard-m-xr-5-mg-1000-mg-1457', false, '2026-08-09'
),
(
    'Emolent Cream', 'White Soft Paraffin + Liquid Paraffin', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.30',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emolent-15-6-1461', false, '2026-08-09'
),
(
    'Emolent Lotion', 'White Soft Paraffin + Liquid Paraffin', NULL, 'Lotion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emolent-3-8-1460', false, '2026-08-09'
),
(
    'Emolent Plus Cream', 'Light Liquid Paraffin + White Soft Paraffin + Glycerine', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emolent-plus-10-5-10-1462', false, '2026-08-09'
),
(
    'Emoli Lotion', 'Liquid Paraffin + Benzalkonium Chloride + Chlorhexidine + Isopropyl Myristate', NULL, 'Lotion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/emoli-25-01-01-25-1463', false, '2026-08-09'
),
(
    'Enerton Syrup', 'Balarista', NULL, 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 170.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/enerton-1464', false, '2026-08-09'
),
(
    'Entacyd Oral Suspension', 'Aluminium Hydroxide + Magnesium Hydroxide', '175 mg', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 64.40',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/entacyd-175-mg-225-mg5-ml-1465', false, '2026-08-09'
),
(
    'Entacyd Plus Oral Suspension', 'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone', '200 mg', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/entacyd-plus-200-mg-400-mg-30-mg5-ml-1466', false, '2026-08-09'
),
(
    'Entacyd Plus Chewable Tablet', 'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone', '400 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 25.00 | ৳ 2.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/entacyd-plus-400-mg-400-mg-30-mg-1467', false, '2026-08-09'
),
(
    'Epitra 0.5 mg Tablet', 'Clonazepam', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/epitra-05-mg-1468', false, '2026-08-09'
),
(
    'Epitra 1 mg Tablet', 'Clonazepam', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/epitra-1-mg-1469', false, '2026-08-09'
),
(
    'Epitra 2 mg Tablet', 'Clonazepam', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 125.00 | ৳ 12.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/epitra-2-mg-1470', false, '2026-08-09'
),
(
    'Eporen IV/SC Injection', 'Erythropoietin Alfa', '3000 IU', 'IV/SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,454.37',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eporen-3000-iu-1-1472', false, '2026-08-09'
),
(
    'Eporen IV/SC Injection', 'Erythropoietin Alfa', '5000 IU', 'IV/SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,016.32',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eporen-5000-iu-1-1471', false, '2026-08-09'
),
(
    'Eprim 500 mg Capsule', 'Evening Primrose Oil', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eprim-500-mg-1473', false, '2026-08-09'
),
(
    'Eprim Plus 1000 mg Capsule', 'Evening Primrose Oil', '1000 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eprim-plus-1000-mg-1474', false, '2026-08-09'
),
(
    'Equra Cream', 'Urea', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 30.20',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/equra-10-ww-1475', false, '2026-08-09'
),
(
    'Eredex 5.4 mg Capsule', 'Yohimbine Hydrochloride', '5.4 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 720.00 | ৳ 180.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eredex-54-mg-1476', false, '2026-08-09'
),
(
    'Erian Suppository', 'Cinchocaine + Hydrocortisone + Framycetin + Esculin', '5 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/erian-5-mg-5-mg-10-mg-10-mg-1477', false, '2026-08-09'
),
(
    'Erian Ointment', 'Cinchocaine + Hydrocortisone + Framycetin + Esculin', '5 mg', 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 85.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/erian-5-mg-5-mg-105-mg-10-mggm-1478', false, '2026-08-09'
),
(
    'Eromycin Powder For Suspension', 'Erythromycin', '125 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 84.76',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eromycin-125-mg5-ml-1480', false, '2026-08-09'
),
(
    'Eromycin Paediatric Drops', 'Erythromycin', '200 mg/5 ml', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eromycin-200-mg5-ml-1479', false, '2026-08-09'
),
(
    'Eromycin Lotion', 'Erythromycin', NULL, 'Lotion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.37',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eromycin-3-wv-1482', false, '2026-08-09'
),
(
    'Eromycin DS 500 mg Tablet', 'Erythromycin', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 310.00 | ৳ 62.00 | ৳ 10.33',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eromycin-ds-500-mg-1-1481', false, '2026-08-09'
),
(
    'Esloric 100 mg Tablet', 'Allopurinol', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 403.00 | ৳ 40.30 | ৳ 4.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/esloric-100-mg-1484', false, '2026-08-09'
),
(
    'Esloric 300 mg Tablet', 'Allopurinol', '300 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 249.00 | ৳ 83.00 | ৳ 8.30',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/esloric-300-mg-1483', false, '2026-08-09'
),
(
    'Evit 200 mg Capsule', 'Vitamin E [Alpha Tocopherol Acetate]', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/evit-200-mg-1486', false, '2026-08-09'
),
(
    'Evit 400 mg Capsule', 'Vitamin E [Alpha Tocopherol Acetate]', '400 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/evit-400-mg-1485', false, '2026-08-09'
),
(
    'Eyevi Capsule', 'Vitamin C + Vitamin E + Lutein + Copper + Zinc', '60 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/eyevi-60-mg-30-mg-6-mg-2-mg-15-mg-1487', false, '2026-08-09'
),
(
    'Ezex Cream', 'Clobetasone Butyrate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.51',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ezex-005-1-1489', false, '2026-08-09'
),
(
    'Ezex Ointment', 'Clobetasone Butyrate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.51',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ezex-005-1488', false, '2026-08-09'
),
(
    'Facticin 320 mg Tablet', 'Gemifloxacin', '320 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 391.14 | ৳ 65.19',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/facticin-320-mg-1490', false, '2026-08-09'
),
(
    'Famotack 20 mg Tablet', 'Famotidine', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 45.00 | ৳ 3.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/famotack-20-mg-1492', false, '2026-08-09'
),
(
    'Famotack 40 mg Tablet', 'Famotidine', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/famotack-40-mg-1491', false, '2026-08-09'
),
(
    'Famotack Powder For Suspension', 'Famotidine', '40 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 55.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/famotack-40-mg5-ml-1493', false, '2026-08-09'
),
(
    'Favinil 200 mg Tablet', 'Favipiravir', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 20,000.00 | ৳ 2,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/favinil-200-mg-1494', false, '2026-08-09'
),
(
    'Femastin Vaginal Cream', 'Estriol', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/femastin-01-1496', false, '2026-08-09'
),
(
    'Femastin 1 mg Tablet', 'Estriol', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 340.90 | ৳ 113.63 | ৳ 11.36',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/femastin-1-mg-1495', false, '2026-08-09'
),
(
    'Femony 0 mg Capsule', 'Combination of five natural herbs', '0 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/femony-0-mg-1497', false, '2026-08-09'
),
(
    'Femotol 30 mg Capsule', 'Ferric Maltol', '30 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 660.00 | ৳ 110.00 | ৳ 11.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/femotol-30-mg-1498', false, '2026-08-09'
),
(
    'Fentizol VT 600 mg Vaginal Tablet', 'Fenticonazole Nitrate', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fentizol-vt-600-mg-1499', false, '2026-08-09'
),
(
    'Fexo 120 mg Tablet', 'Fexofenadine Hydrochloride', '120 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fexo-120-mg-1501', false, '2026-08-09'
),
(
    'Fexo 180 mg Tablet', 'Fexofenadine Hydrochloride', '180 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fexo-180-mg-1500', false, '2026-08-09'
),
(
    'Fexo Oral Suspension', 'Fexofenadine Hydrochloride', '30 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 55.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fexo-30-mg5-ml-1503', false, '2026-08-09'
),
(
    'Fexo 60 mg Tablet', 'Fexofenadine Hydrochloride', '60 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fexo-60-mg-1502', false, '2026-08-09'
),
(
    'Filfresh 3 mg Tablet', 'Melatonin', '3 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.50 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/filfresh-3-mg-1-1504', false, '2026-08-09'
),
(
    'Filwel Gold Tablet', 'Multivitamin & Multimineral [A-Z gold preparation]', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/filwel-gold-1505', false, '2026-08-09'
),
(
    'Filwel Kids Syrup', 'Multivitamin + Cod Liver Oil', NULL, 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/filwel-kids-1506', false, '2026-08-09'
),
(
    'Filwel Silver Tablet', 'Multivitamin & Multimineral [A-Z silver preparation]', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/filwel-silver-1507', false, '2026-08-09'
),
(
    'Filwel Teen Hm Tablet', 'Multivitamin & Multimineral [A-Z teen boys preparation]', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/filwel-teen-hm-1509', false, '2026-08-09'
),
(
    'Filwel Teen Hr Tablet', 'Multivitamin & Multimineral [A-Z teen girls preparation]', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/filwel-teen-hr-1508', false, '2026-08-09'
),
(
    'Fitvit Capsule', 'Apple Vinegar + Garcinia cambogia + Ginger Root + Cayenne Pepper', '300 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fitvit-300-mg-50-mg-50-mg-50-mg-1510', false, '2026-08-09'
),
(
    'Flacol 40 mg Chewable Tablet', 'Simethicone', '40 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 30.00 | ৳ 3.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flacol-40-mg-1512', false, '2026-08-09'
),
(
    'Flacol Paediatric Drops', 'Simethicone', '67 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flacol-67-mgml-1511', false, '2026-08-09'
),
(
    'Flamfix 500 mg Tablet', 'Nabumetone', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flamfix-500-mg-1514', false, '2026-08-09'
),
(
    'Flamfix 750 mg Tablet', 'Nabumetone', '750 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 528.00 | ৳ 132.00 | ৳ 22.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flamfix-750-mg-1513', false, '2026-08-09'
),
(
    'Flemo 40 mg Capsule', 'Undenatured Type II Collagen', '40 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flemo-40-mg-1515', false, '2026-08-09'
),
(
    'Flemo Max Capsule', 'Undenatured Type-II Collagen + Hyaluronic Acid + Methylsulfonylmethane + Turmeric + Boswellia serrata', '20 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flemo-max-20-mg-35-mg-200-mg-50-mg-50-mg-1516', false, '2026-08-09'
),
(
    'Flemo Plus Capsule', 'Undenatured Type II Collagen + Glucosamine Sulfate + Chondroitin Sulfate', '40 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flemo-plus-40-mg-150-mg-120-mg-1517', false, '2026-08-09'
),
(
    'Flexi 100 mg Tablet', 'Aceclofenac', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 700.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flexi-100-mg-1518', false, '2026-08-09'
),
(
    'Flexi SR 200 mg Sustained Release Tablet', 'Aceclofenac', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flexi-sr-200-mg-1519', false, '2026-08-09'
),
(
    'Flexilax 10 mg Tablet', 'Baclofen', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flexilax-10-mg-1520', false, '2026-08-09'
),
(
    'Flexilax 5 mg Tablet', 'Baclofen', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 165.00 | ৳ 55.00 | ৳ 5.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flexilax-5-mg-1521', false, '2026-08-09'
),
(
    'Fliban 100 mg Tablet', 'Flibanserin', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fliban-100-mg-1522', false, '2026-08-09'
),
(
    'Flindof 200 mg Tablet', 'Doxophylline', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 225.00 | ৳ 75.00 | ৳ 7.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flindof-200-mg-1523', false, '2026-08-09'
),
(
    'Flindof 400 mg Tablet', 'Doxophylline', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flindof-400-mg-1524', false, '2026-08-09'
),
(
    'Flonasin Nasal Spray', 'Azelastine Hydrochloride + Fluticasone Propionate', '137 mcg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 320.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flonasin-137-mcg-50-mcgspray-1525', false, '2026-08-09'
),
(
    'Flonaspray Nasal Spray', 'Fluticasone Propionate', '50 mcg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 251.70',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flonaspray-50-mcgspray-1526', false, '2026-08-09'
),
(
    'Flugal 150 mg Capsule', 'Fluconazole', '150 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 442.80 | ৳ 221.40 | ৳ 22.14',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flugal-150-mg-1528', false, '2026-08-09'
),
(
    'Flugal 200 mg Capsule', 'Fluconazole', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.04 | ৳ 151.02 | ৳ 25.17',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flugal-200-mg-1529', false, '2026-08-09'
),
(
    'Flugal IV Infusion', 'Fluconazole', '200 mg/100 ml', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flugal-200-mg100-ml-1531', false, '2026-08-09'
),
(
    'Flugal 50 mg Capsule', 'Fluconazole', '50 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 403.50 | ৳ 80.70 | ৳ 8.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flugal-50-mg-1527', false, '2026-08-09'
),
(
    'Flugal Powder For Suspension', 'Fluconazole', '50 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 78.53',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flugal-50-mg5-ml-1530', false, '2026-08-09'
),
(
    'Flurizin 10 mg Tablet', 'Flunarizine', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flurizin-10-mg-1532', false, '2026-08-09'
),
(
    'Flurizin 5 mg Tablet', 'Flunarizine', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/flurizin-5-mg-1533', false, '2026-08-09'
),
(
    'Fodexil 1000 mg Tablet', 'Cefadroxil Monohydrate', '1000 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fodexil-1000-mg-1534', false, '2026-08-09'
),
(
    'Fodexil 500 mg Capsule', 'Cefadroxil Monohydrate', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 324.00 | ৳ 108.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fodexil-500-mg-1535', false, '2026-08-09'
),
(
    'Folita 5 mg Tablet', 'Folinic Acid', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/folita-5-mg-1536', false, '2026-08-09'
),
(
    'Fona Cream', 'Adapalene', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.40',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fona-01-1537', false, '2026-08-09'
),
(
    'Fona Gel', 'Adapalene', NULL, 'Gel', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.55',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fona-03-1538', false, '2026-08-09'
),
(
    'Fona Plus Gel', 'Adapalene + Benzoyl Peroxide', NULL, 'Gel', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.48',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fona-plus-01-25-1539', false, '2026-08-09'
),
(
    'Fonidel Injection', 'Fondaparinux Sodium', '2.5 mg/0.5 ml', 'Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 800.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fonidel-25-mg05-ml-1540', false, '2026-08-09'
),
(
    'Fosfomax Oral Powder', 'Fosfomycin Trometamol', '3 gm', 'Oral Powder', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fosfomax-3-gmsachet-1542', false, '2026-08-09'
),
(
    'Fosfomax IV Injection', 'Fosfomycin Sodium', '4 gm', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fosfomax-4-gmvial-1541', false, '2026-08-09'
),
(
    'Frabex 500 mg Capsule', 'Tranexamic Acid', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 460.00 | ৳ 230.00 | ৳ 23.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/frabex-500-mg-1543', false, '2026-08-09'
),
(
    'Frabex IV/IM Injection', 'Tranexamic Acid', '500 mg/5 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 390.00 | ৳ 65.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/frabex-500-mg5-ml-1-1544', false, '2026-08-09'
),
(
    'Freezy Nasal Inhaler', 'Methyl Salicylate + Menthol + Camphor', '122.70 mg', 'Nasal Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/freezy-12270-mg-41540-mg-41540-mggm-1545', false, '2026-08-09'
),
(
    'Fungidal Cream', 'Miconazole Nitrate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fungidal-2-ww-1546', false, '2026-08-09'
),
(
    'Fungidal-HC Cream', 'Miconazole Nitrate + Hydrocortisone', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 55.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fungidal-hc-2-1-1548', false, '2026-08-09'
),
(
    'Fusid IV/IM Injection', 'Furosemide', '20 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fusid-20-mg2-ml-1-1549', false, '2026-08-09'
),
(
    'Fusid 40 mg Tablet', 'Furosemide', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00 | ৳ 1.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fusid-40-mg-1550', false, '2026-08-09'
),
(
    'Fusid Plus Tablet', 'Furosemide + Spironolactone', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 481.80 | ৳ 160.60 | ৳ 8.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fusid-plus-20-mg-50-mg-1551', false, '2026-08-09'
),
(
    'Fusid Plus Tablet', 'Furosemide + Spironolactone', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 401.20 | ৳ 200.60 | ৳ 10.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fusid-plus-40-mg-50-mg-1552', false, '2026-08-09'
),
(
    'Fusitop-HC Cream', 'Fusidic acid + Hydrocortisone', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/fusitop-hc-2-1-1553', false, '2026-08-09'
),
(
    'G-Calbo Tablet', 'Algae Calcium + Vitamin D3', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/g-calbo-500-mg-200-iu-1554', false, '2026-08-09'
),
(
    'G-Calbo DX Tablet', 'Algae Calcium + Vitamin D3', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/g-calbo-dx-600-mg-400-iu-1555', false, '2026-08-09'
),
(
    'Gabastar 100 mg Tablet', 'Gabapentin', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 181.20 | ৳ 60.40 | ৳ 6.04',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gabastar-100-mg-1557', false, '2026-08-09'
),
(
    'Gabastar 300 mg Tablet', 'Gabapentin', '300 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 483.30 | ৳ 161.10 | ৳ 16.11',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gabastar-300-mg-1556', false, '2026-08-09'
),
(
    'Garlin 10 mg Capsule', 'Garlic Oil', '10 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/garlin-10-mg-1558', false, '2026-08-09'
),
(
    'Gefapix 45 mg Tablet', 'Gefapixant Citrate', '45 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 700.00 | ৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gefapix-45-mg-1559', false, '2026-08-09'
),
(
    'Gelaseed 1000 mg Capsule', 'Flaxseed oil [Linum Usitatissimum]', '1000 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gelaseed-1000-mg-1560', false, '2026-08-09'
),
(
    'Gelora Oral Gel', 'Miconazole Nitrate', NULL, 'Oral Gel', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gelora-2-ww-1547', false, '2026-08-09'
),
(
    'Genacyn Ointment', 'Gentamicin Sulfate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 12.09',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/genacyn-01-1561', false, '2026-08-09'
),
(
    'Genacyn Eye Drop (Ophthalmic Solution)', 'Gentamicin Sulfate', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 32.12',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/genacyn-03-1562', false, '2026-08-09'
),
(
    'Germicord Topical Solution', 'Chlorhexidine Gluconate [7.1%]', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/germicord-71-1563', false, '2026-08-09'
),
(
    'Germisol Hand Rub', 'Chlorhexidine Gluconate + Isopropyl Alcohol', NULL, 'Hand Rub', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00 | ৳ 48.00 | ৳ 130.39',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/germisol-05-70-1564', false, '2026-08-09'
),
(
    'Geston 5 mg Tablet', 'Allylestrenol', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/geston-5-mg-1565', false, '2026-08-09'
),
(
    'Gigabac IV/IM Injection', 'Colistimethate Sodium', '34 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gigabac-1-miu-34-mg-1-1567', false, '2026-08-09'
),
(
    'Gigabac IV/IM Injection', 'Colistimethate Sodium', '150 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gigabac-45-miu-150-mg-1566', false, '2026-08-09'
),
(
    'Giloba 120 mg Capsule', 'Ginkgo Biloba', '120 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/giloba-120-mg-1-1568', false, '2026-08-09'
),
(
    'Giloba 60 mg Capsule', 'Ginkgo Biloba', '60 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/giloba-60-mg-1569', false, '2026-08-09'
),
(
    'Gintex 500 mg Capsule', 'Panax Ginseng', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 60.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gintex-500-mg-1570', false, '2026-08-09'
),
(
    'Gleazy Topical Gel', 'Hydroxyethyl Cellulose + Glycerin', '1 gm', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 175.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gleazy-1-gm-13-gm50-gm-1571', false, '2026-08-09'
),
(
    'Glycovent Nebuliser Solution', 'Glycopyrronium Bromide', '25 mcg', 'Nebuliser Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glycovent-25-mcgml-1572', false, '2026-08-09'
),
(
    'Glympa Tablet', 'Empagliflozin + Linagliptin', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glympa-10-mg-5-mg-1573', false, '2026-08-09'
),
(
    'Glympa Tablet', 'Empagliflozin + Linagliptin', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glympa-25-mg-5-mg-1574', false, '2026-08-09'
),
(
    'Glysup 1 mg Suppository', 'Glycerine', '1 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glysup-1-mg-1575', false, '2026-08-09'
),
(
    'Glysup 1.15 mg Suppository', 'Glycerine', '1.15 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.30 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glysup-115-mg-1576', false, '2026-08-09'
),
(
    'Glysup 2 mg Suppository', 'Glycerine', '2 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glysup-2-mg-1577', false, '2026-08-09'
),
(
    'Glysup 2.30 mg Suppository', 'Glycerine', '2.30 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.60 | ৳ 5.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glysup-230-mg-1578', false, '2026-08-09'
),
(
    'Glysup 4 mg Suppository', 'Glycerine', '4 mg', 'Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/glysup-4-mg-1579', false, '2026-08-09'
),
(
    'GOL Oral Solution', 'Polyethylene Glycol 3350 + Electrolytes', '13.125 gm', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gol-13125-gm-3507-mg-1785-mg-466-mg25-ml-1580', false, '2026-08-09'
),
(
    'Grastim IV/SC Injection', 'Filgrastim', '300 mcg/0.5 ml', 'IV/SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,800.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/grastim-300-mcg05-ml-1581', false, '2026-08-09'
),
(
    'Gutfix 24 mcg Capsule', 'Lubiprostone', '24 mcg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 800.00 | ৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gutfix-24-mcg-1582', false, '2026-08-09'
),
(
    'Gutfix 8 mcg Capsule', 'Lubiprostone', '8 mcg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gutfix-8-mcg-1583', false, '2026-08-09'
),
(
    'Gynepro Vaginal Suppository', 'Metronidazole + Neomycin Sulphate + Polymyxin B + Nystatin', NULL, 'Vaginal Suppository', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/gynepro-1584', false, '2026-08-09'
),
(
    'Halobet Cream', 'Halobetasol Propionate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/halobet-005-1-1586', false, '2026-08-09'
),
(
    'Halobet Ointment', 'Halobetasol Propionate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/halobet-005-1585', false, '2026-08-09'
),
(
    'Hemorif Tablet', 'Diosmin + Hesperidin', '450 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 241.80 | ৳ 80.60 | ৳ 8.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/hemorif-450-mg-50-mg-1587', false, '2026-08-09'
),
(
    'Hemorif DS Tablet', 'Diosmin + Hesperidin', '900 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/hemorif-ds-900-mg-100-mg-1588', false, '2026-08-09'
),
(
    'Hemosol-A Dialysis Solution', 'Acidic component [HCO3 Hemodialysis Solution]', NULL, 'Dialysis Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 481.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/hemosol-a-1-1589', false, '2026-08-09'
),
(
    'Hemosol-B Dialysis Solution', 'Bicarbonate Component [HCO3 Hemodialysis Solution]', NULL, 'Dialysis Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 382.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/hemosol-b-1-1590', false, '2026-08-09'
),
(
    'Hepavir 100 mg Tablet', 'Lamivudine [For Chronic Hepatitis B]', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 503.40 | ৳ 125.85 | ৳ 25.17',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/hepavir-100-mg-1591', false, '2026-08-09'
),
(
    'Heplol 150 mg Tablet', 'L-Ornithine L-Aspartate', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/heplol-150-mg-1592', false, '2026-08-09'
),
(
    'Hyponor IV Infusion', 'Norepinephrine Tartrate', '2 mg/2 ml', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/hyponor-2-mg2-ml-1593', false, '2026-08-09'
),
(
    'Imaceva 100 mg Tablet', 'Imatinib Mesylate', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 3,000.00 | ৳ 1,000.00 | ৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/imaceva-100-mg-1595', false, '2026-08-09'
),
(
    'Imaceva 400 mg Tablet', 'Imatinib Mesylate', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 9,000.00 | ৳ 3,000.00 | ৳ 300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/imaceva-400-mg-1594', false, '2026-08-09'
),
(
    'Imotil 2 mg Capsule', 'Loperamide Hydrochloride', '2 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 10.00 | ৳ 1.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/imotil-2-mg-1596', false, '2026-08-09'
),
(
    'Imotil Plus Tablet', 'Loperamide + Simethicone', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/imotil-plus-2-mg-125-mg-1597', false, '2026-08-09'
),
(
    'Inflagic 20 mg Tablet', 'Prednisolone', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 313.50 | ৳ 62.70 | ৳ 6.27',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/inflagic-20-mg-1598', false, '2026-08-09'
),
(
    'Infudex IV Infusion', 'Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 78.20 | ৳ 105.80',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/infudex-10-1600', false, '2026-08-09'
),
(
    'Infudex IV Infusion', 'Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 71.30 | ৳ 92.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/infudex-5-1-1599', false, '2026-08-09'
),
(
    'Intimate 10 mg Tablet', 'Tadalafil', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 180.00 | ৳ 36.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/intimate-10-mg-1603', false, '2026-08-09'
),
(
    'Intimate 20 mg Tablet', 'Tadalafil', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.90 | ৳ 60.18',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/intimate-20-mg-1604', false, '2026-08-09'
),
(
    'Intimate 2.5 mg Tablet', 'Tadalafil', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 50.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/intimate-25-mg-1602', false, '2026-08-09'
),
(
    'Intimate 5 mg Tablet', 'Tadalafil', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.50 | ৳ 90.25 | ৳ 18.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/intimate-5-mg-1601', false, '2026-08-09'
),
(
    'Iprex Metered Dose Inhaler', 'Ipratropium Bromide', '20 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iprex-20-mcgpuff-1605', false, '2026-08-09'
),
(
    'Iprex Nebuliser Solution', 'Ipratropium Bromide', '250 mcg', 'Nebuliser Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.88',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iprex-250-mcgml-1606', false, '2026-08-09'
),
(
    'Iracet 250 mg Tablet', 'Levetiracetam', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 160.00 | ৳ 16.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iracet-250-mg-1607', false, '2026-08-09'
),
(
    'Iracet 500 mg Tablet', 'Levetiracetam', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iracet-500-mg-1608', false, '2026-08-09'
),
(
    'Iracet Oral Solution', 'Levetiracetam', '500 mg/5 ml', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.61',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iracet-500-mg5-ml-1610', false, '2026-08-09'
),
(
    'Iracet IV Injection', 'Levetiracetam', '500 mg/5 ml', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.78 | ৳ 40.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iracet-500-mg5-ml-2-1611', false, '2026-08-09'
),
(
    'Iracet XR 500 mg Extended Release Tablet', 'Levetiracetam', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 180.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iracet-xr-500-mg-1609', false, '2026-08-09'
),
(
    'Isodex IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 91.34',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/isodex-018-43-1-1952', false, '2026-08-09'
),
(
    'Isodex IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 91.34',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/isodex-018-43-1612', false, '2026-08-09'
),
(
    'Isotrin 10 mg Capsule', 'Isotretinoin', '10 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/isotrin-10-mg-12225', false, '2026-08-09'
),
(
    'Isotrin 20 mg Capsule', 'Isotretinoin', '20 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/isotrin-20-mg-1-1616', false, '2026-08-09'
),
(
    'Isovent 200 mcg Tablet', 'Misoprostol', '200 mcg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 453.00 | ৳ 151.00 | ৳ 15.10',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/isovent-200-mcg-1617', false, '2026-08-09'
),
(
    'Isovent 600 mcg Tablet', 'Misoprostol', '600 mcg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/isovent-600-mcg-1618', false, '2026-08-09'
),
(
    'Ispergul Effervescent Powder', 'Ispaghula Husk [Psyllium]', '3.5 gm/5.4 gm', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ispergul-35-gm54-gm-1-1619', false, '2026-08-09'
),
(
    'Ispergul Effervescent Powder', 'Ispaghula Husk [Psyllium]', '3.5 gm', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 225.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ispergul-35-gmsachet-1-1620', false, '2026-08-09'
),
(
    'Itra 100 mg Capsule', 'Itraconazole', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 362.40 | ৳ 90.60 | ৳ 15.10',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/itra-100-mg-1622', false, '2026-08-09'
),
(
    'Itra 200 mg Tablet', 'Itraconazole', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 504.00 | ৳ 168.00 | ৳ 28.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/itra-200-mg-1623', false, '2026-08-09'
),
(
    'Itra Oral Solution', 'Itraconazole', '50 mg/5 ml', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 580.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/itra-50-mg5-ml-1621', false, '2026-08-09'
),
(
    'Ivanor 5 mg Tablet', 'Ivabradine', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 501.60 | ৳ 250.80 | ৳ 25.08',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ivanor-5-mg-1624', false, '2026-08-09'
),
(
    'Ivanor 7.5 mg Tablet', 'Ivabradine', '7.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 351.10 | ৳ 35.11',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ivanor-75-mg-1625', false, '2026-08-09'
),
(
    'Iventi Eye Drop (Ophthalmic Solution)', 'Moxifloxacin Hydrochloride', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iventi-05-1627', false, '2026-08-09'
),
(
    'Iventi 400 mg Tablet', 'Moxifloxacin Hydrochloride', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 300.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iventi-400-mg-1626', false, '2026-08-09'
),
(
    'Iventi IV Infusion', 'Moxifloxacin Hydrochloride', '400 mg/250 ml', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iventi-400-mg250-ml-1628', false, '2026-08-09'
),
(
    'Iventi-D Eye Drop (Ophthalmic Solution)', 'Moxifloxacin Hydrochloride + Dexamethasone', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/iventi-d-05-01-1629', false, '2026-08-09'
),
(
    'Jorvan 500 mg Capsule', 'Jogaraj Guggulu', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/jorvan-500-mg-1630', false, '2026-08-09'
),
(
    'K-One MM Injection', 'Phytomenadione', '2 mg/0.2 ml', 'Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 119.64 | ৳ 19.94',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/k-one-mm-2-mg02-ml-1631', false, '2026-08-09'
),
(
    'Ketoral 200 mg Tablet', 'Ketoconazole', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 362.40 | ৳ 90.60 | ৳ 9.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ketoral-200-mg-1632', false, '2026-08-09'
),
(
    'Kitex 25 mg Tablet', 'Dexketoprofen', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.50 | ৳ 40.30 | ৳ 4.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/kitex-25-mg-1633', false, '2026-08-09'
),
(
    'Kop SR 100 mg Sustained Release Capsule', 'Ketoprofen', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 551.50 | ৳ 110.30 | ৳ 11.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/kop-sr-100-mg-1634', false, '2026-08-09'
),
(
    'Lactoring IV Infusion', 'Hartmann''s Solution', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 91.99',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lactoring-1635', false, '2026-08-09'
),
(
    'Lamicet 50 mg Tablet', 'Lamotrigine', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lamicet-50-mg-1636', false, '2026-08-09'
),
(
    'Lanso 30 mg Enteric Coated Capsule', 'Lansoprazole', '30 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 181.20 | ৳ 36.24 | ৳ 6.04',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lanso-30-mg-1-1637', false, '2026-08-09'
),
(
    'Lanso D 30 mg Enteric Coated Capsule', 'Dexlansoprazole', '30 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lanso-d-30-mg-1-1638', false, '2026-08-09'
),
(
    'Lanso D 60 mg Enteric Coated Capsule', 'Dexlansoprazole', '60 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 180.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lanso-d-60-mg-1-1639', false, '2026-08-09'
),
(
    'Larsulin SC Injection', 'Insulin glargine', '100 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/larsulin-100-iuml-1640', false, '2026-08-09'
),
(
    'Laxyl 3 mg Tablet', 'Bromazepam', '3 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/laxyl-3-mg-1641', false, '2026-08-09'
),
(
    'Lebac Paediatric Drops', 'Cephradine', '125 mg/1.25 ml', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 65.19',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lebac-125-mg125-ml-1645', false, '2026-08-09'
),
(
    'Lebac Powder For Suspension', 'Cephradine', '125 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 95.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lebac-125-mg5-ml-1646', false, '2026-08-09'
),
(
    'Lebac 250 mg Capsule', 'Cephradine', '250 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 144.54 | ৳ 48.18 | ৳ 8.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lebac-250-mg-1642', false, '2026-08-09'
),
(
    'Lebac 500 mg Capsule', 'Cephradine', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 451.50 | ৳ 90.30 | ৳ 15.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lebac-500-mg-1643', false, '2026-08-09'
),
(
    'Lebac IV/IM Injection', 'Cephradine', '500 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 65.19',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lebac-500-mgvial-1644', false, '2026-08-09'
),
(
    'Lebac Forte Powder For Suspension', 'Cephradine', '250 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 140.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lebac-forte-250-mg5-ml-1647', false, '2026-08-09'
),
(
    'Lecor 0 mg Syrup', 'Patrangasav', '0 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 140.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lecor-0-mg-1648', false, '2026-08-09'
),
(
    'Lerozol 2.5 mg Tablet', 'Letrozole', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 402.35 | ৳ 201.18 | ৳ 40.24',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lerozol-25-mg-1649', false, '2026-08-09'
),
(
    'Levocar 330 mg Tablet', 'Levocarnitine', '330 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.90 | ৳ 30.18 | ৳ 5.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/levocar-330-mg-1650', false, '2026-08-09'
),
(
    'Levostar 1 mg Tablet', 'Levosalbutamol', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00 | ৳ 10.00 | ৳ 1.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/levostar-1-mg-1651', false, '2026-08-09'
),
(
    'Levostar Syrup', 'Levosalbutamol', '1 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 30.10 | ৳ 45.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/levostar-1-mg5-ml-1653', false, '2026-08-09'
),
(
    'Levostar 2 mg Tablet', 'Levosalbutamol', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00 | ৳ 20.00 | ৳ 2.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/levostar-2-mg-1652', false, '2026-08-09'
),
(
    'Lido Topical Spray', 'Lidocaine Hydrochloride', '10 mg', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.90',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lido-10-mgspray-1654', false, '2026-08-09'
),
(
    'Liglimet Tablet', 'Linagliptin + Metformin Hydrochloride', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 390.00 | ৳ 78.00 | ৳ 13.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/liglimet-25-mg-500-mg-1655', false, '2026-08-09'
),
(
    'Liglimet Tablet', 'Linagliptin + Metformin Hydrochloride', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/liglimet-25-mg-850-mg-1656', false, '2026-08-09'
),
(
    'Liglimet XR Extended Release Tablet', 'Linagliptin + Metformin Hydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 40.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/liglimet-xr-5-mg-1000-mg-1657', false, '2026-08-09'
),
(
    'Linita 5 mg Tablet', 'Linagliptin', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 180.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/linita-5-mg-1658', false, '2026-08-09'
),
(
    'Lipired 200 mg Capsule', 'Fenofibrate', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 211.20 | ৳ 70.40 | ৳ 7.04',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lipired-200-mg-1659', false, '2026-08-09'
),
(
    'Livacol 10 mg Tablet', 'Obeticholic Acid', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 550.00 | ৳ 55.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/livacol-10-mg-1661', false, '2026-08-09'
),
(
    'Livacol 5 mg Tablet', 'Obeticholic Acid', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/livacol-5-mg-1660', false, '2026-08-09'
),
(
    'Livolite 200 mg Capsule', 'Andrographis paniculata', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/livolite-200-mg-1662', false, '2026-08-09'
),
(
    'Livwel Syrup', 'Multivitamin & Multimineral [A-Z syrup preparation]', NULL, 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.61 | ৳ 161.08',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/livwel-1663', false, '2026-08-09'
),
(
    'LNC 10 mg Tablet', 'Cilnidipine', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lnc-10-mg-1665', false, '2026-08-09'
),
(
    'LNC 5 mg Tablet', 'Cilnidipine', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lnc-5-mg-1664', false, '2026-08-09'
),
(
    'Locular Eye Drop (Ophthalmic Solution)', 'Brimonidine Tartrate', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.55',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/locular-02-1666', false, '2026-08-09'
),
(
    'Locular Plus Eye Drop (Ophthalmic Solution)', 'Brimonidine Tartrate + Timolol Maleate', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 110.33',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/locular-plus-02-05-1667', false, '2026-08-09'
),
(
    'Lofos 667 mg Tablet', 'Calcium Acetate', '667 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lofos-667-mg-1668', false, '2026-08-09'
),
(
    'Loracef Paediatric Drops', 'Cefaclor Monohydrate', '125 mg/1.25 ml', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 135.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/loracef-125-mg125-ml-1670', false, '2026-08-09'
),
(
    'Loracef Powder For Suspension', 'Cefaclor Monohydrate', '125 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/loracef-125-mg5-ml-1-1669', false, '2026-08-09'
),
(
    'Loratin 10 mg Tablet', 'Loratadine', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 301.00 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/loratin-10-mg-1671', false, '2026-08-09'
),
(
    'Loratin Fast 10 mg Dispersible Tablet', 'Loratadine', '10 mg', 'Dispersible Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/loratin-fast-10-mg-1672', false, '2026-08-09'
),
(
    'Lorno 4 mg Tablet', 'Lornoxicam', '4 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lorno-4-mg-1673', false, '2026-08-09'
),
(
    'Lorno 8 mg Tablet', 'Lornoxicam', '8 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lorno-8-mg-1674', false, '2026-08-09'
),
(
    'Lubgel Eye Drop (Ophthalmic Solution)', 'Carboxymethylcellulose Sodium', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lubgel-1-1-1675', false, '2026-08-09'
),
(
    'Lubtear Eye Drop (Ophthalmic Solution)', 'Dextran + Hypromellose', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 95.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lubtear-01-03-1676', false, '2026-08-09'
),
(
    'Lulitop Cream', 'Luliconazole', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00 | ৳ 180.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lulitop-1-1677', false, '2026-08-09'
),
(
    'Lumertam Tablet', 'Artemether + Lumefantrine', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 483.12 | ৳ 120.78 | ৳ 20.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lumertam-20-mg-120-mg-1678', false, '2026-08-09'
),
(
    'Luraprex 20 mg Tablet', 'Lurasidone Hydrochloride', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/luraprex-20-mg-1680', false, '2026-08-09'
),
(
    'Luraprex 40 mg Tablet', 'Lurasidone Hydrochloride', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 210.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/luraprex-40-mg-1679', false, '2026-08-09'
),
(
    'Lysivin Tablet', 'Multivitamin + L-Lysine', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/lysivin-1681', false, '2026-08-09'
),
(
    'Maganta Plus Chewable Tablet', 'Magaldrate + Simethicone', '480 mg', 'Chewable Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 301.00 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maganta-plus-480-mg-20-mg-1682', false, '2026-08-09'
),
(
    'Maganta Plus Oral Suspension', 'Magaldrate + Simethicone', '480 mg', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 110.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maganta-plus-480-mg-20-mg5-ml-1683', false, '2026-08-09'
),
(
    'Magnide 365 mg Tablet', 'Magnesium Oxide', '365 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/magnide-365-mg-1684', false, '2026-08-09'
),
(
    'Maxbon 150 mg Tablet', 'Ibandronic Acid', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 510.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maxbon-150-mg-1-12224', false, '2026-08-09'
),
(
    'Maxbon Kit Tablet', 'Ibandronic Acid & Calcium Orotate', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 990.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maxbon-kit-150-mg-400-mg-12223', false, '2026-08-09'
),
(
    'Maxcef IV/IM Injection', 'Cefotaxime', '250 mg/5 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maxcef-250-mg5-ml-1687', false, '2026-08-09'
),
(
    'Maximilk 0 mg Capsule', 'Fennel, Fenugreek, Cumin, Aniseed, Cumin & Dill Powder', '0 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 90.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maximilk-0-mg-1688', false, '2026-08-09'
),
(
    'Maxpime IV/IM Injection', 'Cefepime Hydrochloride', '1 gm', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 551.65',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maxpime-1-gmvial-1689', false, '2026-08-09'
),
(
    'Maxrin 0.4 mg Capsule', 'Tamsulosin Hydrochloride', '0.4 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maxrin-04-mg-1690', false, '2026-08-09'
),
(
    'Maxrin D Capsule', 'Tamsulosin Hydrochloride + Dutasteride', '0.4 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/maxrin-d-04-mg-05-mg-1691', false, '2026-08-09'
),
(
    'Meget 160 mg Tablet', 'Megestrol Acetate', '160 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,400.00 | ৳ 480.00 | ৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/meget-160-mg-1692', false, '2026-08-09'
),
(
    'Melano Cream', 'Fluocinolone Acetonide + Hydroquinone + Tretinoin', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/melano-001-4-005-1693', false, '2026-08-09'
),
(
    'Melcam 15 mg Tablet', 'Meloxicam', '15 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.30 | ৳ 40.26 | ৳ 4.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/melcam-15-mg-1694', false, '2026-08-09'
),
(
    'Melixol Tablet', 'Flupentixol + Melitracen', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 251.00 | ৳ 50.20 | ৳ 5.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/melixol-05-mg-10-mg-1695', false, '2026-08-09'
),
(
    'Menoral 5 mg Tablet', 'Norethisterone Acetate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 390.00 | ৳ 65.00 | ৳ 6.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/menoral-5-mg-1696', false, '2026-08-09'
),
(
    'Merison 6 mg Tablet', 'Betahistine Mesylate', '6 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.00 | ৳ 20.10 | ৳ 2.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/merison-6-mg-1697', false, '2026-08-09'
),
(
    'Metaspray Nasal Spray', 'Mometasone Furoate', '50 mcg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 251.70',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/metaspray-50-mcgspray-1698', false, '2026-08-09'
),
(
    'Methicol 500 mcg Tablet', 'Mecobalamin', '500 mcg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 241.80 | ৳ 40.30 | ৳ 4.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/methicol-500-mcg-1699', false, '2026-08-09'
),
(
    'Methigic 16 mg Tablet', 'Methylprednisolone', '16 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 410.00 | ৳ 205.00 | ৳ 20.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/methigic-16-mg-1703', false, '2026-08-09'
),
(
    'Methigic 2 mg Tablet', 'Methylprednisolone', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 30.00 | ৳ 3.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/methigic-2-mg-1700', false, '2026-08-09'
),
(
    'Methigic 4 mg Tablet', 'Methylprednisolone', '4 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/methigic-4-mg-1701', false, '2026-08-09'
),
(
    'Methigic 8 mg Tablet', 'Methylprednisolone', '8 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 315.00 | ৳ 105.00 | ৳ 10.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/methigic-8-mg-1702', false, '2026-08-09'
),
(
    'Methomol 500 mg Tablet', 'Methocarbamol', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/methomol-500-mg-1704', false, '2026-08-09'
),
(
    'Methomol 750 mg Tablet', 'Methocarbamol', '750 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 390.00 | ৳ 130.00 | ৳ 13.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/methomol-750-mg-1705', false, '2026-08-09'
),
(
    'Mevin 135 mg Tablet', 'Mebeverine Hydrochloride', '135 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mevin-135-mg-1706', false, '2026-08-09'
),
(
    'Mevin SR 200 mg Sustained Release Capsule', 'Mebeverine Hydrochloride', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.90 | ৳ 100.30 | ৳ 10.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mevin-sr-200-mg-1707', false, '2026-08-09'
),
(
    'Mexlo Eye Drop (Ophthalmic Solution)', 'Lomefloxacin', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.21',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mexlo-03-1708', false, '2026-08-09'
),
(
    'Miclofenac Tablet', 'Diclofenac Sodium + Misoprostol', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.16 | ৳ 100.72 | ৳ 10.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/miclofenac-50-mg-200-mcg-1709', false, '2026-08-09'
),
(
    'Miclofenac Tablet', 'Diclofenac Sodium + Misoprostol', '75 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 332.18 | ৳ 110.73 | ৳ 11.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/miclofenac-75-mg-200-mcg-1710', false, '2026-08-09'
),
(
    'Migranil 0.5 mg Tablet', 'Pizotifen', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.50 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/migranil-05-mg-1711', false, '2026-08-09'
),
(
    'Migranil 1.5 mg Tablet', 'Pizotifen', '1.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 211.20 | ৳ 70.40 | ৳ 7.04',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/migranil-15-mg-1712', false, '2026-08-09'
),
(
    'Minibet 100 mg Tablet', 'Ciprofibrate', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/minibet-100-mg-1713', false, '2026-08-09'
),
(
    'Mirader 25 mg Extended Release Tablet', 'Mirabegron', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mirader-25-mg-1714', false, '2026-08-09'
),
(
    'Mirakof Paediatric Drops', 'Butamirate Citrate', '5 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mirakof-5-mgml-1-1716', false, '2026-08-09'
),
(
    'Mirakof Syrup', 'Butamirate Citrate', '7.5 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.24',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mirakof-75-mg5-ml-1715', false, '2026-08-09'
),
(
    'Mirakof SR 50 mg Sustained Release Tablet', 'Butamirate Citrate', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.10 | ৳ 100.70 | ৳ 10.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mirakof-sr-50-mg-1717', false, '2026-08-09'
),
(
    'Mirapro 15 mg Tablet', 'Mirtazapine', '15 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00 | ৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mirapro-15-mg-1719', false, '2026-08-09'
),
(
    'Mirapro 7.5 mg Tablet', 'Mirtazapine', '7.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mirapro-75-mg-1718', false, '2026-08-09'
),
(
    'Molvir 200 mg Capsule', 'Molnupiravir', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/molvir-200-mg-1720', false, '2026-08-09'
),
(
    'Monera 0 mg Syrup', 'Bacopa extract [Natural memory enhancer]', '0 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/monera-0-mg-1721', false, '2026-08-09'
),
(
    'Montene 10 mg Tablet', 'Montelukast Sodium', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 525.00 | ৳ 175.00 | ৳ 17.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/montene-10-mg-1724', false, '2026-08-09'
),
(
    'Montene 4 mg Dispersible Tablet', 'Montelukast Sodium', '4 mg', 'Dispersible Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 140.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/montene-4-mg-1722', false, '2026-08-09'
),
(
    'Montene 5 mg Dispersible Tablet', 'Montelukast Sodium', '5 mg', 'Dispersible Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/montene-5-mg-1723', false, '2026-08-09'
),
(
    'Motigut 10 mg Tablet', 'Domperidone Maleate', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/motigut-10-mg-1725', false, '2026-08-09'
),
(
    'Motigut Oral Suspension', 'Domperidone Maleate', '5 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/motigut-5-mg5-ml-1726', false, '2026-08-09'
),
(
    'Motigut Paediatric Drops', 'Domperidone Maleate', '5 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 25.08',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/motigut-5-mgml-1727', false, '2026-08-09'
),
(
    'Moxacil Paediatric Drops', 'Amoxicillin Trihydrate', '125 mg/1.25 ml', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxacil-125-mg125-ml-1-1731', false, '2026-08-09'
),
(
    'Moxacil Powder For Suspension', 'Amoxicillin Trihydrate', '125 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxacil-125-mg5-ml-1730', false, '2026-08-09'
),
(
    'Moxacil 250 mg Capsule', 'Amoxicillin Trihydrate', '250 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxacil-250-mg-1728', false, '2026-08-09'
),
(
    'Moxacil 500 mg Capsule', 'Amoxicillin Trihydrate', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 75.00 | ৳ 7.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxacil-500-mg-1729', false, '2026-08-09'
),
(
    'Moxaclav IV Injection', 'Amoxicillin + Clavulanic Acid', '1 gm', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxaclav-1-gm-200-mg20-ml-1735', false, '2026-08-09'
),
(
    'Moxaclav Powder For Suspension', 'Amoxicillin + Clavulanic Acid', '125 mg', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 220.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxaclav-125-mg-3125-mg5-ml-1736', false, '2026-08-09'
),
(
    'Moxaclav Tablet', 'Amoxicillin + Clavulanic Acid', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxaclav-250-mg-125-mg-1734', false, '2026-08-09'
),
(
    'Moxaclav Tablet', 'Amoxicillin + Clavulanic Acid', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 960.00 | ৳ 192.00 | ৳ 32.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxaclav-500-mg-125-mg-1733', false, '2026-08-09'
),
(
    'Moxaclav Tablet', 'Amoxicillin + Clavulanic Acid', '875 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 270.00 | ৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxaclav-875-mg-125-mg-1732', false, '2026-08-09'
),
(
    'Moxaclav Forte Powder For Suspension', 'Amoxicillin + Clavulanic Acid', '400 mg', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 230.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/moxaclav-forte-400-mg-5750-mg5-ml-1737', false, '2026-08-09'
),
(
    'Mucospel Syrup', 'Bromhexine Hydrochloride', '4 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/mucospel-4-mg5-ml-1738', false, '2026-08-09'
),
(
    'Multivit Plus Tablet', 'Multivitamin & Multimineral', NULL, 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/multivit-plus-1739', false, '2026-08-09'
),
(
    'Myonil 50 mg Tablet', 'Eperisone Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.50 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/myonil-50-mg-1740', false, '2026-08-09'
),
(
    'Nafodil 100 mg Capsule', 'Naftidrofuryl Oxalate', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nafodil-100-mg-1741', false, '2026-08-09'
),
(
    'Nalid Oral Suspension', 'Nalidixic Acid', '300 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 41.75',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nalid-300-mg5-ml-1742', false, '2026-08-09'
),
(
    'Nasovap Suspension for Inhalation', 'Menthol + Eucalyptus Oil', NULL, 'Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nasovap-2-10-1-1743', false, '2026-08-09'
),
(
    'Naurif 1 mg Tablet', 'Granisetron', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 563.80 | ৳ 281.90 | ৳ 28.19',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/naurif-1-mg-1744', false, '2026-08-09'
),
(
    'Naurif Injection', 'Granisetron', '1 mg', 'Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 241.65 | ৳ 48.33',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/naurif-1-mgml-1745', false, '2026-08-09'
),
(
    'Navit 500 mg Capsule', 'Spirulina', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/navit-500-mg-1746', false, '2026-08-09'
),
(
    'Nebanol Topical Powder', 'Neomycin Sulfate + Bacitracin Zinc', '5 mg', NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nebanol-5-mg-250-iugm-1748', false, '2026-08-09'
),
(
    'Nebanol Ointment', 'Neomycin Sulfate + Bacitracin Zinc', '5 mg', 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 44.20',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nebanol-5-mg-500-iugm-1747', false, '2026-08-09'
),
(
    'Nebanol Plus Ointment', 'Neomycin Sulfate + Bacitracin Zinc + Polymyxin B Sulfate', '3.5 mg', 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 30.20',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nebanol-plus-35-mg-400-iu-5000-iugm-1749', false, '2026-08-09'
),
(
    'Nebita 2.5 mg Tablet', 'Nebivolol Hydrochloride', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 351.00 | ৳ 70.20 | ৳ 7.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nebita-25-mg-1750', false, '2026-08-09'
),
(
    'Nebita 5 mg Tablet', 'Nebivolol Hydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nebita-5-mg-1751', false, '2026-08-09'
),
(
    'Nebivolol + Hydrochlorothiazide Tablet', 'Nebivolol + Hydrochlorothiazide', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nebivolol-hydrochlorothiazide-5-mg-125-mg-1752', false, '2026-08-09'
),
(
    'Nectar Syrup', 'Glycerol + Liquid Sugar', '0.75 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.27',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nectar-075-ml-193-ml5-ml-1753', false, '2026-08-09'
),
(
    'Neumig 10 mg Tablet', 'Mirogabalin Besylate', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neumig-10-mg-1756', false, '2026-08-09'
),
(
    'Neumig 2.5 mg Tablet', 'Mirogabalin Besylate', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neumig-25-mg-1754', false, '2026-08-09'
),
(
    'Neumig 5 mg Tablet', 'Mirogabalin Besylate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neumig-5-mg-1755', false, '2026-08-09'
),
(
    'Neuro-B IM Injection', 'Vitamin B1, B6 & B12', '100 mg', 'IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neuro-b-100-mg-100-mg-1-mg3-ml-1-1758', false, '2026-08-09'
),
(
    'Neuro-B Tablet', 'Vitamin B1, B6 & B12', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 600.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neuro-b-100-mg-200-mg-200-mcg-1-1757', false, '2026-08-09'
),
(
    'Neurolep Syrup', 'Piracetam', '500 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neurolep-500-mg5-ml-1760', false, '2026-08-09'
),
(
    'Neurolep 800 mg Tablet', 'Piracetam', '800 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.00 | ৳ 60.40 | ৳ 6.04',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neurolep-800-mg-1759', false, '2026-08-09'
),
(
    'Neurolin 25 mg Capsule', 'Pregabalin', '25 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neurolin-25-mg-1761', false, '2026-08-09'
),
(
    'Neurolin 50 mg Capsule', 'Pregabalin', '50 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neurolin-50-mg-1762', false, '2026-08-09'
),
(
    'Neurolin 75 mg Capsule', 'Pregabalin', '75 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 570.00 | ৳ 190.00 | ৳ 19.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neurolin-75-mg-1763', false, '2026-08-09'
),
(
    'Neurolin CR 165 mg Controlled Release Tablet', 'Pregabalin', '165 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 210.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neurolin-cr-165-mg-1765', false, '2026-08-09'
),
(
    'Neurolin CR 82.5 mg Controlled Release Tablet', 'Pregabalin', '82.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/neurolin-cr-825-mg-1764', false, '2026-08-09'
),
(
    'Newbain IV/IM Injection', 'Nalbuphine', '20 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 472.72 | ৳ 118.18',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/newbain-20-mg2-ml-1766', false, '2026-08-09'
),
(
    'Nexum 20 mg Capsule', 'Esomeprazole', '20 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 421.20 | ৳ 70.20 | ৳ 7.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nexum-20-mg-1767', false, '2026-08-09'
),
(
    'Nexum 40 mg Capsule', 'Esomeprazole', '40 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.90 | ৳ 100.30 | ৳ 10.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nexum-40-mg-1768', false, '2026-08-09'
),
(
    'Nexum IV Injection', 'Esomeprazole', '40 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 110.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nexum-40-mgvial-1769', false, '2026-08-09'
),
(
    'Nexum MUPS 20 mg Mups Tablet', 'Esomeprazole', '20 mg', 'Mups Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nexum-mups-20-mg-1770', false, '2026-08-09'
),
(
    'Nexum MUPS 40 mg Mups Tablet', 'Esomeprazole', '40 mg', 'Mups Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 420.00 | ৳ 84.00 | ৳ 14.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nexum-mups-40-mg-1771', false, '2026-08-09'
),
(
    'Nidipine SR 20 mg Sustained Release Tablet', 'Nifedipine', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 64.00 | ৳ 6.40 | ৳ 0.64',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nidipine-sr-20-mg-1772', false, '2026-08-09'
),
(
    'Nilagel 500 mg Capsule', 'Nigella Sativa [Black Seed Oil]', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 325.00 | ৳ 108.33 | ৳ 10.83',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nilagel-500-mg-1773', false, '2026-08-09'
),
(
    'Nimocal 30 mg Tablet', 'Nimodipine', '30 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nimocal-30-mg-1774', false, '2026-08-09'
),
(
    'Nomi 2.5 mg Tablet', 'Zolmitriptan', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.04 | ৳ 151.02 | ৳ 25.17',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nomi-25-mg-1775', false, '2026-08-09'
),
(
    'Nomi Nasal Spray', 'Zolmitriptan', '2.5 mg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/nomi-25-mgspray-1-1776', false, '2026-08-09'
),
(
    'Normo-K Oral Powder', 'Sodium Polystyrene Sulfonate', '15 gm', 'Oral Powder', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,450.00 | ৳ 145.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/normo-k-15-gmsachet-1777', false, '2026-08-09'
),
(
    'Norpill 1 1.5 mg Tablet', 'Levonorgestrel [Emergency contraceptive pill]', '1.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/norpill-1-15-mg-1778', false, '2026-08-09'
),
(
    'Norvis Syrup', 'Tiemonium Methylsulphate', '10 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 55.00 | ৳ 90.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/norvis-10-mg5-ml-1780', false, '2026-08-09'
),
(
    'Norvis IV/IM Injection', 'Tiemonium Methylsulphate', '5 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/norvis-5-mg2-ml-1781', false, '2026-08-09'
),
(
    'Norvis 50 mg Tablet', 'Tiemonium Methylsulphate', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 425.00 | ৳ 85.00 | ৳ 8.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/norvis-50-mg-1779', false, '2026-08-09'
),
(
    'Ocof Syrup', 'Dextromethorphan + Phenylephrine + Triprolidine', '20 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 110.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ocof-20-mg-10-mg-25-mg5-ml-1782', false, '2026-08-09'
),
(
    'Ocubil 160 mg Capsule', 'Bilberry fruit [Vaccinium myrtillus L]', '160 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ocubil-160-mg-1783', false, '2026-08-09'
),
(
    'Ocubrom Eye Drop (Ophthalmic Solution)', 'Bromfenac Sodium', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ocubrom-007-1784', false, '2026-08-09'
),
(
    'Oculant Eye Drop (Ophthalmic Solution)', 'Polyethylene Glycol + Propylene Glycol', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.45',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oculant-04-03-1785', false, '2026-08-09'
),
(
    'Ofkof Syrup', 'Dextromethorphan + Pseudoephedrine + Triprolidine', '10 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ofkof-10-mg-30-mg-125-mg5-ml-1786', false, '2026-08-09'
),
(
    'Ofran Oral Solution', 'Ondansetron', '4 mg/5 ml', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ofran-4-mg5-ml-1788', false, '2026-08-09'
),
(
    'Ofran 8 mg Tablet', 'Ondansetron', '8 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 330.00 | ৳ 110.00 | ৳ 11.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ofran-8-mg-1787', false, '2026-08-09'
),
(
    'Ofran IV/IM Injection', 'Ondansetron', '8 mg/4 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 192.00 | ৳ 32.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ofran-8-mg4-ml-1789', false, '2026-08-09'
),
(
    'Olistat 120 mg Capsule', 'Orlistat', '120 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,200.00 | ৳ 600.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/olistat-120-mg-1-1790', false, '2026-08-09'
),
(
    'Olistat 60 mg Capsule', 'Orlistat', '60 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/olistat-60-mg-1791', false, '2026-08-09'
),
(
    'Olmecar 10 mg Tablet', 'Olmesartan Medoxomil', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/olmecar-10-mg-1793', false, '2026-08-09'
),
(
    'Olmecar 20 mg Tablet', 'Olmesartan Medoxomil', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/olmecar-20-mg-1792', false, '2026-08-09'
),
(
    'Olmecar 40 mg Tablet', 'Olmesartan Medoxomil', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 180.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/olmecar-40-mg-1794', false, '2026-08-09'
),
(
    'Olmecar Plus Tablet', 'Olmesartan Medoxomil + Hydrochlorothiazide', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/olmecar-plus-20-mg-125-mg-1795', false, '2026-08-09'
),
(
    'Orili 150 mg Tablet', 'Elagolix Sodium', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,040.00 | ৳ 1,020.00 | ৳ 170.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/orili-150-mg-1797', false, '2026-08-09'
),
(
    'Orili 200 mg Tablet', 'Elagolix Sodium', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,820.00 | ৳ 1,410.00 | ৳ 235.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/orili-200-mg-1-1796', false, '2026-08-09'
),
(
    'Orostar Cool Mint Mouth Wash', 'Menthol + Thymol + Eucalyptol + Methyl Salicylate', NULL, 'Mouth Wash', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.24',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/orostar-cool-mint-1798', false, '2026-08-09'
),
(
    'Orostar Original Mouth Wash', 'Menthol + Thymol + Eucalyptol + Methyl Salicylate', NULL, 'Mouth Wash', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.24',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/orostar-original-1799', false, '2026-08-09'
),
(
    'Orostar Plus Mouth Wash', 'Eucalyptol + Menthol + Methyl Salicylate + Thymol + Sodium Fluoride', NULL, 'Mouth Wash', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 85.26 | ৳ 150.45',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/orostar-plus-0-1800', false, '2026-08-09'
),
(
    'Osmolax Oral Solution', 'Lactulose', '3.35 gm/5 ml', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.00 | ৳ 280.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/osmolax-335-gm5-ml-1801', false, '2026-08-09'
),
(
    'Ostel-D Tablet', 'Alendronic Acid + Vitamin D3', '70 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.60 | ৳ 30.08',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ostel-d-70-mg-2800-iu-1802', false, '2026-08-09'
),
(
    'Otelast 10 mg Tablet', 'Apremilast', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/otelast-10-mg-1803', false, '2026-08-09'
),
(
    'Otelast 30 mg Tablet', 'Apremilast', '30 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,200.00 | ৳ 600.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/otelast-30-mg-1804', false, '2026-08-09'
),
(
    'Otic-4 Ear Drop', 'Ofloxacin + Clotrimazole + Beclomethasone + Lidocaine', NULL, 'Ear Drop', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/otic-4-03-1-0025-2-1805', false, '2026-08-09'
),
(
    'Oxapro 10 mg Tablet', 'Escitalopram Oxalate', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oxapro-10-mg-1807', false, '2026-08-09'
),
(
    'Oxapro 5 mg Tablet', 'Escitalopram Oxalate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 210.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oxapro-5-mg-1806', false, '2026-08-09'
),
(
    'Oxat 10 mg Tablet', 'Paroxetine Hydrochloride', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oxat-10-mg-1809', false, '2026-08-09'
),
(
    'Oxat 20 mg Tablet', 'Paroxetine Hydrochloride', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 481.20 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oxat-20-mg-1808', false, '2026-08-09'
),
(
    'Oxifun Cream', 'Oxiconazole Nitrate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.35',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oxifun-1-1810', false, '2026-08-09'
),
(
    'Oxifun Lotion', 'Oxiconazole Nitrate', NULL, 'Lotion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 135.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oxifun-1-2-1811', false, '2026-08-09'
),
(
    'Oxifyl CR 400 mg Controlled Release Tablet', 'Pentoxifylline', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 211.20 | ৳ 70.40 | ৳ 7.04',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/oxifyl-cr-400-mg-1812', false, '2026-08-09'
),
(
    'Paloset IV Injection', 'Palonosetron', '0.075 mg/1.5 ml', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 376.10 | ৳ 75.22',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/paloset-0075-mg15-ml-1813', false, '2026-08-09'
),
(
    'Paloset 0.5 mg Tablet', 'Palonosetron', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/paloset-05-mg-1814', false, '2026-08-09'
),
(
    'Panodin SR 600 mg Sustained Release Tablet', 'Etodolac', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 453.00 | ৳ 151.00 | ৳ 15.10',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/panodin-sr-600-mg-1815', false, '2026-08-09'
),
(
    'Penrif Cream', 'Methyl Salicylate + Menthol', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/penrif-30-8-1816', false, '2026-08-09'
),
(
    'Pentadol 100 mg Tablet', 'Tapentadol Hydrochloride', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pentadol-100-mg-1819', false, '2026-08-09'
),
(
    'Pentadol 50 mg Tablet', 'Tapentadol Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00 | ৳ 140.00 | ৳ 14.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pentadol-50-mg-1817', false, '2026-08-09'
),
(
    'Pentadol 75 mg Tablet', 'Tapentadol Hydrochloride', '75 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pentadol-75-mg-1818', false, '2026-08-09'
),
(
    'Penvik 250 mg Tablet', 'Phenoxymethyl Penicillin [Penicillin V]', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00 | ৳ 28.00 | ৳ 2.80',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/penvik-250-mg-1820', false, '2026-08-09'
),
(
    'Penvik DS 500 mg Tablet', 'Phenoxymethyl Penicillin [Penicillin V]', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 550.00 | ৳ 55.00 | ৳ 5.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/penvik-ds-500-mg-1821', false, '2026-08-09'
),
(
    'Penvik Forte Powder For Suspension', 'Phenoxymethyl Penicillin [Penicillin V]', '250 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 84.43',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/penvik-forte-250-mg5-ml-1822', false, '2026-08-09'
),
(
    'Pepnor Syrup', 'Jeerakaddarishta Carminative', NULL, 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00 | ৳ 190.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pepnor-0-1823', false, '2026-08-09'
),
(
    'Peranel 2 mg Tablet', 'Perampanel', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/peranel-2-mg-1824', false, '2026-08-09'
),
(
    'Peranel 4 mg Tablet', 'Perampanel', '4 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/peranel-4-mg-1825', false, '2026-08-09'
),
(
    'Perkidopa Tablet', 'Levodopa + Carbidopa', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 210.00 | ৳ 105.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/perkidopa-100-mg-10-mg-1827', false, '2026-08-09'
),
(
    'Perkidopa Tablet', 'Levodopa + Carbidopa', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/perkidopa-250-mg-25-mg-1826', false, '2026-08-09'
),
(
    'Perkinil IV/IM Injection', 'Procyclidine Hydrochloride', '10 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/perkinil-10-mg2-ml-1829', false, '2026-08-09'
),
(
    'Perkinil 5 mg Tablet', 'Procyclidine Hydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 25.00 | ৳ 1.25',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/perkinil-5-mg-1828', false, '2026-08-09'
),
(
    'Perkirol 0.25 mg Tablet', 'Ropinirole', '0.25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.50 | ৳ 20.10 | ৳ 2.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/perkirol-025-mg-1830', false, '2026-08-09'
),
(
    'Perkirol 2 mg Tablet', 'Ropinirole', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.20 | ৳ 60.07 | ৳ 6.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/perkirol-2-mg-1831', false, '2026-08-09'
),
(
    'Pevitin Cream', 'Econazole Nitrate + Triamcinolone Acetonide', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pevitin-1-01-1832', false, '2026-08-09'
),
(
    'Phylopen Powder For Suspension', 'Flucloxacillin Sodium', '125 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/phylopen-125-mg5-ml-1836', false, '2026-08-09'
),
(
    'Phylopen 250 mg Capsule', 'Flucloxacillin Sodium', '250 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 800.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/phylopen-250-mg-1833', false, '2026-08-09'
),
(
    'Phylopen IV/IM Injection', 'Flucloxacillin Sodium', '500 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00 | ৳ 54.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/phylopen-500-mgvial-1835', false, '2026-08-09'
),
(
    'Phylopen DS 500 mg Capsule', 'Flucloxacillin Sodium', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 588.00 | ৳ 84.00 | ৳ 14.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/phylopen-ds-500-mg-1834', false, '2026-08-09'
),
(
    'Phylopen Forte Powder For Suspension', 'Flucloxacillin Sodium', '250 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 125.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/phylopen-forte-250-mg5-ml-1837', false, '2026-08-09'
),
(
    'Plan A Vaginal Gel', 'Lactic acid + Citric acid + Potassium bitartrate', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/plan-a-18-1-04-1838', false, '2026-08-09'
),
(
    'PMB Injection', 'Polymyxin B Sulfate', NULL, 'Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pmb-500000-unit-1839', false, '2026-08-09'
),
(
    'Prazolok 1 mg Tablet', 'Prazosin Hydrochloride', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/prazolok-1-mg-1840', false, '2026-08-09'
),
(
    'Prazolok 2 mg Tablet', 'Prazosin Hydrochloride', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/prazolok-2-mg-1841', false, '2026-08-09'
),
(
    'Prazolok ER 2.5 mg Extended Release Tablet', 'Prazosin Hydrochloride', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/prazolok-er-25-mg-1842', false, '2026-08-09'
),
(
    'Prazolok ER 5 mg Extended Release Tablet', 'Prazosin Hydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/prazolok-er-5-mg-1843', false, '2026-08-09'
),
(
    'Probio Capsule', 'Probiotic Combination [4 Billion]', NULL, 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/probio-4-billion-1844', false, '2026-08-09'
),
(
    'Probio (For kids) Oral Powder', 'Probiotic Combination [4 Billion]', NULL, 'Oral Powder', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 375.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/probio-for-kids-4-billionsachet-1845', false, '2026-08-09'
),
(
    'Probio R Capsule', 'Probiotic Combination [20 Billion]', NULL, 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/probio-r-20-billion-1846', false, '2026-08-09'
),
(
    'Prolert 20 mg Capsule', 'Fluoxetine Hydrochloride', '20 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.50 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/prolert-20-mg-1-1847', false, '2026-08-09'
),
(
    'Prolert Oral Suspension', 'Fluoxetine Hydrochloride', '20 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/prolert-20-mg5-ml-1848', false, '2026-08-09'
),
(
    'Promtil 5 mg Tablet', 'Prochlorperazine Maleate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 195.00 | ৳ 13.00 | ৳ 0.65',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/promtil-5-mg-1849', false, '2026-08-09'
),
(
    'Pronor 5 mg Tablet', 'Finasteride [For B.P.H.]', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.10 | ৳ 100.70 | ৳ 10.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pronor-5-mg-1850', false, '2026-08-09'
),
(
    'Prosalic Scalp Lotion', 'Betamethasone Dipropionate + Salicylic Acid', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.45',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/prosalic-005-2-1851', false, '2026-08-09'
),
(
    'Proxivir 300 mg Tablet', 'Tenofovir Disoproxil', '300 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 960.00 | ৳ 480.00 | ৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/proxivir-300-mg-1852', false, '2026-08-09'
),
(
    'Purotrol 5 mg Tablet', 'Levocetirizine Dihydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 175.50 | ৳ 35.10 | ৳ 3.51',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/purotrol-5-mg-1853', false, '2026-08-09'
),
(
    'Pylotrip Tablet', 'Lansoprazole + Amoxicillin + Clarithromycin', '30 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 772.24 | ৳ 55.16',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pylotrip-30-mg-1000-mg-500-mg-1-12227', false, '2026-08-09'
),
(
    'Pylotrip R Tablet', 'Rabeprazole + Amoxicillin + Clarithromycin', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 770.00 | ৳ 55.00 | ৳ 13.75',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/pylotrip-r-20-mg-1000-mg-500-mg-1855', false, '2026-08-09'
),
(
    'QTP 100 mg Tablet', 'Quetiapine Fumarate', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/qtp-100-mg-1856', false, '2026-08-09'
),
(
    'QTP 25 mg Tablet', 'Quetiapine Fumarate', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.00 | ৳ 30.00 | ৳ 3.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/qtp-25-mg-1857', false, '2026-08-09'
),
(
    'QTP XR 200 mg Extended Release Tablet', 'Quetiapine Fumarate', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/qtp-xr-200-mg-1858', false, '2026-08-09'
),
(
    'Quinivir 200 mg Tablet', 'Hydroxychloroquine Sulphate', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/quinivir-200-mg-1859', false, '2026-08-09'
),
(
    'Rabeca 20 mg Enteric Coated Tablet', 'Rabeprazole Sodium', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rabeca-20-mg-1860', false, '2026-08-09'
),
(
    'Racedot 100 mg Capsule', 'Racecadotril', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 241.00 | ৳ 80.33 | ৳ 8.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/racedot-100-mg-1861', false, '2026-08-09'
),
(
    'Ranolin XR 500 mg Extended Release Tablet', 'Ranolazine', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 321.00 | ৳ 160.50 | ৳ 16.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ranolin-xr-500-mg-1862', false, '2026-08-09'
),
(
    'Rapiflo 4 mg Capsule', 'Silodosin', '4 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rapiflo-4-mg-1864', false, '2026-08-09'
),
(
    'Rapiflo 8 mg Capsule', 'Silodosin', '8 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rapiflo-8-mg-1863', false, '2026-08-09'
),
(
    'Rapilog SC Injection', 'Insulin Aspart', '100 IU', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 560.00 | ৳ 460.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rapilog-100-iuml-1-1865', false, '2026-08-09'
),
(
    'RapiMix SC Injection', 'Insulin Aspart + Insulin Aspart Protamine', NULL, 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,650.00 | ৳ 550.00 | ৳ 450.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rapimix-30-70-1-1866', false, '2026-08-09'
),
(
    'Rasalet 0.5 mg Tablet', 'Rasagiline', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rasalet-05-mg-1867', false, '2026-08-09'
),
(
    'Rasalet 1 mg Tablet', 'Rasagiline', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rasalet-1-mg-1868', false, '2026-08-09'
),
(
    'Rectocare Ointment', 'Nitroglycerin', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 65.45',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rectocare-04-1870', false, '2026-08-09'
),
(
    'Redclov 40 mg Capsule', 'Red Clover Isoflavones', '40 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/redclov-40-mg-1871', false, '2026-08-09'
),
(
    'Relatro 25 mg Capsule', 'Dantrolene Sodium', '25 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/relatro-25-mg-1872', false, '2026-08-09'
),
(
    'Reli Balm Cream', 'Menthol + Camphor + Eucalyptus Oil + Mint Oil', '80 mg', 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/reli-balm-80-mg-45-mg-180-mg-10-mg-1873', false, '2026-08-09'
),
(
    'Reluciba 120 mg Tablet', 'Relugolix', '120 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 7,500.00 | ৳ 2,500.00 | ৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/reluciba-120-mg-1874', false, '2026-08-09'
),
(
    'Remac Powder For Suspension', 'Clarithromycin', '125 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 395.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/remac-125-mg5-ml-1876', false, '2026-08-09'
),
(
    'Remac 500 mg Tablet', 'Clarithromycin', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00 | ৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/remac-500-mg-1875', false, '2026-08-09'
),
(
    'Remdinil IV Infusion', 'Remdesivir', '5 mg', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/remdinil-5-mgml-1877', false, '2026-08-09'
),
(
    'Remus Ointment', 'Tacrolimus Monohydrate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/remus-003-1878', false, '2026-08-09'
),
(
    'Remus Ointment', 'Tacrolimus Monohydrate', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 1,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/remus-01-1879', false, '2026-08-09'
),
(
    'Renacom Capsule', 'Cranberry + Saw Palmetto + Pygeum Bark + Tomato + Uva Ursi', '125 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/renacom-125-mg-125-mg-50-mg-75-mg-75-mg-1880', false, '2026-08-09'
),
(
    'Renorma 2.5 mg Tablet', 'Tibolone', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 603.90 | ৳ 201.30 | ৳ 20.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/renorma-25-mg-1881', false, '2026-08-09'
),
(
    'Renustat 50 mg Tablet', 'Roxadustat', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,050.00 | ৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/renustat-50-mg-1882', false, '2026-08-09'
),
(
    'Repres SR 1.5 mg Sustained Release Tablet', 'Indapamide', '1.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.90 | ৳ 50.30 | ৳ 5.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/repres-sr-15-mg-1883', false, '2026-08-09'
),
(
    'ResQ 100 mg Capsule', 'Coenzyme Q10 [Ubidecarenone]', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,200.00 | ৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/resq-100-mg-1885', false, '2026-08-09'
),
(
    'ResQ 200 mg Capsule', 'Coenzyme Q10 [Ubidecarenone]', '200 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,500.00 | ৳ 750.00 | ৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/resq-200-mg-1886', false, '2026-08-09'
),
(
    'ResQ 50 mg Capsule', 'Coenzyme Q10 [Ubidecarenone]', '50 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/resq-50-mg-1884', false, '2026-08-09'
),
(
    'Retabac Ointment', 'Retapamulin', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/retabac-1-1887', false, '2026-08-09'
),
(
    'Revatol Syrup', 'Mahadrakkharist [Grape extract]', NULL, 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revatol-1888', false, '2026-08-09'
),
(
    'Revira 1 gm Tablet', 'Valacyclovir', '1 gm', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 902.64 | ৳ 451.32 | ৳ 75.22',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revira-1-gm-1890', false, '2026-08-09'
),
(
    'Revira 500 mg Tablet', 'Valacyclovir', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 402.70 | ৳ 40.27',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revira-500-mg-1889', false, '2026-08-09'
),
(
    'Revocit 210 mg Tablet', 'Ferric Citrate', '210 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 150.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revocit-210-mg-1891', false, '2026-08-09'
),
(
    'Revofer IV Injection or Infusion', 'Ferric Carboxymaltose', '1 gm/20 ml', 'IV Injection or Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revofer-1-gm20-ml-1894', false, '2026-08-09'
),
(
    'Revofer IV Injection or Infusion', 'Ferric Carboxymaltose', '500 mg/10 ml', 'IV Injection or Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 700.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revofer-500-mg10-ml-1892', false, '2026-08-09'
),
(
    'Revofer IV Injection or Infusion', 'Ferric Carboxymaltose', '750 mg/15 ml', 'IV Injection or Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revofer-750-mg15-ml-1893', false, '2026-08-09'
),
(
    'Revolizer Metered Dose Inhaler', 'Inhaler device', NULL, 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 310.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/revolizer-12226', false, '2026-08-09'
),
(
    'Rex Tablet', 'Betacarotene + Vitamin C + Vitamin E', '6 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rex-6-mg-200-mg-50-mg-1896', false, '2026-08-09'
),
(
    'Rice ORS Oral Powder', 'Oral rehydration salt [rice based]', NULL, 'Oral Powder', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00 | ৳ 10.00 | ৳ 170.00 | ৳ 17.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rice-ors-1897', false, '2026-08-09'
),
(
    'Ripril 2.5 mg Tablet', 'Ramipril', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ripril-25-mg-1898', false, '2026-08-09'
),
(
    'Ripril 5 mg Tablet', 'Ramipril', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ripril-5-mg-1899', false, '2026-08-09'
),
(
    'Risedon 150 mg Tablet', 'Risedronate Sodium', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.37',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/risedon-150-mg-1900', false, '2026-08-09'
),
(
    'Risedon Plus Tablet', 'Risedronate Sodium + Calcium Carbonate', '35 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 220.64 | ৳ 55.16 | ৳ 7.88',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/risedon-plus-35-mg-500-mg-1901', false, '2026-08-09'
),
(
    'Rivatig 1.5 mg Capsule', 'Rivastigmine Tartrate', '1.5 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rivatig-15-mg-1902', false, '2026-08-09'
),
(
    'RivaXa 10 mg Tablet', 'Rivaroxaban', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rivaxa-10-mg-1904', false, '2026-08-09'
),
(
    'RivaXa 2.5 mg Tablet', 'Rivaroxaban', '2.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rivaxa-25-mg-1903', false, '2026-08-09'
),
(
    'Robic 500 mg Tablet', 'Ornidazole', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 210.60 | ৳ 42.12 | ৳ 7.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/robic-500-mg-1905', false, '2026-08-09'
),
(
    'Rosuva 10 mg Tablet', 'Rosuvastatin Calcium', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 660.00 | ৳ 220.00 | ৳ 22.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rosuva-10-mg-1907', false, '2026-08-09'
),
(
    'Rosuva 20 mg Tablet', 'Rosuvastatin Calcium', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 640.00 | ৳ 320.00 | ৳ 32.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rosuva-20-mg-1908', false, '2026-08-09'
),
(
    'Rosuva 5 mg Tablet', 'Rosuvastatin Calcium', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rosuva-5-mg-1906', false, '2026-08-09'
),
(
    'Rozy Tablet', 'Drospirenone + Estradiol', '0.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 420.00 | ৳ 210.00 | ৳ 14.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rozy-05-mg-025-mg-1909', false, '2026-08-09'
),
(
    'Rozy DS Tablet', 'Drospirenone + Estradiol', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 24.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rozy-ds-1-mg-05-mg-1910', false, '2026-08-09'
),
(
    'Rupatrol 10 mg Tablet', 'Rupatadine Fumarate', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rupatrol-10-mg-1911', false, '2026-08-09'
),
(
    'Rutix 200 mg Tablet', 'Ofloxacin', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 362.70 | ৳ 120.90 | ৳ 12.09',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rutix-200-mg-1912', false, '2026-08-09'
),
(
    'Rutix 400 mg Tablet', 'Ofloxacin', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 442.80 | ৳ 221.40 | ৳ 22.14',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/rutix-400-mg-1913', false, '2026-08-09'
),
(
    'Safyron 10 mg Tablet', 'Dydrogesterone', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 800.00 | ৳ 400.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/safyron-10-mg-1914', false, '2026-08-09'
),
(
    'Saga 200 mg Tablet', 'Sparfloxacin', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 225.75 | ৳ 75.25 | ৳ 15.05',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/saga-200-mg-1915', false, '2026-08-09'
),
(
    'Salicid Cream', 'Salicylic Acid', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/salicid-12-1916', false, '2026-08-09'
),
(
    'Scabex Cream', 'Permethrin', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/scabex-5-ww-1917', false, '2026-08-09'
),
(
    'Seclo 20 mg Enteric Coated Capsule', 'Omeprazole', '20 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 720.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, 'এগুলো সাধারণত চিকিৎসার শুরুর দিকে দেখা দেয় এবং শরীর মানিয়ে নেওয়ার সাথে সাথে কমে যায়: মাথাব্যথা 1বমি বমি ভাব বা বমি 1ডায়রিয়া বা কোষ্ঠকাঠিন্য 1পেট ব্যথা এবং গ্যাস বা পেট ফাঁপা 1মাথা ঘোরা বা তন্দ্রাচ্ছন্ন ভাব 5',
    NULL, 'https://drugdirectorybd.com/brands/seclo-20-mg-1918', true, '2026-08-09'
),
(
    'Seclo 40 mg Enteric Coated Capsule', 'Omeprazole', '40 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00 | ৳ 90.00 | ৳ 9.00 | ৳ 54.00',
    NULL, NULL, NULL, 'এগুলো সাধারণত চিকিৎসার শুরুর দিকে দেখা দেয় এবং শরীর মানিয়ে নেওয়ার সাথে সাথে কমে যায়: মাথাব্যথা 1বমি বমি ভাব বা বমি 1ডায়রিয়া বা কোষ্ঠকাঠিন্য 1পেট ব্যথা এবং গ্যাস বা পেট ফাঁপা 1মাথা ঘোরা বা তন্দ্রাচ্ছন্ন ভাব 5',
    NULL, 'https://drugdirectorybd.com/brands/seclo-40-mg-1919', true, '2026-08-09'
),
(
    'Seclo IV Injection', 'Omeprazole', '40 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 95.00',
    NULL, NULL, NULL, 'এগুলো সাধারণত চিকিৎসার শুরুর দিকে দেখা দেয় এবং শরীর মানিয়ে নেওয়ার সাথে সাথে কমে যায়: মাথাব্যথা 1বমি বমি ভাব বা বমি 1ডায়রিয়া বা কোষ্ঠকাঠিন্য 1পেট ব্যথা এবং গ্যাস বা পেট ফাঁপা 1মাথা ঘোরা বা তন্দ্রাচ্ছন্ন ভাব 5',
    NULL, 'https://drugdirectorybd.com/brands/seclo-40-mgvial-1920', true, '2026-08-09'
),
(
    'Seclo MUPS 20 mg Mups Tablet', 'Omeprazole', '20 mg', 'Mups Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 210.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, 'এগুলো সাধারণত চিকিৎসার শুরুর দিকে দেখা দেয় এবং শরীর মানিয়ে নেওয়ার সাথে সাথে কমে যায়: মাথাব্যথা 1বমি বমি ভাব বা বমি 1ডায়রিয়া বা কোষ্ঠকাঠিন্য 1পেট ব্যথা এবং গ্যাস বা পেট ফাঁপা 1মাথা ঘোরা বা তন্দ্রাচ্ছন্ন ভাব 5',
    NULL, 'https://drugdirectorybd.com/brands/seclo-mups-20-mg-1921', true, '2026-08-09'
),
(
    'Secnid DS 1000 mg Tablet', 'Secnidazole', '1000 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.60 | ৳ 40.12 | ৳ 20.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/secnid-ds-1000-mg-1922', false, '2026-08-09'
),
(
    'Secrin 1 mg Tablet', 'Glimepiride', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/secrin-1-mg-1923', false, '2026-08-09'
),
(
    'Secrin 2 mg Tablet', 'Glimepiride', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/secrin-2-mg-1924', false, '2026-08-09'
),
(
    'Secrin 3 mg Tablet', 'Glimepiride', '3 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/secrin-3-mg-1925', false, '2026-08-09'
),
(
    'Secrin 4 mg Tablet', 'Glimepiride', '4 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/secrin-4-mg-1926', false, '2026-08-09'
),
(
    'Secrin M Extended Release Tablet', 'Glimepiride + Metformin', '1 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 252.00 | ৳ 36.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/secrin-m-1-mg-500-mg-1927', false, '2026-08-09'
),
(
    'Secrin M Extended Release Tablet', 'Glimepiride + Metformin', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 336.00 | ৳ 48.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/secrin-m-2-mg500-mg-1-1928', false, '2026-08-09'
),
(
    'Sedil IV/IM Injection', 'Diazepam', '10 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sedil-10-mg2-ml-1930', false, '2026-08-09'
),
(
    'Sedil 5 mg Tablet', 'Diazepam', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 345.00 | ৳ 13.80 | ৳ 0.69',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sedil-5-mg-1929', false, '2026-08-09'
),
(
    'Sedno 5 mg Tablet', 'Desloratadine', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 252.00 | ৳ 25.20 | ৳ 2.52',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sedno-5-mg-1931', false, '2026-08-09'
),
(
    'Semazic SC Injection', 'Semaglutide', '0.25 mg/0.188 ml', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/semazic-025-mg0188-ml-1932', false, '2026-08-09'
),
(
    'Semazic SC Injection', 'Semaglutide', '0.5 mg/0.375 ml', 'SC Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/semazic-05-mg0375-ml-1-1933', false, '2026-08-09'
),
(
    'Sepnil Solution', 'Chlorhexidine Gluconate + Cetrimide', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.00 | ৳ 80.00 | ৳ 150.00 | ৳ 225.00 | ৳ 350.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sepnil-05-3-1-1934', false, '2026-08-09'
),
(
    'Siglimet Tablet', 'Sitagliptin + Metformin Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 540.00 | ৳ 108.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/siglimet-50-mg-1000-mg-1937', false, '2026-08-09'
),
(
    'Siglimet Tablet', 'Sitagliptin + Metformin Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 480.00 | ৳ 160.00 | ৳ 16.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/siglimet-50-mg500-mg-1935', false, '2026-08-09'
),
(
    'Siglimet XR Extended Release Tablet', 'Sitagliptin + Metformin Hydrochloride', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 180.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/siglimet-xr-100-mg-1000-mg-1939', false, '2026-08-09'
),
(
    'Siglimet XR Extended Release Tablet', 'Sitagliptin + Metformin Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 324.00 | ৳ 108.00 | ৳ 18.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/siglimet-xr-50-mg-1000-mg-1938', false, '2026-08-09'
),
(
    'Siglimet XR Extended Release Tablet', 'Sitagliptin + Metformin Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 288.00 | ৳ 96.00 | ৳ 16.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/siglimet-xr-50-mg-500-mg-1936', false, '2026-08-09'
),
(
    'Siglita 50 mg Tablet', 'Sitagliptin', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 260.00 | ৳ 130.00 | ৳ 13.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/siglita-50-mg-1940', false, '2026-08-09'
),
(
    'Silybin 140 mg Capsule', 'Silymarin [Dried extract of milk thistle fruits]', '140 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/silybin-140-mg-1942', false, '2026-08-09'
),
(
    'Silybin 70 mg Capsule', 'Silymarin [Dried extract of milk thistle fruits]', '70 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/silybin-70-mg-1941', false, '2026-08-09'
),
(
    'Sodibar 600 mg Tablet', 'Sodium Bicarbonate', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sodibar-600-mg-1943', false, '2026-08-09'
),
(
    'Solider 10 mg Tablet', 'Solifenacin Succinate', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solider-10-mg-1944', false, '2026-08-09'
),
(
    'Solider 5 mg Tablet', 'Solifenacin Succinate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 510.00 | ৳ 170.00 | ৳ 17.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solider-5-mg-1945', false, '2026-08-09'
),
(
    'Solo Nasal Drops', 'Sodium Chloride', NULL, 'Nasal Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solo-09-1946', false, '2026-08-09'
),
(
    'Solo IV Infusion', 'Sodium Chloride', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 67.85 | ৳ 95.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solo-09-2-1948', false, '2026-08-09'
),
(
    'Solodex IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.89 | ৳ 101.20',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solodex-09-5-1613', false, '2026-08-09'
),
(
    'Solodex IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.89 | ৳ 101.20',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solodex-09-5-2-1949', false, '2026-08-09'
),
(
    'Solodex Baby IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 72.45',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solodex-baby-0225-5-1-1951', false, '2026-08-09'
),
(
    'Solodex Baby IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 72.45',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solodex-baby-0225-5-1615', false, '2026-08-09'
),
(
    'Solodex JR IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 73.60',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solodex-jr-045-5-1614', false, '2026-08-09'
),
(
    'Solodex JR IV Infusion', 'Sodium Chloride + Dextrose', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 73.60',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solodex-jr-045-5-2-1950', false, '2026-08-09'
),
(
    'SoloSpray Nasal Spray', 'Sodium Chloride', NULL, 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/solospray-09-1947', false, '2026-08-09'
),
(
    'Sonap 250 mg Tablet', 'Naproxen Sodium', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sonap-250-mg-1953', false, '2026-08-09'
),
(
    'Sonap 500 mg Tablet', 'Naproxen Sodium', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sonap-500-mg-1954', false, '2026-08-09'
),
(
    'Sopilax 10 mg Tablet', 'Sodium Picosulfate', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sopilax-10-mg-1956', false, '2026-08-09'
),
(
    'Sopilax Oral Solution', 'Sodium Picosulfate', '5 mg/5 ml', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sopilax-5-mg5-ml-1955', false, '2026-08-09'
),
(
    'Sorasiba 200 mg Tablet', 'Sorafenib Tosylate', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 3,000.00 | ৳ 1,000.00 | ৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sorasiba-200-mg-1957', false, '2026-08-09'
),
(
    'Specbac IV Injection', 'Meropenem Trihydrate', '1 gm', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/specbac-1-gmvial-1960', false, '2026-08-09'
),
(
    'Specbac IV Injection', 'Meropenem Trihydrate', '250 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/specbac-250-mgvial-1959', false, '2026-08-09'
),
(
    'Specbac IV Injection', 'Meropenem Trihydrate', '500 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 700.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/specbac-500-mgvial-1958', false, '2026-08-09'
),
(
    'Splendora Scalp Solution', 'Minoxidil', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 501.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/splendora-2-1962', false, '2026-08-09'
),
(
    'Splendora Scalp Solution', 'Minoxidil', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 601.81',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/splendora-5-1961', false, '2026-08-09'
),
(
    'SQ-Mycetin Eye Drop (Ophthalmic Solution)', 'Chloramphenicol', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 34.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sq-mycetin-05-1963', false, '2026-08-09'
),
(
    'Suev 10 mg Tablet', 'Atomoxetine Hydrochloride', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 8.00 | ৳ 0.27',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/suev-10-mg-1965', false, '2026-08-09'
),
(
    'Sulprex Metered Dose Inhaler', 'Salbutamol + Ipratropium', '100 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.69 | ৳ 250.75',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sulprex-100-mcg-20-mcgpuff-1966', false, '2026-08-09'
),
(
    'Sulprex Nebuliser Solution', 'Salbutamol + Ipratropium', '2.5 mg', 'Nebuliser Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sulprex-25-mg-500-mcg3-ml-1967', false, '2026-08-09'
),
(
    'Sultolin Metered Dose Inhaler', 'Salbutamol', '100 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 220.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sultolin-100-mcgpuff-1972', false, '2026-08-09'
),
(
    'Sultolin Syrup', 'Salbutamol', '2 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 23.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sultolin-2-mg5-ml-1968', false, '2026-08-09'
),
(
    'Sultolin 200 mcg Dry Powder Inhalation Capsule (DPI)', 'Salbutamol', '200 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 75.30 | ৳ 15.06 | ৳ 2.51',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sultolin-200-mcg-1971', false, '2026-08-09'
),
(
    'Sultolin Nebuliser Solution', 'Salbutamol', '5 mg', 'Nebuliser Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.82',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sultolin-5-mgml-1969', false, '2026-08-09'
),
(
    'Sultolin SR 8 mg Sustained Release Tablet', 'Salbutamol', '8 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 184.00 | ৳ 9.20 | ৳ 0.92',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sultolin-sr-8-mg-1970', false, '2026-08-09'
),
(
    'SunMask Cream', 'Zinc oxide + Octinoxate + Enzacamene + Avobenzone', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/sunmask-0-1973', false, '2026-08-09'
),
(
    'Susten 30 mg Tablet', 'Dapoxetine Hydrochloride', '30 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 150.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/susten-30-mg-1974', false, '2026-08-09'
),
(
    'Susten 60 mg Tablet', 'Dapoxetine Hydrochloride', '60 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/susten-60-mg-1975', false, '2026-08-09'
),
(
    'Suvirus 400 mg Tablet', 'Sofosbuvir', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 7,200.00 | ৳ 2,400.00 | ৳ 600.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/suvirus-400-mg-1976', false, '2026-08-09'
),
(
    'Suvotol 10 mg Tablet', 'Suvorexant', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/suvotol-10-mg-1977', false, '2026-08-09'
),
(
    'Suzyme 325 mg Tablet', 'Pancreatin', '325 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 351.00 | ৳ 35.10 | ৳ 3.51',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/suzyme-325-mg-1978', false, '2026-08-09'
),
(
    'Tazid IV/IM Injection', 'Ceftazidime Pentahydrate', '1 gm', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.72',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tazid-1-gmvial-1981', false, '2026-08-09'
),
(
    'Tazid IV/IM Injection', 'Ceftazidime Pentahydrate', '250 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 85.26',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tazid-250-mgvial-1979', false, '2026-08-09'
),
(
    'Tazid IV/IM Injection', 'Ceftazidime Pentahydrate', '500 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 130.39',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tazid-500-mgvial-1980', false, '2026-08-09'
),
(
    'Tazocilin IV Infusion', 'Piperacillin + Tazobactam', '2 gm', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 550.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tazocilin-2-gm-025-gmvial-1983', false, '2026-08-09'
),
(
    'Tazocilin IV Infusion', 'Piperacillin + Tazobactam', '4 gm', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,003.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tazocilin-4-gm-05-gmvial-1982', false, '2026-08-09'
),
(
    'Tebast 10 mg Tablet', 'Ebastine', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.60 | ৳ 60.20 | ৳ 6.02',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tebast-10-mg-1984', false, '2026-08-09'
),
(
    'Teconin IV/IM Injection', 'Teicoplanin', '200 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 700.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/teconin-200-mgvial-1985', false, '2026-08-09'
),
(
    'Teconin IV/IM Injection', 'Teicoplanin', '400 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/teconin-400-mgvial-1986', false, '2026-08-09'
),
(
    'Telmilok 40 mg Tablet', 'Telmisartan', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 375.00 | ৳ 125.00 | ৳ 12.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/telmilok-40-mg-1987', false, '2026-08-09'
),
(
    'Telmilok 80 mg Tablet', 'Telmisartan', '80 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/telmilok-80-mg-1988', false, '2026-08-09'
),
(
    'Telmilok Plus Tablet', 'Telmisartan + Hydrochlorothiazide', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 375.00 | ৳ 125.00 | ৳ 12.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/telmilok-plus-40-mg-125-mg-1989', false, '2026-08-09'
),
(
    'Terminex Tablet', 'Mifepristone + Misoprostol', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/terminex-200-mg-200-mcg-1990', false, '2026-08-09'
),
(
    'Tetrax 500 mg Capsule', 'Tetracycline Hydrochloride', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 339.00 | ৳ 33.90 | ৳ 3.39',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tetrax-500-mg-1991', false, '2026-08-09'
),
(
    'Tezo 200 mg Tablet', 'Tedizolid Phosphate', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,800.00 | ৳ 300.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tezo-200-mg-1992', false, '2026-08-09'
),
(
    'Thyrin 25 mcg Tablet', 'Levothyroxine Sodium', '25 mcg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 99.90 | ৳ 16.65 | ৳ 1.11',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/thyrin-25-mcg-1993', false, '2026-08-09'
),
(
    'Thyrin 50 mcg Tablet', 'Levothyroxine Sodium', '50 mcg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 202.50 | ৳ 33.75 | ৳ 2.25',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/thyrin-50-mcg-1994', false, '2026-08-09'
),
(
    'Thyrin 75 mcg Tablet', 'Levothyroxine Sodium', '75 mcg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 186.00 | ৳ 37.20 | ৳ 2.48',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/thyrin-75-mcg-1995', false, '2026-08-09'
),
(
    'Ticalog 90 mg Tablet', 'Ticagrelor', '90 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 750.00 | ৳ 75.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticalog-90-mg-1996', false, '2026-08-09'
),
(
    'Ticamet Metered Dose Inhaler', 'Salmeterol + Fluticasone Propionate', '25 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 596.79',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticamet-25-mcg-125-mcgpuff-1997', false, '2026-08-09'
),
(
    'Ticamet Metered Dose Inhaler', 'Salmeterol + Fluticasone Propionate', '25 mcg', 'Metered Dose Inhaler', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 695.00 | ৳ 797.39',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticamet-25-mcg-250-mcgpuff-1998', false, '2026-08-09'
),
(
    'Ticamet Dry Powder Inhalation Capsule (DPI)', 'Salmeterol + Fluticasone Propionate', '50 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 195.60 | ৳ 39.12 | ৳ 6.52',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticamet-50-mcg-100-mcg-1999', false, '2026-08-09'
),
(
    'Ticamet Dry Powder Inhalation Capsule (DPI)', 'Salmeterol + Fluticasone Propionate', '50 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 577.44 | ৳ 72.18 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticamet-50-mcg-250-mcg-2000', false, '2026-08-09'
),
(
    'Ticamet Dry Powder Inhalation Capsule (DPI)', 'Salmeterol + Fluticasone Propionate', '50 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 510.00 | ৳ 102.00 | ৳ 17.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticamet-50-mcg-500-mcg-2001', false, '2026-08-09'
),
(
    'Ticas Cream', 'Fluticasone Propionate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.61',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticas-005-2002', false, '2026-08-09'
),
(
    'Ticstop 12.5 mg Tablet', 'Tetrabenazine', '12.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticstop-125-mg-2003', false, '2026-08-09'
),
(
    'Ticstop 25 mg Tablet', 'Tetrabenazine', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 700.00 | ৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ticstop-25-mg-2004', false, '2026-08-09'
),
(
    'Tilex Max Tablet', 'Glucosamine Sulfate + Diacerein', '750 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 720.00 | ৳ 72.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tilex-max-750-mg-50-mg-2005', false, '2026-08-09'
),
(
    'Timotor 100 mg Tablet', 'Trimebutine Maleate', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/timotor-100-mg-2006', false, '2026-08-09'
),
(
    'Toco Soft Capsule', 'Tocotrienol + Tocopherol', '50 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/toco-soft-50-mg-135-mg-2007', false, '2026-08-09'
),
(
    'Tofator 5 mg Tablet', 'Tofacitinib', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tofator-5-mg-2008', false, '2026-08-09'
),
(
    'Togent Cream', 'Diphenhydramine Hydrochloride + Zinc Acetate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 35.24',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/togent-2-01-2009', false, '2026-08-09'
),
(
    'Tolfem 200 mg Tablet', 'Tolfenamic acid', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tolfem-200-mg-2010', false, '2026-08-09'
),
(
    'Topicort Cream', 'Hydrocortisone Acetate', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/topicort-1-2011', false, '2026-08-09'
),
(
    'Torax 10 mg Tablet', 'Ketorolac Tromethamine', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/torax-10-mg-2012', false, '2026-08-09'
),
(
    'Torax IV/IM Injection', 'Ketorolac Tromethamine', '30 mg', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/torax-30-mgml-2014', false, '2026-08-09'
),
(
    'Torax IV/IM Injection', 'Ketorolac Tromethamine', '60 mg/2 ml', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/torax-60-mg2-ml-2013', false, '2026-08-09'
),
(
    'Torel Oral Emulsion', 'Menthol + Camphor + Methyl Salicylate + Oleoresin Capsicum', '25.40 mg', 'Oral Emulsion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/torel-2540-mg-1430-mg-420-mg-005-mggm-2015', false, '2026-08-09'
),
(
    'Torsid 20 mg Tablet', 'Torasemide', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/torsid-20-mg-2016', false, '2026-08-09'
),
(
    'Torsid 5 mg Tablet', 'Torasemide', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/torsid-5-mg-2017', false, '2026-08-09'
),
(
    'Tory 120 mg Tablet', 'Etoricoxib', '120 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tory-120-mg-2020', false, '2026-08-09'
),
(
    'Tory 60 mg Tablet', 'Etoricoxib', '60 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tory-60-mg-2018', false, '2026-08-09'
),
(
    'Tory 90 mg Tablet', 'Etoricoxib', '90 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 362.70 | ৳ 120.90 | ৳ 12.09',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tory-90-mg-2019', false, '2026-08-09'
),
(
    'Travolar Eye Drop (Ophthalmic Solution)', 'Travoprost', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 470.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/travolar-0004-2021', false, '2026-08-09'
),
(
    'Trelanti Dry Powder Inhalation Capsule (DPI)', 'Vilanterol Trifenatate + Fluticasone Furoate + Umeclidinium Bromide', '25 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 900.00 | ৳ 90.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/trelanti-25-mcg-100-mcg-625-mcg-2022', false, '2026-08-09'
),
(
    'Trevox 500 mg Tablet', 'Levofloxacin Hemihydrate', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 510.00 | ৳ 170.00 | ৳ 17.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/trevox-500-mg-2023', false, '2026-08-09'
),
(
    'Trevox IV Infusion', 'Levofloxacin Hemihydrate', '500 mg/100 ml', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.30',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/trevox-500-mg100-ml-2024', false, '2026-08-09'
),
(
    'Trevox D Eye Drop (Ophthalmic Solution)', 'Dexamethasone + Levofloxacin', NULL, 'Eye Drop (Ophthalmic Solution)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/trevox-d-01-05-2025', false, '2026-08-09'
),
(
    'Tridyl 2 mg Tablet', 'Trihexyphenidyl Hydrochloride', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 165.00 | ৳ 55.00 | ৳ 5.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tridyl-2-mg-2026', false, '2026-08-09'
),
(
    'Tridyl 5 mg Tablet', 'Trihexyphenidyl Hydrochloride', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tridyl-5-mg-2027', false, '2026-08-09'
),
(
    'Tridyl Syrup', 'Trihexyphenidyl Hydrochloride', '5 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 125.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tridyl-5-mg5-ml-2028', false, '2026-08-09'
),
(
    'Trispray Nasal Spray', 'Triamcinolone Acetonide', '55 mcg', 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 201.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/trispray-55-mcgspray-2029', false, '2026-08-09'
),
(
    'Trumega 1000 mg Capsule', 'Omega-3 Acid Ethyl Esters', '1000 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/trumega-1000-mg-2030', false, '2026-08-09'
),
(
    'Trupan 20 mg Enteric Coated Tablet', 'Pantoprazole Sodium', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 420.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, 'এই লক্ষণগুলো সাধারণত মৃদু হয় এবং চিকিৎসা চালিয়ে গেলে নিজে থেকেই সেরে যায়: মাথাব্যথা (Headache): সবচেয়ে সাধারণ পার্শ্বপ্রতিক্রিয়া। 3ডায়রিয়া (Diarrhea): অন্ত্রের মাইক্রোবায়োটা পরিবর্তনের কারণে হতে পারে। 3পেটে ব্যথা এবং গ্যাস (Abdominal Pain & Flatulence)। 6বমি বমি ভাব বা বমি (Nausea/Vomiting)। 10মাথা ঘোরা বা ভার্টিগো (Dizziness/Vertigo)। 8',
    NULL, 'https://drugdirectorybd.com/brands/trupan-20-mg-2031', true, '2026-08-09'
),
(
    'Trupan 40 mg Enteric Coated Tablet', 'Pantoprazole Sodium', '40 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, 'এই লক্ষণগুলো সাধারণত মৃদু হয় এবং চিকিৎসা চালিয়ে গেলে নিজে থেকেই সেরে যায়: মাথাব্যথা (Headache): সবচেয়ে সাধারণ পার্শ্বপ্রতিক্রিয়া। 3ডায়রিয়া (Diarrhea): অন্ত্রের মাইক্রোবায়োটা পরিবর্তনের কারণে হতে পারে। 3পেটে ব্যথা এবং গ্যাস (Abdominal Pain & Flatulence)। 6বমি বমি ভাব বা বমি (Nausea/Vomiting)। 10মাথা ঘোরা বা ভার্টিগো (Dizziness/Vertigo)। 8',
    NULL, 'https://drugdirectorybd.com/brands/trupan-40-mg-2032', true, '2026-08-09'
),
(
    'Trupan IV Injection', 'Pantoprazole Sodium', '40 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.00',
    NULL, NULL, NULL, 'এই লক্ষণগুলো সাধারণত মৃদু হয় এবং চিকিৎসা চালিয়ে গেলে নিজে থেকেই সেরে যায়: মাথাব্যথা (Headache): সবচেয়ে সাধারণ পার্শ্বপ্রতিক্রিয়া। 3ডায়রিয়া (Diarrhea): অন্ত্রের মাইক্রোবায়োটা পরিবর্তনের কারণে হতে পারে। 3পেটে ব্যথা এবং গ্যাস (Abdominal Pain & Flatulence)। 6বমি বমি ভাব বা বমি (Nausea/Vomiting)। 10মাথা ঘোরা বা ভার্টিগো (Dizziness/Vertigo)। 8',
    NULL, 'https://drugdirectorybd.com/brands/trupan-40-mgvial-2033', true, '2026-08-09'
),
(
    'Truxil Tablet', 'Almitrine Bismesylate + Raubasine', '30 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/truxil-30-mg-10-mg-2034', false, '2026-08-09'
),
(
    'Tryptin 10 mg Tablet', 'Amitriptyline Hydrochloride', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 170.00 | ৳ 8.50 | ৳ 0.85',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tryptin-10-mg-2035', false, '2026-08-09'
),
(
    'Tryptin 25 mg Tablet', 'Amitriptyline Hydrochloride', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 352.00 | ৳ 17.60 | ৳ 1.76',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tryptin-25-mg-2036', false, '2026-08-09'
),
(
    'Tryptin Plus Tablet', 'Amitriptyline Hydrochloride + Chlordiazepoxide', '12.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 80.00 | ৳ 8.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tryptin-plus-125-mg-5-mg-2037', false, '2026-08-09'
),
(
    'Tusca Syrup', 'Pseudoephedrine + Guaiphenasine + Triprolidine', '30 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 65.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tusca-30-mg-100-mg-125-mg5-ml-2038', false, '2026-08-09'
),
(
    'Tusca Plus Syrup', 'Guaifenesin + Levomenthol + Diphenhydramine', '100 mg', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 85.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tusca-plus-100-mg-11-mg-14-mg5-ml-1-2039', false, '2026-08-09'
),
(
    'Tylace 600 mg Effervescent Tablet', 'Acetylcysteine', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/tylace-600-mg-2040', false, '2026-08-09'
),
(
    'Ucol 2 mg Tablet', 'Tolterodine Tartrate', '2 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ucol-2-mg-2041', false, '2026-08-09'
),
(
    'Ulpep 500 mg Capsule', 'Hingastak Churna', '500 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ulpep-500-mg-2042', false, '2026-08-09'
),
(
    'Ulrif Oral Suspension', 'Sucralfate', '1 gm/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 400.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ulrif-1-gm5-ml-2043', false, '2026-08-09'
),
(
    'Ultivent Dry Powder Inhalation Capsule (DPI)', 'Indacaterol + Glycopyrronium', '110 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,080.00 | ৳ 360.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ultivent-110-mcg-50-mcg-2044', false, '2026-08-09'
),
(
    'Ultivent-M Dry Powder Inhalation Capsule (DPI)', 'Indacaterol + Glycopyrronium + Mometasone Furoate', '150 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 650.00 | ৳ 65.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ultivent-m-150-mcg-50-mcg-160-mcg-1-2045', false, '2026-08-09'
),
(
    'Uripam 160 mg Capsule', 'Saw Palmetto', '160 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 200.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/uripam-160-mg-2046', false, '2026-08-09'
),
(
    'Uriset Oral Solution', 'Potassium Citrate + Citric Acid', '1500 mg', 'Oral Solution', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/uriset-1500-mg-250-mg5-ml-2047', false, '2026-08-09'
),
(
    'Uriten 10 mg Extended Release Tablet', 'Alfuzosin Hydrochloride', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.10 | ৳ 100.70 | ৳ 10.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/uriten-10-mg-1-2048', false, '2026-08-09'
),
(
    'Urobery Syrup', 'Cranberry [Vaccinium macrocarpon]', '300 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 450.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/urobery-300-mg5-ml-2050', false, '2026-08-09'
),
(
    'Urobery 400 mg Capsule', 'Cranberry [Vaccinium macrocarpon]', '400 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/urobery-400-mg-2049', false, '2026-08-09'
),
(
    'Urocure Oral Suspension', 'Nitrofurantoin', '25 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/urocure-25-mg5-ml-2051', false, '2026-08-09'
),
(
    'Urocure SR 100 mg Sustained Release Capsule', 'Nitrofurantoin', '100 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 401.20 | ৳ 200.60 | ৳ 20.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/urocure-sr-100-mg-2052', false, '2026-08-09'
),
(
    'Urso 150 mg Tablet', 'Ursodeoxycholic Acid', '150 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/urso-150-mg-2053', false, '2026-08-09'
),
(
    'Urso 300 mg Tablet', 'Ursodeoxycholic Acid', '300 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 500.00 | ৳ 250.00 | ৳ 25.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/urso-300-mg-2054', false, '2026-08-09'
),
(
    'Utal 5 mg Tablet', 'Ulipristal Acetate [For uterine fibroids]', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,090.00 | ৳ 545.00 | ৳ 54.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/utal-5-mg-2055', false, '2026-08-09'
),
(
    'Valmor Tablet', 'Sacubitril + Valsartan', '24 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 45.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/valmor-24-mg-26-mg-2057', false, '2026-08-09'
),
(
    'Valmor Tablet', 'Sacubitril + Valsartan', '49 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 850.00 | ৳ 85.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/valmor-49-mg-51-mg-2056', false, '2026-08-09'
),
(
    'Valoate Syrup', 'Sodium Valproate', '200 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.30',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/valoate-200-mg5-ml-2058', false, '2026-08-09'
),
(
    'Valoate CR 200 mg Controlled Release Tablet', 'Sodium Valproate', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/valoate-cr-200-mg-2059', false, '2026-08-09'
),
(
    'Valoate CR 300 mg Controlled Release Tablet', 'Sodium Valproate', '300 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 401.50 | ৳ 80.30 | ৳ 8.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/valoate-cr-300-mg-2060', false, '2026-08-09'
),
(
    'Valoate CR 500 mg Controlled Release Tablet', 'Sodium Valproate', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.90 | ৳ 120.30 | ৳ 12.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/valoate-cr-500-mg-2061', false, '2026-08-09'
),
(
    'Vanprox Paediatric Drops', 'Cefpodoxime Proxetil', '20 mg', 'Paediatric Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 60.40',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vanprox-20-mgml-2063', false, '2026-08-09'
),
(
    'Vanprox Powder For Suspension', 'Cefpodoxime Proxetil', '40 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 98.65',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vanprox-40-mg5-ml-2062', false, '2026-08-09'
),
(
    'Vardamate 10 mg Tablet', 'Vardenafil', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vardamate-10-mg-2064', false, '2026-08-09'
),
(
    'Vardamate 20 mg Tablet', 'Vardenafil', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vardamate-20-mg-2065', false, '2026-08-09'
),
(
    'Vertina-D Delayed Release Tablet', 'Pyridoxine Hydrochloride + Doxylamine Succinate', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 250.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vertina-d-10-mg-10-mg-2067', false, '2026-08-09'
),
(
    'Vertina-DX Extended Release Tablet', 'Pyridoxine Hydrochloride + Doxylamine Succinate', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 270.00 | ৳ 90.00 | ৳ 9.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vertina-dx-20-mg-20-mg-2068', false, '2026-08-09'
),
(
    'Vertina Plus Tablet', 'Meclizine + Pyridoxine', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 150.50 | ৳ 30.10 | ৳ 3.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vertina-plus-25-mg-50-mg-2066', false, '2026-08-09'
),
(
    'Viglimet Tablet', 'Vildagliptin + Metformin Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 120.00 | ৳ 20.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/viglimet-50-mg-500-mg-2069', false, '2026-08-09'
),
(
    'Viglimet Tablet', 'Vildagliptin + Metformin Hydrochloride', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 660.00 | ৳ 132.00 | ৳ 22.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/viglimet-50-mg-850-mg-2070', false, '2026-08-09'
),
(
    'Viglita 50 mg Tablet', 'Vildagliptin', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 320.00 | ৳ 160.00 | ৳ 16.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/viglita-50-mg-2071', false, '2026-08-09'
),
(
    'Vigorex 100 mg Tablet', 'Sildenafil Citrate', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 501.50 | ৳ 250.75 | ৳ 50.15',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vigorex-100-mg-2074', false, '2026-08-09'
),
(
    'Vigorex 25 mg Tablet', 'Sildenafil Citrate', '25 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.60 | ৳ 100.30 | ৳ 20.06',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vigorex-25-mg-2072', false, '2026-08-09'
),
(
    'Vigorex 50 mg Tablet', 'Sildenafil Citrate', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 301.00 | ৳ 150.50 | ৳ 30.10',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vigorex-50-mg-2073', false, '2026-08-09'
),
(
    'Vigosol IV Infusion', 'Amino Acid, D-Sorbitol & Electrolytes', NULL, 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 352.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vigosol-5-2075', false, '2026-08-09'
),
(
    'Vilanti Dry Powder Inhalation Capsule (DPI)', 'Vilanterol Trifenatate + Fluticasone Furoate', '25 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 440.00 | ৳ 220.00 | ৳ 22.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vilanti-25-mcg-100-mcg-2076', false, '2026-08-09'
),
(
    'Vilanti Dry Powder Inhalation Capsule (DPI)', 'Vilanterol Trifenatate + Fluticasone Furoate', '25 mcg', 'Dry Powder Inhalation Capsule (DPI)', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 300.00 | ৳ 30.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vilanti-25-mcg-200-mcg-2077', false, '2026-08-09'
),
(
    'Viodin Mouth Wash', 'Povidone Iodine', NULL, 'Mouth Wash', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/viodin-1-wv-2080', false, '2026-08-09'
),
(
    'Viodin Solution', 'Povidone Iodine', NULL, NULL, NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 30.00 | ৳ 120.00 | ৳ 800.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/viodin-10-wv-2078', false, '2026-08-09'
),
(
    'Viodin Ointment', 'Povidone Iodine', NULL, 'Ointment', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 55.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/viodin-5-ww-2079', false, '2026-08-09'
),
(
    'Virux 200 mg Tablet', 'Acyclovir', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 423.00 | ৳ 141.00 | ৳ 14.10',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/virux-200-mg-2083', false, '2026-08-09'
),
(
    'Virux Oral Suspension', 'Acyclovir', '200 mg/5 ml', 'Oral Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 125.85',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/virux-200-mg5-ml-2082', false, '2026-08-09'
),
(
    'Virux 400 mg Tablet', 'Acyclovir', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 442.80 | ৳ 221.40 | ৳ 22.14',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/virux-400-mg-2084', false, '2026-08-09'
),
(
    'Virux Cream', 'Acyclovir', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/virux-5-ww-2085', false, '2026-08-09'
),
(
    'Virux IV Infusion', 'Acyclovir', '500 mg', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 702.11',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/virux-500-mgvial-2081', false, '2026-08-09'
),
(
    'Virux-HC Cream', 'Acyclovir + Hydrocortisone', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 70.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/virux-hc-5-1-2086', false, '2026-08-09'
),
(
    'VOLINAC Gel', 'Diclofenac Sodium + Methyl Salicylate + Linseed Oil + Menthol', NULL, 'Gel', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/volinac-1-ww-2087', false, '2026-08-09'
),
(
    'VOLINAC Max Gel', 'Diclofenac Sodium + Methyl Salicylate + Linseed Oil + Menthol', NULL, 'Gel', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 170.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/volinac-max-2-ww-2088', false, '2026-08-09'
),
(
    'Voniza 10 mg Tablet', 'Vonoprazan', '10 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 210.00 | ৳ 70.00 | ৳ 7.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/voniza-10-mg-2089', false, '2026-08-09'
),
(
    'Voniza 20 mg Tablet', 'Vonoprazan', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 100.00 | ৳ 10.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/voniza-20-mg-2090', false, '2026-08-09'
),
(
    'VonoKit Tablet', 'Vonoprazan + Amoxicillin + Clarithromycin', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 840.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vonokit-20-mg-1000-mg-500-mg-1-12236', false, '2026-08-09'
),
(
    'Vori 200 mg Tablet', 'Voriconazole', '200 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 1,000.00 | ৳ 100.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vori-200-mg-2092', false, '2026-08-09'
),
(
    'Vori IV Injection', 'Voriconazole', '200 mg', 'IV Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,000.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vori-200-mgvial-2094', false, '2026-08-09'
),
(
    'Vori 50 mg Tablet', 'Voriconazole', '50 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 350.00 | ৳ 35.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/vori-50-mg-2093', false, '2026-08-09'
),
(
    'Waxnil Ear Drop', 'Sodium Bicarbonate [Ear Preparations]', NULL, 'Ear Drop', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 160.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/waxnil-5-wv-2095', false, '2026-08-09'
),
(
    'Xenole Delayed Release Tablet', 'Naproxen Sodium + Esomeprazole Magnesium', '375 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 390.00 | ৳ 130.00 | ৳ 13.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xenole-375-mg-20-mg-2096', false, '2026-08-09'
),
(
    'Xenole Delayed Release Tablet', 'Naproxen Sodium + Esomeprazole Magnesium', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 450.00 | ৳ 150.00 | ৳ 15.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xenole-500-mg-20-mg-2097', false, '2026-08-09'
),
(
    'Xfin Cream', 'Terbinafine Hydrochloride', NULL, 'Cream', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 80.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xfin-1-2098', false, '2026-08-09'
),
(
    'Xfin 250 mg Tablet', 'Terbinafine Hydrochloride', '250 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 560.00 | ৳ 280.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xfin-250-mg-2099', false, '2026-08-09'
),
(
    'Xflam 400 mg Tablet', 'Dexibuprofen', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.48 | ৳ 20.04 | ৳ 5.01',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xflam-400-mg-2100', false, '2026-08-09'
),
(
    'Xpos 100 mg Delayed Release Tablet', 'Posaconazole', '100 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 2,000.00 | ৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xpos-100-mg-2101', false, '2026-08-09'
),
(
    'Xten 20 mg Tablet', 'Tenoxicam', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.90 | ৳ 80.30 | ৳ 8.03',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xten-20-mg-2102', false, '2026-08-09'
),
(
    'Xylocon Nasal Drops', 'Oxymetazoline Hydrochloride', NULL, 'Nasal Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xylocon-0025-2104', false, '2026-08-09'
),
(
    'Xylocon Nasal Drops', 'Oxymetazoline Hydrochloride', NULL, 'Nasal Drops', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 45.13',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xylocon-005-1-2103', false, '2026-08-09'
),
(
    'Xylocon Nasal Spray', 'Oxymetazoline Hydrochloride', NULL, 'Nasal Spray', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/xylocon-005-2105', false, '2026-08-09'
),
(
    'Zanthin 2 mg Capsule', 'Astaxanthin', '2 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 360.00 | ৳ 120.00 | ৳ 12.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zanthin-2-mg-2106', false, '2026-08-09'
),
(
    'Zanthin 4 mg Capsule', 'Astaxanthin', '4 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 660.00 | ৳ 220.00 | ৳ 22.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zanthin-4-mg-2107', false, '2026-08-09'
),
(
    'Zerocal Oral Powder', 'Sucralose', '12 mg', 'Oral Powder', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 90.00 | ৳ 3.60 | ৳ 200.00 | ৳ 2.67 | ৳ 350.00 | ৳ 2.33',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zerocal-12-mgsachet-2109', false, '2026-08-09'
),
(
    'Zerocal 6.5 mg Tablet', 'Sucralose', '6.5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 120.00 | ৳ 1.20',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zerocal-65-mg-2108', false, '2026-08-09'
),
(
    'Zerocal Stevia Oral Powder', 'Steviol Glycosides', NULL, 'Oral Powder', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 120.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zerocal-stevia-2110', false, '2026-08-09'
),
(
    'Zesup Syrup', 'Zinc Sulfate Monohydrate', '10 mg/5 ml', 'Syrup', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 50.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zesup-10-mg5-ml-2111', false, '2026-08-09'
),
(
    'Zesup 20 mg Tablet', 'Zinc Sulfate Monohydrate', '20 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 105.00 | ৳ 35.00 | ৳ 3.50',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zesup-20-mg-2112', false, '2026-08-09'
),
(
    'Zif-A Tablet', 'Ferrous Ascorbate + Folic Acid + Zinc Sulfate', '48 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zif-a-48-mg-05-mg-225-mg-2114', false, '2026-08-09'
),
(
    'Zif-CI Timed Release Capsule', 'Carbonyl Iron + Folic Acid + Zinc Sulfate', '50 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.00 | ৳ 50.00 | ৳ 5.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zif-ci-50-mg-050-mg-6180-mg-2115', false, '2026-08-09'
),
(
    'Zif Forte Capsule', 'Carbonyl Iron + Folic Acid + Zinc Sulfate + Vitamin B Complex + Vitamin C', NULL, 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 240.00 | ৳ 40.00 | ৳ 4.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zif-forte-2113', false, '2026-08-09'
),
(
    'Zifolet Tablet', 'Folic Acid + Zinc Sulfate Monohydrate', '5 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00 | ৳ 20.00 | ৳ 2.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zifolet-5-mg-20-mg-2116', false, '2026-08-09'
),
(
    'Ziliron-B Capsule', 'Iron Polymaltose Complex + Folic Acid + Zinc + Vitamin B-Complex', NULL, 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 180.00 | ৳ 60.00 | ৳ 6.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/ziliron-b-2117', false, '2026-08-09'
),
(
    'Zimax Powder For Suspension', 'Azithromycin Dihydrate', '200 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 95.00 | ৳ 160.00 | ৳ 220.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zimax-200-mg5-ml-2120', false, '2026-08-09'
),
(
    'Zimax 250 mg Capsule', 'Azithromycin Dihydrate', '250 mg', 'Capsule', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 300.96 | ৳ 150.48 | ৳ 25.08',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zimax-250-mg-2118', false, '2026-08-09'
),
(
    'Zimax 500 mg Tablet', 'Azithromycin Dihydrate', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 720.00 | ৳ 240.00 | ৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zimax-500-mg-2119', false, '2026-08-09'
),
(
    'Zimax IV Infusion', 'Azithromycin Dihydrate', '500 mg', 'IV Infusion', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 461.38',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zimax-500-mgvial-2121', false, '2026-08-09'
),
(
    'Zolibac IV/IM Injection', 'Cefazolin Sodium', '1 gm', 'IV/IM Injection', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 200.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zolibac-1-gmvial-2122', false, '2026-08-09'
),
(
    'Zolivox Powder For Suspension', 'Linezolid', '100 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 280.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zolivox-100-mg5-ml-2125', false, '2026-08-09'
),
(
    'Zolivox 400 mg Tablet', 'Linezolid', '400 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 600.00 | ৳ 60.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zolivox-400-mg-2123', false, '2026-08-09'
),
(
    'Zolivox 600 mg Tablet', 'Linezolid', '600 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 850.00 | ৳ 85.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zolivox-600-mg-2124', false, '2026-08-09'
),
(
    'Zox Powder For Suspension', 'Nitazoxanide', '100 mg/5 ml', 'Powder For Suspension', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 40.00',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zox-100-mg5-ml-2127', false, '2026-08-09'
),
(
    'Zox 500 mg Tablet', 'Nitazoxanide', '500 mg', 'Tablet', NULL,
    'Square Pharmaceuticals PLC.',
    '৳ 302.10 | ৳ 60.42 | ৳ 10.07',
    NULL, NULL, NULL, NULL,
    NULL, 'https://drugdirectorybd.com/brands/zox-500-mg-2126', false, '2026-08-09'
);
