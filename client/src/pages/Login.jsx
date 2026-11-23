import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FlaskConical, Lock, Mail, User, Eye, EyeOff, ShieldCheck, CheckCircle2,
  ArrowRight, KeyRound, Sun, Moon, Sparkles, Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth, DEMO_USERS } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";
import ScientificUniverseCanvas from "../components/3d/ScientificUniverseCanvas";
import NeuralConstellationCanvas from "../components/visuals/NeuralConstellationCanvas";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("student@campus.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Electronics & Communication");
  const [role, setRole] = useState("STUDENT");
  const [rememberMe, setRememberMe] = useState(true);

  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = {
    STUDENT: "/student",
    FACULTY: "/faculty",
    LAB_MANAGER: "/manager",
    ADMIN: "/admin",
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your campus email address.");
      return;
    }
    const loggedUser = login(email, password, role);
    navigate(redirectPath[loggedUser.role] || "/student");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    const newUser = register({ name, email, department, role });
    navigate(redirectPath[newUser.role] || "/student");
  };

  const handleDemoLogin = (roleKey) => {
    const demo = DEMO_USERS[roleKey];
    setEmail(demo.email);
    const logged = login(demo.email, "demoPassword123", demo.role);
    navigate(redirectPath[logged.role] || "/student");
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Dynamic Canvas Background */}
        <ScientificUniverseCanvas density="subtle" showFloatingObjects={false} />
        <NeuralConstellationCanvas variant="hero" />

        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-glow/15 blur-[140px]" />

        {/* Top Floating Controls */}
        <div className="absolute top-6 inset-x-6 max-w-6xl mx-auto flex items-center justify-between z-20">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-glow to-purple-glow shadow-cyan text-[#070B18]">
              <FlaskConical size={20} />
            </span>
            <span className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-glow transition">
              LabLink <span className="text-cyan-glow">AI</span>
            </span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-[#101A35]/80 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-white/80 shadow-sm backdrop-blur-md hover:border-cyan-glow/50 transition"
            title="Toggle Light / Dark mode"
          >
            {isDark ? (
              <>
                <Sun size={15} className="text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-purple-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Login / Register Card Container */}
        <div className="relative z-10 w-full max-w-lg mt-14 sm:mt-10">
          <div className="glass-card p-6 sm:p-9 border border-cyan-glow/40 shadow-2xl relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-glow via-blue-neon to-purple-glow" />

            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-glow/10 text-cyan-600 dark:text-cyan-glow border border-cyan-glow/30 mb-3">
                <ShieldCheck size={14} /> Institutional SSO & Security Gateway
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {isRegister ? "Create Campus Account" : "Access Laboratory Portal"}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-white/60">
                {isRegister
                  ? "Register for cross-departmental equipment sharing & AI assistance"
                  : "Sign in with your verified university credentials"}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-200/80 dark:bg-[#070B18]/80 p-1 border border-slate-300 dark:border-white/5">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`rounded-lg py-2 text-xs font-semibold transition ${
                  !isRegister
                    ? "bg-white dark:bg-[#101A35] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                    : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`rounded-lg py-2 text-xs font-semibold transition ${
                  isRegister
                    ? "bg-white dark:bg-[#101A35] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                    : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {/* Quick Demo 1-Click Access Buttons */}
            {!isRegister && (
              <div className="mt-5 rounded-2xl bg-cyan-glow/5 dark:bg-cyan-glow/5 border border-cyan-glow/20 p-3.5">
                <p className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-glow flex items-center gap-1.5 mb-2">
                  <Sparkles size={13} /> Instant Demo Access (One-Click Role Selection):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("STUDENT")}
                    className="rounded-lg bg-white dark:bg-[#101A35] border border-cyan-glow/30 px-2 py-1.5 text-[11px] font-semibold text-slate-800 dark:text-white hover:bg-cyan-glow hover:text-[#070B18] transition text-center shadow-sm"
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("FACULTY")}
                    className="rounded-lg bg-white dark:bg-[#101A35] border border-purple-glow/30 px-2 py-1.5 text-[11px] font-semibold text-slate-800 dark:text-white hover:bg-purple-glow hover:text-white transition text-center shadow-sm"
                  >
                    Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("LAB_MANAGER")}
                    className="rounded-lg bg-white dark:bg-[#101A35] border border-aqua-glow/30 px-2 py-1.5 text-[11px] font-semibold text-slate-800 dark:text-white hover:bg-aqua-glow hover:text-[#070B18] transition text-center shadow-sm"
                  >
                    Lab Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("ADMIN")}
                    className="rounded-lg bg-white dark:bg-[#101A35] border border-blue-neon/30 px-2 py-1.5 text-[11px] font-semibold text-slate-800 dark:text-white hover:bg-blue-neon hover:text-white transition text-center shadow-sm"
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            {!isRegister ? (
              <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                    Campus Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/80">
                      Password
                    </label>
                    <a href="#reset" onClick={(e) => { e.preventDefault(); toast("SSO password recovery link dispatched to your college email.", { icon: "📧" }); }} className="text-[11px] text-cyan-600 dark:text-cyan-glow hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-cyan-glow transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-white/70">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-cyan-glow"
                    />
                    Remember this workstation
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> TLS 1.3 Active
                  </span>
                </div>

                <GlowButton type="submit" className="w-full py-3 text-sm font-semibold shadow-cyan mt-2">
                  Sign In to Laboratory Hub <ArrowRight size={16} />
                </GlowButton>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input
                      type="text"
                      placeholder="e.g. Aditya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                    University Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input
                      type="email"
                      placeholder="student@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                      Academic Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="input-field py-2.5 text-xs"
                    >
                      <option value="STUDENT" className="bg-white dark:bg-[#101A35]">Student Researcher</option>
                      <option value="FACULTY" className="bg-white dark:bg-[#101A35]">Faculty Guide</option>
                      <option value="LAB_MANAGER" className="bg-white dark:bg-[#101A35]">Lab Custodian</option>
                      <option value="ADMIN" className="bg-white dark:bg-[#101A35]">Dean / Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="input-field py-2.5 text-xs"
                    >
                      <option value="Electronics & Communication" className="bg-white dark:bg-[#101A35]">ECE</option>
                      <option value="Computer Science & Robotics" className="bg-white dark:bg-[#101A35]">CSE</option>
                      <option value="Mechanical & Mechatronics" className="bg-white dark:bg-[#101A35]">Mechanical</option>
                      <option value="Biotechnology & Life Sciences" className="bg-white dark:bg-[#101A35]">Biotech</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1">
                    Set Secure Password
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <GlowButton type="submit" className="w-full py-3 text-sm font-semibold shadow-purple mt-3">
                  Register Laboratory Profile <ArrowRight size={16} />
                </GlowButton>
              </form>
            )}

            {/* Security Footer Assurance */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-cyan-glow" /> 256-bit AES-GCM Encrypted
              </span>
              <span>ISO/IEC 27001 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
