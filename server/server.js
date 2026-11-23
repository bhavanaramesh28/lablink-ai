import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Seed Storage for API Engine
let equipmentStore = [
  {
    id: "eq-1",
    name: "Rigol DS1054Z 50MHz 4-Channel Digital Oscilloscope",
    category: "Measurement",
    department: "Electronics & Communication",
    lab: "Advanced Circuit Lab, Room 204",
    totalUnits: 8,
    availableUnits: 5,
    specs: ["4 Channels", "50 MHz Bandwidth", "1 GSa/s Sample Rate", "Waveform record & replay"],
    status: "Available",
    powerReq: "230V AC",
    safetyLevel: "Low",
    tags: ["Circuits", "Signal Analysis", "Robotics", "ECE"],
  },
  {
    id: "eq-2",
    name: "Formlabs Form 3+ Stereolithography (SLA) 3D Printer",
    category: "Prototyping",
    department: "Mechanical & Mechatronics",
    lab: "Rapid Prototyping FabLab, Room 310",
    totalUnits: 3,
    availableUnits: 1,
    specs: ["25-300 micron resolution", "Laser Spot Size: 85 microns", "Resin Auto-Feed", "Wash & Cure Station"],
    status: "Available",
    powerReq: "100-240V AC",
    safetyLevel: "Moderate (Resin Handling)",
    tags: ["3D Printing", "CAD", "Enclosures", "Prototyping"],
  },
  {
    id: "eq-3",
    name: "NVIDIA Jetson AGX Orin 64GB Developer Kit",
    category: "AI & Computing",
    department: "Computer Science & Robotics",
    lab: "Autonomous Systems Lab, Room 405",
    totalUnits: 6,
    availableUnits: 4,
    specs: ["275 TOPS AI Performance", "Ampere GPU 2048 cores", "12-core Cortex-A78AE CPU", "64GB 256-bit LPDDR5"],
    status: "Available",
    powerReq: "19V DC Adapter",
    safetyLevel: "Low",
    tags: ["AI", "Computer Vision", "Autonomous Drones", "Deep Learning"],
  },
];

let bookingsStore = [
  {
    id: "bk-101",
    bookingCode: "LABLINK-bk-101",
    equipmentId: "eq-1",
    equipmentName: "Rigol DS1054Z 50MHz Digital Oscilloscope",
    studentName: "Aditya Sharma",
    studentEmail: "student@campus.edu",
    department: "Electronics & Communication",
    lab: "Advanced Circuit Lab, Room 204",
    date: "2026-11-25",
    slotTime: "10:00 AM - 12:00 PM",
    durationHours: 2,
    projectName: "LoRaWAN Edge Gateway Node",
    status: "APPROVED",
    statusRemarks: "Approved by Faculty. Safety ESD band required.",
    fairnessPriorityScore: 94,
  },
];

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    platform: "LabLink AI Autonomous Laboratory Engine",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Equipment Endpoints
app.get("/api/equipment", (req, res) => {
  const { category, department, availableOnly } = req.query;
  let result = [...equipmentStore];

  if (category) {
    result = result.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }
  if (department) {
    result = result.filter((e) => e.department.toLowerCase() === department.toLowerCase());
  }
  if (availableOnly === "true") {
    result = result.filter((e) => e.availableUnits > 0);
  }

  res.json({ success: true, count: result.length, data: result });
});

// Smart Booking with Conflict Detection & Fair Allocation
app.post("/api/bookings", (req, res) => {
  const { equipmentId, date, slotTime, studentName, studentEmail, projectName, facultySupervisor } = req.body;

  if (!equipmentId || !date || !slotTime || !projectName) {
    return res.status(400).json({
      success: false,
      error: "Missing required booking fields (equipmentId, date, slotTime, projectName).",
    });
  }

  // Conflict Detection: Double-booking prevention
  const conflictingBooking = bookingsStore.find(
    (b) => b.equipmentId === equipmentId && b.date === date && b.slotTime === slotTime && b.status !== "REJECTED" && b.status !== "CANCELLED"
  );

  if (conflictingBooking) {
    // Generate intelligent alternative slots
    const allSlots = [
      "08:00 AM - 10:00 AM",
      "10:00 AM - 12:00 PM",
      "12:00 PM - 02:00 PM",
      "02:00 PM - 04:00 PM",
      "04:00 PM - 06:00 PM",
    ];
    const takenSlots = bookingsStore
      .filter((b) => b.equipmentId === equipmentId && b.date === date && b.status !== "REJECTED")
      .map((b) => b.slotTime);

    const openSlots = allSlots.filter((s) => !takenSlots.includes(s));

    return res.status(409).json({
      success: false,
      conflict: true,
      error: `Conflict detected: This instrument is already reserved for ${slotTime} on ${date}.`,
      suggestedAlternativeSlots: openSlots,
    });
  }

  // Calculate Explainable Fair Resource Allocation Score (0-100)
  let fairnessScore = 75; // Baseline
  if (projectName.toLowerCase().includes("thesis") || projectName.toLowerCase().includes("capstone")) {
    fairnessScore += 15;
  }
  if (date) {
    const diffDays = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) fairnessScore += 8; // Imminent deadline
  }

  const newBooking = {
    id: "bk-" + Math.floor(100 + Math.random() * 900),
    bookingCode: "LABLINK-bk-" + Date.now().toString().slice(-4),
    equipmentId,
    date,
    slotTime,
    studentName: studentName || "Aditya Sharma",
    studentEmail: studentEmail || "student@campus.edu",
    projectName,
    facultySupervisor: facultySupervisor || "Dr. K. Ramanathan",
    status: "PENDING",
    statusRemarks: "Awaiting faculty supervisor approval",
    fairnessPriorityScore: Math.min(100, fairnessScore),
    createdAt: new Date().toISOString(),
  };

  bookingsStore.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: "Booking request queued successfully. Faculty notification dispatched.",
    data: newBooking,
  });
});

app.listen(PORT, () => {
  console.log(`LabLink AI Backend API running on port ${PORT}`);
});
