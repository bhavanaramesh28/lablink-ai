import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu, Sun, Moon, ShieldCheck, User, KeyRound, ChevronDown, CheckCircle2, Bell,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../ui/LanguageSelector";
import { getNotificationsList } from "../../lib/mockData";
import { ROLES, dashboardPath } from "../../lib/navigation";

export default function Topbar({ role, onRoleChange, onMenu }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const notifications = getNotificationsList();
  const unreadNotifs = notifications.filter((n) => !n.read && (!n.role || n.role === user?.role));
  const unreadCount = unreadNotifs.length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificationsPath = user?.role === "FACULTY" ? "/faculty/notifications" : "/student/notifications";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#070B18]/80 px-4 py-3 backdrop-blur-xl lg:px-8 transition-colors duration-200">
      {/* Mobile Menu Trigger */}
      <button
        onClick={onMenu}
        className="lg:hidden text-slate-700 dark:text-white/80 hover:text-cyan-glow transition"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Security Status Pill (Hidden on tiny screens) */}
      <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full shadow-sm">
        <ShieldCheck size={13} />
        <span>Encrypted Connection • TLS 1.3 Active</span>
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-3">
        {/* Role Switcher */}
        <div className="hidden md:flex items-center gap-2">
          <label className="text-[11px] font-medium text-slate-500 dark:text-white/50">
            {t("common.switchView", "Switch View")}:
          </label>
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#101A35] px-2.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-glow"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-white dark:bg-[#101A35]">
                {r.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:border-cyan-glow/50 hover:text-cyan-glow transition shadow-sm"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-cyan-glow text-[10px] font-bold text-[#070B18] shadow-[0_0_8px_#00D9FF]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-cyan-glow/30 bg-white dark:bg-[#0B1224] p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5 px-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bell size={14} className="text-cyan-glow" /> Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="badge-cyan text-[10px] py-0 px-2">{unreadCount} new</span>
                )}
              </div>

              <div className="py-2 space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setNotifOpen(false);
                      navigate(notificationsPath);
                    }}
                    className={`cursor-pointer rounded-xl p-2.5 text-xs transition ${
                      !notif.read
                        ? "bg-cyan-glow/10 border border-cyan-glow/30 text-slate-900 dark:text-white"
                        : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-white/70"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5">
                      {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />}
                      <span className="line-clamp-1">{notif.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-white/50 line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono mt-1 block">
                      {notif.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-2 text-center">
                <Link
                  to={notificationsPath}
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-glow hover:underline flex items-center justify-center gap-1 py-1"
                >
                  View All Activity & Alerts <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Multi-Language Selector */}
        <LanguageSelector />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:border-cyan-glow/50 hover:text-cyan-glow transition shadow-sm"
          title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
        >
          {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-purple-600" />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-1.5 pr-3 hover:border-cyan-glow/40 transition"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt={user?.name || "User"}
              className="h-7 w-7 rounded-lg object-cover border border-cyan-glow/30"
            />
            <div className="hidden md:block text-left text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block line-clamp-1">
                {user?.name || "Campus Researcher"}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-white/50 font-mono">
                {user?.role || role}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 dark:text-white/40" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 dark:border-cyan-glow/30 bg-white dark:bg-[#0B1224] p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="border-b border-slate-200 dark:border-white/10 pb-3 px-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{user?.name || "Campus Researcher"}</p>
                <p className="text-[11px] text-slate-500 dark:text-white/50 truncate">{user?.email || "researcher@campus.edu"}</p>
                <span className="mt-1.5 badge-cyan text-[10px] py-0 px-2">{user?.role || role}</span>
              </div>

              <div className="py-2 space-y-1">
                <Link
                  to="/security"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyan-glow transition"
                >
                  <ShieldCheck size={16} className="text-cyan-glow" /> {t("nav.security", "Privacy & Security")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
