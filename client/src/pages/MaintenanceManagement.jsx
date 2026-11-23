import { useState } from "react";
import {
  Wrench, CheckCircle2, Clock, AlertTriangle, Plus, Search, Filter,
  Calendar, ShieldCheck, DollarSign, RefreshCw, X,
} from "lucide-react";
import toast from "react-hot-toast";
import { getMaintenanceRecords, saveMaintenanceRecords, getEquipmentList, saveEquipmentList } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function MaintenanceManagement() {
  const [records, setRecords] = useState(getMaintenanceRecords());
  const [equipmentList] = useState(getEquipmentList());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [selectedEqId, setSelectedEqId] = useState(equipmentList[0]?.id || "");
  const [type, setType] = useState("Calibration");
  const [technician, setTechnician] = useState("Vikram Malhotra (Lead Custodian)");
  const [cost, setCost] = useState("65.00");
  const [nextDue, setNextDue] = useState("2027-04-15");
  const [remarks, setRemarks] = useState("");

  const filtered = records.filter(
    (r) =>
      r.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = records.filter((r) => r.status === "Completed").length;
  const scheduledCount = records.filter((r) => r.status === "Scheduled").length;

  const handleCreate = (e) => {
    e.preventDefault();
    const matchedEq = equipmentList.find((e) => e.id === selectedEqId);
    if (!matchedEq) return;

    const newRecord = {
      id: "maint-" + Date.now(),
      equipmentId: matchedEq.id,
      equipmentName: matchedEq.name,
      type,
      department: matchedEq.department,
      lab: matchedEq.lab,
      date: new Date().toISOString().split("T")[0],
      nextDue,
      status: "Scheduled",
      technician,
      cost: `$${Number(cost || 0).toFixed(2)}`,
      remarks: remarks || "Scheduled routine preventive calibration.",
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    saveMaintenanceRecords(updated);
    setShowModal(false);
    toast.success(`Maintenance order logged for ${matchedEq.name}!`, { icon: "🔧" });
  };

  const handleMarkComplete = (id) => {
    const updated = records.map((r) =>
      r.id === id ? { ...r, status: "Completed", remarks: r.remarks + " [Verified Operational]" } : r
    );
    setRecords(updated);
    saveMaintenanceRecords(updated);
    toast.success("Calibration certified and marked as Completed!", { icon: "✅" });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl animate-pulse-glow" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge-cyan">Laboratory Asset Custody</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                Equipment Maintenance & <span className="text-gradient">Calibration Engine</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                Track preventive calibration cycles, log certified technician repairs, and maintain ISO-compliant laboratory safety thresholds.
              </p>
            </div>
            <GlowButton onClick={() => setShowModal(true)} className="py-2.5 px-4 text-xs flex items-center gap-2 shadow-cyan">
              <Plus size={15} /> Log Maintenance Event
            </GlowButton>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass p-5 border-emerald-500/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Certified Calibrations <CheckCircle2 size={16} className="text-emerald-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">{completedCount} Records</div>
            <div className="mt-1 text-[11px] text-emerald-400">Within valid operating tolerance</div>
          </div>

          <div className="glass p-5 border-amber-500/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Scheduled Inspections <Clock size={16} className="text-amber-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">{scheduledCount} Upcoming</div>
            <div className="mt-1 text-[11px] text-amber-400">Preventive inspection queued</div>
          </div>

          <div className="glass p-5 border-cyan-glow/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Campus Hardware Uptime <ShieldCheck size={16} className="text-cyan-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">99.4%</div>
            <div className="mt-1 text-[11px] text-cyan-glow">Zero critical hardware downtime</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search maintenance records by equipment, department, or procedure..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 text-xs"
          />
        </div>

        {/* Maintenance Ledger */}
        <div className="space-y-3.5">
          {filtered.map((item) => {
            const isCompleted = item.status === "Completed";
            return (
              <div
                key={item.id}
                className="glass-card p-5 border-white/10 hover:border-cyan-glow/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-glow">{item.id}</span>
                    <span className="badge-purple text-[10px]">{item.department}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-white">{item.equipmentName}</h3>
                  <p className="mt-0.5 text-xs text-white/70">
                    <strong>Procedure:</strong> {item.type} • <strong>Technician:</strong> {item.technician}
                  </p>
                  <p className="mt-1 text-xs text-white/50">{item.remarks}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-white/60 font-mono">
                    <span>Logged: {item.date}</span>
                    <span>•</span>
                    <span className="text-cyan-glow">Next Calibration: {item.nextDue}</span>
                    <span>•</span>
                    <span className="text-emerald-400">Cost: {item.cost}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {!isCompleted && (
                    <button
                      onClick={() => handleMarkComplete(item.id)}
                      className="rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-[#070B18] border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition"
                    >
                      Certify & Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Maintenance Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-cyan-glow/40 bg-[#0B1224] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-cyan-glow" />
                <h3 className="text-base font-bold text-white">Log Asset Maintenance Event</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Select Instrument</label>
                <select
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  className="input-field text-xs"
                >
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.id} className="bg-[#101A35]">
                      {eq.name} ({eq.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Maintenance Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="input-field text-xs">
                    <option value="Calibration">Annual Calibration</option>
                    <option value="Optical Realignment">Optical Realignment</option>
                    <option value="Spindle & Bearing Overhaul">Spindle & Bearing Overhaul</option>
                    <option value="Firmware & OS Flash">Firmware & OS Flash</option>
                    <option value="Filter & Vat Cleaning">Filter & Vat Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    value={nextDue}
                    onChange={(e) => setNextDue(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Assigned Technician</label>
                  <input
                    type="text"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Action & Inspection Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Laser galvanometer alignment calibrated. Probes inspected for impedance match."
                  className="input-field text-xs resize-none"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-white/60">
                  Cancel
                </button>
                <GlowButton type="submit" className="py-2 px-5 text-xs shadow-cyan">
                  Save Maintenance Record
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
