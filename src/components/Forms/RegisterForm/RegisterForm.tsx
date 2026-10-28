"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", formData);
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo}>
          <svg width="42" height="17">
            <use href="/icons.svg#icon-logo" />
          </svg>
          <span className={styles.logoText}>READ JOURNEY</span>
        </div>

        <h1 className={styles.title}>
          Expand your <br />
          mind, reading <br />
          <span className={styles.titleSecondary}>a book</span>
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.label}>Name:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ilona Ratushniak"
              required
              className={styles.inputText}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.label}>Mail:</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className={styles.inputText}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.label}>Password:</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Yourpasswordhere"
              required
              className={`${styles.inputText} ${styles.inputPassword}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <use
                  href={`/icons.svg#${showPassword ? "icon-open-eye" : "icon-close-eye"}`}
                />
              </svg>
            </button>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>
              Registration
            </button>
            <Link href="/login" className={styles.link}>
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
