import { Link } from "react-router-dom";

export default function PolicyCard({ item }) {
  return (
    <Link className="policy-card" to={`/detail/${item.id}`}>
      <div className="card-top">
        <span className="source">{item.source || "출처 미입력"}</span>
        <span className="category-chip">{item.category}</span>
      </div>
      <div className="title-row">
        <h3>{item.title}</h3>
        {item.importance === "상" && <span className="hot-badge">중요</span>}
      </div>
      {item.summary && <p className="summary">{item.summary}</p>}
      {item.bullets?.length > 0 && (
        <ul className="bullet-preview">
          {item.bullets.slice(0, 2).map((bullet, index) => (
            <li key={`${item.id}-bullet-${index}`}>{bullet}</li>
          ))}
        </ul>
      )}
      {item.tags?.length > 0 && (
        <div className="tags">
          {item.tags.slice(0, 4).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
