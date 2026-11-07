import { signoutUser } from "@/redux/api";
import styles from "./LogoutModal.module.css";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await signoutUser();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      onClose();
      window.location.href = "/login";
    }
  };

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
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
