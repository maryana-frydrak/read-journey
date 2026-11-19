"use client";

import { useEffect } from "react";
import styles from "./AddBookSuccessModal.module.css";

interface AddBookSuccessModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  title = "Good job",
  message = "Your book is now in the library! The joy knows no bounds and now you can start your training",
  duration = 3000,
  onClose,
}: AddBookSuccessModalProps) {
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

    if (!isOpen) return;

    const timerId = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      window.clearTimeout(timerId);
    };
  }, [isOpen, duration, onClose]);

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
            <img
              src="/images/thumb-up.png"
              alt="Thumbs up"
              width={68}
              height={70}
              className={styles.icon}
            />
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>
            Your book is now in{" "}
            <span className={styles.highlight}>the library!</span> The joy knows
            no bounds and now you can <br /> start your training
          </p>
        </div>
      </div>
    </div>
  );
}
