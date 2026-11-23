import { useState, useEffect } from "react";
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { getEquipmentList, createBooking, TIME_SLOTS } from "../../lib/mockData";
import GlowButton from "../ui/GlowButton";

export default function BookingModal({
  isOpen,
  onClose,
  initialEquipment = null,
  onSuccess = () => {},
}) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEqId, setSelectedEqId] = useState("");
  const [date, setDate] = useState("");
  const [slotTime, setSlotTime] = useState(TIME_SLOTS[0]);
  const [projectName, setProjectName] = useState("");
  const [facultySupervisor, setFacultySupervisor] = useState("Dr. K. Ramanathan");
  const [studentName, setStudentName] = useState("Aditya Sharma");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const list = getEquipmentList();
      setEquipmentList(list);
      if (initialEquipment) {
        setSelectedEqId(initialEquipment.id);
      } else if (list.length > 0 && !selectedEqId) {
        setSelectedEqId(list[0].id);
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [isOpen, initialEquipment]);

  if (!isOpen) return null;

  const selectedEquipment =
    equipmentList.find((e) => e.id === selectedEqId) || initialEquipment;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEqId) {
      toast.error("Please select equipment.");
      return;
    }
    if (!date) {
      toast.error("Please pick a booking date.");
      return;
    }
    if (!projectName.trim()) {
      toast.error("Please provide your project title or research purpose.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newBooking = createBooking({
        equipmentId: selectedEquipment.id,
        equipmentName: selectedEquipment.name,
        studentName,
        studentEmail: "student@campus.edu",
        department: selectedEquipment.department,
        lab: selectedEquipment.lab,
        date,
        slotTime,
        durationHours: 2,
        projectName,
        facultySupervisor,
        notes,
      });

      toast.success(
        `Slot reserved for ${selectedEquipment.name}! Pending faculty approval.`,
        { icon: "✨", duration: 4000 }
      );

      setSubmitting(false);
      onSuccess(newBooking);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-cyan-glow/40 bg-[#0B1224] p-6 shadow-2xl shadow-cyan-glow/10 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Accent Header */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-44 w-96 rounded-full bg-cyan-glow/20 blur-3xl" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow">
              <Calendar size={18} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">Book Laboratory Slot</h2>
              <p className="text-xs text-white/50">Cross-department equipment reservation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Equipment Selector */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">
              Select Instrument / Equipment
            </label>
            <select
              value={selectedEqId}
              onChange={(e) => setSelectedEqId(e.target.value)}
              className="input-field"
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id} className="bg-[#101A35] text-white">
                  {eq.name} ({eq.availableUnits}/{eq.totalUnits} available) - {eq.department}
                </option>
              ))}
            </select>
            {selectedEquipment && (
              <p className="mt-1 text-[11px] text-cyan-glow flex items-center gap-1">
                <CheckCircle2 size={12} /> Located in {selectedEquipment.lab}
              </p>
            )}
          </div>

          {/* Date & Slot Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/80">
                Reservation Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/80">
                Time Slot
              </label>
              <select
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="input-field"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot} className="bg-[#101A35] text-white">
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">
              Project Title & Objective
            </label>
            <input
              type="text"
              placeholder="e.g. Quadcopter Autonomous Obstacle Avoidance ESC Calibration"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Faculty Supervisor */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/80">
                Faculty Guide / Approver
              </label>
              <select
                value={facultySupervisor}
                onChange={(e) => setFacultySupervisor(e.target.value)}
                className="input-field"
              >
                <option value="Dr. K. Ramanathan" className="bg-[#101A35]">Dr. K. Ramanathan (ECE)</option>
                <option value="Prof. Meera Sen" className="bg-[#101A35]">Prof. Meera Sen (CSE)</option>
                <option value="Dr. Sandeep Joshi" className="bg-[#101A35]">Dr. Sandeep Joshi (Mech)</option>
                <option value="Dr. Anita Deshmukh" className="bg-[#101A35]">Dr. Anita Deshmukh (Biotech)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/80">
                Student Name / Roll No.
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">
              Special Setup Requirements (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Requires ESD wrist strap or special cuvettes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-medium text-white/60 hover:text-white transition"
            >
              Cancel
            </button>
            <GlowButton type="submit" disabled={submitting} className="py-2.5 text-xs">
              {submitting ? "Confirming..." : "Submit Booking Request"}
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
