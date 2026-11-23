-- ====================================================================
-- LABLINK AI: Core PostgreSQL Database Schema with Row Level Security
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    hod_name VARCHAR(255) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    total_labs INTEGER DEFAULT 1,
    allocated_quota INTEGER DEFAULT 500, -- Research hours allocated per semester
    used_quota INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. USER PROFILES TABLE (Linked with Supabase Auth or Local Gateway)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'LAB_MANAGER', 'ADMIN')),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    identifier VARCHAR(100), -- Roll No for student, Employee ID for faculty/staff
    designation VARCHAR(150),
    avatar_url TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. EQUIPMENT & ASSET INVENTORY TABLE
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model_number VARCHAR(100),
    category VARCHAR(100) NOT NULL, -- 'Measurement', 'Prototyping', 'AI & Computing', 'Microscopy', etc.
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
    lab_location VARCHAR(255) NOT NULL,
    total_units INTEGER NOT NULL DEFAULT 1 CHECK (total_units >= 0),
    available_units INTEGER NOT NULL DEFAULT 1 CHECK (available_units >= 0 AND available_units <= total_units),
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    power_requirements VARCHAR(100) DEFAULT 'Standard 230V AC',
    safety_level VARCHAR(50) DEFAULT 'Low' CHECK (safety_level IN ('Low', 'Moderate', 'High', 'Biohazard 2')),
    maintenance_status VARCHAR(50) DEFAULT 'Operational' CHECK (maintenance_status IN ('Operational', 'Maintenance Required', 'Under Calibration')),
    hourly_rate NUMERIC(10, 2) DEFAULT 0.00,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. BOOKINGS & SCHEDULE MATRIX TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    faculty_supervisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    project_name VARCHAR(255) NOT NULL,
    project_thesis_summary TEXT,
    booking_date DATE NOT NULL,
    slot_time VARCHAR(50) NOT NULL, -- e.g. '10:00 AM - 12:00 PM'
    duration_hours INTEGER NOT NULL DEFAULT 2,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
    status_remarks TEXT,
    fairness_priority_score INTEGER DEFAULT 80 CHECK (fairness_priority_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Prevent double-booking constraint for identical equipment, date, and slot
    CONSTRAINT unique_equipment_slot_date UNIQUE(equipment_id, booking_date, slot_time)
);

-- 5. CHECKOUTS & RETURN LEDGER (PHYSICAL CUSTODY)
CREATE TABLE IF NOT EXISTS checkouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL UNIQUE,
    pass_code VARCHAR(100) NOT NULL UNIQUE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    checked_out_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    returned_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'IN_USE' CHECK (status IN ('IN_USE', 'RETURNED', 'OVERDUE')),
    condition_notes TEXT,
    custodian_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- 6. MAINTENANCE & CALIBRATION AUDIT TABLE
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    maintenance_type VARCHAR(100) NOT NULL, -- 'Calibration', 'Hardware Inspection', 'Cleaning', 'Repair'
    issue_description TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    cost NUMERIC(10, 2) DEFAULT 0.00,
    performed_at DATE NOT NULL DEFAULT CURRENT_DATE,
    next_calibration_due DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. AUDIT & TELEMETRY TRAIL TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL, -- 'CREATE_BOOKING', 'APPROVE_BOOKING', 'CHECKOUT_ITEM', etc.
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Equipment: Read-access for everyone; Write-access for Lab Managers & Admins
CREATE POLICY "Public Read Access for Equipment"
    ON equipment FOR SELECT
    USING (true);

-- Bookings: Students can create and view their own bookings
CREATE POLICY "Students View Own Bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = student_id OR EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('FACULTY', 'LAB_MANAGER', 'ADMIN')
    ));

CREATE POLICY "Students Create Bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Enforce: Students CANNOT approve their own bookings
CREATE POLICY "Faculty and Admins Approve Bookings"
    ON bookings FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('FACULTY', 'LAB_MANAGER', 'ADMIN')
    ));
