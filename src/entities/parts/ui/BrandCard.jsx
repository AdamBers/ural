import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import styles from "./BrandCard.module.scss";

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
      {selected ? (
        <CheckIcon weight="regular" size={19} />
      ) : (
        <ArrowUpRightIcon weight="regular" size={18} />
      )}
    </button>
  );
}
export default BrandCard;
