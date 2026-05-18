import type { Book } from "../types.ts";

type Props = {
  book: Book;
  onClick: (book: Book) => void;
};

export default function BookOnShelf({ book, onClick }: Props) {
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
