"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import styles from "./BookDetailsModal.module.css";

interface BookDetailsModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookDetailsModal({
  book,
  onClose,
}: BookDetailsModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!book) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [book, onClose]);

  if (!book) return null;

  const pagesCount = book.totalPages ?? book.pages;
  const bookId = book._id || book.id;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStartReading = () => {
    onClose();
    if (bookId) {
      router.push(`/reading?bookId=${encodeURIComponent(bookId)}`);
    } else {
      router.push("/reading");
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="22" height="22">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>

        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            <img
              src={book.imageUrl || "/images/unsplash.jpg"}
              alt={book.title}
              className={styles.bookImage}
            />
          </div>

          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>

          {typeof pagesCount === "number" && (
            <p className={styles.pages}>{pagesCount} pages</p>
          )}

          <button
            type="button"
            className={styles.startBtn}
            onClick={handleStartReading}
          >
            Start reading
          </button>
        </div>
      </div>
    </div>
  );
}
