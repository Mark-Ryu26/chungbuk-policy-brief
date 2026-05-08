import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PolicyCard from "../components/PolicyCard";
import { getPublishedItems } from "../lib/policyApi";

function matchesKeyword(item, keyword) {
  const target = [
    item.title,
    item.source,
    item.category,
    item.summary,
    item.body,
    item.implication,
    ...(item.bullets || []),
    ...(item.tags || []),
  ]
    .join(" ")
    .toLocaleLowerCase("ko-KR");
  return target.includes(keyword.toLocaleLowerCase("ko-KR"));
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublishedItems()
      .then(setItems)
      .catch((err) => setError(err.message || "검색 결과를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(
    () => items.filter((item) => matchesKeyword(item, keyword)),
    [items, keyword]
  );

  if (loading) return <Loading />;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <div className="page">
      <h1 className="page-title">검색 결과</h1>
      <p className="search-caption">"{keyword}" 검색 결과</p>
      {results.length === 0 ? (
        <EmptyState message="검색 결과가 없습니다." />
      ) : (
        <div className="card-list">
          {results.map((item) => (
            <PolicyCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
