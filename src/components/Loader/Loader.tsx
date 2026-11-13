import { FadeLoader } from "react-spinners";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.backdrop}>
      <FadeLoader color="#f9f9f9" />
    </div>
  );
}
