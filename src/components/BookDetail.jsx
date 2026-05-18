import { useEffect } from "react";

export default function BookDetail({ book, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!book) return null;

  const sum = book.terningkastene.reduce((s, t) => s + t.terningkast, 0);
  const snitt = Math.round((sum / book.terningkastene.length) * 10) / 10;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Lukk">
          ×
        </button>
        <div className="modal-cover-wrap">
          <img
            className="modal-cover"
            src={book.picture}
            alt={`Forsiden av ${book.title}`}
          />
        </div>
        <div className="modal-body">
          <h2 id="modal-title" className="modal-title">{book.title}</h2>
          <p className="modal-author">{book.author}</p>
          <dl className="modal-facts">
            <div>
              <dt>Publisert</dt>
              <dd>{book.published}</dd>
            </div>
            <div>
              <dt>Sider</dt>
              <dd>{book.pages}</dd>
            </div>
            <div>
              <dt>Valgt av</dt>
              <dd>{book.chosenBy}</dd>
            </div>
            <div>
              <dt>Land</dt>
              <dd>{book.authorNationality}</dd>
            </div>
            <div>
              <dt>Snitt</dt>
              <dd>
                <span className="dice-value">{snitt}</span>
                <span className="dice-icon"> 🎲</span>
              </dd>
            </div>
          </dl>
          <h3 className="modal-section-title">Terningkast</h3>
          <ul className="terningkast-list">
            {book.terningkastene.map((t) => (
              <li key={t.medlem}>
                <span>{t.medlem}</span>
                <span className="terningkast-value">{t.terningkast}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
