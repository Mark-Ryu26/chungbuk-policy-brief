import { Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    const query = keyword.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  }

  return (
    <header className="app-header">
      <div className="header-row">
        <Link className="brand" to="/">충북 정책 한입브리프</Link>
        <button
          className="icon-button"
          type="button"
          aria-label="검색창 열기"
          onClick={() => setIsSearchOpen((value) => !value)}
        >
          <Search size={20} />
        </button>
      </div>
      {isSearchOpen && (
        <form className="search-bar" onSubmit={submitSearch}>
          <input
            autoFocus
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="검색어를 입력하세요"
          />
          <button type="submit">검색</button>
        </form>
      )}
    </header>
  );
}
