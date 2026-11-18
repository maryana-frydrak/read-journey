"use client";

import { useEffect } from "react";
import styles from "./AddBookSuccessModal.module.css";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Good job",
  message = "Your book is now in the library! The joy knows no bounds and now you can start your training",
}: SuccessModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
          <div className={styles.iconWrapper}>
            {/* Тут можна підставити іконку великого пальця вгору або через емодзі / спрайт */}
            <span role="img" aria-label="Thumbs up" className={styles.emoji}>
              👍
            </span>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
    </div>
  );
}
