import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireSupabase } from "../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: loginError } = await requireSupabase().auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;
      navigate("/admin");
    } catch (err) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-login-box">
        <h1>관리자 로그인</h1>
        <p>Supabase Auth에 등록한 이메일과 비밀번호로 로그인합니다.</p>
        <form className="admin-form" onSubmit={login}>
          <label>
            이메일
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button full" type="submit" disabled={loading}>
            {loading ? "로그인 중입니다." : "로그인"}
          </button>
        </form>
      </section>
    </main>
  );
}
