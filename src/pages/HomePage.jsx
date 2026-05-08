import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PolicyCard from "../components/PolicyCard";
import { CATEGORY_ROUTES } from "../lib/constants";
import { getCurrentWeekLabel } from "../lib/dateLabel";
import { getPublishedItems } from "../lib/policyApi";

const TABS = [
  { key: "all", label: "전체" },
  { key: "central", label: "중앙" },
  { key: "local", label: "지방" },
  { key: "global", label: "해외" },
];

const HOME_SECTIONS = [
  { title: "이번 주 핫토픽", limit: 3 },
  { title: "이번 달 핫한 정책동향", limit: 4 },
  { title: "눈여겨 볼 국외 정책동향", limit: 3 },
];

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentWeek = getCurrentWeekLabel();

  useEffect(() => {
    async function load() {
      try {
        const loadedItems = await getPublishedItems();
        setItems(loadedItems);
      } catch (err) {
        setError(err.message || "정책동향을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const category = CATEGORY_ROUTES[activeTab];
    return category ? items.filter((item) => item.category === category) : items;
  }, [activeTab, items]);

  if (loading) return <Loading />;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <div className="page">
      <section className="week-panel">
        <span>현재 브리핑 기준</span>
        <strong>{currentWeek}</strong>
      </section>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {HOME_SECTIONS.map((section) => {
        const sectionItems = filteredItems.filter((item) => item.sectionType === section.title);
        return (
          <section className="content-section" key={section.title}>
            <div className="section-title-row">
              <h2>{section.title}</h2>
              <Link to="/list/all">더보기</Link>
            </div>
            {sectionItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="card-list">
                {sectionItems.slice(0, section.limit).map((item) => (
                  <PolicyCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
