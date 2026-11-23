import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { BarChart3, TrendingUp, Users, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";
import PageTransition from "../components/ui/PageTransition";

const UTILIZATION_DATA = [
  { month: "Jun", hours: 420 },
  { month: "Jul", hours: 680 },
  { month: "Aug", hours: 950 },
  { month: "Sep", hours: 1420 },
  { month: "Oct", hours: 1980 },
  { month: "Nov", hours: 2640 },
];

const DEPT_ALLOCATION = [
  { dept: "ECE", bookings: 148 },
  { dept: "CSE", bookings: 132 },
  { dept: "Mech", bookings: 96 },
  { dept: "Biotech", bookings: 84 },
  { dept: "Physics", bookings: 62 },
];

const STATUS_DATA = [
  { name: "Active In-Use", value: 68, color: "#00D9FF" },
  { name: "Available Free", value: 24, color: "#43E6CF" },
  { name: "Under Calibration", value: 8, color: "#8B5CF6" },
];

export default function AdminAnalytics() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <span className="badge-cyan">Campus Operations Intelligence</span>
          <h1 className="mt-2 text-2xl font-bold lg:text-3xl">
            Campus Laboratory <span className="text-gradient">Analytics Engine</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Real-time telemetry on cross-department equipment utilization, scheduling velocity, and facility throughput.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass p-5 border-cyan-glow/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Total Utilization <TrendingUp size={14} className="text-cyan-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">2,640 hrs</div>
            <div className="mt-1 text-[11px] text-cyan-glow">+28% vs previous semester</div>
          </div>

          <div className="glass p-5 border-purple-glow/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Registered Assets <Activity size={14} className="text-purple-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">142 Units</div>
            <div className="mt-1 text-[11px] text-purple-glow">Across 18 specialized labs</div>
          </div>

          <div className="glass p-5 border-aqua-glow/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Active Researchers <Users size={14} className="text-aqua-glow" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">840 Students</div>
            <div className="mt-1 text-[11px] text-aqua-glow">42 Faculty Supervisors</div>
          </div>

          <div className="glass p-5 border-emerald-500/20">
            <span className="text-xs text-white/50 flex items-center justify-between">
              Campus Uptime <ShieldCheck size={14} className="text-emerald-400" />
            </span>
            <div className="mt-2 text-2xl font-bold text-white">99.2%</div>
            <div className="mt-1 text-[11px] text-emerald-400">Zero safety incidents</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Utilization Trend Area Chart */}
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Laboratory Hours Trend (Semester to Date)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={UTILIZATION_DATA}>
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#ffffff60" fontSize={11} />
                  <YAxis stroke="#ffffff60" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101A35",
                      borderColor: "#00D9FF40",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#cyanGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown Bar Chart */}
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Bookings by Department</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_ALLOCATION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="dept" stroke="#ffffff60" fontSize={11} />
                  <YAxis stroke="#ffffff60" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101A35",
                      borderColor: "#8B5CF640",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="bookings" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
