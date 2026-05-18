export default function BookOnShelf({ book, onClick }) {
  return (
    <button className="shelf-cell" onClick={() => onClick(book)}>
      <span className="book-on-shelf">
        <img
          className="book-cover"
          src={book.picture}
          alt={`Forsiden av ${book.title} av ${book.author}`}
          loading="lazy"
        />
      </span>
    </button>
  );
}
