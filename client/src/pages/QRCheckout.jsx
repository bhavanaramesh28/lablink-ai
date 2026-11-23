import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  QrCode, ScanLine, Clock, MapPin, CheckCircle2, ShieldCheck, AlertCircle,
  ArrowRight, Download, Camera, RefreshCw, Sparkles, Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { getBookingsList, getCheckoutsList, processNewCheckout, processReturn } from "../lib/mockData";
import { useLanguage } from "../context/LanguageContext";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function QRCheckout() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState(getBookingsList());
  const [checkouts, setCheckouts] = useState(getCheckoutsList());
  const [activeTab, setActiveTab] = useState("passes"); // 'passes' | 'scanner' | 'active'
  const [selectedPass, setSelectedPass] = useState(null);
  const [scannerCode, setScannerCode] = useState("");
  const [scanning, setScanning] = useState(false);

  // Filter approved bookings for passes
  const approvedBookings = bookings.filter((b) => b.status === "APPROVED");
  const activeCheckouts = checkouts.filter((c) => c.status === "IN_USE");

  useEffect(() => {
    if (approvedBookings.length > 0 && !selectedPass) {
      setSelectedPass(approvedBookings[0]);
    }
  }, [approvedBookings]);

  // Simulate scanning QR Code at the Lab Desk
  const handleSimulateScanCheckIn = (booking) => {
    const newChk = processNewCheckout(booking);
    setCheckouts(getCheckoutsList());
    toast.success(`Check-in verified! ${booking.equipmentName} checked out for 2 hours.`, {
      icon: "🎉",
      duration: 5000,
    });
    setActiveTab("active");
  };

  const handleReturnItem = (checkoutId, eqName) => {
    processReturn(checkoutId);
    setCheckouts(getCheckoutsList());
    toast.success(`${eqName} safely returned and inspected! Available units updated.`, {
      icon: "📦",
    });
  };

  const handleManualScanSubmit = (e) => {
    e.preventDefault();
    if (!scannerCode.trim()) return;

    setScanning(true);
    setTimeout(() => {
      const cleanCode = scannerCode.trim().toUpperCase();
      const matched = bookings.find(
        (b) => `LABLINK-${b.id}`.toUpperCase() === cleanCode || b.id.toUpperCase() === cleanCode
      );

      if (matched) {
        if (matched.status !== "APPROVED") {
          toast.error(`Pass found for ${matched.equipmentName}, but status is ${matched.status} (Not yet approved by faculty).`);
        } else {
          handleSimulateScanCheckIn(matched);
        }
      } else {
        toast.error(`No reservation found matching barcode code "${scannerCode}".`);
      }
      setScanning(false);
      setScannerCode("");
    }, 700);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl animate-pulse-glow" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge-cyan">{t("checkout.badge", "Contactless Access Gateway")}</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                {t("checkout.title", "QR Laboratory Hardware Checkout")}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                {t("checkout.subtitle", "Present your verified faculty pass at the lab custody desk or scan bench barcodes to unlock instrumentation.")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 flex items-center gap-2 shadow-sm">
                <CheckCircle2 size={16} /> 2 Passes Certified & Ready
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("passes")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "passes"
                ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                : "text-slate-600 dark:text-white/70 hover:bg-white/10"
            }`}
          >
            {t("checkout.digitalPasses", "Digital Entry Passes")} ({approvedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "active"
                ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                : "text-slate-600 dark:text-white/70 hover:bg-white/10"
            }`}
          >
            {t("checkout.activeHardware", "Active In-Use Equipment")} ({activeCheckouts.length})
          </button>
          <button
            onClick={() => setActiveTab("scanner")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "scanner"
                ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                : "text-slate-600 dark:text-white/70 hover:bg-white/10"
            }`}
          >
            {t("checkout.scanner", "Optical QR Terminal")}
          </button>
        </div>

        {/* TAB 1: Digital Passes */}
        {activeTab === "passes" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Pass Selector list */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50">
                Authorized Passes
              </h3>
              {approvedBookings.map((b) => {
                const isSelected = selectedPass?.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedPass(b)}
                    className={`cursor-pointer rounded-2xl p-4.5 border transition ${
                      isSelected
                        ? "glass-card border-cyan-glow/60 shadow-cyan bg-cyan-glow/5"
                        : "glass border-slate-200 dark:border-white/5 hover:border-cyan-glow/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-600 dark:text-cyan-glow font-bold">
                        LABLINK-{b.id}
                      </span>
                      <span className="badge-cyan text-[10px]">Approved</span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {b.equipmentName}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-white/50 flex items-center gap-1.5">
                      <MapPin size={12} className="text-aqua-glow" /> {b.lab}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400 dark:text-white/40 flex items-center gap-1">
                      <Clock size={11} /> {b.date} • {b.slotTime}
                    </div>
                  </div>
                );
              })}

              {approvedBookings.length === 0 && (
                <div className="glass p-8 text-center text-xs text-slate-500 dark:text-white/50">
                  No approved passes ready. Reserve a slot and have faculty approve it!
                </div>
              )}
            </div>

            {/* Right Pass Holographic Card Preview */}
            <div className="lg:col-span-7">
              {selectedPass ? (
                <div className="glass-card p-6 sm:p-8 border-cyan-glow/50 shadow-cyan text-center relative overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-glow via-blue-neon to-purple-glow" />

                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="text-left">
                      <span className="badge-cyan text-[10px]">CAMPUS ACCESS PASS</span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {selectedPass.equipmentName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-white/50">{selectedPass.lab}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-glow block">
                        LABLINK-{selectedPass.id}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                        <CheckCircle2 size={12} /> Faculty Endorsed
                      </span>
                    </div>
                  </div>

                  {/* QR Display with laser scan animation */}
                  <div className="relative my-7 mx-auto w-56 h-56 bg-white rounded-3xl p-4 flex flex-col items-center justify-center shadow-2xl border-4 border-cyan-glow/40 overflow-hidden">
                    {/* Animated Cybernetic Scan Line */}
                    <div className="pointer-events-none absolute inset-x-0 h-1 bg-cyan-glow shadow-[0_0_12px_#00D9FF] animate-laser-scan opacity-80" />
                    <QrCode size={170} className="text-[#070B18]" />
                    <span className="mt-1.5 text-[10px] font-mono tracking-wider font-bold text-[#070B18]">
                      LABLINK-{selectedPass.id}
                    </span>
                  </div>

                  {/* Pass Meta */}
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs bg-slate-100 dark:bg-[#070B18]/70 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase block">Researcher</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{selectedPass.studentName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase block">Supervisor</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{selectedPass.facultySupervisor}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase block">Slot Timing</span>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-glow">{selectedPass.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase block">Duration</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{selectedPass.slotTime}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <GlowButton
                      onClick={() => handleSimulateScanCheckIn(selectedPass)}
                      className="py-2.5 px-6 text-xs font-semibold shadow-cyan flex items-center gap-2"
                    >
                      <ScanLine size={16} /> Check In at Lab Desk
                    </GlowButton>
                    <button
                      onClick={() => toast.success("Pass QR image saved to your device.", { icon: "📲" })}
                      className="rounded-xl border border-slate-300 dark:border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-white hover:text-cyan-glow flex items-center gap-1.5 transition"
                    >
                      <Download size={14} /> Download Pass
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass p-12 text-center text-xs text-slate-500 dark:text-white/50">
                  Select a pass from the left to view the interactive QR Code.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Active Checkouts */}
        {activeTab === "active" && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50">
              Equipment Currently In Your Custody ({activeCheckouts.length})
            </h3>

            {activeCheckouts.map((chk) => (
              <div
                key={chk.id}
                className="glass-card p-6 border-emerald-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge-aqua text-[10px]">ACTIVE CHECKOUT</span>
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-glow font-bold">
                      {chk.passCode}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                    {chk.equipmentName}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/50 flex items-center gap-2">
                    <MapPin size={12} className="text-aqua-glow" /> {chk.lab}
                    <span>•</span>
                    <span>Custodian: {chk.custodian}</span>
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <Clock size={14} />
                    <span>Timer Running: Return due at <strong>04:00 PM Today</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GlowButton
                    onClick={() => handleReturnItem(chk.id, chk.equipmentName)}
                    className="py-2.5 px-5 text-xs font-semibold shadow-purple"
                  >
                    Hand In / Return Equipment
                  </GlowButton>
                </div>
              </div>
            ))}

            {activeCheckouts.length === 0 && (
              <div className="glass p-12 text-center">
                <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  No equipment checked out right now
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/50">
                  Select an approved pass and click "Check In at Lab Desk" when you arrive at the laboratory.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Optical Scanner */}
        {activeTab === "scanner" && (
          <div className="max-w-xl mx-auto glass-card p-6 sm:p-8 text-center border-cyan-glow/40 shadow-cyan">
            <span className="badge-cyan text-xs">Laboratory Optical Terminal</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
              Scan Equipment Barcode / Pass
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50 mt-1 mb-6">
              Use your device camera or enter a reservation code (e.g. <code>LABLINK-bk-101</code>) to verify check-in.
            </p>

            {/* Simulated Camera Viewfinder */}
            <div className="relative mx-auto w-full max-w-sm h-64 rounded-3xl bg-slate-900 border-2 border-cyan-glow/50 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              <div className="pointer-events-none absolute inset-x-0 h-1 bg-cyan-glow shadow-[0_0_15px_#00D9FF] animate-laser-scan" />
              <Camera size={44} className="text-cyan-glow/40 mb-2" />
              <span className="text-[11px] font-mono text-cyan-glow/70 uppercase tracking-wider">
                Viewfinder Active (60 FPS)
              </span>

              {/* Corner targeting brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-glow" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-glow" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-glow" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-glow" />
            </div>

            {/* Quick Manual Entry */}
            <form onSubmit={handleManualScanSubmit} className="mt-6 flex items-center gap-2">
              <input
                type="text"
                placeholder="Or type pass code: LABLINK-bk-101"
                value={scannerCode}
                onChange={(e) => setScannerCode(e.target.value)}
                className="input-field text-xs py-2.5 font-mono"
              />
              <GlowButton type="submit" disabled={scanning} className="py-2.5 px-4 text-xs font-semibold">
                {scanning ? <RefreshCw size={14} className="animate-spin" /> : "Verify Code"}
              </GlowButton>
            </form>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
