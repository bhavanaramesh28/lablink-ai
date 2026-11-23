import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import AppLayout from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PrivacySecurity from "./pages/PrivacySecurity";
import StudentDashboard from "./pages/StudentDashboard";
import DiscoverEquipment from "./pages/DiscoverEquipment";
import AIProjectAnalyzer from "./pages/AIProjectAnalyzer";
import BookingCalendar from "./pages/BookingCalendar";
import MyRequests from "./pages/MyRequests";
import QRCheckout from "./pages/QRCheckout";
import Notifications from "./pages/Notifications";
import FacultyRequests from "./pages/FacultyRequests";
import ManageEquipment from "./pages/ManageEquipment";
import CheckoutsReturns from "./pages/CheckoutsReturns";
import AdminAnalytics from "./pages/AdminAnalytics";
import PlaceholderPage from "./pages/PlaceholderPage";
import { navByRole } from "./lib/navigation";

const stageFor = {
  Dashboard: [4, "Your personal overview with real data from the database."],
  "Approval History": [7, "Everything you have approved or rejected."],
  Maintenance: [7, "Maintenance status for equipment."],
  Departments: [7, "Manage registered departments."],
  Users: [7, "Manage registered users."],
  "Maintenance Reports": [7, "Maintenance summaries across the campus."],
};

const allRoutes = Object.values(navByRole).flat();

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
          {/* Public Landing & Login */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

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
            <Route path="/faculty/history" element={<FacultyRequests />} />
            <Route path="/faculty/notifications" element={<Notifications />} />

            {/* Lab Manager Features */}
            <Route path="/manager" element={<ManageEquipment />} />
            <Route path="/manager/equipment" element={<ManageEquipment />} />
            <Route path="/manager/checkouts" element={<CheckoutsReturns />} />

            {/* Admin Features */}
            <Route path="/admin" element={<AdminAnalytics />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />

            {/* Account & Security Governance */}
            <Route path="/security" element={<PrivacySecurity />} />

            {/* Fallback Placeholders */}
            {allRoutes.map(({ to, label }) => {
              const [stage, description] = stageFor[label] || [4, ""];
              return (
                <Route
                  key={to}
                  path={to}
                  element={<PlaceholderPage title={label} stage={stage} description={description} />}
                />
              );
            })}
          </Route>

          <Route
            path="*"
            element={<PlaceholderPage title="Page not found" stage="-" description="That page does not exist." />}
          />
        </Routes>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
