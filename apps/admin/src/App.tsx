import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Layout } from "./components/Layout";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { Events } from "./pages/Events";
import { Store } from "./pages/Store";
import { Announcements } from "./pages/Announcements";
import { Media } from "./pages/Media";

import { AdminManagement } from "./pages/AdminManagement";
import { Donations } from "./pages/Donations";
import { Login } from "./pages/Login";
import { Loader2 } from "lucide-react";
import { IdleTimer } from "./components/IdleTimer";

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#031c34]">
        <Loader2 className="w-10 h-10 animate-spin text-[#85c9d8]" />
      </div>
    );
  }

  return (
    <>
      <IdleTimer />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/media"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Media />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Store />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Donations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <BrowserRouter basename="/admin">
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
