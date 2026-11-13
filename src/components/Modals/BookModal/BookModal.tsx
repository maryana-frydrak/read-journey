"use client";

import { useEffect } from "react";
import styles from "./BookModal.module.css";
import { Book } from "@/types";
import Loader from "@/components/Loader/Loader";

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onAddToLibrary: (bookId: string) => void;
  isAdding?: boolean;
}

export default function BookModal({
  book,
  onClose,
  onAddToLibrary,
  isAdding = false,
}: BookModalProps) {
  useEffect(() => {
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
  }, [onClose]);

  if (!book) return null;

  const formatTitle = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
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
          {isAdding ? (
            <Loader />
          ) : (
            <>
              <img
                src={book.imageUrl}
                alt={book.title}
                className={styles.bookImage}
              />
              <h3 className={styles.bookTitle}>{formatTitle(book.title)}</h3>
              <p className={styles.bookAuthor}>{book.author}</p>
              <p className={styles.bookPages}>{book.totalPages} pages</p>

              <button
                type="button"
                className={styles.addBtn}
                onClick={() => onAddToLibrary(book._id!)}
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Add to library"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
