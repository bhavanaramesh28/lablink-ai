import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Search, Calendar, ClipboardList, ArrowRight, CheckCircle2, Clock, MapPin, Cpu, FlaskConical,
} from "lucide-react";
import { getEquipmentList, getBookingsList } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import BookingModal from "../components/modals/BookingModal";
import PageTransition from "../components/ui/PageTransition";

export default function StudentDashboard() {
  const [equipmentList] = useState(getEquipmentList().slice(0, 4));
  const [bookings, setBookings] = useState(getBookingsList());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEq, setSelectedEq] = useState(null);

  const activeCount = bookings.filter((b) => b.status === "APPROVED").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  const handleBook = (eq) => {
    setSelectedEq(eq);
    setModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/30 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-8 -top-8 h-60 w-60 rounded-full bg-cyan-glow/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="badge-cyan">Student Research Portal</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl">
                Welcome to your <span className="text-gradient">Laboratory Hub</span>
              </h1>
              <p className="mt-1 text-sm text-white/60 max-w-xl">
                Access advanced measurement instruments, laser prototyping, high-performance AI kits, and spectroscopy suites across all campus departments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/student/analyzer">
                <GlowButton className="text-xs py-2.5 flex items-center gap-1.5">
                  <Sparkles size={14} /> AI Analyzer
                </GlowButton>
              </Link>
              <Link to="/student/equipment">
                <GlowButton variant="ghost" className="text-xs py-2.5 flex items-center gap-1.5">
                  <Search size={14} /> Browse Gear
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass p-5 border-cyan-glow/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Confirmed Bookings <CheckCircle2 size={16} className="text-emerald-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">{activeCount} Slots</div>
            <div className="mt-1 text-[11px] text-emerald-400">Passes generated and ready</div>
          </div>

          <div className="glass p-5 border-amber-500/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Pending Faculty Review <Clock size={16} className="text-amber-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">{pendingCount} Requests</div>
            <div className="mt-1 text-[11px] text-amber-400">Awaiting supervisor clearance</div>
          </div>

          <div className="glass p-5 border-purple-glow/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Cross-Campus Labs <FlaskConical size={16} className="text-purple-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">18 Facilities</div>
            <div className="mt-1 text-[11px] text-purple-glow">Open for interdisciplinary work</div>
          </div>
        </div>

        {/* Quick Launchpad & Equipment Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Featured Instruments Ready for Reservation
            </h2>
            <Link to="/student/equipment" className="text-xs text-cyan-glow hover:underline flex items-center gap-1">
              View all 8 instruments <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {equipmentList.map((eq) => (
              <div
                key={eq.id}
                className="glass-card p-5 flex flex-col justify-between hover:border-cyan-glow/40 transition"
              >
                <div>
                  <span className="badge-cyan text-[10px]">{eq.category}</span>
                  <h3 className="mt-2 text-sm font-semibold text-white line-clamp-2">{eq.name}</h3>
                  <p className="mt-1 text-[11px] text-white/50 flex items-center gap-1">
                    <MapPin size={11} className="text-aqua-glow flex-shrink-0" />
                    {eq.lab}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400">{eq.availableUnits} in stock</span>
                  <GlowButton onClick={() => handleBook(eq)} className="py-1 px-3 text-[11px]">
                    Book Slot
                  </GlowButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        initialEquipment={selectedEq}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setBookings(getBookingsList())}
      />
    </PageTransition>
  );
}
