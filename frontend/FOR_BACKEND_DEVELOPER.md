# 🚀 Database Setup Guide for Backend Developer (MaapSetu Platform)

Hey! To connect our frontend, here are the **6 Database Tables** you need to create in your database (PostgreSQL / MySQL / Supabase / MongoDB).

---

## 📌 Summary: The 6 Tables You Need To Create

1. **`users`** → User accounts for Business Owners, LMD Admins, and Field Inspection Officers.
2. **`instruments`** → Master list of registered weighing & measuring instruments (weighbridges, petrol pumps, scales, balances, flowmeters).
3. **`applications`** → Application requests submitted by businesses for initial or periodic re-verification.
4. **`officers`** → Inspector / Verifier profiles, zones, designations, and ratings.
5. **`verification_results`** → Physical checklist, test results, photo evidence, and failure reasons submitted by Officers.
6. **`certificates`** → Issued QR-stamped Legal Metrology Verification Certificates.

---

## 🛠️ Table Specifications & SQL Snippets

### 1️⃣ `users` Table
```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'USER-101'
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL, -- 'business' | 'lmd_admin' | 'officer'
    establishment_name VARCHAR(200),
    state_zone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2️⃣ `instruments` Table
```sql
CREATE TABLE instruments (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'INST-2026-001'
    owner_id VARCHAR(50) NOT NULL REFERENCES users(id),
    instrument_name VARCHAR(250) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'weighbridge' | 'retail_scale' | 'fuel_dispenser' | 'flowmeter' | 'package_scale' | 'lab_balance'
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    model_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    max_capacity VARCHAR(50) NOT NULL,
    accuracy_class VARCHAR(50) NOT NULL,
    installation_location TEXT NOT NULL,
    last_verification_date DATE,
    next_reverification_due DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'active' -- 'active' | 'expired' | 'under_verification' | 'rejected'
);
```

### 3️⃣ `applications` Table
```sql
CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'APP-2026-1001'
    instrument_id VARCHAR(50) NOT NULL REFERENCES instruments(id),
    applicant_id VARCHAR(50) NOT NULL REFERENCES users(id),
    application_type VARCHAR(100) NOT NULL, -- 'Initial Verification' | 'Periodic Re-verification'
    submission_date DATE NOT NULL,
    preferred_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'submitted', -- 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'passed' | 'failed'
    assigned_officer_id VARCHAR(50),
    assigned_date DATE,
    scheduled_inspection_date DATE,
    inspection_location TEXT NOT NULL,
    documents JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4️⃣ `officers` Table
```sql
CREATE TABLE officers (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'OFF-101'
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'LMO' | 'GATC'
    rating DECIMAL(2,1) DEFAULT 5.0,
    active_assignments_count INT DEFAULT 0
);
```

### 5️⃣ `verification_results` Table
```sql
CREATE TABLE verification_results (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'VER-2026-901'
    application_id VARCHAR(50) UNIQUE NOT NULL REFERENCES applications(id),
    officer_id VARCHAR(50) NOT NULL REFERENCES officers(id),
    inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checklist_results JSON NOT NULL, -- {"nameplate": true, "model": true, "capacity": true, ...}
    technical_test_results JSON NOT NULL, -- Dynamic test fields for the 6 instrument types
    photo_evidence_urls JSON NOT NULL, -- ["photo1.jpg", "photo2.jpg", "photo3.jpg"]
    outcome VARCHAR(10) NOT NULL, -- 'PASS' | 'FAIL'
    rejection_reason VARCHAR(100), -- 'MPE exceeded' | 'Nameplate mismatch' | 'Seal damaged' | 'Required marking missing' | 'Instrument not functioning' | 'Other'
    officer_remarks TEXT NOT NULL
);
```

### 6️⃣ `certificates` Table
```sql
CREATE TABLE certificates (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'CERT-2026-8801'
    application_id VARCHAR(50) UNIQUE NOT NULL REFERENCES applications(id),
    instrument_id VARCHAR(50) NOT NULL REFERENCES instruments(id),
    certificate_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'LMD/MH/2026/08801'
    issued_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    issuing_authority VARCHAR(200) NOT NULL,
    qr_code_token VARCHAR(255) NOT NULL,
    certificate_pdf_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'valid' -- 'valid' | 'expired' | 'revoked'
);
```
