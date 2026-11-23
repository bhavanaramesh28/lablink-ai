import { useState } from "react";
import { CheckCircle2, XCircle, Clock, MapPin, User, MessageSquare, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getBookingsList, updateBookingStatus } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function FacultyRequests() {
  const [requests, setRequests] = useState(getBookingsList());
  const [remarksMap, setRemarksMap] = useState({});

  const handleApprove = (id) => {
    const remark = remarksMap[id] || "Approved. Please follow lab safety rules.";
    const updated = updateBookingStatus(id, "APPROVED", remark);
    setRequests(updated);
    toast.success("Request approved and student notified!", { icon: "✅" });
  };

  const handleReject = (id) => {
    const remark = remarksMap[id] || "Slot unavailable or requires prerequisite safety training.";
    const updated = updateBookingStatus(id, "REJECTED", remark);
    setRequests(updated);
    toast.error("Request rejected.");
  };

  const pendingList = requests.filter((r) => r.status === "PENDING");
  const processedList = requests.filter((r) => r.status !== "PENDING");

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <span className="badge-purple">Faculty Approvals Desk</span>
          <h1 className="mt-2 text-2xl font-bold lg:text-3xl">
            Pending Student <span className="text-gradient">Equipment Requests</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Review student research project justifications, verify instrument safety clearance, and grant reservation approvals.
          </p>
        </div>

        {/* Pending Requests List */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Awaiting Your Decision ({pendingList.length})
          </h2>

          {pendingList.map((req) => (
            <div
              key={req.id}
              className="glass-card p-5 border-amber-500/30 hover:border-amber-500/60 shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-glow">{req.id}</span>
                    <span className="badge-purple text-[10px]">{req.department}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/30">
                      <Clock size={11} /> Pending Review
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-semibold text-white">{req.equipmentName}</h3>
                  <p className="mt-1 text-xs text-white/80">
                    <strong>Project Topic:</strong> {req.projectName}
                  </p>
                  <p className="mt-1 text-xs text-white/50 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-cyan-glow" /> Student: <strong className="text-white">{req.studentName}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-aqua-glow" /> {req.lab}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-3 text-right border border-white/5">
                  <div className="text-xs font-semibold text-cyan-glow">{req.date}</div>
                  <div className="text-[11px] text-white/60">{req.slotTime} ({req.durationHours} hrs)</div>
                </div>
              </div>

              {/* Remarks Input & Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3 justify-between">
                <input
                  type="text"
                  placeholder="Add approval guidance or safety remark (optional)..."
                  value={remarksMap[req.id] || ""}
                  onChange={(e) =>
                    setRemarksMap({ ...remarksMap, [req.id]: e.target.value })
                  }
                  className="input-field py-1.5 text-xs flex-1"
                />

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="flex items-center gap-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3.5 py-2 text-xs font-medium text-rose-300 transition"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <GlowButton
                    onClick={() => handleApprove(req.id)}
                    className="py-2 px-4 text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 size={14} /> Approve Request
                  </GlowButton>
                </div>
              </div>
            </div>
          ))}

          {pendingList.length === 0 && (
            <div className="glass p-8 text-center text-xs text-white/50">
              🎉 No pending student requests. All decisions are up to date!
            </div>
          )}
        </div>

        {/* Processed History */}
        <div className="space-y-3 mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Previously Processed ({processedList.length})
          </h2>
          <div className="space-y-2">
            {processedList.map((item) => (
              <div
                key={item.id}
                className="glass p-3.5 flex items-center justify-between text-xs border-white/5"
              >
                <div>
                  <span className="font-semibold text-white">{item.studentName}</span>: {item.equipmentName}
                  <p className="text-[11px] text-white/40">{item.projectName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-white/50">{item.date}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      item.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
