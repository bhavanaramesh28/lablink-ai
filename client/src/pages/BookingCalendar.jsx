import { useState } from "react";
import {
  Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight,
  CheckCircle2, AlertCircle, ShieldCheck, Award, Zap, AlertTriangle, ArrowRight,
} from "lucide-react";
import { getBookingsList, TIME_SLOTS } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import BookingModal from "../components/modals/BookingModal";
import PageTransition from "../components/ui/PageTransition";

export default function BookingCalendar() {
  const [bookings, setBookings] = useState(getBookingsList());
  const [selectedDate, setSelectedDate] = useState("2026-11-25");
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedSlot, setPreselectedSlot] = useState(null);

  // Generate 7 days starting from selected
  const days = [
    { day: "Wed", date: "2026-11-25", num: "25" },
    { day: "Thu", date: "2026-11-26", num: "26" },
    { day: "Fri", date: "2026-11-27", num: "27" },
    { day: "Sat", date: "2026-11-28", num: "28" },
    { day: "Mon", date: "2026-11-30", num: "30" },
    { day: "Tue", date: "2026-12-01", num: "01" },
    { day: "Wed", date: "2026-12-02", num: "02" },
  ];

  const bookingsForDate = bookings.filter((b) => b.date === selectedDate);
  const occupiedCount = bookingsForDate.length;
  const freeCount = TIME_SLOTS.length - occupiedCount;

  const handleBookingSuccess = () => {
    setBookings(getBookingsList());
    setPreselectedSlot(null);
  };

  const handleOpenReserve = (slot) => {
    setPreselectedSlot(slot);
    setModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-cyan">Phase 7 Smart Scheduling</span>
            <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-slate-900 dark:text-white">
              Laboratory <span className="text-gradient">Booking Schedule</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-white/60">
              Interactive timeline with double-booking prevention, alternative slot recommendations, and explainable fair allocation scoring.
            </p>
          </div>
          <GlowButton
            onClick={() => handleOpenReserve(null)}
            className="py-2.5 text-xs flex items-center gap-2 shadow-cyan"
          >
            <Plus size={16} /> Book New Slot
          </GlowButton>
        </div>

        {/* Real-time Availability Banner */}
        <div className="glass p-4 rounded-2xl border border-cyan-glow/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 flex-shrink-0">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                Conflict Prevention Active for {selectedDate}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-white/50">
                {freeCount} of {TIME_SLOTS.length} slots currently open. Overlapping reservations are blocked at the database level.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> {freeCount} Free Slots
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-glow/10 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-glow/30">
              <span className="h-2 w-2 rounded-full bg-purple-glow" /> {occupiedCount} Locked
            </span>
          </div>
        </div>

        {/* Date Selector Strip */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {days.map((d) => {
            const isSelected = d.date === selectedDate;
            const count = bookings.filter((b) => b.date === d.date).length;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex min-w-[90px] flex-col items-center rounded-2xl p-3 transition border ${
                  isSelected
                    ? "bg-gradient-to-b from-cyan-glow/20 to-purple-glow/20 border-cyan-glow text-slate-900 dark:text-white shadow-cyan"
                    : "glass border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60 hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wider">{d.day}</span>
                <span className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{d.num}</span>
                <span className="mt-1 text-[10px] text-cyan-600 dark:text-cyan-glow font-semibold">
                  {count > 0 ? `${count} reserved` : "Free"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slot Timeline Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/60">
              Time Slots for {selectedDate}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-white/40 font-mono">
              Times displayed in Campus Standard Time (IST)
            </span>
          </div>

          <div className="space-y-3">
            {TIME_SLOTS.map((slot, index) => {
              const bookingAtSlot = bookingsForDate.find((b) => b.slotTime === slot);
              // Find first free alternative slot if this one is locked
              const nextFreeSlot = !bookingAtSlot
                ? null
                : TIME_SLOTS.find((s) => !bookingsForDate.find((b) => b.slotTime === s));

              return (
                <div
                  key={slot}
                  className={`glass flex flex-col md:flex-row md:items-center justify-between p-4.5 rounded-2xl border transition ${
                    bookingAtSlot
                      ? "border-purple-glow/30 bg-[#101A35]/80"
                      : "border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#101A35]/30 hover:border-cyan-glow/30"
                  }`}
                >
                  <div className="flex items-start md:items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 dark:bg-white/5 text-cyan-600 dark:text-cyan-glow border border-slate-200 dark:border-white/10 flex-shrink-0">
                      <Clock size={18} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{slot}</h4>
                        {bookingAtSlot && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 dark:text-cyan-glow">
                            <Award size={10} /> Fair Priority: {bookingAtSlot.fairnessPriorityScore || 88}%
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
                        {bookingAtSlot ? (
                          <div className="space-y-0.5">
                            <span className="text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-glow" />
                              Reserved: <strong>{bookingAtSlot.equipmentName}</strong>
                            </span>
                            {nextFreeSlot && (
                              <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-0.5">
                                <AlertTriangle size={11} />
                                <span>Collision alert: Slot occupied. Alternative recommendation: </span>
                                <button
                                  onClick={() => handleOpenReserve(nextFreeSlot)}
                                  className="underline font-semibold hover:text-white transition"
                                >
                                  {nextFreeSlot} (Click to reserve)
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Slot Available for Reservation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 flex items-center gap-3">
                    {bookingAtSlot ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-white/60">
                          By <strong className="text-slate-900 dark:text-white">{bookingAtSlot.studentName}</strong> (
                          {bookingAtSlot.department.split(" ")[0]})
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                            bookingAtSlot.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {bookingAtSlot.status}
                        </span>
                      </div>
                    ) : (
                      <GlowButton
                        onClick={() => handleOpenReserve(slot)}
                        variant="ghost"
                        className="py-1.5 px-3.5 text-xs border-slate-300 dark:border-white/10"
                      >
                        Reserve Slot
                      </GlowButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </PageTransition>
  );
}
