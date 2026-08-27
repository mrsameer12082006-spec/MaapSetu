# 🗄️ MaapSetu - Complete Backend Database Schema Specifications

This document defines the exact database table structures, relationships, column data types, enums, and JSON structures required by the **MaapSetu Frontend**.

---

## 📌 ER Diagram Overview & Entity Relationships

```
┌──────────────┐       1:N       ┌──────────────────┐       1:N       ┌──────────────────┐
│    users     │ ──────────────> │   instruments    │ ──────────────> │   applications   │
└──────────────┘                 └──────────────────┘                 └──────────────────┘
       │                                                                        │
       │ 1:1 (for Officers)                                                     │ 1:1
       ▼                                                                        ▼
┌──────────────┐                                                      ┌──────────────────┐
│   officers   │ <─────────────────────────────────────────────────── │  verification_   │
└──────────────┘                         1:N                          │     results      │
                                                                      └──────────────────┘
                                                                                │
                                                                                │ 1:1 (On Pass)
                                                                                ▼
                                                                      ┌──────────────────┐
                                                                      │   certificates   │
                                                                      └──────────────────┘
```

---

## 📊 Table Specifications

### 1️⃣ `users` Table (Authentication & Access Control)
Stores user accounts for Business Owners, LMD Administrators, and Inspection Officers.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | e.g. `USER-101`, `USER-LMD-01`, `USER-[#OFF-101]` |
| `name` | `VARCHAR(150)` | `NOT NULL` | Full Name (e.g. `Apex Logistics & Freight Corp`, `Sunita Prabhakar`) |
| `email` | `VARCHAR(150)` | `UNIQUE, NOT NULL` | Email address |
| `phone` | `VARCHAR(20)` | `NULLABLE` | Contact phone number |
| `role` | `ENUM` | `NOT NULL` | `'business'`, `'lmd_admin'`, `'officer'` |
| `establishment_name` | `VARCHAR(200)` | `NULLABLE` | Business/Enterprise registered name |
| `state_zone` | `VARCHAR(100)` | `NULLABLE` | Zone region (e.g. `Nagpur Zone`, `Ambala Test Centre`) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Registration timestamp |

---

### 2️⃣ `instruments` Table (Registered Weighing & Measuring Instruments)
Stores master records of instruments registered under the Legal Metrology Act, 2009.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | e.g. `INST-2026-001` |
| `owner_id` | `VARCHAR(50)` | `FOREIGN KEY (users.id)` | Owner User ID |
| `instrument_name` | `VARCHAR(250)` | `NOT NULL` | Full instrument title (e.g. `Heavy Electronic Weighbridge (AV-984210-IN)`) |
| `category` | `ENUM` | `NOT NULL` | `'weighbridge'`, `'retail_scale'`, `'fuel_dispenser'`, `'flowmeter'`, `'package_scale'`, `'lab_balance'` |
| `serial_number` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Hardware serial number |
| `model_number` | `VARCHAR(100)` | `NOT NULL` | OEM Model approval number |
| `manufacturer` | `VARCHAR(150)` | `NOT NULL` | Manufacturing company name |
| `max_capacity` | `VARCHAR(50)` | `NOT NULL` | e.g. `60,000 kg`, `30 kg`, `100 L/min` |
| `accuracy_class` | `VARCHAR(50)` | `NOT NULL` | e.g. `Class III Heavy Industrial`, `Class III Commercial`, `Class I Analytical` |
| `installation_location` | `TEXT` | `NOT NULL` | Physical site address |
| `last_verification_date` | `DATE` | `NULLABLE` | Date of last approved stamping |
| `next_reverification_due`| `DATE` | `NOT NULL` | Due date for periodic re-verification |
| `status` | `ENUM` | `NOT NULL DEFAULT 'active'`| `'active'`, `'expired'`, `'under_verification'`, `'rejected'` |

---

### 3️⃣ `applications` Table (Verification Requests Queue)
Tracks initial verification and periodic re-verification application workflows.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | e.g. `APP-2026-1001` |
| `instrument_id` | `VARCHAR(50)` | `FOREIGN KEY (instruments.id)` | Target instrument ID |
| `applicant_id` | `VARCHAR(50)` | `FOREIGN KEY (users.id)` | Applicant User ID |
| `application_type` | `ENUM` | `NOT NULL` | `'Initial Verification'`, `'Periodic Re-verification'`, `'Re-verification After Stamping/Repair'` |
| `submission_date` | `DATE` | `NOT NULL` | Date submitted by business |
| `preferred_date` | `DATE` | `NOT NULL` | Preferred inspection date |
| `status` | `ENUM` | `NOT NULL DEFAULT 'submitted'` | `'submitted'`, `'under_review'`, `'assigned'`, `'in_progress'`, `'passed'`, `'failed'` |
| `assigned_officer_id` | `VARCHAR(50)` | `FOREIGN KEY (officers.id), NULLABLE` | Assigned inspector ID |
| `assigned_date` | `DATE` | `NULLABLE` | Date assigned by LMD Admin |
| `scheduled_inspection_date` | `DATE` | `NULLABLE` | Scheduled physical inspection date |
| `inspection_location` | `TEXT` | `NOT NULL` | Site location for physical field test |
| `documents` | `JSON` | `NULLABLE` | Array of uploaded files `[{ name, size, url }]` |
| `notes` | `TEXT` | `NULLABLE` | Additional application notes |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 4️⃣ `officers` Table (Inspection Officers & Technical Verifiers)
Stores LMO Inspectors and GATC Technical Verifiers.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | e.g. `OFF-101`, `OFF-102` |
| `user_id` | `VARCHAR(50)` | `FOREIGN KEY (users.id)` | User account reference |
| `name` | `VARCHAR(150)` | `NOT NULL` | Officer Full Name (e.g. `Inspector Rajesh V. Sharma`) |
| `designation` | `VARCHAR(150)` | `NOT NULL` | Title (e.g. `LMO Senior Field Inspector`) |
| `zone` | `VARCHAR(100)` | `NOT NULL` | Jurisdiction Zone (e.g. `Nagpur MIDC Zone`, `Ambala Test Centre`) |
| `type` | `ENUM` | `NOT NULL` | `'LMO'`, `'GATC'` |
| `rating` | `DECIMAL(2,1)` | `DEFAULT 5.0` | Officer performance rating (e.g. `4.9`) |
| `active_assignments_count` | `INT` | `DEFAULT 0` | Current active case load |

---

### 5️⃣ `verification_results` Table (Physical & Technical Inspection Audits)
Stores the physical checklist results, dynamic technical test parameters, evidence photos, and outcome/rejection logs submitted by Officers.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | e.g. `VER-2026-901` |
| `application_id` | `VARCHAR(50)` | `FOREIGN KEY (applications.id), UNIQUE` | Linked Application ID |
| `officer_id` | `VARCHAR(50)` | `FOREIGN KEY (officers.id)` | Inspecting Officer ID |
| `inspection_date` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Execution date and time |
| `checklist_results` | `JSON` | `NOT NULL` | Mandatory checklist: `{"nameplate": true, "model": true, "capacity": true, "accuracy_class": true, "markings": true, "seal": true}` |
| `technical_test_results` | `JSON` | `NOT NULL` | Instrument-specific test fields (see JSON Structure below) |
| `photo_evidence_urls` | `JSON` | `NOT NULL` | Array of image URLs `["instrument_photo.jpg", "nameplate.jpg", "seal.jpg"]` |
| `outcome` | `ENUM` | `NOT NULL` | `'PASS'`, `'FAIL'` |
| `rejection_reason` | `ENUM` | `NULLABLE (Required if outcome='FAIL')` | `'MPE exceeded'`, `'Nameplate mismatch'`, `'Seal damaged'`, `'Required marking missing'`, `'Instrument not functioning'`, `'Other'` |
| `officer_remarks` | `TEXT` | `NOT NULL` | Full observations text |

---

### 6️⃣ `certificates` Table (Issued Legal Metrology QR Certificates)
Stores official digital verification certificates generated for passed instruments.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | e.g. `CERT-2026-8801` |
| `application_id` | `VARCHAR(50)` | `FOREIGN KEY (applications.id), UNIQUE` | Linked Application ID |
| `instrument_id` | `VARCHAR(50)` | `FOREIGN KEY (instruments.id)` | Linked Instrument ID |
| `certificate_number` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Format: `LMD/MH/2026/08801` |
| `issued_date` | `DATE` | `NOT NULL` | Issue date |
| `valid_until` | `DATE` | `NOT NULL` | Expiry date (1 year standard) |
| `issuing_authority` | `VARCHAR(200)` | `NOT NULL` | e.g. `Legal Metrology Department, Govt of Maharashtra` |
| `qr_code_token` | `VARCHAR(255)` | `NOT NULL` | Verification token encoded in QR code |
| `certificate_pdf_url` | `VARCHAR(255)` | `NOT NULL` | PDF document storage path |
| `status` | `ENUM` | `NOT NULL DEFAULT 'valid'` | `'valid'`, `'expired'`, `'revoked'` |

---

## 📦 JSON Data Structure Reference for `technical_test_results`

Depending on the instrument category, the `technical_test_results` JSON column stores:

### 1. Heavy Electronic Weighbridge
```json
{
  "category": "weighbridge",
  "zero_load": "0.0 kg",
  "half_load_eccentricity": "29998.5 kg",
  "max_load_capacity": "59994.0 kg",
  "mpe_result": "PASS - Within Rule 11 MPE Limits"
}
```

### 2. Retail Digital Counter Scale
```json
{
  "category": "retail_scale",
  "zero_indication": "0.000 kg",
  "max_capacity": "29.999 kg",
  "mpe_result": "PASS - Within ±1.5g MPE Class III"
}
```

### 3. Fuel Dispensing Meter
```json
{
  "category": "fuel_dispenser",
  "selected_product": "Petrol",
  "nozzle_id": "NZ-01-PETROL",
  "zero_reset_test": "0.000 L",
  "dispensed_volume": "19.995 L",
  "mpe_result": "PASS - Calculated Error -0.025% (Limit: ±0.20%)"
}
```

### 4. Industrial Liquid Flowmeter
```json
{
  "category": "flowmeter",
  "flow_rate": "498.5 L/min",
  "reference_volume": "1000.0 L",
  "measured_volume": "999.2 L",
  "mpe_result": "PASS - Measurement Error -0.08% (Limit: ±0.15%)"
}
```

### 5. Pre-packaged Check Scale
```json
{
  "category": "package_scale",
  "sample_1_weight": "1.002 kg",
  "sample_2_weight": "0.998 kg",
  "sample_3_weight": "1.001 kg",
  "average_net_weight": "1.0003 kg",
  "mpe_result": "PASS - Within ±1.5g Permissible Error"
}
```

### 6. Precision Laboratory Analytical Balance
```json
{
  "category": "lab_balance",
  "standard_mass": "100.0000 g",
  "observed_mass": "100.0002 g",
  "mpe_result": "PASS - Within Class I ±0.0005g MPE"
}
```
