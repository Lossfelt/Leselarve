import { useEffect, useRef } from "react";
import type { Book } from "../types.ts";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

type Props = {
  book: Book | null;
  onClose: () => void;
};

export default function BookDetail({ book, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // On open: remember who opened us, move focus into the modal, lock body scroll.
  // On close: restore focus and scroll.
  useEffect(() => {
    if (!book) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (focusables && focusables.length > 0) {
      focusables[0].focus();
    } else {
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus.current && typeof previousFocus.current.focus === "function") {
        previousFocus.current.focus();
      }
    };
  }, [book]);

  // Esc to close + Tab focus-trap inside the modal
  useEffect(() => {
    if (!book) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables || focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !modalRef.current?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !modalRef.current?.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [book, onClose]);

  if (!book) return null;

  const sum = book.terningkastene.reduce((s, t) => s + t.terningkast, 0);
  const snitt = Math.round((sum / book.terningkastene.length) * 10) / 10;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
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
          <h2 id="modal-title" className="modal-title">
            {book.title}
          </h2>
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
