import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FlaskConical, Sparkles, CalendarCheck, ShieldCheck, Share2, ArrowRight,
  Cpu, Atom, CheckCircle2, ChevronRight, Activity, Zap, Layers, MapPin,
  Sun, Moon, User, LogOut,
} from "lucide-react";
import GlowButton from "../components/ui/GlowButton";
import GlassCard from "../components/ui/GlassCard";
import ScientificUniverseCanvas from "../components/3d/ScientificUniverseCanvas";
import NeuralConstellationCanvas from "../components/visuals/NeuralConstellationCanvas";
import FloatingLabElements from "../components/visuals/FloatingLabElements";
import BookingModal from "../components/modals/BookingModal";
import { getEquipmentList } from "../lib/mockData";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/ui/LanguageSelector";
import PageTransition from "../components/ui/PageTransition";

const features = [
  {
    icon: Sparkles,
    title: "AI Project Analyzer",
    text: "Describe your project thesis in plain English. Claude AI reasons through your experimental needs and identifies matched equipment in seconds.",
    color: "text-cyan-glow",
    border: "hover:border-cyan-glow/50",
  },
  {
    icon: Share2,
    title: "Cross-Department Sharing",
    text: "Break departmental silos. Access advanced cleanrooms, high-speed CNCs, and laser labs across all campus colleges with unified permissions.",
    color: "text-purple-glow",
    border: "hover:border-purple-glow/50",
  },
  {
    icon: CalendarCheck,
    title: "Smart Conflict-Free Booking",
    text: "Predictive slot scheduling eliminates double bookings and suggests optimal alternative windows when instruments are busy.",
    color: "text-aqua-glow",
    border: "hover:border-aqua-glow/50",
  },
  {
    icon: ShieldCheck,
    title: "Faculty Governance",
    text: "AI assists and accelerates the workflow, but faculty advisors maintain full safety review, clearance permissions, and audit logs.",
    color: "text-blue-neon",
    border: "hover:border-blue-neon/50",
  },
];

const stats = [
  { value: "140+", label: "Calibrated Instruments", sub: "Across 18 Labs" },
  { value: "99.4%", label: "Uptime Reliability", sub: "Proactive Calibration" },
  { value: "3,400+", label: "Research Hours Logged", sub: "This Semester" },
  { value: "100%", label: "Faculty Oversight", sub: "Safety Guaranteed" },
];

export default function Landing() {
  const [equipmentList] = useState(getEquipmentList().slice(0, 4));
  const [selectedEq, setSelectedEq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [quickInput, setQuickInput] = useState("");

  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const handleBook = (eq) => {
    setSelectedEq(eq);
    setModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen text-slate-900 dark:text-white selection:bg-cyan-glow/30 selection:text-white overflow-hidden transition-colors duration-200">
        {/* 3D & Particle Visual Layer */}
        <ScientificUniverseCanvas density="high" showFloatingObjects={true} />
        <NeuralConstellationCanvas variant="hero" />
        <FloatingLabElements />

        {/* Global Navigation Header */}
        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/5 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-glow via-blue-neon to-purple-glow shadow-cyan text-[#070B18]">
              <FlaskConical size={22} />
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                LabLink <span className="text-cyan-glow">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-cyan-700 dark:text-cyan-glow/70 uppercase">
                Autonomous Lab Network
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-white/70">
            <Link to="/student/equipment" className="hover:text-cyan-glow transition">
              {t("nav.discover", "Equipment Catalog")}
            </Link>
            <Link to="/student/analyzer" className="hover:text-cyan-glow transition flex items-center gap-1">
              <Sparkles size={13} className="text-purple-glow" /> {t("nav.analyzer", "AI Analyzer")}
            </Link>
            <Link to="/student/bookings" className="hover:text-cyan-glow transition">
              {t("nav.bookings", "Live Schedule")}
            </Link>
            <Link to="/security" className="hover:text-cyan-glow transition flex items-center gap-1">
              <ShieldCheck size={13} className="text-cyan-glow" /> {t("nav.security", "Security")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Multi-Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:border-cyan-glow/50 hover:text-cyan-glow transition shadow-sm"
              title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
            >
              {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-purple-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/student">
                  <GlowButton className="text-xs py-2 px-4 shadow-cyan">
                    Enter Hub ({user.name.split(" ")[0]}) <ArrowRight size={14} />
                  </GlowButton>
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-300 dark:border-white/10 p-2 text-slate-500 dark:text-white/60 hover:text-rose-500 transition"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <GlowButton className="text-xs py-2 px-4 shadow-cyan">
                  {t("common.signIn", "Sign In")} <ArrowRight size={14} />
                </GlowButton>
              </Link>
            )}
          </div>
        </header>

        {/* Full-Screen Futuristic Hero Section */}
        <section className="relative z-10 flex min-h-[85vh] flex-col justify-center px-6 pt-12 pb-20 text-center max-w-5xl mx-auto">
          {/* Centered Ambient Aura */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-glow/15 via-purple-glow/15 to-transparent blur-3xl animate-pulse-glow" />

          {/* Badge */}
          <div className="relative mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-gradient-to-r from-cyan-glow/10 via-purple-glow/10 to-cyan-glow/10 px-4 py-1.5 backdrop-blur-xl shadow-cyan">
            <span className="h-2 w-2 rounded-full bg-cyan-glow animate-ping" />
            <span className="text-xs font-semibold tracking-wide text-cyan-700 dark:text-cyan-glow uppercase font-mono">
              {t("hero.badge", "Next-Gen AI Laboratory Ecosystem")}
            </span>
          </div>

          {/* Main Requested Heading */}
          <h1 className="relative text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            {t("hero.heading1", "Connecting Ideas.")}{" "}
            <span className="text-gradient block sm:inline">
              {t("hero.heading2", "Unlocking Laboratories.")}
            </span>
          </h1>

          {/* Requested Subheading */}
          <p className="relative mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-700 dark:text-white/70 leading-relaxed font-body">
            {t("hero.subheading", "Discover, share and access intelligent laboratory resources across your campus with LabLink AI.")}
          </p>

          {/* Two Requested Glowing Action Buttons */}
          <div className="relative mt-10 flex flex-wrap justify-center items-center gap-4">
            <GlowButton
              to="/student/equipment"
              className="py-3.5 px-8 text-sm font-semibold shadow-cyan"
            >
              {t("hero.exploreBtn", "Explore Laboratories")} <ArrowRight size={16} />
            </GlowButton>

            <GlowButton
              to="/student/analyzer"
              variant="ghost"
              className="py-3.5 px-8 text-sm font-semibold border-purple-glow/40 hover:border-purple-glow hover:shadow-purple text-purple-700 dark:text-purple-200"
            >
              <Sparkles size={16} className="text-purple-glow" /> {t("hero.analyzerBtn", "Experience AI Analyzer")}
            </GlowButton>
          </div>

          {/* Interactive Fast AI Prompt Teaser */}
          <div className="relative mx-auto mt-12 w-full max-w-2xl rounded-2xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-[#101A35]/60 p-2 backdrop-blur-2xl shadow-xl flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-glow ml-3 flex-shrink-0" />
            <input
              type="text"
              placeholder={t("hero.promptPlaceholder", "What project are you researching? (e.g. drone LIDAR, PCR assay, LoRaWAN node)...")}
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && quickInput.trim()) {
                  window.location.href = `/student/analyzer?q=${encodeURIComponent(quickInput)}`;
                }
              }}
              className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none"
            />
            <Link
              to={quickInput ? `/student/analyzer?q=${encodeURIComponent(quickInput)}` : "/student/analyzer"}
            >
              <button className="flex-shrink-0 rounded-xl bg-cyan-glow hover:bg-cyan-glow/90 px-4 py-2 text-xs font-semibold text-[#070B18] transition flex items-center gap-1 shadow-cyan">
                {t("hero.analyzeBtn", "Analyze")} <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </section>

        {/* Live Campus Telemetry Stats Strip */}
        <section className="relative z-10 border-y border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#101A35]/40 backdrop-blur-xl py-8">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow via-blue-neon to-purple-glow font-heading">
                  {s.value}
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-white/90">{s.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-white/40 font-mono">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Equipment Catalog Preview */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="badge-cyan text-xs">Live Resource Telemetry</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Featured Campus <span className="text-gradient">Instruments</span>
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
                Immediately available for online reservation and inter-departmental research.
              </p>
            </div>
            <Link to="/student/equipment">
              <GlowButton variant="ghost" className="text-xs py-2 px-4 flex items-center gap-1">
                View Full Inventory <ChevronRight size={14} />
              </GlowButton>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentList.map((eq) => (
              <div
                key={eq.id}
                className="glass-card group flex flex-col justify-between p-5 hover:border-cyan-glow/50 hover:shadow-cyan transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="badge-cyan text-[10px]">{eq.category}</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {eq.availableUnits} {t("common.available", "Available")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-glow transition">
                    {eq.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/50 flex items-center gap-1">
                    <MapPin size={12} className="text-aqua-glow flex-shrink-0" />
                    {eq.lab}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {eq.specs.slice(0, 2).map((sp, idx) => (
                      <span key={idx} className="rounded-md bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-[10px] text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/5">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-white/50">{eq.department.split(" ")[0]}</span>
                  <GlowButton
                    onClick={() => handleBook(eq)}
                    className="py-1 px-3 text-[11px]"
                  >
                    {t("common.bookSlot", "Book Slot")}
                  </GlowButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Pillars / Feature Highlights */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-purple text-xs">Architectural Pillars</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Engineered for Modern <span className="text-gradient">Academic Excellence</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
              Transforming fragmented laboratory silos into a connected, AI-guided campus ecosystem.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text, color, border }) => (
              <div
                key={title}
                className={`glass p-6 rounded-2xl transition duration-300 hover:-translate-y-1 ${border} hover:shadow-cyan`}
              >
                <div className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 ${color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 font-semibold text-base text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-600 dark:text-white/65 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Futuristic Call To Action */}
        <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 text-center">
          <div className="glass p-10 sm:p-14 rounded-3xl border-cyan-glow/40 shadow-cyan relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-glow/10 via-purple-glow/10 to-transparent" />
            <h2 className="relative text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Ready to Accelerate Your <span className="text-gradient">Research Thesis?</span>
            </h2>
            <p className="relative mt-3 max-w-xl mx-auto text-sm text-slate-600 dark:text-white/70">
              Get immediate access to campus instruments, AI synthesis, and seamless faculty endorsements today.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <GlowButton to="/student/analyzer" className="py-3 px-6 text-sm">
                <Sparkles size={16} /> Launch AI Analyzer
              </GlowButton>
              <GlowButton to="/student" variant="ghost" className="py-3 px-6 text-sm">
                Open Dashboard
              </GlowButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#070B18]/90 py-8 text-center text-xs text-slate-500 dark:text-white/50">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-cyan-glow" />
              <span className="font-semibold text-slate-800 dark:text-white">LabLink AI</span>
              <span>— Making College Laboratories More Accessible</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <Link to="/security" className="hover:text-cyan-glow transition">Privacy & Security</Link>
              <span>•</span>
              <span>Powered by Claude AI & WebGL 3D Simulation</span>
            </div>
          </div>
        </footer>
      </div>

      <BookingModal
        isOpen={modalOpen}
        initialEquipment={selectedEq}
        onClose={() => setModalOpen(false)}
      />
    </PageTransition>
  );
}
