export default function Header({ view, onViewChange, search, onSearchChange }) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <img className="app-brand-mark" src="/Leselarve_ikon.png" alt="" />
        <span className="app-brand-name">Leselarve</span>
      </div>
      <nav className="app-nav">
        <button
          className={`app-nav-link${view === "Bøker" ? " active" : ""}`}
          onClick={() => onViewChange("Bøker")}
        >
          Bøker
        </button>
        <button
          className={`app-nav-link${view === "Statistikk" ? " active" : ""}`}
          onClick={() => onViewChange("Statistikk")}
        >
          Statistikk
        </button>
      </nav>
      <div className="app-search">
        <i className="fas fa-search" aria-hidden="true" />
        <input
          type="search"
          placeholder="Søk etter bok eller forfatter …"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Søk"
        />
      </div>
    </header>
  );
}
