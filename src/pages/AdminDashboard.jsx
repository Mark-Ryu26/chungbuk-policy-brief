import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import Loading from "../components/Loading";
import { CATEGORIES } from "../lib/constants";
import { getCurrentWeekLabel } from "../lib/dateLabel";
import { getAllItemsForAdmin } from "../lib/policyApi";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentWeek = getCurrentWeekLabel();

  useEffect(() => {
    getAllItemsForAdmin()
      .then(setItems)
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

  if (loading) return <Loading />;

  return (
    <main className="admin-page">
      <AdminNav />
      <h1>관리자 대시보드</h1>
      <section className="setting-form auto-label-box">
        <strong>메인 화면 기준 시점</strong>
        <p>{currentWeek}</p>
        <span>현재 날짜에 맞춰 자동으로 표시됩니다.</span>
      </section>

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
