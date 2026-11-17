"use client";

import { useState, useEffect, useRef } from "react";
import {
  addBook,
  getOwnBooks,
  getRecommendedBooks,
  removeUserBook,
} from "@/redux/api";
import { Book } from "@/types";
import styles from "./page.module.css";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookTitle, setBookTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const filteredBooks = books.filter((book: Book) => {
    if (statusFilter === "unread") return book.status === "unread";
    if (statusFilter === "in-progress") return book.status === "in-progress";
    if (statusFilter === "done") return book.status === "done";
    return true;
  });

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !author || !totalPages) return;

    try {
      const newBook = {
        title: bookTitle,
        author: author,
        totalPages: Number(totalPages),
      };

      const data = await addBook(newBook);
      setBooks((prev) => [...prev, data.book || data]);

      setBookTitle("");
      setAuthor("");
      setTotalPages("");
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

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
        <form onSubmit={handleCreateBook} className={styles.filtersWrapper}>
          <p className={styles.sectionTitle}>Create your library:</p>

          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <span className={styles.label}>Book title:</span>
              <input
                type="text"
                placeholder=""
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
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
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
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

          <div className={styles.selectWrapper} ref={dropdownRef}>
            <button
              type="button"
              className={styles.selectTrigger}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span>
                {statusFilter === "unread"
                  ? "Unread"
                  : statusFilter === "in-progress"
                    ? "In progress"
                    : statusFilter === "done"
                      ? "Done"
                      : "All books"}
              </span>
              <svg
                className={`${styles.selectIcon} ${isOpen ? styles.selectOpen : ""}`}
                width="16"
                height="16"
              >
                <use href="/icons.svg#icon-chevron-down" />
              </svg>
            </button>

            {isOpen && (
              <ul className={styles.dropdownMenu}>
                {[
                  { value: "unread", label: "Unread" },
                  { value: "in-progress", label: "In progress" },
                  { value: "done", label: "Done" },
                  { value: "all", label: "All books" },
                ].map((option) => (
                  <li
                    key={option.value}
                    className={`${styles.dropdownItem} ${
                      statusFilter === option.value ? styles.activeItem : ""
                    }`}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
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
                    src={book.imageUrl || "/images/unsplash.jpg"}
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
                    src="/images/books.jpg"
                    alt="Books"
                    className={styles.emptyImage}
                  />
                </div>
                <p className={styles.noBooks}>
                  To start training, add
                  <span className={styles.accentText}>
                    {" "}
                    some of your books{" "}
                  </span>
                  or <br /> from the recommended ones
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
