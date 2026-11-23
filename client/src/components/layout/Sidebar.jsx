import { NavLink, Link, useNavigate } from "react-router-dom";
import { FlaskConical, X, ShieldCheck } from "lucide-react";
import { navByRole } from "../../lib/navigation";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const labelKeyMap = {
  "Dashboard": "nav.dashboard",
  "Discover Equipment": "nav.discover",
  "AI Project Analyzer": "nav.analyzer",
  "Booking Calendar": "nav.bookings",
  "My Requests": "nav.requests",
  "QR Checkout": "nav.checkout",
  "Notifications": "nav.notifications",
  "Pending Requests": "nav.pendingRequests",
  "Approval History": "nav.approvalHistory",
  "Manage Equipment": "nav.manageEquipment",
  "Checkouts & Returns": "nav.checkoutsReturns",
  "Analytics": "nav.analytics",
  "Privacy & Security": "nav.security",
};

export default function Sidebar({ role, open, onClose }) {
  const items = navByRole[role] || [];
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white/95 dark:bg-[#0B1224]/95 backdrop-blur-xl
        border-r border-slate-200 dark:border-white/10 p-5 flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-glow to-purple-glow text-[#070B18] shadow-cyan">
              <FlaskConical size={20} />
            </span>
            <span className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              LabLink <span className="text-cyan-glow">AI</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40">
            {role.replace("_", " ")} Workspace
          </div>

          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.split("/").length === 2}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-cyan-glow/15 text-cyan-700 dark:text-cyan-glow border border-cyan-glow/40 shadow-sm"
                    : "text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent"
                }`
              }
            >
              <Icon size={17} />
              {t(labelKeyMap[label] || label, label)}
            </NavLink>
          ))}

          {/* Security & Settings Section */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40">
              Account & Governance
            </div>
            <NavLink
              to="/security"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-cyan-glow/15 text-cyan-700 dark:text-cyan-glow border border-cyan-glow/40"
                    : "text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              <ShieldCheck size={17} className="text-cyan-glow" />
              {t("nav.security", "Privacy & Security")}
            </NavLink>
          </div>
        </nav>

        {/* User Card Footer */}
        {user && (
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 mt-auto">
            <div className="rounded-xl bg-slate-100 dark:bg-white/5 p-3 flex items-center justify-between border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-lg object-cover border border-cyan-glow/30 flex-shrink-0"
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-white/50 truncate">
                    {user.department?.split(" ")[0] || "Engineering"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
