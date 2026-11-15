"use client";

import { useState, useEffect } from "react";
import { getOwnBooks, getRecommendedBooks, removeUserBook } from "@/redux/api";
import { Book } from "@/types";
import styles from "./page.module.css";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ownData, recData] = await Promise.all([
          getOwnBooks(),
          getRecommendedBooks?.() || Promise.resolve([]),
        ]);
        setBooks(Array.isArray(ownData) ? ownData : ownData.results || []);
        setRecommended(
          Array.isArray(recData)
            ? recData.slice(0, 3)
            : recData.results?.slice(0, 3) || [],
        );
      } catch (error) {
        console.error("Failed to fetch library data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  function formatTitle(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const filteredBooks = books.filter((book: any) => {
    if (titleFilter === "unread") return book.status === "unread";
    if (titleFilter === "in-progress") return book.status === "in-progress";
    if (titleFilter === "done") return book.status === "done";
    return true;
  });

  const handleDelete = async (bookId: string) => {
    try {
      await removeUserBook(bookId);

      setBooks((prevBooks) =>
        prevBooks.filter((b) => (b._id || b.id) !== bookId),
      );
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <form className={styles.filtersWrapper}>
          <p className={styles.sectionTitle}>Create your library:</p>

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

          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <span className={styles.label}>Number of pages:</span>
              <input
                type="text"
                placeholder=""
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className={styles.addBookBtn}>
            Add book
          </button>
        </form>

        <div className={styles.recommendedWrapper}>
          <h4 className={styles.recTitle}>Recommended books</h4>

          <div className={styles.recMiniGrid}>
            {recommended.map((book: Book) => (
              <div key={book._id || book.id} className={styles.recBookCard}>
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className={styles.recMiniImage}
                />
                <h4 className={styles.bookMiniTitle}>
                  {formatTitle(book.title)}
                </h4>
                <p className={styles.bookMiniAuthor}>{book.author}</p>
              </div>
            ))}
          </div>

          <Link href="/recommended" className={styles.recommendedLink}>
            Home
            <svg className={styles.iconUpRight} width="24" height="24">
              <use href="/icons.svg#icon-arrow-right" />
            </svg>
          </Link>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.headerTop}>
          <h2 className={styles.libraryTitle}>My library</h2>

          <div className={styles.selectWrapper}>
            <select
              className={styles.filterSelect}
              value={titleFilter}
              onChange={(e) => {
                setTitleFilter(e.target.value);
                setIsOpen(false);
              }}
              onClick={() => setIsOpen((prev) => !prev)}
              onBlur={() => setIsOpen(false)}
            >
              <option value="unread">Unread</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
              <option value="all">All books</option>
            </select>
            <svg
              className={`${styles.selectIcon} ${isOpen ? styles.iconOpen : ""}`}
              width="16"
              height="16"
            >
              <use href="/icons.svg#icon-chevron-down" />
            </svg>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className={styles.booksGrid}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book: Book) => (
                <div key={book._id || book.id} className={styles.bookCard}>
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className={styles.bookImage}
                  />
                  <h4 className={styles.bookTitle}>
                    {formatTitle(book.title)}
                  </h4>
                  <p className={styles.bookAuthor}>{book.author}</p>

                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(book._id || book.id!);
                    }}
                    aria-label="Delete book"
                  >
                    <svg width="28" height="28">
                      <use href="/icons.svg#icon-trash" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyContainer}>
                <div className={styles.emptyIconWrapper}>
                  <img
                    src="/images/books-illustration.png"
                    alt="Books"
                    className={styles.emptyImage}
                  />
                </div>
                <p className={styles.noBooks}>
                  To start training, add
                  <span className={styles.accentText}>some of your books</span>
                  or from the recommended ones
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
