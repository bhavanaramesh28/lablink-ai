import { useState } from "react";
import {
  ScanLine, CheckCircle2, Clock, MapPin, Search, ArrowDownRight, ArrowUpRight,
  ShieldCheck, RefreshCw, Sparkles, Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { getCheckoutsList, processReturn, getBookingsList, processNewCheckout } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function CheckoutsReturns() {
  const [checkouts, setCheckouts] = useState(getCheckoutsList());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // 'ALL' | 'IN_USE' | 'RETURNED'
  const [scanInput, setScanInput] = useState("");

  const inUseCount = checkouts.filter((c) => c.status === "IN_USE").length;
  const returnedCount = checkouts.filter((c) => c.status === "RETURNED").length;

  const filtered = checkouts.filter((c) => {
    const matchesSearch =
      c.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.passCode.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleReturn = (id, eqName) => {
    const updated = processReturn(id, "Returned in clean condition, full probe accessories accounted for.");
    setCheckouts(updated);
    toast.success(`Instrument ${eqName} marked returned! Restored to campus inventory.`, { icon: "✅" });
  };

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const code = scanInput.trim().toUpperCase();
    const existing = checkouts.find((c) => c.passCode.toUpperCase() === code && c.status === "IN_USE");

    if (existing) {
      handleReturn(existing.id, existing.equipmentName);
      setScanInput("");
      return;
    }

    // Check if it's a booking ready for checkout
    const allBookings = getBookingsList();
    const matchedBooking = allBookings.find(
      (b) => `LABLINK-${b.id}`.toUpperCase() === code || b.id.toUpperCase() === code
    );

    if (matchedBooking) {
      if (matchedBooking.status !== "APPROVED") {
        toast.error(`Booking ${matchedBooking.id} is ${matchedBooking.status}. Requires faculty clearance.`);
      } else {
        processNewCheckout(matchedBooking);
        setCheckouts(getCheckoutsList());
        toast.success(`New checkout logged for ${matchedBooking.studentName} (${matchedBooking.equipmentName})!`, { icon: "📦" });
        setScanInput("");
      }
    } else {
      toast.error(`Pass or asset code "${scanInput}" not found in campus database.`);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge-cyan">Laboratory Custodian Desk</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                Equipment Checkouts & <span className="text-gradient">Returns Ledger</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                Log physical equipment dispatches, verify student QR clearance passes, and inspect returned hardware.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Custody Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass p-5 border-amber-500/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Hardware In Circulation <Clock size={16} className="text-amber-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{inUseCount} Units</div>
            <div className="mt-1 text-[11px] text-amber-500">Currently deployed with researchers</div>
          </div>

          <div className="glass p-5 border-emerald-500/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Returned & Inspected <CheckCircle2 size={16} className="text-emerald-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{returnedCount} Units</div>
            <div className="mt-1 text-[11px] text-emerald-500">Back in storage racks & available</div>
          </div>

          <div className="glass p-5 border-cyan-glow/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Inspection Compliance <ShieldCheck size={16} className="text-cyan-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">100%</div>
            <div className="mt-1 text-[11px] text-cyan-glow">All returns inspected by custodian</div>
          </div>
        </div>

        {/* Quick Pass Scan Input */}
        <div className="glass-card p-5">
          <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <ScanLine size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-glow" />
              <input
                type="text"
                placeholder="Scan or type pass code to dispatch or return (e.g. LABLINK-bk-101)..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="input-field pl-10 text-xs font-mono"
              />
            </div>
            <GlowButton type="submit" className="py-2.5 px-6 text-xs font-semibold w-full sm:w-auto">
              Process Scan
            </GlowButton>
          </form>
        </div>

        {/* Search & Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
            <input
              type="text"
              placeholder="Filter by student, equipment, or pass code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-xs py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            {["ALL", "IN_USE", "RETURNED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  filter === st
                    ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                    : "text-slate-600 dark:text-white/70 hover:bg-white/10"
                }`}
              >
                {st === "ALL" ? "All Activity" : st === "IN_USE" ? "In Circulation" : "Returned"}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Items */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const isInUse = item.status === "IN_USE";
            return (
              <div
                key={item.id}
                className={`rounded-2xl p-5 border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isInUse
                    ? "glass-card border-amber-500/40 bg-amber-500/5 shadow-md"
                    : "glass border-slate-200 dark:border-white/5 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-glow">
                      {item.passCode}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                        isInUse
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      }`}
                    >
                      {isInUse ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                      {isInUse ? "IN CIRCULATION" : "SAFELY RETURNED"}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    {item.equipmentName}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-white/50 flex items-center gap-2">
                    <span>Student: <strong className="text-slate-800 dark:text-white">{item.studentName}</strong> ({item.department.split(" ")[0]})</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {item.lab}</span>
                  </p>

                  <p className="mt-2 text-[11px] text-slate-400 dark:text-white/40 font-mono">
                    {item.condition}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  {isInUse ? (
                    <GlowButton
                      onClick={() => handleReturn(item.id, item.equipmentName)}
                      className="py-2 px-4 text-xs font-semibold shadow-purple"
                    >
                      Confirm Return
                    </GlowButton>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Returned at {new Date(item.returnedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="glass p-12 text-center text-xs text-slate-500 dark:text-white/50">
              No checkouts match the current search filter.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
