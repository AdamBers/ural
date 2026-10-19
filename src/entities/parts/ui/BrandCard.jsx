import styles from "./BrandCard.module.scss";
import { ArrowUpRight, Check } from "lucide-react";
function BrandCard({ item, selected, onSelect }) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={() => onSelect(item.brand)}
      aria-pressed={selected}
    >
      <span className={styles.copy}>
        <strong>{item.brand}</strong>
        <span>{item.name || "Автозапчасти"}</span>
      </span>
      {selected ? <Check size={19} /> : <ArrowUpRight size={18} />}
    </button>
  );
}
export default BrandCard;
