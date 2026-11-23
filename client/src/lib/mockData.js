// LabLink AI - Dynamic In-Memory & LocalStorage Mock State Store

export const INITIAL_EQUIPMENT = [
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
  {
    id: "eq-4",
    name: "Olympus CX23 LED Binocular Microscope",
    category: "Microscopy",
    department: "Biotechnology & Life Sciences",
    lab: "Cellular Biology Lab, Room 102",
    totalUnits: 12,
    availableUnits: 9,
    specs: ["Magnification: 40X - 1000X", "Built-in LED illumination", "Plan Achromat objectives", "Ergonomic grips"],
    status: "Available",
    powerReq: "Standard AC",
    safetyLevel: "Low",
    tags: ["Cell Biology", "Biotech", "Pathology", "Samples"],
  },
  {
    id: "eq-5",
    name: "Keysight 33500B Trueform Waveform Generator",
    category: "Signal Processing",
    department: "Electronics & Communication",
    lab: "RF & Signal Lab, Room 208",
    totalUnits: 4,
    availableUnits: 2,
    specs: ["30 MHz Sine/Square", "1 or 2 channels", "16-bit arbitrary waveform", "Ultra-low jitter < 40ps"],
    status: "Available",
    powerReq: "230V AC",
    safetyLevel: "Low",
    tags: ["RF", "Synthesizer", "Modulation", "Audio"],
  },
  {
    id: "eq-6",
    name: "Shimadzu UV-1900i Double-Beam UV-Vis Spectrophotometer",
    category: "Spectroscopy",
    department: "Chemical & Materials",
    lab: "Spectroscopy Analytical Suite, Room 114",
    totalUnits: 2,
    availableUnits: 1,
    specs: ["Wavelength: 190 to 1100 nm", "Spectral Bandwidth: 1 nm", "Ultra-fast scan 29,000 nm/min", "Compliance USB control"],
    status: "Available",
    powerReq: "230V AC",
    safetyLevel: "Moderate",
    tags: ["Spectroscopy", "Chemical Analysis", "Kinetics", "Nanomaterials"],
  },
  {
    id: "eq-7",
    name: "FLIR E8-XT High-Resolution Thermal Imaging Camera",
    category: "Thermal Imaging",
    department: "Physics & Engineering",
    lab: "Optics & Thermal Lab, Room 215",
    totalUnits: 4,
    availableUnits: 3,
    specs: ["320 x 240 IR Resolution", "Temperature range: -20°C to 550°C", "MSX thermal image enhancement", "Wi-Fi data logging"],
    status: "Available",
    powerReq: "Rechargeable Li-Ion",
    safetyLevel: "Low",
    tags: ["Heat Dissipation", "Thermal", "PCB Inspection", "Physics"],
  },
  {
    id: "eq-8",
    name: "Bantam Tools Desktop CNC PCB Milling Machine",
    category: "Fabrication",
    department: "Mechatronics & Robotics",
    lab: "Makerspace Fabrication, Room 302",
    totalUnits: 2,
    availableUnits: 2,
    specs: ["Spindle: 28,000 RPM", "Trace isolation: 0.006 in", "Precision dual-sided alignment", "G-code ready"],
    status: "Available",
    powerReq: "110-240V AC",
    safetyLevel: "High (Protective Eyewear Required)",
    tags: ["PCB", "CNC", "Rapid Prototyping", "Hardware"],
  },
];

export const INITIAL_BOOKINGS = [
  {
    id: "bk-101",
    equipmentId: "eq-1",
    equipmentName: "Rigol DS1054Z 50MHz Digital Oscilloscope",
    studentName: "Aditya Sharma",
    studentEmail: "aditya.s@campus.edu",
    department: "Electronics & Communication",
    lab: "Advanced Circuit Lab, Room 204",
    date: "2026-11-25",
    slotTime: "10:00 AM - 12:00 PM",
    durationHours: 2,
    projectName: "High-Frequency PWM Motor Controller with Regenerative Braking",
    facultySupervisor: "Dr. K. Ramanathan",
    status: "APPROVED",
    statusRemarks: "Approved. Make sure to bring your calibrated probes.",
    createdAt: "2026-11-21T09:30:00Z",
  },
  {
    id: "bk-102",
    equipmentId: "eq-3",
    equipmentName: "NVIDIA Jetson AGX Orin Developer Kit",
    studentName: "Priya Nair",
    studentEmail: "priya.n@campus.edu",
    department: "Computer Science & Robotics",
    lab: "Autonomous Systems Lab, Room 405",
    date: "2026-11-26",
    slotTime: "02:00 PM - 05:00 PM",
    durationHours: 3,
    projectName: "Real-time Autonomous Quadcopter Obstacle Avoidance via TensorRT",
    facultySupervisor: "Prof. Meera Sen",
    status: "PENDING",
    statusRemarks: "Pending faculty safety verification",
    createdAt: "2026-11-22T14:15:00Z",
  },
  {
    id: "bk-103",
    equipmentId: "eq-2",
    equipmentName: "Formlabs Form 3+ Stereolithography 3D Printer",
    studentName: "Rohan Verma",
    studentEmail: "rohan.v@campus.edu",
    department: "Mechanical & Mechatronics",
    lab: "Rapid Prototyping FabLab, Room 310",
    date: "2026-11-27",
    slotTime: "11:30 AM - 01:30 PM",
    durationHours: 2,
    projectName: "Biomimetic Prosthetic Hand Enclosure with Flexure Joints",
    facultySupervisor: "Dr. Sandeep Joshi",
    status: "APPROVED",
    statusRemarks: "Approved. Standard Clear V4 resin provided.",
    createdAt: "2026-11-20T11:00:00Z",
  },
  {
    id: "bk-104",
    equipmentId: "eq-8",
    equipmentName: "Bantam Tools Desktop CNC PCB Milling Machine",
    studentName: "Kavya Menon",
    studentEmail: "kavya.m@campus.edu",
    department: "Mechatronics & Robotics",
    lab: "Makerspace Fabrication, Room 302",
    date: "2026-11-28",
    slotTime: "09:00 AM - 11:00 AM",
    durationHours: 2,
    projectName: "Sub-GHz LoRa Mesh Sensor Node Transceiver Board",
    facultySupervisor: "Dr. K. Ramanathan",
    status: "PENDING",
    statusRemarks: "Under review",
    createdAt: "2026-11-23T08:00:00Z",
  },
];

export const TIME_SLOTS = [
  "08:30 AM - 10:30 AM",
  "10:30 AM - 12:30 PM",
  "01:30 PM - 03:30 PM",
  "03:30 PM - 05:30 PM",
  "05:30 PM - 07:30 PM",
];

export const DEPARTMENTS = [
  "All Departments",
  "Electronics & Communication",
  "Computer Science & Robotics",
  "Mechanical & Mechatronics",
  "Biotechnology & Life Sciences",
  "Chemical & Materials",
  "Physics & Engineering",
];

// Helper to access equipment list
export function getEquipmentList() {
  try {
    const saved = localStorage.getItem("lablink_equipment");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to read equipment from localStorage", e);
  }
  return INITIAL_EQUIPMENT;
}

export function saveEquipmentList(list) {
  try {
    localStorage.setItem("lablink_equipment", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save equipment to localStorage", e);
  }
}

export function addEquipmentItem(newItem) {
  const current = getEquipmentList();
  const created = {
    id: "eq-" + Date.now(),
    availableUnits: newItem.totalUnits,
    status: "Available",
    ...newItem,
  };
  const updated = [created, ...current];
  saveEquipmentList(updated);
  return created;
}

// Helper to access bookings list
export function getBookingsList() {
  try {
    const saved = localStorage.getItem("lablink_bookings");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to read bookings from localStorage", e);
  }
  return INITIAL_BOOKINGS;
}

export function saveBookingsList(list) {
  try {
    localStorage.setItem("lablink_bookings", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save bookings to localStorage", e);
  }
}

export function createBooking(data) {
  const current = getBookingsList();
  const newBooking = {
    id: "bk-" + Math.floor(100 + Math.random() * 900),
    status: "PENDING",
    statusRemarks: "Awaiting faculty supervisor approval",
    createdAt: new Date().toISOString(),
    ...data,
  };
  const updated = [newBooking, ...current];
  saveBookingsList(updated);

  // Decrement equipment available count
  const allEquipment = getEquipmentList();
  const eqIndex = allEquipment.findIndex((e) => e.id === data.equipmentId);
  if (eqIndex >= 0 && allEquipment[eqIndex].availableUnits > 0) {
    allEquipment[eqIndex].availableUnits -= 1;
    saveEquipmentList(allEquipment);
  }

  return newBooking;
}

export function updateBookingStatus(id, newStatus, remarks = "") {
  const current = getBookingsList();
  const updated = current.map((b) => {
    if (b.id === id) {
      return {
        ...b,
        status: newStatus,
        statusRemarks: remarks || (newStatus === "APPROVED" ? "Approved by Faculty" : "Declined by Faculty"),
      };
    }
    return b;
  });
  saveBookingsList(updated);
  return updated;
}

// AI Project Analyzer simulation (Claude API model)
export function analyzeProjectWithAI(prompt) {
  const lower = prompt.toLowerCase();
  const allEquipment = getEquipmentList();

  const matched = [];
  let safety = [];
  let labSpaces = [];
  let summary = "";

  if (lower.includes("drone") || lower.includes("robot") || lower.includes("autonomous") || lower.includes("vision")) {
    const orin = allEquipment.find((e) => e.id === "eq-3");
    const osc = allEquipment.find((e) => e.id === "eq-1");
    const print = allEquipment.find((e) => e.id === "eq-2");
    if (orin) matched.push({ ...orin, reason: "Runs onboard real-time neural network & SLAM pipelines." });
    if (print) matched.push({ ...print, reason: "Custom lightweight carbon/resin motor brackets and landing gear." });
    if (osc) matched.push({ ...osc, reason: "Debug ESC motor PWM timing signals and I2C/SPI sensor noise." });

    labSpaces = ["Autonomous Systems Lab (Room 405)", "FabLab Flight Cage (Room 310)"];
    safety = [
      "Remove drone propellers during indoor bench calibration.",
      "Inspect LiPo batteries before connecting to power distribution boards.",
    ];
    summary = `Your autonomous project requires edge AI compute for perception, precision additive manufacturing for structural frame components, and high-frequency instrumentation to diagnose signal jitter.`;
  } else if (lower.includes("bio") || lower.includes("cell") || lower.includes("dna") || lower.includes("gene") || lower.includes("culture")) {
    const micro = allEquipment.find((e) => e.id === "eq-4");
    const spectro = allEquipment.find((e) => e.id === "eq-6");
    if (micro) matched.push({ ...micro, reason: "Optical confirmation of cellular morphology and confluence." });
    if (spectro) matched.push({ ...spectro, reason: "Optical density OD600 optical measurements of sample purity." });

    labSpaces = ["Cellular Biology Lab (Room 102)", "Analytical Suite (Room 114)"];
    safety = [
      "Biosafety Level 1/2 PPE compliance mandatory (lab coat, nitrile gloves, safety goggles).",
      "Autoclave biohazard disposal required for all pipettes and culture tubes.",
    ];
    summary = `Your biological exploration demands high-magnification optical inspection coupled with quantitative spectrophotometric concentration verification.`;
  } else if (lower.includes("circuit") || lower.includes("pcb") || lower.includes("sensor") || lower.includes("iot") || lower.includes("lora")) {
    const osc = allEquipment.find((e) => e.id === "eq-1");
    const wave = allEquipment.find((e) => e.id === "eq-5");
    const cnc = allEquipment.find((e) => e.id === "eq-8");
    const flir = allEquipment.find((e) => e.id === "eq-7");
    if (cnc) matched.push({ ...cnc, reason: "Rapid in-house dual-sided PCB isolation milling." });
    if (osc) matched.push({ ...osc, reason: "Verifying logic levels, SPI/UART waveforms, and decoupling stability." });
    if (wave) matched.push({ ...wave, reason: "Simulate sensor analog excitation inputs." });
    if (flir) matched.push({ ...flir, reason: "Thermal inspection of voltage regulators and hot spots." });

    labSpaces = ["Makerspace Fabrication (Room 302)", "Advanced Circuit Lab (Room 204)"];
    safety = [
      "Wear polycarbonate eye shields when operating high-speed CNC spindle (28,000 RPM).",
      "Ensure proper bench ventilation during flux soldering.",
    ];
    summary = `Your IoT/Hardware design requires rapid board fabrication, power rail thermal diagnosis, and multi-channel logic analysis.`;
  } else {
    // Default balanced recommendation
    const osc = allEquipment.find((e) => e.id === "eq-1");
    const print = allEquipment.find((e) => e.id === "eq-2");
    const flir = allEquipment.find((e) => e.id === "eq-7");
    if (osc) matched.push({ ...osc, reason: "Core electrical diagnostic instrument for project sensors and power rails." });
    if (print) matched.push({ ...print, reason: "Custom mounting fixtures and protective structural chassis." });
    if (flir) matched.push({ ...flir, reason: "Verify safe thermal operating limits across prototype load." });

    labSpaces = ["Makerspace Fabrication (Room 302)", "Advanced Circuit Lab (Room 204)"];
    safety = ["Adhere to general campus lab electrical safety and ESD grounding guidelines."];
    summary = `Based on your requirements, Claude recommends cross-departmental access to digital waveform diagnostic instruments and precision 3D rapid prototyping.`;
  }

  return {
    summary,
    recommendedEquipment: matched,
    labSpaces,
    safety,
    estimatedTotalHours: 8,
    feasibilityScore: "94% Match Available",
  };
}

// -------------------------------------------------------------
// NOTIFICATIONS SYSTEM
// -------------------------------------------------------------

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    role: "STUDENT",
    title: "Slot Request Approved",
    message: "Dr. K. Ramanathan approved your reservation for Rigol DS1054Z Oscilloscope on 25 Nov, 10:00 AM.",
    time: "12 mins ago",
    type: "APPROVAL",
    read: false,
    actionUrl: "/student/checkout",
  },
  {
    id: "notif-2",
    role: "STUDENT",
    title: "Digital Hardware Pass Ready",
    message: "Your QR Entry Pass for Formlabs Form 3+ SLA 3D Printer is active. Show it at FabLab Desk 310.",
    time: "1 hour ago",
    type: "INFO",
    read: false,
    actionUrl: "/student/checkout",
  },
  {
    id: "notif-3",
    role: "STUDENT",
    title: "Optics Facility Calibration Complete",
    message: "FLIR E8-XT High-Res Thermal Camera passed recertification and is ready for booking.",
    time: "Yesterday",
    type: "ALERT",
    read: true,
    actionUrl: "/student/equipment",
  },
  {
    id: "notif-4",
    role: "FACULTY",
    title: "New Student Booking Request",
    message: "Priya Nair submitted a request for NVIDIA Jetson AGX Orin (Autonomous Quadcopter).",
    time: "2 hours ago",
    type: "REQUEST",
    read: false,
    actionUrl: "/faculty/requests",
  },
  {
    id: "notif-5",
    role: "FACULTY",
    title: "Safety Clearance Acknowledged",
    message: "Kavya Menon confirmed PPE safety protocol for Bantam Desktop CNC Milling.",
    time: "Yesterday",
    type: "INFO",
    read: true,
    actionUrl: "/faculty/requests",
  },
  {
    id: "notif-6",
    role: "LAB_MANAGER",
    title: "Equipment Checkout Requested",
    message: "Aditya Sharma arrived at Room 204 to check out Rigol DS1054Z (Pass: LABLINK-bk-101).",
    time: "25 mins ago",
    type: "REQUEST",
    read: false,
    actionUrl: "/manager/checkouts",
  },
];

export function getNotificationsList() {
  try {
    const saved = localStorage.getItem("lablink_notifications");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to read notifications", e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotificationsList(list) {
  try {
    localStorage.setItem("lablink_notifications", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
}

export function markNotificationRead(id) {
  const current = getNotificationsList();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotificationsList(updated);
  return updated;
}

export function markAllNotificationsRead(role = null) {
  const current = getNotificationsList();
  const updated = current.map((n) => (role ? (n.role === role ? { ...n, read: true } : n) : { ...n, read: true }));
  saveNotificationsList(updated);
  return updated;
}

// -------------------------------------------------------------
// CHECKOUTS & RETURNS SYSTEM
// -------------------------------------------------------------

export const INITIAL_CHECKOUTS = [
  {
    id: "chk-001",
    bookingId: "bk-101",
    passCode: "LABLINK-bk-101",
    equipmentId: "eq-1",
    equipmentName: "Rigol DS1054Z 50MHz Digital Oscilloscope",
    studentName: "Aditya Sharma",
    studentEmail: "student@campus.edu",
    department: "Electronics & Communication",
    lab: "Advanced Circuit Lab, Room 204",
    checkedOutAt: "2026-11-23T10:00:00Z",
    dueAt: "2026-11-23T14:00:00Z",
    status: "IN_USE",
    condition: "Good physical condition. Calibration seal intact.",
    custodian: "Vikram Malhotra",
  },
  {
    id: "chk-002",
    bookingId: "bk-103",
    passCode: "LABLINK-bk-103",
    equipmentId: "eq-2",
    equipmentName: "Formlabs Form 3+ Stereolithography 3D Printer",
    studentName: "Rohan Verma",
    studentEmail: "rohan.v@campus.edu",
    department: "Mechanical & Mechatronics",
    lab: "Rapid Prototyping FabLab, Room 310",
    checkedOutAt: "2026-11-22T11:30:00Z",
    dueAt: "2026-11-22T13:30:00Z",
    returnedAt: "2026-11-22T13:25:00Z",
    status: "RETURNED",
    condition: "Returned clean. Resin vat washed and capped.",
    custodian: "Vikram Malhotra",
  },
];

export function getCheckoutsList() {
  try {
    const saved = localStorage.getItem("lablink_checkouts");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to read checkouts", e);
  }
  return INITIAL_CHECKOUTS;
}

export function saveCheckoutsList(list) {
  try {
    localStorage.setItem("lablink_checkouts", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save checkouts", e);
  }
}

export function processNewCheckout(booking) {
  const current = getCheckoutsList();
  const newCheckout = {
    id: "chk-" + Math.floor(100 + Math.random() * 900),
    bookingId: booking.id,
    passCode: "LABLINK-" + booking.id,
    equipmentId: booking.equipmentId,
    equipmentName: booking.equipmentName,
    studentName: booking.studentName,
    studentEmail: booking.studentEmail || "student@campus.edu",
    department: booking.department,
    lab: booking.lab,
    checkedOutAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + (booking.durationHours || 2) * 3600000).toISOString(),
    status: "IN_USE",
    condition: "Verified by custodian upon student presentation of QR pass.",
    custodian: "Vikram Malhotra",
  };
  const updated = [newCheckout, ...current];
  saveCheckoutsList(updated);
  return newCheckout;
}

export function processReturn(checkoutId, returnNotes = "") {
  const current = getCheckoutsList();
  const updated = current.map((c) => {
    if (c.id === checkoutId) {
      return {
        ...c,
        status: "RETURNED",
        returnedAt: new Date().toISOString(),
        condition: returnNotes || "Returned in good working order. Calibrated and cleaned.",
      };
    }
    return c;
  });
  saveCheckoutsList(updated);

  // Restore available unit count
  const matched = current.find((c) => c.id === checkoutId);
  if (matched) {
    const allEq = getEquipmentList();
    const idx = allEq.findIndex((e) => e.id === matched.equipmentId);
    if (idx >= 0) {
      allEq[idx].availableUnits = Math.min(allEq[idx].totalUnits, allEq[idx].availableUnits + 1);
      saveEquipmentList(allEq);
    }
  }

  return updated;
}
