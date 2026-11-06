import React from "react";
import styles from "./LogoutModal.module.css";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <svg width="20" height="20">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>
        <h3 className={styles.title}>Are you sure you want to log out?</h3>

        <div className={styles.buttonsGroup}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
