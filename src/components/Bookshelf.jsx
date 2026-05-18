import BookOnShelf from "./BookOnShelf.jsx";

export default function Bookshelf({ books, onBookSelect }) {
  if (books.length === 0) {
    return (
      <div className="bookshelf">
        <div className="bookshelf-empty">Ingen bøker matcher.</div>
      </div>
    );
  }

  return (
    <div className="bookshelf">
      <div className="bookshelf-grid">
        {books.map((book) => (
          <BookOnShelf
            key={book.numberInLine}
            book={book}
            onClick={onBookSelect}
          />
        ))}
      </div>
    </div>
  );
}
