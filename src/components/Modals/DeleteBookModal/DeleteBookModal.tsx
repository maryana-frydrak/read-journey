"use client";

import styles from "./DeleteBookModal.module.css";

interface DeleteBookModalProps {
  isOpen: boolean;
  bookTitle?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function formatModalTitle(title?: string, maxLength = 45) {
  if (!title) return "this book";
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return `"${trimmed}"`;
  return `"${trimmed.slice(0, maxLength).trimEnd()}..."`;
}

export default function DeleteBookModal({
  isOpen,
  bookTitle,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteBookModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close modal"
        >
          <svg width="20" height="20">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>

        <h3 className={styles.title}>
          Are you sure you want to delete {formatModalTitle(bookTitle)}?
        </h3>

        <div className={styles.buttonsGroup}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
