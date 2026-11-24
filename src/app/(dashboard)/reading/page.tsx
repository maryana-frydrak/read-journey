"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getBookById, getOwnBooks } from "@/redux/api";
import { Book } from "@/types";
import Loader from "@/components/Loader/Loader";
import styles from "./page.module.css";

export default function ReadingPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState("");
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        if (bookId) {
          const data = await getBookById(bookId);
          setBook(data.book || data);
        } else {
          const ownData = await getOwnBooks();
          const list = Array.isArray(ownData) ? ownData : ownData.results || [];
          setBook(list[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch book for reading:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleToggleReading = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReading((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <form onSubmit={handleToggleReading} className={styles.formWrapper}>
          <p className={styles.sectionTitle}>
            {isReading ? "Stop page:" : "Start page:"}
          </p>

          <div className={styles.inputContainer}>
            <span className={styles.label}>Page number:</span>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isReading ? "To stop" : "To start"}
          </button>
        </form>

        <div className={styles.progressSection}>
          <h3 className={styles.progressTitle}>Progress</h3>
          <p className={styles.progressText}>
            Here you will see when and how much you read. To record, click on
            the red button above.
          </p>

          <div className={styles.starWrapper}>
            <img
              src="/images/star.png"
              alt="Star"
              width={50}
              height={50}
              className={styles.starIcon}
            />
          </div>
        </div>
      </aside>

      <main className={styles.content}>
        <h2 className={styles.pageTitle}>My reading</h2>

        {isLoading ? (
          <Loader />
        ) : book ? (
          <div className={styles.bookWrapper}>
            <div className={styles.imageWrapper}>
              <img
                src={book.imageUrl || "/images/unsplash.jpg"}
                alt={book.title}
                className={styles.bookImage}
              />
            </div>

            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.author}</p>

            <button
              type="button"
              className={`${styles.recordBtn} ${isReading ? styles.recordActive : ""}`}
              onClick={() => setIsReading((prev) => !prev)}
              aria-label={isReading ? "Stop reading" : "Start reading"}
            >
              <span className={styles.recordInner} />
            </button>
          </div>
        ) : (
          <p className={styles.emptyText}>No book selected for reading</p>
        )}
      </main>
    </div>
  );
}
