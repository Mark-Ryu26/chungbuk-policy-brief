import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { CATEGORIES, SECTION_TYPES } from "../lib/constants";
import { deleteItem, getAllItemsForAdmin } from "../lib/policyApi";

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sectionType, setSectionType] = useState("");
  const [publishState, setPublishState] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    const loadedItems = await getAllItemsForAdmin();
    setItems(loadedItems);
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const query = keyword.trim().toLocaleLowerCase("ko-KR");
    return items.filter((item) => {
      const text = [item.title, item.source, item.summary].join(" ").toLocaleLowerCase("ko-KR");
      const matchesKeyword = !query || text.includes(query);
      const matchesCategory = !category || item.category === category;
      const matchesSection = !sectionType || item.sectionType === sectionType;
      const matchesPublish =
        !publishState ||
        (publishState === "published" && item.isPublished) ||
        (publishState === "hidden" && !item.isPublished);
      return matchesKeyword && matchesCategory && matchesSection && matchesPublish;
    });
  }, [category, items, keyword, publishState, sectionType]);

  async function handleDelete(item) {
    if (!confirm(`'${item.title}' 콘텐츠를 삭제할까요?`)) return;
    await deleteItem(item.id);
    await loadItems();
  }

  if (loading) return <Loading />;

  return (
    <main className="admin-page">
      <AdminNav />
      <div className="admin-title-row">
        <h1>콘텐츠 목록 관리</h1>
        <Link className="primary-button small" to="/admin/items/new">신규 등록</Link>
      </div>

      <section className="filter-panel">
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="제목, 출처, 요약 검색" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">카테고리 전체</option>
          {CATEGORIES.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select value={sectionType} onChange={(e) => setSectionType(e.target.value)}>
          <option value="">섹션유형 전체</option>
          {SECTION_TYPES.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select value={publishState} onChange={(e) => setPublishState(e.target.value)}>
          <option value="">공개상태 전체</option>
          <option value="published">공개</option>
          <option value="hidden">비공개</option>
        </select>
      </section>

      {filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="admin-list">
          {filteredItems.map((item) => (
            <div className="admin-row item-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.category} · {item.sectionType} · {item.isPublished ? "공개" : "비공개"}</span>
                <span>작성일: {item.createdAt ? new Date(item.createdAt).toLocaleDateString("ko-KR") : "-"}</span>
              </div>
              <div className="row-actions">
                <Link to={`/admin/items/${item.id}/edit`}>수정</Link>
                <button type="button" onClick={() => handleDelete(item)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
