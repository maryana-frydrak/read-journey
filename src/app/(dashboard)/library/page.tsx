"use client";

import { useState, useEffect } from "react";
import { getOwnBooks } from "@/redux/api";
import { Book } from "@/types";
import styles from "./page.module.css";
import Loader from "@/components/Loader/Loader";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwnBooks = async () => {
      try {
        setIsLoading(true);
        const data = await getOwnBooks();
        setBooks(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Failed to fetch own books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnBooks();
  }, []);

  function formatTitle(text: string) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  return (
    <div className={styles.container}>
      {/* Ліва панель або форма додавання книги */}
      <aside className={styles.sidebar}>
        <div className={styles.filtersWrapper}>
          <p className={styles.sectionTitle}>Add book:</p>
          {/* Тут згодом підключимо компонент AddBookForm */}
        </div>
      </aside>

      {/* Права основна частина (список власних книг) */}
      <main className={styles.content}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>My Library</h2>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className={styles.booksGrid}>
            {books.length > 0 ? (
              books.map((book: Book) => (
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
                </div>
              ))
            ) : (
              <p className={styles.noBooks}>Your library is empty</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
