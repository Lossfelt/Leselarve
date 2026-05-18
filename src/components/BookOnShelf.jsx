export default function BookOnShelf({ book, onClick }) {
  return (
    <button className="shelf-cell" onClick={() => onClick(book)}>
      <span className="shelf-glow" aria-hidden="true" />
      <span className="book-on-shelf">
        <img
          className="book-cover"
          src={book.picture}
          alt={`Forsiden av ${book.title} av ${book.author}`}
          loading="lazy"
        />
      </span>
      <span className="shelf-plank" aria-hidden="true" />
    </button>
  );
}
