import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { getBookingsList, TIME_SLOTS } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import BookingModal from "../components/modals/BookingModal";
import PageTransition from "../components/ui/PageTransition";

export default function BookingCalendar() {
  const [bookings, setBookings] = useState(getBookingsList());
  const [selectedDate, setSelectedDate] = useState("2026-11-25");
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleBookingSuccess = () => {
    setBookings(getBookingsList());
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">
              Laboratory <span className="text-gradient">Booking Schedule</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/60">
              Check laboratory availability and lock in your research slots with zero scheduling conflicts.
            </p>
          </div>
          <GlowButton onClick={() => setModalOpen(true)} className="py-2.5 text-xs flex items-center gap-2">
            <Plus size={16} /> Book New Slot
          </GlowButton>
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
                    ? "bg-gradient-to-b from-cyan-glow/20 to-purple-glow/20 border-cyan-glow text-white shadow-cyan"
                    : "glass border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wider">{d.day}</span>
                <span className="mt-1 text-xl font-bold text-white">{d.num}</span>
                <span className="mt-1 text-[10px] text-cyan-glow">
                  {count > 0 ? `${count} reserved` : "Free"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slot Timeline Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Time Slots for {selectedDate}
          </h3>

          <div className="space-y-3">
            {TIME_SLOTS.map((slot) => {
              const bookingAtSlot = bookingsForDate.find((b) => b.slotTime === slot);
              return (
                <div
                  key={slot}
                  className={`glass flex flex-col md:flex-row md:items-center justify-between p-4.5 rounded-2xl border transition ${
                    bookingAtSlot
                      ? "border-purple-glow/30 bg-[#101A35]/80"
                      : "border-white/5 bg-[#101A35]/30 hover:border-cyan-glow/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-cyan-glow border border-white/10">
                      <Clock size={18} />
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{slot}</h4>
                      <p className="text-xs text-white/50">
                        {bookingAtSlot ? (
                          <span className="text-purple-glow font-medium flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-glow" />
                            Booked: {bookingAtSlot.equipmentName}
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Slot Available for Reservation
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 flex items-center gap-3">
                    {bookingAtSlot ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">
                          By <strong className="text-white">{bookingAtSlot.studentName}</strong> ({bookingAtSlot.department.split(" ")[0]})
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                            bookingAtSlot.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {bookingAtSlot.status}
                        </span>
                      </div>
                    ) : (
                      <GlowButton
                        onClick={() => setModalOpen(true)}
                        variant="ghost"
                        className="py-1.5 px-3 text-xs"
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
