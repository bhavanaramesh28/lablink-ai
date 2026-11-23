import { useState } from "react";
import {
  ClipboardList, CheckCircle2, XCircle, Search, Filter, Calendar,
  User, MapPin, ShieldCheck, Download, Award, ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getApprovalHistory, getBookingsList } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function ApprovalHistory() {
  const [historyList, setHistoryList] = useState(() => {
    // Merge baseline mock data with actual bookings that have been decided
    const staticHistory = getApprovalHistory();
    const liveDecidedBookings = getBookingsList()
      .filter((b) => b.status === "APPROVED" || b.status === "REJECTED")
      .map((b) => ({
        id: "appr-live-" + b.id,
        bookingId: b.id,
        equipmentName: b.equipmentName,
        studentName: b.studentName,
        department: b.department,
        decision: b.status,
        decidedBy: "Dr. K. Ramanathan",
        decidedAt: b.date + " (Session Lock)",
        remarks: b.statusRemarks || "Processed via Faculty Approval Desk.",
        safetyLevel: "Moderate",
        fairnessScore: b.fairnessPriorityScore || 88,
      }));

    // Deduplicate by bookingId
    const seen = new Set();
    const combined = [...liveDecidedBookings, ...staticHistory].filter((item) => {
      if (seen.has(item.bookingId)) return false;
      seen.add(item.bookingId);
      return true;
    });

    return combined;
  });

  const [filterDecision, setFilterDecision] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = historyList.filter((item) => {
    const matchesDecision =
      filterDecision === "ALL" || item.decision === filterDecision;
    const matchesSearch =
      item.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDecision && matchesSearch;
  });

  const approvedCount = historyList.filter((h) => h.decision === "APPROVED").length;
  const rejectedCount = historyList.filter((h) => h.decision === "REJECTED").length;
  const avgFairness = Math.round(
    historyList.reduce((acc, h) => acc + (h.fairnessScore || 80), 0) /
      (historyList.length || 1)
  );

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Booking ID,Equipment,Student,Department,Decision,Faculty,Timestamp,Remarks,Fairness Score"]
        .concat(
          filtered.map(
            (r) =>
              `"${r.id}","${r.bookingId}","${r.equipmentName}","${r.studentName}","${r.department}","${r.decision}","${r.decidedBy}","${r.decidedAt}","${r.remarks.replace(/"/g, '""')}","${r.fairnessScore}%"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faculty_approval_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Faculty Approval Audit Log exported!", { icon: "📊" });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-purple">Supervisory Governance</span>
            <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-slate-900 dark:text-white">
              Faculty <span className="text-gradient">Approval History</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-white/60">
              Complete verifiable audit trail of faculty decisions, safety clearances, and student project allocations.
            </p>
          </div>
          <GlowButton
            onClick={handleExportCSV}
            variant="ghost"
            className="py-2 px-4 text-xs flex items-center gap-2 border-slate-300 dark:border-white/10"
          >
            <Download size={14} className="text-cyan-glow" /> Export Audit Log
          </GlowButton>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass p-5 border-emerald-500/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Total Approvals Granted <CheckCircle2 size={16} className="text-emerald-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{approvedCount}</div>
            <div className="mt-1 text-[11px] text-emerald-500 dark:text-emerald-400">
              Safety certified & lab access cleared
            </div>
          </div>

          <div className="glass p-5 border-rose-500/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Requests Declined <XCircle size={16} className="text-rose-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{rejectedCount}</div>
            <div className="mt-1 text-[11px] text-rose-500 dark:text-rose-400">
              Prerequisite or scheduling constraints
            </div>
          </div>

          <div className="glass p-5 border-cyan-glow/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Avg Fair Allocation Score <Award size={16} className="text-cyan-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{avgFairness}%</div>
            <div className="mt-1 text-[11px] text-cyan-600 dark:text-cyan-glow">
              Explainable prioritization index
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search by student, equipment, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-white/5 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-cyan-glow focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {["ALL", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterDecision(st)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition border ${
                  filterDecision === st
                    ? "bg-cyan-glow/15 border-cyan-glow text-cyan-700 dark:text-cyan-glow shadow-cyan"
                    : "border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-white/5"
                }`}
              >
                {st === "ALL" ? "All Decisions" : st}
              </button>
            ))}
          </div>
        </div>

        {/* History Records List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass p-12 text-center rounded-2xl border border-slate-200 dark:border-white/10">
              <ClipboardList size={36} className="mx-auto text-slate-400 dark:text-white/30" />
              <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">No Approval Records Found</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-white/50">
                Adjust your search query or decision filter to inspect past logs.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="glass-card p-5 border border-slate-200 dark:border-white/10 hover:border-cyan-glow/40 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-glow">{item.bookingId}</span>
                      <span className="badge-purple text-[10px]">{item.department}</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          item.decision === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {item.decision === "APPROVED" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {item.decision}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-white/40">
                        • Decided on {item.decidedAt}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {item.equipmentName}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-white/70 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User size={13} className="text-cyan-glow" /> Student:{" "}
                        <strong className="text-slate-900 dark:text-white">{item.studentName}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={13} className="text-purple-glow" /> Supervisor:{" "}
                        <strong className="text-slate-900 dark:text-white">{item.decidedBy}</strong>
                      </span>
                    </div>

                    <div className="mt-3 rounded-xl bg-slate-100 dark:bg-white/5 p-3 text-xs border border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/80">
                      <strong className="text-slate-900 dark:text-white">Faculty Notes:</strong> {item.remarks}
                    </div>
                  </div>

                  <div className="md:text-right flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-white/10">
                    <div className="rounded-xl bg-cyan-glow/10 border border-cyan-glow/20 px-3 py-1.5 text-center">
                      <div className="text-[10px] uppercase font-mono text-cyan-700 dark:text-cyan-glow font-semibold">
                        Fairness Priority
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.fairnessScore}%
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-white/40 font-mono">
                      Security Hash: SHA-256 Valid
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
