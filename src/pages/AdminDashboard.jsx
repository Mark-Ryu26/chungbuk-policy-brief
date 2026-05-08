import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import Loading from "../components/Loading";
import { CATEGORIES } from "../lib/constants";
import { getAllItemsForAdmin, getCurrentWeekLabel, updateCurrentWeekLabel } from "../lib/policyApi";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [currentWeek, setCurrentWeek] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllItemsForAdmin(), getCurrentWeekLabel()])
      .then(([loadedItems, label]) => {
        setItems(loadedItems);
        setCurrentWeek(label);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const categoryCount = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
    items.forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    return {
      total: items.length,
      published: items.filter((item) => item.isPublished).length,
      hidden: items.filter((item) => !item.isPublished).length,
      categoryCount,
    };
  }, [items]);

  async function saveWeekLabel(event) {
    event.preventDefault();
    await updateCurrentWeekLabel(currentWeek);
    setMessage("기준 시점을 저장했습니다.");
  }

  if (loading) return <Loading />;

  return (
    <main className="admin-page">
      <AdminNav />
      <h1>관리자 대시보드</h1>
      <form className="setting-form" onSubmit={saveWeekLabel}>
        <label>
          메인 화면 기준 시점
          <input value={currentWeek} onChange={(e) => setCurrentWeek(e.target.value)} placeholder="2026년 5월 2주" />
        </label>
        <button type="submit">저장</button>
        {message && <p className="success-message">{message}</p>}
      </form>

      <section className="stats-grid">
        <Stat label="전체 콘텐츠" value={stats.total} />
        <Stat label="공개 콘텐츠" value={stats.published} />
        <Stat label="비공개 콘텐츠" value={stats.hidden} />
        <Stat label="중앙정부" value={stats.categoryCount["중앙정부"]} />
        <Stat label="지방정부" value={stats.categoryCount["지방정부"]} />
        <Stat label="해외정책" value={stats.categoryCount["해외정책"]} />
      </section>

      <section>
        <h2>최근 등록 콘텐츠</h2>
        <div className="admin-list">
          {items.slice(0, 6).map((item) => (
            <div className="admin-row" key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.category} · {item.isPublished ? "공개" : "비공개"}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
