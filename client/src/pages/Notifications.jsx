import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell, CheckCircle2, Clock, AlertTriangle, ArrowRight, Check, Trash2, Filter, Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getNotificationsList, markNotificationRead, markAllNotificationsRead, saveNotificationsList,
} from "../lib/mockData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function Notifications() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(getNotificationsList());
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'approval' | 'alert'
  const navigate = useNavigate();

  // Filter based on user's role or general
  const roleNotifs = notifications.filter((n) => !n.role || n.role === user?.role || user?.role === "ADMIN");

  const filtered = roleNotifs.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "approval") return n.type === "APPROVAL" || n.type === "REQUEST";
    if (filter === "alert") return n.type === "ALERT";
    return true;
  });

  const unreadCount = roleNotifs.filter((n) => !n.read).length;

  const handleMarkAsRead = (id, actionUrl) => {
    const updated = markNotificationRead(id);
    setNotifications(updated);
    if (actionUrl) {
      navigate(actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead(user?.role);
    setNotifications(updated);
    toast.success("All notifications marked as read!");
  };

  const handleClear = () => {
    const remaining = notifications.filter((n) => n.role && n.role !== user?.role);
    setNotifications(remaining);
    saveNotificationsList(remaining);
    toast.success("Notifications feed cleared.");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl animate-pulse-glow" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge-cyan">{t("notifications.badge", "Real-Time Campus Telemetry")}</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                {t("notifications.title", "Notifications & Activity Alerts")}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                {t("notifications.subtitle", "Stay updated on faculty approvals, digital pass readiness, calibration schedules, and return deadlines.")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-2xl border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-2 text-xs font-semibold text-cyan-glow flex items-center gap-2 shadow-sm">
                <Bell size={16} /> {unreadCount} Unread Notifications
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                  : "text-slate-600 dark:text-white/70 hover:bg-white/10"
              }`}
            >
              {t("notifications.all", "All")} ({roleNotifs.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === "unread"
                  ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                  : "text-slate-600 dark:text-white/70 hover:bg-white/10"
              }`}
            >
              {t("notifications.unread", "Unread")} ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("approval")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === "approval"
                  ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                  : "text-slate-600 dark:text-white/70 hover:bg-white/10"
              }`}
            >
              {t("notifications.approvals", "Approvals & Passes")}
            </button>
            <button
              onClick={() => setFilter("alert")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === "alert"
                  ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                  : "text-slate-600 dark:text-white/70 hover:bg-white/10"
              }`}
            >
              {t("notifications.alerts", "Maintenance Alerts")}
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-glow hover:bg-cyan-glow/10 transition flex items-center gap-1.5"
              >
                <Check size={14} /> {t("notifications.markAllRead", "Mark all read")}
              </button>
            )}
            <button
              onClick={handleClear}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-500 transition flex items-center gap-1.5"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {filtered.map((notif) => {
            const isUnread = !notif.read;
            return (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id, notif.actionUrl)}
                className={`cursor-pointer rounded-2xl p-4.5 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUnread
                    ? "glass-card border-cyan-glow/50 shadow-cyan bg-cyan-glow/5 dark:bg-cyan-glow/5"
                    : "glass border-slate-200 dark:border-white/5 opacity-85 hover:opacity-100 hover:border-cyan-glow/30"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Status Icon */}
                  <span
                    className={`mt-0.5 grid h-10 w-10 place-items-center rounded-xl flex-shrink-0 ${
                      notif.type === "APPROVAL"
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                        : notif.type === "REQUEST"
                        ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                        : notif.type === "ALERT"
                        ? "bg-purple-glow/15 text-purple-glow border border-purple-glow/30"
                        : "bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30"
                    }`}
                  >
                    {notif.type === "APPROVAL" ? (
                      <CheckCircle2 size={18} />
                    ) : notif.type === "ALERT" ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <Bell size={18} />
                    )}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-cyan-glow animate-ping" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-white/70 max-w-2xl leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="mt-2 block text-[11px] text-slate-400 dark:text-white/40 font-mono">
                      {notif.time}
                    </span>
                  </div>
                </div>

                {notif.actionUrl && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-glow self-end sm:self-center flex-shrink-0">
                    <span>View details</span>
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="glass p-12 text-center">
              <Bell size={36} className="mx-auto text-slate-300 dark:text-white/30 mb-2" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                No notifications in this view
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-white/50">
                You're all caught up! New lab approvals and alerts will appear here in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
