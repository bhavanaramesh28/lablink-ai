import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import AppLayout from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import PrivacySecurity from "./pages/PrivacySecurity";
import StudentDashboard from "./pages/StudentDashboard";
import DiscoverEquipment from "./pages/DiscoverEquipment";
import AIProjectAnalyzer from "./pages/AIProjectAnalyzer";
import BookingCalendar from "./pages/BookingCalendar";
import MyRequests from "./pages/MyRequests";
import QRCheckout from "./pages/QRCheckout";
import Notifications from "./pages/Notifications";
import FacultyRequests from "./pages/FacultyRequests";
import ApprovalHistory from "./pages/ApprovalHistory";
import ManageEquipment from "./pages/ManageEquipment";
import CheckoutsReturns from "./pages/CheckoutsReturns";
import MaintenanceManagement from "./pages/MaintenanceManagement";
import AdminAnalytics from "./pages/AdminAnalytics";
import DepartmentManagement from "./pages/DepartmentManagement";
import UserManagement from "./pages/UserManagement";
import MaintenanceReports from "./pages/MaintenanceReports";
import PlaceholderPage from "./pages/PlaceholderPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public Landing & Direct Workspace Access */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Navigate to="/student" replace />} />

            {/* Authenticated Application Layout */}
            <Route element={<AppLayout />}>
              {/* Student Features */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/equipment" element={<DiscoverEquipment />} />
              <Route path="/student/analyzer" element={<AIProjectAnalyzer />} />
              <Route path="/student/bookings" element={<BookingCalendar />} />
              <Route path="/student/requests" element={<MyRequests />} />
              <Route path="/student/checkout" element={<QRCheckout />} />
              <Route path="/student/notifications" element={<Notifications />} />

              {/* Faculty Features */}
              <Route path="/faculty" element={<FacultyRequests />} />
              <Route path="/faculty/requests" element={<FacultyRequests />} />
              <Route path="/faculty/history" element={<ApprovalHistory />} />
              <Route path="/faculty/notifications" element={<Notifications />} />

              {/* Lab Manager Features */}
              <Route path="/manager" element={<ManageEquipment />} />
              <Route path="/manager/equipment" element={<ManageEquipment />} />
              <Route path="/manager/checkouts" element={<CheckoutsReturns />} />
              <Route path="/manager/maintenance" element={<MaintenanceManagement />} />

              {/* Admin Features */}
              <Route path="/admin" element={<AdminAnalytics />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/departments" element={<DepartmentManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/maintenance" element={<MaintenanceReports />} />

              {/* Account & Security Governance */}
              <Route path="/security" element={<PrivacySecurity />} />
            </Route>

            {/* 404 Route */}
            <Route
              path="*"
              element={<PlaceholderPage title="Page Not Found" stage="404" description="The requested route does not exist. Please navigate back to the dashboard." />}
            />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
