import styles from "./page.module.css";

export default function RecommendedPage() {
  return (
    <div className={styles.container}>
      {/* Ліва панель (фільтри та підказки) */}
      <aside className={styles.sidebar}>
        <div className={styles.filtersWrapper}>
          <p className={styles.sectionTitle}>Filters:</p>
          {/* Тут будуть інпути фільтрації за назвою та автором */}
        </div>
      </aside>

      {/* Права основна частина (список рекомендованих книг) */}
      <main className={styles.content}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Recommended</h2>
          {/* Тут будуть стрілочки пагінації */}
        </div>

        <div className={styles.booksGrid}>
          {/* Тут будуть картки книг */}
          <p>Books list will be here...</p>
        </div>
      </main>
    </div>
  );
}
