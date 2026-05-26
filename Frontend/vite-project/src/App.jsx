import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Header } from "./components/layout/Header";
import { AuthForm } from "./components/auth/AuthForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./components/NotFound";

import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "./components/layout/Sidebar";
import Employees from "./pages/Employees";
import AddStudent from "./pages/Admin/AddStudent";
import CounselorDashboard from "./pages/Counsellor/CounselorDashboard";
import TelecallerDashboard from "./pages/TelecallerDashboard/TelecallerDashboard";
// import CounsellorAndTelecaller from "./pages/CounsellorAndTelecaller";
import Counsellorfinal from "./pages/TelecallerDashboard/Counsellorfinal";
import AdminDashboard from "./pages/Admin/Admindashboard";
import LeadManagement from "./pages/Admin/LeadManagement";
import Departments from "./pages/Departments";
import TelecallerLead from "./pages/TelecallerDashboard/TelecallerLead";
import CounsellorLead from "./pages/Counsellor/CounsellorLead";
import EmployeeDevices from "./pages/EmployeeDevices";
import Goals from "./pages/Goals";
import HRDeviceManagement from "./pages/HRDeviceManagement";
import LeadBulkAssignment from "./components/LeadBulkAssignment";
import TelecallerAnalyticsDashboard from "./pages/TelecallerDashboard/TelecallerAnalyticsDashboard";
import FollowUps from "./pages/FollowUps";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <AuthForm />;

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header visible only on sm/md */}
      <div className="block lg:hidden">
        <Header />
      </div>

      <div className="flex flex-1">
        {/* Sidebar visible only on lg */}
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/auth"
        element={isAuthenticated ? <Dashboard /> : <AuthForm />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/addstudent"
        element={
          <ProtectedRoute>
            <AddStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leadbulkassignment"
        element={
          <ProtectedRoute>
            <LeadBulkAssignment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lead-management"
        element={
          <ProtectedRoute>
            <LeadManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/counsuller"
        element={
          <ProtectedRoute>
            <CounselorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tellcullerlead"
        element={
          <ProtectedRoute>
            <TelecallerLead />
          </ProtectedRoute>
        }
      />

      <Route
        path="/counsellorlead"
        element={
          <ProtectedRoute>
            <CounsellorLead />
          </ProtectedRoute>
        }
      />

      <Route
        path="/counsellorfinal"
        element={
          <ProtectedRoute>
            <Counsellorfinal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/department"
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-devices"
        element={
          <ProtectedRoute>
            <EmployeeDevices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/device-management"
        element={
          <ProtectedRoute>
            <HRDeviceManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/telecaller-analytics"
        element={
          <ProtectedRoute>
            <TelecallerAnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/follow-ups"
        element={
          <ProtectedRoute>
            <FollowUps />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
