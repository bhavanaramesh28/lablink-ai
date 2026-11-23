-- ====================================================================
-- LABLINK AI: Comprehensive University Seed Data
-- ====================================================================

-- 1. Insert Departments
INSERT INTO departments (id, name, code, hod_name, building, floor, total_labs, allocated_quota, used_quota) VALUES
('d1111111-1111-1111-1111-111111111111', 'Electronics & Communication', 'ECE', 'Dr. S. V. Raghavan', 'Aryabhata Technology Block', 'Floor 2', 4, 600, 310),
('d2222222-2222-2222-2222-222222222222', 'Computer Science & Robotics', 'CSE', 'Dr. Radhika Kulkarni', 'Turing Computational Complex', 'Floor 4', 5, 800, 540),
('d3333333-3333-3333-3333-333333333333', 'Mechanical & Mechatronics', 'MECH', 'Prof. Harish Nair', 'Visvesvaraya Engineering Core', 'Floor 1', 3, 500, 280),
('d4444444-4444-4444-4444-444444444444', 'Biotechnology & Life Sciences', 'BIOTECH', 'Dr. Ananya Sen', 'Bose Bioscience Center', 'Floor 1', 3, 400, 195),
('d5555555-5555-5555-5555-555555555555', 'Chemical & Materials Science', 'MATSCI', 'Dr. M. K. Pandey', 'C.V. Raman Science Wing', 'Ground Floor', 3, 450, 160)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Profiles
INSERT INTO profiles (id, email, name, role, department_id, identifier, designation, avatar_url, two_factor_enabled) VALUES
('u1111111-1111-1111-1111-111111111111', 'student@campus.edu', 'Aditya Sharma', 'STUDENT', 'd1111111-1111-1111-1111-111111111111', '22EC042', 'B.Tech 3rd Year Researcher', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', false),
('u2222222-2222-2222-2222-222222222222', 'faculty@campus.edu', 'Dr. K. Ramanathan', 'FACULTY', 'd1111111-1111-1111-1111-111111111111', 'FAC-804', 'Associate Professor & Lab Director', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', true),
('u3333333-3333-3333-3333-333333333333', 'manager@campus.edu', 'Vikram Malhotra', 'LAB_MANAGER', 'd3333333-3333-3333-3333-333333333333', 'MGR-102', 'Chief Laboratory Custodian', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', true),
('u4444444-4444-4444-4444-444444444444', 'admin@campus.edu', 'Dean Dr. Anita Deshmukh', 'ADMIN', NULL, 'ADM-001', 'Dean of Academic Research & Innovation', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Calibrated Equipment
INSERT INTO equipment (id, name, model_number, category, department_id, lab_location, total_units, available_units, specifications, power_requirements, safety_level, maintenance_status, tags) VALUES
('e1111111-1111-1111-1111-111111111111', 'Rigol DS1054Z 50MHz 4-Channel Digital Oscilloscope', 'DS1054Z', 'Measurement', 'd1111111-1111-1111-1111-111111111111', 'Advanced Circuit Lab, Room 204', 8, 5, '{"channels": 4, "bandwidth": "50 MHz", "sample_rate": "1 GSa/s", "memory_depth": "24 Mpts"}'::jsonb, '230V AC', 'Low', 'Operational', ARRAY['Circuits', 'Signal Analysis', 'Robotics', 'ECE']),
('e2222222-2222-2222-2222-222222222222', 'Formlabs Form 3+ Stereolithography (SLA) 3D Printer', 'FORM-3P', 'Prototyping', 'd3333333-3333-3333-3333-333333333333', 'Rapid Prototyping FabLab, Room 310', 3, 1, '{"xy_resolution": "25 microns", "laser_spot": "85 microns", "build_volume": "14.5 x 14.5 x 18.5 cm"}'::jsonb, '100-240V AC', 'Moderate', 'Operational', ARRAY['3D Printing', 'CAD', 'Enclosures', 'Prototyping']),
('e3333333-3333-3333-3333-333333333333', 'NVIDIA Jetson AGX Orin 64GB Developer Kit', 'JET-ORIN-64', 'AI & Computing', 'd2222222-2222-2222-2222-222222222222', 'Autonomous Systems Lab, Room 405', 6, 4, '{"ai_performance": "275 TOPS", "gpu": "2048-core Ampere", "cpu": "12-core Cortex-A78AE", "ram": "64GB LPDDR5"}'::jsonb, '19V DC Adapter', 'Low', 'Operational', ARRAY['AI', 'Computer Vision', 'Autonomous Drones', 'Deep Learning']),
('e4444444-4444-4444-4444-444444444444', 'Olympus CX23 LED Binocular Biological Microscope', 'CX23-LEDRFS2', 'Microscopy', 'd4444444-4444-4444-4444-444444444444', 'Cellular Biology Lab, Room 102', 12, 9, '{"magnification": "40X - 1000X", "optics": "Plan Achromat", "illumination": "0.5W LED"}'::jsonb, 'Standard AC', 'Low', 'Operational', ARRAY['Cell Biology', 'Biotech', 'Pathology', 'Samples']),
('e5555555-5555-5555-5555-555555555555', 'Siglent SDG2042X 40MHz Dual-Channel Arbitrary Function Generator', 'SDG2042X', 'Measurement', 'd1111111-1111-1111-1111-111111111111', 'Communications Engineering Lab, Room 208', 5, 3, '{"bandwidth": "40 MHz", "sampling_rate": "1.2 GSa/s", "vertical_resolution": "16-bit"}'::jsonb, '230V AC', 'Low', 'Operational', ARRAY['RF', 'Modulation', 'Waveforms', 'Circuits']),
('e6666666-6666-6666-6666-666666666666', 'Thermo Fisher NanoDrop One Microvolume UV-Vis Spectrophotometer', 'ND-ONE-W', 'Measurement', 'd4444444-4444-4444-4444-444444444444', 'Molecular Biology Core, Room 114', 2, 2, '{"wavelength_range": "190-850 nm", "pathlength": "0.03-1 mm auto-ranging", "sample_volume": "1-2 uL"}'::jsonb, '12V DC', 'Moderate', 'Operational', ARRAY['DNA', 'RNA', 'Protein', 'Spectroscopy']),
('e7777777-7777-7777-7777-777777777777', 'FLIR E8-XT High-Resolution Infrared Thermal Camera', 'FLIR-E8XT', 'Optics', 'd1111111-1111-1111-1111-111111111111', 'Thermal Diagnostics Lab, Room 212', 4, 3, '{"ir_resolution": "320 x 240", "thermal_sensitivity": "< 0.05 C", "temp_range": "-20 to 550 C"}'::jsonb, 'Li-Ion Battery', 'Low', 'Operational', ARRAY['Thermal', 'PCB Inspection', 'Heat Dissipation']),
('e8888888-8888-8888-8888-888888888888', 'Bantam Tools Desktop High-Precision CNC PCB Milling Machine', 'BT-CNC-V2', 'Fabrication', 'd3333333-3333-3333-3333-333333333333', 'Makerspace Fabrication, Room 302', 2, 1, '{"spindle_speed": "10000 - 28000 RPM", "repeatability": "< 0.001 in", "trace_clearance": "6 mil"}'::jsonb, '110-240V AC', 'High', 'Operational', ARRAY['PCB', 'Milling', 'Prototyping', 'Hardware'])
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Initial Bookings with Fair Allocation Scores
INSERT INTO bookings (id, booking_code, equipment_id, student_id, faculty_supervisor_id, project_name, project_thesis_summary, booking_date, slot_time, duration_hours, status, status_remarks, fairness_priority_score) VALUES
('b1111111-1111-1111-1111-111111111111', 'LABLINK-bk-101', 'e1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'LoRaWAN Edge Gateway Node', 'Debugging SPI bus timings and RF transceiver harmonics.', '2026-11-25', '10:00 AM - 12:00 PM', 2, 'APPROVED', 'Approved. Safety ESD band required.', 94),
('b2222222-2222-2222-2222-222222222222', 'LABLINK-bk-102', 'e3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'Autonomous Agricultural Drone', 'Testing TensorRT model quantization on Orin GPU.', '2026-11-26', '02:00 PM - 04:00 PM', 2, 'PENDING', 'Awaiting faculty safety review for indoor flight test.', 88)
ON CONFLICT (id) DO NOTHING;
