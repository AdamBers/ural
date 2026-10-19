import styles from "./StatusPanel.module.scss";
import { Search, LoaderCircle, AlertCircle } from "lucide-react";
function StatusPanel({ kind = "empty", title, children, onRetry }) {
  const Icon =
    kind === "loading" ? LoaderCircle : kind === "error" ? AlertCircle : Search;
  return (
    <div
      className={`${styles.panel} ${kind === "error" ? styles.error : ""}`}
      role={kind === "error" ? "alert" : "status"}
    >
      <span className={styles.icon}>
        <Icon size={25} className={kind === "loading" ? styles.spin : ""} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  );
}
export default StatusPanel;
