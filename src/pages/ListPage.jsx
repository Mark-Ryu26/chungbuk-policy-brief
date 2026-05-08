import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PolicyCard from "../components/PolicyCard";
import { CATEGORY_LABELS, CATEGORY_ROUTES } from "../lib/constants";
import { getPublishedItems } from "../lib/policyApi";

export default function ListPage() {
  const { type = "all" } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublishedItems()
      .then(setItems)
      .catch((err) => setError(err.message || "목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const category = CATEGORY_ROUTES[type];
    return category ? items.filter((item) => item.category === category) : items;
  }, [items, type]);

  if (loading) return <Loading />;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <div className="page">
      <h1 className="page-title">{CATEGORY_LABELS[type] || "전체"} 정책동향</h1>
      {filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="card-list">
          {filteredItems.map((item) => (
            <PolicyCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
