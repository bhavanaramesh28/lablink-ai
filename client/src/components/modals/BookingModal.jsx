import { useState, useEffect } from "react";
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
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
  const [conflictError, setConflictError] = useState(null);
  const [suggestedSlots, setSuggestedSlots] = useState([]);

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
      setConflictError(null);
      setSuggestedSlots([]);
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
    setConflictError(null);

    setTimeout(() => {
      const result = createBooking({
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

      if (result.conflict) {
        setConflictError(result.error);
        setSuggestedSlots(result.suggestedAlternativeSlots || []);
        toast.error("Double-booking detected! Please choose an alternative slot below.", {
          icon: "⚠️",
          duration: 5000,
        });
        setSubmitting(false);
        return;
      }

      toast.success(
        `Slot reserved for ${selectedEquipment.name}! Fairness Score: ${result.booking.fairnessPriorityScore}%.`,
        { icon: "✨", duration: 4000 }
      );

      setSubmitting(false);
      onSuccess(result.booking);
      onClose();
    }, 450);
  };

  const handleSelectAlternativeSlot = (slot) => {
    setSlotTime(slot);
    setConflictError(null);
    toast.success(`Slot adjusted to ${slot}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-cyan-glow/40 bg-[#0B1224] p-6 shadow-2xl shadow-cyan-glow/10 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Accent Header */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-44 w-96 rounded-full bg-cyan-glow/20 blur-3xl" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow">
              <Calendar size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Smart Laboratory Booking</h2>
              <p className="text-xs text-white/50">Conflict-free reservation & fair allocation engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Double-Booking Conflict Notification Banner */}
        {conflictError && (
          <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300">
            <div className="flex items-start gap-2 font-semibold">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <span>{conflictError}</span>
                {suggestedSlots.length > 0 && (
                  <div className="mt-2.5">
                    <p className="text-[11px] text-white/80 font-medium mb-1">
                      Recommended Open Alternative Slots for this date:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSlots.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSelectAlternativeSlot(s)}
                          className="rounded-lg bg-rose-500/20 hover:bg-emerald-500 hover:text-[#070B18] px-2.5 py-1 text-[11px] font-semibold text-rose-200 transition border border-rose-500/30"
                        >
                          {s} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Equipment Selector */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">
              Select Instrument / Equipment
            </label>
            <select
              value={selectedEqId}
              onChange={(e) => {
                setSelectedEqId(e.target.value);
                setConflictError(null);
              }}
              className="input-field"
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id} className="bg-[#101A35] text-white">
                  {eq.name} ({eq.availableUnits}/{eq.totalUnits} available) - {eq.department}
                </option>
              ))}
            </select>
            {selectedEquipment && (
              <div className="mt-2 flex flex-col gap-1 text-[11px]">
                <p className="text-cyan-glow flex items-center gap-1 font-mono">
                  <CheckCircle2 size={12} /> {selectedEquipment.lab} • Safety: {selectedEquipment.safetyLevel}
                </p>
                {selectedEquipment.alternativeName && (
                  <p className="text-purple-300/80 flex items-center gap-1">
                    <Sparkles size={11} className="text-purple-400" />
                    <span>Alternative Substitute: {selectedEquipment.alternativeName}</span>
                  </p>
                )}
              </div>
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
                onChange={(e) => {
                  setDate(e.target.value);
                  setConflictError(null);
                }}
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
                onChange={(e) => {
                  setSlotTime(e.target.value);
                  setConflictError(null);
                }}
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
              Project Title & Research Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. Quadcopter Autonomous Obstacle Avoidance ESC Calibration"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input-field"
              required
            />
            {projectName.trim() && (
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-cyan-glow/10 border border-cyan-glow/20 px-3 py-1.5 text-[11px] text-cyan-300">
                <ShieldCheck size={13} className="text-cyan-glow" />
                <span>
                  Fairness Allocation Preview: <strong>~92% Priority</strong> (Capstone / Inter-departmental project)
                </span>
              </div>
            )}
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
              placeholder="e.g. Requires ESD wrist strap, specific probe attenuation, or cuvettes"
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
              {submitting ? "Checking Conflict Matrix..." : "Confirm & Submit Request"}
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
