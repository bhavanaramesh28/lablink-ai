import { useState } from "react";
import {
  Wrench, CheckCircle2, AlertTriangle, Calendar, Clock, Download,
  Search, ShieldAlert, CheckSquare, Activity, DollarSign, FileText,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import toast from "react-hot-toast";
import { getMaintenanceRecords, getEquipmentList } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

const DEPT_EXPENSE_DATA = [
  { dept: "ECE", cost: 380 },
  { dept: "CSE / AI", cost: 145 },
  { dept: "Mech FabLab", cost: 420 },
  { dept: "Chemical / Mat", cost: 210 },
  { dept: "Biotech", cost: 180 },
];

const COMPLIANCE_PIE = [
  { name: "Certified & Active", value: 92, color: "#00D9FF" },
  { name: "Scheduled Service", value: 5, color: "#8B5CF6" },
  { name: "Overdue Attention", value: 3, color: "#F43F5E" },
];

export default function MaintenanceReports() {
  const [records, setRecords] = useState(getMaintenanceRecords());
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = records.filter((r) => {
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchesSearch =
      r.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.technician.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalCostNumber = records.reduce((acc, r) => {
    const num = parseFloat(r.cost.replace(/[^0-9.]/g, "")) || 0;
    return acc + num;
  }, 0);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Record ID,Equipment,Type,Department,Lab,Service Date,Next Due,Status,Technician,Cost,Remarks"]
        .concat(
          filtered.map(
            (r) =>
              `"${r.id}","${r.equipmentName}","${r.type}","${r.department}","${r.lab}","${r.date}","${r.nextDue}","${r.status}","${r.technician}","${r.cost}","${r.remarks.replace(/"/g, '""')}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campus_maintenance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Campus Maintenance Audit Report exported!", { icon: "📈" });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-cyan">Campus Reliability & Compliance</span>
            <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-slate-900 dark:text-white">
              Campus Maintenance & <span className="text-gradient">Calibration Reports</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-white/60">
              Institutional oversight of certified laboratory instrument calibration, preventive servicing, and compliance telemetry.
            </p>
          </div>
          <GlowButton
            onClick={handleExportCSV}
            variant="ghost"
            className="py-2 px-4 text-xs flex items-center gap-2 border-slate-300 dark:border-white/10"
          >
            <Download size={14} className="text-cyan-glow" /> Export Full Report
          </GlowButton>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass p-5 border-cyan-glow/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Calibration Compliance <CheckCircle2 size={16} className="text-cyan-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">96.8%</div>
            <div className="mt-1 text-[11px] text-cyan-600 dark:text-cyan-glow">
              ISO / NIST standards certified
            </div>
          </div>

          <div className="glass p-5 border-purple-glow/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Total Recorded Audits <FileText size={16} className="text-purple-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{records.length} Logs</div>
            <div className="mt-1 text-[11px] text-purple-600 dark:text-purple-glow">
              Across 5 campus departments
            </div>
          </div>

          <div className="glass p-5 border-emerald-500/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Preventative Servicing <Activity size={16} className="text-emerald-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0 Zero Critical</div>
            <div className="mt-1 text-[11px] text-emerald-500 dark:text-emerald-400">
              No reported hardware breakdowns
            </div>
          </div>

          <div className="glass p-5 border-amber-500/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Maintenance Investment <DollarSign size={16} className="text-amber-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              ${totalCostNumber.toFixed(2)}
            </div>
            <div className="mt-1 text-[11px] text-amber-500 dark:text-amber-400">
              Semester preventative budget
            </div>
          </div>
        </div>

        {/* Visual Charts: Department Expenditure & Compliance Ratio */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Expenditure By Department */}
          <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-white/10 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Maintenance Investment by Department ($)
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Annual expenditure on optical cleaning, calibration, and replacement parts
                </p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_EXPENSE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dept" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} unit="$" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101A35",
                      border: "1px solid rgba(0, 217, 255, 0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="cost" fill="#00D9FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Breakdown */}
          <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Equipment Compliance Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/50">
                Certified active vs scheduled calibration
              </p>
            </div>
            <div className="h-44 my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COMPLIANCE_PIE}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {COMPLIANCE_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101A35",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
              {COMPLIANCE_PIE.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-white/70">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
            <input
              type="text"
              placeholder="Filter by instrument, technician, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-white/5 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-cyan-glow focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {["ALL", "Completed", "Scheduled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition border ${
                  filterStatus === st
                    ? "bg-cyan-glow/15 border-cyan-glow text-cyan-700 dark:text-cyan-glow shadow-cyan"
                    : "border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-white/5"
                }`}
              >
                {st === "ALL" ? "All Records" : st}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Table of Certified Maintenance Logs */}
        <div className="glass rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-white/80">
              <thead className="border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/60">
                <tr>
                  <th className="py-3 px-4">Instrument & ID</th>
                  <th className="py-3 px-4">Maintenance Type</th>
                  <th className="py-3 px-4">Department & Lab</th>
                  <th className="py-3 px-4">Certified Date</th>
                  <th className="py-3 px-4">Next Due</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Technician Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      <div>{r.equipmentName}</div>
                      <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-glow">{r.equipmentId}</span>
                    </td>
                    <td className="py-3.5 px-4">{r.type}</td>
                    <td className="py-3.5 px-4">
                      <div>{r.department}</div>
                      <div className="text-[10px] text-slate-500 dark:text-white/40">{r.lab}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-white/70">{r.date}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-600 dark:text-amber-400">{r.nextDue}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">{r.cost}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                          r.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {r.status === "Completed" ? (
                          <CheckCircle2 size={10} />
                        ) : (
                          <Clock size={10} />
                        )}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-500 dark:text-white/60" title={r.remarks}>
                      {r.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
