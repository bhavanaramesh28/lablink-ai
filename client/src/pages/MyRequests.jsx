import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CheckCircle2, Clock, XCircle, MapPin, QrCode, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getBookingsList, saveBookingsList } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import BookingModal from "../components/modals/BookingModal";
import PageTransition from "../components/ui/PageTransition";

export default function MyRequests() {
  const [bookings, setBookings] = useState(getBookingsList());
  const [modalOpen, setModalOpen] = useState(false);
  const [qrItem, setQrItem] = useState(null);

  const handleCancel = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    saveBookingsList(updated);
    toast.success("Booking request cancelled.");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">
              My Equipment <span className="text-gradient">Requests</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/60">
              Track the live approval status of your lab bookings, faculty guidance remarks, and access passes.
            </p>
          </div>
          <GlowButton onClick={() => setModalOpen(true)} className="py-2.5 text-xs flex items-center gap-2">
            <Plus size={16} /> New Request
          </GlowButton>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {bookings.map((b) => {
            const isApproved = b.status === "APPROVED";
            const isPending = b.status === "PENDING";
            return (
              <div
                key={b.id}
                className="glass-card p-5 border-white/10 hover:border-cyan-glow/40 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono text-cyan-glow">{b.id}</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          isApproved
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : isPending
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {isApproved && <CheckCircle2 size={12} />}
                        {isPending && <Clock size={12} />}
                        {b.status}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-semibold text-white">{b.equipmentName}</h3>
                    <p className="mt-0.5 text-xs text-white/60">
                      <strong>Project:</strong> {b.projectName}
                    </p>
                    <p className="mt-1 text-xs text-white/50 flex items-center gap-2">
                      <MapPin size={12} className="text-aqua-glow" /> {b.lab}
                      <span>•</span>
                      <span>Faculty Guide: {b.facultySupervisor}</span>
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-3">
                    <div className="rounded-xl bg-white/5 px-3 py-1.5 text-right border border-white/5">
                      <div className="text-xs font-semibold text-cyan-glow">{b.date}</div>
                      <div className="text-[11px] text-white/60">{b.slotTime}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <button
                          onClick={() => setQrItem(b)}
                          className="flex items-center gap-1.5 rounded-xl border border-cyan-glow/40 bg-cyan-glow/10 px-3 py-1.5 text-xs font-medium text-cyan-glow hover:bg-cyan-glow/20 transition"
                        >
                          <QrCode size={14} /> Digital Pass
                        </button>
                      )}
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="rounded-xl px-2.5 py-1.5 text-xs text-white/40 hover:text-rose-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Faculty Remarks */}
                {b.statusRemarks && (
                  <div className="mt-3.5 pt-3 border-t border-white/5 text-xs text-white/70 flex items-center gap-2">
                    <span className="text-white/40 font-mono text-[10px]">FACULTY NOTE:</span>
                    <span>{b.statusRemarks}</span>
                  </div>
                )}
              </div>
            );
          })}

          {bookings.length === 0 && (
            <div className="glass p-12 text-center">
              <ClipboardList size={36} className="mx-auto text-white/30" />
              <h3 className="mt-3 text-sm font-semibold">No equipment requests yet</h3>
              <p className="mt-1 text-xs text-white/50">Reserve instruments from Equipment Discovery or the Booking Calendar.</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Pass Modal */}
      {qrItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass p-6 max-w-sm w-full text-center border-cyan-glow/50 shadow-cyan">
            <h3 className="font-semibold text-white">Laboratory Entry Pass</h3>
            <p className="text-xs text-white/50 mt-1">{qrItem.equipmentName}</p>
            <div className="my-6 mx-auto w-44 h-44 bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg">
              <QrCode size={130} className="text-[#070B18]" />
              <span className="mt-1 text-[9px] font-mono text-black/70">LABLINK-{qrItem.id}</span>
            </div>
            <p className="text-xs text-cyan-glow font-medium">{qrItem.lab}</p>
            <p className="text-[11px] text-white/50">{qrItem.date} • {qrItem.slotTime}</p>
            <button
              onClick={() => setQrItem(null)}
              className="mt-6 w-full rounded-xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-semibold text-white transition"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setBookings(getBookingsList())}
      />
    </PageTransition>
  );
}
