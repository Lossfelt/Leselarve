const SORT_OPTIONS = [
  { key: "numberInLine", label: "Nyeste" },
  { key: "title", label: "Tittel" },
  { key: "author", label: "Forfatter" },
  { key: "published", label: "Publisert" },
  { key: "pages", label: "Sider" }
];

export default function Hero({
  members,
  activeFilter,
  onFilterChange,
  sortBy,
  desc,
  onSortChange,
  onToggleDirection
}) {
  return (
    <section className="app-toolbar">
      <div className="chip-row" role="group" aria-label="Filtrer">
        <button
          className={`chip${activeFilter === "Alle" ? " active" : ""}`}
          onClick={() => onFilterChange("Alle")}
        >
          Alle
        </button>
        {members.map((member) => (
          <button
            key={member}
            className={`chip${activeFilter === member ? " active" : ""}`}
            onClick={() => onFilterChange(member)}
          >
            {member}
          </button>
        ))}
      </div>
      <div className="sort-row">
        <label className="sort-label" htmlFor="sort-select">
          Sortér:
        </label>
        <select
          id="sort-select"
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          className="sort-direction"
          onClick={onToggleDirection}
          aria-label={desc ? "Synkende, klikk for stigende" : "Stigende, klikk for synkende"}
        >
          <i className={desc ? "fas fa-arrow-down" : "fas fa-arrow-up"} />
        </button>
      </div>
    </section>
  );
}
