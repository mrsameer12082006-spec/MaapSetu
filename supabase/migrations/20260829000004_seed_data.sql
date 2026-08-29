-- 20260829000004_seed_data.sql

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create auth.users
-- Business User (Vikramaditya Mehta)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('d6b4125b-01a5-48fa-ac41-0b329437ff22', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'v.mehta@apexlogistics.in', crypt('password123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- LMD Admin User (Rajendra Prasad)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('b1c8f1e6-2345-42f0-a38d-19283746ab12', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.ngp@maapsetu.gov.in', crypt('password123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Officer User (Rajesh V. Sharma)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('e9d7c3b2-1094-482a-bc91-283746f5e4d3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r.sharma.lmo@maapsetu.gov.in', crypt('password123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Create profiles
INSERT INTO profiles (id, name, email, phone, role, organization, jurisdiction, is_active)
VALUES
('d6b4125b-01a5-48fa-ac41-0b329437ff22', 'Vikramaditya Mehta', 'v.mehta@apexlogistics.in', '+91 9876543210', 'business', 'Apex Logistics & Freight Corp', NULL, true),
('b1c8f1e6-2345-42f0-a38d-19283746ab12', 'Rajendra Prasad (Admin)', 'admin.ngp@maapsetu.gov.in', '+91 9999988888', 'lmd', 'Legal Metrology Dept', 'Nagpur Division', true),
('e9d7c3b2-1094-482a-bc91-283746f5e4d3', 'Inspector Rajesh V. Sharma', 'r.sharma.lmo@maapsetu.gov.in', '+91 8888877777', 'officer', 'Legal Metrology Dept', 'Nagpur Zone 1', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Create officers
INSERT INTO officers (id, user_id, officer_type, employee_code, designation, zone, phone, email, rating, active_assignments_count)
VALUES
('a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c', 'e9d7c3b2-1094-482a-bc91-283746f5e4d3', 'LMO', 'EMP-LMO-442', 'Legal Metrology Officer', 'Nagpur Zone 1', '+91 8888877777', 'r.sharma.lmo@maapsetu.gov.in', 4.8, 0)
ON CONFLICT (id) DO NOTHING;

-- 4. Create instruments
INSERT INTO instruments (id, owner_id, instrument_name, category, serial_number, model_number, manufacturer, max_capacity, unit_of_measurement, accuracy_class, installation_location, premises_name, state, district)
VALUES
('i1111111-2222-3333-4444-555555555555', 'd6b4125b-01a5-48fa-ac41-0b329437ff22', 'Heavy Electronic Weighbridge', 'weighbridge', 'AV-984210-IN', 'WB-60T-PRO', 'Avery India Ltd', '60000', 'kg', 'Class III', 'Plot 88, MIDC Butibori, Nagpur', 'Apex Warehouse 1', 'Maharashtra', 'Nagpur'),
('i2222222-2222-3333-4444-555555555555', 'd6b4125b-01a5-48fa-ac41-0b329437ff22', 'Retail Digital Counter Scale', 'retail_scale', 'ESS-773-42X', 'DS-852', 'Essae-Teraoka', '30', 'kg', 'Class II', 'Retail Hub, Sitabuldi, Nagpur', 'Apex Retail Point', 'Maharashtra', 'Nagpur')
ON CONFLICT (id) DO NOTHING;
