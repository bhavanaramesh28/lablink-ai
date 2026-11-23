import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, MapPin, CheckCircle2, AlertTriangle, Sparkles, Plus, Cpu, ChevronRight, Layers,
  ShieldCheck, Zap, Info, X,
} from "lucide-react";
import { getEquipmentList, DEPARTMENTS, CATEGORIES } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import BookingModal from "../components/modals/BookingModal";
import PageTransition from "../components/ui/PageTransition";

export default function DiscoverEquipment() {
  const [equipmentList, setEquipmentList] = useState(getEquipmentList());
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const filtered = equipmentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesDept =
      selectedDept === "All Departments" || item.department === selectedDept;

    const matchesCat =
      selectedCategory === "All Categories" || item.category === selectedCategory;

    const matchesAvailable = !onlyAvailable || item.availableUnits > 0;

    return matchesSearch && matchesDept && matchesCat && matchesAvailable;
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
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                Discover Campus <span className="text-gradient">Laboratories & Gear</span>
              </h1>
              <p className="mt-1 max-w-xl text-sm text-white/60">
                Browse calibrated laboratory equipment across all engineering & scientific faculties. Reserve slots directly with faculty safety clearance.
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
            <label className="flex items-center gap-2 cursor-pointer self-center px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded accent-cyan-glow"
              />
              Available now only
            </label>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-purple-glow text-white shadow-purple font-semibold"
                    : "bg-[#101A35]/80 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
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
                      {isAvail ? `${item.availableUnits}/${item.totalUnits} Available` : "Fully Booked"}
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
                    {item.specs.slice(0, 3).map((sp, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/70 border border-white/5"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>

                  {/* Alternative recommendation preview */}
                  {item.alternativeName && (
                    <div className="mt-3 rounded-lg bg-white/5 p-2 text-[10px] text-white/60 border border-white/5 flex items-start gap-1">
                      <Sparkles size={11} className="text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>Alternative: {item.alternativeName}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setDetailItem(item)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Info size={13} /> Details
                  </button>
                  <GlowButton
                    onClick={() => handleOpenBooking(item)}
                    disabled={!isAvail}
                    className="py-1.5 px-3.5 text-xs font-medium"
                  >
                    {isAvail ? "Book Slot" : "Unavailable"}
                  </GlowButton>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#101A35]/40 p-12 text-center">
            <Layers size={36} className="mx-auto text-white/30" />
            <h3 className="mt-3 text-sm font-semibold text-white">No equipment matches your filter</h3>
            <p className="mt-1 text-xs text-white/50">Try broadening your search or choosing "All Departments" and "All Categories".</p>
          </div>
        )}
      </div>

      {/* Equipment Detailed Drawer Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setDetailItem(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-cyan-glow/40 bg-[#0B1224] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="badge-cyan text-xs">{detailItem.category}</span>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-1 text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <h3 className="mt-3 text-lg font-bold text-white">{detailItem.name}</h3>
            <p className="mt-1 text-xs text-white/60 flex items-center gap-1">
              <MapPin size={12} className="text-aqua-glow" /> {detailItem.lab} • {detailItem.department}
            </p>

            <div className="mt-4 space-y-2 rounded-2xl bg-white/5 p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Available Units:</span>
                <span className="font-semibold text-emerald-400">{detailItem.availableUnits} of {detailItem.totalUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Power Requirements:</span>
                <span className="text-white">{detailItem.powerReq || "Standard 230V AC"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Safety Clearance Level:</span>
                <span className="text-cyan-glow font-medium">{detailItem.safetyLevel || "Low"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Maintenance Status:</span>
                <span className="text-emerald-400">{detailItem.status || "Operational"}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-white/80 mb-2">Technical Specifications:</h4>
              <ul className="space-y-1">
                {detailItem.specs.map((sp, i) => (
                  <li key={i} className="text-xs text-white/70 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" /> {sp}
                  </li>
                ))}
              </ul>
            </div>

            {detailItem.alternativeName && (
              <div className="mt-4 rounded-xl border border-purple-glow/30 bg-purple-glow/10 p-3 text-xs text-purple-200">
                <span className="font-bold text-purple-300 block mb-0.5">Alternative Equipment Recommendation:</span>
                {detailItem.alternativeName}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
              <button onClick={() => setDetailItem(null)} className="px-4 py-2 text-xs text-white/60">
                Close
              </button>
              <GlowButton
                onClick={() => {
                  const it = detailItem;
                  setDetailItem(null);
                  handleOpenBooking(it);
                }}
                disabled={detailItem.availableUnits <= 0}
                className="py-2 px-5 text-xs shadow-cyan"
              >
                Book This Instrument
              </GlowButton>
            </div>
          </div>
        </div>
      )}

      <BookingModal
        isOpen={modalOpen}
        initialEquipment={activeModalItem}
        onClose={() => setModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </PageTransition>
  );
}
