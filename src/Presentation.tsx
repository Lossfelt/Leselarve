import { lazy, Suspense, useMemo, useState } from "react";
import Header from "./components/Header.tsx";
import Hero from "./components/Hero.tsx";
import Bookshelf from "./components/Bookshelf.tsx";
import BookDetail from "./components/BookDetail.tsx";
import type { Book, SortKey, View } from "./types.ts";

const Statistics = lazy(() => import("./components/Statistics.tsx"));

function compare<T extends Book>(key: keyof T, order: "asc" | "desc" = "asc") {
  return (a: T, b: T): number => {
    if (!Object.hasOwn(a, key) || !Object.hasOwn(b, key)) return 0;
    const valA = a[key];
    const valB = b[key];
    const cmpA = typeof valA === "string" ? valA.toUpperCase() : valA;
    const cmpB = typeof valB === "string" ? valB.toUpperCase() : valB;
    let comparison = 0;
    if (cmpA > cmpB) comparison = 1;
    else if (cmpA < cmpB) comparison = -1;
    return order === "desc" ? -comparison : comparison;
  };
}

type Props = {
  books: Book[];
};

export default function Presentation({ books }: Props) {
  const [view, setView] = useState<View>("Bøker");
  const [activeFilter, setActiveFilter] = useState<string>("Alle");
  const [sortBy, setSortBy] = useState<SortKey>("numberInLine");
  const [desc, setDesc] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const members = useMemo(
    () => [...new Set(books.map((b) => b.chosenBy))].sort(),
    [books]
  );

  const visibleBooks = useMemo(() => {
    let result = books;
    if (activeFilter !== "Alle") {
      result = result.filter((b) => b.chosenBy === activeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    return [...result].sort(compare<Book>(sortBy, desc ? "desc" : "asc"));
  }, [books, activeFilter, sortBy, desc, search]);

  return (
    <div className="app">
      <Header
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
      />
      {view === "Bøker" ? (
        <>
          <Hero
            members={members}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortBy={sortBy}
            desc={desc}
            onSortChange={setSortBy}
            onToggleDirection={() => setDesc((v) => !v)}
          />
          <main className="app-main">
            <Bookshelf books={visibleBooks} onBookSelect={setSelectedBook} />
          </main>
          <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
        </>
      ) : (
        <main className="app-main">
          <Suspense fallback={<div className="stats-loading">Laster statistikk …</div>}>
            <Statistics books={books} />
          </Suspense>
        </main>
      )}
    </div>
  );
}
