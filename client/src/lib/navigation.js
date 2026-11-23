import {
  LayoutDashboard, Search, Sparkles, CalendarDays, ClipboardList, Bell, QrCode,
  CheckCircle2, Users, Boxes, Wrench, ScanLine, BarChart3, Building2,
} from "lucide-react";

export const ROLES = ["STUDENT", "FACULTY", "LAB_MANAGER", "ADMIN"];

export const navByRole = {
  STUDENT: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/equipment", label: "Discover Equipment", icon: Search },
    { to: "/student/analyzer", label: "AI Project Analyzer", icon: Sparkles },
    { to: "/student/bookings", label: "Booking Calendar", icon: CalendarDays },
    { to: "/student/requests", label: "My Requests", icon: ClipboardList },
    { to: "/student/checkout", label: "QR Checkout", icon: QrCode },
    { to: "/student/notifications", label: "Notifications", icon: Bell },
  ],
  FACULTY: [
    { to: "/faculty", label: "Dashboard", icon: LayoutDashboard },
    { to: "/faculty/requests", label: "Pending Requests", icon: CheckCircle2 },
    { to: "/faculty/history", label: "Approval History", icon: ClipboardList },
    { to: "/faculty/notifications", label: "Notifications", icon: Bell },
  ],
  LAB_MANAGER: [
    { to: "/manager", label: "Dashboard", icon: LayoutDashboard },
    { to: "/manager/equipment", label: "Manage Equipment", icon: Boxes },
    { to: "/manager/checkouts", label: "Checkouts & Returns", icon: ScanLine },
    { to: "/manager/maintenance", label: "Maintenance", icon: Wrench },
  ],
  ADMIN: [
    { to: "/admin", label: "Analytics", icon: BarChart3 },
    { to: "/admin/departments", label: "Departments", icon: Building2 },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/maintenance", label: "Maintenance Reports", icon: Wrench },
  ],
};

export const dashboardPath = {
  STUDENT: "/student",
  FACULTY: "/faculty",
  LAB_MANAGER: "/manager",
  ADMIN: "/admin",
};
