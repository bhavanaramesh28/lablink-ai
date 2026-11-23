import { Link } from "react-router-dom";
import { FlaskConical, Sun, Moon, ShieldCheck, LogOut, ArrowRight, Lock } from "lucide-react";
import ScientificUniverseCanvas from "../components/3d/ScientificUniverseCanvas";
import NeuralConstellationCanvas from "../components/visuals/NeuralConstellationCanvas";
import FloatingLabElements from "../components/visuals/FloatingLabElements";
import FrontPageLogin from "../components/auth/FrontPageLogin";
import LanguageSelector from "../components/ui/LanguageSelector";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col justify-between text-slate-900 dark:text-white selection:bg-cyan-glow/30 selection:text-white overflow-x-hidden transition-colors duration-200">
        {/* 3D & Particle Visual Layer */}
        <ScientificUniverseCanvas density="high" showFloatingObjects={true} />
        <NeuralConstellationCanvas variant="hero" />
        <FloatingLabElements />

        {/* Global Minimalist Header */}
        <header className="relative z-20 mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-glow via-blue-neon to-purple-glow shadow-cyan text-[#070B18]">
              <FlaskConical size={22} />
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                LabLink <span className="text-cyan-glow">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-cyan-700 dark:text-cyan-glow/70 uppercase">
                Autonomous Laboratory Gateway
              </span>
            </div>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Security Pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full shadow-sm">
              <ShieldCheck size={13} />
              <span>TLS 1.3 SSO Active</span>
            </div>

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

            {isAuthenticated && user && (
              <div className="flex items-center gap-2">
                <Link to={user.role === "FACULTY" ? "/faculty" : user.role === "LAB_MANAGER" ? "/manager" : user.role === "ADMIN" ? "/admin" : "/student"}>
                  <GlowButton className="text-xs py-2 px-3.5 shadow-cyan">
                    Enter Workspace ({user.name.split(" ")[0]}) <ArrowRight size={13} />
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
            )}
          </div>
        </header>

        {/* Central Dedicated Login Details & Portal Container */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <FrontPageLogin className="w-full my-auto" />
        </main>

        {/* Minimal Institutional Footer */}
        <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#070B18]/70 py-4 text-center text-xs text-slate-500 dark:text-white/50 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <FlaskConical size={14} className="text-cyan-glow" />
              <span className="font-semibold text-slate-800 dark:text-white">LabLink AI</span>
              <span>— Next-Generation Autonomous University Laboratory Network</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/security" className="hover:text-cyan-glow transition flex items-center gap-1">
                <ShieldCheck size={12} className="text-cyan-glow" /> Privacy & Security Governance
              </Link>
              <span>•</span>
              <span className="font-mono text-cyan-600 dark:text-cyan-glow/80">Encrypted End-to-End</span>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
