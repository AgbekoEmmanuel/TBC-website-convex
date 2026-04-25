import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Media } from './pages/Media';
import { Events } from './pages/Events';
import { Communities } from './pages/Communities';
import { Contact } from './pages/Contact';

import { Library } from './pages/Library';
import { WeeklyTeachings } from './pages/WeeklyTeachings';
import { FullGallery } from './pages/Gallery';
import { Give } from './pages/Give';

// Admin Imports
import { ThemeProvider as AdminThemeProvider } from "./admin/components/ThemeProvider";
import { AuthProvider as AdminAuthProvider } from "./admin/components/AuthProvider";
import { ProtectedRoute } from "./admin/components/ProtectedRoute";
import { Layout as AdminLayout } from "./admin/components/Layout";
import { Dashboard as AdminDashboard } from "./admin/pages/Dashboard";
import { Events as AdminEvents } from "./admin/pages/Events";
import { Sermons as AdminSermons } from "./admin/pages/Sermons";
import { PasscodeLogin } from "./admin/pages/PasscodeLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="media" element={<Media />} />
          <Route path="events" element={<Events />} />
          <Route path="communities" element={<Communities />} />
          <Route path="contact" element={<Contact />} />

          <Route path="library" element={<Library />} />
          <Route path="weekly-teachings" element={<WeeklyTeachings />} />
          <Route path="gallery" element={<FullGallery />} />
          <Route path="give" element={<Give />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminThemeProvider defaultTheme="dark" storageKey="tbc-admin-theme">
              <AdminAuthProvider>
                <Routes>
                  <Route path="/login" element={<PasscodeLogin />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <AdminLayout>
                          <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="/events" element={<AdminEvents />} />
                            <Route path="/sermons" element={<AdminSermons />} />
                            {/* Additional admin routes will be added here as migrated */}
                          </Routes>
                        </AdminLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AdminAuthProvider>
            </AdminThemeProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

