"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { addBookFromRecommend, getRecommendedBooks } from "@/redux/api";
import { Book } from "@/types";
import styles from "./page.module.css";
import BookModal from "@/components/Modals/BookModal/BookModal";
import Loader from "@/components/Loader/Loader";

export default function RecommendedPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const data = await getRecommendedBooks(page, limit);
        setBooks(Array.isArray(data) ? data : data.results || []);
        if (data.totalPages) {
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch recommended books:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [page]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут згодом додамо логіку фільтрації або запиту з параметрами
    console.log("Filter by title:", titleFilter, "author:", authorFilter);
  };

  function formatTitle(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const handleAddToLibrary = async (bookId: string) => {
    try {
      setIsAdding(true);
      await addBookFromRecommend(bookId);
      setSelectedBook(null);
      // Тут можна додати виклик тосту або відкрити попап успіху "Good job"
    } catch (error) {
      console.error("Failed to add book:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <form onSubmit={handleApplyFilters} className={styles.filtersWrapper}>
          <p className={styles.sectionTitle}>Filters:</p>

          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <span className={styles.label}>Book title:</span>
              <input
                type="text"
                placeholder=""
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <span className={styles.label}>The author:</span>
              <input
                type="text"
                placeholder=""
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className={styles.applyBtn}>
            To apply
          </button>
        </form>

        <div className={styles.workoutContainer}>
          <div className={styles.workoutBox}>
            <h3 className={styles.workoutTitle}>Start your workout</h3>
            <ul className={styles.workoutList}>
              <li className={styles.workoutItem}>
                <span className={styles.stepNumber}>1</span>
                <p className={styles.stepText}>
                  Create a personal library:{" "}
                  <span className={styles.accentText}>
                    add
                    <br /> the books you intend to read
                    <br /> to it.
                  </span>
                </p>
              </li>
              <li className={styles.workoutItem}>
                <span className={styles.stepNumber}>2</span>
                <p className={styles.stepText}>
                  Create your first workout:{" "}
                  <span className={styles.accentText}>
                    define <br />a goal, choose a period, start
                    <br /> training.
                  </span>
                </p>
              </li>
            </ul>
            <div className={styles.workoutLinkContainer}>
              <Link href="/library" className={styles.workoutLink}>
                My library
              </Link>
              <svg className={styles.iconUpRight} width="24" height="24">
                <use href="/icons.svg#icon-arrow-right" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.quoteBox}>
          <div className={styles.quoteIconWrapper}>
            <img
              src="/images/books-illustration.png"
              alt="Books"
              width="40"
              height="40"
            />
          </div>
          <p className={styles.quoteText}>
            "Books are <span className={styles.highLight}> windows </span> to
            the world, and reading is a journey into the unknown."
          </p>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Recommended</h2>

          <div className={styles.paginationArrows}>
            <button
              className={styles.arrowBtn}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || isLoading}
            >
              <svg width="20" height="20" className={styles.arrowIcon}>
                <use href="/icons.svg#icon-chevron-right" />
              </svg>
            </button>
            <button
              className={styles.arrowBtn}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages || isLoading}
            >
              <svg width="20" height="20" className={styles.arrowIcon}>
                <use href="/icons.svg#icon-chevron-left" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.booksGrid}>
          {isLoading ? (
            <Loader />
          ) : books.length > 0 ? (
            books.map((book: Book) => (
              <div
                key={book._id || book.id}
                className={styles.bookCard}
                onClick={() => setSelectedBook(book)}
              >
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className={styles.bookImage}
                />
                <h4 className={styles.bookTitle}>{formatTitle(book.title)}</h4>
                <p className={styles.bookAuthor}>{book.author}</p>
              </div>
            ))
          ) : (
            <p className={styles.noBooks}>No books found</p>
          )}
        </div>
      </main>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToLibrary={handleAddToLibrary}
          isAdding={isAdding}
        />
      )}
    </div>
  );
}
