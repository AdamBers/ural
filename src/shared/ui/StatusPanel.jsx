import { Search, LoaderCircle, AlertCircle } from "lucide-react";
function StatusPanel({ kind = "empty", title, children, onRetry }) {
  const Icon =
    kind === "loading" ? LoaderCircle : kind === "error" ? AlertCircle : Search;
  return (
    <div
      className={`status-panel ${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      <span className="status-icon">
        <Icon size={25} className={kind === "loading" ? "spin" : ""} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {onRetry && (
        <button className="secondary-button" onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  );
}
export default StatusPanel;
