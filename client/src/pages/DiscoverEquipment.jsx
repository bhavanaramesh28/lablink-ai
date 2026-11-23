import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, MapPin, CheckCircle2, AlertTriangle, Sparkles, Plus, Cpu, ChevronRight, Layers,
} from "lucide-react";
import { getEquipmentList, DEPARTMENTS } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import BookingModal from "../components/modals/BookingModal";
import PageTransition from "../components/ui/PageTransition";

export default function DiscoverEquipment() {
  const [equipmentList, setEquipmentList] = useState(getEquipmentList());
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = equipmentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesDept =
      selectedDept === "All Departments" || item.department === selectedDept;

    const matchesAvailable = !onlyAvailable || item.availableUnits > 0;

    return matchesSearch && matchesDept && matchesAvailable;
  });

  const handleOpenBooking = (item) => {
    setActiveModalItem(item);
    setModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setEquipmentList(getEquipmentList());
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/30 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/80 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-cyan-glow/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-cyan">Smart Inventory Discovery</span>
                <span className="text-xs text-white/50">• {equipmentList.length} Instruments Active</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl">
                Discover Campus <span className="text-gradient">Laboratories & Gear</span>
              </h1>
              <p className="mt-1 max-w-xl text-sm text-white/60">
                Browse calibrated laboratory equipment across all engineering & scientific faculties. Reserve slots directly with faculty endorsement.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/student/analyzer">
                <GlowButton variant="ghost" className="text-xs py-2.5">
                  <Sparkles size={15} className="text-cyan-glow" /> AI Project Analyzer
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                placeholder="Search equipment, models, tags (e.g. Oscilloscope, 3D Printer, LiDAR)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer self-center px-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded accent-cyan-glow"
              />
              Available now only
            </label>
          </div>

          {/* Department Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedDept === dept
                    ? "bg-cyan-glow text-[#070B18] shadow-cyan font-semibold"
                    : "bg-[#101A35]/80 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const isAvail = item.availableUnits > 0;
            return (
              <div
                key={item.id}
                className="glass-card group relative flex flex-col justify-between overflow-hidden p-5 hover:border-cyan-glow/50 hover:shadow-cyan"
              >
                {/* Hologram top edge highlight */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent opacity-0 transition group-hover:opacity-100" />

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge-cyan text-[10px]">{item.category}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isAvail
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isAvail ? "bg-emerald-400" : "bg-rose-400"}`} />
                      {isAvail ? `${item.availableUnits} Available` : "Fully Booked"}
                    </span>
                  </div>

                  <h3 className="mt-3 font-semibold text-white group-hover:text-cyan-glow transition">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-white/50 flex items-center gap-1">
                    <MapPin size={12} className="text-aqua-glow flex-shrink-0" />
                    {item.lab}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.specs.map((sp, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/70 border border-white/5"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-white/50">
                    Dept: <span className="text-white/80">{item.department.split(" ")[0]}</span>
                  </div>
                  <GlowButton
                    onClick={() => handleOpenBooking(item)}
                    disabled={!isAvail}
                    className="py-1.5 px-3.5 text-xs font-medium"
                  >
                    Book Slot
                  </GlowButton>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#101A35]/40 p-12 text-center">
            <Layers size={36} className="mx-auto text-white/30" />
            <h3 className="mt-3 text-sm font-semibold">No equipment matches your filter</h3>
            <p className="mt-1 text-xs text-white/50">Try broadening your search or choosing "All Departments".</p>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={modalOpen}
        initialEquipment={activeModalItem}
        onClose={() => setModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </PageTransition>
  );
}
