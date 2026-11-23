import { useState } from "react";
import {
  Building2, Users, Layers, Clock, Plus, Search, MapPin, Mail, ArrowRight,
  TrendingUp, CheckCircle2, ShieldCheck, X,
} from "lucide-react";
import toast from "react-hot-toast";
import { getDepartmentsData, saveDepartmentsData } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState(getDepartmentsData());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [hod, setHod] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("2nd Floor");
  const [totalLabs, setTotalLabs] = useState(3);
  const [allocatedQuota, setAllocatedQuota] = useState(500);

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.hod.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !hod.trim()) {
      toast.error("Please fill in department name, code and HOD.");
      return;
    }

    const newDept = {
      id: "dept-" + Date.now(),
      name,
      code: code.toUpperCase(),
      hod,
      building: building || "Academic Science Wing",
      floor,
      totalLabs: Number(totalLabs),
      allocatedQuotaHours: Number(allocatedQuota),
      usedQuotaHours: 0,
      activeInstruments: 6,
      activeResearchers: 45,
      contactEmail: `${code.toLowerCase()}.dept@campus.edu`,
    };

    const updated = [...departments, newDept];
    setDepartments(updated);
    saveDepartmentsData(updated);
    setShowModal(false);
    setName("");
    setCode("");
    setHod("");
    toast.success(`Department ${newDept.name} registered to campus network!`, { icon: "🏛️" });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl animate-pulse-glow" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge-cyan">Campus Interdisciplinary Architecture</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                Department Governance & <span className="text-gradient">Resource Quotas</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                Oversee participating faculties, manage inter-departmental laboratory access hours, and configure research facility allocations.
              </p>
            </div>
            <GlowButton onClick={() => setShowModal(true)} className="py-2.5 px-4 text-xs flex items-center gap-2 shadow-cyan">
              <Plus size={15} /> Add Department
            </GlowButton>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search departments by name, code (ECE, CSE, MECH) or Head of Department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 text-xs"
          />
        </div>

        {/* Departments Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => {
            const usagePercent = Math.min(100, Math.round((d.usedQuotaHours / d.allocatedQuotaHours) * 100));
            return (
              <div
                key={d.id}
                className="glass-card p-5 border-white/10 hover:border-cyan-glow/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="badge-cyan font-mono text-[11px] font-bold">{d.code}</span>
                    <span className="text-xs text-white/50">{d.totalLabs} Specialized Labs</span>
                  </div>

                  <h3 className="mt-2.5 text-base font-bold text-white">{d.name}</h3>
                  <p className="mt-1 text-xs text-white/70">
                    <strong>HOD:</strong> {d.hod}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50 flex items-center gap-1">
                    <MapPin size={11} className="text-aqua-glow flex-shrink-0" />
                    <span>{d.building}, {d.floor}</span>
                  </p>

                  {/* Quota Progress */}
                  <div className="mt-4 rounded-xl bg-white/5 p-3 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/60">Semester Research Quota:</span>
                      <span className="text-cyan-glow font-bold">{d.usedQuotaHours} / {d.allocatedQuotaHours} hrs</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-glow via-blue-neon to-purple-glow rounded-full"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-white/40 text-right">{usagePercent}% utilized</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-white/60 font-mono">
                    <span>{d.activeInstruments} Instruments Connected</span>
                    <span>{d.activeResearchers} Researchers</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <a href={`mailto:${d.contactEmail}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                    <Mail size={12} /> Contact
                  </a>
                  <span className="badge-purple text-[10px]">Active Node</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-cyan-glow/40 bg-[#0B1224] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-cyan-glow" />
                <h3 className="text-base font-bold text-white">Register Campus Department</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aerospace & Avionics Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Code (e.g. AERO)</label>
                  <input
                    type="text"
                    placeholder="AERO"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Head of Department (HOD)</label>
                  <input
                    type="text"
                    placeholder="Dr. Rajesh Varma"
                    value={hod}
                    onChange={(e) => setHod(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Building</label>
                  <input
                    type="text"
                    placeholder="Kalam Space Complex"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Floor Level</label>
                  <input
                    type="text"
                    placeholder="3rd Floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Total Laboratories</label>
                  <input
                    type="number"
                    value={totalLabs}
                    onChange={(e) => setTotalLabs(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Allocated Research Hours</label>
                  <input
                    type="number"
                    value={allocatedQuota}
                    onChange={(e) => setAllocatedQuota(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-white/60">
                  Cancel
                </button>
                <GlowButton type="submit" className="py-2 px-5 text-xs shadow-cyan">
                  Register Department
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
