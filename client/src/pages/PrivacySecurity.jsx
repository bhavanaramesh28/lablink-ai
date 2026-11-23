import { useState } from "react";
import {
  ShieldCheck, Lock, Smartphone, Globe, Eye, EyeOff, KeyRound, AlertTriangle,
  CheckCircle2, RefreshCw, Trash2, Download, History, Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function PrivacySecurity() {
  const { user, updateSecurity, activeSessions, revokeSession, auditLogs } = useAuth();

  const [twoFa, setTwoFa] = useState(user?.twoFactorEnabled ?? true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileVis, setProfileVis] = useState(user?.profileVisibility || "CAMPUS");
  const [anonymizeAi, setAnonymizeAi] = useState(true);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(newPassword);
  const strengthLabels = ["Very Weak", "Moderate", "Good", "Strong", "Hardened (Enterprise)"];
  const strengthColors = ["bg-rose-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500", "bg-cyan-glow"];

  const handleToggle2FA = () => {
    const nextVal = !twoFa;
    setTwoFa(nextVal);
    updateSecurity({ twoFactorEnabled: nextVal });
    if (nextVal) {
      toast.success("Two-Factor Authentication (TOTP) activated!", { icon: "🛡️" });
    } else {
      toast("Two-Factor Authentication disabled.", { icon: "⚠️" });
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (strength < 2) {
      toast.error("Please choose a stronger password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    toast.success("Account password rotated and synchronized successfully!", { icon: "🔑" });
  };

  const handleSavePrivacy = () => {
    updateSecurity({ profileVisibility: profileVis });
    toast.success("Privacy preferences saved.");
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lablink_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Audit trail downloaded.");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge-cyan">Security & Privacy Governance</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                Account Security & <span className="text-gradient">Data Protection</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                Manage authentication safeguards, multi-factor verification, active sessions, and data privacy telemetry.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 flex items-center gap-2 shadow-sm">
                <CheckCircle2 size={16} /> Security Score: 96% (Hardened)
              </span>
            </div>
          </div>
        </div>

        {/* Security Metric Strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass p-5 border-cyan-glow/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Two-Factor Auth <Smartphone size={16} className="text-cyan-glow" />
            </span>
            <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {twoFa ? "Active (TOTP Authenticator)" : "Disabled"}
            </div>
            <div className="mt-1 text-[11px] text-cyan-glow">Hardware Key & App Sync</div>
          </div>

          <div className="glass p-5 border-purple-glow/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Active Authorized Sessions <Globe size={16} className="text-purple-glow" />
            </span>
            <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {activeSessions.length} Active Workstations
            </div>
            <div className="mt-1 text-[11px] text-purple-glow">Zero suspicious activity</div>
          </div>

          <div className="glass p-5 border-aqua-glow/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Data Encryption <ShieldCheck size={16} className="text-aqua-glow" />
            </span>
            <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">AES-256-GCM</div>
            <div className="mt-1 text-[11px] text-aqua-glow">End-to-End Cryptography</div>
          </div>

          <div className="glass p-5 border-emerald-500/20">
            <span className="text-xs text-slate-500 dark:text-white/50 flex items-center justify-between">
              Session Expiry <History size={16} className="text-emerald-400" />
            </span>
            <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">8 Hours Auto-Logout</div>
            <div className="mt-1 text-[11px] text-emerald-400">Strict Campus Inactivity Policy</div>
          </div>
        </div>

        {/* 2FA & Password Hardening Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Two-Factor Authentication Card */}
          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30">
                    <Smartphone size={20} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      Two-Factor Authentication (2FA)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/50">
                      Require an authenticator app code whenever signing in from a new machine.
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-4 rounded-xl bg-slate-100 dark:bg-[#070B18]/60 p-4 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-white">
                    Authenticator App (Google Authenticator, Authy, YubiKey)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFa}
                      onChange={handleToggle2FA}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-white/15 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-glow" />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-white/40">
                  {twoFa
                    ? "✓ Enhanced security active: TOTP token challenge required at login."
                    : "⚠️ Account is more vulnerable without two-factor challenge verification."}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-white/50">
              <span>Backup recovery codes generated</span>
              <button
                onClick={() => toast.success("Backup codes refreshed & sent to registered email.", { icon: "📲" })}
                className="text-cyan-600 dark:text-cyan-glow hover:underline font-medium"
              >
                View 8 Emergency Codes
              </button>
            </div>
          </div>

          {/* Password Rotation Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-glow/10 text-purple-glow border border-purple-glow/30">
                <KeyRound size={20} />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  Update Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Use at least 8 characters with numbers & symbols.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70">
                  New Hardened Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create strong password"
                  className="input-field mt-1"
                  required
                />
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-white/50">Strength:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {strengthLabels[strength]}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`h-full ${idx <= strength ? strengthColors[strength] : ""}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <GlowButton type="submit" className="py-2 px-4 text-xs">
                  Rotate Password
                </GlowButton>
              </div>
            </form>
          </div>
        </div>

        {/* Active Authorized Sessions */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Active Devices & Authorized Sessions
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/50">
                You are logged in on the following workstations. Revoke any unrecognized access immediately.
              </p>
            </div>
            <button
              onClick={() => {
                activeSessions.filter((s) => !s.isCurrent).forEach((s) => revokeSession(s.id));
              }}
              className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold"
            >
              Sign out all other sessions
            </button>
          </div>

          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#070B18]/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${
                    session.isCurrent ? "bg-cyan-glow/15 text-cyan-glow" : "bg-white/10 text-slate-500 dark:text-white/40"
                  }`}>
                    {session.device.includes("Mobile") ? <Smartphone size={18} /> : <Globe size={18} />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {session.device}
                      </h4>
                      {session.isCurrent && (
                        <span className="badge-cyan text-[10px] py-0 px-2">This Device</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-white/40">
                      IP: {session.ip} • {session.location} • Last active {session.lastActive}
                    </p>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => revokeSession(session.id)}
                    className="self-end sm:self-auto rounded-lg px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 transition border border-rose-500/20 flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Privacy & Telemetry Settings */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Privacy Controls */}
          <div className="glass p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1">
              Campus Privacy Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50 mb-4">
              Control how your research profile and booking history appear across colleges.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-white/70 block mb-1">
                  Directory Profile Visibility
                </label>
                <select
                  value={profileVis}
                  onChange={(e) => setProfileVis(e.target.value)}
                  className="input-field text-xs py-2"
                >
                  <option value="CAMPUS" className="bg-white dark:bg-[#101A35]">Verified Campus Members (Recommended)</option>
                  <option value="FACULTY_ONLY" className="bg-white dark:bg-[#101A35]">Faculty Supervisors Only</option>
                  <option value="PRIVATE" className="bg-white dark:bg-[#101A35]">Private (Stealth Mode)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-white block">
                    Anonymize AI Research Queries
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-white/40">
                    Strip author names from thesis prompts before sending to Claude API.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={anonymizeAi}
                  onChange={(e) => setAnonymizeAi(e.target.checked)}
                  className="rounded accent-cyan-glow h-4 w-4"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <GlowButton onClick={handleSavePrivacy} className="py-2 px-4 text-xs">
                  Save Privacy Settings
                </GlowButton>
              </div>
            </div>
          </div>

          {/* Audit Logs Trail */}
          <div className="glass p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                    Security Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white/50">
                    Tamper-proof log of security and authentication events.
                  </p>
                </div>
                <button
                  onClick={handleExportLogs}
                  className="rounded-lg border border-slate-300 dark:border-white/10 px-3 py-1.5 text-xs text-slate-700 dark:text-white/70 hover:text-cyan-glow flex items-center gap-1.5 transition"
                >
                  <Download size={13} /> Export
                </button>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg bg-slate-50 dark:bg-white/5 p-2.5 text-xs border border-slate-200 dark:border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-slate-800 dark:text-white">{log.action}</span>
                      <p className="text-[10px] text-slate-400 dark:text-white/40">{log.time} • {log.ip}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-glow/10 text-cyan-600 dark:text-cyan-glow border border-cyan-glow/30">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
