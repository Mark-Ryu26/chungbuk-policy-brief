import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import Loading from "../components/Loading";
import { CATEGORIES, IMPORTANCE_LEVELS, SECTION_TYPES } from "../lib/constants";
import { createItem, getItemById, updateItem } from "../lib/policyApi";

const EMPTY_ITEM = {
  title: "",
  source: "",
  category: "중앙정부",
  sectionType: "일반",
  date: "",
  weekLabel: "",
  monthLabel: "",
  summary: "",
  body: "",
  bullets: [""],
  implication: "",
  tagsText: "",
  originalUrl: "",
  importance: "중",
  isPublished: true,
};

export default function AdminItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_ITEM);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getItemById(id)
      .then((item) => {
        setForm({
          ...item,
          bullets: item.bullets.length ? item.bullets : [""],
          tagsText: item.tags.join(", "),
        });
      })
      .catch(() => setError("기존 콘텐츠를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateBullet(index, value) {
    const nextBullets = [...form.bullets];
    nextBullets[index] = value;
    updateField("bullets", nextBullets);
  }

  function addBullet() {
    updateField("bullets", [...form.bullets, ""]);
  }

  function removeBullet(index) {
    const nextBullets = form.bullets.filter((_, currentIndex) => currentIndex !== index);
    updateField("bullets", nextBullets.length ? nextBullets : [""]);
  }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const itemToSave = {
        ...form,
        bullets: form.bullets.map((bullet) => bullet.trim()).filter(Boolean),
        tags: form.tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      delete itemToSave.tagsText;
      if (id) {
        await updateItem(id, itemToSave);
      } else {
        await createItem(itemToSave);
      }
      navigate("/admin/items");
    } catch (err) {
      setError(err.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <main className="admin-page">
      <AdminNav />
      <h1>{id ? "콘텐츠 수정" : "콘텐츠 신규 등록"}</h1>
      <form className="admin-form" onSubmit={saveItem}>
        <label>제목<input value={form.title} onChange={(e) => updateField("title", e.target.value)} required /></label>
        <label>출처 또는 기관명<input value={form.source} onChange={(e) => updateField("source", e.target.value)} /></label>
        <label>카테고리<select value={form.category} onChange={(e) => updateField("category", e.target.value)}>{CATEGORIES.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>섹션유형<select value={form.sectionType} onChange={(e) => updateField("sectionType", e.target.value)}>{SECTION_TYPES.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>발표일<input value={form.date} onChange={(e) => updateField("date", e.target.value)} placeholder="2026-05-07 또는 2026년 5월 7일" /></label>
        <label>주차 표시<input value={form.weekLabel} onChange={(e) => updateField("weekLabel", e.target.value)} placeholder="2026년 5월 2주" /></label>
        <label>월 표시<input value={form.monthLabel} onChange={(e) => updateField("monthLabel", e.target.value)} placeholder="2026년 5월" /></label>
        <label>한 줄 요약<textarea value={form.summary} onChange={(e) => updateField("summary", e.target.value)} rows="3" /></label>

        <fieldset className="bullet-fieldset">
          <legend>핵심 내용</legend>
          {form.bullets.map((bullet, index) => (
            <div className="bullet-input-row" key={index}>
              <input value={bullet} onChange={(e) => updateBullet(index, e.target.value)} placeholder="핵심 내용을 입력하세요" />
              <button className="icon-button danger" type="button" onClick={() => removeBullet(index)} aria-label="핵심내용 삭제">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button className="secondary-button" type="button" onClick={addBullet}>
            <Plus size={18} /> 핵심내용 추가
          </button>
        </fieldset>

        <label>상세 본문<textarea value={form.body} onChange={(e) => updateField("body", e.target.value)} rows="7" /></label>
        <label>충북 시사점<textarea value={form.implication} onChange={(e) => updateField("implication", e.target.value)} rows="4" /></label>
        <label>태그<input value={form.tagsText} onChange={(e) => updateField("tagsText", e.target.value)} placeholder="청년, 일자리, 보건의료" /></label>
        <label>원문 링크<input value={form.originalUrl} onChange={(e) => updateField("originalUrl", e.target.value)} placeholder="https://..." /></label>
        <label>중요도<select value={form.importance} onChange={(e) => updateField("importance", e.target.value)}>{IMPORTANCE_LEVELS.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="checkbox-label"><input type="checkbox" checked={form.isPublished} onChange={(e) => updateField("isPublished", e.target.checked)} /> 공개 상태로 표시</label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full" type="submit" disabled={saving}>{saving ? "저장 중입니다." : "저장"}</button>
      </form>
    </main>
  );
}
