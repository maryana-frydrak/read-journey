import RegisterForm from "@/components/Forms/RegisterForm/RegisterForm";
import Image from "next/image";
import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <RegisterForm />

        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/iPhone.png.png"
              alt="Read Journey App"
              width={400}
              height={550}
              className={styles.image}
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
