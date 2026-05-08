import { Link, useNavigate } from "react-router-dom";
import { requireSupabase } from "../lib/supabase";

export default function AdminNav() {
  const navigate = useNavigate();

  async function logout() {
    await requireSupabase().auth.signOut();
    navigate("/admin/login");
  }

  return (
    <nav className="admin-nav">
      <Link to="/admin">대시보드</Link>
      <Link to="/admin/items">콘텐츠 관리</Link>
      <Link to="/admin/items/new">신규 등록</Link>
      <button type="button" onClick={logout}>로그아웃</button>
    </nav>
  );
}
