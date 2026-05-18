import { lazy, Suspense, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Bookshelf from "./components/Bookshelf.jsx";
import BookDetail from "./components/BookDetail.jsx";

const Statistics = lazy(() => import("./components/Statistics.jsx"));

function compare(key, order = "asc") {
  return (a, b) => {
    if (!Object.hasOwn(a, key) || !Object.hasOwn(b, key)) return 0;
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) comparison = 1;
    else if (varA < varB) comparison = -1;
    return order === "desc" ? -comparison : comparison;
  };
}

export default function Presentation({ books }) {
  const [view, setView] = useState("Bøker");
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [sortBy, setSortBy] = useState("numberInLine");
  const [desc, setDesc] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

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
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    return [...result].sort(compare(sortBy, desc ? "desc" : "asc"));
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
          <BookDetail
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
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
