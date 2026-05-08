import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import SearchPage from "./pages/SearchPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminItems from "./pages/AdminItems";
import AdminItemForm from "./pages/AdminItemForm";

export default function App() {
  return (
    <div className="phone-shell">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items"
          element={
            <ProtectedRoute>
              <AdminItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items/new"
          element={
            <ProtectedRoute>
              <AdminItemForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items/:id/edit"
          element={
            <ProtectedRoute>
              <AdminItemForm />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/list/:type" element={<PublicLayout><ListPage /></PublicLayout>} />
        <Route path="/detail/:id" element={<PublicLayout><DetailPage /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
      </Routes>
    </div>
  );
}

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
