import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { getItemById } from "../lib/policyApi";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getItemById(id)
      .then(setItem)
      .catch(() => setError("정책동향을 찾을 수 없습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <article className="page detail-page">
      <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> 뒤로가기
      </button>
      <div className="detail-meta">
        <span>{item.source}</span>
        <span>{item.category}</span>
        <span>중요도 {item.importance}</span>
      </div>
      <h1 className="detail-title">{item.title}</h1>
      {item.date && <p className="date-text">발표일: {item.date}</p>}
      {item.summary && <p className="detail-summary">{item.summary}</p>}

      <section>
        <h2>핵심 내용</h2>
        <ul className="detail-bullets">
          {item.bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </section>

      {item.body && (
        <section>
          <h2>상세 본문</h2>
          <p className="pre-line">{item.body}</p>
        </section>
      )}

      {item.implication && (
        <section className="implication-box">
          <h2>충북 시사점</h2>
          <p>{item.implication}</p>
        </section>
      )}

      {item.tags?.length > 0 && (
        <div className="tags large-tags">
          {item.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}

      {item.originalUrl && (
        <Link className="primary-button" to={item.originalUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={18} /> 원문 보기
        </Link>
      )}
    </article>
  );
}
