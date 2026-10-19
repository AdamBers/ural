import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/csr/CircleNotch";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import styles from "./StatusPanel.module.scss";

function StatusPanel({ kind = "empty", title, children, onRetry }) {
  const Icon =
    kind === "loading"
      ? CircleNotchIcon
      : kind === "error"
        ? WarningCircleIcon
        : MagnifyingGlassIcon;
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
