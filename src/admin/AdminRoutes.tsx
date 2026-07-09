import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import AdminLayout from "./AdminLayout";
import ProfileSection from "./sections/ProfileSection";
import AboutSection from "./sections/AboutSection";
import TechStackSection from "./sections/TechStackSection";
import ProjectsSection from "./sections/ProjectsSection";
import ExperienceSection from "./sections/ExperienceSection";
import CertificationsSection from "./sections/CertificationsSection";
import GallerySection from "./sections/GallerySection";
import LinksSection from "./sections/LinksSection";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-surface-dark">
        <p className="text-sm text-ink-500">Loading…</p>
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="about" element={<AboutSection />} />
          <Route path="tech" element={<TechStackSection />} />
          <Route path="projects" element={<ProjectsSection />} />
          <Route path="experience" element={<ExperienceSection />} />
          <Route path="certifications" element={<CertificationsSection />} />
          <Route path="gallery" element={<GallerySection />} />
          <Route path="links" element={<LinksSection />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
