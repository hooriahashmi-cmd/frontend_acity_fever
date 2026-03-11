-- ============================================================
-- Patient Data Management System — Supabase Setup SQL
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Users table (for login)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text not null,  -- bcrypt hashed
  role text check (role in ('admin','doctor','patient')) not null default 'patient',
  created_at timestamptz default now()
);

-- 2. Patients table
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  contact text,
  gender text,
  address text,
  age int,
  medical_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Doctors table
create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialization text,
  contact text,
  created_at timestamptz default now()
);

-- 4. Appointments table
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete set null,
  patient_id uuid references patients(id) on delete cascade,
  fee numeric default 0,
  date_time timestamptz,
  status text default 'Active',
  created_at timestamptz default now()
);

-- 5. Medical history table
create table if not exists medical_history (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  blood_pressure text,
  weight text,
  blood_sugar text,
  temperature text,
  prescription text,
  visit_date date default current_date,
  created_at timestamptz default now()
);

-- ============================================================
-- SAMPLE SEED DATA (optional — helps test the app quickly)
-- ============================================================

-- Sample patients
insert into patients (name, email, contact, gender, address, age, medical_notes) values
  ('Ojay Kunle', 'ojay@example.com', '4558968789', 'Female', '17 Block J-127, Ikeja, Lagos', 26, 'She is a diabetic patient.'),
  ('Muna Chuku', 'muna@example.com', '979797979', 'Male', '5 Oak Street, Abuja', 32, null),
  ('Mazi Okorie', 'mazi@example.com', '9878978798', 'Male', '22 Palm Close, Port Harcourt', 45, null),
  ('John Kestler', 'john@example.com', '1234567890', 'Male', '9 Cedar Ave, Lagos', 38, null);

-- Sample doctors
insert into doctors (name, specialization, contact) values
  ('Michael Olon', 'Dermatologist', '08011111111'),
  ('Solo Makinde', 'Pathologist', '08022222222'),
  ('Henry Ukoh', 'Surgery', '08033333333'),
  ('Sunday Utoro', 'Family Medicine', '08044444444'),
  ('James Akon', 'Dentist', '08055555555');

-- Sample medical history (for patient 1 — Ojay Kunle)
-- Note: Replace the patient_id with the actual UUID after running the insert above
-- or use a subquery like shown below:
insert into medical_history (patient_id, blood_pressure, weight, blood_sugar, temperature, prescription, visit_date)
select id, '120/80', '56 kg', '95/120', '98°F', 'Blood pressure is high. 1-tab daily.', '2019-11-06'
from patients where name = 'Ojay Kunle';

insert into medical_history (patient_id, blood_pressure, weight, blood_sugar, temperature, prescription, visit_date)
select id, '90/120', '57 kg', '56/120', '102°F', 'Viral 1 - ggh-fhh 2 b/daily', '2019-11-07'
from patients where name = 'Ojay Kunle';

-- ============================================================
-- NOTE: Do NOT add users here — create them via the /auth/seed
-- API endpoint instead (it will hash passwords correctly).
-- ============================================================
