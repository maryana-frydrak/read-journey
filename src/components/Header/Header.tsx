"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthToken, getCurrentUser } from "@/redux/api";
import { useEffect, useState } from "react";
import LogoutModal from "../Modals/LogoutModal/LogoutModal";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();

        if (data.name) {
          setUserName(data.name);
        } else if (data.user?.name) {
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "U";

  const handleOpenModal = () => {
    setIsLogoutModalOpen(true);
  };

  const router = useRouter();

  const handleConfirmLogout = () => {
    try {
      clearAuthToken();

      setIsLogoutModalOpen(false);

      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/recommended" className={styles.logo}>
          <svg width="42" height="17">
            <use href="/icons.svg#icon-logo" />
          </svg>
          <span className={styles.logoText}>READ JOURNEY</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/recommended"
            className={`${styles.navLink} ${
              pathname === "/recommended" ? styles.active : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/library"
            className={`${styles.navLink} ${
              pathname === "/library" ? styles.active : ""
            }`}
          >
            My library
          </Link>
        </nav>

        <div className={styles.userBlock}>
          <div className={styles.userBar}>
            <div className={styles.avatar}>{avatarLetter}</div>
            <span className={styles.userName}>{userName}</span>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className={styles.logoutBtn}
          >
            Log out
          </button>

          <LogoutModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onConfirm={handleConfirmLogout}
          />
        </div>
      </div>
    </header>
  );
}
