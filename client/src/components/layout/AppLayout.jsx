import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BackgroundManager from "../visuals/BackgroundManager";
import { useAuth } from "../../context/AuthContext";
import { dashboardPath } from "../../lib/navigation";

export default function AppLayout() {
  const { user } = useAuth();
  const [role, setRole] = useState(user?.role || "STUDENT");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Keep role in sync with user if user changes
  useEffect(() => {
    if (user?.role && user.role !== role) {
      setRole(user.role);
    }
  }, [user]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    navigate(dashboardPath[newRole]);
  };

  return (
    <div className="relative min-h-screen transition-colors duration-200">
      {/* Dynamic Futuristic 3D & Particle Background */}
      <BackgroundManager />

      {/* Main Layout Hierarchy */}
      <div className="relative z-10">
        <Sidebar role={role} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="lg:pl-64">
          <Topbar role={role} onRoleChange={handleRoleChange} onMenu={() => setMenuOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
