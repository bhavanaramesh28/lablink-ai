import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const DEMO_USERS = {
  STUDENT: {
    id: "usr-student-01",
    name: "Aditya Sharma",
    email: "student@campus.edu",
    role: "STUDENT",
    department: "Electronics & Communication",
    rollNo: "22EC042",
    twoFactorEnabled: false,
    profileVisibility: "CAMPUS",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  FACULTY: {
    id: "usr-faculty-01",
    name: "Dr. K. Ramanathan",
    email: "faculty@campus.edu",
    role: "FACULTY",
    department: "Electronics & Communication",
    designation: "Associate Professor & Lab Director",
    twoFactorEnabled: true,
    profileVisibility: "PUBLIC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  LAB_MANAGER: {
    id: "usr-manager-01",
    name: "Vikram Malhotra",
    email: "manager@campus.edu",
    role: "LAB_MANAGER",
    department: "Central Instrumentation Facility",
    designation: "Chief Laboratory Custodian",
    twoFactorEnabled: true,
    profileVisibility: "CAMPUS",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  ADMIN: {
    id: "usr-admin-01",
    name: "Dean Dr. Anita Deshmukh",
    email: "admin@campus.edu",
    role: "ADMIN",
    department: "Academic Administration",
    designation: "Dean of Research & Innovation",
    twoFactorEnabled: true,
    profileVisibility: "CAMPUS",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lablink_current_user");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default active demo user is Student for quick exploration
    return DEMO_USERS.STUDENT;
  });

  const [activeSessions, setActiveSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("lablink_sessions");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "sess-1",
        device: "Current Device (Windows 11 / Chrome 126)",
        ip: "192.168.45.120",
        location: "Campus High-Speed WiFi (Main Building)",
        lastActive: "Just now",
        isCurrent: true,
      },
      {
        id: "sess-2",
        device: "Mobile App (Android 14 / Pixel 8)",
        ip: "103.21.144.18",
        location: "Cellular Network",
        lastActive: "2 hours ago",
        isCurrent: false,
      },
    ];
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("lablink_audit_logs");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: "log-1", action: "Successful Authentication (OAuth 2.0 / Campus SSO)", time: "Today at 09:15 AM", status: "SUCCESS", ip: "192.168.45.120" },
      { id: "log-2", action: "Hardware Access Pass Generated (QR Checkout)", time: "Yesterday at 04:30 PM", status: "SUCCESS", ip: "192.168.45.120" },
      { id: "log-3", action: "Security Policy Verification Passed", time: "21 Nov 2026", status: "VERIFIED", ip: "192.168.45.120" },
    ];
  });

  const addAuditLog = (action, status = "SUCCESS") => {
    const newLog = {
      id: "log-" + Date.now(),
      action,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status,
      ip: "192.168.45.120",
    };
    const updated = [newLog, ...auditLogs.slice(0, 15)];
    setAuditLogs(updated);
    try {
      localStorage.setItem("lablink_audit_logs", JSON.stringify(updated));
    } catch (e) {}
  };

  const login = (email, password, roleHint = "STUDENT") => {
    // Check demo users
    const matchedRole = Object.keys(DEMO_USERS).find(
      (k) => DEMO_USERS[k].email.toLowerCase() === email.toLowerCase() || DEMO_USERS[k].role === roleHint
    );

    const baseUser = matchedRole ? DEMO_USERS[matchedRole] : {
      id: "usr-" + Date.now(),
      name: email.split("@")[0].replace(".", " ").replace(/^\w/, (c) => c.toUpperCase()),
      email,
      role: roleHint,
      department: "Cross-Disciplinary Research",
      twoFactorEnabled: false,
      profileVisibility: "CAMPUS",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    };

    const loggedInUser = {
      ...baseUser,
      token: "jwt-sec-" + Math.random().toString(36).substring(2) + Date.now(),
      lastLogin: new Date().toISOString(),
    };

    setUser(loggedInUser);
    try {
      localStorage.setItem("lablink_current_user", JSON.stringify(loggedInUser));
    } catch (e) {}

    addAuditLog(`User login as ${loggedInUser.name} (${loggedInUser.role})`, "SUCCESS");
    toast.success(`Welcome back, ${loggedInUser.name}!`, { icon: "🔐" });
    return loggedInUser;
  };

  const register = (data) => {
    const newUser = {
      id: "usr-" + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role || "STUDENT",
      department: data.department || "General Engineering",
      rollNo: data.rollNo || "",
      twoFactorEnabled: false,
      profileVisibility: "CAMPUS",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      token: "jwt-sec-" + Math.random().toString(36).substring(2) + Date.now(),
      lastLogin: new Date().toISOString(),
    };

    setUser(newUser);
    try {
      localStorage.setItem("lablink_current_user", JSON.stringify(newUser));
    } catch (e) {}

    addAuditLog(`New account registered: ${newUser.name} (${newUser.role})`, "SUCCESS");
    toast.success("Account registered securely! Welcome to LabLink AI.", { icon: "🎉" });
    return newUser;
  };

  const logout = () => {
    addAuditLog(`User ${user?.name || "Member"} safely signed out`, "LOGOUT");
    setUser(null);
    try {
      localStorage.removeItem("lablink_current_user");
    } catch (e) {}
    toast.success("Signed out safely. Session token invalidated.", { icon: "👋" });
  };

  const updateSecurity = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      localStorage.setItem("lablink_current_user", JSON.stringify(updated));
    } catch (e) {}
    addAuditLog(`Security preferences updated: ${Object.keys(updates).join(", ")}`, "UPDATED");
    toast.success("Security & privacy preferences updated!");
  };

  const revokeSession = (sessionId) => {
    const updated = activeSessions.filter((s) => s.id !== sessionId);
    setActiveSessions(updated);
    try {
      localStorage.setItem("lablink_sessions", JSON.stringify(updated));
    } catch (e) {}
    addAuditLog(`Remote session revoked (${sessionId})`, "REVOKED");
    toast.success("Remote session revoked successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateSecurity,
        activeSessions,
        revokeSession,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
