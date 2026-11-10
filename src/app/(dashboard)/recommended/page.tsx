"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecommendedBooks } from "@/redux/api";
import { Book } from "@/types";
import styles from "./page.module.css";

export default function RecommendedPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getRecommendedBooks();
        setBooks(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Failed to fetch recommended books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут згодом додамо логіку фільтрації або запиту з параметрами
    console.log("Filter by title:", titleFilter, "author:", authorFilter);
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
            <button className={styles.arrowBtn} disabled>
              &lt;
            </button>
            <button className={styles.arrowBtn}>&gt;</button>
          </div>
        </div>

        <div className={styles.booksGrid}>
          {isLoading ? (
            <p className={styles.noBooks}>Loading...</p>
          ) : books.length > 0 ? (
            books.map((book: Book) => (
              <div key={book._id || book.id} className={styles.bookCard}>
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className={styles.bookImage}
                />
                <h4 className={styles.bookTitle}>{book.title}</h4>
                <p className={styles.bookAuthor}>{book.author}</p>
              </div>
            ))
          ) : (
            <p className={styles.noBooks}>Loading books...</p>
          )}
        </div>
      </main>
    </div>
  );
}
