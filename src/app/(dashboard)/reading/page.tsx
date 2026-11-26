"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { finishReading, getBookById, startReading } from "@/redux/api";
import { Book, BookWithProgress } from "@/types";
import Loader from "@/components/Loader/Loader";
import styles from "./page.module.css";

function hasActiveReadingSession(bookData: BookWithProgress | null): boolean {
  if (!bookData) return false;

  if (Array.isArray(bookData.progress) && bookData.progress.length > 0) {
    const lastSession = bookData.progress[bookData.progress.length - 1];
    if (
      lastSession &&
      lastSession.finishPage === undefined &&
      !lastSession.finishReading &&
      lastSession.status !== "inactive"
    ) {
      return true;
    }
  }

  return bookData.status === "in-progress";
}

export default function ReadingPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const syncBookState = useCallback((bookData: BookWithProgress | null) => {
    setBook(bookData);
    setIsReading(hasActiveReadingSession(bookData));
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        if (!bookId) {
          syncBookState(null);
          return;
        }

        const data = await getBookById(bookId);
        syncBookState(data.book || data);
      } catch (error) {
        console.error("Failed to fetch book for reading:", error);
        syncBookState(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, syncBookState]);

  const handleReadingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetBookId = book?._id || book?.id || bookId;
    const parsedPage = Number(pageNumber);

    if (!targetBookId || isSubmitting || !parsedPage || parsedPage < 1) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (!isReading) {
        await startReading({ id: targetBookId, page: parsedPage });
      } else {
        await finishReading({ id: targetBookId, page: parsedPage });
      }

      const refreshedData = await getBookById(targetBookId);
      syncBookState(refreshedData.book || refreshedData);
      setPageNumber("");
    } catch (error) {
      console.error("Reading action failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <form onSubmit={handleReadingSubmit} className={styles.formWrapper}>
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
            Here you will see when and how much you read.
            <br /> To record, click on the red button above.
          </p>

          <div className={styles.starWrapper}>
            <img
              src="/images/star.png"
              alt="Star"
              width={50}
              height={70}
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
