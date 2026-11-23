import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock, Mail, User, Eye, EyeOff, ShieldCheck, CheckCircle2,
  ArrowRight, KeyRound, Sparkles, Copy, Check, GraduationCap,
  Wrench, Layers, ExternalLink, LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth, DEMO_USERS } from "../../context/AuthContext";
import GlowButton from "../ui/GlowButton";

const ACCOUNTS = [
  {
    roleKey: "STUDENT",
    roleName: "Student",
    user: DEMO_USERS.STUDENT,
    name: "Aditya Sharma",
    subtitle: "3rd Year Electronics & Comm.",
    email: "student@campus.edu",
    password: "demoPassword123",
    color: "cyan",
    badgeClass: "badge-cyan",
    borderActive: "border-cyan-glow shadow-[0_0_20px_rgba(0,217,255,0.25)]",
    icon: GraduationCap,
    permissions: "Book Instruments • Claude AI Analyzer • QR Passes • Notifications",
    dashboardPath: "/student",
  },
  {
    roleKey: "FACULTY",
    roleName: "Faculty Advisor",
    user: DEMO_USERS.FACULTY,
    name: "Dr. K. Ramanathan",
    subtitle: "Associate Professor & Lab Director",
    email: "faculty@campus.edu",
    password: "demoPassword123",
    color: "purple",
    badgeClass: "badge-purple",
    borderActive: "border-purple-glow shadow-[0_0_20px_rgba(139,92,246,0.25)]",
    icon: CheckCircle2,
    permissions: "Approve Student Requests • Department Clearance • Audit History",
    dashboardPath: "/faculty",
  },
  {
    roleKey: "LAB_MANAGER",
    roleName: "Lab Custodian",
    user: DEMO_USERS.LAB_MANAGER,
    name: "Vikram Malhotra",
    subtitle: "Central Instrumentation Facility",
    email: "manager@campus.edu",
    password: "demoPassword123",
    color: "aqua",
    badgeClass: "badge-aqua",
    borderActive: "border-aqua-glow shadow-[0_0_20px_rgba(67,230,207,0.25)]",
    icon: Wrench,
    permissions: "Manage Hardware Inventory • Bench QR Checkouts & Returns • Calibration",
    dashboardPath: "/manager",
  },
  {
    roleKey: "ADMIN",
    roleName: "Campus Dean",
    user: DEMO_USERS.ADMIN,
    name: "Dean Dr. Anita Deshmukh",
    subtitle: "Dean of Research & Innovation",
    email: "admin@campus.edu",
    password: "demoPassword123",
    color: "blue",
    badgeClass: "badge-cyan",
    borderActive: "border-blue-neon shadow-[0_0_20px_rgba(40,123,255,0.25)]",
    icon: ShieldCheck,
    permissions: "Campus Telemetry Analytics • Department Quotas • User Directory",
    dashboardPath: "/admin",
  },
];

export default function FrontPageLogin({ className = "" }) {
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [email, setEmail] = useState("student@campus.edu");
  const [password, setPassword] = useState("demoPassword123");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const handleSelectRole = (acc) => {
    setSelectedRole(acc.roleKey);
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleInstantLogin = (acc) => {
    handleSelectRole(acc);
    const logged = login(acc.email, acc.password, acc.roleKey);
    toast.success(`Authenticated as ${acc.name} (${acc.roleName})!`, {
      icon: "🔐",
      duration: 3500,
    });
    navigate(acc.dashboardPath);
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your campus email address.");
      return;
    }
    const logged = login(email, password, selectedRole);
    const acc = ACCOUNTS.find((a) => a.roleKey === logged.role) || ACCOUNTS[0];
    toast.success(`Welcome back, ${logged.name}!`, { icon: "👋" });
    navigate(acc.dashboardPath);
  };

  const copyToClipboard = (text, fieldId) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldId);
    toast.success(`Copied "${text}" to clipboard!`, { duration: 2000 });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div id="login-portal" className={`relative ${className}`}>
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-cyan-glow/10 blur-3xl animate-pulse-glow" />

      {/* Main Glassmorphism Container */}
      <div className="relative rounded-3xl border border-cyan-glow/30 bg-white/70 dark:bg-[#070B18]/80 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-2xl transition-colors duration-200">
        {/* Accent Strip */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-glow via-blue-neon to-purple-glow rounded-t-3xl" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-glow">
              <ShieldCheck size={14} /> Institutional SSO & Authentication Gateway
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Campus Access Portal & <span className="text-gradient">Login Details</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-white/60 max-w-2xl">
              Choose from the verified demo university accounts below or sign in directly with your email and password.
            </p>
          </div>

          {/* Current Session Indicator */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 px-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-xl object-cover border border-emerald-400/50"
              />
              <div className="text-left text-xs">
                <span className="block font-semibold text-slate-900 dark:text-white">
                  {user.name}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                  ● Active: {user.role}
                </span>
              </div>
              <Link to={ACCOUNTS.find((a) => a.roleKey === user.role)?.dashboardPath || "/student"}>
                <button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-bold text-[#070B18] transition flex items-center gap-1 shadow-sm">
                  Dashboard <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Main Grid: Left = Available Demo Accounts with Details, Right = Direct Sign In Form */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Left Column: 4 Demo Accounts with Full Details */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 flex items-center gap-1.5">
                <Sparkles size={14} className="text-cyan-glow" /> 1. Select a Verified Role Account
              </h3>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-glow/80 font-mono">
                Click any card to auto-fill or log in
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                const isSelected = selectedRole === acc.roleKey;
                return (
                  <div
                    key={acc.roleKey}
                    onClick={() => handleSelectRole(acc)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? `${acc.borderActive} bg-cyan-glow/5 dark:bg-cyan-glow/10 ring-1 ring-cyan-glow/40`
                        : "border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] hover:border-cyan-glow/40 hover:bg-slate-100/80 dark:hover:bg-white/5"
                    }`}
                  >
                    <div>
                      {/* Top Row: Role badge and icon */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${acc.badgeClass}`}>
                          {acc.roleName}
                        </span>
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-white/80">
                          <Icon size={14} />
                        </span>
                      </div>

                      {/* Name & Title */}
                      <h4 className="mt-2.5 text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {acc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-white/50 truncate">
                        {acc.subtitle}
                      </p>

                      {/* Explicit Credentials Display */}
                      <div className="mt-3 space-y-1.5 rounded-xl bg-slate-200/60 dark:bg-[#070B18]/70 p-2.5 text-xs font-mono border border-slate-300/60 dark:border-white/5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-white/40">Email:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-800 dark:text-cyan-glow font-semibold select-all">
                              {acc.email}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(acc.email, `${acc.roleKey}-email`);
                              }}
                              className="text-slate-400 hover:text-cyan-glow transition p-0.5"
                              title="Copy email"
                            >
                              {copiedField === `${acc.roleKey}-email` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-white/40">Password:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-800 dark:text-purple-300 font-semibold select-all">
                              {acc.password}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(acc.password, `${acc.roleKey}-pass`);
                              }}
                              className="text-slate-400 hover:text-purple-glow transition p-0.5"
                              title="Copy password"
                            >
                              {copiedField === `${acc.roleKey}-pass` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Permissions preview */}
                      <p className="mt-2 text-[10px] text-slate-500 dark:text-white/50 leading-relaxed line-clamp-1">
                        {acc.permissions}
                      </p>
                    </div>

                    {/* Instant 1-Click Login Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstantLogin(acc);
                      }}
                      className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-glow/15 hover:bg-cyan-glow hover:text-[#070B18] text-cyan-700 dark:text-cyan-glow border border-cyan-glow/40 py-1.5 px-3 text-xs font-semibold transition shadow-sm"
                    >
                      Instant Log In <ArrowRight size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Direct Sign In Form */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.02] p-5 sm:p-6 backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 flex items-center gap-1.5">
                  <KeyRound size={14} className="text-cyan-glow" /> 2. Sign In to Workspace
                </h3>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> TLS 1.3
                </span>
              </div>

              <form onSubmit={handleFormLogin} className="space-y-4">
                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                    Select Target Workspace
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      const acc = ACCOUNTS.find((a) => a.roleKey === newRole);
                      if (acc) handleSelectRole(acc);
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#101A35] px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:border-cyan-glow focus:outline-none"
                  >
                    {ACCOUNTS.map((acc) => (
                      <option key={acc.roleKey} value={acc.roleKey} className="bg-white dark:bg-[#101A35]">
                        {acc.roleName} — {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                    Campus Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      required
                      className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#101A35] pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-cyan-glow focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/80">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono">
                      (Default: demoPassword123)
                    </span>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#101A35] pl-10 pr-10 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-cyan-glow focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-glow transition"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <GlowButton type="submit" className="w-full py-2.5 text-xs font-bold shadow-cyan mt-2">
                  Sign In & Enter Dashboard <ArrowRight size={14} />
                </GlowButton>
              </form>
            </div>

            {/* Quick Helper Links */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50">
              <Link to="/login" className="hover:text-cyan-glow transition flex items-center gap-1">
                Full SSO Page <ExternalLink size={11} />
              </Link>
              <Link to="/security" className="hover:text-cyan-glow transition flex items-center gap-1">
                Security Governance <ShieldCheck size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
