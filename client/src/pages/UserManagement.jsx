import { useState } from "react";
import {
  Users, UserCheck, ShieldCheck, Search, Filter, Plus, Mail,
  CheckCircle2, AlertCircle, Sparkles, X, ToggleLeft, ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getUsersDirectory, saveUsersDirectory, DEPARTMENTS } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function UserManagement() {
  const [users, setUsers] = useState(getUsersDirectory());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState("Electronics & Communication");
  const [identifier, setIdentifier] = useState("");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.identifier.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === "Active" ? "Suspended" : "Active";
        toast(`User ${u.name} status updated to ${nextStatus}`, { icon: "👤" });
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    saveUsersDirectory(updated);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !identifier.trim()) {
      toast.error("Please fill in name, email and identifier.");
      return;
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name,
      email,
      role,
      department,
      identifier,
      status: "Active",
      verified: true,
      totalBookings: 0,
      lastActive: "Just now",
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    saveUsersDirectory(updated);
    setShowModal(false);
    setName("");
    setEmail("");
    setIdentifier("");
    toast.success(`User ${newUser.name} enrolled with role ${role}!`, { icon: "🎉" });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-cyan">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl animate-pulse-glow" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge-cyan">Campus Identity & Governance</span>
              <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
                University User Directory & <span className="text-gradient">Permissions</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                Manage role-based privileges, review research verification standing, and enforce campus safety compliance across all 4 tiers.
              </p>
            </div>
            <GlowButton onClick={() => setShowModal(true)} className="py-2.5 px-4 text-xs flex items-center gap-2 shadow-cyan">
              <Plus size={15} /> Enroll User
            </GlowButton>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search users by name, email, roll number, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {["ALL", "STUDENT", "FACULTY", "LAB_MANAGER", "ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  roleFilter === r
                    ? "bg-cyan-glow text-[#070B18] shadow-cyan"
                    : "bg-[#101A35]/80 text-white/70 hover:bg-white/10"
                }`}
              >
                {r.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* User Directory Table */}
        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department & ID</th>
                  <th className="p-4">Research Activity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filtered.map((u) => {
                  const isActive = u.status === "Active";
                  const roleBadgeClass =
                    u.role === "STUDENT"
                      ? "badge-cyan"
                      : u.role === "FACULTY"
                      ? "badge-purple"
                      : u.role === "LAB_MANAGER"
                      ? "badge-aqua"
                      : "badge-cyan";

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition">
                      <td className="p-4">
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-white/50 font-mono">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${roleBadgeClass}`}>
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>{u.department}</div>
                        <div className="text-[11px] text-cyan-glow font-mono">{u.identifier}</div>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <div>{u.totalBookings} Bookings Logged</div>
                        <div className="text-white/40">Active {u.lastActive}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition border ${
                            isActive
                              ? "border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                              : "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                          }`}
                        >
                          {isActive ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-cyan-glow/40 bg-[#0B1224] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-cyan-glow" />
                <h3 className="text-base font-bold text-white">Enroll Campus Member</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Siddharth Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Campus Email Address</label>
                <input
                  type="email"
                  placeholder="siddharth.r@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Assigned Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field text-xs">
                    <option value="STUDENT">Student Researcher</option>
                    <option value="FACULTY">Faculty Advisor</option>
                    <option value="LAB_MANAGER">Lab Manager / Custodian</option>
                    <option value="ADMIN">Campus Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Roll No / Staff ID</label>
                  <input
                    type="text"
                    placeholder="22EC102"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input-field text-xs">
                  {DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-white/60">
                  Cancel
                </button>
                <GlowButton type="submit" className="py-2 px-5 text-xs shadow-cyan">
                  Enroll Member
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
