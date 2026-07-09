import { Route, Routes } from "react-router-dom";
import PublicSite from "./pages/PublicSite";
import AdminRoutes from "./admin/AdminRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
